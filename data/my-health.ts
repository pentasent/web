import {
  MyHealthNavTab,
  BloodGroup,
  AllergySeverity,
  MoodType,
  SleepQuality,
} from '@/types/my-health';

export const MY_HEALTH_NAV_TABS: MyHealthNavTab[] = [
  {
    id: 'overview',
    title: 'Overview',
    href: '/my-health',
    icon: 'layout-dashboard',
  },
  {
    id: 'profile',
    title: 'Health Profile',
    href: '/my-health/profile',
    icon: 'user',
  },
  {
    id: 'tracking',
    title: 'Vital Tracking',
    href: '/my-health/tracking',
    icon: 'activity',
  },
  {
    id: 'mood',
    title: 'Mood & Wellbeing',
    href: '/my-health/mood',
    icon: 'smile',
  },
  {
    id: 'emergency',
    title: 'Emergency Contacts',
    href: '/my-health/emergency',
    icon: 'phone-call',
  },
  {
    id: 'allergies',
    title: 'Allergies',
    href: '/my-health/allergies',
    icon: 'shield-alert',
  },
  {
    id: 'care',
    title: 'Care Relationships',
    href: '/my-health/care',
    icon: 'user-check',
    badge: 'Coming Soon',
    isPlaceholder: true,
  },
  {
    id: 'appointments',
    title: 'Appointments',
    href: '/my-health/appointments',
    icon: 'calendar',
    badge: 'Coming Soon',
    isPlaceholder: true,
  },
  {
    id: 'visits',
    title: 'Visits',
    href: '/my-health/visits',
    icon: 'clipboard-list',
    badge: 'Coming Soon',
    isPlaceholder: true,
  },
  {
    id: 'reports',
    title: 'Diagnostic Reports',
    href: '/my-health/reports',
    icon: 'file-text',
    badge: 'Coming Soon',
    isPlaceholder: true,
  },
  {
    id: 'prescriptions',
    title: 'Prescriptions',
    href: '/my-health/prescriptions',
    icon: 'pill',
    badge: 'Coming Soon',
    isPlaceholder: true,
  },
  {
    id: 'consent',
    title: 'Consent & Sharing',
    href: '/my-health/consent',
    icon: 'lock',
    badge: 'Coming Soon',
    isPlaceholder: true,
  },
  {
    id: 'billing',
    title: 'Billing & Payments',
    href: '/my-health/billing',
    icon: 'credit-card',
    badge: 'Coming Soon',
    isPlaceholder: true,
  },
];

export const MY_HEALTH_HERO_COPY = {
  overview: {
    badge: 'Private Longitudinal Health Layer',
    title: 'Personal Health Overview',
    description:
      'A private, user-controlled health space. Monitor your biological baseline, recent measurements, daily wellbeing reflections, and longitudinal trends.',
  },
  profile: {
    badge: 'Personal Baseline',
    title: 'Health Profile Snapshot',
    description:
      'Manage relatively stable health characteristics including physical height, baseline body weight, verified blood group, and personal clinical notes.',
  },
  tracking: {
    badge: 'Metrics & Vitals',
    title: 'Health Metric Tracking',
    description:
      'Structured measurements for cardiovascular vitals, metabolic readings, daily activity, hydration, and sleep patterns without automated diagnostic judgment.',
  },
  mood: {
    badge: 'Daily Wellbeing',
    title: 'Mood, Energy & Reflection',
    description:
      'Track subjective mental state, emotional energy, daily stress patterns, sleep quality, and qualitative reflections in a calm, pressure-free space.',
  },
  emergency: {
    badge: 'Safety Information',
    title: 'Emergency Contacts',
    description:
      'Primary and secondary trusted contacts designated for emergency situations or urgent clinical communication.',
  },
  allergies: {
    badge: 'Clinical Safety',
    title: 'Allergies & Sensitivities',
    description:
      'Comprehensive record of known drug, food, environmental, and chemical allergens with observed adverse reaction severities.',
  },
  care: {
    badge: 'Roadmap Module • Phase 3',
    title: 'Healthcare Relationships',
    description:
      'Planned support to connect verified healthcare practitioners, therapists, clinics, and hospital care teams with granular permission controls.',
  },
  appointments: {
    badge: 'Roadmap Module • Phase 3',
    title: 'Clinical Scheduling',
    description:
      'Upcoming clinical booking requests, provider calendar syncing, in-person and telehealth consultations, and automated reminders.',
  },
  visits: {
    badge: 'Roadmap Module • Phase 3',
    title: 'Encounter History & Visit Summaries',
    description:
      'Clinical consultation notes, provider diagnoses, treatment plans, and post-visit follow-up instructions.',
  },
  reports: {
    badge: 'Roadmap Module • Phase 2',
    title: 'Diagnostic Reports & Observations',
    description:
      'Structured pathology observations, clinical laboratory findings, radiological imaging files, and diagnostic PDF reports.',
  },
  prescriptions: {
    badge: 'Roadmap Module • Phase 2',
    title: 'Prescriptions & Medications',
    description:
      'Active pharmaceutical regimens, dosing frequencies, prescribing clinician records, and treatment course durations.',
  },
  consent: {
    badge: 'Roadmap Module • Phase 4',
    title: 'Consent & Data Sharing Scopes',
    description:
      'Cryptographic authorization policies, granular clinician read/write scopes, time-limited authorizations, and instant revocation.',
  },
  billing: {
    badge: 'Roadmap Module • Phase 5',
    title: 'Healthcare Billing & Invoices',
    description:
      'Insurance claim reconciliation, out-of-pocket receipts, clinic invoices, and transparent healthcare transaction history.',
  },
};

