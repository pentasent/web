import type { LucideIcon } from 'lucide-react';
import type React from 'react';

export type InvestorTabId =
  | 'overview'
  | 'thesis'
  | 'founders-letter'
  | 'opportunity'
  | 'products'
  | 'pre-seed'
  | 'governance'
  | 'annual-meeting'
  | 'news';

export interface InvestorTabItem {
  id: InvestorTabId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }> | LucideIcon;
  badge?: string;
}

export interface InvestorNavTabsProps {
  activeTab: InvestorTabId;
  onTabChange: (tabId: InvestorTabId) => void;
}

export interface InvestorNavLink {
  label: string;
  href: string;
  badge?: string;
  isButton?: boolean;
}

export interface InvestorStat {
  value: string;
  label: string;
  subtext: string;
  citation?: string;
}

export interface InvestorProduct {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  features: string[];
  link?: { label: string; href: string };
}

export interface BoardMember {
  name: string;
  role: string;
  title: string;
  bio: string;
  credentials: string;
  focus: string;
}

export interface ShareholderEvent {
  date: string;
  title: string;
  type: 'Annual Meeting' | 'Investor Briefing' | 'Product Demo' | 'Report';
  status: 'Upcoming' | 'Scheduled' | 'Completed';
  description: string;
}

export interface InvestorNews {
  date: string;
  category: string;
  title: string;
  summary: string;
  linkText?: string;
  href?: string;
}

export interface DeckSlideMetric {
  label: string;
  value: string;
  subtext?: string;
}

export interface DeckSlideBreakdown {
  label: string;
  percentage: number;
  color?: string;
  description?: string;
}

export interface DeckSlideMatrixItem {
  name: string;
  position: string;
  note?: string;
}

export interface DeckSlideMatrix {
  axisX: string;
  axisY: string;
  items: DeckSlideMatrixItem[];
}

export interface DeckSlideDetail {
  title: string;
  desc: string;
  bullet?: string[];
}

export interface DeckSlide {
  slideNum: number;
  badge: string;
  title: string;
  subtitle: string;
  highlight?: string;
  points?: string[];
  metrics?: DeckSlideMetric[];
  breakdown?: DeckSlideBreakdown[];
  matrix?: DeckSlideMatrix;
  details?: DeckSlideDetail[];
  takeaway?: string;
  sources?: string;
}

export interface PitchDeckMeta {
  title: string;
  subtitle: string;
  version: string;
  round: string;
  targetRaise: string;
  targetDilution: string;
  runway: string;
  pdfPath: string;
  pptxPath: string;
  slug: string;
  totalSlides: number;
}
