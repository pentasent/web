'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  AlertCircle,
  Building2,
  Globe,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
} from 'lucide-react';
import { CreateProductInput, PricingModel, ProductCardDTO, PublicProductDTO } from '@/types/products';
import { apiClient } from '@/lib/api';
import { notify } from '@/components/ui/toast';
import { invalidateProductsCache } from '@/lib/products-cache';
import { uploadProductMedia, deleteProductMedia } from '@/lib/upload';

interface ProductSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (product: PublicProductDTO) => void;
  editingProduct?: ProductCardDTO | PublicProductDTO | null;
}

const HEALTHCARE_CATEGORIES = [
  { slug: 'healthcare-ai', name: 'Healthcare AI' },
  { slug: 'digital-health', name: 'Digital Health' },
  { slug: 'medical-devices', name: 'Medical Devices' },
  { slug: 'clinical-tools', name: 'Clinical Tools' },
  { slug: 'diagnostics', name: 'Diagnostics' },
  { slug: 'telemedicine', name: 'Telemedicine' },
  { slug: 'health-data', name: 'Health Data' },
  { slug: 'mental-health', name: 'Mental Health' },
  { slug: 'wellness', name: 'Wellness' },
  { slug: 'biotechnology', name: 'Biotechnology' },
  { slug: 'pharmaceuticals', name: 'Pharmaceuticals' },
  { slug: 'patient-care', name: 'Patient Care' },
  { slug: 'provider-tools', name: 'Provider Tools' },
  { slug: 'healthcare-infrastructure', name: 'Healthcare Infrastructure' },
  { slug: 'fitness-activity', name: 'Fitness & Activity' },
  { slug: 'nutrition', name: 'Nutrition' },
  { slug: 'womens-health', name: "Women's Health" },
  { slug: 'preventive-health', name: 'Preventive Health' },
  { slug: 'elder-care', name: 'Elder Care' },
  { slug: 'health-research', name: 'Health Research' },
  { slug: 'medical-education', name: 'Medical Education' },
  { slug: 'other-healthcare-innovation', name: 'Other Healthcare Innovation' },
];

interface ProductSubmitModalContentProps {
  onClose: () => void;
  onSuccess: (product: PublicProductDTO) => void;
  editingProduct?: ProductCardDTO | PublicProductDTO | null;
}

