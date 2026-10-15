'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import AccountHero from '@/components/account/AccountHero';
import {
  ACCOUNT_HERO_COPY,
  PROFILE_PREFIX_OPTIONS,
  PROFILE_GENDER_OPTIONS,
  getBirthYearOptions,
  getMonthOptionsForYear,
  getDaysOptionsForMonth,
  getFallbackAvatar,
  COUNTRY_CODES,
} from '@/data/account';
import { useAuth } from '@/context/auth-context';
import { ProfilePrefix, ProfileGender } from '@/types/account';
import { ProfileShimmer } from '@/shimmer/account';
import { notify } from '@/components/ui/toast';
import { uploadAvatarAsset } from '@/lib/upload';
import {
  MapPin,
  ShieldCheck,
  Edit3,
  Save,
  Check,
  ChevronDown,
  AlertCircle,
  Crown,
  Sparkles,
  Camera,
  Gem,
  Loader2,
  Trash2,
} from 'lucide-react';

const fieldBase =
  'w-full min-w-0 h-[48px] px-3.5 text-[14px] sm:text-[14.5px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded-md outline-none transition-all duration-200 placeholder:text-primary-text/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:bg-[#f4efe9] disabled:text-[#7d747a] disabled:cursor-not-allowed';

const selectWrapper =
  'relative block w-full min-w-0 h-[48px] bg-[#faf9f8] border border-[#ded9d5] rounded-md transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10';

const selectElement =
  'appearance-none w-full h-full pl-3.5 pr-8 text-[14px] sm:text-[14.5px] text-[#23201f] bg-transparent border-0 outline-none cursor-pointer disabled:bg-[#f4efe9] disabled:text-[#7d747a] disabled:cursor-not-allowed';

const textareaBase =
  'w-full min-w-0 p-3.5 text-[14px] sm:text-[14.5px] text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded-md outline-none transition-all duration-200 placeholder:text-primary-text/60 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10 disabled:bg-[#f4efe9] disabled:text-[#7d747a] disabled:cursor-not-allowed leading-relaxed';

function formatDisplayDob(dobString?: string | null): string {
  if (!dobString) return '—';
  const parts = dobString.split('-');
  if (parts.length !== 3) return dobString;
  const [y, m, d] = parts;
  const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIndex = parseInt(m, 10);
  const dayNum = parseInt(d, 10);
  return `${dayNum} ${monthNames[monthIndex] || m} ${y}`;
}

export default function ProfilePage() {
  const { user, status } = useAuth();
  const copy = ACCOUNT_HERO_COPY.profile;

  return (
    <main className="min-h-screen bg-white">
      <AccountHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />
      {status === 'loading' || !user ? (
        <ProfileShimmer />
      ) : (
        <ProfileContent key={user.id} />
      )}
    </main>
  );
}

