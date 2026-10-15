'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Download,
  Copy,
  Check,
  ArrowLeft,
  Building2,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { toPng } from 'html-to-image';

export interface CertificateData {
  certificateId: string;
  certificateNumber: string;
  status: string;
  statusLabel: string;
  certificateType: string;
  certificateTypeLabel: string;
  certificateTitle: string;
  certificateDescription?: string | null;
  purpose?: string | null;

  recipientName: string;
  recipientDesignation?: string | null;
  recipientRoleType?: string | null;
  recipientDepartment?: string | null;

  issuerOrganizationName: string;
  issuerOrganizationAddress?: string | null;
  issuerOrganizationEmail?: string | null;

  responsiblePersonName?: string | null;
  responsiblePersonDesignation?: string | null;
  authorizedByName?: string | null;

  startDate?: string | null;
  endDate?: string | null;
  issuedAt?: string | null;

  verificationCode: string;
  verificationUrl: string;
  revokedAt?: string | null;
  revocationReason?: string | null;
  supersededByCertificateId?: string | null;

  metadata?: {
    teams?: string[];
    duration?: string;
    programme?: string;
    responsibilities?: string[];
    skills_demonstrated?: string[];
    testing_types?: string[];
    platforms_tested?: string[];
    reported_to?: string;
    reported_to_designation?: string;
    [key: string]: unknown;
  };
}

interface CertificateViewProps {
  certificate: CertificateData;
  onBackToSearch?: () => void;
}

