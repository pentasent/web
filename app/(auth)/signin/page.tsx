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
      
      // The session is now active. AuthContext will update 'user' state.
      // But we can check the public state directly if needed, or wait for refresh.
      // However, we'll let the AuthGuard/Feed page handle the onboarding popups, 
      // or we can do a quick check here.
      
      toast({
        title: "Login successful",
        description: "Login successful, redirecting...",
      });
      
      // Redirect to feed - the feed page or a global guard should handle the onboarding/verification popups
      router.push('/app/feed');
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
    <div className="w-full max-w-7xl mx-auto min-h-screen overflow-hidden grid lg:grid-cols-2">

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
            <Link
              href="/reset-password"
              className="text-sm text-[#6b4c5c] hover:underline"
            >
              Forgot password?
            </Link>
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

      {/* ================= FORGOT PASSWORD MODAL REMOVED ================= */}
    </div>
  );
}

// Removed ForgotPasswordModal and related constants