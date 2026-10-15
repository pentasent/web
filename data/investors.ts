import {
  LayoutDashboard,
  Target,
  FileSignature,
  TrendingUp,
  Boxes,
  CircleDollarSign,
  ShieldCheck,
  CalendarDays,
  Newspaper,
} from 'lucide-react';
import type {
  InvestorTabId,
  InvestorTabItem,
  InvestorNavTabsProps,
  InvestorNavLink,
  InvestorStat,
  InvestorProduct,
  BoardMember,
  ShareholderEvent,
  InvestorNews,
} from '@/types/investors';

export type {
  InvestorTabId,
  InvestorTabItem,
  InvestorNavTabsProps,
  InvestorNavLink,
  InvestorStat,
  InvestorProduct,
  BoardMember,
  ShareholderEvent,
  InvestorNews,
};

export const INVESTOR_TABS: InvestorTabItem[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'thesis', label: 'Investment Thesis', icon: Target },
  { id: 'founders-letter', label: "Founders' Letter", icon: FileSignature },
  { id: 'opportunity', label: 'Opportunity & Market', icon: TrendingUp },
  { id: 'products', label: 'Products', icon: Boxes },
  { id: 'pre-seed', label: 'Pre-Seed Round', icon: CircleDollarSign, badge: '€750k' },
  { id: 'governance', label: 'Governance', icon: ShieldCheck },
  { id: 'annual-meeting', label: 'Annual Meeting', icon: CalendarDays },
  { id: 'news', label: 'News', icon: Newspaper },
];

export const INVESTOR_NAV_LINKS: InvestorNavLink[] = [
  { label: 'Overview', href: '#overview' },
  { label: "Founders' Letter", href: '#founders-letter' },
  { label: 'Opportunity', href: '#market-opportunity' },
  { label: 'Products', href: '#products' },
  { label: 'Pre-Seed Round', href: '#funding-round' },
  { label: 'Pitch Deck', href: '/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026', badge: 'New' },
  { label: 'Governance', href: '#governance' },
  { label: 'Annual Meeting', href: '#annual-meeting' },
  { label: 'News', href: '#news' },
  { label: 'Contact', href: '#contact' },
];

export const FOUNDERS_LETTER_DATA = {
  headline: 'is for Pentasent',
  heroQuote:
    'Healthcare has products. It lacks a connected ecosystem. Patients, practitioners, and healthcare organizations still move between disconnected destinations to discover care, publish research, build professional identity, and participate in health. Pentasent was born to make these connections native.',
  author: 'Ankit Kumar',
  authorRole: 'Founder & CEO, Pentasent',
  signatureName: 'Ankit Kumar',
  fullLetter: [
    {
      heading: 'The Case for an Operating Layer in Healthcare',
      paragraphs: [
        'Over the past decade, digital health has produced thousands of remarkable single-purpose tools. We have apps to log calories, platforms to book doctor visits, websites to read clinical papers, and generic social networks where clinicians share case studies.',
        'Yet every participant in healthcare—whether a person trying to navigate chronic wellness, a doctor building clinical identity, or a hospital managing specialist rosters—is forced to stitch together their own fragmented digital ecosystem. The workflow is split across a dozen disconnected islands.',
        'This fragmentation is not just an inconvenience. It is structural. Care happens in one place, communities in another, products somewhere else, and clinical evidence elsewhere.',
      ],
    },
    {
      heading: 'Our Core Conviction',
      paragraphs: [
        'At Pentasent, we believe healthcare is becoming digitally addressable at ecosystem scale. The emergence of standardized digital health identifiers, verified health worker registries, and citizen-centric health frameworks (such as the Ayushman Bharat Digital Mission) has laid the foundational track.',
        'What the world needs now is not another isolated healthcare product. It needs the discovery, relationship, and participation layer that connects people, healthcare organizations, evidence-based tools, peer communities, CME events, health careers, and clinical research onto a unified health graph.',
      ],
    },
    {
      heading: 'Principled Long-Term Stewardship',
      paragraphs: [
        'Healthcare is a sacred domain. It cannot be governed by the short-term incentives that broke the consumer internet. We will never sell patient health data, we will never allow sensationalized algorithmic medical disinformation, and we will never compromise on scientific evidence.',
        'We are currently raising our €750k Pre-Seed round. We are building with disciplined capital efficiency, targeting roughly 24 months of runway to prove that network density and verified utility produce sustainable, compounding business value.',
        'We invite long-term investors, clinicians, and partners who share this conviction to join us in building the operating layer for connected healthcare.',
      ],
    },
  ],
};

