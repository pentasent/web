import { AccountNavTab, CountryCodeOption, ProfilePrefix, ProfileGender } from '@/types/account';

export const ACCOUNT_NAV_TABS: AccountNavTab[] = [
  {
    id: 'profile',
    title: 'Profile & Identity',
    href: '/account/profile',
    icon: 'user',
  },
  {
    id: 'settings',
    title: 'Account Settings',
    href: '/account/settings',
    icon: 'settings',
  },
  {
    id: 'notifications',
    title: 'Notifications',
    href: '/account/notifications',
    icon: 'bell',
  },
  {
    id: 'my-health',
    title: 'My Health',
    href: '/my-health',
    icon: 'heart',
  },
  {
    id: 'products',
    title: 'My Products',
    href: '/account/products',
    icon: 'package',
  },
  {
    id: 'communities',
    title: 'My Communities',
    href: '/account/communities',
    icon: 'users',
  },
  {
    id: 'events',
    title: 'My Events',
    href: '/account/events',
    icon: 'calendar',
  },
  {
    id: 'jobs',
    title: 'My Jobs',
    href: '/account/jobs',
    icon: 'briefcase',
  },
  {
    id: 'organizations',
    title: 'My Organizations',
    href: '/account/organizations',
    icon: 'building',
    badge: 'Preview',
    isPlaceholder: true,
  },
];

export const PROFILE_PREFIX_OPTIONS: { label: string; value: ProfilePrefix }[] = [
  { label: 'Select prefix (optional)', value: '' },
  { label: 'Dr.', value: 'Dr.' },
  { label: 'Prof.', value: 'Prof.' },
  { label: 'Mr.', value: 'Mr.' },
  { label: 'Ms.', value: 'Ms.' },
  { label: 'Mrs.', value: 'Mrs.' },
  { label: 'Miss', value: 'Miss' },
];

export const PROFILE_GENDER_OPTIONS: { label: string; value: ProfileGender }[] = [
  { label: 'Select gender (optional)', value: '' },
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Transgender', value: 'transgender' },
  { label: 'Prefer Not to Say', value: 'prefer_not_to_say' },
  { label: 'Other', value: 'other' },
];

export const MONTH_OPTIONS = [
  { value: '', label: 'Month' },
  { value: '01', label: 'January' },
  { value: '02', label: 'February' },
  { value: '03', label: 'March' },
  { value: '04', label: 'April' },
  { value: '05', label: 'May' },
  { value: '06', label: 'June' },
  { value: '07', label: 'July' },
  { value: '08', label: 'August' },
  { value: '09', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

/**
 * Returns past year range extending 120 years back from the dynamic current year (auto-updating)
 */
export const getBirthYearOptions = (): number[] => {
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 120;
  const years: number[] = [];
  for (let y = currentYear; y >= minYear; y--) {
    years.push(y);
  }
  return years;
};

/**
 * Returns month options. If the current year is selected, restricts choices to months up to current month.
 */
export const getMonthOptionsForYear = (yearStr?: string) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (yearStr && parseInt(yearStr, 10) === currentYear) {
    return MONTH_OPTIONS.filter((m) => {
      if (!m.value) return true;
      return parseInt(m.value, 10) <= currentMonth;
    });
  }

  return MONTH_OPTIONS;
};

/**
 * Returns day options. For current year and current month, restricts to days <= current date.
 * For past months, automatically returns the exact days in that month (28, 29, 30, or 31).
 */
export const getDaysOptionsForMonth = (yearStr?: string, monthStr?: string): string[] => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  let maxDays = 31;
  if (yearStr && monthStr) {
    const y = parseInt(yearStr, 10);
    const m = parseInt(monthStr, 10);
    if (!isNaN(y) && !isNaN(m)) {
      if (y === currentYear && m === currentMonth) {
        maxDays = currentDay;
      } else {
        maxDays = new Date(y, m, 0).getDate();
      }
    }
  }

  const days: string[] = [];
  for (let d = 1; d <= maxDays; d++) {
    days.push(d < 10 ? `0${d}` : `${d}`);
  }
  return days;
};

/**
 * Returns day strings 01 through 31
 */
export const getDaysOptions = (): string[] => {
  const days: string[] = [];
  for (let d = 1; d <= 31; d++) {
    days.push(d < 10 ? `0${d}` : `${d}`);
  }
  return days;
};

/**
 * Resolves fallback avatar based on user's gender if no custom photo is uploaded
 */
export const getFallbackAvatar = (gender?: string | null): string => {
  if (gender === 'female') {
    return '/assets/images/avatars/women/char1.svg';
  }
  return '/assets/images/avatars/men/char1.svg';
};

export const COUNTRY_CODES: CountryCodeOption[] = [
  { code: 'IN', dialCode: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'US', dialCode: '+1', name: 'United States', flag: '🇺🇸' },
  { code: 'GB', dialCode: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'CA', dialCode: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: 'AU', dialCode: '+61', name: 'Australia', flag: '🇦🇺' },
  { code: 'DE', dialCode: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', dialCode: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'SG', dialCode: '+65', name: 'Singapore', flag: '🇸🇬' },
  { code: 'AE', dialCode: '+971', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'CH', dialCode: '+41', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'JP', dialCode: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'NL', dialCode: '+31', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'SE', dialCode: '+46', name: 'Sweden', flag: '🇸🇪' },
  { code: 'ES', dialCode: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: 'IT', dialCode: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: 'BR', dialCode: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: 'ZA', dialCode: '+27', name: 'South Africa', flag: '🇿🇦' },
  { code: 'NZ', dialCode: '+64', name: 'New Zealand', flag: '🇳🇿' },
];

export const ACCOUNT_HERO_COPY = {
  profile: {
    badge: 'Pentasent Identity Network',
    title: 'Personal Profile & Credentials',
    description:
      'Manage your clinical and scientific public presence, prefix, verified contact details, and research biography across the Pentasent healthcare ecosystem.',
  },
  settings: {
    badge: 'Preferences & Security',
    title: 'Account Settings & Privacy',
    description:
      'Configure email digests, security notifications, cryptographic authentication sessions, and active connected devices.',
  },
  notifications: {
    badge: 'Activity Stream',
    title: 'Notifications & Alerts',
    description:
      'Track updates across clinical forums, healthtech product releases, regulatory announcements, and secure authentication events.',
  },
  products: {
    badge: 'Ecosystem Management',
    title: 'Manage Healthtech Products',
    description:
      'Overview of your submitted digital health solutions, clinical calculators, and active listings in the Pentasent product directory.',
  },
  communities: {
    badge: 'Clinical Networks',
    title: 'Your Communities & Forums',
    description:
      'Collaborate with global medical specialists, join peer discussion boards, and manage your community moderator roles.',
  },
  organizations: {
    badge: 'Healthcare Institutions',
    title: 'Organization Memberships',
    description:
      'Oversee clinical clinics, research hospitals, university partnerships, and institutional administrator permissions.',
  },
  events: {
    badge: 'Events & Symposia',
    title: 'Manage Your Events & Registrations',
    description:
      'Manage healthcare summits, clinical workshops, and webinars you host, as well as your active event registrations and session passes.',
  },
  jobs: {
    badge: 'Recruitment & Talent',
    title: 'Recruitment & Job Postings',
    description:
      'Post healthcare vacancies, track candidate applications, schedule interviews, and review clinical talent submissions.',
  },
};