export const BLOOD_GROUP_OPTIONS: { label: string; value: BloodGroup }[] = [
  { label: 'Select blood group', value: 'unknown' },
  { label: 'A Positive (A+)', value: 'A+' },
  { label: 'A Negative (A-)', value: 'A-' },
  { label: 'B Positive (B+)', value: 'B+' },
  { label: 'B Negative (B-)', value: 'B-' },
  { label: 'AB Positive (AB+)', value: 'AB+' },
  { label: 'AB Negative (AB-)', value: 'AB-' },
  { label: 'O Positive (O+)', value: 'O+' },
  { label: 'O Negative (O-)', value: 'O-' },
];

export const ALLERGY_SEVERITY_OPTIONS: { label: string; value: AllergySeverity }[] = [
  { label: 'Mild (minor itch, rash)', value: 'mild' },
  { label: 'Moderate (hives, swelling, discomfort)', value: 'moderate' },
  { label: 'Severe (anaphylaxis, respiratory distress)', value: 'severe' },
  { label: 'Unknown Severity', value: 'unknown' },
];

export const MOOD_OPTIONS: {
  value: MoodType;
  emoji: string;
  label: string;
  score: number;
  description: string;
}[] = [
  { value: 'amazing', emoji: '🤩', label: 'Amazing', score: 5, description: 'Energized & thriving' },
  { value: 'good', emoji: '🙂', label: 'Good', score: 4, description: 'Positive & balanced' },
  { value: 'okay', emoji: '😐', label: 'Okay', score: 3, description: 'Normal & steady' },
  { value: 'low', emoji: '😔', label: 'Low', score: 2, description: 'Tired or feeling down' },
  { value: 'very_low', emoji: '😞', label: 'Very Low', score: 1, description: 'Overwhelmed or distressed' },
];

export const EMOTION_CHIPS: string[] = [
  'Happy',
  'Calm',
  'Grateful',
  'Motivated',
  'Energetic',
  'Relaxed',
  'Hopeful',
  'Sad',
  'Anxious',
  'Stressed',
  'Angry',
  'Lonely',
  'Tired',
  'Overwhelmed',
  'Frustrated',
  'Peaceful',
];

export const SLEEP_QUALITY_OPTIONS: { label: string; value: SleepQuality }[] = [
  { label: 'Very Good (deep, restorative)', value: 'very_good' },
  { label: 'Good (rested well)', value: 'good' },
  { label: 'Average (normal night)', value: 'average' },
  { label: 'Poor (restless or broken)', value: 'poor' },
  { label: 'Very Poor (insomnia or exhausted)', value: 'very_poor' },
];

