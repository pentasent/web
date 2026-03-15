"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
type SignInFormValues = z.infer<typeof signInSchema>;

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const { login, setUnverifiedEmail } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    setLoading(true);
    try {
      await login(data.email.toLowerCase().trim(), data.password);
      toast({
        title: "Login successful",
        description: "Login successful, redirecting...",
      });
      reset();
    } catch (error: any) {
      if (error.message.includes('Email not confirmed')) {
        setUnverifiedEmail(data.email);
        const resendFailed = (error as any).resendFailed;
        const resendMessage = (error as any).resendMessage;

        toast({
          title: "Verification required",
          description: resendFailed
            ? `Please check your email for the code sent earlier. (New code failed: ${resendMessage})`
            : "Please verify your email using the OTP sent to you.",
          variant: resendFailed ? "destructive" : "default",
        });
      } else {
        toast({
          title: "Login failed",
          description: error.message || 'Login failed',
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen overflow-hidden grid lg:grid-cols-2">

      {/* ================= LEFT SIDE ================= */}
      <div className="p-10 md:p-14">

        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-[#3d2f4d]">
            <Link href="/">Pentasent</Link>
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-light text-[#3c2a34] mb-4">
          Sign in to your account
        </h2>

        <p className="text-gray-500 mb-8">
          Enter your email and password to continue your wellness journey.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email Address"
              className={`w-full pl-12 pr-4 py-4 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#e8d4df] outline-none transition`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div className="relative">
            <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full pl-12 pr-12 py-4 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:ring-2 focus:ring-[#e8d4df] outline-none transition`}
            />
            {showPassword ? (
              <EyeOff onClick={() => setShowPassword(false)} className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer" />
            ) : (
              <Eye onClick={() => setShowPassword(true)} className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer" />
            )}
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-sm text-[#6b4c5c] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
          </button>

        </form>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500 mt-8">
          {`Don\u2019t have an account? `}
          <Link href="/signup" className="text-[#3d2f4d] font-medium">
            Sign Up
          </Link>
        </p>

      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="hidden lg:flex relative bg-[#4b2a3f] text-white p-14 items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#4b2a3f] via-[#5a324a] to-[#3d2235]" />
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-pink-400/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-purple-400/20 rounded-full blur-[140px]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 20%, white 1px, transparent 1px), radial-gradient(circle at 80% 80%, white 1px, transparent 1px)`,
            backgroundSize: "120px 120px",
          }}
        />

        <div className="relative z-10 text-center max-w-md">
          <h3 className="text-3xl font-light mb-6">
            Start feeling more like you.
          </h3>
          <p className="text-white/80 mb-10">
            Track your rituals, understand your rhythms, and reconnect
            with your body — gently and intentionally.
          </p>

          <div className="relative h-[220px] hidden lg:block">
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: -6 }}
              whileInView={{ opacity: 1, x: 0, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute right-[140px] top-0 inset-[8px] w-[330px] h-[560px] mx-auto -rotate-[6deg]">
              <Image alt="Pentasent Welcome" src="/images/splashscreen.svg" width={1000} height={1000} className="w-full h-full object-contain" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 6 }}
              whileInView={{ opacity: 1, x: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute -right-[150px] top-10 inset-[8px] w-[330px] h-[560px] mx-auto rotate-[6deg]">
              <Image alt="Pentasent Community" src="/images/community.svg" width={1000} height={1000} className="w-full h-full object-contain" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ================= FORGOT PASSWORD MODAL ================= */}
      <AnimatePresence>
        {showForgotModal && (
          <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ================= FORGOT PASSWORD MODAL ================= */
const COOLDOWN_KEY = 'pentasent_forgot_pwd_cooldown';
const FORGOT_EMAIL_KEY = 'pentasent_forgot_pwd_email';

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { toast } = useToast();

  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail.trim());

  // Restore cooldown and email from localStorage on mount
  useEffect(() => {
    const storedCooldown = localStorage.getItem(COOLDOWN_KEY);
    const storedEmail = localStorage.getItem(FORGOT_EMAIL_KEY);
    
    if (storedEmail) {
      setForgotEmail(storedEmail);
    }

    if (storedCooldown) {
      const expiresAt = parseInt(storedCooldown, 10);
      const remaining = Math.floor((expiresAt - Date.now()) / 1000);
      if (remaining > 0) {
        setCooldown(remaining);
        setEmailSent(true); // They already sent one
      } else {
        localStorage.removeItem(COOLDOWN_KEY);
      }
    }
  }, []);

  // Cooldown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (cooldown > 0) {
      interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(COOLDOWN_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldown]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleForgotPassword = async () => {
    if (!isValidEmail) return;

    // Check if still in cooldown
    if (cooldown > 0) {
      toast({
        title: "Please wait",
        description: `You can resend in ${formatTime(cooldown)}. Please check your email.`,
      });
      return;
    }

    const email = forgotEmail.trim().toLowerCase();

    setForgotLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/reset-password`,
      });

      if (error) throw error;

      // Start 2-minute cooldown and persist to localStorage
      const expiresAt = Date.now() + 120 * 1000;
      localStorage.setItem(COOLDOWN_KEY, expiresAt.toString());
      localStorage.setItem(FORGOT_EMAIL_KEY, email);
      setCooldown(120);
      setEmailSent(true);
      
      toast({
        title: "Link Sent",
        description: "A new password reset link has been sent to your email.",
      });
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white max-w-md w-full rounded-2xl shadow-2xl p-8 relative"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 w-10 h-10 flex items-center justify-center rounded-full transition"
        >
          ✕
        </button>

        {emailSent ? (
          /* ===== SUCCESS STATE ===== */
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <Mail className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-2xl font-semibold text-[#3c2a34] mb-3">
              Check your email
            </h3>
            <p className="text-gray-500 mb-6 leading-relaxed">
              If an account exists with{' '}
              <span className="font-medium text-gray-800">{forgotEmail}</span>,
              you will receive a password reset link shortly.
            </p>
            <div className="bg-[#f9f5f7] border border-[#e8d4df] rounded-xl p-4 mb-6 text-left">
              <p className="text-sm text-gray-600">
                {`\uD83D\uDCA1 Didn\u2019t receive an email? Check your spam folder, or make sure the email address is correct.`}
              </p>
            </div>

            {/* Resend button with cooldown */}
            <button
              onClick={handleForgotPassword}
              disabled={cooldown > 0 || forgotLoading || !isValidEmail}
              className="w-full py-3.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-all flex items-center justify-center disabled:opacity-50 mb-3"
            >
              {forgotLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : cooldown > 0 ? (
                `Resend in ${formatTime(cooldown)}`
              ) : (
                "Resend Reset Link"
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition"
            >
              Back to Sign In
            </button>
          </div>
        ) : (
          /* ===== EMAIL INPUT STATE ===== */
          <>
            <h3 className="text-2xl font-semibold text-[#3c2a34] mb-2">
              Reset Password
            </h3>

            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
              {`Enter the email address associated with your account and we\u2019ll send you a link to reset your password.`}
            </p>

            {/* Email Input */}
            <div className="relative mb-6">
              <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && isValidEmail && handleForgotPassword()}
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e8d4df] outline-none transition"
                autoFocus
              />
            </div>

            <button
              onClick={handleForgotPassword}
              disabled={forgotLoading || !isValidEmail || cooldown > 0}
              className="w-full py-3.5 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-60 mb-4"
            >
              {forgotLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : cooldown > 0 ? (
                `Resend in ${formatTime(cooldown)}`
              ) : (
                "Send Reset Link"
              )}
            </button>

            <p className="text-center text-sm text-gray-500">
              {`Don\u2019t have an account? `}
              <Link href="/signup" className="text-[#3d2f4d] font-medium hover:underline">
                Sign Up
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}