'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  HeartHandshake,
  HelpCircle,
  Mail,
  Shield,
  ShieldAlert,
} from 'lucide-react';
import {
  DELETE_ACCOUNT_ACTION_CARDS,
  DELETE_ACCOUNT_PILLARS,
  DELETED_DATA_CATEGORIES,
  MANAGED_ECOSYSTEM_ITEMS,
  RETENTION_TIMELINE_ROWS,
} from '@/data/delete-account';
import { useAuth } from '@/context/auth-context';
import AccountOfferingsChecker from './AccountOfferingsChecker';
import DeleteAccountFeedbackForm from './DeleteAccountFeedbackForm';

export default function DeleteAccountContent() {
  const { user, status } = useAuth();
  const [resolvedEmail, setResolvedEmail] = useState<string>('');
  const [copiedField, setCopiedField] = useState<'email' | 'subject' | null>(null);

  const effectiveEmail =
    resolvedEmail || (status === 'authenticated' && user?.email ? user.email : '');
  const displayEmailPlaceholder = effectiveEmail || '[Your Email Address]';
  const subjectLine = `Account Deletion Request - ${displayEmailPlaceholder}`;
  const mailtoSubject = effectiveEmail
    ? `Account Deletion Request - ${effectiveEmail}`
    : 'Account Deletion Request';

  const mailtoHref = `mailto:hello@pentasent.com?subject=${encodeURIComponent(
    mailtoSubject
  )}&body=${encodeURIComponent(
    `Hello Pentasent Support Team,\n\nPlease permanently delete my Pentasent account associated with: ${displayEmailPlaceholder}.\n\nI confirm that:\n1. I have deleted or delegated ownership of any managed products, communities, events, or hospital/clinic organizations.\n2. I understand this action is irreversible and all personal, medical, social, and activity data will be permanently erased.\n3. I acknowledge any active subscriptions will conclude at the end of the current billing cycle and I am responsible for managing external recurring billing.\n\nThank you.`
  )}`;

  const handleCopy = (value: string, field: 'email' | 'subject') => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return;
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2200);
  };

  const renderActionIcon = (icon: 'shield' | 'fileText' | 'mail' | 'help') => {
    switch (icon) {
      case 'shield':
        return <Shield className="h-5 w-5" />;
      case 'fileText':
        return <FileText className="h-5 w-5" />;
      case 'mail':
        return <Mail className="h-5 w-5" />;
      default:
        return <HelpCircle className="h-5 w-5" />;
    }
  };

  return (
    <article className="mx-auto max-w-4xl px-4 sm:px-8 py-12 sm:py-16 lg:py-20 text-foreground">
      {/* ──────────────────────────────────────────────────────────
          1. LEAD NOTICE & IRREVERSIBLE WARNING
      ────────────────────────────────────────────────────────── */}
      <motion.section
        id="overview"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="scroll-mt-24"
      >
        <p className="text-[15.5px] sm:text-[17px] leading-[1.75] text-primary-text">
          At Pentasent, you remain in full control of your personal identity, healthcare tracking,
          and digital footprint. If you choose to leave our platform, this guide outlines every step
          required to verify ownership, handle any shared products, communities, or hospital/clinic
          workspaces you manage, and permanently erase your account.
        </p>

        {/* Critical Danger Alert Callout */}
        <div className="mt-6 rounded-xl border border-destructive/30 bg-[#fff8f8] p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive mt-0.5">
              <AlertTriangle className="h-4 w-4" strokeWidth={2.4} />
            </div>
            <div>
              <h2 className="text-[15px] sm:text-[16px] font-bold text-destructive leading-tight mb-1.5">
                Permanent & Irreversible Operation
              </h2>
              <p className="text-[14px] sm:text-[14.5px] font-medium text-foreground leading-[1.65]">
                Once your Pentasent account is deleted, <strong>this action cannot be undone</strong>.
                All personal profile details, medical/health tracking logs, community posts, and
                account history will be permanently inaccessible. Regarding paid plans and
                subscriptions, <strong>the user remains solely responsible</strong> for reviewing
                and cancelling any external or recurring billing agreements before deletion;
                Pentasent as a company is not liable for uncancelled third-party subscriptions or
                permanent data loss once deletion is executed.
              </p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          KEY TIMELINE PILLARS (Matching LegalContent)
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.05 }}
        className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
      >
        {DELETE_ACCOUNT_PILLARS.map((pillar, idx) => (
          <div
            key={idx}
            className={`rounded-2xl border p-5 flex flex-col justify-between ${pillar.tone === 'danger'
                ? 'border-destructive/25 bg-[#fff8f8]'
                : pillar.tone === 'warning'
                  ? 'border-[#f59e0b]/35 bg-[#fffbeb]/70'
                  : 'border-border-2/50 bg-border-background/50'
              }`}
          >
            <div>
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg mb-3 ${pillar.tone === 'danger'
                    ? 'bg-destructive/15 text-destructive'
                    : pillar.tone === 'warning'
                      ? 'bg-[#f59e0b]/20 text-[#b45309]'
                      : 'bg-primary/10 text-primary'
                  }`}
              >
                {pillar.tone === 'danger' ? (
                  <Clock className="h-4 w-4" />
                ) : pillar.tone === 'warning' ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <CheckCircle2 className="h-4 w-4" />
                )}
              </div>
              <h3 className="text-[15.5px] font-bold text-foreground tracking-tight">
                {pillar.title}
              </h3>
              <p className="mt-1.5 text-[13px] sm:text-[13.5px] leading-relaxed text-primary-text">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          COMPASSIONATE RETENTION / WE'RE SORRY TO SEE YOU GO
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55 }}
        className="mt-10 rounded-2xl border border-primary/20 bg-border-background/60 p-6 sm:p-7"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 justify-between">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary mt-0.5">
              <HeartHandshake className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-[18px] sm:text-[20px] font-bold text-foreground tracking-tight">
                We’re sorry to see you considering leaving Pentasent
              </h2>
              <p className="mt-1.5 text-[14px] sm:text-[15px] leading-[1.65] text-primary-text">
                Is there something special you were looking for, a clinical or wellness tool you
                expected, or a technical issue we can fix right away? Before permanently deleting
                your account, please reach out — our team is always ready to help and tailor the
                platform experience for you.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <Link
              href="/company/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-[13px] font-semibold text-white hover:bg-primary-hover transition-colors whitespace-nowrap"
            >
              <span>Contact Support Team</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="mailto:hello@pentasent.com?subject=Need%20Help%20With%20My%20Pentasent%20Account"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border-2 bg-white px-4 py-2.5 text-[13px] font-semibold text-foreground hover:bg-border-background/40 transition-colors whitespace-nowrap"
            >
              <Mail className="h-3.5 w-3.5 text-primary" />
              <span>Email hello@pentasent.com</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* ──────────────────────────────────────────────────────────
          MAIN NUMBERED SECTIONS
      ────────────────────────────────────────────────────────── */}
      <div className="mt-12 sm:mt-16 space-y-12 sm:space-y-14">
        {/* SECTION 1: MANAGED SERVICES & ECOSYSTEM PRE-CHECK */}
        <motion.section
          id="ecosystem-services"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 pt-8 border-t border-border-2/40"
        >
          <h2 className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-tight text-foreground">
            1. Check & Manage Your Products, Communities & Hospitals First
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
            Pentasent powers connected healthcare services — including{' '}
            <strong>Products & Innovations</strong>, <strong>Health Communities</strong>,{' '}
            <strong>Hospitals, Clinics & Organizations</strong>, and <strong>Events</strong>. If
            you currently own or manage any of these shared resources, you must either{' '}
            <strong>delete/archive them</strong> or{' '}
            <strong>delegate administrative ownership to another trusted member</strong> if you want
            them to stay active before requesting account deletion.
          </p>

          {/* 4 Ecosystem Entity Cards */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MANAGED_ECOSYSTEM_ITEMS.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-border-2/50 bg-border-background/30 p-5 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-[16px] sm:text-[17px] font-bold text-foreground tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-[14px] text-primary-text leading-relaxed">
                    {item.description}
                  </p>
                  <p className="mt-2.5 text-[13px] font-semibold text-foreground bg-white border border-border-2/50 rounded-lg px-3 py-2">
                    Action: <span className="font-normal text-primary-text">{item.requirement}</span>
                  </p>
                </div>
                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:text-primary-hover transition-colors w-fit"
                >
                  <span>{item.linkText}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>

          {/* Interactive Service Checker */}
          <AccountOfferingsChecker
            resolvedEmail={effectiveEmail}
            onEmailResolved={setResolvedEmail}
          />
        </motion.section>

        {/* SECTION 2: HOW TO REQUEST DELETION */}
        <motion.section
          id="how-to-request"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 pt-8 border-t border-border-2/40"
        >
          <h2 className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-tight text-foreground">
            2. How to Request Account Deletion
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
            To protect your security and prevent unauthorized account erasure, we require that you
            send a deletion request directly from the email address associated with your Pentasent
            account.
          </p>

          {/* Email Request Instructions Card */}
          <div className="mt-6 rounded-2xl border border-destructive/25 bg-[#fffafa] p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-destructive/15">
              <div>
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-destructive">
                  Step 1 • Send an Email To
                </span>
                <div className="mt-1 flex items-center gap-2.5 flex-wrap">
                  <a
                    href={mailtoHref}
                    className="text-[18px] sm:text-[20px] font-bold text-primary underline decoration-[#ffa91f] decoration-2 underline-offset-4 hover:text-primary-hover transition-colors"
                  >
                    hello@pentasent.com
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleCopy('hello@pentasent.com', 'email')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-2 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-foreground hover:bg-border-background/50 transition-colors cursor-pointer w-fit"
              >
                {copiedField === 'email' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                    <span className="text-emerald-700">Email Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-primary" />
                    <span>Copy Email</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-destructive/15">
              <div className="min-w-0">
                <span className="text-[11.5px] font-bold uppercase tracking-wider text-destructive">
                  Step 2 • Required Email Subject
                </span>
                <p className="mt-1 font-mono text-[13.5px] sm:text-[14.5px] font-semibold text-foreground bg-white border border-border-2/70 rounded-lg px-3.5 py-2 break-all">
                  {subjectLine}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleCopy(subjectLine, 'subject')}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border-2 bg-white px-3.5 py-2 text-[12.5px] font-semibold text-foreground hover:bg-border-background/50 transition-colors cursor-pointer shrink-0 w-fit"
              >
                {copiedField === 'subject' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-700" />
                    <span className="text-emerald-700">Subject Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-primary" />
                    <span>Copy Subject</span>
                  </>
                )}
              </button>
            </div>

            <div>
              <span className="text-[11.5px] font-bold uppercase tracking-wider text-destructive">
                Step 3 • Identity Verification & Confirmation
              </span>
              <p className="mt-1.5 text-[14.5px] leading-[1.65] text-primary-text">
                Wait until our team confirms your request. We may ask for additional verification to
                ensure the request is legitimate and that any managed products, communities, or
                healthcare organization profiles have been deleted or delegated safely.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={mailtoHref}
                className="inline-flex items-center gap-2 rounded-xl bg-destructive px-5 py-3 text-[14px] font-semibold text-white hover:bg-[#991b1b] transition-colors shadow-xs"
              >
                <Mail className="h-4 w-4" />
                <span>Open Email App & Request Deletion</span>
              </a>

              <Link
                href="/company/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border-2 bg-white px-5 py-3 text-[14px] font-semibold text-foreground hover:bg-border-background/40 transition-colors"
              >
                <span>Submit Support Inquiry Instead</span>
              </Link>
            </div>
          </div>
        </motion.section>

        {/* SECTION 3: WHAT DATA WILL BE DELETED */}
        <motion.section
          id="data-deleted"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 pt-8 border-t border-border-2/40"
        >
          <h2 className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-tight text-foreground">
            3. What Data Will Be Permanently Deleted
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
            Upon confirming your deletion request, Pentasent permanently erases all personal,
            medical, social, and historical activity records linked to your identity across our
            systems:
          </p>

          <div className="mt-6 space-y-5">
            {DELETED_DATA_CATEGORIES.map((category) => (
              <div
                key={category.id}
                className="rounded-xl bg-border-background/30 p-5 sm:p-6 border border-border-2/40"
              >
                <h3 className="text-[16.5px] sm:text-[18px] font-bold text-foreground tracking-tight">
                  {category.title}
                </h3>
                <p className="mt-2 text-[14.5px] sm:text-[15px] leading-[1.65] text-primary-text">
                  {category.description}
                </p>
                <ul className="mt-3 space-y-2 pl-5 list-disc text-[14px] sm:text-[14.5px] leading-[1.65] text-primary-text">
                  {category.bullets.map((bullet, idx) => (
                    <li key={idx}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>

        {/* SECTION 4: TIMELINES, SUBSCRIPTIONS & 1-YEAR SECURITY RETENTION */}
        <motion.section
          id="timelines-retention"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 pt-8 border-t border-border-2/40"
        >
          <h2 className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-tight text-foreground">
            4. Deletion Timelines, Subscriptions & Data Retention
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
            We enforce strict deletion service timelines while maintaining mandatory financial and
            security compliance safeguards:
          </p>

          {/* Retention & Timeline Table (Matching LegalContent table style) */}
          <div className="mt-6 overflow-x-auto rounded-xl border border-border-2/60 shadow-2xs">
            <table className="w-full text-left text-[14px] sm:text-[14.5px]">
              <thead className="bg-border-background text-foreground border-b border-border-2/60">
                <tr>
                  <th className="py-3 px-4 font-bold">Data / Service</th>
                  <th className="py-3 px-4 font-bold">Action Taken</th>
                  <th className="py-3 px-4 font-bold">Timeline</th>
                  <th className="py-3 px-4 font-bold">Scope & Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-2/40 bg-white">
                {RETENTION_TIMELINE_ROWS.map((row, idx) => (
                  <tr key={idx} className="hover:bg-border-background/20 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground whitespace-nowrap">
                      {row.category}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-primary">
                      {row.action}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-foreground whitespace-nowrap">
                      {row.timeline}
                    </td>
                    <td className="py-3.5 px-4 text-primary-text leading-snug">
                      {row.notes}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-6 space-y-3 pl-5 list-disc text-[15px] sm:text-[15.5px] leading-[1.7] text-primary-text">
            <li>
              <strong>24-Hour Account Termination:</strong> After identity confirmation, your account
              is deactivated and marked for deletion within <strong>24 hours</strong>, ending active
              sessions and public access.
            </li>
            <li>
              <strong>Maximum 7-Day System Removal:</strong> Complete erasure across primary
              databases, search indexes, and active application storage completes within a{' '}
              <strong>maximum of 7 days</strong>.
            </li>
            <li>
              <strong>Subscriptions & Plan Cycles:</strong> Active paid plans or subscriptions are
              cancelled and deleted at the <strong>end of your current plan billing cycle</strong>.
              Users are responsible for reviewing and cancelling any active or third-party
              recurring billing subscriptions prior to account removal.
            </li>
            <li>
              <strong>1-Year Security & Payment Retention:</strong> To protect against fraud,
              chargebacks, unauthorized account abuse, and statutory tax/auditing mandates,
              Pentasent may retain non-clinical <strong>payment history, billing records, and security
                logs for up to 1 year</strong> before final purge or anonymization.
            </li>
          </ul>

          {/* Warning Callout */}
          <div className="mt-6 rounded-xl border border-[#f59e0b]/40 bg-[#fffbeb] p-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#f59e0b]/20 text-[#b45309] mt-0.5">
                <AlertCircle className="h-4 w-4" strokeWidth={2.4} />
              </div>
              <div>
                <h4 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#b45309] leading-tight mb-1">
                  Important Notice on Subscriptions & Liability
                </h4>
                <p className="text-[14px] sm:text-[14.5px] font-medium text-foreground leading-[1.6]">
                  Account deletion cannot be reversed once completed. Please export any personal
                  health records you wish to keep and confirm your active subscription billing
                  preferences before finalizing your request, as the account holder bears sole
                  responsibility for active plan cycles and irreversible data removal.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* SECTION 5: OPTIONAL FEEDBACK FORM */}
        <motion.section
          id="exit-feedback"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 pt-8 border-t border-border-2/40"
        >
          <h2 className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-tight text-foreground">
            5. Share Your Feedback
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
            If you’d like to share why you decided to delete your account — or let us know if a
            missing feature or experience caused frustration — your feedback directly helps our
            product and clinical safety teams improve Pentasent.
          </p>

          <DeleteAccountFeedbackForm prefilledEmail={effectiveEmail} />
        </motion.section>

        {/* SECTION 6: QUESTIONS ABOUT YOUR PRIVACY (GDPR & CCPA) */}
        <motion.section
          id="privacy-questions"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="scroll-mt-24 pt-8 border-t border-border-2/40"
        >
          <h2 className="text-[22px] sm:text-[25px] lg:text-[27px] font-bold tracking-tight text-foreground">
            6. Questions About Your Privacy?
          </h2>
          <p className="mt-3.5 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text">
            If you have questions regarding the{' '}
            <strong>General Data Protection Regulation (GDPR)</strong> or the{' '}
            <strong>California Consumer Privacy Act (CCPA)</strong>, or would like to review our
            encryption architecture, data rights, and platform governance, please visit our{' '}
            <Link
              href="/legal/privacy"
              className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
            >
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link
              href="/legal/terms"
              className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
            >
              Terms & Conditions
            </Link>
            .
          </p>

          <ul className="mt-4 space-y-2.5 pl-5 list-disc text-[15px] sm:text-[15.5px] leading-[1.7] text-primary-text">
            <li>
              Account Deletion & Support:{' '}
              <a
                href="mailto:hello@pentasent.com?subject=Account%20Deletion%20Request"
                className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
              >
                hello@pentasent.com
              </a>
            </li>
            <li>
              Data Protection & Privacy Office:{' '}
              <a
                href="mailto:privacy@pentasent.com"
                className="font-bold text-primary border-b border-[#ffa91f] hover:text-primary-hover transition-colors"
              >
                privacy@pentasent.com
              </a>
            </li>
          </ul>
        </motion.section>
      </div>

      {/* ──────────────────────────────────────────────────────────
          BOTTOM ACTION CARDS (Matching LegalContent)
      ────────────────────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-14 sm:mt-18 pt-8 border-t border-border-2/40"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {DELETE_ACCOUNT_ACTION_CARDS.map((card, cIdx) => (
            <div
              key={cIdx}
              className="rounded-2xl border border-border-2/50 bg-border-background/40 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-3">
                  {renderActionIcon(card.icon)}
                </div>
                <h4 className="text-[16px] font-bold text-foreground">{card.title}</h4>
                <p className="mt-1.5 text-[13.5px] text-primary-text leading-snug">
                  {card.description}
                </p>
              </div>

              <Link
                href={card.linkHref}
                className="mt-4 inline-flex items-center gap-1.5 text-[13.5px] font-bold text-primary hover:text-primary-hover transition-colors"
              >
                <span>{card.linkText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </motion.section>
    </article>
  );
}

