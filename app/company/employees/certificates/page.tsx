import React, { Suspense } from 'react';
import { apiClient } from '@/lib/api';
import { CertificateData } from '@/components/certificates/CertificateView';
import CertificatesClientContent from '@/components/certificates/CertificatesClientContent';

interface PageProps {
  searchParams?: Promise<{ id?: string; certificate_id?: string }> | { id?: string; certificate_id?: string };
}

export default async function CertificatesPage({ searchParams }: PageProps) {
  const resolvedParams = searchParams ? await searchParams : {};
  const idParam = ((resolvedParams.id || resolvedParams.certificate_id || '') as string).trim();

  let initialCertificate: CertificateData | null = null;
  let initialErrorMessage: string | null = null;

  if (idParam) {
    try {
      const res = await apiClient<CertificateData>(
        `/company/employees/certificates/verify?id=${encodeURIComponent(idParam)}`
      );

      if (res.success && res.data) {
        initialCertificate = res.data;
      } else {
        initialErrorMessage =
          res.error?.message || `Certificate '${idParam}' was not found in the official registry.`;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      initialErrorMessage =
        msg || `Certificate '${idParam}' could not be verified in the Pentasent registry.`;
    }
  }

  return (
    <Suspense fallback={null}>
      <CertificatesClientContent
        initialId={idParam}
        initialCertificate={initialCertificate}
        initialErrorMessage={initialErrorMessage}
      />
    </Suspense>
  );
}
