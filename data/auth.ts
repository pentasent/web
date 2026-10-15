import {
  AccountCategory,
  OnboardingInfoType,
  AuthLayoutConfig,
  AuthLoginPageCopy,
  AuthRegisterPageCopy,
  AuthHeaderCopy,
  OnboardingInfoModalItem,
  OnboardingInfoModalLabels,
  OtpVerificationCopy,
  PasswordRecoveryCopy,
  OnboardingWelcomeCopy,
  OnboardingProfileFormCopy,
  OnboardingOrgFormCopy,
  OnboardingNotificationsCopy,
  OnboardingValidationMessages,
} from "@/types/auth";
import { Building2, GraduationCap, Stethoscope, User, Compass } from "lucide-react";

export const ACCOUNT_CATEGORIES: AccountCategory[] = [
  {
    id: 'individual',
    badge: 'Individuals & Doctors',
    title: 'Continue as Individual or Healthcare Professional',
    shortDesc: 'For everyday health tracking, patients, doctors, therapists & specialists',
    icon: Stethoscope,
    targetAudience:
      'Everyday health-conscious individuals, patients, and healthcare professionals including general physicians, specialists, surgeons, therapists, psychologists, dietitians, and clinical practitioners.',
    capabilities:
      'Track your personal health metrics, access health calculators (BMI, BMR), join health communities, or create a verified clinical profile to network, share knowledge, and build your professional presence.',
    features: [
      'Personal health metric tracking & health calculators',
      'Doctor, clinic, and specialist discovery directory',
      'Verified clinical practitioner profile & credentials badge',
      'Peer networking & healthcare knowledge sharing',
      'Supportive health communities & wellness challenges',
    ],
    confirmationPrompt: 'Are you sure you want to register as an Individual or Healthcare Professional?',
    continueLabel: 'Continue as Individual / Professional',
  },
  {
    id: 'organization',
    badge: 'Organizations & Clinics',
    title: 'Continue as Healthcare Organization or Clinic',
    shortDesc: 'For hospitals, multi-specialty clinics, diagnostic centers & healthtech',
    icon: Building2,
    targetAudience:
      'Hospitals, medical clinics, diagnostic centers, laboratories, pharmacies, healthtech startups, biotech enterprises, and healthcare provider networks.',
    capabilities:
      'Build your institution’s presence in the ecosystem, showcase clinical facilities, list verified physicians and departments, host healthcare events, and connect with clinical partners.',
    features: [
      'Verified Institutional Organization profile & multi-facility management',
      'Physician, department, and specialty public listings',
      'Healthcare events, medical summits & clinical webinar hosting',
      'B2B healthcare partnerships and innovation discovery',
      'Dedicated organizational dashboard & team access control',
    ],
    confirmationPrompt: 'Are you sure you want to register as a Healthcare Organization or Clinic?',
    continueLabel: 'Continue as Organization / Clinic',
  },
  {
    id: 'research',
    badge: 'Research & Academia',
    title: 'Continue as Research or Academic Institution',
    shortDesc: 'For medical universities, clinical research bodies, labs & academic centers',
    icon: GraduationCap,
    targetAudience:
      'Medical colleges, universities, clinical trial organizations, scientific laboratories, research institutes, and healthcare academic faculties.',
    capabilities:
      'Publish clinical studies and breakthroughs, connect with academic collaborators, showcase clinical trials, and publish medical papers across the Pentasent healthcare ecosystem.',
    features: [
      'Institutional research & academic verified credentials',
      'Clinical trial and study publishing platform',
      'Cross-institutional researcher collaboration network',
      'Medical student, faculty, and researcher community integration',
      'Scientific preprint, paper showcase & academic innovation index',
    ],
    confirmationPrompt: 'Are you sure you want to register as a Research or Academic Institution?',
    continueLabel: 'Continue as Research Institution',
  },
];

export const INTEREST_TAGS: string[] = [
  'Preventive Care',
  'Cardiology',
  'HealthTech & AI',
  'Clinical Trials',
  'Biotechnology',
  'Nutrition & Wellness',
  'Mental Health',
  'Oncology',
  'Genomics',
  'Medical Devices',
];

export const ORG_TYPES: string[] = [
  'Tertiary Hospital',
  'Specialty Medical Clinic',
  'HealthTech Enterprise',
  'Biotech & Life Sciences',
  'Research Institution',
  'Wellness Organization',
  'Medical University / Academic Body',
  'Nonprofit / Community Healthcare',
  'Other',
];

export const AUTH_LAYOUT_CONFIG: AuthLayoutConfig = {
  securityLabel: 'Secure Healthcare Identity',
  footerLinks: [
    { label: 'Terms of Service', href: '/legal/terms' },
    { label: 'Privacy Policy', href: '/legal/privacy' },
    // { label: 'Phishing Scam Warning', href: '/company/careers/phishing-scam' },
  ],
};

export const AUTH_LOGIN_PAGE_DATA: AuthLoginPageCopy = {
  badge: 'Access Account',
  title: 'Welcome to Pentasent',
  description:
    'Sign in with your email to access your personal profile, organizations, and healthcare ecosystem.',
};

