export type LegalHero = {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated: string;
};

export type LegalCallout = {
  type: 'alert' | 'info' | 'shield' | 'warning';
  title?: string;
  content: string;
};

export type LegalSubsection = {
  title?: string;
  description?: string;
  bullets?: string[];
};

export type LegalSectionItem = {
  id: string;
  number?: string | number;
  title: string;
  content?: string;
  subsections?: LegalSubsection[];
  bullets?: string[];
  callout?: LegalCallout;
};

export type LegalTableData = {
  caption?: string;
  headers: string[];
  rows: {
    name: string;
    type: string;
    duration: string;
    purpose: string;
  }[];
};

export type LegalActionCard = {
  icon: 'shield' | 'mail' | 'fileText' | 'help' | 'external';
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  isExternal?: boolean;
};

export type LegalKeyPillar = {
  title: string;
  description: string;
};

export type LegalPageData = {
  slug: 'privacy' | 'terms' | 'cookies';
  hero: LegalHero;
  leadNotice: string;
  keyPillars?: LegalKeyPillar[];
  sections: LegalSectionItem[];
  tableData?: LegalTableData;
  actionCards: LegalActionCard[];
};

export type LegalNavTab = {
  title: string;
  href: string;
  description: string;
};
