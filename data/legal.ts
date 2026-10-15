import { LegalNavTab, LegalPageData } from '@/types/legal';

export const LEGAL_NAV_TABS: LegalNavTab[] = [
  {
    title: 'Privacy Policy',
    href: '/legal/privacy',
    description: 'How we safeguard, encrypt, and handle your sensitive health and personal data.',
  },
  {
    title: 'Terms of Service',
    href: '/legal/terms',
    description: 'The terms, community guidelines, and medical disclaimers governing our ecosystem.',
  },
  {
    title: 'Cookie Policy',
    href: '/legal/cookies',
    description: 'Information regarding session cookies, functional preferences, and zero ad-tracking.',
  },
];

/* =========================================================================
   1. PRIVACY POLICY DATA
   ========================================================================= */
export const PRIVACY_POLICY_DATA: LegalPageData = {
  slug: 'privacy',
  hero: {
    badge: 'Legal & Data Governance',
    title: 'Pentasent Privacy Policy',
    subtitle:
      'We believe personal health data requires the highest level of trust, privacy, consent, and security.',
    lastUpdated: 'Last Updated: October 2026 • Version 2.4',
  },
  leadNotice:
    'At Pentasent, your confidentiality and autonomy over your data are fundamental. Pentasent is a unified healthcare ecosystem connecting people, healthcare professionals, organizations, and innovation. This Privacy Policy details how we collect, process, safeguard, and ensure strict consent for your personal and health-related information across our platform, mobile applications, and web services.',
  keyPillars: [
    {
      title: 'Consent-First Processing',
      description: 'You maintain absolute control over your personal health entries and tracking metrics.',
    },
    {
      title: 'Zero Health Ad-Selling',
      description: 'We never sell, rent, or trade your personal health data to third-party advertisers or brokers.',
    },
    {
      title: 'Enterprise Encryption',
      description: 'Data is protected by TLS 1.3 in transit and AES-256 encryption at rest across our infrastructure.',
    },
  ],
  sections: [
    {
      id: 'ecosystem-scope',
      number: 1,
      title: 'Scope & Architecture of Pentasent',
      content:
        'This Privacy Policy applies to all individuals and entities accessing the Pentasent platform, including everyday users, health-conscious members, patients, licensed healthcare professionals (physicians, therapists, specialists, allied practitioners), healthcare organizations (clinics, hospitals, laboratories, diagnostic centers), and healthcare innovators. Our platform operates across four primary pillars: My Health, Healthcare, Organizations, and Innovation.',
    },
    {
      id: 'information-we-collect',
      number: 2,
      title: 'Information We Collect',
      content:
        'We collect information solely to deliver a connected, high-integrity healthcare discovery and wellness experience. We categorize the collected information as follows:',
      subsections: [
        {
          title: 'A. Account & Profile Credentials',
          bullets: [
            'Basic Identity Data: Full name, verified email address, phone number, and password credentials.',
            'Role Classification: Selected user identity (e.g., Everyday Individual / Member, Healthcare Practitioner, Organization Representative, or Healthtech Innovator).',
            'Demographic Details: Region, city, country, preferred language, and timezone.',
          ],
        },
        {
          title: 'B. Personal Health & Wellness Tracking (My Health)',
          bullets: [
            'Self-Managed Wellness Metrics: Data voluntarily entered into Pentasent wellness tools (e.g., height and weight for BMI calculations, activity frequency, sleep duration, calorie calculations, and lifestyle goals).',
            'Health Challenges & Community Participation: Goals, habit streaks, and supportive milestone interactions.',
            'Explicit Notice: All health tracking data is entirely elective and processed on a strict consent basis.',
          ],
        },
        {
          title: 'C. Professional Practitioner Verification Data (Healthcare)',
          bullets: [
            'Medical Qualifications: Medical council registration numbers, clinical degrees, licenses, affiliations, and specialties.',
            'Practice Information: Clinic affiliations, hospital appointments, consultation languages, and professional biography.',
          ],
        },
        {
          title: 'D. Organization & Institutional Data (Organizations & Innovation)',
          bullets: [
            'Institutional Details: Clinic/hospital name, facility licenses, services offered, verified locations, staff rosters, and organizational contact data.',
            'Product & Breakthrough Submissions: Information about medical devices, digital health tools, clinical research publications, or health software submitted for platform discovery.',
          ],
        },
        {
          title: 'E. Technical, Security & Usage Data',
          bullets: [
            'Device & Network Identifiers: IP address, browser type, operating system, and device identifiers.',
            'Security Logs: Timestamped authentication attempts, fraud-detection signals, and encrypted session cookies.',
          ],
        },
      ],
    },
    {
      id: 'how-we-use-information',
      number: 3,
      title: 'How We Process and Use Your Information',
      content:
        'We process personal and health-related data solely for legitimate, authorized, and transparent purposes:',
      bullets: [
        'To power the Pentasent ecosystem: Enabling discovery of healthcare professionals, clinics, health communities, and medical research.',
        'To run health and wellness tools: Calculating educational metrics (BMI, BMR, calorie needs) based on your self-directed inputs.',
        'To safeguard platform integrity: Verifying medical licenses of clinicians, validating organization listings, and detecting imposter or fraudulent accounts.',
        'To facilitate communication: Delivering security notifications, account recovery workflows, and important legal updates.',
        'To comply with statutory legal and regulatory obligations applicable to digital health platforms.',
      ],
    },
    {
      id: 'health-data-principles',
      number: 4,
      title: 'Strict Health Data Principles & Consent',
      content:
        'Pentasent recognizes that personal health information is inherently sensitive. We adhere strictly to the following foundational rules:',
      bullets: [
        'Never Sell Health Data: We do not sell, rent, monetize, or disclose your personal health metrics or medical tracking records to advertisers, data brokers, or pharmaceutical marketers.',
        'Data Minimization: We only request the minimum information required to deliver the specific tool or discovery feature you choose to use.',
        'Granular Consent: You decide what information is public on your profile and what remains strictly private. You can modify your consent settings at any time.',
        'No Automated Diagnosis: We do not use automated algorithms to render clinical diagnoses or prescriptive medical determinations.',
      ],
      callout: {
        type: 'shield',
        title: 'Our Health Privacy Commitment',
        content:
          'Your health tracking numbers, wellness notes, and personal metrics remain strictly confidential. Pentasent does not monetize user health records.',
      },
    },
    {
      id: 'data-sharing-disclosure',
      number: 5,
      title: 'Information Sharing and Disclosures',
      content:
        'We disclose your information only under clear, restricted circumstances outlined below:',
      bullets: [
        'User-Directed Sharing: When you choose to share your professional profile, organization listing, or community post publicly within the Pentasent ecosystem.',
        'Trusted Infrastructure Providers: Cloud hosting, database encryption, customer support infrastructure, and transactional email services operating under strict Data Processing Agreements (DPAs).',
        'Legal Requirements & Emergency Protection: In rare cases where disclosure is mandated by valid subpoena, court order, or applicable law, or to protect the vital life safety of an individual in a medical emergency.',
      ],
    },
    {
      id: 'data-security',
      number: 6,
      title: 'Data Security & Encryption Architecture',
      content:
        'Pentasent implements enterprise-grade technical, physical, and administrative safeguards designed to protect personal and clinical data from unauthorized access, alteration, or disclosure:',
      bullets: [
        'All data in transit is encrypted using modern Transport Layer Security (TLS 1.3 / HTTPS).',
        'Sensitive health attributes and database records are encrypted at rest using AES-256 bit encryption.',
        'Strict role-based access control (RBAC) and mandatory multi-factor authentication (MFA) govern administrative systems.',
        'Continuous automated monitoring for suspicious access patterns, unauthorized penetration attempts, and anomalous behavior.',
      ],
    },
    {
      id: 'data-subject-rights',
      number: 7,
      title: 'Your Privacy Rights & Controls',
      content:
        'Regardless of your location, Pentasent respects comprehensive data subject rights aligned with global standards (including the EU GDPR, UK GDPR, and India Digital Personal Data Protection Act 2023):',
      bullets: [
        'Right to Access: You can request a complete copy of all personal and health data Pentasent holds regarding your account.',
        'Right to Rectification: You can update, correct, or amend inaccurate or outdated profile and credential details at any time.',
        'Right to Erasure (Right to be Forgotten): You can permanently delete your account and all associated health tracking records.',
        'Right to Data Portability: You can export your self-tracked health data and profile entries in a structured, machine-readable format (JSON/CSV).',
        'Right to Withdraw Consent: You may revoke consent for any optional processing activity without affecting prior lawful processing.',
      ],
    },
    {
      id: 'retention-deletion',
      number: 8,
      title: 'Data Retention & Account Deletion',
      content:
        'We retain personal information only for as long as your account remains active or as necessary to fulfill the purposes set forth in this policy. When you delete your Pentasent account through your account settings or by contacting privacy@pentasent.com, all personal identification and sensitive health tracking records are permanently purged or rendered completely anonymous within 30 days, except where statutory legal preservation is mandated.',
    },
    {
      id: 'children-privacy',
      number: 9,
      title: "Children's Privacy Protection",
      content:
        'Pentasent is intended for individuals aged 18 and older. We do not knowingly solicit or collect personal health data from children under 18 without verifiable parental or guardian authorization and oversight. If we discover that a minor under 18 has provided personal data without parental consent, we will promptly delete that data.',
    },
    {
      id: 'contact-privacy',
      number: 10,
      title: 'Data Protection Officer & Contact Inquiries',
      content:
        'If you have questions, feedback, or wish to exercise any of your data protection rights under this Privacy Policy, please contact our Data Protection Office directly:',
      bullets: [
        'Email: privacy@pentasent.com',
        'Data Protection Officer: dpo@pentasent.com',
        'Security Team: security@pentasent.com',
        'Mailing Address: Pentasent Inc., Data Protection Office, London Hub, United Kingdom.',
      ],
    },
  ],
  actionCards: [
    {
      icon: 'fileText',
      title: 'Terms of Service',
      description: 'Review our platform community guidelines and medical disclaimers.',
      linkText: 'Read Terms of Service',
      linkHref: '/legal/terms',
    },
    {
      icon: 'shield',
      title: 'Cookie Policy',
      description: 'Learn how we manage session tokens and respect zero ad-tracking.',
      linkText: 'Read Cookie Policy',
      linkHref: '/legal/cookies',
    },
    {
      icon: 'mail',
      title: 'Contact Privacy Team',
      description: 'Submit an inquiry or request an export of your stored personal health data.',
      linkText: 'Email privacy team',
      linkHref: 'mailto:privacy@pentasent.com',
    },
  ],
};

