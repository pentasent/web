export type SupportArticlePart = {
  text: string;
  isLink?: boolean;
  href?: string;
};

export type SupportArticle = {
  id: string;
  title: string;
  parts: SupportArticlePart[];
};

export type StakeholderCard = {
  id: string;
  title: string;
  description: string;
  icon: 'stethoscope' | 'building';
  actionText: string;
  actionHref: string;
};

export type ContactPageContent = {
  formTitle: string;
  supportTitle: string;
};