export const AUTH_REGISTER_PAGE_DATA: AuthRegisterPageCopy = {
  badge: 'Get Started',
  title: 'Create your account',
  description:
    'One account for individuals, clinicians, researchers, and healthcare organizations.',
};

export const AUTH_HEADER_COPY: AuthHeaderCopy = {
  loginPrompt: 'New to Pentasent?',
  registerActionText: 'Create account',
  registerHref: '/auth/register',
  registerPrompt: 'Already registered?',
  loginActionText: 'Sign in',
  loginHref: '/auth/login',
  backPrefix: 'Back to',
  backBrand: 'Pentasent',
  backHref: '/',
};

export const ONBOARDING_MODAL_DATA: Record<OnboardingInfoType, OnboardingInfoModalItem> = {
  profile: {
    badge: 'Personal Human Identity',
    title: 'Set Up Your Personal Profile',
    subtitle: 'One account for patients, doctors, therapists, researchers & health builders.',
    targetAudience:
      'Everyday health-conscious individuals, patients, and healthcare professionals including general physicians, specialists, surgeons, therapists, psychologists, dietitians, and clinical practitioners.',
    capabilities:
      'Track your personal health metrics, access health calculators (BMI, BMR), join health communities, or create a verified clinical profile to network, share knowledge, and build your professional presence.',
    features: [
      'Personal health metric tracking & health calculators',
      'Doctor, clinic, and specialist discovery directory',
      'Verified clinical practitioner profile & credentials badge',
      'Peer networking & healthcare knowledge sharing',
      'Supportive health communities & wellness challenges',
    ],
    principle:
      'Every person starts with one personal Pentasent account. Even if you manage a hospital or clinic, you log in with your personal account.',
  },
  organization: {
    badge: 'Institutions & Companies',
    title: 'Create an Organization Profile',
    subtitle: 'For hospitals, multi-specialty clinics, diagnostic labs, healthtech & biotech.',
    targetAudience:
      'Hospitals, medical clinics, diagnostic centers, laboratories, pharmacies, healthtech startups, biotech enterprises, and healthcare provider networks.',
    capabilities:
      'Build your institution’s presence in the ecosystem, showcase clinical facilities, list verified physicians and departments, host healthcare events, and connect with clinical partners.',
    features: [
      'Verified Institutional Organization profile & multi-facility management',
      'Physician, department, and specialty public listings',
      'Healthcare events, medical summits & clinical webinar hosting',
      'B2B healthcare partnerships and innovation discovery',
      'Dedicated organizational dashboard & team access control',
    ],
    principle:
      'Organizations are entities managed by your personal Pentasent account. There is no separate hospital login or clinic account.',
  },
  explore: {
    badge: 'Immediate Ecosystem Access',
    title: 'Explore Pentasent First',
    subtitle: 'Experience healthcare discovery immediately with zero onboarding friction.',
    targetAudience:
      'Anyone who wants to browse doctors, health calculators, products, and communities before creating a public profile.',
    capabilities:
      'Browse verified medical practitioners, healthtech products, clinical trials, and calculators with full read access.',
    features: [
      'Immediate access to healthcare tools and calculators',
      'Explore leading hospitals, doctors, and clinics',
      'Read healthcare research publications and news',
      'Browse supportive patient and practitioner communities',
      'Complete your personal profile anytime from account settings',
    ],
    principle:
      'Onboarding is not a barrier to discovery. You can explore right now and set up your public profile or create an organization whenever you are ready.',
  },
};

export const ONBOARDING_MODAL_LABELS: OnboardingInfoModalLabels = {
  architecturePrincipleHeading: 'Architecture Principle:',
  targetAudienceHeading: 'Who is this for?',
  capabilitiesHeading: 'What can you do?',
  featuresHeading: 'Key Features Included',
  closeButton: 'Close',
  chooseOptionButton: 'Choose this option',
  closeAriaLabel: 'Close modal',
};

export const OTP_VERIFICATION_COPY: OtpVerificationCopy = {
  defaultTitle: 'Verify your email',
  sentToPrefix: 'We sent a verification code to ',
  successMessage: 'Verification successful!',
  invalidCodeError: 'Invalid or expired code. Please try again.',
  resendSuccessTitle: 'New verification code sent',
  resendDispatchedPrefix: 'Dispatched to ',
  resendFailError: 'Failed to resend code',
  verifyingText: 'Verifying code...',
  resendCountdownPrefix: 'Resend code in ',
  resendCountdownSuffix: 's',
  resendCodeText: 'Resend code',
  changeEmailText: 'Change email',
};

