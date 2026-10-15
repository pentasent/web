export type JobOpening = {
  id: string;
  slug: string;
  title: string;
  department: string;
  departmentSlug: string;
  location: string;
  locationType: 'Remote' | 'Hybrid' | 'On-site';
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  experienceLevel: string;
  salary: string;
  timing: string;
  postedDate: string;
  summary: string;
  overview: string[];
  responsibilities: string[];
  mustHaveQualifications: string[];
  goodToHaveQualifications: string[];
  benefits: string[];
  aboutTeam: string;
  aboutCompany?: string | null;
  employerName?: string;
  organizationName?: string;
  applicationMode?: 'platform' | 'external';
  externalApplyUrl?: string | null;
  isPromoted?: boolean;
  viewsCount?: number;
  applicationsCount?: number;
  sourceType?: string;
  status?: string;
  verificationStatus?: string;
  createdByUserId?: string | null;
  closedAt?: string | null;
  createdAt?: string;
};

export type JobFilterState = {
  department: string;
  location: string;
  searchQuery: string;
  locationType?: string;
  employmentType?: string;
};

export interface CandidateSafetyBannerData {
  prefix: string;
  domain: string;
  suffix: string;
}

export interface OpenRolesPageData {
  metadata: {
    title: string;
    description: string;
  };
  banner: CandidateSafetyBannerData;
  header: {
    title: string;
    line1: string;
    line2: string;
  };
}

export interface JobDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export interface JobDetailViewProps {
  job: JobOpening;
  basePath?: string;
}

export interface TrackerTimelineStepDto {
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming';
}

export interface JobApplicationPublicDto {
  id: string; // trackingNumber e.g. APP-198101
  jobId: string;
  jobSlug?: string;
  jobTitle: string;
  department: string;
  location: string;
  candidateName: string;
  candidateEmail: string;
  appliedDate: string;
  status: string;
  statusLabel: string;
  currentStage: string;
  summary: string;
  timeline: TrackerTimelineStepDto[];
  nextSteps?: string;
  hiringTeamNote?: string;
}

export interface RecruiterCandidateDto {
  id: string;
  trackingNumber: string;
  jobId: string;
  jobTitle: string;
  candidateName: string;
  candidateEmail: string;
  candidatePhone?: string | null;
  candidateLocation?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  resumeUrl: string;
  resumeOriginalFilename?: string | null;
  coverLetter?: string | null;
  experienceYears?: string | null;
  earliestStartDate?: string | null;
  expectedSalary?: string | null;
  status: string;
  statusLabel: string;
  currentStage: string;
  currentStageLabel: string;
  appliedAt: string;
  hiringTeamNote?: string | null;
  nextSteps?: string | null;
}

