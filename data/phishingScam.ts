import { PhishingScamPageData } from '@/types/phishingScam';

export const PHISHING_SCAM_DATA: PhishingScamPageData = {
  hero: {
    badge: 'Security Advisory & Candidate Safety',
    title: 'Notice: Recruitment Fraud and Job Scam Alert',
    subtitle: 'Protect yourself from common recruitment scams',
    lastUpdated: 'Updated October 2026',
  },

  introNotice:
    'At Pentasent, your safety and trust are our top priorities. We are aware that scammers may impersonate recruiters from Pentasent or create fake job opportunities to deceive job seekers. Please read this important information to help you recognize and avoid recruitment fraud.',

  whatIsFraud: {
    title: 'What is recruitment fraud?',
    description:
      'Recruitment fraud happens when individuals or organizations falsely claim to represent Pentasent, often through fake job postings, emails, or messages. Their goal is to obtain your personal information, money, or login credentials.',
  },

  commonScams: {
    title: 'Common Recruitment Scams',
    items: [
      {
        id: 'fake-job-invitations',
        stepNumber: 1,
        title: 'Fake job invitations',
        description:
          'You may receive emails or messages claiming to be recruiting from Pentasent, inviting you to apply for a job. These often request personal information, payment, or login credentials.',
      },
      {
        id: 'imposter-email-domains',
        stepNumber: 2,
        title: 'Imposter email domains',
        description:
          'Scammers use email addresses that look similar to official domains from Pentasent but are misspelled or slightly altered (e.g., @pentasent-careers.com, @pentasentt.com, or personal domains like @gmail.com or @outlook.com instead of @pentasent.com).',
        actionLink: {
          text: 'Verify official email domains from Pentasent here.',
          href: '#official-domains',
          isExternal: false,
        },
      },
      {
        id: 'suspicious-links',
        stepNumber: 3,
        title: 'Suspicious links or attachments',
        description:
          'Be wary of communications urging you to click on links or download files to "complete an application" or "verify your account." These may be attempts to steal your information or infect your device.',
      },
      {
        id: 'imposter-recruiting-sites',
        stepNumber: 4,
        title: 'Imposter recruiting sites',
        description:
          'Scammers may create fake websites that mimic a Pentasent Careers page, prompting you to log in with your credentials or provide sensitive information.',
        actionLink: {
          text: 'Always apply for jobs through the official Pentasent Careers site.',
          href: '/company/careers',
          isExternal: false,
        },
      },
      {
        id: 'requests-for-payment',
        stepNumber: 5,
        title: 'Requests for payment',
        description:
          'Pentasent will never ask you to pay any fees at any stage of the recruitment process. If you are asked for payment, it is a scam. Pentasent does not charge any fee for employment or for any step of the recruitment process.',
        highlightCallout:
          'Pentasent will never ask you to pay any fees at any stage of the recruitment process. If you are asked for payment, it is a scam.',
      },
    ],
  },

  verification: {
    title: 'How to verify legitimate communications from Pentasent',
    senderDomainGuidance:
      "Check the sender's email address: Only trust emails from official domains from Pentasent.",
    officialDomainsListLinkText:
      'See the list of accurate email domains from Pentasent.',
    officialDomains: [
      '@pentasent.com',
      '@careers.pentasent.com',
      'careers@pentasent.com',
      'recruitment@pentasent.com',
    ],
    officialChannelsGuidance:
      'Apply only through official channels: All Pentasent job applications are managed through',
    careersPortalLink: {
      text: 'pentasent.com/company/careers',
      href: '/company/careers',
    },
    neverDoList: {
      title: 'Pentasent will never:',
      items: [
        'Ask for payment or bank details as part of the recruitment process',
        'Request your Social Security Number, national ID, or other sensitive information via email or chat before an official offer',
        'Conduct formal interviews over unauthorized third-party messaging apps (such as WhatsApp, Telegram, or Google Chat) without a verified scheduling workflow and video call with Pentasent team members',
      ],
    },
  },

  contractorOpportunities: {
    title: 'Contractor opportunities at Pentasent',
    description:
      'The official platform for contract and partner opportunities at Pentasent is: https://pentasent.com/company/careers. If you are interested in contract roles at Pentasent, always apply through this platform. Any contract opportunity not listed on this platform is not an official contract role at Pentasent.',
    portalLink: {
      text: 'https://pentasent.com/company/careers',
      href: '/company/careers',
    },
  },

  suspectedScamActions: {
    title: 'What to do if you suspect a scam',
    checklist: [
      'Do not respond to suspicious messages or provide any personal information.',
      'Do not click on links or download attachments from unknown sources.',
      'Report the incident using the "Contact" page on the Pentasent site or to your local law enforcement agency.',
      'Forward the suspicious email or message to phishing@pentasent.com.',
      'Use your email provider\'s "report phishing" feature.',
    ],
    securityEmail: 'security@pentasent.com',
    phishingEmail: 'phishing@pentasent.com',
  },
};
