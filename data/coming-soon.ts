export interface ExploreLink {
  label: string;
  href: string;
  icon: 'calculator' | 'newspaper' | 'briefcase' | 'home';
}

export interface ComingSoonData {
  badge: {
    label: string;
  };
  hero: {
    title: string;
    description: string;
  };
  form: {
    placeholder: string;
    buttonText: string;
    loadingText: string;
    successTitle: string;
    successMessage: string;
    invalidEmailError: string;
    disclaimer: string;
  };
  explore: {
    title: string;
    links: ExploreLink[];
  };
  mailbox: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  bottomBanner: {
    tagline: string;
    contactText: string;
    contactHref: string;
  };
}

export const COMING_SOON_DATA: ComingSoonData = {
  badge: {
    label: 'Stay Tuned • In Development',
  },
  hero: {
    title: 'Something thoughtful is coming soon.',
    description:
      'We are actively crafting this module to deliver a seamless, evidence-driven healthcare experience. Our team is refining every detail to ensure the highest standard of connectivity and usability across the Pentasent platform.',
  },
  form: {
    placeholder: 'Enter your email for updates...',
    buttonText: 'Notify Me',
    loadingText: 'Submitting...',
    successTitle: "You're on the priority list!",
    successMessage: "We'll send you an early notification as soon as this feature goes live.",
    invalidEmailError: 'Please enter a valid email address.',
    disclaimer: 'No spam ever. You can unsubscribe at any time with one click.',
  },
  explore: {
    title: 'Explore Active Sections',
    links: [
      {
        label: 'Health Calculators',
        href: '/tools',
        icon: 'calculator',
      },
      {
        label: 'Articles & News',
        href: '/blog',
        icon: 'newspaper',
      },
      {
        label: 'Careers & Roles',
        href: '/company/careers',
        icon: 'briefcase',
      },
      {
        label: 'Home',
        href: '/',
        icon: 'home',
      },
    ],
  },
  mailbox: {
    src: '/assets/images/comingsoon/mailbox.png',
    alt: 'Pentasent Coming Soon Mailbox',
    width: 560,
    height: 520,
  },
  bottomBanner: {
    tagline: 'Pentasent Digital Health Infrastructure • Building the future of connected health.',
    contactText: 'Have questions or suggestions? Reach out',
    contactHref: '/company/contact',
  },
};
