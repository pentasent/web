import { BriefcaseBusiness, Building2, CalendarDays, Heart, Microscope, Newspaper, Pill, Stethoscope, Users } from "lucide-react";
import type {
  LandingHeroData,
  SectionCardItem,
  MarqueeItem,
  HighlightCard,
  ExploreCardItem,
  ExploreBannerData,
  ExploreSectionConfig,
} from "@/types/landing";

export type {
  LandingHeroData,
  SectionCardItem,
  MarqueeItem,
  HighlightCard,
  ExploreCardItem,
  ExploreBannerData,
  ExploreSectionConfig,
};

export const LANDING_HERO_DATA: LandingHeroData = {
  watermarkText: 'Pentasent',
  badge: {
    prefix: 'Join ',
    highlight: '500,000+',
    suffix: " Penta's Souls",
  },
  title: {
    line1: 'Healthcare,',
    highlight: 'redefined ',
    line2: 'for real life.',
  },
  description: {
    line1: 'A connected ecosystem for better care, decisions, and everyday wellbeing.',
    line2: 'Discover professionals, communities, and resources all in one place.',
  },
};

export const SectionsCards: SectionCardItem[] = [
  {
    tag: 'My Health',
    tagLine: 'Your health, all in one place',
    titleBefore: 'A more connected',
    titleHighlight: 'health journey',
    titleAfter: 'for everyday life',
    subtitle: 'Understand your health',
    desc: 'Track your health, discover helpful tools, join challenges, build healthier habits, and stay connected with the people and care that support your journey.',
    bg: 'bg-[#deede0]',
    accent: '#398c6e',
    link: 'my-health',
    linkText: 'Explore Health',
    images: {
      portrait:
        '/assets/images/pages/landing/myhealth_single.png',
      walking:
        '/assets/images/pages/landing/myhealth_card_one.png',
      joyful:
        '/assets/images/pages/landing/myhealth_card_temp3.png',
    },
    benifits: [
      'Personal health tracking',
      'Health tools & calculators',
      'Wellness challenges',
      'Health communities',
      'Doctors & care discovery',
    ],
  },

  {
    tag: 'Healthcare',
    tagLine: 'Connect with the people behind healthcare',
    titleBefore: 'Discover the',
    titleHighlight: 'people',
    titleAfter: 'shaping healthcare',
    subtitle: 'Find your healthcare network',
    desc: 'Discover doctors, therapists, researchers, nutritionists, and healthcare professionals by specialty, expertise, location, and interests.',
    bg: 'bg-[#e4ecf2]',
    accent: '#7ba5c9',
    link: 'people',
    linkText: 'Explore People',
    images: {
      portrait:
        '/assets/images/pages/landing/healthcare_doctor.png',
      walking:
        '/assets/images/pages/landing/healthcare_one.png',
      joyful:
        '/assets/images/pages/landing/healthcare_two.png',
    },
    benifits: [
      'Healthcare professionals',
      'Doctors & specialists',
      'Researchers & experts',
      'Professional communities',
      'Events & opportunities',
    ],
  },

  {
    tag: 'Organizations',
    tagLine: 'Discover where healthcare happens',
    titleBefore: 'Connect with',
    titleHighlight: 'organizations',
    titleAfter: 'shaping better care',
    subtitle: 'Explore the healthcare ecosystem',
    desc: 'Find clinics, hospitals, labs, healthtech companies, startups, institutions, and other organizations across the healthcare ecosystem.',
    bg: 'bg-[#f2ebe1]',
    accent: '#a78d7c',
    link: 'organizations',
    linkText: 'Explore Care',
    images: {
      portrait:
        '/assets/images/pages/landing/organizations_new.png',
      walking:
        '/assets/images/pages/landing/organizations_two.png',
      joyful:
        '/assets/images/pages/landing/organizations_one.png',
    },
    benifits: [
      'Clinics & hospitals',
      'Healthcare companies',
      'Labs & health centers',
      'Healthcare opportunities',
      'Organizations & institutions',
    ],
  },

  {
    tag: 'Innovation',
    tagLine: 'Discover what is shaping the future of health',
    titleBefore: 'Explore the',
    titleHighlight: 'ideas and products',
    titleAfter: 'changing healthcare',
    subtitle: 'Discover healthcare innovation',
    desc: 'Explore healthcare products, startups, research, biotech, medtech, AI, and new ideas transforming how people understand and experience health.',
    bg: 'bg-[#f2e6ec]',
    accent: '#d195b7',
    link: 'products',
    linkText: 'Explore Products',
    images: {
      portrait:
        '/assets/images/pages/landing/innovation_capsule.png',
      walking:
        '/assets/images/pages/landing/innovation_two.png',
      joyful:
        '/assets/images/pages/landing/innovation_one.png',
    },
    benifits: [
      'Healthcare products',
      'Healthtech & startups',
      'Biotech & medtech',
      'Research & discoveries',
      'AI & healthcare innovation',
    ],
  },
];


