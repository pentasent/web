"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertTriangle, ShieldX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type PageState = "loading" | "ready" | "expired" | "invalid" | "success";

export default function ResetPasswordPage() {
  const [pageState, setPageState] = useState<PageState>("loading");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const passwordsMatch = newPassword.length >= 6 && newPassword === confirmPassword;
  const hasProcessed = useRef(false);

  useEffect(() => {
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setPageState("ready");
      }
    });

    const verify = async () => {
      try {
        // 1. Immediate check for existing session
        const { data: { session: existingSession } } = await supabase.auth.getSession();
        if (existingSession) {
          setPageState("ready");
          subscription.unsubscribe();
          return;
        }

        // 2. Extract tokens and perform manual setSession
        const hash = window.location.hash.substring(1);
        const search = window.location.search.substring(1);
        const params = new URLSearchParams(hash || search);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (accessToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          });

          if (!error && data?.session) {
            setPageState("ready");
            subscription.unsubscribe();
            return;
          }
        }

        // 3. Final safety check
        setTimeout(async () => {
          if (pageState === "loading") {
            const { data: { session: lastCheck } } = await supabase.auth.getSession();
            if (lastCheck) {
              setPageState("ready");
            } else if (!accessToken) {
              setPageState("invalid");
            }
            subscription.unsubscribe();
          }
        }, 2000);

      } catch (err) {
        console.error("Verification failed:", err);
      }
    };

    verify();
    return () => subscription.unsubscribe();
  }, [pageState]);

  const handleResetPassword = async () => {
    if (!passwordsMatch) return;

    setSaving(true);
    try {
      const result = await Promise.race([
        supabase.auth.updateUser({ password: newPassword }),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error("Request timed out. Please try again.")), 30000)
        )
      ]);

      if (result.error) throw result.error;

      setPageState("success");
      setTimeout(() => router.push("/beta-release"), 3000);
    } catch (e: any) {
      toast({
        title: "Update Failed",
        description: e.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/60 to-white flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-semibold text-[#3d2f4d]">
            Pentasent
          </Link>
        </div>

        {/* ===== LOADING STATE ===== */}
        {pageState === "loading" && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-[#3d2f4d] mx-auto mb-4" />
            <p className="text-gray-500">Verifying your reset link...</p>
          </div>
        )}

        {/* ===== INVALID / 404 STATE ===== */}
        {pageState === "invalid" && (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <ShieldX className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-2xl font-semibold text-[#3c2a34] mb-3">Invalid Link</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/signin"
              className="inline-flex w-full py-3.5 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition justify-center"
            >
              Back to Sign In
            </Link>
          </div>
        )}

        {/* ===== EXPIRED STATE ===== */}
        {pageState === "expired" && (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-semibold text-[#3c2a34] mb-3">Link Expired</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              This password reset link has expired. Please request a new one.
            </p>
            <Link
              href="/signin"
              className="inline-flex w-full py-3.5 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition justify-center"
            >
              Back to Sign In
            </Link>
          </div>
        )}

        {/* ===== READY — PASSWORD FORM ===== */}
        {pageState === "ready" && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-[#3c2a34] mb-2">Set New Password</h2>
            <p className="text-gray-500 mb-8 text-sm leading-relaxed">
              Enter your new password below. It must be at least 6 characters long.
            </p>

            <div className="space-y-4">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-100 focus:border-[#3d2f4d] focus:ring-1 focus:ring-[#3d2f4d] outline-none transition bg-gray-50/50"
                  autoFocus
                />
                <button
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  type="button"
                >
                  {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-100 focus:border-[#3d2f4d] focus:ring-1 focus:ring-[#3d2f4d] outline-none transition bg-gray-50/50"
                />
                <button
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  type="button"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              onClick={handleResetPassword}
              disabled={!passwordsMatch || saving}
              className="w-full py-4 rounded-xl bg-[#3d2f4d] text-white font-semibold hover:bg-[#2d1f3d] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 shadow-lg shadow-[#3d2f4d]/20 active:scale-[0.98]"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                "Save Password"
              )}
            </button>
          </div>
        )}

        {/* ===== SUCCESS STATE ===== */}
        {pageState === "success" && (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#3c2a34] mb-3">Password Changed!</h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              Your password has been updated successfully. Taking you to your dashboard...
            </p>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-green-500"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2.5 }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