export default function CertificateView({
  certificate,
  onBackToSearch,
}: CertificateViewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(1);
  const [isDownloadingPng, setIsDownloadingPng] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [signatureError, setSignatureError] = useState(false);

  // Responsive scaling to preserve exact desktop certificate layout on mobile
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.offsetWidth;
        const targetWidth = 960;
        if (availableWidth < targetWidth) {
          setScale(availableWidth / targetWidth);
        } else {
          setScale(1);
        }
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Format dates cleanly without timezone shift
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return '—';
    try {
      const parts = dateString.split('T')[0].split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        return d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formattedIssueDate = formatDate(certificate.issuedAt);
  const formattedStartDate = formatDate(certificate.startDate);
  const formattedEndDate = formatDate(certificate.endDate);

  // Signature filename resolution based on responsible person or issuer name
  // Format: /assets/signatures/{firstname_lowercase}_sign_black.png
  const getSignaturePath = () => {
    const rawName =
      certificate.responsiblePersonName ||
      certificate.authorizedByName ||
      'Ankit Kumar';
    const firstName = rawName.trim().split(/\s+/)[0].toLowerCase();
    return `/assets/signatures/${firstName}_sign_black.png`;
  };

  const signatureSrc = getSignaturePath();
  const logoasset = '/assets/icons/icon.png'

  // Copy verification URL to clipboard
  const handleCopyLink = async () => {
    try {
      const url =
        typeof window !== 'undefined'
          ? window.location.href
          : certificate.verificationUrl;
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    } catch (err) {
      console.warn('Could not copy link:', err);
    }
  };

  // Download as PNG using html-to-image at full unscaled resolution
  const handleDownloadPng = async () => {
    if (!certificateRef.current) return;
    setIsDownloadingPng(true);

    try {
      const dataUrl = await toPng(certificateRef.current, {
        cacheBust: true,
        pixelRatio: 2, // High resolution crisp export
        backgroundColor: '#ffffff',
        width: 960,
        height: 680,
      });

      const link = document.createElement('a');
      link.download = `Pentasent_Certificate_${certificate.certificateId}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export certificate image:', error);
    } finally {
      setIsDownloadingPng(false);
    }
  };

  // Download as PDF (native high-resolution browser print styled specifically for the certificate)
  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    setTimeout(() => {
      window.print();
      setIsDownloadingPdf(false);
    }, 200);
  };

  const isRevoked = certificate.status === 'revoked';
  const isSuperseded = certificate.status === 'superseded';

  return (
    <div className="w-full min-h-screen bg-[#faf9f8] text-[#171318] py-6 sm:py-10 px-3 sm:px-6 lg:px-8">
      {/* Main Certificate Canvas Container (Responsive zoom scaling maintains exact layout) */}
      <div className="max-w-5xl mx-auto flex justify-center">
        <div ref={containerRef} className="w-full flex justify-center overflow-hidden">
          <div
            style={{
              width: `${960 * scale}px`,
              height: `${680 * scale}px`,
              position: 'relative',
            }}
          >
            <div
              style={{
                width: '960px',
                height: '680px',
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            >
              <div
                ref={certificateRef}
                id="pentasent-official-certificate"
                className="w-[960px] h-[680px] relative bg-white text-[#171318] rounded-xl border border-[#e8e4e1] overflow-hidden p-12 lg:p-14 transition-all flex flex-col justify-between select-none"
              >
                {/* Subtle Decorative Geometric Hairline Border Frame */}
                <div className="absolute inset-4 border border-[#e8e4e1] rounded-lg pointer-events-none" />
                <div className="absolute inset-5 border border-[#4a0139]/25 rounded-md pointer-events-none" />

                {/* Elegant Corner Quadrants */}
                <div className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-[#4a0139] pointer-events-none" />
                <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-[#4a0139] pointer-events-none" />
                <div className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-[#4a0139] pointer-events-none" />
                <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-[#4a0139] pointer-events-none" />

                {/* Faint Pentasent Security Seal Watermark in Center */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.025] pointer-events-none select-none">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-[380px] h-[380px] text-[#4a0139]"
                    fill="currentColor"
                  >
                    <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="3" fill="none" />
                    <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="1" fill="none" strokeDasharray="4 4" />
                    <path d="M100 20 L115 70 L170 70 L125 105 L145 160 L100 125 L55 160 L75 105 L30 70 L85 70 Z" />
                  </svg>
                </div>

                {/* Revoked / Superseded Watermark Overlay */}
                {isRevoked && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <span className="text-rose-600/20 text-8xl font-black uppercase tracking-widest rotate-[-25deg] border-8 border-rose-600/20 px-8 py-4 rounded-2xl select-none">
                      REVOKED
                    </span>
                  </div>
                )}

                {/* Certificate Content Body */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                  {/* Header: Pentasent Brand Emblem & Eyebrow */}
                  <div className="text-center pt-2">
                    <div className="inline-flex items-center gap-2 mb-2">
                      {/* Pentasent Brand Mark */}
                      <div className="w-8 h-8 rounded-full p-1.5 bg-[#4a0139] flex items-center justify-center text-white font-bold text-sm">
                        <Image
                          src={logoasset}
                          alt="Pentasent Logo"
                          width={24}
                          height={24}
                          className="pl-0.5"
                        />
                      </div>
                      <span className="text-[19px] font-black uppercase tracking-[0.22em] text-[#2f0036]">
                        PENTASENT
                      </span>
                    </div>

                    <div className="text-[11px] font-bold uppercase tracking-[0.3em] text-[#6b185f] mb-3">
                      For People Who Say &ldquo;I&apos;m Fine&rdquo; But Aren&apos;t
                    </div>

                    {/* Certificate Title */}
                    <h1 className="text-[34px] font-serif font-bold text-[#2f0036] tracking-tight leading-tight uppercase">
                      {certificate.certificateTitle || 'Certificate of Completion'}
                    </h1>

                    <div className="w-16 h-0.5 bg-[#ffa91f] mx-auto mt-2.5 mb-3" />

                    <p className="text-[14.5px] text-[#4f4b49] font-light italic">
                      This official credential is proudly awarded to
                    </p>
                  </div>

                  {/* Recipient Spotlight */}
                  <div className="text-center my-3">
                    <h2 className="text-[44px] font-bold text-[#2f0036] tracking-tight leading-tight">
                      {certificate.recipientName}
                    </h2>

                    {(certificate.recipientDesignation || certificate.recipientDepartment) && (
                      <p className="mt-1.5 text-[16px] font-medium text-[#4a0139]">
                        {certificate.recipientDesignation}
                        {certificate.recipientDepartment && (
                          <span className="text-[#6f6268] font-normal">
                            {' '}&bull; {certificate.recipientDepartment}
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  {/* Narrative / Description Statement */}
                  <div className="max-w-3xl mx-auto text-center px-4 mb-4">
                    <p className="text-[15px] text-[#4f4b49] leading-relaxed">
                      {certificate.certificateDescription || (
                        <>
                          in recognition of exemplary contributions and successful completion of the{' '}
                          <strong className="font-semibold text-[#171318]">
                            {certificate.metadata?.programme || 'Summer Internship Programme'}
                          </strong>{' '}
                          at Pentasent Inc from{' '}
                          <strong className="font-semibold text-[#171318]">{formattedStartDate}</strong> to{' '}
                          <strong className="font-semibold text-[#171318]">{formattedEndDate}</strong>.
                        </>
                      )}
                    </p>

                    {certificate.metadata?.duration && !certificate.certificateDescription && (
                      <p className="mt-1.5 text-[13px] text-[#6f6268]">
                        Duration: <span className="font-medium text-[#171318]">{certificate.metadata.duration}</span>
                      </p>
                    )}
                  </div>

                  {/* Footer Row: Signature, Corporate Official Seal Stamp, and Cryptographic Code */}
                  <div className="pt-6 border-t border-[#e8e4e1] mt-auto">
                    <div className="grid grid-cols-3 items-end gap-4">
                      {/* Column 1: Dynamic Issuer Signature */}
                      <div className="text-left flex flex-col items-start">
                        <div className="h-16 flex items-end justify-start mb-1">
                          {!signatureError ? (
                            <Image
                              src={signatureSrc}
                              alt="Authorized Signature"
                              width={180}
                              height={64}
                              className="max-h-16 w-auto object-contain filter contrast-125"
                              onError={() => setSignatureError(true)}
                              unoptimized
                            />
                          ) : (
                            <span className="font-serif italic text-2xl text-[#2f0036] tracking-wide">
                              {certificate.responsiblePersonName || 'Ankit Kumar'}
                            </span>
                          )}
                        </div>
                        <div className="w-44 border-b border-[#171318]/70 mb-1.5" />
                        <p className="text-[13px] font-bold text-[#2f0036]">
                          {certificate.responsiblePersonName || 'Ankit Kumar'}
                        </p>
                        <p className="text-[11.5px] text-[#6f6268]">
                          {certificate.responsiblePersonDesignation || 'Founder & CEO'}
                        </p>
                        <p className="text-[11px] text-[#4f4b49] font-medium">
                          {certificate.issuerOrganizationName || 'Pentasent Inc'}
                        </p>
                      </div>

                      {/* Column 2: Official Corporate Seal Stamp */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="relative w-28 h-28 flex items-center justify-center select-none rotate-[-3deg] transition-transform hover:rotate-0">
                          <svg viewBox="0 0 140 140" className="w-28 h-28 text-[#4a0139]">
                            {/* Outer thick stamp ring */}
                            <circle cx="70" cy="70" r="66" fill="none" stroke="currentColor" strokeWidth="2.5" />
                            {/* Outer thin decorative dashed ring */}
                            <circle cx="70" cy="70" r="61" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 2" />
                            {/* Middle circular border */}
                            <circle cx="70" cy="70" r="46" fill="none" stroke="currentColor" strokeWidth="1.5" />
                            {/* Inner tinted background circle */}
                            <circle cx="70" cy="70" r="44" fill="#faf5f8" />
                            <circle cx="70" cy="70" r="41" fill="none" stroke="currentColor" strokeWidth="0.75" />

                            {/* Top curved path for PENTASENT INC. */}
                            <path id="stampTopPath" d="M 21,70 A 49,49 0 0,1 119,70" fill="none" />
                            <text fill="currentColor" fontSize="8.5" fontWeight="900" letterSpacing="3.5">
                              <textPath href="#stampTopPath" startOffset="50%" textAnchor="middle">
                                PENTASENT INC.
                              </textPath>
                            </text>

                            {/* Bottom curved path for OFFICIAL SEAL */}
                            <path id="stampBottomPath" d="M 119,70 A 49,49 0 0,1 21,70" fill="none" />
                            <text fill="currentColor" fontSize="7" fontWeight="800" letterSpacing="2.2">
                              <textPath href="#stampBottomPath" startOffset="50%" textAnchor="middle">
                                ★ LONDON, UNITED KINGDOM ★
                              </textPath>
                            </text>

                            {/* Center emblem with pure SVG vector shield (never shifts or displaces during print) */}
                            <g transform="translate(70, 70)">
                              <path
                                d="M 0,-14.2 L 7.4,-11.2 C 7.4,-5.5 4.5,-1.6 0,0.2 C -4.5,-1.6 -7.4,-5.5 -7.4,-11.2 Z"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M -3.2,-7 L 3.2,-7 M 0,-10.2 L 0,-3.8"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <text y="9.2" textAnchor="middle" fill="currentColor" fontSize="6.5" fontWeight="900" letterSpacing="1.2">
                                HEALTHCARE
                              </text>
                              <text y="16.2" textAnchor="middle" fill="#6f6268" fontSize="4.5" fontWeight="700" letterSpacing="1">
                                TECHNOLOGY
                              </text>
                            </g>
                          </svg>
                        </div>
                      </div>

                      {/* Column 3: Dates & Public Identifiers */}
                      <div className="text-right flex flex-col items-end">
                        <div className="mb-2">
                          <p className="text-[11px] uppercase tracking-wider text-[#6f6268] font-bold">
                            Date Issued
                          </p>
                          <p className="text-[13px] font-semibold text-[#2f0036]">
                            {formattedIssueDate}
                          </p>
                        </div>

                        <div className="mb-2">
                          <p className="text-[11px] uppercase tracking-wider text-[#6f6268] font-bold">
                            Credential ID
                          </p>
                          <p className="text-[13px] font-mono font-bold text-[#4a0139]">
                            {certificate.certificateId}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#6f6268]">
                            Verification Code
                          </p>
                          <p className="text-[11px] font-mono text-[#4f4b49]">
                            {certificate.verificationCode}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Micro-Verification Bar */}
                    <div className="mt-5 pt-3.5 border-t border-[#f2eeeb] flex items-center justify-between gap-2 text-[11px] text-[#6f6268]">
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-[#2f0036]">Document No:</span>
                        <span className="font-mono">{certificate.certificateNumber}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Verify at:</span>
                        <span className="font-mono text-[#4a0139] underline decoration-[#ffa91f]">
                          certificates?id={certificate.certificateId}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Standalone Action Bar (Hidden during Print) */}
      <div className="max-w-5xl mx-auto my-8 print:hidden">
        <div className="bg-white border border-[#e8e4e1] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {onBackToSearch ? (
              <button
                type="button"
                onClick={onBackToSearch}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-[13.5px] font-medium text-[#4f4b49] hover:text-[#2f0036] hover:bg-[#f2eeeb] rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft size={16} />
                <span>Verify Another</span>
              </button>
            ) : (
              <Link
                href="/company/employees/certificates"
                className="inline-flex items-center gap-2 px-3.5 py-2 text-[13.5px] font-medium text-[#4f4b49] hover:text-[#2f0036] hover:bg-[#f2eeeb] rounded-lg transition-colors"
              >
                <ArrowLeft size={16} />
                <span>Verify Another</span>
              </Link>
            )}

            <div className="h-5 w-px bg-[#e8e4e1] hidden sm:block" />

            {/* Status indicator */}
            {isRevoked ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
                <AlertCircle size={14} className="text-rose-600" />
                <span>Credential Revoked</span>
              </span>
            ) : isSuperseded ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                <AlertCircle size={14} className="text-amber-600" />
                <span>Superseded by New Record</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12.5px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/80">
                <ShieldCheck size={15} className="text-emerald-700" />
                <span>Official Verified Credential</span>
              </span>
            )}
          </div>

          {/* Action buttons: Download PDF, PNG, Copy link */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-[#4f4b49] bg-[#faf9f8] hover:bg-[#f2eeeb] border border-[#ded9d5] rounded-lg transition-colors cursor-pointer"
              title="Copy public verification link"
            >
              {copiedLink ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-[#6f6268]" />
                  <span>Copy Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-bold text-[#2f0036] bg-[#f2eeeb] hover:bg-[#e8e4e1] border border-[#ded9d5] rounded-lg transition-colors cursor-pointer disabled:opacity-60"
            >
              <FileCheck size={15} className="text-[#4a0139]" />
              <span>Download PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isDownloadingPng}
              className="inline-flex items-center gap-1.5 px-4.5 py-2 text-[13px] font-bold text-white bg-[#4a0139] hover:bg-[#3a082d] rounded-lg transition-all cursor-pointer disabled:opacity-60"
            >
              <Download size={15} />
              <span>{isDownloadingPng ? 'Generating PNG...' : 'Download PNG'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verified Registry Details & Metadata Panel (Hidden during Print) */}
      <div className="max-w-5xl mx-auto mt-10 print:hidden space-y-6">
        <div className="bg-white border border-[#e8e4e1] rounded-xl p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-[#e8e4e1]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#6b185f]">
                Credential Registry Record
              </span>
              <h3 className="text-[20px] font-bold text-[#2f0036] mt-1">
                Authenticity & Competency Record
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-700" />
                <span>Verified in Primary Database</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6 border-b border-[#e8e4e1] text-[13.5px]">
            <div>
              <span className="block text-[11px] uppercase tracking-wider text-[#6f6268] font-bold mb-1">
                Recipient
              </span>
              <p className="font-bold text-[#171318]">{certificate.recipientName}</p>
              <p className="text-[#4f4b49] text-[12.5px]">{certificate.recipientDesignation || '—'}</p>
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-wider text-[#6f6268] font-bold mb-1">
                Department & Team
              </span>
              <p className="font-semibold text-[#171318]">{certificate.recipientDepartment || 'Engineering'}</p>
              {certificate.metadata?.teams && (
                <p className="text-[#4f4b49] text-[12.5px]">
                  {certificate.metadata.teams.join(', ')}
                </p>
              )}
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-wider text-[#6f6268] font-bold mb-1">
                Tenure / Duration
              </span>
              <p className="font-semibold text-[#171318]">
                {formattedStartDate} &ndash; {formattedEndDate}
              </p>
              {certificate.metadata?.duration && (
                <p className="text-[#4f4b49] text-[12.5px]">{certificate.metadata.duration}</p>
              )}
            </div>

            <div>
              <span className="block text-[11px] uppercase tracking-wider text-[#6f6268] font-bold mb-1">
                Issuing Authority
              </span>
              <p className="font-semibold text-[#171318]">{certificate.responsiblePersonName || 'Ankit Kumar'}</p>
              <p className="text-[#4f4b49] text-[12.5px]">{certificate.issuerOrganizationName || 'Pentasent Inc'}</p>
            </div>
          </div>

          {/* Demonstrated Skills & Competencies */}
          {certificate.metadata?.skills_demonstrated && certificate.metadata.skills_demonstrated.length > 0 && (
            <div className="py-6 border-b border-[#e8e4e1]">
              <span className="block text-[12px] font-bold uppercase tracking-wider text-[#6b185f] mb-3">
                Demonstrated Skills & Expertise
              </span>
              <div className="flex flex-wrap gap-2">
                {certificate.metadata.skills_demonstrated.map((skill, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-[#f2eeeb] text-[#2f0036] rounded-md text-[12.5px] font-medium border border-[#ded9d5]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Responsibilities & Achievements */}
          {certificate.metadata?.responsibilities && certificate.metadata.responsibilities.length > 0 && (
            <div className="py-6 border-b border-[#e8e4e1]">
              <span className="block text-[12px] font-bold uppercase tracking-wider text-[#6b185f] mb-3">
                Key Contributions & Scope
              </span>
              <ul className="space-y-2">
                {certificate.metadata.responsibilities.map((resp, i) => (
                  <li key={i} className="flex items-start gap-2 text-[13.5px] text-[#4f4b49]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ffa91f] mt-2 shrink-0" />
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* QA Specific Platforms & Testing Types (if present in metadata) */}
          {(certificate.metadata?.testing_types || certificate.metadata?.platforms_tested) && (
            <div className="py-6 border-b border-[#e8e4e1] grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certificate.metadata.testing_types && (
                <div>
                  <span className="block text-[12px] font-bold uppercase tracking-wider text-[#6b185f] mb-2">
                    Testing Types Validated
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {certificate.metadata.testing_types.map((type, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-[#faf9f8] text-[#171318] rounded text-[12px] border border-[#ded9d5]"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {certificate.metadata?.platforms_tested && (
                <div>
                  <span className="block text-[12px] font-bold uppercase tracking-wider text-[#6b185f] mb-2">
                    Platforms Covered
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {certificate.metadata.platforms_tested.map((platform, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 bg-[#faf9f8] text-[#171318] rounded text-[12px] border border-[#ded9d5]"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Verification Audit Footer */}
          <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[12.5px] text-[#6f6268]">
            <div className="flex items-center gap-2">
              <Building2 size={16} className="text-[#4a0139]" />
              <span>
                Verified via Pentasent Inc Official Registry.
              </span>
            </div>
            <a
              href={`https://pentasent.com/company/employees/certificates?id=${certificate.certificateId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-medium text-[#4a0139] hover:underline"
            >
              <span>Canonical Verification Link</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>

      {/* Print Stylesheet for Pristine Vector PDF Print */}
      <style jsx global>{`
        @media print {
          body {
            background-color: #ffffff !important;
            color: #171318 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          @page {
            size: landscape;
            margin: 0.5cm;
          }
          .print\\:hidden {
            display: none !important;
          }
          #pentasent-official-certificate {
            transform: none !important;
            width: 100% !important;
            max-width: 960px !important;
            height: auto !important;
            min-height: 640px !important;
            box-shadow: none !important;
            border: 1px solid #cfc1b6 !important;
            margin: 0 auto !important;
            page-break-inside: avoid !important;
            page-break-after: avoid !important;
          }
        }
      `}</style>
    </div>
  );
}
