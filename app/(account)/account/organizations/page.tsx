import React from 'react';
import type { Metadata } from 'next';
import AccountHero from '@/components/account/AccountHero';
import { ACCOUNT_HERO_COPY } from '@/data/account';
import { Building2, Plus, Hospital } from 'lucide-react';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Organization Memberships | Pentasent Account',
  description: 'Manage clinical organizations, hospitals, and medical practice partnerships on Pentasent.',
};

export default function AccountOrganizationsPage() {
  const copy = ACCOUNT_HERO_COPY.organizations;

  return (
    <main className="min-h-screen bg-white">
      <AccountHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12">
        <div className="rounded-xl border border-[#ded9d5] bg-[#faf9f8] p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xs">
          <div className="h-16 w-16 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <Building2 size={28} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-3">
            <Hospital size={13} />
            <span>Institutional Healthcare Network</span>
          </div>

          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Institutional Memberships & Practices
          </h2>

          <p className="mt-3 text-[14.5px] sm:text-[15.5px] text-primary-text leading-relaxed">
            Link your personal medical credentials to clinics, university laboratories, and hospitals. Organization owners can manage team rosters, collaborative research tools, and institutional billing.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/company/contact"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-md bg-primary text-white text-[13px] font-semibold shadow-xs hover:bg-primary-hover transition-all cursor-pointer"
            >
              <Plus size={15} />
              <span>Register Clinical Practice</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
