import type { LucideIcon } from 'lucide-react';

export interface LandingHeroData {
  watermarkText: string;
  badge: {
    prefix: string;
    highlight: string;
    suffix: string;
  };
  title: {
    line1: string;
    highlight: string;
    line2: string;
  };
  description: {
    line1: string;
    line2: string;
  };
}

export interface SectionCardImages {
  portrait: string;
  walking: string;
  joyful: string;
}

export interface SectionCardItem {
  tag: string;
  tagLine: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  desc: string;
  bg: string;
  accent: string;
  link: string;
  linkText: string;
  images: SectionCardImages;
  benifits: string[];
}

export type SectionCard = SectionCardItem;

export interface ImageCardProps {
  src?: string;
  alt?: string;
  className?: string;
  imageClassName?: string;
  delay?: number;
}

export interface BenefitSectionProps {
  card: SectionCard;
}

export interface HeadingBlockProps {
  card: SectionCard;
}

export interface MarqueeItem {
  label: string;
  icon: LucideIcon;
}

export interface HighlightCard {
  title: string;
  description: string;
  action: string;
  image: string;
  href: string;
}

export interface ExploreCardItem {
  id: string;
  title: string;
  description: string;
  actionText: string;
  href: string;
  iconName: 'products' | 'communities' | 'people' | 'organisations' | 'events' | 'jobs';
}

export interface ExploreBannerAction {
  label: string;
  href: string;
}

export interface ExploreBannerData {
  title: string;
  description: string;
  primaryAction: ExploreBannerAction;
  secondaryAction: ExploreBannerAction;
}

export interface ExploreSectionConfig {
  tagline?: string;
  title: string;
  subtitle: string;
  cards: ExploreCardItem[];
  banner: ExploreBannerData;
}

export interface FeedbackReview {
  id: string;
  type: 'review';
  author: string;
  role?: string;
  rating: number;
  content: string;
  bg?: string;
}

export interface FeedbackPhoto {
  id: string;
  type: 'photo';
  image: string;
  alt: string;
}

export type FeedbackItem = FeedbackReview | FeedbackPhoto;

export interface FeedbackSectionData {
  tagline: string;
  titleBefore: string;
  titleHighlight: string;
  titleAfter: string;
  subtitle: string;
  row1: FeedbackItem[];
  row2: FeedbackItem[];
}
