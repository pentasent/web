export interface DeleteAccountNavSection {
  id: string;
  label: string;
}

export interface DeleteAccountPillar {
  title: string;
  description: string;
  tone: 'danger' | 'warning' | 'neutral';
}

export interface DeletedDataCategory {
  id: string;
  title: string;
  description: string;
  bullets: string[];
}

export interface RetentionRow {
  category: string;
  action: string;
  timeline: string;
  notes: string;
}

export const DELETE_ACCOUNT_NAV_SECTIONS: DeleteAccountNavSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'ecosystem-services', label: 'Managed Services' },
  { id: 'how-to-request', label: 'How to Request' },
  { id: 'data-deleted', label: 'Deleted Data' },
  { id: 'timelines-retention', label: 'Timelines & Billing' },
  { id: 'exit-feedback', label: 'Feedback' },
  { id: 'privacy-questions', label: 'Privacy & GDPR' },
];

export const DELETE_ACCOUNT_HERO = {
  badge: 'Account & Data Governance • Permanent Action',
  title: 'Delete Your Pentasent Account',
  subtitle:
    'Understand how permanent account deletion works, review managed services like products, communities, or hospitals, and submit a verified deletion request.',
  lastUpdated: 'Policy Effective: November 2026 • Irreversible Security Notice',
};

export const DELETE_ACCOUNT_PILLARS: DeleteAccountPillar[] = [
  {
    title: '24-Hour Initiation',
    description:
      'Once your email verification is confirmed, your Pentasent account is deactivated and deletion begins within 24 hours.',
    tone: 'danger',
  },
  {
    title: 'Max 7-Day Full Purge',
    description:
      'All personal, medical, social, and activity data are permanently removed from our active systems within a maximum of 7 days.',
    tone: 'warning',
  },
  {
    title: '1-Year Security Records',
    description:
      'Payment history and essential security audit logs may be retained for up to 1 year for fraud prevention and legal compliance.',
    tone: 'neutral',
  },
];

export const MANAGED_ECOSYSTEM_ITEMS = [
  {
    id: 'products',
    title: 'Healthcare Products & Innovations',
    description:
      'Submitted health tech tools, software, or medical devices you created and publish on Pentasent.',
    requirement: 'Delete your product listings or transfer team ownership before requesting deletion.',
    href: '/account/products',
    linkText: 'Review My Products',
  },
  {
    id: 'communities',
    title: 'Health & Wellness Communities',
    description:
      'Public or private communities where you are currently the primary owner or sole administrator.',
    requirement: 'Close the community or delegate ownership access to another trusted co-admin.',
    href: '/account/communities',
    linkText: 'Review My Communities',
  },
  {
    id: 'organizations',
    title: 'Hospitals, Clinics & Organizations',
    description:
      'Institutional profiles, diagnostic centers, or clinical practices registered under your management.',
    requirement: 'Remove the organization listing or delegate administrative control to an authorized colleague.',
    href: '/account/organizations',
    linkText: 'Review My Organizations',
  },
  {
    id: 'events',
    title: 'Events & Workshops',
    description:
      'Upcoming healthcare webinars, clinical workshops, or community events hosted by your account.',
    requirement: 'Cancel active events or reassign hosting duties before account closure.',
    href: '/account/events',
    linkText: 'Review My Events',
  },
];