export interface TrackedMetricConfig {
  key: string;
  name: string;
  category: 'vitals' | 'body' | 'activity' | 'nutrition' | 'sleep';
  primaryUnit: string;
  allowedUnits: string[];
  contexts?: string[];
  description: string;
  isComposite?: boolean;
}

export const TRACKED_METRICS_LIST: TrackedMetricConfig[] = [
  {
    key: 'blood_pressure',
    name: 'Blood Pressure',
    category: 'vitals',
    primaryUnit: 'mmHg',
    allowedUnits: ['mmHg'],
    contexts: ['resting', 'sitting', 'standing', 'after_exercise'],
    description: 'Systolic and diastolic arterial pressure readings.',
    isComposite: true,
  },
  {
    key: 'heart_rate',
    name: 'Heart Rate',
    category: 'vitals',
    primaryUnit: 'bpm',
    allowedUnits: ['bpm'],
    contexts: ['resting', 'walking', 'exercise', 'after_exercise', 'sleep'],
    description: 'Beats per minute across resting and active periods.',
  },
  {
    key: 'blood_glucose',
    name: 'Blood Glucose',
    category: 'vitals',
    primaryUnit: 'mg/dL',
    allowedUnits: ['mg/dL', 'mmol/L'],
    contexts: ['fasting', 'before_meal', 'after_meal', 'random', 'bedtime'],
    description: 'Capillary blood glucose concentration.',
  },
  {
    key: 'weight',
    name: 'Body Weight',
    category: 'body',
    primaryUnit: 'kg',
    allowedUnits: ['kg', 'lb'],
    contexts: ['morning', 'evening', 'post_workout'],
    description: 'Scale body mass with baseline profile synchronization.',
  },
  {
    key: 'sleep',
    name: 'Sleep Duration',
    category: 'sleep',
    primaryUnit: 'minutes',
    allowedUnits: ['minutes', 'hours'],
    contexts: ['night', 'nap'],
    description: 'Total rest duration and perceived sleep quality.',
  },
  {
    key: 'steps',
    name: 'Daily Steps',
    category: 'activity',
    primaryUnit: 'steps',
    allowedUnits: ['steps'],
    contexts: ['daily_total'],
    description: 'Walking count recorded manually or imported.',
  },
  {
    key: 'water',
    name: 'Water Intake',
    category: 'nutrition',
    primaryUnit: 'ml',
    allowedUnits: ['ml', 'liter', 'oz'],
    contexts: ['intake'],
    description: 'Daily hydration volume logged throughout the day.',
  },
  {
    key: 'calories_burned',
    name: 'Calories Burned',
    category: 'activity',
    primaryUnit: 'kcal',
    allowedUnits: ['kcal'],
    contexts: ['active', 'exercise', 'daily_total'],
    description: 'Active energy expenditure from exercise and daily movement.',
  },
  {
    key: 'calories_consumed',
    name: 'Calories Consumed',
    category: 'nutrition',
    primaryUnit: 'kcal',
    allowedUnits: ['kcal'],
    contexts: ['breakfast', 'lunch', 'dinner', 'snack', 'daily_total'],
    description: 'Nutritional caloric intake from meals and snacks.',
  },
  {
    key: 'oxygen_saturation',
    name: 'Oxygen Saturation (SpO2)',
    category: 'vitals',
    primaryUnit: '%',
    allowedUnits: ['%'],
    contexts: ['resting', 'exercise', 'sleep'],
    description: 'Pulse oximetry blood oxygen percentage.',
  },
  {
    key: 'body_temperature',
    name: 'Body Temperature',
    category: 'vitals',
    primaryUnit: 'Celsius',
    allowedUnits: ['Celsius', 'Fahrenheit'],
    contexts: ['oral', 'armpit', 'ear', 'forehead'],
    description: 'Clinical thermometry measurements.',
  },
  {
    key: 'respiratory_rate',
    name: 'Respiratory Rate',
    category: 'vitals',
    primaryUnit: 'breaths/min',
    allowedUnits: ['breaths/min'],
    contexts: ['resting', 'sleep'],
    description: 'Breathing frequency per minute at rest.',
  },
];
