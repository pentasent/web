'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FEATURED_ORGANIZATIONS } from '@/data/organizations';
import {
  Building2,
  MapPin,
  CheckCircle2,
  Globe,
  ExternalLink,
  Users,
  Layers,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';

export default function OrganizationProfilePage() {
  const params = useParams();
  const orgSlug = params?.organizationId as string;

  const org =
    FEATURED_ORGANIZATIONS.find((o) => o.slug === orgSlug || o.id === orgSlug) ||
    FEATURED_ORGANIZATIONS[0];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Back button */}
      <div>
        <Link
          href="/organizations"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#665e64] hover:text-[#171317] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Back to Organizations Directory</span>
        </Link>
      </div>

      {/* Organization Hero Banner */}
      <div className="bg-white rounded-3xl border border-[#ded5cd] p-6 sm:p-10 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className="h-20 w-20 rounded-2xl bg-[#4a0139]/10 text-[#4a0139] flex items-center justify-center shrink-0 border border-[#4a0139]/20 shadow-xs">
              <Building2 size={36} />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4a0139]">
                  {org.typeLabel}
                </span>
                {org.isVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 size={12} />
                    Verified Institution
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#171317] tracking-tight mt-1">
                {org.name}
              </h1>

              <div className="mt-2 flex items-center gap-4 text-xs text-[#665e64] flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#8e858a]" />
                  {org.location}
                </span>
                {org.facilityCount && (
                  <span>• {org.facilityCount} Facilities & Branches</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {org.website && (
              <a
                href={org.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#ded5cd] text-xs font-bold text-[#171317] hover:bg-[#faf7f5] transition-colors"
              >
                <Globe size={14} />
                <span>Website</span>
                <ExternalLink size={12} className="text-[#8e858a]" />
              </a>
            )}

            <Link
              href={`/organizations/${org.slug}/portal`}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#4a0139] text-xs font-bold text-white hover:bg-[#38012b] transition-colors shadow-xs"
            >
              <ShieldCheck size={14} />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>

        <p className="mt-6 text-sm text-[#4f464c] leading-relaxed max-w-3xl">
          {org.description}
        </p>

        {org.specialties && org.specialties.length > 0 && (
          <div className="mt-6 pt-6 border-t border-[#f0eae5]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8e858a] mb-2.5">
              Clinical Focus & Medical Specialties
            </h3>
            <div className="flex flex-wrap gap-2">
              {org.specialties.map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#f5eeea] text-[#4a0139] border border-[#e8ded6]"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid: Staff Practitioners & Products Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-[#ded5cd] p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0eae5]">
            <Users size={18} className="text-[#4a0139]" />
            <h3 className="text-sm font-bold text-[#171317]">Affiliated Practitioners</h3>
          </div>
          <p className="text-xs text-[#665e64] mt-3">
            Doctors, clinicians, and researchers verified under this organization.
          </p>
          <div className="mt-4 pt-2">
            <Link
              href="/people"
              className="text-xs font-bold text-[#4a0139] hover:underline"
            >
              Browse verified affiliated doctors →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#ded5cd] p-6 shadow-xs">
          <div className="flex items-center gap-2.5 pb-4 border-b border-[#f0eae5]">
            <Layers size={18} className="text-[#4a0139]" />
            <h3 className="text-sm font-bold text-[#171317]">Published Products & Devices</h3>
          </div>
          <p className="text-xs text-[#665e64] mt-3">
            Healthtech tools, software platforms, and medical devices authored by this organization.
          </p>
          <div className="mt-4 pt-2">
            <Link
              href="/products"
              className="text-xs font-bold text-[#4a0139] hover:underline"
            >
              Explore healthcare products →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
