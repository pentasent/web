import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { apiClient } from '@/lib/api';
import { NewsletterStatusData } from '@/lib/api/newsletter';
import ManageNewsletterClientContent from '@/components/newsletter/ManageNewsletterClientContent';

export const metadata: Metadata = {
  title: 'Manage Newsletter Subscription | Pentasent',
  description:
    'Check, update, or opt out of your Pentasent healthcare intelligence newsletter preferences.',
};

interface PageProps {
  searchParams?: Promise<{ email?: string }> | { email?: string };
}

export default async function ManageNewsletterPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const emailParam = ((resolvedParams.email || '') as string).trim();

  let initialStatusData: NewsletterStatusData | null = null;
  let initialErrorMessage: string | null = null;

  if (emailParam && emailParam.includes('@')) {
    try {
      const res = await apiClient<NewsletterStatusData>(
        `/newsletter/status?email=${encodeURIComponent(emailParam)}`
      );

      if (res.success && res.data) {
        initialStatusData = res.data;
      } else {
        initialErrorMessage = res.error?.message || null;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      initialErrorMessage = msg;
    }
  }

  return (
    <Suspense fallback={null}>
      <ManageNewsletterClientContent
        initialEmail={emailParam}
        initialStatusData={initialStatusData}
        initialErrorMessage={initialErrorMessage}
      />
    </Suspense>
  );
}
