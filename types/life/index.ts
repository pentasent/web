export type LifeHeroData = {
  badge: string;
  headlineStart: string;
  highlightedWord: string;
  headlineEnd: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
};

export type LifeQuoteItem = {
  type: 'quote';
  id: string;
  quote: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
};

export type LifePhotoItem = {
  type: 'photo';
  id: string;
  image: string;
  alt: string;
  caption?: string;
};

export type LifeHighlightItem = LifeQuoteItem | LifePhotoItem;

export type LifeHighlightsData = {
  badge: string;
  title: string;
  subtitle: string;
  row1: [LifeQuoteItem, LifePhotoItem, LifePhotoItem];
  row2: [LifePhotoItem, LifePhotoItem, LifeQuoteItem];
  row3: [LifeQuoteItem, LifePhotoItem, LifePhotoItem];
  row4: [LifePhotoItem, LifePhotoItem, LifeQuoteItem];
};

export type LeadershipPrinciple = {
  id: string;
  step: string;
  title: string;
  description: string;
  image: string;
};

export type PentasentLeadershipData = {
  badge?: string;
  title: string;
  subtitle: string;
  principles: LeadershipPrinciple[];
};

export type LifeGrowthOnMapData = {
  title: string;
  subtitle: string;
  image: string;
  alt: string;
};

export type LifeCelebrationCard = {
  id: string;
  image: string;
  country: string;
  title: string;
  description: string;
};

export type LifeCelebrationsData = {
  badge: string;
  title: string;
  subtitle: string;
  cards: LifeCelebrationCard[];
};

export type MissionWorkLifeItem = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imagePosition: 'left' | 'right';
};

export type LifeMissionWorkLifeData = {
  badge?: string;
  title?: string;
  items: MissionWorkLifeItem[];
};

export type LifePrincipleItem = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type LifePrinciplesData = {
  badge?: string;
  title: string;
  subtitle: string;
  items: LifePrincipleItem[];
};

export type LifeBottomCtaData = {
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
  backgroundImage: string;
};



