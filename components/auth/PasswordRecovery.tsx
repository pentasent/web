'use client';

import React, { useState } from 'react';
import { z } from 'zod';
import { ArrowLeft, KeyRound, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';
import { PASSWORD_RECOVERY_COPY } from '@/data/auth';
import type { PasswordRecoveryProps } from '@/types/auth';

const emailSchema = z.string().email(PASSWORD_RECOVERY_COPY.validation.emailInvalid).toLowerCase().trim();

const resetSchema = z
  .object({
    otp: z.string().length(6, PASSWORD_RECOVERY_COPY.validation.otpDigits).regex(/^\d{6}$/, PASSWORD_RECOVERY_COPY.validation.otpDigits),
    newPassword: z.string().min(8, PASSWORD_RECOVERY_COPY.validation.passwordMinLength),
    confirmPassword: z.string().min(8, PASSWORD_RECOVERY_COPY.validation.passwordMinLength),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: PASSWORD_RECOVERY_COPY.validation.passwordsMismatch,
    path: ['confirmPassword'],
  });

export type { PasswordRecoveryProps };

export default function PasswordRecovery({
  initialEmail = '',
  onBackToLogin,
  onSuccess,
}: PasswordRecoveryProps) {
  const { requestPasswordReset, resetPassword } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const emailCheck = emailSchema.safeParse(email);
    if (!emailCheck.success) {
      setFieldErrors({ email: emailCheck.error.issues[0]?.message || 'Invalid email' });
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      notify.info(
        PASSWORD_RECOVERY_COPY.resetDispatchedTitle,
        `${PASSWORD_RECOVERY_COPY.resetDispatchedCheckPrefix}${email}${PASSWORD_RECOVERY_COPY.resetDispatchedSuffix}`
      );
      setStep(2);
    } catch (err: unknown) {
      notify.error(err instanceof Error ? err.message : PASSWORD_RECOVERY_COPY.requestFailError);
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = resetSchema.safeParse({ otp, newPassword, confirmPassword });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          errors[issue.path[0] as string] = issue.message;
        }
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email, otp, newPassword);
      notify.success(
        PASSWORD_RECOVERY_COPY.updateSuccessTitle,
        PASSWORD_RECOVERY_COPY.updateSuccessDescription
      );
      onSuccess(email);
    } catch (err: unknown) {
      notify.error(err instanceof Error ? err.message : PASSWORD_RECOVERY_COPY.updateFailError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="text-center mb-7">
        <div className="h-13 w-13 rounded-xl bg-primary/10 text-primary border border-primary/20 flex items-center justify-center mx-auto mb-3.5">
          <KeyRound size={22} />
        </div>
        <h2 className="text-2xl sm:text-[26px] font-bold text-foreground tracking-tight leading-[1.2]">
          {step === 1 ? PASSWORD_RECOVERY_COPY.step1Title : PASSWORD_RECOVERY_COPY.step2Title}
        </h2>
        <p className="text-[14.5px] sm:text-[15.5px] text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
          {step === 1
            ? PASSWORD_RECOVERY_COPY.step1Subtitle
            : `${PASSWORD_RECOVERY_COPY.step2SubtitlePrefix}${email}${PASSWORD_RECOVERY_COPY.step2SubtitleSuffix}`}
        </p>
      </div>

      {step === 1 ? (
        <form onSubmit={handleRequestCode} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {PASSWORD_RECOVERY_COPY.emailLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                type="email"
                required
                placeholder={PASSWORD_RECOVERY_COPY.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 rounded-md px-4 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
            {fieldErrors.email && (
              <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.email}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-12.5 flex items-center justify-center gap-2 rounded-md bg-primary px-5 text-[15px] sm:text-[16px] font-semibold text-white hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer disabled:opacity-70 select-none"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                <span>{PASSWORD_RECOVERY_COPY.sendingResetCode}</span>
              </>
            ) : (
              <span>{PASSWORD_RECOVERY_COPY.sendResetCode}</span>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit} className="space-y-4 sm:space-y-5">
          <div>
            <div className="mb-1.5">
              <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground">
                {PASSWORD_RECOVERY_COPY.codeLabel}
              </label>
            </div>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                type="text"
                maxLength={6}
                required
                placeholder={PASSWORD_RECOVERY_COPY.codePlaceholder}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full h-12 rounded-md px-4 text-[16px] font-mono tracking-widest text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
            {fieldErrors.otp && (
              <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.otp}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {PASSWORD_RECOVERY_COPY.newPasswordLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={PASSWORD_RECOVERY_COPY.newPasswordPlaceholder}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 rounded-md pl-4 pr-10 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {fieldErrors.newPassword && (
              <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.newPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5">
              {PASSWORD_RECOVERY_COPY.confirmPasswordLabel}
            </label>
            <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder={PASSWORD_RECOVERY_COPY.confirmPasswordPlaceholder}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 rounded-md pl-4 pr-10 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 sm:h-12.5 flex items-center justify-center gap-2 rounded-md bg-primary px-5 text-[15px] sm:text-[16px] font-semibold text-white hover:bg-primary-hover transition-colors shadow-2xs cursor-pointer disabled:opacity-70 select-none"
          >
            {loading ? (
              <>
                <Loader2 size={17} className="animate-spin" />
                <span>{PASSWORD_RECOVERY_COPY.updatingPasswordSubmit}</span>
              </>
            ) : (
              <span>{PASSWORD_RECOVERY_COPY.updatePasswordSubmit}</span>
            )}
          </button>
        </form>
      )}

      <div className="mt-6 text-center">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-[13.5px] sm:text-[14px] font-semibold text-primary hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>{PASSWORD_RECOVERY_COPY.returnToLogin}</span>
        </button>
      </div>
    </div>
  );
}
