import {
  TrackerNavTab,
  TrackerPageData,
  JobApplicationTrackerItem,
  PressReleaseTrackerItem,
  SupportTicketTrackerItem,
} from '@/types/trackers';

export const TRACKER_PAGES_DATA: Record<'job-status' | 'press-status' | 'support-status', TrackerPageData> = {
  'job-status': {
    id: 'job-status',
    metadata: {
      title: 'Track Job Application Status | Pentasent Careers',
      description:
        'Track the real-time review progress, interview scheduling, and hiring decisions for positions you applied to at Pentasent.',
    },
    banner: {
      text: 'Pentasent Verification System: Track official job applications. We will never ask for payment or sensitive banking data.',
    },
  },
  'press-status': {
    id: 'press-status',
    metadata: {
      title: 'Track Press Release Status | Pentasent Media',
      description:
        'Track editorial review, fact-checking progress, and syndicated broadcast status of your submitted press releases.',
    },
    banner: {
      text: 'Pentasent Verification System: Track official editorial press submissions. We will never ask for payment or sensitive banking data.',
    },
  },
  'support-status': {
    id: 'support-status',
    metadata: {
      title: 'Track Support Ticket Status | Pentasent Support',
      description:
        'Track resolution progress, queue priority, and specialist updates for your Pentasent support requests.',
    },
    banner: {
      text: 'Pentasent Verification System: Track official support inquiries. We will never ask for payment or sensitive banking data.',
    },
  },
};

export const TRACKER_NAV_TABS: TrackerNavTab[] = [
  {
    title: 'Job Applications',
    href: '/tracker/job-status',
  },
  {
    title: 'Press Releases',
    href: '/tracker/press-status',
  },
  {
    title: 'Support Tickets',
    href: '/tracker/support-status',
  },
];

export const DEMO_JOB_APPLICATIONS: JobApplicationTrackerItem[] = [
  {
    id: 'PNT-198101',
    jobId: 'senior-full-stack-software-engineer',
    jobTitle: 'Senior Full-Stack Software Engineer',
    department: 'Engineering',
    location: 'Bengaluru, India (Remote Available)',
    candidateName: 'Ankit Sharma',
    candidateEmail: 'candidate@example.com',
    appliedDate: 'September 28, 2026',
    status: 'interview_scheduled',
    statusLabel: 'Technical Round Scheduled',
    currentStage: 'Technical Architecture & Coding Interview',
    summary:
      'Your profile has been reviewed by the Engineering hiring team and shortlisted for technical discussions.',
    timeline: [
      {
        title: 'Application Submitted',
        description: 'Candidate submitted credentials and resume.',
        date: 'Sep 28, 2026',
        status: 'completed',
      },
      {
        title: 'Resume & Screening Review',
        description: 'Screening passed by Talent Acquisition team.',
        date: 'Sep 29, 2026',
        status: 'completed',
      },
      {
        title: 'Technical Round Scheduled',
        description: 'Deep-dive session scheduled with Lead Platform Engineer.',
        date: 'Oct 03, 2026',
        status: 'current',
      },
      {
        title: 'Leadership & Culture Fit',
        description: 'Discussion with Engineering Director & Product Lead.',
        status: 'upcoming',
      },
      {
        title: 'Offer & Onboarding',
        description: 'Offer roll-out and pre-joining formalities.',
        status: 'upcoming',
      },
    ],
    nextSteps:
      'Check your registered email (candidate@example.com) for calendar invite and video link for the October 3rd technical session.',
    hiringTeamNote:
      'Strong full-stack and React/Node portfolio. Invited to 60-min interactive system design review.',
  },
  {
    id: 'PNT-482019',
    jobId: 'healthcare-enterprise-sales-manager',
    jobTitle: 'Healthcare Enterprise Sales Manager',
    department: 'Sales & Business Development',
    location: 'Bengaluru, India (Hybrid)',
    candidateName: 'Priya Nair',
    candidateEmail: 'priya.sales@example.com',
    appliedDate: 'September 25, 2026',
    status: 'under_review',
    statusLabel: 'Under Initial Review',
    currentStage: 'Commercial Experience Evaluation',
    summary:
      'Your enterprise healthcare credentials are being evaluated by our Partnerships Director.',
    timeline: [
      {
        title: 'Application Submitted',
        description: 'Candidate submitted B2B healthcare sales experience.',
        date: 'Sep 25, 2026',
        status: 'completed',
      },
      {
        title: 'Portfolio & Deal History Review',
        description: 'Commercial team verifying regional hospital relationships.',
        date: 'Sep 28, 2026',
        status: 'current',
      },
      {
        title: 'Introductory Interview',
        description: 'Discovery session with VP of Growth.',
        status: 'upcoming',
      },
      {
        title: 'Commercial Case Presentation',
        description: 'Institutional pitch simulation.',
        status: 'upcoming',
      },
      {
        title: 'Decision & Next Steps',
        description: 'Final selection and offer roll-out.',
        status: 'upcoming',
      },
    ],
    nextSteps:
      'Our Talent team will update this tracker within 2 business days regarding interview shortlisting.',
    hiringTeamNote:
      'Candidate brings 5+ years selling hospital EHR systems across Karnataka and Maharashtra.',
  },
];