export const marqueeWords: MarqueeItem[] = [
  { label: 'FIND HEALTHCARE PROFESSIONALS', icon: Stethoscope },
  { label: 'DISCOVER CLINICS & ORGANIZATIONS', icon: Building2 },
  { label: 'EXPLORE HEALTHCARE PRODUCTS', icon: Pill },
  { label: 'JOIN HEALTH COMMUNITIES', icon: Users },
  { label: 'DISCOVER HEALTHCARE EVENTS', icon: CalendarDays },
  { label: 'EXPLORE HEALTH RESEARCH', icon: Microscope },
  { label: 'FIND HEALTHCARE JOBS', icon: BriefcaseBusiness },
  { label: 'DISCOVER HEALTHCARE NEWS', icon: Newspaper },
];

export const NEW_HIGHLIGHTS_CARDS: HighlightCard[] = [
  {
    title: 'Healthcare communities',
    description:
      'Find people who share your interests, goals, and experiences, and take part in meaningful conversations around health.',
    action: 'Explore communities',
    image: '/assets/images/pages/landing/new_health_community.png',
    href: '/communities',
  },
  {
    title: 'Events & challenges',
    description:
      'Discover healthcare events, expert sessions, and challenges designed to help you learn, connect, and build healthier habits.',
    action: 'Explore events',
    image: '/assets/images/pages/landing/new_events_challenges.png',
    href: '/events',
  },
  {
    title: 'Healthcare insights',
    description:
      'Stay up to date with healthcare news, research, ideas, and stories shaping how we understand and experience health.',
    action: 'Explore insights',
    image: '/assets/images/pages/landing/new_healthcare_insight.png',
    href: '/blog',
  },
];

export const EXPLORE_ECOSYSTEM_DATA: ExploreSectionConfig = {
  title: 'Start with one thing, discover more',
  subtitle:
    'Every part of Pentasent is built on a unified health ecosystem. The more you explore, the more connected your healthcare journey becomes.',
  cards: [
    {
      id: 'products',
      title: 'Products',
      description:
        'Discover evidence-based wellness essentials, medical devices, healthtech innovations, and everyday health products.',
      actionText: 'Explore products',
      href: '/products',
      // href: '/search?tab=products',
      iconName: 'products',
    },
    {
      id: 'communities',
      title: 'Communities',
      description:
        'Connect with patient circles, condition-focused groups, wellness challenges, and health discussions with peers who understand.',
      actionText: 'Join communities',
      href: '/communities',
      iconName: 'communities',
    },
    {
      id: 'people',
      title: 'People',
      description:
        'Find verified doctors, specialized therapists, medical researchers, clinical practitioners, and nutrition experts.',
      actionText: 'Find professionals',
      href: '/people',
      iconName: 'people',
    },
    {
      id: 'organizations',
      title: 'Organizations',
      description:
        'Explore accredited hospitals, multidisciplinary clinics, specialized labs, research centers, and healthcare companies.',
      actionText: 'Discover organizations',
      href: '/organizations',
      iconName: 'organisations',
    },
    {
      id: 'events',
      title: 'Events',
      description:
        'Participate in medical symposiums, live health workshops, wellness challenges, and expert-led healthcare webinars.',
      actionText: 'Browse events',
      href: '/events',
      iconName: 'events',
    },
    {
      id: 'jobs',
      title: 'Healthcare Jobs',
      description:
        'Discover clinical roles, biomedical research openings, health administration careers, and opportunities in modern healthcare.',
      actionText: 'Explore healthcare jobs',
      href: '/jobs',
      iconName: 'jobs',
    },
  ],
  banner: {
    title: 'Explore the entire Pentasent health ecosystem',
    description:
      'Connect care providers, discover supportive health communities, find innovative products, and access opportunities all on one unified platform.',
    primaryAction: {
      label: 'Get started',
      href: '/auth/register',
    },
    secondaryAction: {
      label: 'Learn more',
      href: '/company/about',
    },
  },
};