function ProfileContent() {
  const { user, updateProfile } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Parse existing date of birth (YYYY-MM-DD)
  const initialDobParts = user?.dateOfBirth ? user.dateOfBirth.split('-') : [];
  const initialYear = initialDobParts[0] || '';
  const initialMonth = initialDobParts[1] || '';
  const initialDay = initialDobParts[2] || '';

  // Photo upload and fallback states
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Form Fields initialized directly from authenticated user
  const [prefix, setPrefix] = useState<ProfilePrefix>((user?.prefix as ProfilePrefix) || '');
  const [displayName, setDisplayName] = useState(
    user?.displayName || user?.name || user?.email?.split('@')[0] || ''
  );
  const [phoneCountryCode, setPhoneCountryCode] = useState(user?.phoneCountryCode || '+1');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [gender, setGender] = useState<ProfileGender>((user?.gender as ProfileGender) || '');
  const [birthDay, setBirthDay] = useState(initialDay);
  const [birthMonth, setBirthMonth] = useState(initialMonth);
  const [birthYear, setBirthYear] = useState(initialYear);
  const [headline, setHeadline] = useState(user?.headline || '');
  const [location, setLocation] = useState(user?.location || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');

  // Dynamic 120-year rolling range, constrained months, and constrained days
  const birthYearOptions = useMemo(() => getBirthYearOptions(), []);
  const availableMonthOptions = useMemo(
    () => getMonthOptionsForYear(birthYear),
    [birthYear]
  );
  const availableDaysOptions = useMemo(
    () => getDaysOptionsForMonth(birthYear, birthMonth),
    [birthYear, birthMonth]
  );

  const handleToggleEdit = () => {
    if (isEditing) {
      // Revert edits to saved user state
      setPrefix((user?.prefix as ProfilePrefix) || '');
      setDisplayName(user?.displayName || user?.name || user?.email?.split('@')[0] || '');
      setPhoneCountryCode(user?.phoneCountryCode || '+1');
      setPhoneNumber(user?.phoneNumber || '');
      setGender((user?.gender as ProfileGender) || '');
      setBirthDay(initialDay);
      setBirthMonth(initialMonth);
      setBirthYear(initialYear);
      setHeadline(user?.headline || '');
      setLocation(user?.location || '');
      setBio(user?.bio || '');
      setWebsite(user?.website || '');
      setIsEditing(false);
      setErrorMessage(null);
    } else {
      setIsEditing(true);
      setErrorMessage(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSaving(true);

    try {
      const formattedDob =
        birthYear && birthMonth && birthDay
          ? `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`
          : null;

      await updateProfile({
        prefix: prefix || null,
        displayName: displayName.trim(),
        headline: headline.trim() || null,
        location: location.trim() || null,
        bio: bio.trim() || null,
        website: website.trim() || null,
        phoneCountryCode: phoneCountryCode || null,
        phoneNumber: phoneNumber.trim() || null,
        gender: gender || null,
        dateOfBirth: formattedDob,
      });

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle profile image upload to Cloudinary (folder: pentasent/avatars)
  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input so same file can be selected again
    e.target.value = '';

    // Validate image format (only specific image types)
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    const validExts = /\.(jpe?g|png|webp|gif)$/i;
    if (!validMimes.includes(file.type) && !validExts.test(file.name)) {
      notify.error(
        'Invalid image format',
        'Please upload a JPEG, PNG, WEBP, or GIF image file.'
      );
      return;
    }

    // Validate maximum file size limit (5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      notify.error(
        'File size too large',
        'Profile picture must be under 5MB.'
      );
      return;
    }

    setIsUploadingAvatar(true);
    try {
      // 1. Upload to Cloudinary folder pentasent/avatars
      const uploadRes = await uploadAvatarAsset(file);

      // 2. Update backend profile with secure Cloudinary link
      await updateProfile({
        avatarUrl: uploadRes.url,
      });

      setImgError(false);
      notify.success('Profile picture updated!', 'Your new photo has been saved to your account.');
    } catch (err: unknown) {
      notify.error(
        'Upload failed',
        err instanceof Error ? err.message : 'Failed to upload profile picture. Please try again.'
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setIsUploadingAvatar(true);
    try {
      await updateProfile({
        avatarUrl: null,
      });
      setImgError(false);
      notify.info('Profile picture removed', 'Reverted to default profile avatar.');
    } catch (err: unknown) {
      notify.error(
        'Action failed',
        err instanceof Error ? err.message : 'Failed to remove profile picture'
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const formattedName = prefix ? `${prefix} ${displayName}` : displayName;
  const fallbackAvatar = getFallbackAvatar(user?.gender);
  const isUserVip = Boolean(user?.isVip);
  const isUserPremium = Boolean(user?.isPremium);
  const customAvatar = !imgError ? (user?.avatarUrl || user?.avatar) : undefined;
  const hasCustomAvatar = Boolean(customAvatar);
  const avatarSrc = customAvatar || fallbackAvatar;

  // VIP Gold border vs. Premium Yellow border vs. Standard border
  const avatarBorderStyles = isUserVip
    ? 'border-[3.5px] border-[#D4AF37] ring-4 ring-[#D4AF37]/25 shadow-[0_4px_22px_rgba(212,175,55,0.35)]'
    : isUserPremium
    ? 'border-[3.5px] border-[#F59E0B] ring-4 ring-[#F59E0B]/25 shadow-[0_4px_18px_rgba(245,158,11,0.3)]'
    : 'border-2 border-primary/20 ring-2 ring-primary/5';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* =========================================================
            LEFT COLUMN: Public Identity & Credentials Card
            ========================================================= */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-[#ded9d5] p-6 sm:p-7 shadow-2xs">
            <div className="flex flex-col items-center text-center">
              {/* Profile Avatar Container with VIP / Premium Highlight & Badges */}
              <div className="relative group">
                <div
                  className={`relative h-26 w-26 sm:h-28 sm:w-28 rounded-full overflow-hidden bg-[#faf9f8] transition-all duration-300 ${avatarBorderStyles}`}
                >
                  <Image
                    src={avatarSrc}
                    alt={displayName || 'User Avatar'}
                    width={112}
                    height={112}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={() => setImgError(true)}
                    priority
                  />

                  {/* Hover Change Photo Overlay */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white cursor-pointer z-10 select-none"
                    title="Change profile photo"
                    aria-label="Change profile photo"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 size={22} className="animate-spin text-white" />
                    ) : (
                      <>
                        <Camera size={20} className="mb-0.5" />
                        <span className="text-[10px] font-bold tracking-wider uppercase">Change</span>
                      </>
                    )}
                  </button>

                  {/* Uploading Spinner Overlay */}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white z-30">
                      <Loader2 size={22} className="animate-spin text-white mb-1" />
                      <span className="text-[10px] font-bold tracking-wider uppercase">Uploading...</span>
                    </div>
                  )}
                </div>

                {/* VIP Gold Badge with Diamond Icon */}
                {isUserVip && (
                  <div
                    className="absolute bottom-1 -right-1 h-7.5 w-7.5 rounded-full bg-gradient-to-tr from-[#997300] via-[#ffd700] to-[#e6b800] border-2 border-white shadow-md flex items-center justify-center text-[#352500] z-20"
                    title="VIP Member - Diamond"
                    aria-label="VIP Member"
                  >
                    <Gem size={14} className="stroke-[2.5]" />
                  </div>
                )}

                {/* Premium Yellow Badge with Crown Icon (when not VIP) */}
                {isUserPremium && !isUserVip && (
                  <div
                    className="absolute bottom-1 -right-1 h-7.5 w-7.5 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-300 border-2 border-white shadow-md flex items-center justify-center text-amber-950 z-20"
                    title="Premium Member"
                    aria-label="Premium Member"
                  >
                    <Crown size={14} className="stroke-[2.5]" />
                  </div>
                )}
              </div>

              {/* Photo Upload Controls */}
              <div className="mt-3.5 flex flex-col items-center gap-1.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploadingAvatar}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#ded9d5] bg-white text-[12.5px] font-semibold text-foreground hover:bg-[#faf9f8] hover:border-primary transition-all cursor-pointer disabled:opacity-60"
                  >
                    <Camera size={13} className="text-primary" />
                    <span>{hasCustomAvatar ? 'Change Photo' : 'Upload Photo'}</span>
                  </button>
                  {hasCustomAvatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={isUploadingAvatar}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-[#ded9d5] bg-white text-[12.5px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition-all cursor-pointer disabled:opacity-60"
                      title="Remove custom photo and use default avatar"
                    >
                      <Trash2 size={12} />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground font-medium">
                  JPG, PNG, WEBP, or GIF (max 5MB)
                </p>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleAvatarFileChange}
                className="hidden"
                aria-label="Upload profile image"
              />

              <h2 className="mt-4 text-xl font-bold text-foreground">
                {formattedName || user?.displayName || user?.name || user?.email?.split('@')[0] || 'User Profile'}
              </h2>

              {/* VIP & Premium Badges Under Name */}
              {(isUserVip || isUserPremium) && (
                <div className="my-2.5 flex flex-wrap items-center justify-center gap-2">
                  {isUserVip && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-bold bg-amber-50 text-amber-900 border border-amber-300">
                      <Gem size={12} className="text-amber-600 fill-amber-500" />
                      VIP Member
                    </span>
                  )}
                  {isUserPremium && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11.5px] font-bold bg-purple-50 text-purple-900 border border-purple-300">
                      <Sparkles size={12} className="text-purple-600" />
                      Premium
                    </span>
                  )}
                </div>
              )}

              {headline ? (
                <p className="text-[14px] sm:text-[14.5px] font-semibold text-primary mt-1">
                  {headline}
                </p>
              ) : (
                <p className="text-[13px] text-muted-foreground mt-1 italic">
                  No professional headline added
                </p>
              )}

              {location && (
                <div className="mt-3 flex items-center gap-1.5 text-[13px] sm:text-[13.5px] text-primary-text">
                  <MapPin size={14} className="text-muted-foreground shrink-0" />
                  <span>{location}</span>
                </div>
              )}

              <div className="mt-5 pt-4 border-t border-[#ded9d5] w-full flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Identity Status</span>
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                    user?.isVerified
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <ShieldCheck size={12} />
                  {user?.isVerified ? 'Verified Identity' : 'Pending Verification'}
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#ded9d5]/60 w-full flex items-center justify-between text-[13px]">
                <span className="text-muted-foreground">Membership Tier</span>
                {isUserVip ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-950 border border-[#D4AF37] shadow-2xs">
                    <Gem size={11} className="text-[#997300] fill-[#ffd700]" />
                    VIP Member
                  </span>
                ) : isUserPremium ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 border border-amber-300 shadow-2xs">
                    <Crown size={11} className="text-amber-600 fill-amber-500" />
                    Premium Member
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-semibold text-[11px] bg-gray-100 text-gray-700 border border-gray-200">
                    Standard Member
                  </span>
                )}
              </div>
            </div>

            {/* Clinical & Research Interests */}
            <div className="mt-6 pt-5 border-t border-[#ded9d5] space-y-3">
              <h3 className="text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-muted-foreground">
                Clinical & Research Interests
              </h3>
              {user?.interests && user.interests.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {user.interests.map((interest) => (
                    <span
                      key={interest}
                      className="px-2.5 py-1 rounded-md text-[12.5px] font-semibold bg-[#faf9f8] text-primary border border-[#ded9d5]"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[12.5px] text-muted-foreground italic">
                  No research interests listed
                </p>
              )}
            </div>

            {/* Verified Contact Details Summary */}
            <div className="mt-6 pt-5 border-t border-[#ded9d5] space-y-3 text-[13px] sm:text-[13.5px] text-primary-text">
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground">Contact Email</span>
                <span className="font-semibold text-foreground truncate max-w-[200px]" title={user?.email || ''}>
                  {user?.email || '—'}
                </span>
              </div>
              {phoneNumber && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Mobile Phone</span>
                  <span className="font-semibold text-foreground">{phoneCountryCode} {phoneNumber}</span>
                </div>
              )}
              {user?.gender && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="font-semibold text-foreground capitalize">
                    {PROFILE_GENDER_OPTIONS.find((g) => g.value === user.gender)?.label || user.gender}
                  </span>
                </div>
              )}
              {user?.dateOfBirth && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Date of Birth</span>
                  <span className="font-semibold text-foreground">
                    {formatDisplayDob(user.dateOfBirth)}
                  </span>
                </div>
              )}
              {website && (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-muted-foreground">Website</span>
                  <a
                    href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary hover:underline truncate max-w-[200px]"
                  >
                    {website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            RIGHT COLUMN: Profile Edit Form (Matching Tools/Press Style)
            ========================================================= */}
        <div className="lg:col-span-2 min-w-0">
          <div className="bg-white rounded-xl border border-[#ded9d5] p-6 sm:p-8 shadow-2xs min-w-0">
            <div className="flex items-center justify-between pb-5 border-b border-[#ded9d5] flex-wrap gap-4">
              <div>
                <h3 className="text-[18px] sm:text-[20px] font-bold text-foreground">Personal Information</h3>
                <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-primary-text mt-1">
                  Your public clinical credentials and verified profile across the Pentasent network.
                </p>
              </div>

              <div className="flex items-center gap-3">
                {saveSuccess && (
                  <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
                    <Check size={13} strokeWidth={2.5} />
                    Profile updated
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleToggleEdit}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md border border-[#ded9d5] bg-white text-[13px] font-semibold text-foreground hover:bg-[#faf9f8] hover:border-primary transition-all cursor-pointer shadow-2xs"
                >
                  <Edit3 size={13} />
                  <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
                </button>
              </div>
            </div>

            {errorMessage && (
              <div className="mt-5 p-3.5 rounded-md bg-red-50/50 border border-red-200 text-red-700 text-[13px] flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-6 space-y-5 min-w-0">
              {/* Prefix and Display Name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 min-w-0">
                {/* Prefix Selector */}
                <div className="sm:col-span-1 min-w-0">
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Prefix <span className="text-muted-foreground font-normal lowercase">(optional)</span>
                  </label>
                  <div className={selectWrapper}>
                    <select
                      disabled={!isEditing}
                      value={prefix}
                      onChange={(e) => setPrefix(e.target.value as ProfilePrefix)}
                      className={selectElement}
                    >
                      {PROFILE_PREFIX_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Display Name Input */}
                <div className="sm:col-span-2 min-w-0">
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Full Display Name *
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="e.g. Your Name"
                    className={fieldBase}
                    required
                  />
                </div>
              </div>

              {/* Email Address & Mobile Number with Country Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-w-0">
                {/* Email Address (Always Visible with high contrast readOnly input) */}
                <div className="min-w-0">
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Email Address
                  </label>
                  <div className="relative min-w-0">
                    <input
                      disabled={!isEditing}
                      type="email"
                      readOnly
                      value={user?.email || ''}
                      placeholder="user@pentasent.com"
                      className="w-full min-w-0 h-[48px] pl-3.5 pr-22 text-[14px] sm:text-[14.5px] font-medium text-foreground bg-[#faf9f8] border border-[#ded9d5] disabled:bg-[#f4efe9] disabled:text-[#7d747a] disabled:cursor-not-allowed rounded-md outline-none cursor-default select-text"
                      aria-label="Verified email address"
                    />
                    {user?.isVerified !== false && user?.email && (
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <Check size={11} strokeWidth={2.5} />
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                {/* Mobile Phone with Country Code (Compact & Responsive, Non-overflowing) */}
                <div className="min-w-0">
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Mobile Number <span className="text-muted-foreground font-normal lowercase">(optional)</span>
                  </label>
                  <div className="flex items-center gap-2 w-full min-w-0">
                    {/* Compact Country Code Dropdown */}
                    <div className="relative block w-[84px] sm:w-[92px] shrink-0 h-[48px] bg-[#faf9f8] border border-[#ded9d5] rounded-md transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
                      <select
                        disabled={!isEditing}
                        value={phoneCountryCode}
                        onChange={(e) => setPhoneCountryCode(e.target.value)}
                        className="appearance-none w-full h-full pl-2.5 pr-6 text-[13.5px] sm:text-[14px] font-medium text-[#23201f] bg-transparent border-0 outline-none cursor-pointer disabled:bg-[#f4efe9] disabled:text-[#7d747a] disabled:cursor-not-allowed"
                        title="Select Country Dial Code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={`${c.code}-${c.dialCode}`} value={c.dialCode}>
                            {c.flag} {c.dialCode}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={14}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>

                    {/* Phone Number Input */}
                    <div className="flex-1 min-w-0">
                      <input
                        type="tel"
                        disabled={!isEditing}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d\s-]/g, ''))}
                        placeholder="e.g. 98765 43210"
                        className={fieldBase}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Gender & Date of Birth */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-w-0">
                {/* Gender Selector */}
                <div className="min-w-0">
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Gender <span className="text-muted-foreground font-normal lowercase">(optional)</span>
                  </label>
                  <div className={selectWrapper}>
                    <select
                      disabled={!isEditing}
                      value={gender}
                      onChange={(e) => setGender(e.target.value as ProfileGender)}
                      className={selectElement}
                    >
                      {PROFILE_GENDER_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                  </div>
                </div>

                {/* Date of Birth: 3 dropdowns (Day, Month, Year) */}
                <div className="min-w-0">
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Date of Birth <span className="text-muted-foreground font-normal lowercase">(Day / Month / Year)</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2 min-w-0">
                    {/* Day */}
                    <div className={selectWrapper}>
                      <select
                        disabled={!isEditing}
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        className="appearance-none w-full h-full pl-2.5 pr-6 text-[13.5px] sm:text-[14px] text-[#23201f] bg-transparent border-0 outline-none cursor-pointer disabled:bg-[#f4efe9] disabled:text-[#7d747a] disabled:cursor-not-allowed"
                        title="Select Day"
                      >
                        <option value="">Day</option>
                        {availableDaysOptions.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>

                    {/* Month */}
                    <div className={selectWrapper}>
                      <select
                        disabled={!isEditing}
                        value={birthMonth}
                        onChange={(e) => {
                          const newMonth = e.target.value;
                          setBirthMonth(newMonth);
                          const now = new Date();
                          const curY = now.getFullYear();
                          const curM = now.getMonth() + 1;
                          const curD = now.getDate();
                          if (parseInt(birthYear, 10) === curY && parseInt(newMonth, 10) === curM) {
                            if (birthDay && parseInt(birthDay, 10) > curD) {
                              setBirthDay('');
                            }
                          } else if (birthYear && newMonth) {
                            const maxDaysInM = new Date(parseInt(birthYear, 10), parseInt(newMonth, 10), 0).getDate();
                            if (birthDay && parseInt(birthDay, 10) > maxDaysInM) {
                              setBirthDay('');
                            }
                          }
                        }}
                        className="appearance-none w-full h-full pl-2 pr-6 text-[13px] sm:text-[13.5px] text-[#23201f] bg-transparent border-0 outline-none cursor-pointer disabled:bg-[#f4efe9] disabled:text-[#7d747a] disabled:cursor-not-allowed"
                        title="Select Month"
                      >
                        {availableMonthOptions.map((m) => (
                          <option key={m.value} value={m.value}>
                            {m.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>

                    {/* Year (Dynamic 120-year rolling range from current year) */}
                    <div className={selectWrapper}>
                      <select
                        disabled={!isEditing}
                        value={birthYear}
                        onChange={(e) => {
                          const newYear = e.target.value;
                          setBirthYear(newYear);
                          const now = new Date();
                          const curY = now.getFullYear();
                          const curM = now.getMonth() + 1;
                          const curD = now.getDate();
                          if (parseInt(newYear, 10) === curY) {
                            if (birthMonth && parseInt(birthMonth, 10) > curM) {
                              setBirthMonth('');
                              setBirthDay('');
                            } else if (birthMonth && parseInt(birthMonth, 10) === curM) {
                              if (birthDay && parseInt(birthDay, 10) > curD) {
                                setBirthDay('');
                              }
                            }
                          } else if (newYear && birthMonth) {
                            const maxDaysInM = new Date(parseInt(newYear, 10), parseInt(birthMonth, 10), 0).getDate();
                            if (birthDay && parseInt(birthDay, 10) > maxDaysInM) {
                              setBirthDay('');
                            }
                          }
                        }}
                        className="appearance-none w-full h-full pl-2.5 pr-6 text-[13.5px] sm:text-[14px] text-[#23201f] bg-transparent border-0 outline-none cursor-pointer disabled:bg-[#f4efe9] disabled:text-[#7d747a] disabled:cursor-not-allowed"
                        title="Select Year"
                      >
                        <option value="">Year</option>
                        {birthYearOptions.map((year) => (
                          <option key={year} value={year.toString()}>
                            {year}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={13}
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Headline / Focus */}
              <div className="min-w-0">
                <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                  Professional Headline & Medical Focus
                </label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Lead Preventive Cardiologist & HealthTech Innovator"
                  className={fieldBase}
                />
              </div>

              {/* Location and Website */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 min-w-0">
                <div className="min-w-0">
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Location
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Bengaluru, India or Boston, MA"
                    className={fieldBase}
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                    Website / Lab URL
                  </label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className={fieldBase}
                  />
                </div>
              </div>

              {/* Bio & Clinical/Research Background */}
              <div className="min-w-0">
                <label className="block text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-[#4f464c] mb-1.5">
                  Biography & Scientific Research Background
                </label>
                <textarea
                  rows={4}
                  disabled={!isEditing}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Describe your clinical practice, clinical trial participation, research focus, and publications..."
                  className={textareaBase}
                />
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#ded9d5]">
                  <button
                    type="button"
                    onClick={handleToggleEdit}
                    className="px-5 py-3 text-[13px] font-semibold rounded-md border border-[#ded9d5] bg-white text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 rounded-md bg-primary hover:bg-primary-hover px-5 py-3 text-[13px] font-semibold text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Save size={14} />
                    <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