export const DEMO_PRESS_RELEASES: PressReleaseTrackerItem[] = [
  {
    id: 'PR-829104',
    title: 'Pentasent Unveils Next-Gen Clinical AI Diagnostic Agent MAYA',
    category: 'Clinical AI & Innovation',
    companyOrOrganization: 'Global Health Media & Tech Wire',
    submitterName: 'Rohan Mehra',
    submitterEmail: 'media@example.com',
    submittedDate: 'September 27, 2026',
    status: 'editorial_review',
    statusLabel: 'Editorial Review In Progress',
    currentStage: 'Fact-Checking & Clinical Citation Verification',
    summary:
      'Your press release is undergoing review by the Pentasent healthcare editorial board for accuracy and medical terminology adherence.',
    scheduledPublishDate: 'October 4, 2026',
    timeline: [
      {
        title: 'Submission Received',
        description: 'Press release content and media assets uploaded.',
        date: 'Sep 27, 2026',
        status: 'completed',
      },
      {
        title: 'Editorial Review',
        description: 'Clinical citations and claim verification in progress.',
        date: 'Sep 29, 2026',
        status: 'current',
      },
      {
        title: 'Publisher Approval',
        description: 'Editorial board sign-off and syndicate allocation.',
        status: 'upcoming',
      },
      {
        title: 'Network Broadcast',
        description: 'Broadcast across Pentasent verified news channels.',
        date: 'Oct 04, 2026',
        status: 'upcoming',
      },
    ],
    editorialNote:
      'Draft passed preliminary guidelines. Medical editor is reviewing references to regulatory approvals.',
  },
  {
    id: 'PR-910423',
    title: 'Pentasent Expands Institutional Care Network Across 200+ Hospitals',
    category: 'Institutional Growth',
    companyOrOrganization: 'Apex Healthcare Network',
    submitterName: 'Dr. Sunita Rao',
    submitterEmail: 'pr@apexhealth.org',
    submittedDate: 'September 20, 2026',
    status: 'published',
    statusLabel: 'Published & Syndicated',
    currentStage: 'Live across Healthcare Network',
    summary:
      'Your announcement is officially live across the Pentasent Press Wire and syndicated to 4.8M monthly healthcare visitors.',
    scheduledPublishDate: 'September 24, 2026',
    publishedUrl: '/company/press',
    timeline: [
      {
        title: 'Submission Received',
        description: 'Press release uploaded.',
        date: 'Sep 20, 2026',
        status: 'completed',
      },
      {
        title: 'Editorial Review',
        description: 'Verified by Editorial Board.',
        date: 'Sep 21, 2026',
        status: 'completed',
      },
      {
        title: 'Publisher Approved',
        description: 'Approved for institutional syndicate distribution.',
        date: 'Sep 22, 2026',
        status: 'completed',
      },
      {
        title: 'Network Broadcast',
        description: 'Live publication on Pentasent News Wire.',
        date: 'Sep 24, 2026',
        status: 'completed',
      },
    ],
    editorialNote:
      'Published with high visibility across hospital administration feeds.',
  },
];

export const DEMO_SUPPORT_TICKETS: SupportTicketTrackerItem[] = [
  {
    id: 'TCK-481920',
    subject: 'Integration inquiry regarding Clinician Directory FHIR endpoints',
    category: 'Technical & API Support',
    priority: 'High',
    requesterEmail: 'dev@clinicpartners.org',
    createdDate: 'September 29, 2026',
    lastUpdated: 'Today at 3:15 PM',
    status: 'in_progress',
    statusLabel: 'Under Investigation',
    assignedSpecialist: 'Pentasent Platform Support (Level 2)',
    summary:
      'Our API integration engineering team is validating your sandbox credentials and checking webhook delivery logs.',
    timeline: [
      {
        title: 'Ticket Created',
        description: 'Ticket logged via Developer Support Portal.',
        date: 'Sep 29, 2026',
        status: 'completed',
      },
      {
        title: 'Specialist Assigned',
        description: 'Assigned to Level 2 Platform Integration Specialist.',
        date: 'Sep 29, 2026',
        status: 'completed',
      },
      {
        title: 'Technical Investigation',
        description: 'Checking FHIR query rate limits and sandbox authorization.',
        date: 'Sep 30, 2026',
        status: 'current',
      },
      {
        title: 'Resolution & Response',
        description: 'Resolution confirmation and documentation update.',
        status: 'upcoming',
      },
    ],
    resolutionNotes:
      'Identified an outdated OAuth2 token scope. New sandbox credentials will be transmitted to dev@clinicpartners.org.',
  },
];
