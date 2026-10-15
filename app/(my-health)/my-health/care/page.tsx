import React from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import ComingSoonView from '@/components/my-health/ComingSoonView';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';

export default function CarePage() {
  const copy = MY_HEALTH_HERO_COPY.care;

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />
      <ComingSoonView
        moduleName="Healthcare Relationships & Care Teams"
        badge={copy.badge}
        description="Connect with your primary physician, licensed therapists, specialty clinics, and allied healthcare teams. Manage relationship states and consent scopes on your own terms."
        futureFeatures={[
          'Primary physician & specialist affiliation linking',
          'Clinical clinic & hospital network relationships',
          'Multi-disciplinary care team collaboration',
          'Customizable medical data access scopes',
          'Provider verification & institutional credentials',
          'Relationship status tracking & instant disconnection',
        ]}
      />
    </main>
  );
}