function ProductSubmitModalContent({
  onClose,
  onSuccess,
  editingProduct,
}: ProductSubmitModalContentProps) {
  const isEditing = Boolean(editingProduct);
  const full = editingProduct as PublicProductDTO | null;

  // Form State initialized directly from editingProduct to avoid cascading renders
  const [name, setName] = useState(editingProduct?.name || '');
  const [tagline, setTagline] = useState(editingProduct?.tagline || '');
  const [description, setDescription] = useState(full?.description || '');
  const [problemSolved, setProblemSolved] = useState(full?.problemSolved || '');
  const [targetAudience, setTargetAudience] = useState(full?.targetAudience || '');
  const [websiteUrl, setWebsiteUrl] = useState(full?.websiteUrl || '');
  const [companyName, setCompanyName] = useState(
    editingProduct
      ? ('companyName' in editingProduct
          ? editingProduct.companyName
          : (editingProduct as PublicProductDTO).companyNameSnapshot) || ''
      : ''
  );
  const [categorySlug, setCategorySlug] = useState(editingProduct?.primaryCategory?.slug || 'healthcare-ai');
  const [pricingModel, setPricingModel] = useState<PricingModel>(editingProduct?.pricingModel || 'free');
  const [tagsInput, setTagsInput] = useState(full?.tags && full.tags.length > 0 ? full.tags.join(', ') : '');
  const [logoUrl, setLogoUrl] = useState(editingProduct?.logoUrl || '');
  const [screenshots, setScreenshots] = useState<string[]>(
    full?.screenshots && full.screenshots.length > 0
      ? full.screenshots.map((s) => s.cloudinaryUrl)
      : []
  );
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingScreenshot, setIsUploadingScreenshot] = useState(false);
  const [features, setFeatures] = useState<{ title: string; description: string }[]>(
    full?.features && full.features.length > 0
      ? full.features.map((f) => ({ title: f.title, description: f.description || '' }))
      : [{ title: '', description: '' }]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Logo file upload handler
  const handleLogoFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      notify.error('Please upload an image file (PNG, JPG, WebP, SVG)');
      return;
    }

    const MAX_LOGO_SIZE = 3 * 1024 * 1024; // 3MB
    if (file.size > MAX_LOGO_SIZE) {
      notify.error('Logo image must be smaller than 3MB');
      return;
    }

    setIsUploadingLogo(true);
    try {
      if (logoUrl) {
        void deleteProductMedia(logoUrl, editingProduct?.id);
      }
      const res = await uploadProductMedia(file, 'logo');
      setLogoUrl(res.url);
      notify.success('Logo uploaded successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload logo';
      notify.error(msg);
    } finally {
      setIsUploadingLogo(false);
      e.target.value = '';
    }
  };

  const handleRemoveLogo = async () => {
    if (!logoUrl) return;
    const oldUrl = logoUrl;
    setLogoUrl('');
    try {
      await deleteProductMedia(oldUrl, editingProduct?.id);
      notify.info('Logo removed');
    } catch {
      // Non-blocking
    }
  };

  // Screenshot file upload handler
  const handleScreenshotFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 5 - screenshots.length;
    if (remainingSlots <= 0) {
      notify.warning('Maximum 5 screenshots allowed');
      return;
    }

    const filesToUpload = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      notify.warning(`Maximum 5 screenshots allowed. Processing first ${remainingSlots} image(s).`);
    }

    const MAX_SCREENSHOT_SIZE = 5 * 1024 * 1024; // 5MB
    for (const file of filesToUpload) {
      if (!file.type.startsWith('image/')) {
        notify.error(`"${file.name}" is not a valid image file`);
        return;
      }
      if (file.size > MAX_SCREENSHOT_SIZE) {
        notify.error(`"${file.name}" exceeds 5MB limit`);
        return;
      }
    }

    setIsUploadingScreenshot(true);
    try {
      const uploadPromises = filesToUpload.map((f) => uploadProductMedia(f, 'screenshot'));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.url);
      setScreenshots((prev) => [...prev, ...newUrls].slice(0, 5));
      notify.success(`Uploaded ${newUrls.length} screenshot${newUrls.length > 1 ? 's' : ''}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload screenshot';
      notify.error(msg);
    } finally {
      setIsUploadingScreenshot(false);
      e.target.value = '';
    }
  };

  const handleRemoveScreenshot = async (idx: number) => {
    const urlToRemove = screenshots[idx];
    if (!urlToRemove) return;
    setScreenshots((prev) => prev.filter((_, i) => i !== idx));
    try {
      await deleteProductMedia(urlToRemove, editingProduct?.id);
      notify.info('Screenshot removed');
    } catch {
      // Non-blocking
    }
  };

  // Add / Remove feature inputs
  const handleAddFeature = () => {
    if (features.length < 5) {
      setFeatures([...features, { title: '', description: '' }]);
    }
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handleFeatureChange = (idx: number, field: 'title' | 'description', val: string) => {
    const updated = [...features];
    updated[idx][field] = val;
    setFeatures(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Validation
    if (!name.trim()) {
      setErrorMsg('Product name is required');
      return;
    }
    if (!tagline.trim() || tagline.length < 5) {
      setErrorMsg('Tagline must be at least 5 characters');
      return;
    }
    if (!description.trim() || description.length < 10) {
      setErrorMsg('Description must be at least 10 characters');
      return;
    }
    if (!websiteUrl.trim() || !websiteUrl.startsWith('http')) {
      setErrorMsg('Valid website URL is required (must start with https:// or http://)');
      return;
    }
    if (!logoUrl || !logoUrl.trim()) {
      setErrorMsg('Please upload a product logo');
      return;
    }
    if (isUploadingLogo || isUploadingScreenshot) {
      setErrorMsg('Please wait for media uploads to finish before submitting');
      return;
    }

    const validScreenshots = screenshots.filter((s) => s && s.trim().startsWith('http'));
    const validFeatures = features
      .filter((f) => f.title.trim().length > 0)
      .map((f) => ({ title: f.title.trim(), description: f.description.trim() || undefined }));

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload: CreateProductInput = {
      name: name.trim(),
      tagline: tagline.trim(),
      description: description.trim(),
      problemSolved: problemSolved.trim() || undefined,
      targetAudience: targetAudience.trim() || undefined,
      websiteUrl: websiteUrl.trim(),
      companyNameSnapshot: companyName.trim() || undefined,
      categorySlug,
      pricingModel,
      logoUrl: logoUrl.trim(),
      screenshots: validScreenshots,
      tags: parsedTags,
      features: validFeatures,
    };

    setIsSubmitting(true);
    try {
      if (isEditing && editingProduct) {
        const res = await apiClient<PublicProductDTO>(`/products/${editingProduct.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          invalidateProductsCache(res.data.slug);
          notify.success('Product updated successfully!');
          onSuccess(res.data);
          onClose();
        } else {
          const err = res.error?.message || 'Failed to update product';
          setErrorMsg(err);
          notify.error(err);
        }
      } else {
        const res = await apiClient<PublicProductDTO>('/products', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        if (res.success && res.data) {
          invalidateProductsCache();
          notify.success('Product submitted successfully!');
          onSuccess(res.data);
          onClose();
        } else {
          const err = res.error?.message || 'Failed to create product';
          setErrorMsg(err);
          notify.error(err);
        }
      }
    } catch (err: unknown) {
      const errText = err instanceof Error ? err.message : 'Submission failed';
      setErrorMsg(errText);
      notify.error(errText);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs"
      />

      {/* Modal Dialog Window */}
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-lg border border-[#ded9d5] shadow-2xl z-10 overflow-hidden flex flex-col">
        {/* Header (Fixed shrink-0) */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4.5 border-b border-[#f0ece9] bg-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
              <Sparkles size={11} />
              {isEditing ? 'Product Editor' : 'Launch Directory'}
            </span>
            <h2 className="text-[18px] sm:text-[20px] font-bold text-foreground">
              {isEditing ? 'Update Healthcare Product' : 'Submit Healthcare Product'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-[#faf9f8] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form id="product-submit-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-[13.5px] flex items-center gap-2">
              <AlertCircle size={16} className="text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Section 1: Basic Identity */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-primary border-b border-[#f0ece9] pb-1.5">
              1. Basic Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prod-name" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                  Product Name *
                </label>
                <input
                  id="prod-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. OncoVision AI"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="prod-category" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                  Primary Healthcare Category *
                </label>
                <select
                  id="prod-category"
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary cursor-pointer"
                >
                  {HEALTHCARE_CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="prod-tagline" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                Short Tagline (Elevator Pitch) *
              </label>
              <input
                id="prod-tagline"
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Multi-modal histological cancer boundary segmentation in under 60 seconds"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="prod-desc" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                Detailed Product Description *
              </label>
              <textarea
                id="prod-desc"
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Comprehensive description of how the product works, clinical validation, workflows, and integrations..."
                className="w-full p-3 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prod-problem" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                  Clinical / Workflow Problem Solved
                </label>
                <textarea
                  id="prod-problem"
                  rows={2}
                  value={problemSolved}
                  onChange={(e) => setProblemSolved(e.target.value)}
                  placeholder="What friction, delay, or clinical bottleneck does this eliminate?"
                  className="w-full p-3 rounded-lg border border-[#ded9d5] bg-white text-[13.5px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="prod-audience" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                  Target Audience / Stakeholders
                </label>
                <textarea
                  id="prod-audience"
                  rows={2}
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Pathology Labs, Academic Medical Centers, Cardiologists"
                  className="w-full p-3 rounded-lg border border-[#ded9d5] bg-white text-[13.5px] text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Links & Media */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-primary border-b border-[#f0ece9] pb-1.5">
              2. Links &amp; Media
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prod-website" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                  Official Website URL *
                </label>
                <input
                  id="prod-website"
                  type="url"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourproduct.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary"
                />
              </div>

              {/* Logo Upload Box */}
              <div>
                <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                  Product Logo *
                </label>
                {logoUrl ? (
                  <div className="flex items-center gap-3 p-2.5 rounded-lg border border-[#ded9d5] bg-[#faf9f8]">
                    <div className="w-12 h-12 rounded-md border border-[#e8e4e1] bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={logoUrl} alt="Product Logo" className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-foreground truncate">Logo Uploaded</p>
                      <p className="text-[11.5px] text-emerald-700 flex items-center gap-1 font-medium mt-0.5">
                        <CheckCircle2 size={12} />
                        <span>Ready</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveLogo}
                      disabled={isUploadingLogo}
                      className="p-1.5 rounded-md text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                      title="Remove and delete logo"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor="logo-upload-input"
                    className={`border-2 border-dashed rounded-lg p-2.5 flex items-center justify-center gap-3 cursor-pointer transition-colors ${
                      isUploadingLogo
                        ? 'border-primary/40 bg-[#f4ddf0]/20 pointer-events-none'
                        : 'border-[#ded9d5] hover:border-primary/50 hover:bg-[#faf9f8]'
                    }`}
                  >
                    <input
                      id="logo-upload-input"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      className="hidden"
                      onChange={handleLogoFileSelect}
                      disabled={isUploadingLogo}
                    />
                    {isUploadingLogo ? (
                      <div className="flex items-center gap-2 py-1 text-primary">
                        <Loader2 size={16} className="animate-spin" />
                        <span className="text-[12.5px] font-medium">Uploading logo to Cloudinary...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5 py-0.5 text-primary-text">
                        <Upload size={16} className="text-primary shrink-0" />
                        <div className="text-left">
                          <span className="block text-[12.5px] font-bold text-foreground">Upload Logo</span>
                          <span className="block text-[11px] text-muted-foreground">PNG, JPG, WebP, SVG (max 3MB)</span>
                        </div>
                      </div>
                    )}
                  </label>
                )}
              </div>
            </div>

            {/* Screenshots (up to 5) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <label className="block text-[12px] font-bold uppercase tracking-wider text-foreground">
                    Screenshots / Interface Visuals (Max 5)
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    App interface or product preview screenshots (PNG, JPG, WebP up to 5MB each)
                  </span>
                </div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#f4ddf0] text-primary">
                  {screenshots.length} / 5
                </span>
              </div>

              {/* Grid of uploaded screenshots */}
              {screenshots.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                  {screenshots.map((sUrl, idx) => (
                    <div
                      key={sUrl + idx}
                      className="relative aspect-video rounded-lg border border-[#e8e4e1] bg-[#faf9f8] overflow-hidden group shadow-xs"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sUrl}
                        alt={`Screenshot ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                        #{idx + 1}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveScreenshot(idx)}
                        className="absolute top-1 right-1 p-1 rounded-md bg-white/90 text-foreground hover:text-red-600 hover:bg-white transition-colors opacity-90 group-hover:opacity-100 shadow-xs cursor-pointer"
                        title="Delete screenshot"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Dropzone if < 5 screenshots */}
              {screenshots.length < 5 && (
                <label
                  htmlFor="screenshots-upload-input"
                  className={`border-2 border-dashed rounded-lg p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
                    isUploadingScreenshot
                      ? 'border-primary/40 bg-[#f4ddf0]/20 pointer-events-none'
                      : 'border-[#ded9d5] hover:border-primary/50 hover:bg-[#faf9f8]'
                  }`}
                >
                  <input
                    id="screenshots-upload-input"
                    type="file"
                    multiple
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleScreenshotFileSelect}
                    disabled={isUploadingScreenshot}
                  />
                  {isUploadingScreenshot ? (
                    <div className="flex items-center gap-2 py-1 text-primary">
                      <Loader2 size={16} className="animate-spin" />
                      <span className="text-[12.5px] font-medium">Uploading screenshots to Cloudinary...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload size={18} className="text-primary" />
                      <span className="text-[12.5px] font-bold text-foreground">
                        {screenshots.length === 0 ? 'Upload Product Screenshots' : 'Add More Screenshots'}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Select up to {5 - screenshots.length} image(s) · Max 5MB per file
                      </span>
                    </div>
                  )}
                </label>
              )}
            </div>
          </div>

          {/* Section 3: Company & Business Model */}
          <div className="space-y-4">
            <h3 className="text-[14px] font-bold uppercase tracking-wider text-primary border-b border-[#f0ece9] pb-1.5">
              3. Company &amp; Pricing
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="prod-company" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                  Company / Organization Name (Snapshot)
                </label>
                <input
                  id="prod-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Apex Health Systems"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label htmlFor="prod-pricing" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                  Pricing Model *
                </label>
                <select
                  id="prod-pricing"
                  value={pricingModel}
                  onChange={(e) => setPricingModel(e.target.value as PricingModel)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary cursor-pointer"
                >
                  <option value="free">Free to use</option>
                  <option value="paid_with_free_trial">Paid with free trial</option>
                  <option value="paid">Paid only</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="prod-tags" className="block text-[12px] font-bold uppercase tracking-wider text-foreground mb-1">
                Flexible Tags (Comma-separated)
              </label>
              <input
                id="prod-tags"
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. FHIR, HL7, Radiology, Ambient AI, Telehealth"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#ded9d5] bg-white text-[14px] text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Section 4: Key Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#f0ece9] pb-1.5">
              <h3 className="text-[14px] font-bold uppercase tracking-wider text-primary">
                4. Key Features (Max 5)
              </h3>
              {features.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="inline-flex items-center gap-1 text-[12px] font-bold text-primary hover:underline cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Feature</span>
                </button>
              )}
            </div>

            <div className="space-y-3">
              {features.map((f, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#faf9f8] border border-[#e8e4e1] space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={f.title}
                      onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                      placeholder={`Feature #${idx + 1} Title (e.g. Real-Time Telemetry)`}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-[#ded9d5] bg-white text-[13.5px] font-semibold text-foreground outline-none focus:border-primary"
                    />
                    {features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="p-1.5 text-muted-foreground hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={f.description}
                    onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                    placeholder="Short description of benefits or capabilities..."
                    className="w-full px-3 py-1.5 rounded-lg border border-[#ded9d5] bg-white text-[13px] text-primary-text outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>
          </div>

        </form>

        {/* Footer (Fixed shrink-0 with colored background #faf8f6) */}
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
            form="product-submit-form"
            disabled={isSubmitting || isUploadingLogo || isUploadingScreenshot}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-[13.5px] font-bold transition-all disabled:opacity-50 cursor-pointer shadow-xs"
          >
            {(isSubmitting || isUploadingLogo || isUploadingScreenshot) && <Loader2 size={14} className="animate-spin" />}
            <span>
              {isUploadingLogo || isUploadingScreenshot
                ? 'Uploading Media...'
                : isEditing
                ? 'Save Product Changes'
                : 'Publish Product to Directory'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductSubmitModal({
  isOpen,
  onClose,
  onSuccess,
  editingProduct,
}: ProductSubmitModalProps) {
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
    <ProductSubmitModalContent
      key={editingProduct ? `edit-${editingProduct.id}` : 'new-product'}
      onClose={onClose}
      onSuccess={onSuccess}
      editingProduct={editingProduct}
    />
  );
}
