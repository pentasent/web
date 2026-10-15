'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Mail, ArrowLeft, RefreshCw, Loader2 } from 'lucide-react';
import { notify } from '@/components/ui/toast';
import { OTP_VERIFICATION_COPY } from '@/data/auth';
import type { OtpVerificationProps } from '@/types/auth';

export type { OtpVerificationProps };

export default function OtpVerification({
  email,
  onVerify,
  onResend,
  onChangeEmail,
  title = OTP_VERIFICATION_COPY.defaultTitle,
  subtitle,
}: OtpVerificationProps) {
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(30);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Focus the first input on initial mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (index: number, value: string) => {
    // Only accept numeric characters
    const char = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    setDigits(newDigits);
    setError(null);

    // Auto-advance to next input
    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits are filled
    const fullOtp = newDigits.join('');
    if (fullOtp.length === 6) {
      handleComplete(fullOtp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newDigits = [...digits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setDigits(newDigits);

    const nextFocus = Math.min(pastedData.length, 5);
    inputRefs.current[nextFocus]?.focus();

    if (pastedData.length === 6) {
      handleComplete(pastedData);
    }
  };

  const handleComplete = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      await onVerify(code);
      notify.success(OTP_VERIFICATION_COPY.successMessage);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : OTP_VERIFICATION_COPY.invalidCodeError;
      setError(msg);
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResendClick = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError(null);
    try {
      await onResend();
      setCooldown(30);
      notify.info(OTP_VERIFICATION_COPY.resendSuccessTitle, `${OTP_VERIFICATION_COPY.resendDispatchedPrefix}${email}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : OTP_VERIFICATION_COPY.resendFailError;
      notify.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-7">
        <div className="h-13 w-13 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-3.5">
          <Mail size={22} />
        </div>
        <h2 className="text-2xl sm:text-[26px] font-bold text-foreground tracking-tight leading-[1.2]">{title}</h2>
        <p className="text-[14.5px] sm:text-[15.5px] text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          {subtitle || (
            <>
              {OTP_VERIFICATION_COPY.sentToPrefix}
              <span className="font-semibold text-foreground">{email}</span>
            </>
          )}
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-md bg-red-50 p-3 text-[13.5px] text-red-700 border border-red-200 text-center font-medium">
          {error}
        </div>
      )}

      {/* 6 Digit Input Group */}
      <div className="flex justify-center gap-2.5 sm:gap-3.5 my-7" onPaste={handlePaste}>
        {digits.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              inputRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            disabled={loading}
            className="w-12 h-14 sm:w-13 sm:h-15 text-center text-2xl font-bold rounded-lg border border-[#ded9d5] bg-white text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/20 disabled:bg-[#faf9f8] shadow-2xs"
          />
        ))}
      </div>

      <div className="flex flex-col items-center gap-4 text-[13.5px] sm:text-[14px]">
        {loading && (
          <div className="flex items-center gap-2 text-primary font-medium">
            <Loader2 size={16} className="animate-spin" />
            <span>{OTP_VERIFICATION_COPY.verifyingText}</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-muted-foreground">
          <button
            type="button"
            disabled={cooldown > 0 || resending || loading}
            onClick={handleResendClick}
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:text-primary-hover hover:underline cursor-pointer disabled:text-muted-foreground/60 disabled:no-underline"
          >
            <RefreshCw size={13} className={resending ? 'animate-spin' : ''} />
            <span>{cooldown > 0 ? `${OTP_VERIFICATION_COPY.resendCountdownPrefix}${cooldown}${OTP_VERIFICATION_COPY.resendCountdownSuffix}` : OTP_VERIFICATION_COPY.resendCodeText}</span>
          </button>

          <span>•</span>

          <button
            type="button"
            onClick={onChangeEmail}
            disabled={loading}
            className="inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary hover:underline cursor-pointer"
          >
            <ArrowLeft size={13} />
            <span>{OTP_VERIFICATION_COPY.changeEmailText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
