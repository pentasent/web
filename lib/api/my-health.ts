import { apiClient } from '@/lib/api';
import {
  HealthOverviewData,
  HealthProfileData,
  AllergyRecord,
  EmergencyContactRecord,
  HealthMetricDefinition,
  HealthMeasurement,
  MoodEntry,
  MetricTrendData,
  TrendRange,
} from '@/types/my-health';

export async function fetchHealthOverview(): Promise<HealthOverviewData> {
  const res = await apiClient<HealthOverviewData>('/my-health/overview');
  return res.data;
}

export async function fetchHealthProfile(): Promise<HealthProfileData> {
  const res = await apiClient<HealthProfileData>('/my-health/profile');
  return res.data;
}

export async function updateHealthProfile(
  data: Partial<HealthProfileData>
): Promise<HealthProfileData> {
  const res = await apiClient<HealthProfileData>('/my-health/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function fetchAllergies(): Promise<AllergyRecord[]> {
  const res = await apiClient<AllergyRecord[]>('/my-health/allergies');
  return res.data;
}

export async function createAllergy(data: {
  allergen: string;
  reaction?: string | null;
  severity: string;
  note?: string | null;
}): Promise<AllergyRecord> {
  const res = await apiClient<AllergyRecord>('/my-health/allergies', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateAllergy(
  id: string,
  data: Partial<AllergyRecord>
): Promise<AllergyRecord> {
  const res = await apiClient<AllergyRecord>(`/my-health/allergies/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function archiveAllergy(id: string): Promise<void> {
  await apiClient(`/my-health/allergies/${id}`, { method: 'DELETE' });
}

export async function fetchEmergencyContacts(): Promise<EmergencyContactRecord[]> {
  const res = await apiClient<EmergencyContactRecord[]>('/my-health/emergency-contacts');
  return res.data;
}

export async function createEmergencyContact(data: {
  name: string;
  relationship: string;
  phone: string;
  alternatePhone?: string | null;
  notes?: string | null;
  isPrimary?: boolean;
}): Promise<EmergencyContactRecord> {
  const res = await apiClient<EmergencyContactRecord>('/my-health/emergency-contacts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function updateEmergencyContact(
  id: string,
  data: Partial<EmergencyContactRecord>
): Promise<EmergencyContactRecord> {
  const res = await apiClient<EmergencyContactRecord>(`/my-health/emergency-contacts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function deleteEmergencyContact(id: string): Promise<void> {
  await apiClient(`/my-health/emergency-contacts/${id}`, { method: 'DELETE' });
}

export async function fetchMetricDefinitions(): Promise<HealthMetricDefinition[]> {
  const res = await apiClient<HealthMetricDefinition[]>('/my-health/metrics');
  return res.data;
}

export async function fetchMeasurements(params?: {
  metricKey?: string;
  from?: string;
  to?: string;
  source?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: HealthMeasurement[]; pagination?: { page: number; limit: number; total: number; totalPages: number } }> {
  const query = new URLSearchParams();
  if (params?.metricKey) query.set('metricKey', params.metricKey);
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  if (params?.source) query.set('source', params.source);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const endpoint = `/my-health/measurements${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await apiClient<HealthMeasurement[]>(endpoint);
  return {
    items: res.data || [],
    pagination: res.meta as { page: number; limit: number; total: number; totalPages: number } | undefined,
  };
}

export async function createMeasurement(data: {
  metricKey: string;
  numericValue?: number | null;
  secondaryNumericValue?: number | null;
  textValue?: string | null;
  unit: string;
  context?: string | null;
  source?: string;
  measuredAt?: string;
  recordedDate?: string;
  note?: string | null;
}): Promise<HealthMeasurement> {
  const res = await apiClient<HealthMeasurement>('/my-health/measurements', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function archiveMeasurement(id: string): Promise<void> {
  await apiClient(`/my-health/measurements/${id}`, { method: 'DELETE' });
}

export async function fetchMoodEntries(params?: {
  from?: string;
  to?: string;
  limit?: number;
}): Promise<MoodEntry[]> {
  const query = new URLSearchParams();
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);
  if (params?.limit) query.set('limit', String(params.limit));

  const endpoint = `/my-health/mood${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await apiClient<MoodEntry[]>(endpoint);
  return res.data || [];
}

export async function logMoodEntry(data: {
  mood: string;
  moodScore: number;
  emotions?: string[];
  energyLevel?: number;
  stressLevel?: number;
  sleepQuality?: string | null;
  feelingText?: string | null;
  whatWentWell?: string | null;
  whatDidNotGoWell?: string | null;
  note?: string | null;
  recordedDate?: string;
}): Promise<MoodEntry> {
  const res = await apiClient<MoodEntry>('/my-health/mood', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return res.data;
}

export async function archiveMoodEntry(id: string): Promise<void> {
  await apiClient(`/my-health/mood/${id}`, { method: 'DELETE' });
}

export async function fetchMetricTrends(
  metricKey: string,
  range: TrendRange = '30d'
): Promise<MetricTrendData> {
  const res = await apiClient<MetricTrendData>(`/my-health/trends/${metricKey}?range=${range}`);
  return res.data;
}
