import React from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import ComingSoonView from '@/components/my-health/ComingSoonView';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';

export default function ReportsPage() {
  const copy = MY_HEALTH_HERO_COPY.reports;

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />
      <ComingSoonView
        moduleName="Diagnostic Pathology & Medical Imaging Reports"
        badge={copy.badge}
        description="Private vault for laboratory blood panels, molecular pathology findings, radiological scans (X-ray, MRI, CT), and clinical documentation."
        futureFeatures={[
          'Structured blood panel observations with reference intervals',
          'Radiology DICOM / PACS image viewer integration',
          'Diagnostic PDF file upload and optical text indexing',
          'Longitudinal biomarker tracking across historical test dates',
          'Clinical lab provider API integrations (Quest, LabCorp)',
          'Automated abnormal marker highlighting without alarming diagnostics',
        ]}
      />
    </main>
  );
}
