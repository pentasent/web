import { BlogPost, BlogNavTag } from '@/types/blog';

export const BLOG_TAGS: BlogNavTag[] = [
  { id: 'all', label: 'All', value: 'All' },
  { id: 'healthcare', label: 'Healthcare', value: 'Healthcare' },
  { id: 'news', label: 'News', value: 'News' },
  { id: 'company', label: 'Company', value: 'Company' },
  { id: 'resources', label: 'Resources', value: 'Resources' },
  { id: 'innovation', label: 'Innovation', value: 'Innovation' },
  { id: 'clinical', label: 'Clinical', value: 'Clinical' },
];

export const BLOG_POSTS: BlogPost[] = [
  // Featured hero post (matches design mockup)
  {
    id: 'ai-clinician-context',
    slug: 'clinician-ai-clinical-context',
    title: 'Give every clinician AI that has the context to be useful',
    category: 'Healthcare',
    date: 'Sep 23, 2026',
    readTime: '6 min read',
    excerpt:
      'How multimodal clinical context models and ambient intelligence are reducing documentation fatigue, turning fragmented patient histories into actionable, point-of-care insights for physicians.',
    featuredImage: '/assets/images/pages/blog/featured_ai.jpg',
    isFeatured: true,
  },

  // Top list posts (matches right side column in design mockup)
  {
    id: 'open-health-records',
    slug: 'open-health-records-without-firewall',
    title: 'Open patient records, without the hospital firewall fire drill',
    category: 'Healthcare',
    date: 'Sep 10, 2026',
    readTime: '4 min read',
    excerpt:
      'Streamlining cross-institutional health record exchange while preserving rigorous HIPAA compliance and zero-trust cryptographic verification.',
  },
  {
    id: 'clinical-helpdesk',
    slug: 'introducing-pentasent-clinical-scribe',
    title: 'Introducing Pentasent Clinical Scribe: Ambient AI that resolves charting on arrival',
    category: 'Innovation',
    date: 'Sep 1, 2026',
    readTime: '5 min read',
    excerpt:
      'Our new ambient listening scribe automatically drafts comprehensive SOAP notes during consultations, integrating natively into leading EMR systems.',
  },
  {
    id: 'mcp-server-agents',
    slug: 'building-healthcare-mcp-server',
    title: 'Building a healthcare MCP server that lets clinical agents communicate in code',
    category: 'Resources',
    date: 'Aug 25, 2026',
    readTime: '7 min read',
    excerpt:
      'An engineering dive into implementing Model Context Protocol (MCP) servers for hospital diagnostic systems, laboratory databases, and healthcare workflows.',
  },
  {
    id: 'directory-rankings',
    slug: 'pentasent-ranked-top-doctor-network',
    title: 'Independent Healthcare Review Names Pentasent #1 in Verified Physician Discovery',
    category: 'Company',
    date: 'Aug 25, 2026',
    readTime: '3 min read',
    excerpt:
      'Over 12,000 verified physicians and 500 clinical practices celebrate Pentasent as the highest-rated discovery ecosystem for patient trust.',
  },
  {
    id: 'ai-governance',
    slug: 'introducing-healthcare-ai-governance',
    title: 'Introducing Pentasent AI Governance: Get your hospital compliance and audit trails in order',
    category: 'News',
    date: 'Aug 20, 2026',
    readTime: '5 min read',
    excerpt:
      'A complete governance and safety framework for medical centers deploying clinical AI models with comprehensive auditability and risk mitigation.',
  },

  // Additional curated posts across categories
  {
    id: 'clinical-practice-scaling',
    slug: 'modernizing-outpatient-specialty-clinics',
    title: 'Modernizing outpatient care: How specialty clinics scale multi-site practices',
    category: 'Clinical',
    date: 'Aug 14, 2026',
    readTime: '5 min read',
    excerpt:
      'Operational strategies and technology stacks that private clinics and medical groups rely on to scale care teams without increasing administrative headcount.',
  },
  {
    id: 'my-health-habits',
    slug: 'science-of-21-day-health-habits',
    title: 'The science of micro-habits: Why 21-day preventative health challenges succeed',
    category: 'Resources',
    date: 'Aug 04, 2026',
    readTime: '4 min read',
    excerpt:
      'How behavioral science and daily micro-tracking transform chronic health management into achievable milestones with community accountability.',
  },
  {
    id: 'biotech-therapeutics',
    slug: 'biotech-breakthroughs-clinical-trials',
    title: 'Emerging biotech therapeutics: New horizons in clinical trials and genetic medicine',
    category: 'News',
    date: 'Jul 28, 2026',
    readTime: '6 min read',
    excerpt:
      'A survey of recent clinical trial breakthroughs in mRNA delivery vectors, targeted cellular immunotherapies, and accelerated trial design.',
  },
  {
    id: 'connected-healthcare-vision',
    slug: 'healthcare-connected-pentasent-vision',
    title: 'Healthcare, connected: Bridging institutional medicine with personal wellbeing',
    category: 'Company',
    date: 'Jul 15, 2026',
    readTime: '5 min read',
    excerpt:
      'Why isolated health apps fail users, and how Pentasent unites clinicians, hospital networks, healthtech founders, and everyday individuals in one ecosystem.',
  },
  {
    id: 'diagnostic-imaging-ai',
    slug: 'ai-diagnostic-imaging-breakthroughs',
    title: 'Next-generation diagnostic imaging: Real-time pathology assistance for radiologists',
    category: 'Innovation',
    date: 'Jul 02, 2026',
    readTime: '6 min read',
    excerpt:
      'Examining deep learning assistive tools that expedite diagnostic radiograph reviews and triage critical findings in emergency settings.',
  },
  {
    id: 'telehealth-accessibility',
    slug: 'expanding-rural-telehealth-access',
    title: 'Expanding rural healthcare access through community-first telemedicine networks',
    category: 'Healthcare',
    date: 'Jun 22, 2026',
    readTime: '4 min read',
    excerpt:
      'How local clinic hubs and decentralized telehealth platforms are eliminating geographic disparities in specialized cardiac and psychological care.',
  },
  {
    id: 'clinical-trial-patient-matching',
    slug: 'patient-matching-rare-disease-trials',
    title: 'Accelerating rare disease clinical trials through intelligent patient matching',
    category: 'Clinical',
    date: 'Jun 10, 2026',
    readTime: '6 min read',
    excerpt:
      'Overcoming the critical patient recruitment bottleneck in rare disease research through privacy-first genomic and phenotype cohort matching.',
  },
];
