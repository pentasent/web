export type ToolTab = {
  id: string;
  title: string;
  href: string;
  shortDescription: string;
  icon: 'scale' | 'flame' | 'apple' | 'activity';
};

export type BmiCategory = {
  category: string;
  range: string;
  color: string;
  bgColor: string;
  description: string;
};

export type ActivityLevel = {
  id: string;
  label: string;
  description: string;
  multiplier: number;
};

export type CalorieGoal = {
  id: string;
  label: string;
  calorieDelta: number;
  description: string;
};

export type ConverterType =
  | 'blood-glucose'
  | 'blood-pressure'
  | 'temperature'
  | 'weight'
  | 'height'
  | 'cholesterol';

export interface ToolsHeroProps {
  badge?: string;
  title: string;
  description: string;
}

export interface ToolHeroData {
  badge: string;
  title: string;
  description: string;
}

export interface ToolPageData {
  id: 'bmi' | 'bmr' | 'calorie' | 'converters';
  hero: ToolHeroData;
  metadata: {
    title: string;
    description: string;
    canonical: string;
  };
}

export interface HealthConverterTab {
  id: ConverterType;
  label: string;
  iconName: 'droplet' | 'heart' | 'thermometer' | 'scale' | 'ruler' | 'activity';
}
