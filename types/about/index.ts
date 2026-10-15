export type TeamMember = {
  id: string;
  name: string;
  role: string;
  image: string;
  linkedinUrl: string;
};

export type JoinTeamCard = {
  id: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  image: string;
};

export type OfficeLocation = {
  id: string;
  city: string;
  region: string;
  country: string;
  focus: string;
  isComingSoon?: boolean;
};

export type NewsArticle = {
  id: string;
  source: string;
  title: string;
  linkText: string;
  linkHref: string;
  image: string;
};

export type MoreAboutCard = {
  id: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  image: string;
  imageBg?: string;
};