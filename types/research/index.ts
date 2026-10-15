export interface ResearchMetric {
  id: string;
  label: string;
  value: string;
  sublabel: string;
}

export interface ResearchHeroData {
  badge: string;
  highlightedWord: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
}

export interface ResearchOverviewData {
  badge: string;
  title: string;
  description: string;
  image?: string;
}

export interface ResearchProcessStep {
  id: string;
  icon: 'lightning' | 'lock' | 'check';
  text: string;
}

export interface ResearchProcessData {
  title: string;
  intro: string;
  subIntro?: string;
  steps: ResearchProcessStep[];
}

export interface ResearchProgramItem {
  id: string;
  badge?: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imagePosition: 'left' | 'right';
  linkText?: string;
  linkHref?: string;
}

export interface ResearchProgramsData {
  badge?: string;
  title?: string;
  subtitle?: string;
  items: ResearchProgramItem[];
}

export interface ResearchApplyCtaData {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
}

export interface ResearchQuoteData {
  eyebrow: string;
  quote: string;
  authorName: string;
  authorRole: string;
  image: string;
  imageAlt?: string;
}

export interface ResearchFaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface ResearchFaqData {
  badge: string;
  title: string;
  description?: string;
  items: ResearchFaqItem[];
}

export interface ResearchBottomCtaData {
  title: string;
  subtitle: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton: {
    text: string;
    href: string;
  };
}