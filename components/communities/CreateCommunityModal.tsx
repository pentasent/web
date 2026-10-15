'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  Loader2,
  Users,
  Lock,
  Globe,
  CreditCard,
} from 'lucide-react';
import { PublicCommunityDTO, CreateCommunityInput, UpdateCommunityInput } from '@/types/communities';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (community: PublicCommunityDTO) => void;
  editingCommunity?: PublicCommunityDTO | null;
}

export default function CreateCommunityModal({
  isOpen,
  onClose,
  onSuccess,
  editingCommunity = null,
}: CreateCommunityModalProps) {
  // Lock background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <CommunityModalContent
      key={editingCommunity?.id || 'new'}
      editingCommunity={editingCommunity}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
}

function CommunityModalContent({
  editingCommunity,
  onClose,
  onSuccess,
}: {
  editingCommunity: PublicCommunityDTO | null;
  onClose: () => void;
  onSuccess: (community: PublicCommunityDTO) => void;
}) {
  const isEditing = !!editingCommunity;

  // Initialize state directly from props without cascading renders
  const [name, setName] = useState(() => editingCommunity?.name || '');
  const [tagline, setTagline] = useState(() => editingCommunity?.tagline || '');
  const [description, setDescription] = useState(() => editingCommunity?.description || '');
  const [iconUrl, setIconUrl] = useState(() => editingCommunity?.iconUrl || 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=200');
  const [iconPublicId, setIconPublicId] = useState('');
  const [bannerUrl, setBannerUrl] = useState(() => editingCommunity?.bannerUrl || '');
  const [visibility, setVisibility] = useState<'public' | 'private'>(() => editingCommunity?.visibility || 'public');
  const [pricingType, setPricingType] = useState<'free' | 'paid'>(() => editingCommunity?.pricingType || 'free');
  const [price, setPrice] = useState(() => String(editingCommunity?.price || '0'));
  const [tagsInput, setTagsInput] = useState(() => editingCommunity?.tags ? editingCommunity.tags.join(', ') : '');

  const [isUploadingIcon, setIsUploadingIcon] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Cloudinary Icon Upload
  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify.error('Icon file size must be less than 5MB');
      return;
    }

    setIsUploadingIcon(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'pentasent_communities');

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'pentasent'}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      if (res.ok) {
        const data = await res.json();
        setIconUrl(data.secure_url);
        setIconPublicId(data.public_id);
        notify.success('Icon uploaded successfully');
      } else {
        const objectUrl = URL.createObjectURL(file);
        setIconUrl(objectUrl);
        notify.success('Icon preview attached');
      }
    } catch {
      const objectUrl = URL.createObjectURL(file);
      setIconUrl(objectUrl);
    } finally {
      setIsUploadingIcon(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      notify.error('Community name is required');
      return;
    }
    if (!description.trim() || description.length < 10) {
      notify.error('Description must be at least 10 characters');
      return;
    }
    if (visibility === 'public' && pricingType === 'paid') {
      notify.error('Public communities cannot be paid. Paid communities must be private.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    setIsSubmitting(true);
    try {
      if (isEditing && editingCommunity) {
        const updatePayload: UpdateCommunityInput = {
          name: name.trim(),
          tagline: tagline.trim() || null,
          description: description.trim(),
          iconUrl: iconUrl || undefined,
          visibility,
          pricingType,
          price: Number(price) || 0,
          tags,
        };

        const res = await apiClient<PublicCommunityDTO>(`/communities/${editingCommunity.id}`, {
          method: 'PATCH',
          body: JSON.stringify(updatePayload),
        });

        if (res.success && res.data) {
          notify.success('Community updated successfully');
          onSuccess(res.data);
          onClose();
        } else {
          notify.error(res.error?.message || 'Failed to update community');
        }
      } else {
        const createPayload: CreateCommunityInput = {
          name: name.trim(),
          tagline: tagline.trim() || null,
          description: description.trim(),
          iconUrl: iconUrl || 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=200',
          iconCloudinaryPublicId: iconPublicId || null,
          bannerUrl: bannerUrl || null,
          visibility,
          pricingType,
          price: Number(price) || 0,
          currency: 'USD',
          billingPeriod: 'monthly',
          tags,
        };

        const res = await apiClient<PublicCommunityDTO>('/communities', {
          method: 'POST',
          body: JSON.stringify(createPayload),
        });

        if (res.success && res.data) {
          notify.success('Community circle created successfully');
          onSuccess(res.data);
          onClose();
        } else {
          notify.error(res.error?.message || 'Failed to create community');
        }
      }
    } catch {
      notify.error('Error saving community');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window Container - Strict Max Height with Header/Body/Footer separation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-lg bg-white border border-[#ded9d5] shadow-2xl z-10 overflow-hidden"
        >
          {/* Header (Fixed shrink-0) */}
          <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#faf0f8] text-primary flex items-center justify-center">
                <Users size={18} />
              </div>
              <div>
                <h3 className="text-[17px] sm:text-[18px] font-bold text-foreground leading-snug">
                  {isEditing ? 'Manage Community Settings' : 'Create Healthcare Community'}
                </h3>
                <p className="text-[12.5px] text-primary-text">
                  Establish a collaborative clinical circle or research group
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-md text-primary-text hover:text-foreground hover:bg-[#f6f2ee] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Form Scrollable Body */}
          <form id="community-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Name */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                Community Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="e.g. Molecular Oncology & Liquid Biopsy Consortium"
                className="w-full px-3.5 py-2 text-[14px] rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-foreground placeholder:text-primary-text/70 outline-none focus:border-primary focus:bg-white"
              />
            </div>

            {/* Tagline */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                Tagline / Subheading
              </label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Peer review of NGS assays, variant interpretation, and targeted trials"
                className="w-full px-3.5 py-2 text-[14px] rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-foreground placeholder:text-primary-text/70 outline-none focus:border-primary focus:bg-white"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                Description & Purpose *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Explain the focus, eligible clinical backgrounds, discussion scope, and goals of this circle..."
                className="w-full px-3.5 py-2.5 text-[14px] rounded-lg border border-[#ded9d5] bg-[#faf9f8] text-foreground placeholder:text-primary-text/70 outline-none focus:border-primary focus:bg-white resize-y"
              />
            </div>

            {/* Icon Upload Row */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                Community Icon (Max 5MB)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#faf8f6] border border-[#ded9d5] flex items-center justify-center overflow-hidden shrink-0">
                  {iconUrl ? (
                    <img src={iconUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <Users size={20} className="text-primary-text" />
                  )}
                </div>

                <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg border border-[#ded9d5] bg-[#faf8f6] hover:bg-[#f6f2ee] text-[13px] font-semibold text-primary transition-colors cursor-pointer">
                  <UploadCloud size={15} />
                  <span>{isUploadingIcon ? 'Uploading...' : 'Upload Image'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                    disabled={isUploadingIcon}
                  />
                </label>
              </div>
            </div>

            {/* Tags / Topics */}
            <div>
              <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                Tags / Medical Disciplines (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Cardiology, Lipidology, Prevention, Clinical AI"
                className="w-full px-3.5 py-2 text-[14px] rounded-lg border border-[#ded9d5] bg-[#faf8f6] text-foreground placeholder:text-primary-text/70 outline-none focus:border-primary focus:bg-white"
              />
            </div>

            {/* Visibility & Pricing Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              {/* Visibility */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                  Access Visibility
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setVisibility('public');
                      if (pricingType === 'paid') setPricingType('free');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-[13px] font-semibold transition-all cursor-pointer ${
                      visibility === 'public'
                        ? 'border-primary bg-[#faf0f8] text-primary'
                        : 'border-[#ded9d5] bg-[#faf8f6] text-primary-text hover:bg-white'
                    }`}
                  >
                    <Globe size={14} />
                    <span>Public</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVisibility('private')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-[13px] font-semibold transition-all cursor-pointer ${
                      visibility === 'private'
                        ? 'border-primary bg-[#faf0f8] text-primary'
                        : 'border-[#ded9d5] bg-[#faf8f6] text-primary-text hover:bg-white'
                    }`}
                  >
                    <Lock size={14} />
                    <span>Private</span>
                  </button>
                </div>
              </div>

              {/* Pricing Tier */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                  Pricing Tier
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPricingType('free')}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-[13px] font-semibold transition-all cursor-pointer ${
                      pricingType === 'free'
                        ? 'border-primary bg-[#faf0f8] text-primary'
                        : 'border-[#ded9d5] bg-[#faf8f6] text-primary-text hover:bg-white'
                    }`}
                  >
                    <span>Free</span>
                  </button>

                  <button
                    type="button"
                    disabled={visibility === 'public'}
                    onClick={() => {
                      if (visibility === 'public') {
                        notify.error('Public communities cannot be paid. Set visibility to Private first.');
                        return;
                      }
                      setPricingType('paid');
                    }}
                    className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-[13px] font-semibold transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
                      pricingType === 'paid'
                        ? 'border-primary bg-[#faf0f8] text-primary'
                        : 'border-[#ded9d5] bg-[#faf8f6] text-primary-text hover:bg-white'
                    }`}
                  >
                    <CreditCard size={14} />
                    <span>Paid ($/mo)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Price field if paid */}
            {pricingType === 'paid' && (
              <div className="pt-1">
                <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground/80 mb-1">
                  Monthly Subscription Fee (USD)
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full sm:w-48 px-3.5 py-2 text-[14px] rounded-lg border border-[#ded9d5] bg-[#faf8f6] text-foreground outline-none focus:border-primary focus:bg-white"
                />
              </div>
            )}
          </form>

          {/* Footer (Fixed shrink-0) */}
          <div className="shrink-0 px-6 py-4 border-t border-[#f0ece9] bg-[#faf8f6] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#ded9d5] bg-white hover:bg-[#faf8f6] text-[13.5px] font-semibold text-foreground transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="community-form"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover disabled:opacity-50 text-white text-[13.5px] font-semibold transition-all cursor-pointer"
            >
              {isSubmitting && <Loader2 size={14} className="animate-spin" />}
              <span>{isEditing ? 'Save Changes' : 'Create Community'}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
