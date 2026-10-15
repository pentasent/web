import { apiClient } from '@/lib/api';

export interface SubscribeNewsletterInput {
  email: string;
  sourcePlatform?: 'web' | 'mobile' | 'other';
  sourcePage?: string;
  consentSource?: string;
  sourceReferrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface NewsletterSubscribeResponse {
  status: string;
}

/**
 * Subscribes an email to the Pentasent newsletter
 */
export async function subscribeNewsletter(
  payload: SubscribeNewsletterInput
): Promise<{ status: string }> {
  const res = await apiClient<NewsletterSubscribeResponse>('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return res.data;
}

/**
 * Opts out from the newsletter via secure token
 */
export async function unsubscribeNewsletter(token: string): Promise<void> {
  await apiClient<void>('/newsletter/unsubscribe', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
}

export interface NewsletterStatusData {
  exists: boolean;
  status?: 'subscribed' | 'unsubscribed' | 'pending_confirmation' | 'suppressed';
  email?: string;
  subscribedAt?: string | null;
  unsubscribedAt?: string | null;
  consentSource?: string | null;
  sourcePlatform?: string | null;
}

/**
 * Checks newsletter subscription status for a given email
 */
export async function getNewsletterStatus(email: string): Promise<NewsletterStatusData> {
  const res = await apiClient<NewsletterStatusData>(
    `/newsletter/status?email=${encodeURIComponent(email.trim())}`
  );
  return res.data;
}

/**
 * Opts out directly by email from the self-service manage portal
 */
export async function optOutNewsletter(email: string, reason?: string): Promise<void> {
  await apiClient<void>('/newsletter/opt-out', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim(), reason }),
  });
}
