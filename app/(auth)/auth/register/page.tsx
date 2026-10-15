'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { Mail, Lock, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { notify } from '@/components/ui/toast';
import { OtpVerification, OnboardingFlow } from '@/components/auth';
import { AUTH_REGISTER_PAGE_DATA } from '@/data/auth';
import type { AuthRegisterPageCopy } from '@/types/auth';

const registerCopy: AuthRegisterPageCopy = AUTH_REGISTER_PAGE_DATA;

const registerSchema = z
  .object({
    email: z.string().email('Please enter a valid email address').toLowerCase().trim(),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string().min(8, 'Password must be at least 8 characters long'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const { registerWithPassword, sendOtp, verifyOtp, loginWithGoogle } = useAuth();

  // View States: 'form' | 'otp' | 'onboarding'
  const [viewState, setViewState] = useState<'form' | 'otp' | 'onboarding'>('form');

  const [email, setEmail] = useState(initialEmail);
  const [password, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const result = registerSchema.safeParse({ email, password, confirmPassword });
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) errors[issue.path[0] as string] = issue.message;
      });
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      // Register with email and password via backend
      await registerWithPassword(email, password);
      notify.info('Verification code sent', `Check ${email} for your 6-digit verification code`);
      setViewState('otp');
    } catch (err: unknown) {
      notify.error(err instanceof Error ? err.message : 'Failed to register account');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (code: string) => {
    // Verify real OTP with backend
    await verifyOtp(email, code);
    notify.success('Account verified!', "Let's set up your Pentasent experience.");
    setViewState('onboarding');
  };

  const handleOtpResend = async () => {
    await sendOtp(email);
  };

  const handleGoogleClick = () => {
    notify.info(
      'Google Sign-Up Unavailable',
      'This feature is currently not available in your region or area.'
    );
  };

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {/* Unified Cohesive Card matching /company/investors styling */}
      <div className={`w-full transition-all duration-300 ${viewState === 'onboarding' ? 'max-w-3xl' : 'max-w-115'}`}>
        <div className="bg-white border border-[#ded9d5] rounded-xl p-7 sm:p-10 shadow-2xs">
          {/* VIEW: Onboarding Flow */}
          {viewState === 'onboarding' && (
            <OnboardingFlow
              onComplete={() => {
                router.push('/');
              }}
            />
          )}

          {/* VIEW: Register Form */}
          {viewState === 'form' && (
            <div>
              <div className="mb-7 text-left">
                <span className="inline-flex items-center gap-1.5 text-[12px] sm:text-[12.5px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                  {registerCopy.badge}
                </span>
                <h1 className="text-[26px] sm:text-[30px] font-bold text-foreground tracking-tight leading-[1.2] mt-3">
                  {registerCopy.title}
                </h1>
                <p className="mt-2 text-[15px] sm:text-[16px] text-muted-foreground leading-relaxed">
                  {registerCopy.description}
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4 sm:space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5"
                  >
                    Email address
                  </label>
                  <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Mail size={17} />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 rounded-md pl-10 pr-3.5 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock size={17} />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-12 rounded-md pl-10 pr-10 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="mt-1.5 text-[13px] text-red-600 font-medium">{fieldErrors.password}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-[13.5px] sm:text-[14px] font-semibold text-foreground mb-1.5"
                  >
                    Confirm Password
                  </label>
                  <div className="relative rounded-md border border-[#ded9d5] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
                      <Lock size={17} />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-12 rounded-md pl-10 pr-10 text-[15px] text-foreground bg-white outline-none placeholder:text-muted-foreground"
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
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue with Email</span>
                      <ArrowRight size={17} />
                    </>
                  )}
                </button>

                <div className="pt-2">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-[#ded9d5]" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-white px-3 text-[12px] font-semibold text-muted-foreground tracking-wider">
                        Or
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleClick}
                    disabled={loading}
                    className="mt-4 w-full h-12 flex items-center justify-center gap-2.5 rounded-md border border-[#ded9d5] bg-[#faf9f8] px-4 text-[14.5px] sm:text-[15px] font-semibold text-foreground hover:bg-white hover:border-primary transition-all cursor-pointer select-none"
                  >
                    <svg className="h-4.5 w-4.5 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </button>
                </div>

                <div className="pt-4 text-center text-[13.5px] sm:text-[14px] text-muted-foreground border-t border-[#ded9d5]">
                  Already have a Pentasent account?{' '}
                  <Link
                    href="/auth/login"
                    className="font-semibold text-primary hover:text-primary-hover hover:underline"
                  >
                    Sign in here
                  </Link>
                </div>
              </form>
            </div>
          )}

          {/* VIEW: OTP Verification Component */}
          {viewState === 'otp' && (
            <OtpVerification
              email={email}
              onVerify={handleOtpVerify}
              onResend={handleOtpResend}
              onChangeEmail={() => setViewState('form')}
            />
          )}
        </div>

        {/* Minimal Under-Card Disclaimer */}
        {viewState !== 'onboarding' && (
          <p className="mt-6 text-center text-[13px] sm:text-[13.5px] text-muted-foreground">
            By continuing, you agree to Pentasent&apos;s{' '}
            <Link href="/legal/terms" className="font-semibold text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/legal/privacy" className="font-semibold text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="animate-spin text-primary" />
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
