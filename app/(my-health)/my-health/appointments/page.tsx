import React from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import ComingSoonView from '@/components/my-health/ComingSoonView';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';

export default function AppointmentsPage() {
  const copy = MY_HEALTH_HERO_COPY.appointments;

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />
      <ComingSoonView
        moduleName="Clinical Appointments & Scheduling"
        badge={copy.badge}
        description="Schedule, reschedule, and receive verified notifications for upcoming clinical encounters, diagnostic evaluations, and telehealth consultations."
        futureFeatures={[
          'Direct online appointment booking with verified clinicians',
          'Telehealth video visit launching with end-to-end security',
          'Automated SMS and email preparation reminders',
          'Clinical intake forms and symptom pre-assessment',
          'Rescheduling & cancellation with clinic policy transparency',
          'Calendar synchronization (Google Calendar, Apple iCal, Outlook)',
        ]}
      />
    </main>
  );
}
