import React from 'react';
import { Metadata } from 'next';
import TrackerNavTabs from '@/components/pages/tracker/TrackerNavTabs';
import PressStatusTracker from '@/components/pages/tracker/PressStatusTracker';
import { TRACKER_PAGES_DATA } from '@/data/trackers';
import type { TrackerPageData } from '@/types/trackers';

const pageData: TrackerPageData = TRACKER_PAGES_DATA['press-status'];

export const metadata: Metadata = {
  title: pageData.metadata.title,
  description: pageData.metadata.description,
};

export default function PressStatusPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Top Verification Banner */}
      <div className="w-full bg-border-background border-b border-[#e5e0dc] py-3 px-4 text-center">
        <p className="text-[13px] sm:text-[14px] font-medium text-[#2f0036] max-w-5xl mx-auto">
          {pageData.banner.text}
        </p>
      </div>

      {/* Tracker Navigation Tabs */}
      <TrackerNavTabs />

      {/* Main Tracker Body */}
      <section className="w-full py-10 sm:py-14 lg:py-18 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <PressStatusTracker />
        </div>
      </section>
    </main>
  );
}
