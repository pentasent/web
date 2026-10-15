'use client';

import React, { useState, useEffect } from 'react';
import MyHealthHero from '@/components/my-health/MyHealthHero';
import HealthProfileForm from '@/components/my-health/forms/HealthProfileForm';
import { fetchHealthProfile } from '@/lib/api/my-health';
import { HealthProfileData } from '@/types/my-health';
import { MY_HEALTH_HERO_COPY } from '@/data/my-health';
import { HealthProfileShimmer } from '@/shimmer/my-health';
import { ShieldCheck, User } from 'lucide-react';

export default function HealthProfilePage() {
  const [profile, setProfile] = useState<HealthProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const copy = MY_HEALTH_HERO_COPY.profile;

  useEffect(() => {
    fetchHealthProfile()
      .then((data) => setProfile(data))
      .catch(() => {
        setProfile({
          id: null,
          userId: '',
          heightValue: null,
          heightUnit: 'cm',
          currentWeightValue: null,
          currentWeightUnit: 'kg',
          bloodGroup: null,
          healthNotes: null,
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="min-h-screen bg-[#faf7f4]">
      <MyHealthHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-4xl px-4 py-8 sm:py-12 md:px-8">
        <div className="bg-white border border-[#e8e2dc] rounded-lg p-6 sm:p-9">
          <div className="flex items-center gap-3 pb-5 mb-6 border-b border-[#f3eee9]">
            <div className="h-10 w-10 rounded-lg bg-primary/5 text-primary border border-primary/15 flex items-center justify-center shrink-0">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-[19px] font-bold text-foreground tracking-tight">
                Baseline Parameters
              </h2>
              <p className="text-[13px] text-muted-foreground">
                Stored privately in your Pentasent health layer
              </p>
            </div>
          </div>

          {isLoading ? (
            <HealthProfileShimmer />
          ) : profile ? (
            <HealthProfileForm
              initialData={profile}
              onSaved={(updated) => setProfile(updated)}
            />
          ) : null}

          {/* Privacy Note */}
          <div className="mt-8 pt-6 border-t border-[#f3eee9] flex items-start gap-3 text-[13px] text-muted-foreground">
            <ShieldCheck size={16} className="text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Your baseline height, weight, and blood group are never exposed on your public Pentasent people or researcher profile.
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
