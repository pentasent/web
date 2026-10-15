import React from 'react';
import { Metadata } from 'next';
import OpenRolesList from '@/components/pages/careers/open-roles/OpenRolesList';
import { OPEN_ROLES_PAGE_DATA } from '@/data/jobs';
import type { OpenRolesPageData } from '@/types/jobs';

const pageData: OpenRolesPageData = OPEN_ROLES_PAGE_DATA;

export const metadata: Metadata = {
  title: pageData.metadata.title,
  description: pageData.metadata.description,
};

export default function OpenRolesPage() {
  return (
    <main className="min-h-screen bg-white pt-20">
      {/* Top Candidate Safety Banner in bg-border-background as requested */}
      <div className="w-full bg-border-background border-b border-[#e5e0dc] py-3 px-4 text-center">
        <p className="text-[13px] sm:text-[14px] font-medium text-[#2f0036] max-w-5xl mx-auto">
          {pageData.banner.prefix}
          <span className="font-semibold text-foreground">{pageData.banner.domain}</span>
          {pageData.banner.suffix}
        </p>
      </div>

      {/* Main Content Area */}
      <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header Title & Subtitle */}
          <div className="text-center mb-10 sm:mb-12">
            <h1 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold text-foreground tracking-tight leading-[1.1]">
              {pageData.header.title}
            </h1>
            <p className="mt-3.5 sm:mt-4 lg:text-[16.5px] md:text-[15.5px] sm:text-[14px] text-primary-text leading-relaxed max-w-2xl mx-auto">
              {pageData.header.line1}
              <br className="hidden sm:inline" />
              {pageData.header.line2}
            </p>
          </div>

          {/* Filters, Results Counter, Job Cards, and Bottom Tracker */}
          <OpenRolesList />
        </div>
      </section>
    </main>
  );
}
