'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { COMING_SOON_DATA } from '@/data/coming-soon';
import { notify } from '@/components/ui/toast';
import { subscribeNewsletter } from '@/lib/api/newsletter';

interface ComingSoonNotifyFormProps {
  onSuccess?: (email: string) => void;
}

export default function ComingSoonNotifyForm({ onSuccess }: ComingSoonNotifyFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formData = COMING_SOON_DATA.form;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes('@')) {
      setStatus('error');
      setErrorMessage(formData.invalidEmailError);
      notify.error(formData.invalidEmailError);
      return;
    }

    setStatus('loading');
    setErrorMessage('');
    try {
      await subscribeNewsletter({
        email: trimmed,
        sourcePlatform: 'web',
        sourcePage: '/coming-soon',
        consentSource: 'coming_soon_newsletter',
      });
      setStatus('success');
      notify.success(formData.successTitle, formData.successMessage);
      onSuccess?.(trimmed);
      setEmail('');
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to join waitlist. Please try again.';
      setStatus('error');
      setErrorMessage(errorMsg);
      notify.error('Subscription failed', errorMsg);
    }
  };

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-md bg-border-background border border-border-2 flex items-start gap-3.5"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {formData.successTitle}
          </h3>
          <p className="text-xs text-primary-text mt-0.5">
            {formData.successMessage}
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2.5">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === 'error') setStatus('idle');
            }}
            placeholder={formData.placeholder}
            className="w-full pl-10 pr-4 py-3 text-sm rounded-md bg-white border border-border-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
            disabled={status === 'loading'}
            aria-label="Email address for notification"
          />
        </div>
        <button
          type="submit"
          disabled={status === 'loading'}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-chart-3 text-secondary font-semibold text-sm hover:bg-chart-4 active:scale-[0.99] transition-all shrink-0 cursor-pointer disabled:opacity-60"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{formData.loadingText}</span>
            </>
          ) : (
            <>
              <span>{formData.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {status === 'error' && (
        <p className="text-xs text-destructive font-medium pl-1">{errorMessage}</p>
      )}

      <p className="text-[12px] text-muted-foreground pl-1">
        {formData.disclaimer}
      </p>
    </form>
  );
}
