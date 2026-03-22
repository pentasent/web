"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";

export default function ResetPasswordPage() {
  const { user, setUnverifiedEmail, setOtpType, logout, setIsResetVerified } = useAuth();
  
  // States: 'request' | 'verify' | 'reset'
  const [stage, setStage] = useState<'request' | 'verify' | 'reset'>('request');
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const { toast } = useToast();
  
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const TIMER_KEY = "reset_password_timer_end";
  const EMAIL_KEY = "reset_password_email";

  // 1. persistent timer initialization
  useEffect(() => {
    const storedTimerEnd = localStorage.getItem(TIMER_KEY);
    const storedEmail = localStorage.getItem(EMAIL_KEY);

    if (storedTimerEnd && storedEmail) {
      const endTime = parseInt(storedTimerEnd, 10);
      const remaining = Math.ceil((endTime - Date.now()) / 1000);
      
      if (remaining > 0) {
        setTimer(remaining);
        setEmail(storedEmail || "");
      } else {
        localStorage.removeItem(TIMER_KEY);
        localStorage.removeItem(EMAIL_KEY);
      }
    }
  }, []);

  // 2. Auto-fill email for logged-in users
  useEffect(() => {
    if (user?.email && !email && stage === 'request') {
      setEmail(user.email);
    }
    
    // Check for recovery hash (legacy support)
    if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
        setStage('reset');
    }
  }, [user, email, stage]);

  // 3. Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            localStorage.removeItem(TIMER_KEY);
            localStorage.removeItem(EMAIL_KEY);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  };

  const handleSendOTP = async () => {
    const targetEmail = email.trim().toLowerCase();
    
    if (!validateEmail(targetEmail)) {
      toast({ title: "Invalid Email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }


    if (timer > 0 && targetEmail === localStorage.getItem(EMAIL_KEY)) {
      setStage('verify');
      return;
    }

    setLoading(true);
    try {
      const { data: userData } = await supabase.from('users').select('id').ilike('email', targetEmail).maybeSingle();

      if (!userData) {
        toast({ title: "Account not found", description: "Account not found with this email.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/reset-password`,
      });
      if (error) throw error;

      toast({ title: "OTP Sent", description: "A 6-digit reset code has been sent to your email." });

      const endTime = Date.now() + 120 * 1000;
      localStorage.setItem(TIMER_KEY, endTime.toString());
      localStorage.setItem(EMAIL_KEY, targetEmail);
      setTimer(120);
      setStage('verify');

    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs.current[index - 1]?.focus();
  };

  const handleVerifyOTP = async () => {
    const token = otp.join('');
    if (token.length !== 6) return;

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token,
        type: 'recovery',
      });

      if (error) throw error;

      toast({ title: "Verified!", description: "Code verified successfully. Now set your new password." });
      setStage('reset');
      
      // Cleanup timer
      localStorage.removeItem(TIMER_KEY);
      localStorage.removeItem(EMAIL_KEY);
      setTimer(0);

    } catch (e: any) {
      toast({ title: "Verification failed", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
        toast({ title: "Short password", description: "Password must be at least 6 characters.", variant: "destructive" });
        return;
    }
    if (newPassword !== confirmPassword) {
        toast({ title: "Mismatch", description: "Passwords do not match.", variant: "destructive" });
        return;
    }

    setLoading(true);
    try {
        const { error } = await supabase.auth.updateUser({ password: newPassword });
        if (error) throw error;

        toast({ title: "Success!", description: "Password updated successfully. You are now logged in." });
        
        // Final redirection handled by AuthGuard as we are now logged in and password is set.
        // But let's be explicit
        window.location.href = '/app/feed';
        
    } catch (e: any) {
        toast({ title: "Update failed", description: e.message, variant: "destructive" });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto min-h-screen overflow-hidden grid lg:grid-cols-2">
      {/* ================= LEFT SIDE ================= */}
      <div className="p-10 md:p-14 flex flex-col">
        {/* Logo */}
        <div className="mb-12">
          <h1 className="text-2xl font-semibold text-[#3d2f4d]">
            <Link href="/">Pentasent</Link>
          </h1>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-light text-[#3c2a34] mb-4">
          {stage === 'request' && "Reset Password"}
          {stage === 'verify' && "Verify Reset Code"}
          {stage === 'reset' && "Set New Password"}
        </h2>

        <p className="text-gray-500 mb-8 leading-relaxed">
          {stage === 'request' && (user ? "Confirm your email to receive a secure reset code." : "Enter your registered email to receive a secure reset code.")}
          {stage === 'verify' && `Please enter the 6-digit code sent to ${email}`}
          {stage === 'reset' && "Create a strong new password for your account."}
        </p>

        <div className="space-y-6">
          {stage === 'request' && (
            <>
              {user ? (
                <div className="bg-[#fdf8fa] border border-pink-100 rounded-xl p-5 mb-2">
                  <p className="text-[#3d2f4d] font-semibold mb-1 truncate">{user.email}</p>
                </div>
              ) : (
                <div className="relative group">
                  <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={timer > 0}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#e8d4df]"
                  />
                </div>
              )}
              <button
                onClick={handleSendOTP}
                disabled={loading || timer > 0}
                className="w-full h-[56px] rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : timer > 0 ? `Resend in ${formatTime(timer)}` : "Send Reset Code"}
              </button>
            </>
          )}

          {stage === 'verify' && (
            <>
              <div className="flex gap-2 justify-center mb-4">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { inputRefs.current[idx] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-2xl font-semibold border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-[#e8d4df]"
                  />
                ))}
              </div>
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.join('').length !== 6}
                className="w-full h-[56px] rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Continue"}
              </button>
              <button onClick={() => setStage('request')} className="w-full text-sm text-gray-500 hover:text-[#3d2f4d]">
                Back to email
              </button>
            </>
          )}

          {stage === 'reset' && (
            <>
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#e8d4df]"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-[#e8d4df]"
              />
              <button
                onClick={handleUpdatePassword}
                disabled={loading}
                className="w-full h-[56px] rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-70"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
              </button>
            </>
          )}

          {(stage === 'verify' || stage === 'reset') && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3 mt-4">
              <AlertCircle className="w-4 h-4 mt-0.5 text-amber-600" />
              {/* <span className="text-amber-600 mt-0.5">⚠️</span> */}
              <p className="text-amber-800 text-sm italic">
                {stage === 'verify' ? "Please don't refresh the page while verifying the code." : "Please don't refresh the page while updating your password."}
              </p>
            </div>
          )}

          {stage === 'request' && (
            <div className="flex items-center justify-between text-sm mt-8">
              <Link href="/signin" className="inline-flex items-center text-gray-400 hover:text-[#3d2f4d]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ================= RIGHT SIDE ================= */}
      <div className="hidden lg:flex relative bg-[#4b2a3f] text-white p-14 items-center justify-center overflow-hidden">

        {/* Gradient layer */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#4b2a3f] via-[#5a324a] to-[#3d2235]" />

        {/* Soft glow blobs */}
        <div className="absolute -top-32 -left-32 w-[420px] h-[420px] bg-pink-400/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-[420px] h-[420px] bg-purple-400/20 rounded-full blur-[140px]" />

        {/* Pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 20%, white 1px, transparent 1px),
              radial-gradient(circle at 80% 80%, white 1px, transparent 1px)
            `,
            backgroundSize: "120px 120px",
          }}
        />

        <div className="relative z-10 text-center max-w-md">
          <h3 className="text-3xl font-light mb-6">
            Secure your journey.
          </h3>

          <p className="text-white/80 mb-10">
           &quot;True wellness isn&apos;t just about your rituals, it&apos;s about ensuring your journey is protected every step of the way.&quot;
          </p>

          {/* ================= MOBILE MOCKUPS ================= */}
          <div className="relative h-[220px] hidden lg:block">

            {/* Back Phone */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: -6 }}
              whileInView={{ opacity: 1, x: 0, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='absolute right-[140px] top-0 inset-[8px] w-[330px] h-[560px] mx-auto -rotate-[6deg]'>
              <Image
                alt="Pentasent Welcome"
                src="/images/splashscreen.svg"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 6 }}
              whileInView={{ opacity: 1, x: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='absolute -right-[150px] top-10 inset-[8px] w-[330px] h-[560px] mx-auto rotate-[6deg]'>
              <Image
                alt="Pentasent Community"
                src="/images/community.svg"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
