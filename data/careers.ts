import {
  CareersHeroData,
  FeaturedTeamsData,
  BuildAwesomeThingsData,
  CareersStatsData,
  CareersJourneyData,
  TeamSliderData,
  CareersWorkCultureData,
  CareersSupportCardItem,
  CareersScamAdvisoryData,
  CareersBottomCtaData,
} from '@/types/careers';

export const CAREERS_HERO_DATA: CareersHeroData = {
  badge: 'Careers at Pentasent',
  headlineStart: 'Build the future of',
  highlightedWord: 'healthcare',
  headlineEnd: '',
  subtitle:
    'At Pentasent, you\'ll work with curious people on meaningful problems that can shape how healthcare works tomorrow. Bring your ideas, grow with us, and help build what comes next.',
  ctaText: 'Explore open roles',
  ctaHref: '/company/careers/open-roles',
};

export const FEATURED_TEAMS_DATA: FeaturedTeamsData = {
  badge: 'Featured Teams',
  title: 'Find your team at Pentasent',
  subtitle:
    'Discover the multidisciplinary teams building connected healthcare tools, breakthrough clinical AI, and resilient ecosystem infrastructure.',
  teams: [
    {
      id: 'product-team',
      title: 'Product Team',
      description:
        'Designing intuitive, human-centered healthcare experiences that connect patients, practitioners, and organizations seamlessly across every touchpoint.',
      image: '/assets/images/pages/about/journey.png',
      linkText: 'Find Your Role',
      linkHref: '/company/careers/open-roles',
    },
    {
      id: 'ai-research-team',
      title: 'AI Research Team',
      description:
        'Pioneering clinical AI models, predictive health intelligence, and biomedical algorithms that advance medical discovery and patient care.',
      image: '/assets/images/pages/about/research.png',
      linkText: 'Find Your Role',
      linkHref: '/company/careers/open-roles',
    },
    {
      id: 'engineering-team',
      title: 'Engineering Team',
      description:
        'Building high-performance, fault-tolerant infrastructure and secure healthcare-native architectures engineered to handle sensitive health data with integrity.',
      image: '/assets/images/pages/about/engineering.png',
      linkText: 'Find Your Role',
      linkHref: '/company/careers/open-roles',
    },
  ],
};

export const CAREERS_STATS_DATA: CareersStatsData = {
  title: 'Our growth on display',
  subtitle:
    "Excuse the clutter. We've got a lot of things to celebrate, from clinical milestones and practitioner partnerships to platform firsts.",
  stats: [
    {
      id: 'doctors-added',
      value: '45',
      suffix: 'k+',
      label: 'Verified doctors added',
    },
    {
      id: 'hospitals-clinics',
      value: '12',
      suffix: 'k+',
      label: 'Hospitals & clinics added',
    },
    {
      id: 'products-added',
      value: '2.5',
      suffix: 'k+',
      label: 'Healthcare products added',
    },
    {
      id: 'active-users',
      value: '1.5',
      suffix: 'M+',
      label: 'Active users & members',
    },
    {
      id: 'cities-count',
      value: '120',
      suffix: '+',
      label: 'Cities connected globally',
    },
    {
      id: 'monthly-traffic',
      value: '4.8',
      suffix: 'M+',
      label: 'Monthly platform visits',
    },
  ],
};

export const BUILD_AWESOME_THINGS_DATA: BuildAwesomeThingsData = {
  badge: 'What We Build',
  title: 'We build awesome things',
  subtitle:
    'Pentasent connects people, organizations, innovation, and personal health. Here is a look at the four core pillars that define what we build.',
  items: [
    {
      id: 'my-health',
      icon: 'my-health',
      title: 'My Health',
      description:
        'A connected health and wellness platform empowering everyday people and patients with health tracking, health challenges, and supportive communities.',
    },
    {
      id: 'healthcare',
      icon: 'healthcare',
      title: 'Healthcare',
      description:
        'A verified professional discovery and networking environment for doctors, therapists, researchers, and clinical specialists across medical and allied disciplines.',
    },
    {
      id: 'organizations',
      icon: 'organizations',
      title: 'Organizations',
      description:
        'Connecting hospitals, medical clinics, diagnostic centers, and healthtech enterprises to showcase accredited care facilities, provider rosters, and clinical workflows.',
    },
    {
      id: 'innovation',
      icon: 'innovation',
      title: 'Innovation',
      description:
        'A dedicated discovery layer for healthcare products, healthtech startups, medtech breakthroughs, clinical AI software, and cutting-edge medical research.',
    },
  ],
};