export const MARKET_OPPORTUNITY_DATA = {
  eyebrow: '01 / THE THESIS & MARKET OPPORTUNITY',
  title: 'Healthcare has products. It lacks a connected ecosystem.',
  description:
    'The healthcare internet has historically been fragmented by workflow. Pentasent unites the 8 core entities of healthcare into one compounding graph.',
  stats: [
    {
      value: '$17.8B → $107B',
      label: 'India Digital Health Market',
      subtext: 'Estimated 2025 market expanding to $106.97B by 2033 at a 25.12% CAGR.',
      citation: 'Grand View Research, India Digital Health Report 2025',
    },
    {
      value: '86.96 Cr+',
      label: 'ABHA Digital Health Accounts',
      subtext: 'Citizen-centric health accounts registered under the ABDM infrastructure.',
      citation: 'Government of India, MoHFW (Mar 2026)',
    },
    {
      value: '4.86 Lakh+',
      label: 'Registered Health Facilities',
      subtext: 'Hospitals, diagnostic centers, and clinics listed on the National Health Facility Registry (HFR).',
      citation: 'ABDM Health Facility Registry (Mar 2026)',
    },
    {
      value: '8.35 Lakh+',
      label: 'Verified Health Professionals',
      subtext: 'Doctors, specialists, and certified practitioners on the Healthcare Professionals Registry (HPR).',
      citation: 'ABDM Healthcare Professionals Registry (Mar 2026)',
    },
  ],
  globalStats: [
    {
      value: '$280B → $850B',
      label: 'Global Digital Health Market',
      subtext: 'Projected global sector expansion through 2032 at an 18.6% CAGR across digital therapeutics, health platforms, and interoperability.',
      citation: 'Statista & Precedence Research, Global Digital Health Forecast 2025',
    },
    {
      value: '65M+',
      label: 'Global Healthcare Workforce',
      subtext: 'Specialists, certified physicians, and allied clinical professionals requiring unified digital identity and evidence networks.',
      citation: 'World Health Organization (WHO) Global Health Workforce 2025',
    },
    {
      value: '$9.8T+',
      label: 'Global Healthcare Spending',
      subtext: 'Annual global health expenditure accelerating modernization toward connected, preventative, and patient-centric systems.',
      citation: 'WHO Global Spending on Health & World Bank Data',
    },
    {
      value: '1.8B+',
      label: 'Connected Health Consumers',
      subtext: 'Active individuals globally utilizing digital care discovery, clinical wellness tools, and remote patient participation.',
      citation: 'McKinsey Health Institute & IQVIA Global Health Insights',
    },
  ],
  pillars: [
    {
      title: 'Discover',
      desc: 'Patients and organizations discover verified doctors, clinics, evidence-based calculators, and certified digital health solutions.',
    },
    {
      title: 'Participate',
      desc: 'Clinicians and patients participate in condition-specific communities, medical symposiums, and preventative health challenges.',
    },
    {
      title: 'Build',
      desc: 'Specialists build verified professional identity, healthcare institutions recruit talent, and organizations manage service rosters.',
    },
    {
      title: 'Innovate',
      desc: 'Researchers publish peer-reviewed papers, health-tech startups launch validated products, and practitioners share clinical observations.',
    },
  ],
};

