export type MyHealthNavTabId =
  | 'overview'
  | 'profile'
  | 'tracking'
  | 'mood'
  | 'emergency'
  | 'allergies'
  | 'care'
  | 'appointments'
  | 'visits'
  | 'reports'
  | 'prescriptions'
  | 'consent'
  | 'billing';

export interface MyHealthNavTab {
  id: MyHealthNavTabId;
  title: string;
  href: string;
  icon:
    | 'layout-dashboard'
    | 'user'
    | 'activity'
    | 'smile'
    | 'phone-call'
    | 'shield-alert'
    | 'user-check'
    | 'calendar'
    | 'clipboard-list'
    | 'file-text'
    | 'pill'
    | 'lock'
    | 'credit-card';
  badge?: string;
  isPlaceholder?: boolean;
}

export type BloodGroup =
  | 'A+'
  | 'A-'
  | 'B+'
  | 'B-'
  | 'AB+'
  | 'AB-'
  | 'O+'
  | 'O-'
  | 'unknown';

export type AllergySeverity = 'mild' | 'moderate' | 'severe' | 'unknown';

export type MoodType = 'amazing' | 'good' | 'okay' | 'low' | 'very_low';

export type SleepQuality = 'very_poor' | 'poor' | 'average' | 'good' | 'very_good';

export interface HealthProfileData {
  id: string | null;
  userId: string;
  heightValue: number | null;
  heightUnit: 'cm' | 'in' | 'ft';
  currentWeightValue: number | null;
  currentWeightUnit: 'kg' | 'lb';
  bloodGroup: BloodGroup | null;
  healthNotes: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface AllergyRecord {
  id: string;
  userId: string;
  allergen: string;
  reaction: string | null;
  severity: AllergySeverity;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContactRecord {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string | null;
  notes?: string | null;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface HealthMetricDefinition {
  id: string;
  metricKey: string;
  name: string;
  category: 'vitals' | 'body' | 'activity' | 'nutrition' | 'sleep';
  valueType: 'numeric' | 'composite_numeric' | 'time_duration';
  primaryUnit: string;
  secondaryUnit?: string | null;
  allowedUnits: string[];
  allowedContexts: string[];
  sortOrder: number;
}

export interface HealthMeasurement {
  id: string;
  userId: string;
  metricId: string;
  metricKey: string;
  numericValue: number | null;
  secondaryNumericValue: number | null;
  textValue?: string | null;
  unit: string;
  context?: string | null;
  source: 'manual' | 'device' | 'import' | 'integration';
  measuredAt: string;
  recordedDate: string;
  note?: string | null;
  createdAt: string;
}

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  moodScore: number;
  emotions: string[];
  energyLevel: number;
  stressLevel: number;
  sleepQuality?: SleepQuality | null;
  feelingText?: string | null;
  whatWentWell?: string | null;
  whatDidNotGoWell?: string | null;
  note?: string | null;
  recordedDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthSnapshot {
  bloodPressure: {
    systolic: number | null;
    diastolic: number | null;
    unit: string;
    measuredAt: string;
    context?: string | null;
  } | null;
  heartRate: {
    bpm: number | null;
    unit: string;
    measuredAt: string;
    context?: string | null;
  } | null;
  bloodGlucose: {
    value: number | null;
    unit: string;
    measuredAt: string;
    context?: string | null;
  } | null;
  weight: {
    value: number | null;
    unit: string;
    measuredAt: string;
  } | null;
  sleep: {
    durationMinutes: number | null;
    unit: string;
    measuredAt: string;
    context?: string | null;
  } | null;
  steps: {
    steps: number | null;
    unit: string;
    measuredAt: string;
    recordedDate: string;
  } | null;
  water: {
    amount: number | null;
    unit: string;
    measuredAt: string;
  } | null;
  oxygenSaturation: {
    percentage: number | null;
    unit: string;
    measuredAt: string;
  } | null;
  bodyTemperature: {
    value: number | null;
    unit: string;
    measuredAt: string;
  } | null;
}

export interface WellbeingSnapshot {
  todayMood: MoodEntry | null;
  recentMoods: Array<{
    id: string;
    mood: MoodType;
    moodScore: number;
    recordedDate: string;
    energyLevel: number;
    stressLevel: number;
  }>;
}

export interface RecentHealthActivityItem {
  id: string;
  type: 'measurement' | 'mood' | 'allergy';
  title: string;
  subtitle: string;
  timestamp: string;
  metricKey?: string;
}

export interface HealthOverviewData {
  profileSummary: {
    hasProfile: boolean;
    heightValue: number | null;
    heightUnit: string;
    currentWeightValue: number | null;
    currentWeightUnit: string;
    bloodGroup: BloodGroup | null;
    healthNotes: string | null;
    allergiesCount: number;
    emergencyContactsCount: number;
    primaryEmergencyContact: EmergencyContactRecord | null;
  };
  healthSnapshot: HealthSnapshot;
  wellbeing: WellbeingSnapshot;
  recentActivity: RecentHealthActivityItem[];
}

export type TrendRange = '7d' | '30d' | '90d' | '1y' | 'all';

export interface MetricTrendData {
  metricKey: string;
  name: string;
  category: string;
  unit: string;
  range: TrendRange;
  count: number;
  min: number | null;
  max: number | null;
  average: number | null;
  trendDirection: 'up' | 'down' | 'stable';
  latestValue: {
    value: number | null;
    secondaryValue: number | null;
    measuredAt: string;
    context?: string | null;
  } | null;
  dataPoints: Array<{
    id: string;
    date: string;
    measuredAt: string;
    value: number | null;
    secondaryValue: number | null;
    context?: string | null;
  }>;
}