/* =========================================================================
   2. TERMS OF SERVICE DATA
   ========================================================================= */
export const TERMS_OF_SERVICE_DATA: LegalPageData = {
  slug: 'terms',
  hero: {
    badge: 'Terms & Ecosystem Agreement',
    title: 'Pentasent Terms of Service',
    subtitle:
      'The foundational terms, user guidelines, and medical disclaimers that govern your use of the Pentasent healthcare ecosystem.',
    lastUpdated: 'Last Updated: October 2026 • Version 3.1',
  },
  leadNotice:
    'Welcome to Pentasent. By accessing or utilizing the Pentasent platform, mobile applications, APIs, or associated services (collectively, the "Services"), you enter into a legally binding agreement with Pentasent ("Pentasent", "we", "our", or "us"). Please review these Terms of Service thoroughly before engaging with our healthcare ecosystem.',
  keyPillars: [
    {
      title: 'No Emergency Services',
      description: 'Pentasent is an informational ecosystem and does not provide emergency medical care.',
    },
    {
      title: 'Verified Integrity',
      description: 'Clinicians and organizations must provide accurate, verified licensing credentials.',
    },
    {
      title: 'Strict Anti-Fraud',
      description: 'Impersonation, recruitment scams, and fraudulent solicitations are strictly prohibited.',
    },
  ],
  sections: [
    {
      id: 'medical-emergency-disclaimer',
      number: 1,
      title: 'Critical Medical & Emergency Disclaimer',
      content:
        'Pentasent is a unified healthcare technology platform and ecosystem. It is NOT a medical clinic, hospital, licensed pharmacy, or emergency healthcare dispatch provider. We do not employ medical staff to provide emergency or urgent clinical diagnosis.',
      callout: {
        type: 'alert',
        title: 'DO NOT USE PENTASENT FOR MEDICAL EMERGENCIES',
        content:
          'If you are experiencing a medical emergency, acute symptoms, severe distress, or life-threatening condition, immediately dial your local emergency services (e.g., 911 in the US, 112 in Europe, 102/112 in India) or proceed immediately to the nearest hospital emergency room. Never disregard professional medical advice or delay seeking medical care because of information found on Pentasent.',
      },
      bullets: [
        'Informational & Educational Purpose: All health calculators (BMI, BMR, calorie calculators, health tracking metrics, challenge checklists, and wellness resources) are provided strictly for educational and self-tracking purposes.',
        'No Doctor-Patient Relationship: Merely browsing practitioner profiles, reading articles, or utilizing wellness calculators does NOT establish a doctor-patient, therapist-client, or fiduciary healthcare relationship with Pentasent.',
        'Independent Practitioners: Healthcare professionals listed on Pentasent are independent entities responsible for their own professional advice, licensing, and clinical compliance.',
      ],
    },
    {
      id: 'eligibility-accounts',
      number: 2,
      title: 'Eligibility & Account Responsibilities',
      content:
        'To register and maintain an account on Pentasent, you must satisfy the following criteria:',
      bullets: [
        'Age Requirement: You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to establish an independent account.',
        'Account Accuracy: You agree to provide true, accurate, current, and complete information during registration and keep your profile updated.',
        'Credential Confidentiality: You are solely responsible for safeguarding your password and account security. You agree to notify us immediately at security@pentasent.com of any unauthorized access.',
        'Account Responsibility: You are responsible for all activities and entries originating under your authenticated account.',
      ],
    },
    {
      id: 'practitioner-organization-rules',
      number: 3,
      title: 'Healthcare Professional & Organization Requirements',
      content:
        'Special terms apply to users registering as verified healthcare practitioners or organization representatives:',
      subsections: [
        {
          title: 'Healthcare Professionals (Doctors, Clinicians, Specialists, Allied Health)',
          bullets: [
            'License Warranty: You warrant that all medical council registrations, certifications, clinical credentials, and qualifications you submit are authentic, active, and in good standing with the relevant governing bodies.',
            'No Deceptive Practice: You agree to practice strictly within the scope of your valid licensure and maintain appropriate professional indemnity coverage where required.',
            'Duty of Notification: You must promptly notify Pentasent if your professional license or accreditation is suspended, revoked, or subject to formal regulatory sanctions.',
          ],
        },
        {
          title: 'Healthcare Organizations (Hospitals, Clinics, Diagnostic Labs, Startups)',
          bullets: [
            'Authorized Authority: You warrant that you have explicit authority to represent and bind the organization on the platform.',
            'Accurate Representation: Organizational services, locations, medical equipment accreditations, and staff listings must be accurately maintained.',
          ],
        },
      ],
    },
    {
      id: 'community-standards',
      number: 4,
      title: 'Permitted Use & Healthcare-Native Community Standards',
      content:
        'Pentasent is designed to foster a safe, trustworthy, and supportive healthcare ecosystem. You agree NOT to engage in any of the following prohibited behaviors:',
      bullets: [
        'Disseminating unverified medical claims, dangerous treatment advice, or deliberate health misinformation.',
        'Harassing, threatening, defaming, or violating the privacy of any user, practitioner, or organization.',
        'Impersonating another person, doctor, clinic, healthcare entity, or Pentasent recruiter.',
        'Engaging in recruitment fraud, fake employment solicitations, fee requests, or phishing attempts (refer to our Recruitment Fraud Alert at /company/careers/phishing-scam).',
        'Using automated scrapers, crawlers, or bots to harvest personal, professional, or organizational listings without written consent.',
        'Attempting to bypass security controls, decrypt data, inject malicious scripts, or disrupt system infrastructure.',
      ],
    },
    {
      id: 'health-tools-tracking',
      number: 5,
      title: 'Health Tracking & Self-Managed Tools (My Health)',
      content:
        'Pentasent offers wellness calculators, habit tracking, and health measurement converters to support your wellbeing journey:',
      bullets: [
        'User Accuracy: Calculations generated by Pentasent tools depend entirely on the numeric values and measurements you provide.',
        'Non-Diagnostic: Calculated figures (such as BMI classifications or calorie projections) represent generalized statistical formulas and are not tailored clinical assessments of your metabolic or physical health.',
        'Consultation Recommended: Always review any significant change to your diet, exercise regimen, or lifestyle with your personal physician.',
      ],
    },
    {
      id: 'innovation-products',
      number: 6,
      title: 'Healthcare Innovation & Product Discovery',
      content:
        'Our Innovation pillar showcases digital health products, healthtech startups, medtech devices, and clinical research:',
      bullets: [
        'Non-Endorsement: The inclusion of any healthcare product, startup, or research paper does NOT constitute a clinical endorsement, safety guarantee, or regulatory verification by Pentasent.',
        'Independent Due Diligence: Users, clinics, and investors are responsible for conducting their own clinical and technical due diligence before adopting or purchasing listed innovations.',
      ],
    },
    {
      id: 'intellectual-property',
      number: 7,
      title: 'Intellectual Property & Content Ownership',
      content:
        'All intellectual property rights associated with the Pentasent platform are governed as follows:',
      bullets: [
        'Pentasent IP: The Pentasent trademarks, logos, system architecture, user interface designs, custom graphics, and software code are the exclusive property of Pentasent and protected under international copyright, trademark, and trade secret laws.',
        'Your Content: You retain ownership of articles, reviews, feedback, and comments you post. By posting content on public or community areas of Pentasent, you grant Pentasent a non-exclusive, worldwide, royalty-free license to display, adapt, and distribute that content across the ecosystem.',
      ],
    },
    {
      id: 'limitation-of-liability',
      number: 8,
      title: 'Limitation of Liability & Warranty Disclaimer',
      content:
        'To the fullest extent permitted under applicable law, the Pentasent platform is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, statutory, or implied.',
      callout: {
        type: 'warning',
        title: 'Liability Cap',
        content:
          'In no event shall Pentasent, its founders, directors, employees, or partners be liable for any indirect, punitive, incidental, special, or consequential damages, or any loss of health outcomes, profits, or data arising out of or related to your use of the Services.',
      },
    },
    {
      id: 'governing-law',
      number: 9,
      title: 'Governing Law & Dispute Resolution',
      content:
        'These Terms of Service and any dispute arising from them shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any legal action or proceeding shall be brought exclusively in the courts of competent jurisdiction located in Gurugram / New Delhi, India.',
    },
    {
      id: 'contact-legal',
      number: 10,
      title: 'Legal Notices & Contact Information',
      content:
        'For formal legal notices, dispute inquiries, or questions regarding these Terms of Service, please contact our Legal Department:',
      bullets: [
        'Legal Counsel: legal@pentasent.com',
        'Compliance & Integrity: compliance@pentasent.com',
        'Support & Helpdesk: support@pentasent.com',
        'Corporate Office: Pentasent Inc., London Global HQ, United Kingdom.',
      ],
    },
  ],
  actionCards: [
    {
      icon: 'fileText',
      title: 'Privacy Policy',
      description: 'Learn how your sensitive health information is encrypted and protected.',
      linkText: 'Read Privacy Policy',
      linkHref: '/legal/privacy',
    },
    {
      icon: 'shield',
      title: 'Recruitment Fraud Alert',
      description: 'Review our security notice regarding imposter scams and fake recruitment.',
      linkText: 'Read Fraud Notice',
      linkHref: '/company/careers/phishing-scam',
    },
    {
      icon: 'mail',
      title: 'Contact Legal',
      description: 'Reach our legal and compliance division regarding contract inquiries.',
      linkText: 'Email legal counsel',
      linkHref: 'mailto:legal@pentasent.com',
    },
  ],
};