export const INVESTOR_PRODUCTS_DATA = {
  eyebrow: '02 / PRODUCT ARCHITECTURE',
  title: 'One ecosystem. Four entry points. One healthcare graph.',
  description:
    'The platform adapts to what a person is trying to accomplish. As each entity joins, the entire healthcare graph becomes exponentially more valuable.',
  products: [
    {
      id: 'for-me',
      number: '01',
      category: 'Individuals & Patients',
      title: 'For Me • Personal Health Hub',
      description:
        'A private, evidence-based health suite equipped with validated clinical calculators (BMI, BMR, Calorie, Metric converters), health trackers, and Maya—an intelligent conversational healthcare guide.',
      features: [
        'Evidence-based health calculators (WHO, Mifflin-St Jeor, Harris-Benedict formulas)',
        'Personal wellness trackers with privacy-by-design architecture',
        'Maya AI healthcare guide for instant navigation and verified health education',
        'Zero advertising and zero health data brokering',
      ],
      link: { label: 'Explore Health Tools', href: '/tools' },
    },
    {
      id: 'professionals',
      number: '02',
      category: 'Clinicians & Practitioners',
      title: 'Professionals • Clinical Identity & Network',
      description:
        'A dedicated professional presence for doctors, researchers, and healthcare specialists to showcase verified credentials, publish research, join specialized peer circles, and find opportunities.',
      features: [
        'Verified medical registry credentials and specialist taxonomy',
        'Clinical publication repository and peer discussion circles',
        'Healthcare job board and clinical fellowship discovery',
        'CME conference calendars and medical workshop participation',
      ],
      link: { label: 'View Research Engine', href: '/company/about' },
    },
    {
      id: 'organizations',
      number: '03',
      category: 'Hospitals, Clinics & Health Entities',
      title: 'Organizations • Institutional Presence',
      description:
        'Comprehensive institutional digital presence for hospitals, diagnostic chains, clinics, and medical institutions to list facilities, highlight specialist departments, and streamline patient inquiries.',
      features: [
        'Multi-facility organizational profiles and department rosters',
        'Specialist provider team directories and verified qualifications',
        'Clinical trial participant recruitment and research sponsorship',
        'High-intent patient discovery and verified booking routing',
      ],
      link: { label: 'Learn About Organizations', href: '/company/about' },
    },
    {
      id: 'ecosystem',
      number: '04',
      category: 'Healthcare Ecosystem',
      title: 'Ecosystem • Research, News & Community',
      description:
        'The connective tissue linking peer-reviewed healthcare publications, industry news feeds, medical innovation registries, and patient advocacy communities in real time.',
      features: [
        'Real-time healthcare news signals and regulatory updates',
        'Open-access clinical research abstracts and discussion threads',
        'Health tech product directory with verified user feedback',
        'Cross-institutional collaboration channels',
      ],
      link: { label: 'Read Latest News', href: '/blog' },
    },
  ],
};

export const PRE_SEED_FUNDRAISE_DATA = {
  eyebrow: '03 / PRE-SEED CAPITAL FORMATION',
  title: '€750,000 Pre-Seed Round • Now Open',
  description:
    'We are raising €750k in pre-seed capital to prove that healthcare network density and verified utility create a compounding, repeatable business.',
  status: 'Pre-Seed Round Open',
  targetRaise: '€750,000',
  targetDilution: '~10–12%',
  runway: '~24 Months',
  allocation: [
    { label: 'Product & Engineering', percentage: 45, color: '#4a0139', note: 'Core web architecture, graph schema, evidence tools & privacy engine' },
    { label: 'Growth & Ecosystem Density', percentage: 30, color: '#ffad25', note: 'Clinician onboarding, organizational partnerships, community curation & organic SEO' },
    { label: 'Operations & Core Team', percentage: 15, color: '#2f0036', note: 'Technical leadership, infrastructure operations, compliance tools & diligence' },
    { label: 'Legal, Compliance & Reserve', percentage: 10, color: '#cfc1b6', note: 'Healthcare regulatory standards, intellectual property, corporate governance & reserve' },
  ],
  milestones: [
    { period: 'Months 0–6', title: 'Density & Core Supply', desc: 'Seed initial 5,000+ verified professionals and healthcare clinics. Launch core calculators and community groups.' },
    { period: 'Months 6–12', title: 'Repeatability & First Revenue', desc: 'Activate paid organizational profiles and premium practitioner subscriptions. Prove organic retention loops.' },
    { period: 'Months 12–24', title: 'Scale & Institutional Readiness', desc: 'Expand geographic coverage across major health metros. Build ecosystem sponsored discovery. Prepare Series A institutional metrics.' },
  ],
  deckLink: '/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026',
  pdfPath: '/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pdf',
  pptxPath: '/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pptx',
};

export const INVESTOR_STATUS_DATA = {
  eyebrow: '04 / INVESTOR COMMUNITY',
  title: 'Our Current Investors & Capital Partners',
  description:
    'Pentasent is currently founder-bootstrapped and actively assembling its inaugural Pre-Seed syndicate.',
  statement:
    'We have not taken prior institutional venture capital. We are purposefully curating our Pre-Seed cap table with healthcare practitioners, mission-aligned angel investors, family offices, and specialized digital health funds who appreciate infrastructure-level healthcare transformation.',
  benefits: [
    'Direct founder communication and monthly KPI dashboards',
    'Participation in shaping the operating layer of digital healthcare',
    'Pro-rata rights and participation in subsequent institutional rounds',
    'Strict focus on sustainable unit economics rather than vanity metrics',
  ],
  contactEmail: 'hello@pentasent.com',
};

