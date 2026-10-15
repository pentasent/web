export type CommunityRole = 'owner' | 'admin' | 'manager' | 'member';
export type CommunityMembershipStatus = 'pending' | 'active' | 'rejected' | 'suspended' | 'left' | 'removed';
export type ReactionType = 'like' | 'love' | 'celebrate' | 'support' | 'insightful' | 'curious';

export interface CommunityMembershipInfo {
  isMember: boolean;
  role: CommunityRole | null;
  status: CommunityMembershipStatus | null;
  requiresPayment: boolean;
  requiresRules: boolean;
  hasAcceptedRules: boolean;
}

export interface PublicCommunityDTO {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string;
  iconUrl: string;
  bannerUrl: string | null;
  visibility: 'public' | 'private';
  pricingType: 'free' | 'paid';
  price: number;
  currency: string;
  billingPeriod: string;
  status: string;
  memberCount: number;
  postCount: number;
  isFeatured: boolean;
  tags: string[];
  owner: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    headline: string | null;
  } | null;
  membership?: CommunityMembershipInfo | null;
  createdAt: string;
}

export interface CommunityPostCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export interface CommunityRule {
  id: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isRequired: boolean;
}

export interface CommunityDetailDTO extends PublicCommunityDTO {
  settings: {
    rulesEnabled: boolean;
    dailyPostLimit: number | null;
    memberDirectoryVisibility: string;
    allowMemberReshare: boolean;
    allowMemberMentions: boolean;
    allowMemberLinks: boolean;
    allowMemberMedia: boolean;
  };
  categories: CommunityPostCategory[];
  rules: CommunityRule[];
  ruleVersionId?: string | null;
}

export interface CommunityMemberDTO {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  headline: string | null;
  role: CommunityRole;
  status: CommunityMembershipStatus;
  joinedAt: string;
}

export interface CommunityPostReactionSummary {
  like: number;
  love: number;
  celebrate: number;
  support: number;
  insightful: number;
  curious: number;
  total: number;
}

export interface CommunityCommentDTO {
  id: string;
  postId: string;
  parentCommentId: string | null;
  depth: number;
  body: string;
  status: string;
  likeCount: number;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    headline: string | null;
  };
  replies?: CommunityCommentDTO[];
}

export interface CommunityPostDTO {
  id: string;
  communityId: string;
  author: {
    id: string;
    displayName: string;
    avatarUrl: string | null;
    headline: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  postType: string;
  title: string | null;
  body: string;
  status: string;
  isFeatured: boolean;
  media: {
    id: string;
    mediaType: string;
    cloudinaryUrl: string;
    width: number | null;
    height: number | null;
  }[];
  reactionSummary: CommunityPostReactionSummary;
  viewerReaction: ReactionType | null;
  commentCount: number;
  reshareCount: number;
  viewerHasReshared?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommunityResourceDTO {
  id: string;
  communityId: string;
  title: string;
  description: string | null;
  resourceType: string;
  externalUrl: string | null;
  cloudinaryUrl: string | null;
  createdAt: string;
  author: {
    id: string;
    displayName: string;
  };
}

export interface CreateCommunityInput {
  name: string;
  tagline?: string | null;
  description: string;
  iconUrl: string;
  iconCloudinaryPublicId?: string | null;
  bannerUrl?: string | null;
  bannerCloudinaryPublicId?: string | null;
  visibility: 'public' | 'private';
  pricingType: 'free' | 'paid';
  price?: number;
  currency?: string;
  billingPeriod?: string;
  tags?: string[];
  rules?: { title: string; description?: string | null }[];
}

export interface UpdateCommunityInput {
  name?: string;
  tagline?: string | null;
  description?: string;
  iconUrl?: string;
  iconCloudinaryPublicId?: string | null;
  bannerUrl?: string | null;
  bannerCloudinaryPublicId?: string | null;
  visibility?: 'public' | 'private';
  pricingType?: 'free' | 'paid';
  price?: number;
  currency?: string;
  billingPeriod?: string;
  tags?: string[];
  dailyPostLimit?: number | null;
  memberDirectoryVisibility?: 'public' | 'members_only' | 'hidden';
}

// Backward compatible alias
export interface CommunityItem extends Partial<PublicCommunityDTO> {
  id: string;
  name: string;
  slug: string;
  topic?: string;
  description: string;
  memberCount: number;
  isPrivate?: boolean;
  featuredDiscussionsCount?: number;
  tags?: string[];
  imageUrl?: string;
}
