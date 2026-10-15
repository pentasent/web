import type { UserAccount, QuickSuggestion } from "@/types/nav";
import {
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  HeartPulse,
  Info,
  Layers,
  Newspaper,
  Sparkles,
  Stethoscope,
  Users,
  Wrench,
} from "lucide-react";

export interface DrawerMenuItem {
  label: string;
  href: string;
  description?: string;
  badge?: string;
}

export interface DrawerMenuSection {
  id: string;
  title: string;
  items: DrawerMenuItem[];
}

export const DRAWER_FEATURED_ITEM: DrawerMenuItem = {
  label: 'My Health',
  href: '/my-health',
  description: 'Track personal metrics, health calculators (BMI, BMR), goals, and supportive wellness communities.',
  badge: 'Featured',
};

export const DRAWER_MENU_SECTIONS: DrawerMenuSection[] = [
  {
    id: 'ecosystem',
    title: 'Ecosystem & Community',
    items: [
      { label: 'Products', href: '/products', description: 'Healthcare products, medtech & digital health' },
      { label: 'Communities', href: '/communities', description: 'Patient & clinician peer support networks' },
      { label: 'Organizations', href: '/organizations', description: 'Leading hospitals, clinics & institutes' },
      { label: 'Events', href: '/events', description: 'Medical conferences, webinars & summits' },
      { label: 'Healthcare Global Jobs', href: '/jobs', description: 'Worldwide medical & clinical career openings' },
      { label: 'People & Practitioners', href: '/people', description: 'Verified clinicians, specialists & researchers' },
    ],
  },
  {
    id: 'tools',
    title: 'Clinical & Health Tools',
    items: [
      { label: 'All Clinical Tools', href: '/tools', description: 'Full suite of health assessment tools' },
      { label: 'BMI Calculator', href: '/tools/bmi-calculator', description: 'Body Mass Index & weight category analysis' },
      { label: 'BMR Calculator', href: '/tools/bmr-calculator', description: 'Basal Metabolic Rate & caloric expenditure' },
      { label: 'Calorie Calculator', href: '/tools/calorie-calculator', description: 'Daily caloric intake & maintenance targets' },
      { label: 'Health Measurement Calculator', href: '/tools/health-measurement-calculator', description: 'Comprehensive body metric evaluation' },
    ],
  },
  {
    id: 'company',
    title: 'Company & Research',
    items: [
      { label: 'Press & Media', href: '/company/press', description: 'News, media coverage & official statements' },
      { label: 'Pentasent Hiring', href: '/company/careers', description: 'Join our team across engineering & health', badge: 'Hiring' },
      { label: 'Pricing & Plans', href: '/pricing', description: 'Transparent access tiers for members & teams' },
      { label: 'Investors & Governance', href: '/company/investors', description: 'Investor relations, stakeholders & governance' },
      { label: 'Research & Publications', href: '/company/careers/research', description: 'Peer-reviewed studies & clinical datasets' },
      { label: 'Life at Pentasent', href: '/company/life', description: 'Our culture, values & healthcare commitment' },
      { label: 'About Us', href: '/company/about', description: 'Our founding story, mission & clinical ethics' },
    ],
  },
  {
    id: 'trackers',
    title: 'Application Trackers',
    items: [
      { label: 'Press Application Status', href: '/tracker/press-status', description: 'Track pending press inquiries & media requests' },
      { label: 'Job Application Status', href: '/tracker/job-status', description: 'Track your submitted career applications' },
      { label: 'Support Ticket Status', href: '/tracker/support-status', description: 'Real-time updates on active support tickets' },
      { label: 'All Status Trackers', href: '/tracker', description: 'Centralized portal for all application statuses' },
    ],
  },
  {
    id: 'legal',
    title: 'Legal & Compliance',
    items: [
      { label: 'Privacy Policy', href: '/legal/privacy', description: 'Data protection, HIPAA compliance & encryption' },
      { label: 'Terms of Service', href: '/legal/terms', description: 'Usage agreements, guidelines & medical disclaimer' },
      { label: 'Cookie Policy', href: '/legal/cookies', description: 'Cookie usage, consent tracking & preferences' },
    ],
  },
];

