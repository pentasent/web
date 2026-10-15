import React from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import ComingSoonView from '@/components/my-health/ComingSoonView';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';

export default function BillingPage() {
  const copy = MY_HEALTH_HERO_COPY.billing;

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />
      <ComingSoonView
        moduleName="Healthcare Billing, Claims & Transparent Invoicing"
        badge={copy.badge}
        description="Unified financial ledger for consultation fees, insurance co-pays, laboratory billing, and transparent itemized receipts across participating healthcare providers."
        futureFeatures={[
          'Unified healthcare expense tracker and downloadable receipts',
          'Itemized clinical invoice transparency before consultations',
          'Health insurance coverage eligibility and real-time claim status',
          'Secure payment processing with Apple Pay, Google Pay, and cards',
          'Health savings account (HSA) and flexible spending account (FSA) receipts',
          'Provider refund management and dispute resolution channels',
        ]}
      />
    </main>
  );
}
