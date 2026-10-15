'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  Copy,
  Mail,
  Shield,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { PHISHING_SCAM_DATA } from '@/data/phishingScam';
import DomainChecker from './DomainChecker';

export default function PhishingScamContent() {
  const {
    introNotice,
    whatIsFraud,
    commonScams,
    verification,
    contractorOpportunities,
    suspectedScamActions,
  } = PHISHING_SCAM_DATA;

  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  const handleCopy = (domain: string) => {
    navigator.clipboard.writeText(domain);
    setCopiedDomain(domain);
    setTimeout(() => setCopiedDomain(null), 2500);
  };

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-8 py-12 sm:py-16 lg:py-20 text-foreground">
      {/* ──────────────────────────────────────────────────────────
          1. INTRODUCTORY NOTICE
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-[15.5px] sm:text-[17px] leading-[1.75] text-primary-text"
      >
        <p>{introNotice}</p>
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          2. WHAT IS RECRUITMENT FRAUD?
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mt-12 sm:mt-16"
      >
        <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold tracking-tight text-foreground">
          {whatIsFraud.title}
        </h2>
        <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
          {whatIsFraud.description}
        </p>
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          3. COMMON RECRUITMENT SCAMS (1 - 5)
      ────────────────────────────────────────────────────────── */}
      <section className="mt-12 sm:mt-16 space-y-8 sm:space-y-10">
        {commonScams.items.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.06 }}
            className="flex flex-col text-left"
          >
            {/* Title with Number */}
            <h3 className="text-[17px] sm:text-[19px] font-bold text-foreground tracking-tight">
              {item.stepNumber}. {item.title}
            </h3>

            {/* Description */}
            <p className="mt-2 text-[15px] sm:text-[15.5px] leading-[1.7] text-primary-text">
              {item.description}
            </p>

            {/* Action Link (e.g. Verify official email domains or apply through careers) */}
            {item.actionLink && (
              <div className="mt-2.5">
                {item.actionLink.href.startsWith('#') ? (
                  <a
                    href={item.actionLink.href}
                    className="group inline-flex items-center gap-1.5 text-[14.5px] sm:text-[15px] font-semibold text-primary hover:text-primary-hover border-b-2 border-[#ffa91f] pb-0.5 transition-colors cursor-pointer"
                  >
                    <span>&rarr; {item.actionLink.text}</span>
                  </a>
                ) : (
                  <Link
                    href={item.actionLink.href}
                    className="group inline-flex items-center gap-1.5 text-[14.5px] sm:text-[15px] font-semibold text-primary hover:text-primary-hover border-b-2 border-[#ffa91f] pb-0.5 transition-colors cursor-pointer"
                  >
                    <span>&rarr; {item.actionLink.text}</span>
                  </Link>
                )}
              </div>
            )}

            {/* Callout Box for Payment Scams (Prominent Alert as highlighted in screenshot) */}
            {item.highlightCallout && (
              <div className="mt-4 rounded-xl border border-destructive/30 bg-[#fff8f8] p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive mt-0.5">
                    <AlertTriangle className="h-4 w-4" strokeWidth={2.4} />
                  </div>
                  <p className="text-[14.5px] sm:text-[15.5px] font-bold text-foreground leading-[1.6]">
                    {item.highlightCallout}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </section>

      {/* ──────────────────────────────────────────────────────────
          4. HOW TO VERIFY LEGITIMATE COMMUNICATIONS
      ────────────────────────────────────────────────────────── */}
      <motion.section
        id="official-domains"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 sm:mt-18 pt-8 border-t border-border-2/40 scroll-mt-24"
      >
        <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold tracking-tight text-foreground">
          {verification.title}
        </h2>

        <ul className="mt-6 space-y-4 text-[15px] sm:text-[15.5px] leading-[1.7] text-primary-text list-disc pl-5">
          {/* Sender email verification */}
          <li>
            <span>
              {verification.senderDomainGuidance}{' '}
              <a
                href="#domains-list"
                className="font-semibold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
              >
                {verification.officialDomainsListLinkText}
              </a>
            </span>
          </li>

          {/* Official channels guidance */}
          <li>
            <span>
              {verification.officialChannelsGuidance}{' '}
              <Link
                href={verification.careersPortalLink.href}
                className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
              >
                {verification.careersPortalLink.text}
              </Link>
              .
            </span>
          </li>

          {/* Pentasent will never */}
          <li className="list-none -ml-5 pt-2">
            <span className="font-bold text-foreground block mb-2">
              {verification.neverDoList.title}
            </span>
            <ul className="space-y-2.5 pl-6 list-disc text-primary-text">
              {verification.neverDoList.items.map((neverItem, nIdx) => (
                <li key={nIdx}>
                  <span>{neverItem}</span>
                </li>
              ))}
            </ul>
          </li>
        </ul>

        {/* Official Email Domains Box */}
        <div id="domains-list" className="mt-8 rounded-2xl border border-border-2/50 bg-border-background/50 p-6 sm:p-7">
          <div className="flex items-center gap-2.5 text-primary mb-3">
            <Shield className="h-5 w-5" />
            <h4 className="text-[17px] font-bold text-foreground">
              Official Pentasent Email & Web Domains
            </h4>
          </div>
          <p className="text-[14px] sm:text-[14.5px] text-primary-text leading-relaxed">
            All legitimate emails from our talent and recruitment team originate exclusively from the following domains:
          </p>

          <div className="mt-4 flex flex-wrap gap-2.5">
            {verification.officialDomains.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => handleCopy(dom)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#ded9d5] text-[13.5px] font-semibold text-foreground hover:border-primary hover:text-primary transition-all shadow-2xs cursor-pointer group"
                title="Click to copy domain"
              >
                <code>{dom}</code>
                <Copy className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                {copiedDomain === dom && (
                  <span className="text-[11px] text-[#027a48] font-bold">Copied!</span>
                )}
              </button>
            ))}
          </div>

          <p className="mt-4 text-[13px] text-muted-foreground leading-relaxed">
            <strong>Important:</strong> Pentasent never uses public free email services (e.g., <code>@gmail.com</code>, <code>@yahoo.com</code>, <code>@outlook.com</code>) or unauthorized lookalike domains for talent outreach.
          </p>
        </div>

        {/* Interactive Domain Checker tool */}
        <div className="mt-6">
          <DomainChecker />
        </div>
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          5. CONTRACTOR OPPORTUNITIES AT PENTASENT
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 sm:mt-18 pt-8 border-t border-border-2/40"
      >
        <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold tracking-tight text-foreground">
          {contractorOpportunities.title}
        </h2>

        <ul className="mt-4 space-y-3 pl-5 list-disc text-[15px] sm:text-[15.5px] leading-[1.7] text-primary-text">
          <li>
            <span>
              The official platform for contract opportunities at Pentasent is:{' '}
              <Link
                href="/company/careers"
                className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
              >
                https://pentasent.com/company/careers
              </Link>
              . If you are interested in contract roles at Pentasent, always apply through this platform. Any contract opportunity not listed on this platform is not an official contract role at Pentasent.
            </span>
          </li>
        </ul>
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          6. WHAT TO DO IF YOU SUSPECT A SCAM
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 sm:mt-18 pt-8 border-t border-border-2/40"
      >
        <h2 className="text-[22px] sm:text-[26px] lg:text-[28px] font-bold tracking-tight text-foreground">
          {suspectedScamActions.title}
        </h2>

        <ul className="mt-5 space-y-3.5 pl-5 list-disc text-[15px] sm:text-[15.5px] leading-[1.7] text-primary-text">
          {suspectedScamActions.checklist.map((item, idx) => (
            <li key={idx}>
              {item.includes('phishing@pentasent.com') ? (
                <span>
                  Forward the suspicious email or message to{' '}
                  <a
                    href="mailto:phishing@pentasent.com?subject=Suspected%20Recruitment%20Scam"
                    className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
                  >
                    phishing@pentasent.com
                  </a>
                  .
                </span>
              ) : item.includes('"Contact"') ? (
                <span>
                  Report the incident using the{' '}
                  <Link
                    href="/company/contact"
                    className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
                  >
                    Contact page
                  </Link>{' '}
                  on the Pentasent site or to your local law enforcement agency.
                </span>
              ) : (
                <span>{item}</span>
              )}
            </li>
          ))}
        </ul>
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          7. QUICK ACTION / SUPPORT CARDS
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 sm:mt-18 pt-8 border-t border-border-2/40"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {/* Card 1: Forward Phishing */}
          <div className="rounded-2xl border border-border-2/50 bg-border-background/40 p-5 flex flex-col justify-between">
            <div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Mail className="h-5 w-5" />
              </div>
              <h4 className="text-[16px] font-bold text-foreground">Report to Security</h4>
              <p className="mt-1.5 text-[13.5px] text-primary-text leading-snug">
                Send screenshots and header details to our security team.
              </p>
            </div>
            <a
              href="mailto:phishing@pentasent.com?subject=Suspected%20Recruitment%20Scam"
              className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:text-primary-hover transition-colors"
            >
              <span>Email phishing team</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {/* Card 2: View Verified Open Roles */}
          <div className="rounded-2xl border border-border-2/50 bg-border-background/40 p-5 flex flex-col justify-between">
            <div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <Briefcase className="h-5 w-5" />
              </div>
              <h4 className="text-[16px] font-bold text-foreground">Verified Careers</h4>
              <p className="mt-1.5 text-[13.5px] text-primary-text leading-snug">
                Browse official open positions verified by Pentasent.
              </p>
            </div>
            <Link
              href="/company/careers/open-roles"
              className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:text-primary-hover transition-colors"
            >
              <span>View open roles</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Card 3: Contact Support */}
          <div className="rounded-2xl border border-border-2/50 bg-border-background/40 p-5 flex flex-col justify-between">
            <div>
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                <HelpCircle className="h-5 w-5" />
              </div>
              <h4 className="text-[16px] font-bold text-foreground">Need Assistance?</h4>
              <p className="mt-1.5 text-[13.5px] text-primary-text leading-snug">
                Questions about an inquiry or offer? Contact Pentasent support.
              </p>
            </div>
            <Link
              href="/company/contact"
              className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:text-primary-hover transition-colors"
            >
              <span>Contact Pentasent</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </motion.section>
    </article>
  );
}