export const menuItems = [
  {
    label: 'People',
    href: '/people',
  },
  {
    label: 'Organizations',
    href: '/organizations',
  },
  {
    label: 'Products',
    href: '/products',
  },
  {
    label: 'Communities',
    href: '/communities',
  },
  {
    label: 'Events',
    href: '/events',
  },
  {
    label: 'Jobs',
    href: '/jobs',
  },
  {
    label: 'Research',
    href: '/research',
  },
  {
    label: 'News',
    href: '/news',
  },
  {
    label: 'Tools',
    href: '/tools',
  }
];


export const MOCK_USER: UserAccount = {
  name: 'Dr. Ankit Kumar',
  email: 'ankit.kumar@pentasent.com',
  avatar: '/assets/images/avatars/men/char1.svg',
  accountFlag: 'doctor',
  tags: ['Premium', 'VIP'],
};

export const PENTASENT_OFFERINGS = [
  {
    id: 'my-health',
    title: 'My Health',
    icon: HeartPulse,
    description: 'Track personal metrics, health calculators (BMI, BMR), goals, and supportive wellness communities.',
  },
  {
    id: 'healthcare',
    title: 'Healthcare',
    icon: Stethoscope,
    description: 'Discover and connect with verified doctors, therapists, practitioners, and clinical specialists.',
  },
  {
    id: 'organizations',
    title: 'Organizations',
    icon: Building2,
    description: 'Explore leading hospitals, diagnostic clinics, healthtech companies, and healthcare institutes.',
  },
  {
    id: 'innovation',
    title: 'Innovation',
    icon: Sparkles,
    description: 'Discover healthcare products, medtech breakthroughs, clinical research, and digital health AI.',
  },
];

export const SEARCH_FILTERS = [
  { id: 'all', label: 'All', icon: Layers, placeholder: 'Search people, tools, products, communities, jobs...' },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope, placeholder: 'Search doctors, specialists, physicians, surgeons...' },
  { id: 'people', label: 'People', icon: Users, placeholder: 'Search practitioners, healthcare founders, experts...' },
  { id: 'products', label: 'Products', icon: Sparkles, placeholder: 'Search healthcare products, medtech devices, health solutions...' },
  { id: 'tools', label: 'Tools', icon: Wrench, placeholder: 'Search health calculators (BMI, BMR), tracking tools...' },
  { id: 'blogs', label: 'News & Blogs', icon: Newspaper, placeholder: 'Search healthcare insights, clinical articles, stories...' },
  { id: 'communities', label: 'Communities', icon: Users, placeholder: 'Search health support groups, wellness challenges...' },
  { id: 'events', label: 'Events', icon: Calendar, placeholder: 'Search healthcare webinars, conferences, medical summits...' },
  { id: 'jobs', label: 'Jobs', icon: Briefcase, placeholder: 'Search healthcare job openings, clinical roles, careers...' },
  // { id: 'research', label: 'Research', icon: BookOpen, placeholder: 'Search medical research, clinical studies, published papers...' },
  { id: 'about', label: 'About Company', icon: Info, placeholder: 'Learn about Pentasent, mission, team, and company story...' },
];

export const QUICK_SUGGESTIONS: QuickSuggestion[] = [
  { label: 'BMI Calculator', href: '/tools/bmi-calculator', category: 'tools' },
  { label: 'Cardiologist', href: '/people?q=Cardiologist', category: 'doctors' },
  { label: 'Mental Health Community', href: '/communities?q=Mental+Health', category: 'communities' },
  { label: 'Healthcare Global Jobs', href: '/jobs', category: 'jobs' },
  { label: 'Clinical Trials', href: '/research?q=Clinical+Trials', category: 'research' },
  { label: 'Digital Health AI', href: '/products?q=AI', category: 'products' },
  { label: 'Healthcare News & Insights', href: '/blog', category: 'blogs' },
  { label: 'About Pentasent', href: '/company/about', category: 'about' },
];