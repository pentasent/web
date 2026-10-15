'use client';

import React, { type FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronDown, X, Loader2 } from 'lucide-react';
import { contactFormSchema, type ContactFormData } from '@/lib/validations/contact';
import { COUNTRIES } from '@/lib/constants/Countries';
import { employeeRanges, INQUIRY_TYPES } from '@/data/contact';
import { apiClient } from '@/lib/api';

const fieldBase =
  'w-full h-[55px] px-4 text-base text-[#1e1c1b] bg-[#faf9f8] border border-[#ded9d5] rounded outline-none transition-all duration-200 placeholder:text-primary-text focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/10';

const selectWrapper =
  'relative block w-full h-[55px] bg-[#faf9f8] border border-[#ded9d5] rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10';

const selectElement =
  'appearance-none w-full h-full pl-4 pr-11 text-base text-[#23201f] bg-transparent border-0 outline-none cursor-pointer';

const chevron =
  'absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#46413f]';

interface ContactFormProps {
  onSuccess?: (data: ContactFormData) => void;
  className?: string;
  buttonText?: string;
  source?: string;
}

export default function ContactForm({
  onSuccess,
  className = '',
  buttonText = 'Submit',
  source = 'pentasent_contact_page',
}: ContactFormProps) {
  const [countryCode, setCountryCode] = useState('IN');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('');
  const [company, setCompany] = useState('');
  const [employees, setEmployees] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [createdTicketNumber, setCreatedTicketNumber] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentCountry = COUNTRIES.find((item) => item.code === countryCode) ?? COUNTRIES[0];

  // Auto-dismiss toast
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4500);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleCountryChange = (newCode: string) => {
    setCountryCode(newCode);
    if (errors.headquarters) {
      setErrors((prev) => ({ ...prev, headquarters: undefined }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 1. Zod validation
    const rawData = {
      fullName,
      email,
      inquiryType,
      company,
      employees,
      headquarters: currentCountry.name,
      phone,
      message,
    };

    const validationResult = contactFormSchema.safeParse(rawData);

    if (!validationResult.success) {
      const fieldErrors: Partial<Record<keyof ContactFormData, string>> = {};
      validationResult.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof ContactFormData;
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // 2. Prepare structured JSON payload for backend
    const payload = {
      ...validationResult.data,
      dialCode: currentCountry.dialCode,
      countryCode: currentCountry.code,
      countryName: currentCountry.name,
      submittedAt: new Date().toISOString(),
      source,
    };

    try {
      const res = await apiClient<{ ticketNumber: string; message: string; status: string }>(
        '/support/contact',
        {
          method: 'POST',
          body: JSON.stringify(payload),
        }
      );

      if (res.success && res.data?.ticketNumber) {
        const ticketNum = res.data.ticketNumber;
        setIsSubmitted(true);
        setCreatedTicketNumber(ticketNum);
        setToastMessage(
          `Thank you, ${fullName}! Your inquiry has been registered under Ticket ID ${ticketNum}.`
        );

        onSuccess?.(validationResult.data);

        // Reset form
        setFullName('');
        setEmail('');
        setInquiryType('');
        setCompany('');
        setEmployees('');
        setPhone('');
        setMessage('');

        setTimeout(() => {
          setIsSubmitted(false);
        }, 5000);
      } else {
        throw new Error(res.message || 'Submission failed');
      }
    } catch (err: unknown) {
      console.error('Contact submission error:', err);
      const msg =
        err instanceof Error
          ? err.message
          : 'Unable to submit your inquiry at this moment. Please try again.';
      setToastMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <form className={`mt-14 space-y-3.5 ${className}`} onSubmit={handleSubmit} noValidate>
        {/* Full name */}
        <div>
          <input
            className={`${fieldBase} ${errors.fullName ? 'border-red-500 bg-red-50/20' : ''}`}
            type="text"
            name="fullName"
            placeholder="Full name*"
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value);
              if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: undefined }));
            }}
            required
          />
          {errors.fullName && (
            <p className="mt-1 text-xs text-red-600 pl-1">{errors.fullName}</p>
          )}
        </div>

        {/* Work email address */}
        <div>
          <input
            className={`${fieldBase} ${errors.email ? 'border-red-500 bg-red-50/20' : ''}`}
            type="email"
            name="email"
            placeholder="Work email address*"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            required
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-600 pl-1">{errors.email}</p>
          )}
        </div>

        {/* Inquiry Category (Pentasent healthcare topics) */}
        <div>
          <label className={`${selectWrapper} h-14.25 pt-3.75`}>
            <span className="absolute left-4 top-1.5 text-xs text-[#413c3a]">Inquiry category*</span>
            <select
              value={inquiryType}
              onChange={(e) => {
                setInquiryType(e.target.value);
                if (errors.inquiryType) setErrors((prev) => ({ ...prev, inquiryType: undefined }));
              }}
              className={`${selectElement} pt-3`}
            >
              <option value="" disabled>What describes your inquiry best?*</option>
              {INQUIRY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <ChevronDown size={20} strokeWidth={1.7} className={chevron} />
          </label>
          {errors.inquiryType && (
            <p className="mt-1 text-xs text-red-600 pl-1">{errors.inquiryType}</p>
          )}
        </div>

        {/* Row: Company name & # of staff */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div>
            <input
              className={`${fieldBase} ${errors.company ? 'border-red-500 bg-red-50/20' : ''}`}
              type="text"
              name="company"
              placeholder="Company or practice name"
              value={company}
              onChange={(e) => {
                setCompany(e.target.value);
                if (errors.company) setErrors((prev) => ({ ...prev, company: undefined }));
              }}
            />
            {errors.company && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.company}</p>
            )}
          </div>

          <div>
            <label className={selectWrapper}>
              <span className="sr-only">Number of healthcare staff and clinicians</span>
              <select
                name="employees"
                value={employees}
                onChange={(e) => {
                  setEmployees(e.target.value);
                  if (errors.employees) setErrors((prev) => ({ ...prev, employees: undefined }));
                }}
                className={selectElement}
              >
                <option value="" disabled># of employees + contractors*</option>
                {employeeRanges.map((range) => (
                  <option key={range} value={range}>{range}</option>
                ))}
              </select>
              <ChevronDown size={20} strokeWidth={1.7} className={chevron} />
            </label>
            {errors.employees && (
              <p className="mt-1 text-xs text-red-600 pl-1">{errors.employees}</p>
            )}
          </div>
        </div>

        {/* Headquarters with Country Auto-Sync */}
        <div>
          <label className={`${selectWrapper} h-14.25 pt-3.75`}>
            <span className="absolute left-4 top-1.5 text-xs text-[#413c3a]">Headquarters*</span>
            <select
              value={countryCode}
              onChange={(event) => handleCountryChange(event.target.value)}
              name="headquarters"
              className={`${selectElement} pt-3`}
            >
              {COUNTRIES.map((item) => (
                <option value={item.code} key={item.code}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown size={20} strokeWidth={1.7} className={chevron} />
          </label>
          {errors.headquarters && (
            <p className="mt-1 text-xs text-red-600 pl-1">{errors.headquarters}</p>
          )}
        </div>

        {/* Country Dial Code + Phone Number */}
        <div>
          <div
            className={`flex w-full h-14.25 overflow-hidden bg-[#faf9f8] border rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 ${errors.phone ? 'border-red-500 bg-red-50/20' : 'border-[#ded9d5]'
              }`}
          >
            <label className="relative block shrink-0 w-22 border-r border-[#ded9d5]">
              <span className="sr-only">Country calling code</span>
              <select
                value={countryCode}
                onChange={(event) => handleCountryChange(event.target.value)}
                aria-label={`Country calling code, currently ${currentCountry.dialCode}`}
                className="appearance-none w-full h-full pl-4 pr-7 text-base text-[#23201f] bg-transparent border-0 outline-none cursor-pointer"
              >
                {COUNTRIES.map((item) => (
                  <option value={item.code} key={`${item.code}-dial`}>
                    {item.code}
                  </option>
                ))}
              </select>
              <ChevronDown size={19} strokeWidth={1.7} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#46413f]" />
            </label>
            <input
              className="min-w-0 flex-1 px-4 text-base text-[#1e1c1b] bg-transparent border-0 outline-none placeholder:text-primary-text"
              type="tel"
              name="phone"
              placeholder="Phone number*"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
              }}
              required
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-red-600 pl-1">{errors.phone}</p>
          )}
        </div>

        {/* Textarea */}
        <div>
          <label className="relative block w-full h-29 pt-7 pb-2.5 px-4 bg-[#faf9f8] border border-[#ded9d5] rounded transition-all duration-200 focus-within:border-primary focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10">
            <span className="absolute left-4 top-1.5 text-xs text-[#413c3a]">What would you like to speak to us about?</span>
            <textarea
              name="message"
              rows={4}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors((prev) => ({ ...prev, message: undefined }));
              }}
              className="block w-full h-full resize-y text-base text-[#23201f] bg-transparent border-0 outline-none"
            />
          </label>
          {errors.message && (
            <p className="mt-1 text-xs text-red-600 pl-1">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          className="w-full h-15 mt-3 border-0 rounded bg-[#ffa91f] text-[#090909] text-[15px] font-bold cursor-pointer transition-colors duration-200 hover:bg-[#f6a116] flex items-center justify-center gap-2 disabled:opacity-75"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-black" />
              <span>Submitting...</span>
            </span>
          ) : isSubmitted ? (
            <span className="inline-flex items-center gap-1.5">
              <Check size={18} strokeWidth={3} /> Request received
            </span>
          ) : (
            buttonText
          )}
        </button>

        {createdTicketNumber && (
          <div className="p-4 rounded bg-[#edf7f1] border border-[#1b6d47]/20 text-[#1b6d47] text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold text-[#1b6d47]">
                Inquiry Ticket Created: <span className="font-mono">{createdTicketNumber}</span>
              </p>
              <p className="text-xs text-[#1b6d47]/80 mt-0.5">
                A confirmation has been recorded with your ticket details.
              </p>
            </div>
            <Link
              href={`/tracker/support-status?id=${createdTicketNumber}`}
              className="inline-flex items-center gap-1 font-bold text-primary underline underline-offset-2 decoration-1 text-xs shrink-0 hover:text-primary-dark"
            >
              <span>Track Ticket Status &rarr;</span>
            </Link>
          </div>
        )}

        <p className="mt-4 text-primary-text text-xs">
          We value your privacy.{' '}
          <Link href="/legal/privacy" className="text-primary underline underline-offset-2 decoration-1 mr-2">Learn more.</Link>
          Already submitted query? <Link href="/tracker/support-status" className="text-primary underline underline-offset-2 decoration-1">Check your query status</Link>
        </p>
      </form>

      {/* Auto-dismissing Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.22 }}
            className="fixed bottom-6 right-6 z-50 bg-[#1c181a] text-white px-5 py-3.5 rounded-lg shadow-xl flex items-center gap-3 text-sm font-medium"
          >
            <Check size={18} className="text-[#ffa91f] shrink-0" strokeWidth={2.5} />
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="ml-2 text-white/60 hover:text-white cursor-pointer"
              aria-label="Close notification"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
