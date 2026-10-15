import React from 'react';
import { EventDetailShimmer } from '@/shimmer/tracker';

export default function EventDetailLoading() {
  return (
    <main className="min-h-screen bg-white">
      <section className="w-full py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <EventDetailShimmer />
        </div>
      </section>
    </main>
  );
}
