export interface PersonOrganization {
  id: string;
  name: string;
  role: string;
}

export interface PersonProfile {
  id: string;
  userId?: string;
  prefix?: string;
  displayName: string;
  headline?: string;
  profession?: string;
  specialty?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  website?: string | null;
  isPremium?: boolean;
  isVip?: boolean;
  isVerified?: boolean;
  interests?: string[];
  organization?: string;
  organizations?: PersonOrganization[];
  memberSince?: string;
  createdAt?: string;
}
