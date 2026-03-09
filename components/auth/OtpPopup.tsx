'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { trackEvent } from "@/lib/analytics/track";
import { identifyUser } from "@/lib/analytics/identify";

export default function OtpPopup() {
    const { unverifiedEmail, setUnverifiedEmail, refreshUser } = useAuth();
    const { toast } = useToast();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [timer, setTimer] = useState(0);
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timer]);

    if (!unverifiedEmail) return null;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            toast({
                title: "Invalid code",
                description: "Please enter a valid 6-digit confirmation code.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email: decodeURIComponent(unverifiedEmail),
                token: otpString,
                type: 'signup',
            });

            if (error) throw error;

            toast({
                title: "Email verified!",
                description: "Email verified successfully!",
            });

            if (data?.user) {
                identifyUser(data.user.id, {
                    email: data.user.email
                });
                trackEvent("user_verified");
            }

            setUnverifiedEmail(null);
            // Wait for auth context to react to the new session
            await refreshUser();
        } catch (error: any) {
            toast({
                title: "Verification failed",
                description: error.message || 'Invalid code.',
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0 || resendLoading) return;

        setResendLoading(true);
        try {
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: decodeURIComponent(unverifiedEmail),
                options: {
                    emailRedirectTo: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
                }
            });
            if (error) throw error;
            setTimer(120); // 2 minutes
            toast({
                title: "Code sent",
                description: "A new code has been sent to your email.",
            });
        } catch (e: any) {
            toast({
                title: "Error",
                description: e.message || "Failed to resend code.",
                variant: "destructive",
            });
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8 relative flex flex-col items-center text-center"
                >
                    <button
                        onClick={() => setUnverifiedEmail(null)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-50 p-2 w-10 h-10 flex items-center justify-center rounded-full"
                    >
                        ✕
                    </button>

                    <h3 className="text-3xl font-semibold text-[#3d2f4d] mb-2">
                        Verify Email
                    </h3>

                    <p className="text-gray-500 mb-8 text-sm">
                        Please enter the 6-digit code sent to <br />
                        <span className="font-medium text-gray-800">{decodeURIComponent(unverifiedEmail)}</span>
                    </p>

                    <div className="flex gap-2 justify-center mb-8 w-full">
                        {otp.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => { inputRefs.current[idx] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                className="w-12 h-14 text-center text-2xl font-semibold border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#e8d4df] focus:border-[#e8d4df] outline-none transition"
                            />
                        ))}
                    </div>

                    <button
                        onClick={handleVerify}
                        disabled={loading || otp.join('').length !== 6}
                        className="w-full py-4 rounded-xl bg-[#3d2f4d] text-white font-medium hover:bg-[#2d1f3d] transition-all flex items-center justify-center disabled:opacity-70 mb-4"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Login"}
                    </button>

                    <button
                        onClick={handleResend}
                        disabled={timer > 0 || resendLoading}
                        className="text-sm text-gray-500 hover:text-[#3d2f4d] transition-colors disabled:opacity-50"
                    >
                        {resendLoading ? "Sending..." : timer > 0 ? `Resend again in ${formatTime(timer)}` : "Resend Code"}
                    </button>

                </motion.div>
            </div>
        </AnimatePresence>
    );
}
