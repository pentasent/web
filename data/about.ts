import { TeamMember, JoinTeamCard, OfficeLocation, NewsArticle, MoreAboutCard } from "@/types/about";

export const LEADERSHIP_TEAM: TeamMember[] = [
  {
    id: 'ankit-kumar',
    name: 'Ankit Kumar',
    role: 'VP of Product & Healthcare Systems',
    image: '/assets/images/team/ankit.png',
    linkedinUrl: 'https://linkedin.com/in/ankit5999',
  },
  {
    id: 'akesh-yadav',
    name: 'Akesh Yadav',
    role: 'VP of Engineering & Ecosystem',
    image: '/assets/images/team/akesh.png',
    linkedinUrl: 'https://www.linkedin.com/company/pentasent',
  },
  {
    id: 'rakesh',
    name: 'Rakesh Dangi',
    role: 'VP of Marketing & Commercial',
    image: '/assets/images/team/rakesh.png',
    linkedinUrl: 'https://www.linkedin.com/company/pentasent',
  },
  {
    id: 'saurabh-yadav',
    name: 'Saurabh Yadav',
    role: 'Heald of Sales & Business Development',
    image: '/assets/images/team/saurabh.png',
    linkedinUrl: 'https://www.linkedin.com/company/pentasent',
  },
  {
    id: 'ashish',
    name: 'Ashish Yadav',
    role: 'Head of Marketing & Growth',
    image: '/assets/images/team/ashish.png',
    linkedinUrl: 'https://www.linkedin.com/company/pentasent/',
  },
  {
    id: 'nikhil-yadav',
    name: 'Nikhil Yadav',
    role: 'Head of Engineering & Development',
    image: '/assets/images/team/nikhil.png',
    linkedinUrl: 'https://linkedin.com/in/jangranikhil',
  },
];

export const JOIN_TEAM_CARDS: JoinTeamCard[] = [
  {
    id: 'our-journey',
    title: 'Our journey',
    description: 'Help build something that matters.',
    linkText: 'See our journey',
    linkHref: '/company/careers',
    image: '/assets/images/pages/about/journey.png',
  },
  {
    id: 'engineering-at-pentasent',
    title: 'Engineering at Pentasent',
    description: 'We trust engineers to lead. Come build with us.',
    linkText: 'Learn about engineering',
    linkHref: '/company/careers/open-roles',
    image: '/assets/images/pages/about/engineering.png',
  },
  {
    id: 'life-at-pentasent',
    title: 'Life at Pentasent',
    description: 'No boring days—just rewarding ones.',
    linkText: 'See life at Pentasent',
    linkHref: '/company/life',
    image: '/assets/images/pages/about/life.png',
  },
];


export const GLOBAL_OFFICES: OfficeLocation[] = [
  // India Hubs
  {
    id: 'gurugram',
    city: 'Gurugram',
    region: 'Haryana',
    country: 'India',
    focus: 'IT Hub & Core Technology Labs',
  },
  {
    id: 'bengaluru',
    city: 'Bengaluru',
    region: 'Karnataka',
    country: 'India',
    focus: 'Health-AI & Ecosystem Architecture',
  },
  {
    id: 'mumbai',
    city: 'Mumbai',
    region: 'Maharashtra',
    country: 'India',
    focus: 'Hospital Networks & Enterprise Alliances',
  },
  {
    id: 'jaipur',
    city: 'Jaipur',
    region: 'Rajasthan',
    country: 'India',
    focus: 'Regional Operations & Practitioner Support',
  },

  // United Kingdom & Global Hubs
  {
    id: 'london',
    city: 'London',
    region: 'Greater London',
    country: 'United Kingdom',
    focus: 'EMEA Strategic Hub & Life Sciences',
  },
  {
    id: 'singapore',
    city: 'Singapore',
    region: 'Central Region',
    country: 'Singapore',
    focus: 'Asia-Pacific Gateway & Health Tech',
  },
  {
    id: 'dubai',
    city: 'Dubai',
    region: 'Emirate of Dubai',
    country: 'United Arab Emirates',
    focus: 'MENA Center & Digital Innovation',
  },
  {
    id: 'zurich',
    city: 'Zurich',
    region: 'Canton of Zurich',
    country: 'Switzerland',
    focus: 'Biomedical Informatics & Precision Care',
  },

  // Expansion Hubs (Coming Soon)
  {
    id: 'berlin',
    city: 'Berlin',
    region: 'Berlin',
    country: 'Germany',
    focus: 'European Digital Health Standards',
    isComingSoon: true,
  },
  {
    id: 'paris',
    city: 'Paris',
    region: 'Île-de-France',
    country: 'France',
    focus: 'Clinical Research Consortia',
    isComingSoon: true,
  },
  {
    id: 'milan',
    city: 'Milan',
    region: 'Lombardy',
    country: 'Italy',
    focus: 'Southern Europe Medical Alliances',
    isComingSoon: true,
  },
  {
    id: 'san-francisco',
    city: 'San Francisco',
    region: 'California',
    country: 'United States',
    focus: 'North America Ecosystem & Innovation',
    isComingSoon: true,
  }
];

export const LATEST_NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'news-1',
    source: 'The Healthcare Times',
    title: 'Healthcare platform Pentasent expands clinical network across 15+ global healthcare hubs',
    linkText: 'Read article',
    linkHref: '/blog',
    image: '/assets/images/pages/about/placeholder_news.png',
  },
  {
    id: 'news-2',
    source: 'HealthTech Insights',
    title: 'An Interview with Pentasent Leadership on the Future of Unified Health Systems',
    linkText: 'View interview',
    linkHref: '/blog',
    image: '/assets/images/pages/about/placeholder_news.png',
  },
  {
    id: 'news-3',
    source: 'MedTech Weekly',
    title: 'How Pentasent is bridging the gap between hospital discovery and diagnostic research',
    linkText: 'Read article',
    linkHref: '/blog',
    image: '/assets/images/pages/about/placeholder_news.png',
  },
];

export const MORE_ABOUT_PENTASENT: MoreAboutCard[] = [
  {
    id: 'research-at-pentasent',
    title: 'Research at Pentasent',
    description: "Whether you're a postdoc looking for a full-time research position or a PhD candidate interested in a short-term internship, you can push the boundaries and turn ideas into innovation at Pentasent.",
    linkText: 'Learn about our research opportunities',
    linkHref: '/company/careers/research',
    image: '/assets/images/pages/about/research.png',
  },
  {
    id: 'leadership-and-investments',
    title: 'Leadership, Board & Investments',
    description: "Discover more about Pentasent's leadership, Board of Directors, and strategic healthcare investment partners guiding our long-term vision, governance, and management.",
    linkText: 'Explore leadership & management',
    linkHref: '/company/board',
    image: '/assets/images/pages/about/investment_board.png',
  },
];