export const GOVERNANCE_DATA = {
  eyebrow: '05 / LEADERSHIP & GOVERNANCE',
  title: 'Board of Directors & Advisory Council',
  description:
    'Pentasent is guided by a leadership team committed to scientific rigor, patient privacy, and long-term shareholder value.',
  boardMembers: [
    {
      name: 'Ankit Kumar',
      role: 'Founder & Chief Executive Officer',
      title: 'Director of the Board',
      bio: 'Product-led founder with full-stack software engineering expertise and deep conviction in digital health networks. Drives platform architecture, product vision, and day-to-day operations.',
      credentials: 'M.Tech Computer Science & Engineering • B.Tech CSE',
      focus: 'Product Strategy, Engineering, Network Architecture & Capital Allocation',
    },
  ],
  committees: [
    {
      title: 'Clinical & Scientific Advisory Council',
      description:
        'Independent practicing physicians and medical informatics advisors who review evidence formulas, health calculation models, and clinical taxonomy across Pentasent.',
    },
    {
      title: 'Data Privacy & Healthcare Ethics Committee',
      description:
        'Oversees patient data confidentiality, consent-first architecture, HIPAA/DPDP alignment, and strict enforcement of zero-health-data advertising policies.',
    },
    {
      title: 'Audit & Compensation Oversight',
      description:
        'Ensures rigorous financial controls, transparent capital utilization, and alignment of management incentives with long-term enterprise value.',
    },
  ],
};

export const ANNUAL_MEETING_DATA = {
  eyebrow: '06 / SHAREHOLDER BRIEFINGS & MEETINGS',
  title: 'Annual General Meeting & Investor Calendar',
  description:
    'We believe in radical transparency and consistent communication with our capital partners.',
  events: [
    {
      date: 'Monthly',
      title: 'Founder KPI & Product Cohort Update',
      type: 'Report',
      status: 'Scheduled',
      description: 'Comprehensive monthly email digest covering user retention, tool usage, clinician onboarding, burn rate, and runway.',
    },
    {
      date: 'Q4 2026',
      title: 'Pre-Seed Shareholder Virtual Briefing',
      type: 'Investor Briefing',
      status: 'Scheduled',
      description: 'Quarterly review of platform milestones, commercial traction, and demonstration of upcoming organizational roster workflows.',
    },
    {
      date: 'October 2027',
      title: 'Annual General Meeting (AGM) 2027',
      type: 'Annual Meeting',
      status: 'Scheduled',
      description: 'Formal annual meeting of shareholders to review audited financial statements, board appointments, and 24-month roadmap execution.',
    },
  ],
  materials: [
    { name: 'Pentasent Pre-Seed Investor Pitch Deck (PDF)', path: '/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pdf', format: 'PDF (489 KB)' },
    { name: 'Pentasent Pre-Seed Investor Pitch Deck (PPTX)', path: '/assets/records/funding/Pentasent_Investor_Pitch_Deck_PreSeed_2026.pptx', format: 'PowerPoint (96 KB)' },
    { name: 'Company Certificate & Incorporation Records', path: 'mailto:hello@pentasent.com?subject=Due%20Diligence%20Request', format: 'Available in Diligence Room' },
  ],
};

export const INVESTOR_NEWS_DATA: InvestorNews[] = [
  {
    date: 'October 2026',
    category: 'Funding Milestone',
    title: 'Pentasent Opens €750k Pre-Seed Round to Accelerate Connected Healthcare Ecosystem',
    summary:
      'Pentasent releases its official Pre-Seed Investor Pitch Deck targeting €750,000 for 24 months of disciplined growth across provider directories, evidence tools, and graph connectivity.',
    linkText: 'View Pitch Deck',
    href: '/company/investors/Pentasent_Investor_Pitch_Deck_PreSeed_2026',
  },
  {
    date: 'September 2026',
    category: 'Product Launch',
    title: 'Evidence-Based Clinical Health Calculators Deployed on Pentasent',
    summary:
      'Pentasent launches a comprehensive suite of evidence-based calculators including BMI, BMR, Calorie needs, and health measurement converters with instant metric/imperial support.',
    linkText: 'Explore Tools',
    href: '/tools',
  },
  {
    date: 'August 2026',
    category: 'Platform Architecture',
    title: 'Maya Healthcare AI Guide Integrates Intelligent Contextual Assistance',
    summary:
      'Maya, Pentasent’s verified healthcare guide, rolls out multi-message conversational pacing and dynamic tool suggestions for seamless health navigation.',
    linkText: 'Learn About Maya',
    href: '/company/about',
  },
];
