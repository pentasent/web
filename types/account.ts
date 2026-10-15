export interface AccountNavTab {
  id: string;
  title: string;
  href: string;
  icon: 'user' | 'bell' | 'settings' | 'heart' | 'package' | 'users' | 'building' | 'briefcase' | 'calendar';
  badge?: string;
  isPlaceholder?: boolean;
}

export interface CountryCodeOption {
  code: string;
  dialCode: string;
  name: string;
  flag: string;
}

export type ProfilePrefix = 'Dr.' | 'Prof.' | 'Mr.' | 'Mrs.' | 'Ms.' | 'Miss' | '';

export type ProfileGender = 'male' | 'female' | 'transgender' | 'prefer_not_to_say' | 'other' | '';