export const CAREERS_JOURNEY_DATA: CareersJourneyData = {
  badge: 'Our Journey',

  title: 'From an idea to a connected healthcare ecosystem',

  subtitle:
    'Pentasent began with a simple question: what if the people, products, and communities shaping healthcare could be connected? Since then, we have been turning that idea into products, experiences, and an ecosystem built for what healthcare can become.',

  prefaceTag: 'Where it all began',

  prefaceYear: '2025',

  prefaceText:
    'Pentasent started as an idea with a clear ambition: bring fragmented parts of healthcare closer together. In 2025, we began turning that idea into something real.',

  blocks: [
    {
      id: 'block-2025',

      yearHeader: '2025',

      canvas: {
        id: 'canvas-2025',
        tag: 'Pentasent 1.0',
        title: 'The idea takes shape',
        primaryImage: '/assets/images/pages/about/journey.png',
        secondaryImage: '/assets/images/team/ankit.png',

        statBadge: {
          value: 'Day 0',
          label: 'Ideation & IP Secured',
        },

        chips: [
          'Pentasent.com',
          'Product Foundation',
          'System Architecture',
        ],
      },

      milestones: [
        {
          id: 'milestone-ideation-day',
          dateTag: '05 September 2025',
          title: 'The ideation day — Day Zero',
          description:
            'Pentasent began with a clear conviction: healthcare could be more connected. We established the brand, secured our core intellectual property, acquired our primary domain, and took the first steps toward turning the idea into a company.',
        },

        {
          id: 'milestone-blueprints-specs',
          title: 'From ideas to product foundations',
          description:
            'We started turning the vision into something we could build. Product requirements, system specifications, architecture, clinical considerations, and early development work gave Pentasent its first real foundations.',
        },
      ],
    },

    {
      id: 'block-mid-2026',

      yearHeader: '2026',

      canvas: {
        id: 'canvas-mid-2026',
        tag: 'V1 Android & Web',
        title: 'Our first ecosystem comes to life',
        primaryImage: '/assets/images/pages/careers/hero_view_one.png',
        secondaryImage: '/assets/images/pages/landing/myhealth_card_one.png',

        statBadge: {
          value: '1.5M+',
          label: 'Active Users',
        },

        chips: [
          'Medication',
          'MAYA AI',
          'Yoga & Wellness',
          'Communities',
        ],
      },

      milestones: [
        {
          id: 'milestone-android-web-launch',
          dateTag: '01 April 2026',
          title: 'Our first Android and web experience goes live',
          description:
            'Pentasent moved from development into the hands of users. Our Android application and web platform brought together medication tracking, communities, health conversations, and wellness experiences in one growing consumer ecosystem.',
        },

        {
          id: 'milestone-wellness-maya-ai',
          dateTag: '21 June 2026',
          title: 'Expanding the personal healthcare experience',
          description:
            'We continued building around everyday health with guided yoga, live healthcare events, interactive wellness experiences, and MAYA AI—our conversational health companion designed to make engaging with healthcare more natural.',
        },
      ],
    },

    {
      id: 'block-v2-2026',

      yearHeader: '15 September 2026',

      canvas: {
        id: 'canvas-v2-2026',
        tag: 'Pentasent 2.0',
        title: 'From products to an ecosystem',
        primaryImage: '/assets/images/pages/about/engineering.png',
        secondaryImage: '/assets/images/pages/about/investment_board.png',

        statBadge: {
          value: 'Pre-Seed',
          label: 'Investment Round',
        },

        chips: [
          'Version 2.0',
          'Connected Ecosystem',
          'Pre-Seed Round',
        ],
      },

      milestones: [
        {
          id: 'milestone-version-2-vision',
          dateTag: '15 September 2026',
          title: 'Pentasent 2.0: Building a connected healthcare ecosystem',
          description:
            'Pentasent 2.0 marks a new chapter in our journey. We are expanding beyond individual healthcare experiences to connect people, clinicians, organizations, products, communities, research, events, and healthcare knowledge within one growing ecosystem.',
        },

        {
          id: 'milestone-preseed-investment',
          dateTag: 'Investment Milestone',
          title: 'Opening our pre-seed investment round',
          description:
            'With our product foundation in place and a broader ecosystem ahead, Pentasent is opening its pre-seed round to support the next stage of growth—including expanding the team, developing deeper healthcare integrations, and advancing our work in healthcare AI.',
        },
      ],
    },
  ],

  callout: {
    yearTag: '2026',
    title: 'The next chapter is yours',
    subtitle:
      'Pentasent is still early in its journey, and there is a lot left to build. We are looking for people who want to solve meaningful problems, explore what is possible, and help shape the future of connected healthcare.',

    ctaText: 'Come build with us',
    ctaHref: '/company/careers/open-roles',
  },
};