export const DELETED_DATA_CATEGORIES: DeletedDataCategory[] = [
  {
    id: 'personal-identity',
    title: 'A. Personal & Identity Information',
    description:
      'All foundational account details and contact information you provided when creating or updating your profile:',
    bullets: [
      'Full name, professional prefix (e.g., Dr., Prof.), display name, and profile biography.',
      'Verified email address, phone number, country code, location, and website URLs.',
      'Demographic attributes such as date of birth, gender, avatar images, and personal interest tags.',
      'Authentication credentials, password hashes, OTP verification records, Google OAuth links, and active sessions.',
    ],
  },
  {
    id: 'clinic-medical',
    title: 'B. Clinic, Hospital & Medical Records (My Health)',
    description:
      'All personal clinical baselines, self-tracked health entries, and medical practice data associated with your account:',
    bullets: [
      'My Health baseline records including height, weight, blood group, and personal wellness notes.',
      'Recorded allergies, adverse reactions, emergency safety contacts, and consent preferences.',
      'Longitudinal vital readings, uploaded lab reports, prescriptions, appointments, and clinical visit logs.',
      'Practitioner credentials, medical council affiliations, and non-delegated clinic/hospital profile ties.',
    ],
  },
  {
    id: 'social-healthcare',
    title: 'C. Social & Healthcare Ecosystem Data',
    description:
      'Your interactions, contributions, and shared community participation across the Pentasent network:',
    bullets: [
      'Community memberships, discussion posts, replies, comments, and content reactions.',
      'Product reviews, ratings, upvotes, followed innovations, and saved healthcare listings.',
      'Event registrations, job applications/bookmarks, and personalized notification preferences.',
    ],
  },
  {
    id: 'history-activity',
    title: 'D. History, Tracking & Activity Logs',
    description:
      'Behavioral logs and self-guided tool calculations generated during your time on Pentasent:',
    bullets: [
      'Health calculator outputs (BMI, BMR, calorie, and health measurement conversion logs).',
      'Mood tracking timelines, habit streaks, and personal goal progress history.',
      'Account usage history, preference tokens, and personalized discovery trails.',
    ],
  },
];

export const RETENTION_TIMELINE_ROWS: RetentionRow[] = [
  {
    category: 'Account Access & Profile',
    action: 'Deactivated & queued for deletion',
    timeline: 'Within 24 Hours',
    notes: 'Login access, public profile visibility, and active sessions are terminated upon verification.',
  },
  {
    category: 'Personal, Medical & Social Data',
    action: 'Permanently purged from active systems',
    timeline: 'Maximum 7 Days',
    notes: 'All personal identity, My Health logs, clinical records, social posts, and activity history are erased.',
  },
  {
    category: 'Subscriptions & Paid Plans',
    action: 'Cancelled at end of plan cycle',
    timeline: 'End of Current Cycle',
    notes: 'Auto-renewal stops immediately; access/billing concludes at the end of your active billing period.',
  },
  {
    category: 'Payment History & Security Logs',
    action: 'Restricted legal & security retention',
    timeline: 'Up to 1 Year',
    notes: 'Invoices, transaction history, fraud-prevention telemetry, and audit logs retained strictly for security and statutory compliance.',
  },
];

export const DELETION_FEEDBACK_REASONS = [
  'Privacy or data security concerns',
  'No longer using Pentasent',
  'Difficulty managing products, communities, or clinics',
  'Missing health or clinical features I need',
  'Technical issues or platform bugs',
  'Subscription or pricing concerns',
  'Switching to another platform',
  'Just creating a fresh / different account',
] as const;

export const DELETE_ACCOUNT_ACTION_CARDS = [
  {
    icon: 'shield' as const,
    title: 'Privacy Policy',
    description:
      'Review how Pentasent encrypts health data, honors GDPR/CCPA rights, and maintains zero health ad-selling.',
    linkText: 'Read Privacy Policy',
    linkHref: '/legal/privacy',
  },
  {
    icon: 'fileText' as const,
    title: 'Terms & Conditions',
    description:
      'Understand platform rules, subscription responsibilities, and healthcare ecosystem guidelines.',
    linkText: 'Read Terms & Conditions',
    linkHref: '/legal/terms',
  },
  {
    icon: 'mail' as const,
    title: 'Contact Support',
    description:
      'Looking for something special or need assistance? Our support team is always ready to help.',
    linkText: 'Contact Pentasent Support',
    linkHref: '/company/contact',
  },
];

