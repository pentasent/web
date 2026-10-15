'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  HelpCircle,
  Info,
  Mail,
  Shield,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { LegalPageData, LegalCallout, LegalActionCard } from '@/types/legal';

interface LegalContentProps {
  data: LegalPageData;
}

export default function LegalContent({ data }: LegalContentProps) {
  const { leadNotice, keyPillars, sections, tableData, actionCards } = data;

  const renderCallout = (callout: LegalCallout) => {
    switch (callout.type) {
      case 'alert':
        return (
          <div className="mt-5 rounded-xl border border-destructive/30 bg-[#fff8f8] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive mt-0.5">
                <AlertTriangle className="h-4 w-4" strokeWidth={2.4} />
              </div>
              <div>
                {callout.title && (
                  <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-destructive leading-tight mb-1">
                    {callout.title}
                  </h4>
                )}
                <p className="text-[14px] sm:text-[14.5px] font-medium text-foreground leading-[1.6]">
                  {callout.content}
                </p>
              </div>
            </div>
          </div>
        );
      case 'shield':
        return (
          <div className="mt-5 rounded-xl border border-primary/25 bg-primary/5 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary mt-0.5">
                <ShieldCheck className="h-4 w-4" strokeWidth={2.4} />
              </div>
              <div>
                {callout.title && (
                  <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-primary leading-tight mb-1">
                    {callout.title}
                  </h4>
                )}
                <p className="text-[14px] sm:text-[14.5px] font-medium text-primary-text leading-[1.6]">
                  {callout.content}
                </p>
              </div>
            </div>
          </div>
        );
      case 'warning':
        return (
          <div className="mt-5 rounded-xl border border-[#f59e0b]/40 bg-[#fffbeb] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f59e0b]/20 text-[#b45309] mt-0.5">
                <AlertCircle className="h-4 w-4" strokeWidth={2.4} />
              </div>
              <div>
                {callout.title && (
                  <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#b45309] leading-tight mb-1">
                    {callout.title}
                  </h4>
                )}
                <p className="text-[14px] sm:text-[14.5px] font-medium text-foreground leading-[1.6]">
                  {callout.content}
                </p>
              </div>
            </div>
          </div>
        );
      case 'info':
      default:
        return (
          <div className="mt-5 rounded-xl border border-border-2/60 bg-border-background/60 p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary mt-0.5">
                <Info className="h-4 w-4" strokeWidth={2.4} />
              </div>
              <div>
                {callout.title && (
                  <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-foreground leading-tight mb-1">
                    {callout.title}
                  </h4>
                )}
                <p className="text-[14px] sm:text-[14.5px] font-medium text-primary-text leading-[1.6]">
                  {callout.content}
                </p>
              </div>
            </div>
          </div>
        );
    }
  };

  const renderActionIcon = (icon: LegalActionCard['icon']) => {
    switch (icon) {
      case 'shield':
        return <Shield className="h-5 w-5" />;
      case 'fileText':
        return <FileText className="h-5 w-5" />;
      case 'mail':
        return <Mail className="h-5 w-5" />;
      case 'help':
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-8 py-12 sm:py-16 lg:py-20 text-foreground">
      {/* ──────────────────────────────────────────────────────────
          1. LEAD NOTICE
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-[15.5px] sm:text-[17px] leading-[1.75] text-primary-text"
      >
        <p>{leadNotice}</p>
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          KEY PILLARS (If provided)
      ────────────────────────────────────────────────────────── */}
      {keyPillars && keyPillars.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {keyPillars.map((pillar, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border-2/50 bg-border-background/50 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary mb-2.5">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <h4 className="text-[15px] font-bold text-foreground tracking-tight">
                  {pillar.title}
                </h4>
                <p className="mt-1 text-[13px] sm:text-[13.5px] leading-relaxed text-primary-text">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </motion.section>
      )}

      {/* ──────────────────────────────────────────────────────────
          SECTIONS LIST
      ────────────────────────────────────────────────────────── */}
      <div className="mt-12 sm:mt-16 space-y-12 sm:space-y-14">
        {sections.map((section, idx) => (
          <motion.section
            key={section.id}
            id={section.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.04 }}
            className={`scroll-mt-24 ${idx > 0 ? 'pt-8 border-t border-border-2/40' : ''}`}
          >
            {/* Section Heading */}
            <h2 className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-tight text-foreground">
              {section.number !== undefined ? `${section.number}. ` : ''}
              {section.title}
            </h2>

            {/* Section Description */}
            {section.content && (
              <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
                {section.content}
              </p>
            )}

            {/* Callout Box if present */}
            {section.callout && renderCallout(section.callout)}

            {/* Bullet Points */}
            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-4 space-y-3 pl-5 list-disc text-[15px] sm:text-[15.5px] leading-[1.7] text-primary-text">
                {section.bullets.map((bullet, bIdx) => {
                  if (bullet.includes('privacy@pentasent.com')) {
                    return (
                      <li key={bIdx}>
                        <span>
                          Email:{' '}
                          <a
                            href="mailto:privacy@pentasent.com"
                            className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
                          >
                            privacy@pentasent.com
                          </a>
                        </span>
                      </li>
                    );
                  }
                  if (bullet.includes('legal@pentasent.com')) {
                    return (
                      <li key={bIdx}>
                        <span>
                          Legal Counsel:{' '}
                          <a
                            href="mailto:legal@pentasent.com"
                            className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
                          >
                            legal@pentasent.com
                          </a>
                        </span>
                      </li>
                    );
                  }
                  if (bullet.includes('cookies@pentasent.com')) {
                    return (
                      <li key={bIdx}>
                        <span>
                          Email:{' '}
                          <a
                            href="mailto:cookies@pentasent.com"
                            className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
                          >
                            cookies@pentasent.com
                          </a>
                        </span>
                      </li>
                    );
                  }
                  return <li key={bIdx}>{bullet}</li>;
                })}
              </ul>
            )}

            {/* Subsections if present */}
            {section.subsections && section.subsections.length > 0 && (
              <div className="mt-6 space-y-6">
                {section.subsections.map((sub, sIdx) => (
                  <div key={sIdx} className="rounded-xl bg-border-background/30 p-5 border border-border-2/40">
                    {sub.title && (
                      <h3 className="text-[16.5px] sm:text-[18px] font-bold text-foreground tracking-tight">
                        {sub.title}
                      </h3>
                    )}
                    {sub.description && (
                      <p className="mt-2 text-[14.5px] sm:text-[15px] leading-[1.65] text-primary-text">
                        {sub.description}
                      </p>
                    )}
                    {sub.bullets && sub.bullets.length > 0 && (
                      <ul className="mt-3 space-y-2 pl-5 list-disc text-[14px] sm:text-[14.5px] leading-[1.65] text-primary-text">
                        {sub.bullets.map((b, bi) => (
                          <li key={bi}>{b}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Special Section: Cookies Inventory Table */}
            {section.id === 'cookie-inventory-table' && tableData && (
              <div className="mt-6 overflow-x-auto rounded-xl border border-border-2/60 shadow-2xs">
                <table className="w-full text-left text-[14px] sm:text-[14.5px]">
                  <thead className="bg-border-background text-foreground border-b border-border-2/60">
                    <tr>
                      {tableData.headers.map((h, hi) => (
                        <th key={hi} className="py-3 px-4 font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-2/40 bg-white">
                    {tableData.rows.map((row, ri) => (
                      <tr key={ri} className="hover:bg-border-background/20 transition-colors">
                        <td className="py-3 px-4 font-mono text-[13px] font-semibold text-primary">
                          {row.name}
                        </td>
                        <td className="py-3 px-4 text-foreground font-medium">
                          {row.type}
                        </td>
                        <td className="py-3 px-4 text-primary-text">
                          {row.duration}
                        </td>
                        <td className="py-3 px-4 text-primary-text leading-snug">
                          {row.purpose}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.section>
        ))}
      </div>

      {/* ──────────────────────────────────────────────────────────
          QUICK ACTION / SUPPORT CARDS
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 sm:mt-18 pt-8 border-t border-border-2/40"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {actionCards.map((card, cIdx) => (
            <div
              key={cIdx}
              className="rounded-2xl border border-border-2/50 bg-border-background/40 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  {renderActionIcon(card.icon)}
                </div>
                <h4 className="text-[16px] font-bold text-foreground">
                  {card.title}
                </h4>
                <p className="mt-1.5 text-[13.5px] text-primary-text leading-snug">
                  {card.description}
                </p>
              </div>

              {card.linkHref.startsWith('mailto:') ? (
                <a
                  href={card.linkHref}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:text-primary-hover transition-colors"
                >
                  <span>{card.linkText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
              ) : (
                <Link
                  href={card.linkHref}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:text-primary-hover transition-colors"
                >
                  <span>{card.linkText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>
      </motion.section>
    </article>
  );
}