export const PASSWORD_RECOVERY_COPY: PasswordRecoveryCopy = {
  step1Title: 'Reset your password',
  step2Title: 'Create new password',
  step1Subtitle: 'Enter your registered email and we will send a verification reset code.',
  step2SubtitlePrefix: 'Enter the code sent to ',
  step2SubtitleSuffix: ' and choose a new password.',
  emailLabel: 'Email address',
  emailPlaceholder: 'name@example.com',
  sendResetCode: 'Send Reset Code',
  sendingResetCode: 'Sending reset code...',
  resetDispatchedTitle: 'Reset code dispatched',
  resetDispatchedCheckPrefix: 'Check ',
  resetDispatchedSuffix: ' for your verification code',
  requestFailError: 'Failed to request reset code',
  codeLabel: 'Verification Reset Code',
  codePlaceholder: '123456',
  newPasswordLabel: 'New Password',
  newPasswordPlaceholder: 'Minimum 8 characters',
  confirmPasswordLabel: 'Confirm New Password',
  confirmPasswordPlaceholder: 'Re-type your new password',
  updatePasswordSubmit: 'Update Password & Log In',
  updatingPasswordSubmit: 'Updating password...',
  updateSuccessTitle: 'Password updated!',
  updateSuccessDescription: 'You can now log in with your new password.',
  updateFailError: 'Failed to update password',
  returnToLogin: 'Return to login',
  validation: {
    emailInvalid: 'Please enter a valid email address',
    otpDigits: 'Code must be a 6-digit verification code',
    passwordMinLength: 'Password must be at least 8 characters long',
    passwordsMismatch: 'Passwords do not match',
  },
};

export const ONBOARDING_VALIDATION_MESSAGES: OnboardingValidationMessages = {
  displayNameMin: 'Display name must be at least 2 characters',
  orgNameMin: 'Organization name must be at least 2 characters',
  orgTypeRequired: 'Please select an organization type',
  websiteInvalid: 'Please enter a valid website URL',
};

export const ONBOARDING_NOTIFICATIONS_COPY: OnboardingNotificationsCopy = {
  profileSuccessTitle: 'Profile created!',
  profileSuccessDesc: 'Welcome to the Pentasent healthcare ecosystem.',
  profileFailError: 'Failed to complete profile setup',
  orgSuccessTitle: 'Organization registered!',
  orgSuccessDesc: (orgName: string) => `${orgName} is now ready on Pentasent.`,
  orgFailError: 'Failed to create organization',
  exploreSuccessTitle: 'Welcome to Pentasent!',
  exploreSuccessDesc: 'Enjoy discovering doctors, tools, and health innovation.',
  exploreFailError: 'Failed to finish onboarding',
};

export const ONBOARDING_WELCOME_COPY: OnboardingWelcomeCopy = {
  title: 'Welcome to Pentasent',
  description:
    'A connected place for people, organizations, products, communities, events, jobs, research and news shaping healthcare.',
  question: 'How would you like to get started?',
  cards: [
    {
      id: 'profile',
      title: 'Set up my profile',
      description: 'For individuals, doctors, therapists, researchers & wellness builders.',
      buttonLabel: 'Start',
      tooltip: 'View details about personal profile',
      icon: User,
    },
    {
      id: 'organization',
      title: 'Create an organization',
      description: 'For hospitals, clinics, healthtech companies & research bodies.',
      buttonLabel: 'Start',
      tooltip: 'View details about organization creation',
      icon: Building2,
    },
    {
      id: 'explore',
      title: 'Explore Pentasent',
      description: 'Experience the ecosystem right now. Complete your profile anytime later.',
      buttonLabel: 'Explore',
      tooltip: 'View details about ecosystem exploration',
      icon: Compass,
    },
  ],
};

export const ONBOARDING_PROFILE_FORM_COPY: OnboardingProfileFormCopy = {
  backButton: 'Back to choices',
  headerBadge: 'Profile Setup',
  displayNameLabel: 'Display Name / Full Name *',
  displayNamePlaceholder: 'e.g. Dr. Alex Morgan or Alex Chen',
  headlineLabel: 'Professional Focus / Headline',
  headlinePlaceholder: 'e.g. Cardiologist & Clinical Researcher',
  locationLabel: 'Location (City, Country)',
  locationPlaceholder: 'e.g. Bengaluru, India or London, UK',
  bioLabel: 'Short Bio (Optional)',
  bioPlaceholder: 'Tell others about your work, clinical interests, or health goals...',
  interestsLabel: 'Select Areas of Interest',
  skipButton: 'Skip for now',
  savingButton: 'Saving profile...',
  submitButton: 'Complete Setup',
};

export const ONBOARDING_ORG_FORM_COPY: OnboardingOrgFormCopy = {
  backButton: 'Back to choices',
  headerBadge: 'Create Organization',
  architecturePrincipleHeading: 'Architecture Principle:',
  architecturePrincipleText:
    'Organizations are entities managed by your personal Pentasent account. There are no separate hospital or clinic logins.',
  orgTypeLabel: 'Organization Type *',
  orgNameLabel: 'Organization Name *',
  orgNamePlaceholder: 'e.g. City Hospital or Aetheria HealthTech',
  locationLabel: 'Primary Location',
  locationPlaceholder: 'e.g. New York, NY or Bengaluru, India',
  websiteLabel: 'Website URL (Optional)',
  websitePlaceholder: 'https://example.org',
  descriptionLabel: 'Description (Optional)',
  descriptionPlaceholder:
    'Brief description of clinical services, research, or health solutions...',
  skipButton: 'Skip for now',
  savingButton: 'Creating organization...',
  submitButton: 'Create Organization',
};