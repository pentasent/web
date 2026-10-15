import { SupportArticle, StakeholderCard, PricingPageContent } from '@/types/pricing';

export const PRICING_PAGE_CONTENT: PricingPageContent = {
  formTitle: 'Request quote',
  overviewTitle: 'Transparent pricing',
};

export const PRICING_OVERVIEW_ARTICLES: SupportArticle[] = [
  {
    id: 'individuals',
    title: 'For Individuals',
    parts: [
      {
        text: 'Explore Pentasent for your personal health and wellness journey. Discover healthcare information, people, organizations, products, communities, events, and tools designed to help you make more informed decisions about your health.',
      },
      {
        text: 'Explore My Health',
        isLink: true,
        href: '/my-health',
      },
      {
        text: ' to learn more about what is available to you.',
      },
    ],
  },
  {
    id: 'professionals',
    title: 'For Healthcare Professionals',
    parts: [
      {
        text: 'Healthcare professionals can use Pentasent to build their professional presence, discover relevant communities and events, share knowledge, and connect with people and organizations across the healthcare ecosystem.',
      },
      {
        text: 'Explore for Professionals',
        isLink: true,
        href: '/professionals',
      },
      {
        text: ' to discover the experience.',
      },
    ],
  },
  {
    id: 'organizations',
    title: 'For Organizations',
    parts: [
      {
        text: 'Hospitals, clinics, healthcare companies, institutions, and other organizations can build their presence on Pentasent, connect with the right people, showcase their work, and become part of a growing healthcare ecosystem.',
      },
      {
        text: 'Explore Organizations',
        isLink: true,
        href: '/organizations',
      },
      {
        text: ' to learn more.',
      },
    ],
  },
  {
    id: 'products',
    title: 'For Healthcare Products',
    parts: [
      {
        text: 'Healthcare products and innovations can find a place within the Pentasent ecosystem. From digital health products and wellness solutions to emerging healthcare technologies, Pentasent helps make useful innovations easier to discover.',
      },
      {
        text: 'Explore Products',
        isLink: true,
        href: '/products',
      },
      {
        text: ' to see how the ecosystem brings them together.',
      },
    ],
  },
];

export const PRICING_STAKEHOLDER_CARDS: StakeholderCard[] = [
  {
    id: 'individual-plans',
    title: 'Personal plans',
    description:
      'Looking for Pentasent for yourself? Explore the tools, experiences, and services available for your personal health and wellness journey at one place.',
    icon: 'building',
    actionText: 'Explore personal plans',
    actionHref: '/pricing',
  },
  {
    id: 'organization-plans',
    title: 'Organization plans',
    description:
      'Building a presence for a hospital, clinic, company, institution, or healthcare organization? Explore options designed for organizations.',
    icon: 'stethoscope',
    actionText: 'Explore organization plans',
    actionHref: '/pricing',
  },
];

// export const PRICING_OVERVIEW_ARTICLES: SupportArticle[] = [
//   {
//     id: 'hospitals-clinics-organizations',
//     title: 'Hospitals, Clinics & Healthcare Organizations',
//     parts: [
//       {
//         text: 'For healthcare institutions, diagnostic networks, and multi-specialty clinics, Pentasent delivers scalable organizational packages. Every tier includes verified organizational credentials, multi-practitioner roster administration, priority healthcare directory indexing, and institutional integration support. Volume pricing is tailored based on verified clinical headcount and facility locations. ',
//       },
//       {
//         text: 'Explore organization onboarding',
//         isLink: true,
//         href: '/help',
//       },
//       {
//         text: ' or submit the form on the left for a tailored quote.',
//       },
//     ],
//   },
//   {
//     id: 'personal-health-wellness',
//     title: 'Personal Health & Wellness (My Health)',
//     parts: [
//       {
//         text: 'Core tools on Pentasent—including interactive wellness calculators (BMI, BMR, TDEE), healthcare measurement converters, doctor and clinic discovery, and public wellness communities—are 100% free with zero advertisements. We believe essential health empowerment should be accessible to all. Specialized longitudinal health goal tracking, guided 21-day health challenges, and dedicated expert circles are available under flexible community memberships with strict data privacy. ',
//       },
//       {
//         text: 'Learn about our privacy promise',
//         isLink: true,
//         href: '/company/about',
//       },
//       {
//         text: '.',
//       },
//     ],
//   },
//   {
//     id: 'healthtech-innovators',
//     title: 'Healthtech Products & Digital Health Innovators',
//     parts: [
//       {
//         text: 'Pentasent Innovation acts as the discovery layer uniting digital health applications, AI clinical tools, biotech solutions, and medical devices with verified physicians, clinicians, and institutional buyers. We provide transparent listing tiers ranging from basic directory inclusion to featured product launches, verified badge certifications, and targeted ecosystem showcases. ',
//       },
//       {
//         text: 'Contact our innovation desk',
//         isLink: true,
//         href: 'mailto:partners@pentasent.com',
//       },
//       {
//         text: ' to review launch schedules.',
//       },
//     ],
//   },
// ];

// export const PRICING_STAKEHOLDER_CARDS: StakeholderCard[] = [
//   {
//     id: 'enterprise-systems',
//     title: 'Enterprise health systems',
//     description:
//       'Are you a regional hospital network, university medical center, or diagnostic laboratory requiring custom SLAs, dedicated single sign-on (SSO), and business associate agreements?',
//     icon: 'building',
//     actionText: 'Schedule enterprise consultation',
//     actionHref: 'mailto:enterprise@pentasent.com',
//   },
//   {
//     id: 'research-grants',
//     title: 'Clinical research & grants',
//     description:
//       'Are you an academic clinical research team, non-profit healthcare initiative, or pre-seed founder eligible for subsidized ecosystem access and research credits?',
//     icon: 'stethoscope',
//     actionText: 'Apply for research grant',
//     actionHref: 'mailto:partners@pentasent.com',
//   },
// ];
