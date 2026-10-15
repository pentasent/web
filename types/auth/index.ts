import { LucideIcon } from "lucide-react";

export type AccountCategory = {
  id: 'individual' | 'organization' | 'research';
  title: string;
  badge: string;
  shortDesc: string;
  icon: LucideIcon;
  targetAudience: string;
  capabilities: string;
  features: string[];
  confirmationPrompt: string;
  continueLabel: string;
};

export type OnboardingInfoType = 'profile' | 'organization' | 'explore';

export interface OnboardingInfoModalProps {
  isOpen: boolean;
  type: OnboardingInfoType | null;
  onClose: () => void;
  onSelectOption?: (type: OnboardingInfoType) => void;
}

export interface OnboardingFlowProps {
  onComplete: () => void;
}

export interface OtpVerificationProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onChangeEmail: () => void;
  title?: string;
  subtitle?: string;
}

export interface PasswordRecoveryProps {
  initialEmail?: string;
  onBackToLogin: () => void;
  onSuccess: (email: string) => void;
}

export interface AuthFooterLink {
  label: string;
  href: string;
}

export interface AuthLayoutConfig {
  securityLabel: string;
  footerLinks: AuthFooterLink[];
}

export interface AuthLoginPageCopy {
  badge: string;
  title: string;
  description: string;
}

export interface AuthRegisterPageCopy {
  badge: string;
  title: string;
  description: string;
}

export interface AuthHeaderCopy {
  loginPrompt: string;
  registerActionText: string;
  registerHref: string;
  registerPrompt: string;
  loginActionText: string;
  loginHref: string;
  backPrefix: string;
  backBrand: string;
  backHref: string;
}

export interface OnboardingInfoModalItem {
  badge: string;
  title: string;
  subtitle: string;
  targetAudience: string;
  capabilities: string;
  features: string[];
  principle: string;
}

export interface OnboardingInfoModalLabels {
  architecturePrincipleHeading: string;
  targetAudienceHeading: string;
  capabilitiesHeading: string;
  featuresHeading: string;
  closeButton: string;
  chooseOptionButton: string;
  closeAriaLabel: string;
}

export interface OtpVerificationCopy {
  defaultTitle: string;
  sentToPrefix: string;
  successMessage: string;
  invalidCodeError: string;
  resendSuccessTitle: string;
  resendDispatchedPrefix: string;
  resendFailError: string;
  verifyingText: string;
  resendCountdownPrefix: string;
  resendCountdownSuffix: string;
  resendCodeText: string;
  changeEmailText: string;
  testModeButton?: string;
}

export interface PasswordRecoveryValidationCopy {
  emailInvalid: string;
  otpDigits: string;
  passwordMinLength: string;
  passwordsMismatch: string;
}

export interface PasswordRecoveryCopy {
  step1Title: string;
  step2Title: string;
  step1Subtitle: string;
  step2SubtitlePrefix: string;
  step2SubtitleSuffix: string;
  emailLabel: string;
  emailPlaceholder: string;
  sendResetCode: string;
  sendingResetCode: string;
  resetDispatchedTitle: string;
  resetDispatchedCheckPrefix: string;
  resetDispatchedSuffix: string;
  requestFailError: string;
  codeLabel: string;
  codeTestFill?: string;
  codePlaceholder: string;
  newPasswordLabel: string;
  newPasswordPlaceholder: string;
  confirmPasswordLabel: string;
  confirmPasswordPlaceholder: string;
  updatePasswordSubmit: string;
  updatingPasswordSubmit: string;
  updateSuccessTitle: string;
  updateSuccessDescription: string;
  updateFailError: string;
  returnToLogin: string;
  validation: PasswordRecoveryValidationCopy;
}

export interface OnboardingWelcomeOptionCard {
  id: OnboardingInfoType;
  title: string;
  description: string;
  buttonLabel: string;
  tooltip: string;
  icon: LucideIcon;
}

export interface OnboardingWelcomeCopy {
  title: string;
  description: string;
  question: string;
  cards: OnboardingWelcomeOptionCard[];
}

export interface OnboardingProfileFormCopy {
  backButton: string;
  headerBadge: string;
  displayNameLabel: string;
  displayNamePlaceholder: string;
  headlineLabel: string;
  headlinePlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  bioLabel: string;
  bioPlaceholder: string;
  interestsLabel: string;
  skipButton: string;
  savingButton: string;
  submitButton: string;
}

export interface OnboardingOrgFormCopy {
  backButton: string;
  headerBadge: string;
  architecturePrincipleHeading: string;
  architecturePrincipleText: string;
  orgTypeLabel: string;
  orgNameLabel: string;
  orgNamePlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  websiteLabel: string;
  websitePlaceholder: string;
  descriptionLabel: string;
  descriptionPlaceholder: string;
  skipButton: string;
  savingButton: string;
  submitButton: string;
}

export interface OnboardingNotificationsCopy {
  profileSuccessTitle: string;
  profileSuccessDesc: string;
  profileFailError: string;
  orgSuccessTitle: string;
  orgSuccessDesc: (orgName: string) => string;
  orgFailError: string;
  exploreSuccessTitle: string;
  exploreSuccessDesc: string;
  exploreFailError: string;
}

export interface OnboardingValidationMessages {
  displayNameMin: string;
  orgNameMin: string;
  orgTypeRequired: string;
  websiteInvalid: string;
}