export type BlogCategory =
  | 'All'
  | 'Healthcare'
  | 'News'
  | 'Company'
  | 'Resources'
  | 'Innovation'
  | 'Clinical';

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  date: string;
  readTime: string;
  featuredImage?: string;
  isFeatured?: boolean;
};

export type BlogNavTag = {
  id: string;
  label: string;
  value: BlogCategory;
};
