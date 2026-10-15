'use client';

import React from 'react';
import { Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { CommunityRule } from '@/types/communities';

interface CommunityRulesProps {
  rules: CommunityRule[];
  hasAccepted?: boolean;
  isMember?: boolean;
}

export default function CommunityRules({
  rules,
  hasAccepted = false,
  isMember = false,
}: CommunityRulesProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#e8e4e1] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-[17px] font-bold text-foreground">
            Community Rules & Standards of Conduct
          </h3>
          <p className="text-[13px] text-primary-text">
            Guiding collegial peer review, patient privacy, and evidence-based interactions
          </p>
        </div>

        {isMember && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11.5px] font-semibold shrink-0">
            <CheckCircle2 size={13} />
            <span>Rules Accepted</span>
          </div>
        )}
      </div>

      {/* Rules list with dividers (Unboxed minimal style) */}
      <div className="divide-y divide-[#e8e4e1]">
        {rules.length > 0 ? (
          rules.map((rule, idx) => (
            <div key={rule.id || idx} className="py-5 flex items-start gap-4">
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#fbf5f9] text-primary font-bold text-xs shrink-0 border border-primary/20">
                {idx + 1}
              </span>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-[15px] font-bold text-foreground">
                    {rule.title}
                  </h4>
                  {rule.isRequired && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-bold uppercase tracking-wider bg-[#faf8f6] text-primary-text border border-[#ded9d5]">
                      Required
                    </span>
                  )}
                </div>

                {rule.description && (
                  <p className="text-[13.5px] text-primary-text leading-relaxed">
                    {rule.description}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-[13px] text-primary-text">
            Standard Pentasent healthcare community guidelines apply.
          </div>
        )}
      </div>

      {/* Safety Note */}
      <div className="p-4 rounded-lg bg-[#faf8f6] border border-[#f0ece9] flex items-start gap-3">
        <Shield size={18} className="text-primary shrink-0 mt-0.5" />
        <p className="text-[12.5px] text-primary-text leading-relaxed">
          <strong>Healthcare Safety & Privacy Boundary:</strong> Discussions in this circle are strictly intended for peer collaboration and educational insights. Members must never publish identifiable protected health information (PHI) or construe comments as direct diagnostic care.
        </p>
      </div>
    </div>
  );
}
