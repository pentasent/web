'use client';

import React, { useState } from 'react';
import AccountHero from '@/components/account/AccountHero';
import { ACCOUNT_HERO_COPY } from '@/data/account';
import { Bell, Lock, Shield, Check, Smartphone, KeyRound } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  const copy = ACCOUNT_HERO_COPY.settings;

  const [emailDigest, setEmailDigest] = useState(true);
  const [productAnnouncements, setProductAnnouncements] = useState(true);
  const [communityMentions, setCommunityMentions] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="min-h-screen bg-white">
      <AccountHero
        badge={copy.badge}
        title={copy.title}
        description={copy.description}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-8 md:px-10 lg:px-12 py-10 sm:py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Notifications Section */}
          <div className="bg-white rounded-xl border border-[#ded9d5] p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 pb-5 border-b border-[#ded9d5]">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Bell size={18} />
              </div>
              <div>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-foreground">Notification Preferences</h2>
                <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-primary-text mt-1">
                  Choose how you want to be notified about research updates and community events.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex items-start justify-between gap-4 p-4 rounded-lg border border-[#ded9d5] bg-[#faf9f8] hover:bg-white transition-all cursor-pointer">
                <div>
                  <p className="text-[15px] font-bold text-foreground">Weekly Healthcare & Innovation Digest</p>
                  <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-primary-text mt-1">
                    Curated highlights of new products, clinical research, and community discussions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={emailDigest}
                  onChange={(e) => setEmailDigest(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-4 rounded-lg border border-[#ded9d5] bg-[#faf9f8] hover:bg-white transition-all cursor-pointer">
                <div>
                  <p className="text-[15px] font-bold text-foreground">Product Launches & Medical Tools</p>
                  <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-primary-text mt-1">
                    Get notified when new clinical calculators, health tech products, and datasets are published.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={productAnnouncements}
                  onChange={(e) => setProductAnnouncements(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-4 rounded-lg border border-[#ded9d5] bg-[#faf9f8] hover:bg-white transition-all cursor-pointer">
                <div>
                  <p className="text-[15px] font-bold text-foreground">Community Mentions & Direct Replies</p>
                  <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-primary-text mt-1">
                    Receive instant alerts when fellow clinicians respond to your research topics or questions.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={communityMentions}
                  onChange={(e) => setCommunityMentions(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Security & Sessions Section */}
          <div className="bg-white rounded-xl border border-[#ded9d5] p-6 sm:p-8 shadow-2xs">
            <div className="flex items-center gap-3 pb-5 border-b border-[#ded9d5]">
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h2 className="text-[18px] sm:text-[20px] font-bold text-foreground">Security & Active Sessions</h2>
                <p className="text-[14px] sm:text-[14.5px] leading-relaxed text-primary-text mt-1">
                  Protect your identity with cryptographically verified authentication and active session controls.
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-[#faf9f8] border border-[#ded9d5] gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <Shield size={18} />
                  </div>
                  <div>
                    <p className="text-[14.5px] sm:text-[15px] font-bold text-foreground">Single-Use Email OTP & PBKDF2 Password Hashing</p>
                    <p className="text-[13.5px] sm:text-[14px] text-primary-text mt-1 leading-relaxed">
                      Protected with salted cryptographic hashing and single-use 6-digit verification codes.
                    </p>
                  </div>
                </div>
                <span className="text-[12px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                  Enforced
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-[#ded9d5] gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <p className="text-[14.5px] sm:text-[15px] font-bold text-foreground">Current Connected Device</p>
                    <p className="text-[13.5px] sm:text-[14px] text-primary-text mt-1 leading-relaxed">
                      Active session ({user?.email || 'researcher@pentasent.com'}) &bull; Secure HttpOnly Cookie
                    </p>
                  </div>
                </div>
                <span className="text-[11.5px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shrink-0">
                  Online Now
                </span>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-white border border-[#ded9d5] gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <KeyRound size={18} />
                  </div>
                  <div>
                    <p className="text-[14.5px] sm:text-[15px] font-bold text-foreground">Password Credentials</p>
                    <p className="text-[13.5px] sm:text-[14px] text-primary-text mt-1 leading-relaxed">
                      Configured with zero-knowledge salt & PBKDF2 100,000 rounds.
                    </p>
                  </div>
                </div>
                <span className="text-[12px] font-semibold text-primary shrink-0">Protected</span>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="inline-flex items-center gap-1 text-[12.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-md">
                <Check size={14} strokeWidth={2.5} />
                <span>Preferences saved</span>
              </span>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="rounded-md bg-primary hover:bg-primary-hover px-5 py-3 text-[13px] font-semibold text-white transition-all cursor-pointer shadow-xs"
            >
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
