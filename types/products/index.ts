export type PricingModel = 'free' | 'paid' | 'paid_with_free_trial';

export type LaunchStatus = 'upcoming' | 'launched' | 'beta' | 'active' | 'discontinued';

export interface ProductCategoryItem {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  productCount?: number;
}

export interface ProductCardDTO {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description?: string;
  logoUrl: string | null;
  companyName: string | null;
  primaryCategory: {
    id: string;
    slug: string;
    name: string;
  };
  pricingModel: PricingModel;
  upvoteCount: number;
  followerCount: number;
  averageRating: number | null;
  reviewCount: number;
  isFeatured: boolean;
  isVerified: boolean;
  hasUpvoted?: boolean;
  hasFollowed?: boolean;
  websiteUrl?: string;
  launchDate?: string | null;
  launchStatus?: LaunchStatus;
  launchVersion?: string | null;
  recommendationPercentage?: number | null;
  publishedAt: string | null;
  createdAt: string;
}

export interface ProductFeatureDTO {
  id: string;
  title: string;
  description?: string | null;
  sortOrder: number;
}

export interface ProductMediaDTO {
  id: string;
  mediaType: 'logo' | 'screenshot';
  cloudinaryUrl: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductPricingPlanDTO {
  id: string;
  name: string;
  description?: string | null;
  amountMinor?: number | null;
  currency?: string | null;
  billingPeriod?: string | null;
  isFree: boolean;
  hasFreeTrial: boolean;
  trialDays?: number | null;
  isBest: boolean;
  sortOrder: number;
}

export interface ProductSocialLinkDTO {
  id: string;
  platform: string;
  url: string;
}

export interface ProductPersonDTO {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  roleType: string;
  roleTitle?: string | null;
}

export interface ProductReviewDTO {
  id: string;
  rating: number;
  feedback: string;
  whatYouLike?: string | null;
  whatYouDislike?: string | null;
  wouldRecommend: boolean;
  reviewer: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    headline?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProductCommentDTO {
  id: string;
  parentCommentId?: string | null;
  depth: number;
  body: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl?: string | null;
    isMaker?: boolean;
  };
  replies?: ProductCommentDTO[];
  createdAt: string;
}

export interface ProductViewerState {
  hasUpvoted: boolean;
  hasFollowed: boolean;
  canReview: boolean;
  isOwner: boolean;
  userReview?: ProductReviewDTO | null;
}

export interface PublicProductDTO {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  problemSolved?: string | null;
  targetAudience?: string | null;
  websiteUrl: string;

  creatorUserId: string;
  organizationId?: string | null;
  companyNameSnapshot?: string | null;
  companyDescriptionSnapshot?: string | null;

  status: string;
  isVerified: boolean;
  isFeatured: boolean;
  pricingModel: PricingModel;

  launchDate?: string | null;
  launchStatus?: string | null;
  launchVersion?: string | null;
  launchNote?: string | null;

  upvoteCount: number;
  followerCount: number;

  primaryCategory: {
    id: string;
    slug: string;
    name: string;
  };
  tags: string[];

  logoUrl: string | null;
  screenshots: ProductMediaDTO[];
  features: ProductFeatureDTO[];
  pricingPlans: ProductPricingPlanDTO[];
  socialLinks: ProductSocialLinkDTO[];
  makers: ProductPersonDTO[];

  averageRating: number | null;
  reviewCount: number;
  recommendationPercentage: number | null;
  reviews: ProductReviewDTO[];

  comments: ProductCommentDTO[];
  viewerState?: ProductViewerState;

  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  tagline: string;
  description: string;
  problemSolved?: string | null;
  targetAudience?: string | null;
  websiteUrl: string;
  companyNameSnapshot?: string | null;
  companyDescriptionSnapshot?: string | null;
  categorySlug: string;
  pricingModel: PricingModel;
  logoUrl: string;
  screenshots?: string[];
  tags?: string[];
  features?: { title: string; description?: string | null }[];
  pricingPlans?: {
    name: string;
    description?: string | null;
    amountMinor?: number | null;
    currency?: string;
    billingPeriod?: 'monthly' | 'yearly' | 'one_time' | null;
    isFree?: boolean;
    hasFreeTrial?: boolean;
    trialDays?: number | null;
    isBest?: boolean;
  }[];
  socialLinks?: {
    platform: 'twitter' | 'linkedin' | 'facebook' | 'github' | 'youtube' | 'instagram' | 'website';
    url: string;
  }[];
}

// Backward-compatible ProductItem interface
export interface ProductItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category?: string;
  categoryLabel?: string;
  organizationName?: string;
  logoUrl?: string;
  website?: string;
  pricingType?: string;
  isVerified: boolean;
  tags?: string[];
  companyName?: string | null;
  primaryCategory?: {
    id: string;
    slug: string;
    name: string;
  };
  pricingModel?: PricingModel;
  upvoteCount?: number;
  followerCount?: number;
  averageRating?: number | null;
  reviewCount?: number;
  isFeatured?: boolean;
}
