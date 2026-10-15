'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ShieldCheck, Activity, Smile, Lock } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export interface MyHealthHeroProps {
  badge?: string;
  title: string;
  description: string;
  onOpenQuickLog?: () => void;
  onOpenMoodModal?: () => void;
}

export default function MyHealthHero({
  badge = 'Personal Health Layer',
  title,
  description,
  onOpenQuickLog,
  onOpenMoodModal,
}: MyHealthHeroProps) {
  const { user } = useAuth();

  return (
    <header className="w-full bg-border-background border-b border-[#e8e2dc]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-10 md:px-10 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Top row: Badges and Quick Health Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[12px] sm:text-[13px] font-semibold text-primary tracking-wide">
                <Sparkles size={14} className="text-[#ffa91f]" />
                <span>{badge}</span>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-[#4a0139]/10 border border-[#4a0139]/20 px-2.5 py-0.5 text-[11px] font-bold text-primary">
                <Lock size={11} />
                <span>Private & Client-Owned</span>
              </div>

              {user?.isVerified && (
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  <ShieldCheck size={12} />
                  <span>Verified Identity</span>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5">
              {onOpenQuickLog && (
                <button
                  type="button"
                  onClick={onOpenQuickLog}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e8e2dc] bg-white text-[12.5px] sm:text-[13px] font-semibold text-foreground hover:border-primary/50 hover:text-primary hover:bg-[#faf7f4] transition-all cursor-pointer"
                  title="Record a health measurement"
                >
                  <Activity size={13.5} className="text-primary" />
                  <span>Quick Log</span>
                </button>
              )}

              {onOpenMoodModal && (
                <button
                  type="button"
                  onClick={onOpenMoodModal}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#e8e2dc] bg-white text-[12.5px] sm:text-[13px] font-semibold text-primary hover:border-primary/50 hover:bg-[#faf7f4] transition-all cursor-pointer"
                  title="Record today's mood and wellbeing check-in"
                >
                  <Smile size={13.5} className="text-amber-600" />
                  <span>Daily Check-in</span>
                </button>
              )}
            </div>
          </div>

          <h1 className="text-[28px] xs:text-[32px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight text-foreground leading-[1.15]">
            {title}
          </h1>

          <p className="mt-3 max-w-2xl text-[15px] sm:text-[16.5px] leading-relaxed text-primary-text">
            {description}
          </p>
        </motion.div>
      </div>
    </header>
  );
}
