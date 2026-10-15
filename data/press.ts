import {
  PressHeroData,
  PressPricingTier,
  PressToolkitAddon,
  PressOfferingItem,
  PressSupportCard,
} from '@/types/press';

export const PRESS_HERO_DATA: PressHeroData = {
  badge: 'Pentasent newsroom',
  highlightedWord: 'healthcare',
  subtitle:
    'Connecting global patients, verified doctors, clinics, hospitals, and innovators in one unified platform, giving modern healthcare everything it needs to advance and heal.',
  metrics: [
    {
      id: 'doctors-clinics',
      label: 'Doctors & Clinics',
      value: '12,000+',
      sublabel: 'Verified Doctors & Clinics',
    },
    {
      id: 'products-tools',
      label: 'Products & Tools',
      value: '2,500+',
      sublabel: 'Healthcare Products & Tools',
    },
    {
      id: 'users-count',
      label: 'Active Users',
      value: '1.5M+',
      sublabel: 'Active Patients & Members',
    },
    {
      id: 'monthly-traffic',
      label: 'Monthly Traffic',
      value: '4.8M+',
      sublabel: 'Monthly Active Visits',
    },
    // {
    //   id: 'global-hubs',
    //   label: 'Global Network',
    //   value: '14+ Hubs',
    //   sublabel: 'Connected Across 4 Continents',
    // },
  ],
};

export const PRESS_CATEGORIES: string[] = [
  'Digital Health & Telemedicine',
  'Biotechnology & Clinical Research',
  'Medical Devices & Diagnostics',
  'Healthcare AI & Data Systems',
  'Hospitals & Clinic Networks',
  'Mental Health & Wellbeing',
  'Pharmaceutical & Therapeutics',
  'Healthcare Policy & Insurance',
  'Funding & Strategic Alliances',
  'General Healthcare Innovation',
];

export const PRESS_BASE_TIERS: PressPricingTier[] = [
  {
    id: 'free-standard',
    name: 'Standard Editorial Review',
    price: 0,
    badge: 'Free (Default)',
    description:
      'Standard editorial review queue. Does not guarantee publication or fixed turnaround timeline.',
    features: [
      'Standard newsroom review queue',
      'Published upon editorial approval',
      'Permanent canonical article URL',
    ],
  },
  {
    id: 'express-24h',
    name: 'Express 24-Hour Publishing',
    price: 49,
    badge: 'Guaranteed 24h',
    description:
      'Fast-track priority editorial processing with guaranteed publication within the next 24 hours.',
    features: [
      'Fast-track editorial review',
      'Guaranteed publish within 24 hours',
      'Immediate search engine indexing',
    ],
  },
];

export const PRESS_TOOLKIT_ADDONS: PressToolkitAddon[] = [
  {
    id: 'backlink',
    title: 'Website / Article Backlink',
    price: 5,
    description: 'Permanent do-follow backlink to your website or product in the published PR.',
  },
  {
    id: 'community-post',
    title: 'Pentasent Community Post',
    price: 15,
    description: 'Featured pin and broadcast in our active healthcare & doctor communities.',
  },
  {
    id: 'social-broadcast',
    title: 'Multi-Channel Social Broadcast',
    price: 35,
    description: 'Custom announcement post across Pentasent LinkedIn, Facebook & Instagram.',
  },
  {
    id: 'banner-highlight',
    title: 'Newsroom & Homepage Banner Highlight',
    price: 75,
    description: 'High-visibility promotional banner placement on Pentasent for 7 days.',
  },
  {
    id: 'podcast-feature',
    title: 'Pentasent Healthcare Podcast Feature',
    price: 150,
    description: 'Dedicated 15-minute executive podcast interview with our healthtech media host.',
  },
];

export const PRESS_OFFERINGS_INFO: PressOfferingItem[] = [
  {
    id: 'social-media',
    title: 'Multi-Channel Social Broadcast',
    badge: 'LinkedIn, Facebook & Instagram',
    description:
      'Direct distribution across our verified network of 12,000+ physicians, hospital executives, healthtech founders, and clinical innovators on LinkedIn, Facebook, and Instagram.',
    placeholderText: 'LinkedIn & Social Media Post Preview Image',
  },
  {
    id: 'editorial-blog',
    title: 'Pentasent Newsroom & Editorial Feature',
    badge: 'Authority Blog & SEO',
    description:
      'Permanent publication in the official Pentasent Newsroom with organic search engine indexing, rich media embeds, canonical attribution, and authoritative healthcare backlinks.',
    placeholderText: 'Editorial Blog & PR Article Preview Image',
  },
  {
    id: 'banner-spotlight',
    title: 'Homepage & Ecosystem Banner Highlight',
    badge: 'Ecosystem Spotlight',
    description:
      'Prominent banner placement on high-traffic Pentasent landing and category pages, seen by over 4.8 million monthly healthcare visitors, driving direct visibility to your announcement.',
    placeholderText: 'Ecosystem & Newsroom Banner UI Preview Image',
  },
];

export const PRESS_SUPPORT_CARDS: PressSupportCard[] = [
  {
    id: 'pr-questions',
    title: 'Questions about PR submission?',
    description:
      'Have questions regarding editorial guidelines, publication turnaround, or distribution toolkits? Visit our help center or send us an email directly.',
    icon: 'help',
    links: [
      {
        label: 'Visit Help Center',
        href: '/help',
      },
      {
        label: 'Send us an email',
        href: 'mailto:press@pentasent.com',
        isExternal: true,
      },
    ],
  },
  {
    id: 'pr-tracker',
    title: 'Press Status Tracker',
    description:
      'Track your press release submission status, review stages, and publication updates in real-time.',
    icon: 'tracker',
    links: [
      {
        label: 'Track your submission',
        href: '/tracker/press-status',
      },
    ],
  },
];
