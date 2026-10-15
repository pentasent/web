export type CareersHeroData = {
  badge: string;
  headlineStart: string;
  highlightedWord: string;
  headlineEnd: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
};

export type FeaturedTeamCard = {
  id: string;
  title: string;
  description: string;
  image: string;
  linkText: string;
  linkHref: string;
};

export type FeaturedTeamsData = {
  badge: string;
  title: string;
  subtitle: string;
  teams: FeaturedTeamCard[];
};

export type CareerPillarItem = {
  id: string;
  icon: 'my-health' | 'healthcare' | 'organizations' | 'innovation' | string;
  title: string;
  description: string;
};

export type BuildAwesomeThingsData = {
  badge: string;
  title: string;
  subtitle: string;
  items: CareerPillarItem[];
};

export type CareersStatItem = {
  id: string;
  prefix?: string;
  value: string;
  suffix?: string;
  label: string;
};

export type CareersStatsData = {
  badge?: string;
  title: string;
  subtitle: string;
  stats: CareersStatItem[];
};

export type CareersMilestoneSubItem = {
  name: string;
  description: string;
};

export type CareersMilestoneItem = {
  id: string;
  dateTag?: string;
  title: string;
  description: string;
  linkText?: string;
  linkHref?: string;
  subItems?: CareersMilestoneSubItem[];
};

export type CareersMilestoneCanvas = {
  id: string;
  tag?: string;
  title?: string;
  primaryImage?: string;
  secondaryImage?: string;
  statBadge?: {
    value: string;
    label: string;
  };
  chips?: string[];
};

export type CareersMilestoneBlock = {
  id: string;
  yearHeader: string;
  canvas: CareersMilestoneCanvas;
  milestones: CareersMilestoneItem[];
};

export type CareersJourneyData = {
  badge?: string;
  title: string;
  subtitle: string;
  prefaceTag?: string;
  prefaceYear?: string;
  prefaceText?: string;
  blocks: CareersMilestoneBlock[];
  callout: {
    yearTag: string;
    title: string;
    subtitle: string;
    ctaText: string;
    ctaHref: string;
  };
};

export type TeamStoryItem = {
  id: string;
  name: string;
  role: string;
  headline: string;
  description: string;
  image: string;
  storyLinkText: string;
  storyLinkHref: string;
};

export type TeamSliderData = {
  title: string;
  subLinkText: string;
  subLinkHref: string;
  stories: TeamStoryItem[];
};

export type CareersWorkCultureItem = {
  id: string;
  badge?: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  imagePosition: 'left' | 'right';
  linkText: string;
  linkHref: string;
};

export type CareersWorkCultureData = {
  badge?: string;
  title?: string;
  subtitle?: string;
  items: CareersWorkCultureItem[];
};

export type CareersSupportCardLink = {
  label: string;
  href: string;
  isExternal?: boolean;
};

export type CareersSupportCardItem = {
  id: string;
  icon: 'help' | 'tracker' | string;
  title: string;
  description: string;
  links: CareersSupportCardLink[];
};

export type CareersScamAdvisoryData = {
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
};

export type CareersBottomCtaData = {
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
};


