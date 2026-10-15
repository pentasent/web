import { SupportArticle, StakeholderCard, ContactPageContent } from '@/types/contact';

export const INQUIRY_TYPES = [
  'Healthcare Professional (Claim profile, join network)',
  'Hospital / Clinic / Healthcare Organization',
  'Healthtech Founder / Innovation / Product Listing',
  'Clinical Research & Academic Collaboration',
  'Community Member / Personal Health Tools',
  'Partnership, Press & Media Inquiry',
];

export const employeeRanges = [
  'Solo practitioner / Independent',
  '1-10 healthcare staff',
  '11-50 healthcare staff',
  '51-200 healthcare staff',
  '201-500 healthcare staff',
  '501+ enterprise / hospital network',
];

export const CONTACT_PAGE_CONTENT: ContactPageContent = {
  formTitle: 'Talk to sales',
  supportTitle: 'Talk to support',
};

export const CONTACT_SUPPORT_ARTICLES: SupportArticle[] = [
  {
    id: 'practitioners-clinicians',
    title: 'Healthcare Practitioners & Clinicians',
    parts: [
      { text: "If you're a healthcare practitioner, physician, therapist, or clinical specialist on Pentasent, " },
      { text: 'visit the Provider Help Center', isLink: true, href: '/help' },
      { text: ' to manage your verified profile and directory presence.' },
    ],
  },
  {
    id: 'hospitals-organizations',
    title: 'Hospitals & Healthcare Organizations',
    parts: [
      { text: 'If your clinic, diagnostic center, or hospital is part of the Pentasent ecosystem, ' },
      { text: 'visit the Organization Portal', isLink: true, href: '/help' },
      { text: ' for account assistance. For institutional integrations, contact your Pentasent ecosystem partner lead.' },
    ],
  },
  {
    id: 'healthtech-innovators',
    title: 'Healthtech Innovators & Research Partners',
    parts: [
      { text: 'If you are a healthtech partner, research institution, or digital health founder integrating products into Pentasent and require assistance, please contact us at ' },
      { text: 'support@pentasent.com', isLink: true, href: 'mailto:support@pentasent.com' },
      { text: ' or call our partnership desk at ' },
      { text: '1-800-984-6395', isLink: true, href: 'tel:18009846395' },
      { text: '.' },
    ],
  },
];

export const CONTACT_STAKEHOLDER_CARDS: StakeholderCard[] = [
  {
    id: 'clinical-practices',
    title: 'Clinical practices',
    description: 'Are you a private medical clinic or physician group in need of assistance?',
    icon: 'stethoscope',
    actionText: 'Contact us',
    actionHref: 'mailto:support@pentasent.com',
  },
  {
    id: 'research-institutions',
    title: 'Research & institutions',
    description: 'Are you an academic research institution or hospital network in need of assistance?',
    icon: 'building',
    actionText: 'Contact us',
    actionHref: 'mailto:partners@pentasent.com',
  },
];