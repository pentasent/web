'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import CertificateVerifier from '@/components/certificates/CertificateVerifier';
import CertificateView, { CertificateData } from '@/components/certificates/CertificateView';
import { apiClient } from '@/lib/api';
import { ShieldCheck, Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import FaqSection from '@/components/ui/FaqSection';
import { CERTIFICATE_FAQS } from '@/data/certificates-faq';

interface CertificatesClientContentProps {
  initialId?: string;
  initialCertificate?: CertificateData | null;
  initialErrorMessage?: string | null;
}

export default function CertificatesClientContent({
  initialId = '',
  initialCertificate = null,
  initialErrorMessage = null,
}: CertificatesClientContentProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Extract ID from current URL query param, falling back to initialId
  const urlId = (searchParams.get('id') || searchParams.get('certificate_id') || '').trim();
  const idParam = urlId || initialId;

  const [activeCertificate, setActiveCertificate] = useState<CertificateData | null>(
    initialCertificate || null
  );

  // If an idParam is present and we don't have the certificate or an error yet, we are loading
  const [isLoading, setIsLoading] = useState<boolean>(() => {
    if (initialCertificate || initialErrorMessage) return false;
    return Boolean(idParam);
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(initialErrorMessage || null);

  // Track previous ID to adjust state during render (React pattern for prop/URL state sync without cascading renders)
  const [prevId, setPrevId] = useState(idParam);
  if (prevId !== idParam) {
    setPrevId(idParam);
    if (!idParam) {
      setActiveCertificate(null);
      setErrorMessage(null);
      setIsLoading(false);
    } else if (
      !activeCertificate ||
      (activeCertificate.certificateNumber?.toUpperCase() !== idParam.toUpperCase() &&
        activeCertificate.certificateId?.toUpperCase() !== idParam.toUpperCase())
    ) {
      setIsLoading(true);
      setErrorMessage(null);
    }
  }

  // Fetch certificate verification data when id query param is present
  useEffect(() => {
    if (!idParam) {
      return;
    }

    // If active certificate already matches the requested ID, do not refetch
    if (
      activeCertificate &&
      (activeCertificate.certificateNumber?.toUpperCase() === idParam.toUpperCase() ||
        activeCertificate.certificateId?.toUpperCase() === idParam.toUpperCase())
    ) {
      return;
    }

    let isMounted = true;

    const fetchCertificate = async () => {
      try {
        const res = await apiClient<CertificateData>(
          `/company/employees/certificates/verify?id=${encodeURIComponent(idParam)}`
        );

        if (!isMounted) return;

        if (res.success && res.data) {
          setActiveCertificate(res.data);
          setErrorMessage(null);
        } else {
          setActiveCertificate(null);
          setErrorMessage(
            res.error?.message || `Certificate '${idParam}' was not found in the official registry.`
          );
        }
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : String(err);
        setActiveCertificate(null);
        setErrorMessage(
          msg || `Certificate '${idParam}' could not be verified in the Pentasent registry.`
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchCertificate();

    return () => {
      isMounted = false;
    };
  }, [idParam, activeCertificate]);

  const handleVerify = (newId: string) => {
    const cleanId = newId.trim().toUpperCase();
    if (!cleanId) return;
    setIsLoading(true);
    setErrorMessage(null);
    router.push(`/company/employees/certificates?id=${encodeURIComponent(cleanId)}`);
  };

  const handleBackToSearch = () => {
    setActiveCertificate(null);
    setErrorMessage(null);
    setIsLoading(false);
    router.push('/company/employees/certificates');
  };

  const certificateToShow = idParam ? activeCertificate : null;

  // 1. If certificate is active and idParam matches, render the standalone clean detail view (NO Navbar)
  if (certificateToShow) {
    return (
      <CertificateView
        certificate={certificateToShow}
        onBackToSearch={handleBackToSearch}
      />
    );
  }

  // 2. If querying via ?id= and actively loading (or waiting for verification result), show clean loader (NO Navbar)
  // This prevents ANY split-second flash of the search page when visiting ?id= directly
  if (idParam && (isLoading || (!activeCertificate && !errorMessage))) {
    return (
      <main className="min-h-screen bg-white flex flex-col items-center justify-center py-20 text-center">
        <Loader2 size={36} className="animate-spin text-[#4a0139] mb-4" />
        <h2 className="text-[20px] font-bold text-[#2f0036]">
          Verifying Credential in Primary Registry...
        </h2>
        <p className="text-[14px] text-[#6f6268] mt-1 font-mono">
          Querying ID: {idParam}
        </p>
      </main>
    );
  }

  // 3. Otherwise (direct /certificates landing or after search with error/idle), render the tracker UI directly WITH Navbar
  // Zero loader displayed when visiting /company/employees/certificates directly
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white flex flex-col justify-between">
        <div>
          {/* Top Verification Banner matching /tracker */}
          <div className="w-full bg-[#f4efe9] border-b border-[#e5e0dc] py-3 px-4 text-center">
            <p className="text-[13px] sm:text-[14px] font-medium text-[#2f0036] max-w-5xl mx-auto flex items-center justify-center gap-2">
              <ShieldCheck size={16} className="text-[#4a0139]" />
              <span>Official Pentasent Credential Verification & Employee Certificate Registry</span>
            </p>
          </div>

          {/* Main Verification Container */}
          <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
              <CertificateVerifier
                onVerify={handleVerify}
                isLoading={isLoading}
                errorMessage={errorMessage}
                initialQuery={idParam}
              />
            </div>
          </section>

          {/* FAQ Accordion Section */}
          <FaqSection
            title="FAQs"
            subtitle="Frequently asked questions about credential authentication, issuer records, and verification standards."
            items={CERTIFICATE_FAQS}
          />
        </div>

        <Footer showDemo={false} />
      </main>
    </>
  );
}