export const MEET_THE_TEAM_DATA: TeamSliderData = {
  title: 'Meet the Pentasenters',
  subLinkText: 'Read more stories',
  subLinkHref: '/blog',
  stories: [
    {
      id: 'ankit-kumar',
      name: 'Ankit Kumar',
      role: 'VP of Product & Healthcare Systems at Pentasent',
      headline:
        'Meet Ankit Kumar, leading Product & Healthcare Systems, who turned healthcare fragmentation into an interconnected ecosystem mission at Pentasent',
      description:
        'Focused on closing the gap between patients, doctors, and healthcare institutions, Ankit guides the architecture of our four core verticals. Discover how human-centered design, deep clinical empathy, and rapid prototyping define his day-to-day work.',
      image: '/assets/images/team/ankit.png',
      storyLinkText: "Read Ankit's story",
      storyLinkHref: '/blog',
    },
    {
      id: 'akesh-yadav',
      name: 'Akesh Yadav',
      role: 'VP of Engineering & Ecosystem at Pentasent',
      headline:
        'Meet Akesh Yadav, leading Engineering & Ecosystem, architecting high-availability infrastructure engineered to handle real-world clinical scale',
      description:
        'From building fault-tolerant health record pipelines to scaling real-time consultations and MAYA AI, Akesh empowers engineers with technical autonomy, rapid execution, and an uncompromising standard of platform reliability.',
      image: '/assets/images/team/akesh.png',
      storyLinkText: "Read Akesh's story",
      storyLinkHref: '/blog',
    },
    {
      id: 'rakesh-dangi',
      name: 'Rakesh Dangi',
      role: 'VP of Marketing & Commercial at Pentasent',
      headline:
        'Meet Rakesh Dangi, leading Marketing & Commercial, championing healthcare connectivity across verified providers, hospitals, and global hubs',
      description:
        'Bringing digital healthcare solutions to thousands of verified doctors, clinics, and enterprises, Rakesh drives our growth narratives and strategic partnerships with a mission to make healthcare accessible everywhere.',
      image: '/assets/images/team/rakesh.png',
      storyLinkText: "Read Rakesh's story",
      storyLinkHref: '/blog',
    },
    {
      id: 'saurabh-yadav',
      name: 'Saurabh Yadav',
      role: 'Head of Sales & Business Development at Pentasent',
      headline:
        'Meet Saurabh Yadav, leading Sales & Business Development, connecting hospitals and healthcare enterprises to the Pentasent platform',
      description:
        'Working at the intersection of healthcare operations and modern software, Saurabh expands Pentasent\'s institutional footprint, building lasting relationships with clinics, hospitals, and healthcare diagnostic networks.',
      image: '/assets/images/team/ankit.png',
      storyLinkText: "Read Saurabh's story",
      storyLinkHref: '/blog',
    },
    {
      id: 'khushbu',
      name: 'Khushbu',
      role: 'Head of Marketing & Growth at Pentasent',
      headline:
        'Meet Khushbu, leading Marketing & Growth, amplifying patient stories, wellness communities, and impactful health awareness campaigns',
      description:
        'From community challenges and guided yoga adoption to interactive health events, Khushbu connects everyday individuals with supportive wellness ecosystems that transform their daily health habits.',
      image: '/assets/images/team/ankit-color.png',
      storyLinkText: "Read Khushbu's story",
      storyLinkHref: '/blog',
    },
    {
      id: 'nikhil-yadav',
      name: 'Nikhil Yadav',
      role: 'Head of Engineering & Development at Pentasent',
      headline:
        'Meet Nikhil Yadav, leading Engineering & Development, crafting performant mobile experiences and secure web interfaces for millions',
      description:
        'Nikhil focuses on front-end speed, offline-first reliability, and seamless UX across the Pentasent Android application and web suite, ensuring that accessing vital health tools is fast and effortless.',
      image: '/assets/images/team/akesh.png',
      storyLinkText: "Read Nikhil's story",
      storyLinkHref: '/blog',
    },
  ],
};

