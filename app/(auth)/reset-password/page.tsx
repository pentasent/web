"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Eye, EyeOff, Lock, Loader2, CheckCircle, AlertTriangle, ShieldX } from "lucide-react";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const processRecoveryToken = async () => {
      try {
        // Parse hash fragment from Supabase recovery redirect
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        const type = params.get("type");

        // If we don't have a recovery token, check if we're already in a recovery session
        if (type !== "recovery" || !accessToken) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // We already have a session, maybe from a previous redirect
            setPageState("ready");
          } else {
            console.warn("No recovery token or active session found");
            setPageState("invalid");
          }
          return;
        }

        // Establish session with recovery tokens
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (error) {
          console.error("setSession error:", error.message);
          setPageState("expired");
          return;
        }

        // verify session exists
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          console.error("No session after setSession");
          setPageState("expired");
          return;
        }

        // Clear the hash from URL but stay on the page
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Short delay to ensure state updates smoothly
        setTimeout(() => {
          setPageState("ready");
        }, 300);
      } catch (e) {
        console.error("Recovery token processing error:", e);
        setPageState("expired");
      }
    };

    processRecoveryToken();
  }, []);

  const handleResetPassword = async () => {
    if (!passwordsMatch) return;

    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        if (
          error.message.toLowerCase().includes("expired") ||
          error.message.toLowerCase().includes("session")
        ) {
          setPageState("expired");
          return;
        }
        throw error;
      }

      setPageState("success");

      // Sign out so they log in fresh with new password
      // setTimeout(async () => {
      //   await supabase.auth.signOut();
      // }, 3000);
      setTimeout(async () => {
  await supabase.auth.signOut();
  router.push("/signin");
}, 2500);
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to reset password. Please try again.",
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
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
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
            <h2 className="text-2xl font-semibold text-[#3c2a34] mb-3">
              Invalid Link
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              This password reset link is invalid or missing. Please request a new one from the sign in page.
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
            <h2 className="text-2xl font-semibold text-[#3c2a34] mb-3">
              Link Expired
            </h2>
            <p className="text-gray-500 mb-6 leading-relaxed">
              This password reset link has expired or has already been used. Please request a new reset link.
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
            <h2 className="text-2xl font-semibold text-[#3c2a34] mb-2">
              Set New Password
            </h2>
            <p className="text-gray-500 mb-6 text-sm leading-relaxed">
              Enter your new password below. It must be at least 6 characters long.
            </p>

            {/* New Password */}
            <div className="relative mb-4">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type={showNewPassword ? "text" : "password"}
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-[#e8d4df] outline-none transition"
                autoFocus
              />
              {showNewPassword ? (
                <EyeOff onClick={() => setShowNewPassword(false)} className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer" />
              ) : (
                <Eye onClick={() => setShowNewPassword(true)} className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer" />
              )}
            </div>
            {newPassword.length > 0 && newPassword.length < 6 && (
              <p className="text-red-500 text-xs mb-3 -mt-2 pl-1">Password must be at least 6 characters</p>
            )}

            {/* Confirm Password */}
            <div className="relative mb-2">
              <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && passwordsMatch && handleResetPassword()}
                className={`w-full pl-12 pr-12 py-4 rounded-xl border ${confirmPassword && !passwordsMatch ? "border-red-400" : "border-gray-200"} focus:ring-2 focus:ring-[#e8d4df] outline-none transition`}
              />
              {showConfirmPassword ? (
                <EyeOff onClick={() => setShowConfirmPassword(false)} className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer" />
              ) : (
                <Eye onClick={() => setShowConfirmPassword(true)} className="absolute right-4 top-4 w-5 h-5 text-gray-400 cursor-pointer" />
              )}
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-red-500 text-xs mb-4 pl-1">Passwords do not match</p>
            )}
            {passwordsMatch && (
              <p className="text-green-600 text-xs mb-4 pl-1 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Passwords match
              </p>
            )}

            <button
              onClick={handleResetPassword}
              disabled={saving || !passwordsMatch}
              className="w-full py-3.5 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-60 mt-2"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save New Password"}
            </button>
          </div>
        )}

        {/* ===== SUCCESS STATE ===== */}
        {pageState === "success" && (
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-[#3c2a34] mb-3">
              Password Updated!
            </h2>
            <p className="text-gray-500 mb-3 leading-relaxed">
              Your password has been reset successfully.
            </p>

            <p className="text-sm text-gray-400 mb-6">
              Redirecting you to sign in...
            </p>
            <Link
              href="/signin"
              className="inline-flex w-full py-3.5 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition justify-center"
            >
              Sign In
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
