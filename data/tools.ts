import {
  ToolTab,
  BmiCategory,
  ActivityLevel,
  CalorieGoal,
  ToolPageData,
  HealthConverterTab,
} from '@/types/tools';

export const TOOLS_PAGES_DATA: Record<'bmi' | 'bmr' | 'calorie' | 'converters', ToolPageData> = {
  bmi: {
    id: 'bmi',
    hero: {
      badge: 'Evidence-Based Health Tools',
      title: 'Body Mass Index (BMI) Calculator',
      description:
        'Determine your body mass index classification and discover your healthy weight range based on World Health Organization standards.',
    },
    metadata: {
      title: 'BMI Calculator — Body Mass Index & Weight Spectrum',
      description:
        'Calculate your Body Mass Index (BMI), view WHO weight categories, and discover optimal healthy weight ranges with Pentasent.',
      canonical: '/tools/bmi-calculator',
    },
  },
  bmr: {
    id: 'bmr',
    hero: {
      badge: 'Evidence-Based Health Tools',
      title: 'Basal Metabolic Rate (BMR) Calculator',
      description:
        'Estimate the baseline energy your body requires at complete rest to sustain vital cellular and physiological functions.',
    },
    metadata: {
      title: 'BMR Calculator — Basal Metabolic Rate & Energy Expenditure',
      description:
        'Calculate your Basal Metabolic Rate (BMR) using clinical Mifflin-St Jeor and Harris-Benedict formulas to assess resting caloric needs.',
      canonical: '/tools/bmr-calculator',
    },
  },
  calorie: {
    id: 'calorie',
    hero: {
      badge: 'Evidence-Based Health Tools',
      title: 'Daily Calorie & TDEE Calculator',
      description:
        'Estimate your total daily caloric burn based on physical activity, and set sustainable nutrition targets for your personal health goals.',
    },
    metadata: {
      title: 'Calorie Calculator — TDEE & Target Energy Goals',
      description:
        'Calculate your Total Daily Energy Expenditure (TDEE) and personalized daily calorie intake targets for maintenance, weight loss, or muscle gain.',
      canonical: '/tools/calorie-calculator',
    },
  },
  converters: {
    id: 'converters',
    hero: {
      badge: 'Evidence-Based Health Tools',
      title: 'Health Measurement Converters',
      description:
        'Convert clinical and vital health units with real-time accuracy, complete with medical reference standards and physiological evaluation ranges.',
    },
    metadata: {
      title: 'Health Measurement Converters — Glucose, Pressure & Vitals',
      description:
        'Convert essential healthcare measurements: blood sugar (mg/dL ↔ mmol/L), blood pressure (mmHg ↔ kPa), body temperature (°C ↔ °F), and vitals units.',
      canonical: '/tools/health-measurement-calculator',
    },
  },
};

export const HEALTH_CONVERTER_TABS: HealthConverterTab[] = [
  { id: 'blood-glucose', label: 'Blood Glucose', iconName: 'droplet' },
  { id: 'blood-pressure', label: 'Blood Pressure', iconName: 'heart' },
  { id: 'temperature', label: 'Body Temperature', iconName: 'thermometer' },
  { id: 'weight', label: 'Weight (kg/lbs/st)', iconName: 'scale' },
  { id: 'height', label: 'Height (cm/ft)', iconName: 'ruler' },
  { id: 'cholesterol', label: 'Cholesterol', iconName: 'activity' },
];

export const TOOLS_NAV_TABS: ToolTab[] = [
  {
    id: 'bmi',
    title: 'BMI Calculator',
    href: '/tools/bmi-calculator',
    shortDescription: 'Assess body mass index and healthy weight ranges',
    icon: 'scale',
  },
  {
    id: 'bmr',
    title: 'BMR Calculator',
    href: '/tools/bmr-calculator',
    shortDescription: 'Calculate baseline metabolic energy burn at rest',
    icon: 'flame',
  },
  {
    id: 'calorie',
    title: 'Calorie Calculator',
    href: '/tools/calorie-calculator',
    shortDescription: 'Estimate daily energy expenditure & target calories',
    icon: 'apple',
  },
  {
    id: 'converters',
    title: 'Health Measurement Converters',
    href: '/tools/health-measurement-calculator',
    shortDescription: 'Convert glucose, pressure, temperature & vitals units',
    icon: 'activity',
  },
];

