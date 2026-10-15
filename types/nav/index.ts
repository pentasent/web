import { RouteNavConfigs } from "@/lib/navbar";

export interface NavContextState {
    activeNav: boolean;
    setActiveNav: React.Dispatch<React.SetStateAction<boolean>>;
}


export type AccountFlag = 'doctor' | 'clinic' | 'hospital' | 'normal' | 'researcher';

export type UserAccount = {
  name: string;
  email: string;
  avatar: string;
  accountFlag: AccountFlag;
  tags: ('Premium' | 'VIP')[];
};

export type AccountDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
};

export const getAccountFlagLabel = (flag: AccountFlag) => {
    switch (flag) {
      case 'doctor':
        return 'Doctor';
      case 'clinic':
        return 'Medical Clinic';
      case 'hospital':
        return 'Hospital Network';
      case 'researcher':
        return 'Researcher';
      case 'normal':
      default:
        return 'Individual';
    }
  };


export type SiteNavProps = {
  dark?: boolean;
  logoColor?: 'white' | 'dark';
  lineColor?: string;
  inkColor?: string;
  bgColor?: string;
  className?: string;
  onOpenMenu: () => void;
  onOpenSearch?: () => void;
  onOpenAccount?: () => void;
};

export type SearchFilter = {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  placeholder: string;
};

export type QuickSuggestion = {
  label: string;
  href: string;
  category: string;
};

export type GlobalSearchProps = {
  isOpen: boolean;
  onClose: () => void;
};


export type NavbarProps = {
  bgClassName?: string;
  bgColor?: string;
  dark?: boolean;
  logoColor?: 'white' | 'dark';
  lineColor?: string;
  inkColor?: string;
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky';
  className?: string;
  routeConfigs?: RouteNavConfigs;
  animateOnMount?: boolean;
};