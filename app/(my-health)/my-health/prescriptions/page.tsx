import React from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import ComingSoonView from '@/components/my-health/ComingSoonView';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';

export default function PrescriptionsPage() {
  const copy = MY_HEALTH_HERO_COPY.prescriptions;

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />
      <ComingSoonView
        moduleName="Pharmaceutical Prescriptions & Medication Management"
        badge={copy.badge}
        description="Track active medications, precise dosing schedules, prescribing physician credentials, refill timelines, and drug interaction alerts."
        futureFeatures={[
          'Active pharmaceutical prescription schedules and dosage instructions',
          'Automated medication adherence reminders and intake logging',
          'Pharmacy refill integration with verified dispensing networks',
          'Cross-drug contraindication and allergy interaction safety checks',
          'Historical medication archives and discontinuation reasons',
          'Clinician e-prescribing validation and authorization stamps',
        ]}
      />
    </main>
  );
}
