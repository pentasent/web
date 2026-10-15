export type TrackerNavTab = {
  title: string;
  href: string;
  badge?: string;
};

export interface TrackerVerificationBanner {
  text: string;
}

export interface TrackerPageData {
  id: 'job-status' | 'press-status' | 'support-status';
  metadata: {
    title: string;
    description: string;
  };
  banner: TrackerVerificationBanner;
}

export interface TrackerTimelineStep {
  title: string;
  description: string;
  date?: string;
  status: 'completed' | 'current' | 'upcoming';
}

export type JobApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisted'
  | 'interview_scheduled'
  | 'offer_extended'
  | 'not_selected'
  | 'withdrawn'
  | 'closed';

export interface JobApplicationTrackerItem {
  id: string;
  jobId: string;
  jobTitle: string;
  department: string;
  location: string;
  candidateName: string;
  candidateEmail: string;
  appliedDate: string;
  status: JobApplicationStatus;
  statusLabel: string;
  currentStage: string;
  summary: string;
  timeline: TrackerTimelineStep[];
  nextSteps: string;
  hiringTeamNote?: string;
}

export type PressReleaseStatus =
  | 'submitted'
  | 'editorial_review'
  | 'approved'
  | 'scheduled'
  | 'published';

export interface PressReleaseTrackerItem {
  id: string;
  title: string;
  category: string;
  companyOrOrganization: string;
  submitterName: string;
  submitterEmail: string;
  submittedDate: string;
  status: PressReleaseStatus;
  statusLabel: string;
  currentStage: string;
  summary: string;
  scheduledPublishDate?: string;
  publishedUrl?: string;
  timeline: TrackerTimelineStep[];
  editorialNote?: string;
}

export type SupportTicketStatus =
  | 'pending'
  | 'triaged'
  | 'assigned'
  | 'in_progress'
  | 'waiting_internal'
  | 'waiting_external'
  | 'waiting_on_customer'
  | 'resolved'
  | 'closed'
  | 'rejected'
  | 'cancelled'
  | string;

export interface SupportTicketTrackerItem {
  id: string;
  ticketNumber?: string;
  subject: string;
  category: string;
  categoryLabel?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent' | string;
  priorityLabel?: string;
  requesterEmail: string;
  createdDate: string;
  lastUpdated: string;
  status: SupportTicketStatus;
  statusLabel: string;
  assignedSpecialist: string;
  summary: string;
  timeline: TrackerTimelineStep[];
  resolutionNotes?: string | null;
}
