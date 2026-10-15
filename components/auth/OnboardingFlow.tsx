'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import {
  Info,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Sparkles,
  MapPin,
  Globe,
  Briefcase,
  Building2,
} from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';
import {
  INTEREST_TAGS,
  ORG_TYPES,
  ONBOARDING_VALIDATION_MESSAGES,
  ONBOARDING_NOTIFICATIONS_COPY,
  ONBOARDING_WELCOME_COPY,
  ONBOARDING_PROFILE_FORM_COPY,
  ONBOARDING_ORG_FORM_COPY,
} from '@/data/auth';
import type { OnboardingInfoType, OnboardingFlowProps } from '@/types/auth';
import OnboardingInfoModal from './OnboardingInfoModal';

const profileSchema = z.object({
  displayName: z.string().min(2, ONBOARDING_VALIDATION_MESSAGES.displayNameMin),
  headline: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
});

const organizationSchema = z.object({
  name: z.string().min(2, ONBOARDING_VALIDATION_MESSAGES.orgNameMin),
  type: z.string().min(1, ONBOARDING_VALIDATION_MESSAGES.orgTypeRequired),
  location: z.string().optional(),
  website: z.string().url(ONBOARDING_VALIDATION_MESSAGES.websiteInvalid).or(z.literal('')).optional(),
  description: z.string().optional(),
});

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { user, completeOnboarding } = useAuth();

  const [activeStep, setActiveStep] = useState<'welcome' | 'profile' | 'organization'>('welcome');
  const [modalType, setModalType] = useState<OnboardingInfoType | null>(null);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Profile Form State
  const [displayName, setDisplayName] = useState(user?.displayName || user?.name || '');
  const [headline, setHeadline] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Organization Form State
  const [orgName, setOrgName] = useState('');
  const [orgType, setOrgType] = useState(ORG_TYPES[0] || 'Tertiary Hospital');
  const [orgLocation, setOrgLocation] = useState('');
  const [orgWebsite, setOrgWebsite] = useState('');
  const [orgDescription, setOrgDescription] = useState('');

  const toggleInterest = (tag: string) => {
    setSelectedInterests((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Option 1: Profile Submit
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = profileSchema.safeParse({ displayName, headline, location, bio });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await completeOnboarding({
        type: 'profile',
        profile: {
          displayName,
          headline: headline || undefined,
          location: location || undefined,
          bio: bio || undefined,
          interests: selectedInterests.length > 0 ? selectedInterests : undefined,
        },
      });
      notify.success(
        ONBOARDING_NOTIFICATIONS_COPY.profileSuccessTitle,
        ONBOARDING_NOTIFICATIONS_COPY.profileSuccessDesc
      );
      onComplete();
    } catch (err: unknown) {
      notify.error(
        err instanceof Error ? err.message : ONBOARDING_NOTIFICATIONS_COPY.profileFailError
      );
    } finally {
      setLoading(false);
    }
  };

  // Option 2: Organization Submit
  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = organizationSchema.safeParse({
      name: orgName,
      type: orgType,
      location: orgLocation,
      website: orgWebsite,
      description: orgDescription,
    });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await completeOnboarding({
        type: 'organization',
        organization: {
          name: orgName,
          type: orgType,
          location: orgLocation || undefined,
          website: orgWebsite || undefined,
          description: orgDescription || undefined,
        },
      });
      notify.success(
        ONBOARDING_NOTIFICATIONS_COPY.orgSuccessTitle,
        ONBOARDING_NOTIFICATIONS_COPY.orgSuccessDesc(orgName)
      );
      onComplete();
    } catch (err: unknown) {
      notify.error(
        err instanceof Error ? err.message : ONBOARDING_NOTIFICATIONS_COPY.orgFailError
      );
    } finally {
      setLoading(false);
    }
  };

  // Option 3: Immediate Exploration
  const handleExplore = async () => {
    setLoading(true);
    try {
      await completeOnboarding({ type: 'explore' });
      notify.success(
        ONBOARDING_NOTIFICATIONS_COPY.exploreSuccessTitle,
        ONBOARDING_NOTIFICATIONS_COPY.exploreSuccessDesc
      );
      onComplete();
    } catch (err: unknown) {
      notify.error(
        err instanceof Error ? err.message : ONBOARDING_NOTIFICATIONS_COPY.exploreFailError
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Modal Popup for (i) Info Icons */}
      <OnboardingInfoModal
        isOpen={Boolean(modalType)}
        type={modalType}
        onClose={() => setModalType(null)}
        onSelectOption={(type) => {
          if (type === 'profile') setActiveStep('profile');
          else if (type === 'organization') setActiveStep('organization');
          else if (type === 'explore') handleExplore();
        }}
      />

      {/* STEP 0: Welcome Experience & Choice Selection */}
      {activeStep === 'welcome' && (
        <div>
          <div className="text-center mb-8">
            <div className="h-13 w-13 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-3.5">
              <Sparkles size={24} />
            </div>
            <h2 className="text-[28px] sm:text-[34px] font-bold text-foreground tracking-tight leading-[1.2]">
              {ONBOARDING_WELCOME_COPY.title}
            </h2>
            <p className="mt-2.5 text-[15px] sm:text-[16px] text-muted-foreground max-w-xl mx-auto leading-relaxed">
              {ONBOARDING_WELCOME_COPY.description}
            </p>
            <p className="mt-6 text-[13px] sm:text-[13.5px] font-bold uppercase tracking-wider text-primary">
              {ONBOARDING_WELCOME_COPY.question}
            </p>
          </div>

          {/* 3 Onboarding Cards with Info Icons */}
          <div className="space-y-4">
            {ONBOARDING_WELCOME_COPY.cards.map((card) => {
              const IconComponent = card.icon;
              const handleCardClick = () => {
                if (card.id === 'profile') setActiveStep('profile');
                else if (card.id === 'organization') setActiveStep('organization');
                else if (card.id === 'explore') handleExplore();
              };

              return (
                <div
                  key={card.id}
                  className="group relative rounded-xl border border-[#ded9d5] bg-[#faf9f8] hover:bg-white hover:border-primary p-6 transition-all shadow-2xs flex items-start justify-between gap-4"
                >
                  <div
                    onClick={handleCardClick}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent size={22} />
                      </div>
                      <div>
                        <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground group-hover:text-primary transition-colors">
                          {card.title}
                        </h3>
                        <p className="text-[14px] sm:text-[14.5px] text-muted-foreground mt-1 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <button
                      type="button"
                      title={card.tooltip}
                      onClick={(e) => {
                        e.stopPropagation();
                        setModalType(card.id);
                      }}
                      className="p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-white border border-transparent hover:border-[#ded9d5] transition-all cursor-pointer"
                    >
                      <Info size={19} />
                    </button>
                    <button
                      type="button"
                      onClick={handleCardClick}
                      disabled={card.id === 'explore' ? loading : false}
                      className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-md text-[13.5px] font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white transition-all cursor-pointer"
                    >
                      <span>{card.buttonLabel}</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-FLOW 1: Profile Setup Form */}
      {activeStep === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#ded9d5]">
            <button
              type="button"
              onClick={() => setActiveStep('welcome')}
              className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{ONBOARDING_PROFILE_FORM_COPY.backButton}</span>
            </button>
            <span className="text-[12.5px] sm:text-[13px] font-bold text-primary uppercase tracking-wider">
              {ONBOARDING_PROFILE_FORM_COPY.headerBadge}
            </span>
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_PROFILE_FORM_COPY.displayNameLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                required
                placeholder={ONBOARDING_PROFILE_FORM_COPY.displayNamePlaceholder}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full h-12 rounded-md px-4 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
            {fieldErrors.displayName && (
              <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.displayName}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_PROFILE_FORM_COPY.headlineLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Briefcase size={16} />
              </div>
              <input
                type="text"
                placeholder={ONBOARDING_PROFILE_FORM_COPY.headlinePlaceholder}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full h-12 rounded-md pl-10 pr-4 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_PROFILE_FORM_COPY.locationLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <MapPin size={16} />
              </div>
              <input
                type="text"
                placeholder={ONBOARDING_PROFILE_FORM_COPY.locationPlaceholder}
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-12 rounded-md pl-10 pr-4 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_PROFILE_FORM_COPY.bioLabel}
            </label>
            <textarea
              rows={3}
              placeholder={ONBOARDING_PROFILE_FORM_COPY.bioPlaceholder}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full rounded-md border border-[#ded9d5] p-3.5 text-[15px] text-foreground bg-white outline-none focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-2">
              {ONBOARDING_PROFILE_FORM_COPY.interestsLabel}
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_TAGS.map((tag) => {
                const selected = selectedInterests.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleInterest(tag)}
                    className={`px-3.5 py-1.5 rounded-md text-[13px] sm:text-[13.5px] font-medium transition-all cursor-pointer border ${
                      selected
                        ? 'bg-primary text-white border-primary shadow-2xs'
                        : 'bg-[#faf9f8] text-foreground border-[#ded9d5] hover:border-primary hover:text-primary'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between gap-4 border-t border-[#ded9d5]">
            <button
              type="button"
              onClick={handleExplore}
              className="text-[13.5px] sm:text-[14px] font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
            >
              {ONBOARDING_PROFILE_FORM_COPY.skipButton}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 inline-flex items-center gap-2 rounded-md bg-primary text-[15px] sm:text-[16px] font-semibold text-white hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer disabled:opacity-70 select-none"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{ONBOARDING_PROFILE_FORM_COPY.savingButton}</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>{ONBOARDING_PROFILE_FORM_COPY.submitButton}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* SUB-FLOW 2: Organization Creation Form */}
      {activeStep === 'organization' && (
        <form onSubmit={handleOrgSubmit} className="space-y-4 sm:space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-[#ded9d5]">
            <button
              type="button"
              onClick={() => setActiveStep('welcome')}
              className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>{ONBOARDING_ORG_FORM_COPY.backButton}</span>
            </button>
            <span className="text-[12.5px] sm:text-[13px] font-bold text-primary uppercase tracking-wider">
              {ONBOARDING_ORG_FORM_COPY.headerBadge}
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#faf9f8] border border-[#ded9d5] text-[14px] text-muted-foreground leading-relaxed">
            <p>
              <strong className="text-foreground">{ONBOARDING_ORG_FORM_COPY.architecturePrincipleHeading}</strong>{' '}
              {ONBOARDING_ORG_FORM_COPY.architecturePrincipleText}
            </p>
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_ORG_FORM_COPY.orgTypeLabel}
            </label>
            <select
              value={orgType}
              onChange={(e) => setOrgType(e.target.value)}
              className="w-full h-12 rounded-md border border-[#ded9d5] px-3.5 text-[15px] text-foreground bg-white outline-none focus:border-primary"
            >
              {ORG_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_ORG_FORM_COPY.orgNameLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                required
                placeholder={ONBOARDING_ORG_FORM_COPY.orgNamePlaceholder}
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full h-12 rounded-md px-4 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
            {fieldErrors.name && (
              <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_ORG_FORM_COPY.locationLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <MapPin size={16} />
              </div>
              <input
                type="text"
                placeholder={ONBOARDING_ORG_FORM_COPY.locationPlaceholder}
                value={orgLocation}
                onChange={(e) => setOrgLocation(e.target.value)}
                className="w-full h-12 rounded-md pl-10 pr-4 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_ORG_FORM_COPY.websiteLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                <Globe size={16} />
              </div>
              <input
                type="url"
                placeholder={ONBOARDING_ORG_FORM_COPY.websitePlaceholder}
                value={orgWebsite}
                onChange={(e) => setOrgWebsite(e.target.value)}
                className="w-full h-12 rounded-md pl-10 pr-4 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
            {fieldErrors.website && (
              <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.website}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {ONBOARDING_ORG_FORM_COPY.descriptionLabel}
            </label>
            <textarea
              rows={3}
              placeholder={ONBOARDING_ORG_FORM_COPY.descriptionPlaceholder}
              value={orgDescription}
              onChange={(e) => setOrgDescription(e.target.value)}
              className="w-full rounded-md border border-[#ded9d5] p-3.5 text-[15px] text-foreground bg-white outline-none focus:border-primary placeholder:text-muted-foreground"
            />
          </div>

          <div className="pt-4 flex items-center justify-between gap-4 border-t border-[#ded9d5]">
            <button
              type="button"
              onClick={handleExplore}
              className="text-[13.5px] sm:text-[14px] font-semibold text-muted-foreground hover:text-foreground hover:underline cursor-pointer"
            >
              {ONBOARDING_ORG_FORM_COPY.skipButton}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 inline-flex items-center gap-2 rounded-md bg-primary text-[15px] sm:text-[16px] font-semibold text-white hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer disabled:opacity-70 select-none"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{ONBOARDING_ORG_FORM_COPY.savingButton}</span>
                </>
              ) : (
                <>
                  <Building2 size={16} />
                  <span>{ONBOARDING_ORG_FORM_COPY.submitButton}</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
