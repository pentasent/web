export interface PersonalHealthMetric {
  id: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'attention' | 'optimal';
  lastUpdated: string;
}

export interface PersonalHealthProfile {
  bloodGroup?: string;
  allergies: string[];
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  metrics: PersonalHealthMetric[];
  recordsCount: number;
}
