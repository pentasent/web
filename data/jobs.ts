import {
  JobOpening,
  CandidateSafetyBannerData,
  OpenRolesPageData,
} from '@/types/jobs';

export const CANDIDATE_SAFETY_BANNER: CandidateSafetyBannerData = {
  prefix:
    'We prioritize candidate safety. Please be aware that official communication will only come from ',
  domain: '@pentasent.com',
  suffix: ' email addresses.',
};

export const OPEN_ROLES_PAGE_DATA: OpenRolesPageData = {
  metadata: {
    title: 'Open Roles | Pentasent Careers',
    description:
      'Explore open roles at Pentasent. Join our mission to build a more connected, compassionate healthcare ecosystem across clinical AI, engineering, and enterprise partnerships.',
  },
  banner: CANDIDATE_SAFETY_BANNER,
  header: {
    title: 'Open roles',
    line1: 'Every role at Pentasent is mission-critical.',
    line2: ' The only question is where you see yourself.',
  },
};

export const JOB_DEPARTMENTS = [
  'All departments',
  'Engineering',
  'Sales & Business Development',
] as const;

export const JOB_LOCATIONS = [
  'All locations',
  'Remote (Global)',
  'Bengaluru, India',
  'London, United Kingdom',
] as const;

export const JOB_OPENINGS: JobOpening[] = [
  {
    id: 'job-swe-01',
    slug: 'senior-full-stack-software-engineer',
    title: 'Senior Full-Stack Software Engineer',
    department: 'Engineering',
    departmentSlug: 'engineering',
    location: 'Bengaluru, India (Remote Available)',
    locationType: 'Remote',
    employmentType: 'Full-time',
    experienceLevel: '3 - 6 Years',
    salary: '₹28,00,000 - ₹42,00,000 + Equity',
    timing: 'Flexible hours (Core overlap 11:00 AM - 4:00 PM IST)',
    postedDate: 'September 2026',
    summary:
      'We are looking for a Senior Full-Stack Engineer to architect resilient healthcare-native architectures, real-time consultation streaming, and consumer-facing health experiences across web and mobile platforms.',
    overview: [
      'At Pentasent, our engineering team builds the foundational fabric that connects everyday patients, verified clinicians, accredited medical institutions, and groundbreaking health products.',
      'As a Senior Full-Stack Engineer, you will take ownership of mission-critical systems spanning reactive front-end interfaces, fault-tolerant GraphQL and REST microservices, and secure health data pipelines engineered to handle high concurrency with zero downtime.',
      'You will collaborate directly with product leaders, medical advisors, and AI researchers to translate complex clinical workflows into intuitive, performant user interfaces.',
    ],
    responsibilities: [
      'Design, build, and maintain scalable full-stack web and mobile systems using TypeScript, Next.js, React, Node.js, and PostgreSQL.',
      'Architect real-time data synchronization layers for doctor-patient consultations, appointment booking, and wellness community feeds.',
      'Enforce stringent data security, HIPAA-compliant encryption standards, and automated audit logging across all microservices.',
      'Optimize web performance, Core Web Vitals, and client-side rendering speeds across diverse devices and low-bandwidth networks.',
      'Write clean, modular, thoroughly tested code (Jest, Playwright) and champion engineering excellence through code reviews and technical RFCs.',
      'Partner closely with Product Designers and Clinical AI researchers to deliver seamless patient-practitioner experiences.',
    ],
    mustHaveQualifications: [
      '3+ years of professional full-stack development experience building and deploying production-grade web applications.',
      'Deep mastery of TypeScript, modern JavaScript (ES6+), React, Next.js (App Router), and CSS/Tailwind.',
      'Strong backend fundamentals in Node.js, Go, or Python with relational databases (PostgreSQL) and caching layers (Redis).',
      'Proven experience designing and consuming robust RESTful and GraphQL APIs with schema validation.',
      'Firm grasp of security standards (OAuth2, JWT, CSP, encryption at rest and in transit) and distributed system patterns.',
      'Comfortable taking complete end-to-end ownership of features from technical discovery through production monitoring.',
    ],
    goodToHaveQualifications: [
      'Previous experience in healthcare, healthtech, telemedicine, or electronic health records (EHR/FHIR) systems.',
      'Familiarity with containerized microservices (Docker, Kubernetes) and AWS/GCP cloud environments.',
      'Experience with WebSocket/WebRTC streaming for real-time telehealth video and audio consultations.',
      'Contributions to open-source software or engineering blogs.',
    ],
    benefits: [
      'Competitive compensation package with comprehensive equity/stock options.',
      'Comprehensive family health, dental, and medical insurance covering pre-existing conditions.',
      'Generous wellness allowance for gym, yoga, therapy, and mental well-being.',
      'Flexible remote-first work policy with home office equipment stipend.',
      'Annual learning and conference stipend for professional growth.',
      'Unlimited paid time off (PTO) with mandated minimum rest periods and annual company retreats.',
    ],
    aboutTeam:
      'The Pentasent Engineering team is a compact, high-velocity group of builders who value intellectual honesty, pragmatism over dogma, and autonomous execution. We ship code daily, maintain high code standards, and celebrate milestones together.',
    aboutCompany:
      'Pentasent is pioneering a next-generation healthcare platform that connects patients, licensed medical specialists, clinical AI diagnostic agents, and accredited healthcare networks into one unified, compassionate ecosystem.\n\nOur four integrated verticals — Patient Care, Clinician Network, Institutional Systems, and Predictive Health Intelligence — are engineered to remove friction from medicine, prioritize patient agency, and make world-class care accessible to millions.',
  },
  {
    id: 'job-sales-01',
    slug: 'healthcare-enterprise-sales-manager',
    title: 'Healthcare Enterprise Sales Manager',
    department: 'Sales & Business Development',
    departmentSlug: 'sales',
    location: 'Bengaluru, India (Hybrid)',
    locationType: 'Hybrid',
    employmentType: 'Full-time',
    experienceLevel: '4 - 8 Years',
    salary: '₹22,00,000 - ₹35,00,000 Base + Uncapped Commission',
    timing: 'Full-time (Monday - Friday, 9:30 AM - 6:30 PM IST)',
    postedDate: 'September 2026',
    summary:
      'We are looking for a results-driven Healthcare Enterprise Sales Manager to lead strategic partnerships with multi-specialty hospitals, private clinic chains, and diagnostic networks to expand the Pentasent institutional ecosystem.',
    overview: [
      'Healthcare organizations need modern, frictionless software to connect accredited facilities, manage clinician directories, and showcase verified clinical services to millions of patients.',
      'As our Healthcare Enterprise Sales Manager, you will be the driving commercial force introducing Pentasent’s institutional suite to hospital directors, clinic administrators, and healthcare network CEOs.',
      'You will own the enterprise sales lifecycle end-to-end: prospecting, discovery, senior-level pitch presentations, contract negotiations, and seamless onboarding handoffs to our client success teams.',
    ],
    responsibilities: [
      'Build and execute a high-yield enterprise sales pipeline targeting hospitals, clinic networks, and health systems across strategic metro regions.',
      'Conduct consultative discovery sessions with hospital executives (C-suite, Medical Directors, Chief of Operations) to align Pentasent’s capabilities with their operational goals.',
      'Deliver compelling product demonstrations that clearly communicate the clinical connectivity, patient discovery, and efficiency benefits of Pentasent.',
      'Lead commercial structuring, pricing models, legal negotiations, and procurement approval processes to close annual enterprise contracts.',
      'Collaborate with Marketing and Product teams to share field insights, competitor intelligence, and institutional customer requirements.',
      'Represent Pentasent at major healthcare summits, medical conferences, and healthcare leadership forums.',
    ],
    mustHaveQualifications: [
      '4+ years of B2B enterprise sales or business development experience, with at least 2+ years selling to hospitals, medical clinics, or healthcare institutions.',
      'Demonstrated track record of consistently meeting or exceeding quarterly and annual revenue targets (ARR/ACV).',
      'Extensive existing network and strong rapport with hospital directors, practice owners, and healthcare administrators.',
      'Exceptional presentation, storytelling, and negotiation skills tailored to medical professionals and executive stakeholders.',
      'Deep understanding of healthcare procurement, hospital budgeting cycles, and regulatory considerations in India and international markets.',
      'Self-motivated, resilient, and energized by high-growth startup environments.',
    ],
    goodToHaveQualifications: [
      'Experience selling SaaS, EHR/EMR platforms, healthcare CRM, or digital health solutions.',
      'Educational background in healthcare administration, business, or life sciences.',
      'Proficiency with modern sales CRMs (HubSpot, Salesforce) and pipeline forecasting tools.',
    ],
    benefits: [
      'Competitive base salary with uncapped quarterly performance commissions and equity incentives.',
      'Top-tier medical and family health insurance coverage.',
      'Travel and client entertainment allowance for regional hospital visits.',
      'Wellness stipend for personal health, fitness memberships, and mental well-being.',
      'Flexible hybrid schedule balancing field meetings with focused remote collaboration.',
      'Annual executive coaching and continuous leadership development support.',
    ],
    aboutTeam:
      'The Pentasent Commercial & Partnerships team operates on trust, deep clinical empathy, and consultative problem-solving. We believe in building authentic, long-term partnerships with healthcare institutions that genuinely improve patient care delivery.',
    aboutCompany:
      'Pentasent is pioneering a next-generation healthcare platform that connects patients, licensed medical specialists, clinical AI diagnostic agents, and accredited healthcare networks into one unified, compassionate ecosystem.\n\nOur four integrated verticals — Patient Care, Clinician Network, Institutional Systems, and Predictive Health Intelligence — are engineered to remove friction from medicine, prioritize patient agency, and make world-class care accessible to millions.',
  },
];
