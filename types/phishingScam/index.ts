export type PhishingScamHero = {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
};

export type CommonScamItem = {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  actionLink?: {
    text: string;
    href: string;
    isExternal?: boolean;
  };
  highlightCallout?: string;
};

export type OfficialVerificationData = {
  title: string;
  senderDomainGuidance: string;
  officialDomainsListLinkText: string;
  officialDomains: string[];
  officialChannelsGuidance: string;
  careersPortalLink: {
    text: string;
    href: string;
  };
  neverDoList: {
    title: string;
    items: string[];
  };
};

export type ContractorOpportunitiesData = {
  title: string;
  description: string;
  portalLink?: {
    text: string;
    href: string;
  };
};

export type SuspectedScamAction = {
  title: string;
  checklist: string[];
  securityEmail: string;
  phishingEmail: string;
};

export type PhishingScamPageData = {
  hero: PhishingScamHero;
  introNotice: string;
  whatIsFraud: {
    title: string;
    description: string;
  };
  commonScams: {
    title?: string;
    items: CommonScamItem[];
  };
  verification: OfficialVerificationData;
  contractorOpportunities: ContractorOpportunitiesData;
  suspectedScamActions: SuspectedScamAction;
};
