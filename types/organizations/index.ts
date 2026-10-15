export type OrganizationType =
  | 'hospital'
  | 'clinic'
  | 'healthtech'
  | 'biotech'
  | 'wellness'
  | 'research_institution'
  | 'community_initiative'
  | 'other';

export interface OrganizationItem {
  id: string;
  name: string;
  slug: string;
  type: OrganizationType;
  typeLabel: string;
  description: string;
  logoUrl?: string;
  website?: string;
  location: string;
  isVerified: boolean;
  facilityCount?: number;
  specialties?: string[];
}