export const CAREERS_WORK_CULTURE_DATA: CareersWorkCultureData = {
  badge: '',
  title: '',
  subtitle:
    '',
  items: [
    {
      id: 'join-us',
      badge: '',
      title: 'Join us',
      description:
        'We are bringing together engineers, designers, researchers, clinical thinkers, and operators who care about solving real problems in healthcare. Whether you are building distributed systems, crafting patient-first digital experiences, or connecting healthcare organizations, there is room for you to do meaningful work that impacts millions of lives.',
      image: '/assets/images/pages/careers/join_us.png',
      alt: 'Collaborative team building at Pentasent',
      imagePosition: 'right',
      linkText: 'Explore open roles',
      linkHref: '/company/careers/open-roles',
    },
    {
      id: 'working-at-pentasent',
      badge: '',
      title: 'Working at Pentasent',
      description:
        'Great work starts in an environment where people are trusted, supported, and given autonomy to solve hard challenges. We value open collaboration, thoughtful discussion, continuous learning, and caring for one another. From flexible working routines to team celebrations and wellness initiatives, we cultivate a workspace where people thrive together.',
      image: '/assets/images/pages/careers/working_at_pentasent.png',
      alt: 'Working and growing together at Pentasent',
      imagePosition: 'left',
      linkText: 'Explore life at Pentasent',
      linkHref: '/company/life',
    },
    {
      id: 'research-at-pentasent',
      badge: '',
      title: 'Research at Pentasent',
      description:
        'Healthcare innovation moves forward when technology is paired with rigorous research. Our teams explore clinical AI applications, conversational health intelligence like MAYA AI, secure data interoperability, and preventive health solutions. We collaborate with medical practitioners, universities, and healthcare organizations to turn discovery into tangible outcomes.',
      image: '/assets/images/pages/careers/research_at_pentasent.png',
      alt: 'Clinical research and AI innovation at Pentasent',
      imagePosition: 'right',
      linkText: 'Discover our research',
      linkHref: '/company/careers/research',
    },
  ],
};

export const CAREERS_SUPPORT_CARDS: CareersSupportCardItem[] = [
  {
    id: 'hiring-questions',
    icon: 'help',
    title: 'Questions about hiring?',
    description:
      'Have questions about our interview process, hiring timeline, benefits, or role requirements? Visit our Help Center or connect directly with our talent acquisition team.',
    links: [
      {
        label: 'Visit Help Center',
        href: '/help',
      },
      {
        label: 'Email hiring team',
        href: 'mailto:hr@pentasent.com',
      },
    ],
  },
  {
    id: 'application-tracker',
    icon: 'tracker',
    title: 'Application status tracker',
    description:
      'Applied for an open role at Pentasent? Enter your application reference ID to track your interview stages and real-time status updates.',
    links: [
      {
        label: 'Track application status',
        href: '/tracker/job-status',
      },
    ],
  },
];

export const CAREERS_SCAM_ADVISORY_DATA: CareersScamAdvisoryData = {
  title: 'Protect yourself from common recruiting scams',
  description:
    'Pentasent will never request payment, processing fees, or sensitive financial information during any stage of our hiring process. All official job offers and interview communications originate exclusively from verified @pentasent.com email addresses.',
  linkText: 'Learn how to protect yourself',
  linkHref: '/company/careers/phishing-scam',
};

export const CAREERS_BOTTOM_CTA_DATA: CareersBottomCtaData = {
  title: "There's so much more to our story",
  subtitle: 'Want a feel for our culture? Interested in coding at Pentasent?',
  primaryButton: {
    text: "I'm an engineer",
    href: '/company/careers/open-roles',
  },
  secondaryButton: {
    text: 'Tell me about culture',
    href: '/company/life',
  },
};


