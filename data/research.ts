import {
  ResearchHeroData,
  ResearchOverviewData,
  ResearchProcessData,
  ResearchProgramsData,
  ResearchApplyCtaData,
  ResearchQuoteData,
  ResearchBottomCtaData,
  ResearchFaqData,
} from '@/types/research';

export const RESEARCH_HERO_DATA: ResearchHeroData = {
  badge: 'Pentasent Research',
  highlightedWord: 'healthcare research',
  subtitle:
    'We explore the problems shaping healthcare and the ideas that can solve them. From product and user research to health technology, data, and emerging innovations, our research helps us understand what matters, build better products, and move healthcare forward.',
  ctaText: 'Explore Research',
  ctaHref: '/company/careers/open-roles',
};

export const RESEARCH_OVERVIEW_DATA: ResearchOverviewData = {
  badge: 'RESEARCH',
  title:
    'Research that helps us understand, build, and move healthcare forward.',
  description:
    'At Pentasent, research is part of how we build. We explore people, healthcare experiences, products, technology, data, and emerging ideas to understand the problems that matter and discover better ways to solve them. Our research connects curiosity with action—turning insights into products, experiences, and new possibilities for healthcare.',
  image: '/assets/images/pages/careers/research_options.png',
};

export const RESEARCH_PROCESS_DATA: ResearchProcessData = {
  title: 'How we do research',
  intro:
    'At Pentasent, the best healthcare research happens when curiosity meets clinical rigor.',
  subIntro: 'Here we...',
  steps: [
    {
      id: 'step-discovery',
      icon: 'lightning',
      text: 'Advance medical discovery through collaborative mentorship programs and cross-disciplinary scientific training.',
    },
    {
      id: 'step-autonomy',
      icon: 'lock',
      text: 'Empower research teams to own clinical models end-to-end, giving each scientist immense intellectual autonomy.',
    },
    {
      id: 'step-impact',
      icon: 'check',
      text: 'Support researchers to make decisions that translate into peer-reviewed papers and patient-facing innovation.',
    },
  ],
};

export const RESEARCH_PROGRAMS_DATA: ResearchProgramsData = {
  badge: '',
  title: '',
  items: [
    {
      id: 'how-it-works',
      badge: '',
      title: 'How it works',
      description:
        'Our research programs connect ambitious researchers with real-world clinical datasets, advanced computational resources, and interdisciplinary mentorship. You will partner directly with healthcare practitioners, machine learning scientists, and medical faculties to design experiments, validate clinical hypotheses, and build AI architectures with direct patient applications.',
      image: '/assets/images/pages/careers/how_it_works.png',
      alt: 'How research works at Pentasent',
      imagePosition: 'right',
    },
    {
      id: 'who-can-apply',
      badge: '',
      title: 'Who can apply',
      description:
        'We welcome applications from PhD candidates, postdoctoral fellows, clinical researchers, and data scientists across artificial intelligence, computational biology, bioengineering, and health informatics. Whether you are seeking a summer research internship, visiting fellowship, or full-time staff scientist role, curiosity and scientific rigor are what matter most.',
      image: '/assets/images/pages/careers/who_can_apply.png',
      alt: 'Who can apply for research at Pentasent',
      imagePosition: 'left',
    },
    {
      id: 'how-to-apply',
      badge: '',
      title: 'How to apply',
      description:
        'Our application process is simple, transparent, and candidate-first. Review our active research openings, submit your CV and research publications, and our scientific committee will connect with you for an introductory discussion on your background and research interests.',
      image: '/assets/images/pages/careers/how_to_apply.png',
      alt: 'How to apply for research roles at Pentasent',
      imagePosition: 'right',
      linkText: 'Explore open research roles',
      linkHref: '/company/careers/open-roles',
    },
  ],
};

export const RESEARCH_APPLY_CTA_DATA: ResearchApplyCtaData = {
  badge: 'APPLY NOW',
  title: 'Ready to apply?',
  description:
    "Take the next step in your career and apply for a full-time research scientist position in your field of study, whether that's generative AI, machine learning or natural language processing.",
  buttonText: 'Apply now',
  buttonHref: '/company/careers/open-roles',
};

export const RESEARCH_QUOTE_DATA: ResearchQuoteData = {
  eyebrow: 'IN THEIR OWN WORDS',
  quote:
    '“Good research starts with asking better questions. At Pentasent, we use research to understand people, uncover meaningful problems, and turn what we learn into better healthcare products and experiences.”',
  authorName: 'Ankit Kumar',
  authorRole: 'VP of Product at Pentasent',
  image: '/assets/images/team/ankit.png',
  imageAlt: 'Ankit Kumar',
};


export const RESEARCH_BOTTOM_CTA_DATA: ResearchBottomCtaData = {
  title: 'Beyond the codebase',
  subtitle:
    "Building great products is a huge part of Pentasent, but there's more to learn.",
  primaryButton: {
    text: 'Our journey',
    href: '/company/about',
  },
  secondaryButton: {
    text: 'Life at Pentasent',
    href: '/company/life',
  },
};

export const RESEARCH_FAQ_DATA: ResearchFaqData = {
  badge: 'FULL-TIME RESEARCH',
  title: 'Frequently asked questions.',
  description:
    'Find answers to common questions about research focus areas, publication opportunities, clinical data ethics, and the application process for full-time research scientists.',
  items: [
    {
      id: 'faq-research-areas',
      question: 'What areas of research does Pentasent primarily focus on?',
      answer:
        'At Pentasent, our research team focuses on foundational healthcare artificial intelligence, conversational health companions like MAYA AI, clinical data interoperability, preventive health analytics, and multimodal diagnostic models. We partner directly with clinical practitioners to ensure our work addresses genuine challenges in patient care.',
    },
    {
      id: 'faq-qualifications',
      question: 'What qualifications are required for a full-time Research Scientist role?',
      answer:
        'We look for candidates who hold or are completing a PhD in computer science, biomedical informatics, computational biology, machine learning, or related fields. Strong candidates demonstrate a track record of peer-reviewed publications, solid algorithmic foundations, and a commitment to applying technology to healthcare.',
    },
    {
      id: 'faq-publishing',
      question: 'Can I publish and present research papers while working at Pentasent?',
      answer:
        'Yes, absolutely. We actively encourage our researchers to publish in top-tier machine learning and medical venues such as NeurIPS, ICML, CVPR, Nature Medicine, and Lancet Digital Health. Open science, academic collaboration, and transparent evaluation are central to how we advance healthcare.',
    },
    {
      id: 'faq-data-privacy',
      question: 'How does Pentasent handle clinical data privacy and ethical AI?',
      answer:
        'Patient confidentiality and ethical governance are built into our research architecture from day zero. All clinical datasets undergo comprehensive anonymization and strict governance reviews in accordance with international healthcare regulations, HIPAA, and Indian data protection standards.',
    },
    {
      id: 'faq-product-translation',
      question: 'How does research translate into actual healthcare products?',
      answer:
        'Our research teams work side-by-side with product engineers and healthcare specialists. Rather than remaining theoretical, algorithmic breakthroughs and clinical models are integrated directly into our consumer and enterprise healthcare platforms to deliver measurable health outcomes.',
    },
    {
      id: 'faq-application-timing',
      question: 'When is the best time for PhD candidates to apply for full-time positions?',
      answer:
        'We review full-time research applications on a rolling basis throughout the year. If you are approaching the final year or defending your PhD, we encourage you to begin exploring roles 6 to 9 months before your intended start date.',
    },
  ],
};