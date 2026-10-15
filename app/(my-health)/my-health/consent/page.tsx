import React from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import ComingSoonView from '@/components/my-health/ComingSoonView';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';

export default function ConsentPage() {
  const copy = MY_HEALTH_HERO_COPY.consent;

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />
      <ComingSoonView
        moduleName="Cryptographic Consent & Granular Sharing Scopes"
        badge={copy.badge}
        description="Full sovereign control over your medical data. Authorize specific physicians, clinics, or research programs with time-limited scopes and immediate revocation."
        futureFeatures={[
          'Granular resource scopes (vitals only, lab reports only, mood excluded)',
          'Time-bounded clinical authorization with automated expiration',
          'Instant one-click access revocation for any linked provider',
          'Tamper-evident audit logs of every medical record access event',
          'Selective anonymized sharing for scientific research studies',
          'Zero unauthorized platform access guarantee',
        ]}
      />
    </main>
  );
}
