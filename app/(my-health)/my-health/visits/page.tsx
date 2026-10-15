import React from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import ComingSoonView from '@/components/my-health/ComingSoonView';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';

export default function VisitsPage() {
  const copy = MY_HEALTH_HERO_COPY.visits;

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />
      <ComingSoonView
        moduleName="Clinical Encounters & Visit Summaries"
        badge={copy.badge}
        description="Comprehensive records of your in-person visits and telehealth encounters with clinical notes, diagnoses, care plans, and instructions."
        futureFeatures={[
          'Detailed physician encounter notes and consultation summaries',
          'Standardized ICD/SNOMED diagnostic code references',
          'Personalized post-visit care plans and action items',
          'Follow-up visit scheduling recommendations',
          'Clinical encounter chronologies organized by provider',
          'Secure PDF export for second opinions and specialist referrals',
        ]}
      />
    </main>
  );
}
