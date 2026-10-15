export type PressMetric = {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  description?: string;
};

export type PressHeroData = {
  badge: string;
  highlightedWord?: string;
  subtitle: string;
  metrics: PressMetric[];
};

export type PressPricingTier = {
  id: string;
  name: string;
  price: number;
  badge?: string;
  description: string;
  features: string[];
};

export type PressToolkitAddon = {
  id: string;
  title: string;
  price: number;
  description: string;
};

export type PressReleaseSubmission = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  websiteUrl: string;
  title: string;
  category: string;
  releaseDateType: 'immediate' | 'scheduled';
  scheduledDate?: string;
  summary: string;
  content: string;
  bannerFileName?: string;
  documentFileName?: string;
  baseTierId: string;
  selectedToolkitIds: string[];
  totalPrice: number;
  submittedAt: string;
};

export type PressOfferingItem = {
  id: string;
  title: string;
  description: string;
  placeholderText: string;
  badge: string;
};

export type PressSupportLink = {
  label: string;
  href: string;
  isExternal?: boolean;
};

export type PressSupportCard = {
  id: string;
  title: string;
  description: string;
  icon: 'help' | 'tracker';
  links: PressSupportLink[];
};

export interface PressPublishingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  formData: import('@/lib/validations/press').PressReleaseFormData | null;
  bannerFile: File | null;
  documentFile: File | null;
  onConfirm: (payload: unknown) => void;
}