/* =========================================================================
   3. COOKIE POLICY DATA
   ========================================================================= */
export const COOKIE_POLICY_DATA: LegalPageData = {
  slug: 'cookies',
  hero: {
    badge: 'Cookie & Tracking Governance',
    title: 'Pentasent Cookie Policy',
    subtitle:
      'Complete transparency regarding cookies, session storage, and our zero third-party health ad-tracking guarantee.',
    lastUpdated: 'Last Updated: October 2026 • Version 2.0',
  },
  leadNotice:
    'This Cookie Policy describes how Pentasent ("we", "us", or "our") uses cookies, local storage, session identifiers, and similar technologies when you visit or interact with our platform at pentasent.com and our digital services. We are dedicated to providing clear, honest explanations about the technologies we use and their strict operational purpose.',
  keyPillars: [
    {
      title: 'Zero Third-Party Ad Trackers',
      description: 'We do not run third-party advertising cookies that track your health habits across the web.',
    },
    {
      title: 'Strictly Functional',
      description: 'Cookies are used primarily for secure session authentication and user preference memory.',
    },
    {
      title: 'User Control',
      description: 'You can manage, restrict, or clear browser cookies at any time through your browser settings.',
    },
  ],
  sections: [
    {
      id: 'what-are-cookies',
      number: 1,
      title: 'What Are Cookies and Local Storage Technologies?',
      content:
        'A cookie is a small text file placed on your computer, tablet, or mobile device by websites that you visit. Cookies and web storage (such as localStorage and sessionStorage) allow web applications to recognize your browser, maintain authenticated sessions, store your display preferences, and ensure responsive page performance.',
    },
    {
      id: 'why-we-use-cookies',
      number: 2,
      title: 'How & Why Pentasent Uses Cookies',
      content:
        'Unlike conventional commercial web platforms, Pentasent does not monetize user attention through intrusive behavioral advertising networks. We use cookies strictly for:',
      bullets: [
        'Secure Authentication: Keeping you safely signed into your verified profile as you navigate across ecosystem features.',
        'Platform Security & Anti-Fraud: Verifying Cross-Site Request Forgery (CSRF) tokens, detecting malicious login attempts, and blocking credential stuffing bots.',
        'Functional Preferences: Remembering user choices such as dark/light display mode, unit preferences for wellness tools (Metric vs Imperial for height and weight in BMI calculators), and language preferences.',
        'Aggregated Performance Analytics: Gauging aggregated page load latency, network stability, and server performance without building profiling dossiers on your health.',
      ],
      callout: {
        type: 'shield',
        title: 'Zero Health Ad-Tracking Guarantee',
        content:
          'Pentasent NEVER sells your cookie data, nor do we deploy third-party advertising tracking pixels (such as third-party retargeting pixels) that follow your health browsing patterns to serve you ads across the internet.',
      },
    },
    {
      id: 'cookie-categories',
      number: 3,
      title: 'Categories of Cookies Used on Pentasent',
      content:
        'We classify the cookies and local storage tokens deployed across our services into the following distinct categories:',
      subsections: [
        {
          title: '1. Strictly Necessary / Essential Cookies',
          description:
            'These cookies are fundamental to the operation of the Pentasent platform. They enable secure account authentication, route navigation, and security defenses. The platform cannot function properly without these cookies, and they cannot be disabled.',
          bullets: [
            'penta_session: Manages encrypted authenticated session state.',
            'penta_csrf: Protects against cross-site request forgery attacks.',
            'penta_auth_token: Secures authenticated API communications.',
          ],
        },
        {
          title: '2. Functional & Preference Cookies',
          description:
            'These cookies allow Pentasent to remember choices you make and provide personalized, enhanced convenience:',
          bullets: [
            'penta_theme: Stores selected interface mode (dark or light).',
            'penta_calc_units: Remembers chosen measurement system (kg/cm vs lbs/inches) for wellness calculators.',
            'penta_lang: Preserves selected regional and language preference.',
          ],
        },
        {
          title: '3. Performance & Diagnostic Cookies',
          description:
            'These cookies collect aggregate, pseudonymized diagnostic information to help us understand which pages take longer to render, detect JavaScript errors, and optimize server capacity.',
          bullets: [
            'penta_perf_id: Measures page load timing and static asset delivery speeds.',
            'penta_err_trace: Logs crash reports and client-side rendering exceptions.',
          ],
        },
        {
          title: '4. Security & Imposter Prevention Cookies',
          description:
            'These tokens help detect anomalous login activity, prevent account hijacking, and block recruitment scam bots attempting to harvest contact information.',
        },
      ],
    },
    {
      id: 'cookie-inventory-table',
      number: 4,
      title: 'Inventory of Active Pentasent Cookies',
      content:
        'The following table details the primary cookies utilized across our ecosystem:',
    },
    {
      id: 'managing-cookies',
      number: 5,
      title: 'How to Manage and Disable Cookies',
      content:
        'You have the right to decide whether to accept or reject non-essential cookies. You can exercise your cookie preferences through several methods:',
      bullets: [
        'Browser Controls: Most modern web browsers allow you to view, manage, delete, and block cookies through their settings. You can configure your browser to block all cookies or notify you when a cookie is set.',
        'Google Chrome: Settings > Privacy and Security > Third-Party Cookies.',
        'Apple Safari: Settings > Safari > Advanced > Block All Cookies.',
        'Mozilla Firefox: Settings > Privacy & Security > Cookies and Site Data.',
        'Microsoft Edge: Settings > Cookies and Site Permissions > Manage and Delete Cookies.',
        'Impact of Disabling Cookies: If you choose to disable strictly necessary cookies, key sections of the platform requiring secure sign-in, personal health tracking, or profile management may not function as intended.',
      ],
    },
    {
      id: 'dnt-signals',
      number: 6,
      title: 'Do-Not-Track (DNT) and Global Privacy Control (GPC)',
      content:
        'Pentasent recognizes and respects Global Privacy Control (GPC) signals and Do-Not-Track (DNT) browser headers. When a GPC or DNT signal is detected, our systems automatically disable all non-essential performance diagnostics for that browser session.',
    },
    {
      id: 'updates-policy',
      number: 7,
      title: 'Updates to this Cookie Policy',
      content:
        'We may update this Cookie Policy periodically to reflect changes in our operational technologies, security updates, or legal mandates. Any revisions will be published on this page with an updated "Last Updated" timestamp.',
    },
    {
      id: 'contact-cookies',
      number: 8,
      title: 'Cookie Inquiries & Contact Details',
      content:
        'If you have questions regarding our use of cookies or tracking governance, please contact our team:',
      bullets: [
        'Email: cookies@pentasent.com',
        'Privacy Office: privacy@pentasent.com',
        'Postal Address: Pentasent Inc., Data Protection Office, London Global HQ, United Kingdom.',
      ],
    },
  ],
  tableData: {
    caption: 'Active Cookies on Pentasent Platform',
    headers: ['Cookie Name', 'Category', 'Lifespan', 'Purpose'],
    rows: [
      {
        name: 'penta_session',
        type: 'Strictly Necessary',
        duration: 'Session / 14 Days',
        purpose: 'Maintains encrypted session state and authentication credentials.',
      },
      {
        name: 'penta_csrf',
        type: 'Strictly Necessary',
        duration: 'Session',
        purpose: 'Protects against Cross-Site Request Forgery (CSRF) exploits.',
      },
      {
        name: 'penta_theme',
        type: 'Functional',
        duration: '1 Year',
        purpose: 'Stores your preferred visual theme (dark or light mode).',
      },
      {
        name: 'penta_calc_units',
        type: 'Functional',
        duration: '6 Months',
        purpose: 'Remembers Metric or Imperial unit choices for wellness calculators.',
      },
      {
        name: 'penta_perf_id',
        type: 'Performance',
        duration: '30 Days',
        purpose: 'Collects pseudonymized aggregate metrics on page loading speed.',
      },
    ],
  },
  actionCards: [
    {
      icon: 'fileText',
      title: 'Privacy Policy',
      description: 'Read our comprehensive data protection and health privacy policy.',
      linkText: 'Read Privacy Policy',
      linkHref: '/legal/privacy',
    },
    {
      icon: 'shield',
      title: 'Terms of Service',
      description: 'Understand the legal conditions and rules governing platform use.',
      linkText: 'Read Terms of Service',
      linkHref: '/legal/terms',
    },
    {
      icon: 'mail',
      title: 'Cookie Inquiries',
      description: 'Have a question about our cookies or privacy architecture? Contact us.',
      linkText: 'Email cookie team',
      linkHref: 'mailto:cookies@pentasent.com',
    },
  ],
};
