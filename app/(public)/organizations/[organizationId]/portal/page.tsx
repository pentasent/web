'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FEATURED_ORGANIZATIONS } from '@/data/organizations';
import {
  Building2,
  Users,
  Layers,
  Settings,
  ShieldCheck,
  Plus,
  Eye,
  ArrowLeft,
  Calendar,
  Activity,
  CheckCircle2,
} from 'lucide-react';

export default function OrganizationPortalPage() {
  const params = useParams();
  const orgSlug = params?.organizationId as string;

  const org =
    FEATURED_ORGANIZATIONS.find((o) => o.slug === orgSlug || o.id === orgSlug) ||
    FEATURED_ORGANIZATIONS[0];

  const [activeTab, setActiveTab] = useState<'overview' | 'team' | 'products' | 'settings'>('overview');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Breadcrumb & Link to Public Profile */}
      <div className="flex items-center justify-between">
        <Link
          href={`/organizations/${org.slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#665e64] hover:text-[#171317] transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Exit Portal to Public Profile</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            <ShieldCheck size={12} />
            Verified Admin Session
          </span>
          <Link
            href={`/organizations/${org.slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#4a0139] hover:underline"
          >
            <Eye size={13} />
            <span>View Public View</span>
          </Link>
        </div>
      </div>

      {/* Portal Header */}
      <div className="bg-white rounded-3xl border border-[#ded5cd] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#4a0139]/10 text-[#4a0139] flex items-center justify-center shrink-0 border border-[#4a0139]/20 shadow-xs">
              <Building2 size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4a0139]">
                  Organization Portal
                </span>
                <span className="text-xs text-[#8e858a]">•</span>
                <span className="text-xs text-[#665e64]">{org.typeLabel}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#171317] tracking-tight mt-0.5">
                {org.name} Management
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => alert('New product publishing form')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#4a0139] text-xs font-bold text-white hover:bg-[#38012b] transition-colors shadow-xs cursor-pointer"
            >
              <Plus size={14} />
              <span>Publish Product</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-8 border-b border-[#f0eae5] flex items-center gap-6 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'overview'
                ? 'border-[#4a0139] text-[#4a0139]'
                : 'border-transparent text-[#665e64] hover:text-[#171317]'
            }`}
          >
            Overview & Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('team')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'team'
                ? 'border-[#4a0139] text-[#4a0139]'
                : 'border-transparent text-[#665e64] hover:text-[#171317]'
            }`}
          >
            Staff & Practitioners
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'border-[#4a0139] text-[#4a0139]'
                : 'border-transparent text-[#665e64] hover:text-[#171317]'
            }`}
          >
            Products & Publications
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'settings'
                ? 'border-[#4a0139] text-[#4a0139]'
                : 'border-transparent text-[#665e64] hover:text-[#171317]'
            }`}
          >
            Portal Settings
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white rounded-2xl border border-[#ded5cd] p-5 shadow-xs">
              <span className="text-xs text-[#8e858a]">Profile Page Views</span>
              <p className="text-2xl font-extrabold text-[#171317] mt-2">14,280</p>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                +18% from last month
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#ded5cd] p-5 shadow-xs">
              <span className="text-xs text-[#8e858a]">Verified Clinicians</span>
              <p className="text-2xl font-extrabold text-[#171317] mt-2">28</p>
              <span className="text-[11px] font-semibold text-[#665e64] mt-1 block">
                Active practitioners
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-[#ded5cd] p-5 shadow-xs">
              <span className="text-xs text-[#8e858a]">Published Products</span>
              <p className="text-2xl font-extrabold text-[#171317] mt-2">5</p>
              <span className="text-[11px] font-semibold text-emerald-600 mt-1 block">
                All approved & live
              </span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#ded5cd] p-6 shadow-xs">
            <h3 className="text-sm font-bold text-[#171317] mb-3">Recent Administrative Activity</h3>
            <div className="divide-y divide-[#f0eae5] text-xs">
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#171317]">Dr. Sarah Jenkins added to Cardiology Dept</p>
                  <p className="text-[#8e858a]">Verified license credentials approved</p>
                </div>
                <span className="text-[#8e858a]">Yesterday</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#171317]">Clinical trial metadata updated</p>
                  <p className="text-[#8e858a]">Precision Oncology Phase II cohort</p>
                </div>
                <span className="text-[#8e858a]">3 days ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-white rounded-2xl border border-[#ded5cd] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#171317]">Associated Practitioners & Staff</h3>
            <button
              type="button"
              onClick={() => alert('Invite member modal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#4a0139] text-xs font-bold text-white hover:bg-[#38012b]"
            >
              <Plus size={13} />
              <span>Invite Practitioner</span>
            </button>
          </div>
          <p className="text-xs text-[#665e64]">
            Team members authenticate using their individual human Pentasent account and access this portal via an assigned role.
          </p>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-[#ded5cd] p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-[#171317]">Catalog of Products & Clinical Assets</h3>
            <Link
              href="/products"
              className="text-xs font-bold text-[#4a0139] hover:underline"
            >
              Browse public catalog →
            </Link>
          </div>
          <p className="text-xs text-[#665e64]">
            Manage release notes, technical documentation, and customer inquiries for products published under {org.name}.
          </p>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="bg-white rounded-2xl border border-[#ded5cd] p-6 shadow-xs">
          <h3 className="text-sm font-bold text-[#171317] mb-2">Organization Profile Settings</h3>
          <p className="text-xs text-[#665e64] mb-4">
            Configure contact emails, physical address, and accreditation certifications.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200 w-fit">
            <CheckCircle2 size={14} />
            <span>Organization verification tier: Gold Level Accreditation</span>
          </div>
        </div>
      )}
    </div>
  );
}