export const BMI_CATEGORIES: BmiCategory[] = [
  {
    category: 'Underweight',
    range: '< 18.5',
    color: '#0284c7',
    bgColor: '#e0f2fe',
    description: 'Below the recommended weight range for optimal health.',
  },
  {
    category: 'Normal weight',
    range: '18.5 – 24.9',
    color: '#16a34a',
    bgColor: '#dcfce7',
    description: 'Within the optimal weight spectrum for lower health risks.',
  },
  {
    category: 'Overweight',
    range: '25.0 – 29.9',
    color: '#ea580c',
    bgColor: '#ffedd5',
    description: 'Above the recommended weight range. Balanced nutrition advised.',
  },
  {
    category: 'Obesity Class I',
    range: '30.0 – 34.9',
    color: '#dc2626',
    bgColor: '#fee2e2',
    description: 'Increased risk of metabolic and cardiovascular conditions.',
  },
  {
    category: 'Obesity Class II+',
    range: '≥ 35.0',
    color: '#991b1b',
    bgColor: '#fecaca',
    description: 'Substantially elevated risk. Consultation with a clinician recommended.',
  },
];

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  {
    id: 'sedentary',
    label: 'Sedentary',
    description: 'Desk job, little to no structured exercise',
    multiplier: 1.2,
  },
  {
    id: 'light',
    label: 'Lightly Active',
    description: 'Light exercise or active lifestyle 1–3 days per week',
    multiplier: 1.375,
  },
  {
    id: 'moderate',
    label: 'Moderately Active',
    description: 'Moderate cardio or sport training 3–5 days per week',
    multiplier: 1.55,
  },
  {
    id: 'very_active',
    label: 'Very Active',
    description: 'Intense exercise or physical athletics 6–7 days per week',
    multiplier: 1.725,
  },
  {
    id: 'extra_active',
    label: 'Extremely Active',
    description: 'Daily rigorous athletic training or demanding manual labor',
    multiplier: 1.9,
  },
];

export const CALORIE_GOALS: CalorieGoal[] = [
  {
    id: 'maintain',
    label: 'Maintain Current Weight',
    calorieDelta: 0,
    description: 'Equilibrium intake equal to your daily energy expenditure (TDEE).',
  },
  {
    id: 'mild_loss',
    label: 'Mild Weight Loss (-0.25 kg / wk)',
    calorieDelta: -250,
    description: 'Conservative 250 kcal/day deficit for gradual, sustainable fat loss.',
  },
  {
    id: 'weight_loss',
    label: 'Weight Loss (-0.5 kg / wk)',
    calorieDelta: -500,
    description: 'Recommended 500 kcal/day deficit for healthy, steady weight loss.',
  },
  {
    id: 'mild_gain',
    label: 'Mild Weight Gain (+0.25 kg / wk)',
    calorieDelta: 250,
    description: 'Conservative caloric surplus to support lean tissue and muscle synthesis.',
  },
  {
    id: 'gain',
    label: 'Weight Gain (+0.5 kg / wk)',
    calorieDelta: 500,
    description: 'Higher energy surplus for athletic mass building and strength development.',
  },
];

export const MEDICAL_DISCLAIMER_TEXT =
  'Educational Health Disclaimer: Pentasent health calculators and measurement tools are designed strictly for educational and personal health literacy purposes. Results do not constitute clinical diagnosis, medical prescription, or professional treatment advice. Always consult a qualified physician or healthcare provider regarding health conditions or dietary changes.';
