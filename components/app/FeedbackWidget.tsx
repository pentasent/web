'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ThumbsUp, ThumbsDown, Send, X, Loader2 } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userIp, setUserIp] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    rating: 'liked' as 'liked' | 'disliked' | null,
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    // Attempt to get IP
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(() => console.log("Could not fetch IP"));
  }, []);

  const getMetadata = () => {
    const ua = window.navigator.userAgent;
    let browser = "Other";
    let os = "Other";

    if (ua.includes("Chrome")) browser = "Chrome";
    else if (ua.includes("Firefox")) browser = "Firefox";
    else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";
    else if (ua.includes("Edg")) browser = "Edge";

    if (ua.includes("Windows")) os = "Windows";
    else if (ua.includes("Mac OS")) os = "MacOS";
    else if (ua.includes("Linux")) os = "Linux";
    else if (ua.includes("Android")) os = "Android";
    else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";

    return {
      browser,
      os,
      app_version: "1.0.1",
      user_ip: userIp,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      language: window.navigator.language
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) {
      toast({
        title: "Missing fields",
        description: "Please provide your name and message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const metadata = getMetadata();
      const page_url = typeof window !== 'undefined' ? window.location.href : '';

      const { error } = await supabase.from('feedback').insert([
        {
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email || user?.email || null,
          message: formData.message,
          rating: formData.rating,
          page_url: page_url,
          source: 'web',
          metadata: metadata,
          status: 'new',
        }
      ]);

      if (error) throw error;

      const { trackEvent } = await import('@/lib/analytics/track');
      trackEvent('feedback_submitted', {
        rating: formData.rating,
        page_url: page_url,
        is_authenticated: !!user,
      });

      toast({
        title: "Feedback sent!",
        description: "Thank you for helping us improve.",
      });

      setIsOpen(false);
      setFormData(prev => ({
        ...prev,
        message: '',
        rating: null,
      }));
    } catch (error: any) {
      console.error("Feedback submission error:", error);
      toast({
        title: "Submission failed",
        description: error.message || "Failed to send feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Feedback Notch */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 100 }}
        className="fixed right-0 top-[40%] -translate-y-1/2 z-[50]"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center bg-warm-100 dark:bg-zinc-900 border-l border-y border-warm-300 dark:border-zinc-800 rounded-l-2xl py-5 px-3 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] transition-all duration-300 hover:pr-5 active:scale-95"
        >
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              <MessageSquare className="w-5 h-5 text-warm-700 dark:text-warm-100 group-hover:scale-110 transition-transform" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-warm-700 dark:bg-warm-100 rounded-full animate-pulse" />
            </div>
            <span className="[writing-mode:vertical-lr] text-[10px] uppercase font-bold tracking-[0.2em] text-warm-500 group-hover:text-warm-700 dark:group-hover:text-warm-100 transition-colors">
              Feedback
            </span>
          </div>
        </button>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[100vw] sm:max-w-[480px] w-full h-full sm:h-auto bg-white border-warm-200 shadow-[24px_24px_80px_-16px_rgba(0,0,0,0.15)] rounded-none sm:rounded-[2rem] p-0 overflow-hidden border-none flex flex-col sm:max-h-[90vh] [&>button]:hidden">
          <div className="h-1.5 w-full bg-gradient-to-r from-warm-200 via-warm-700 to-warm-200 shrink-0" />
          
          <div className="flex-1 overflow-y-auto post-scroll scrollbar-hide snap-x snap-mandatory p-6 sm:px-10">
            <DialogHeader className="mb-8">
              <div className="w-14 h-14 bg-warm-50 rounded-2xl flex items-center justify-center mb-5 shadow-inner border border-warm-100">
                <MessageSquare className="w-7 h-7 text-warm-700" />
              </div>
              <DialogTitle className="text-2xl sm:text-3xl font-serif text-warm-700 tracking-tight leading-tight">Your Feedback Matters</DialogTitle>
              <DialogDescription className="text-warm-500 text-base mt-2">
                Help us build a better Pentasent. Tell us what&apos;s working and what&apos;s not.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <Label htmlFor="fb-name" className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-400 ml-1">Full Name *</Label>
                  <Input
                    id="fb-name"
                    placeholder="Ankit"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-warm-50/50 border-warm-200 focus:border-warm-700 focus:ring-0 rounded-xl h-12 px-4 text-warm-700 transition-all shadow-sm"
                  />
                </div>
                <div className="space-y-2.5">
                  <Label htmlFor="fb-email" className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-400 ml-1">Email (Optional)</Label>
                  <Input
                    id="fb-email"
                    type="email"
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="bg-warm-50/50 border-warm-200 focus:border-warm-700 focus:ring-0 rounded-xl h-12 px-4 text-warm-700 transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-400 ml-1">How was your experience?</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: formData.rating === 'liked' ? null : 'liked' })}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all duration-300 ${
                      formData.rating === 'liked'
                        ? 'bg-warm-700 border-warm-700 text-white shadow-lg'
                        : 'bg-warm-50/50 border-warm-200 text-warm-500 hover:border-warm-400 shadow-sm'
                    }`}
                  >
                    <ThumbsUp className={`w-5 h-5 ${formData.rating === 'liked' ? 'animate-pulse' : ''}`} />
                    <span className="font-semibold text-sm">Love it</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: formData.rating === 'disliked' ? null : 'disliked' })}
                    className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl border transition-all duration-300 ${
                      formData.rating === 'disliked'
                        ? 'bg-zinc-800 border-zinc-800 text-white shadow-lg'
                        : 'bg-warm-50/50 border-warm-200 text-warm-500 hover:border-warm-400 shadow-sm'
                    }`}
                  >
                    <ThumbsDown className={`w-5 h-5 ${formData.rating === 'disliked' ? 'animate-pulse' : ''}`} />
                    <span className="font-semibold text-sm">Needs Improvement</span>
                  </button>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-end ml-1">
                  <Label htmlFor="fb-message" className="text-[10px] font-bold uppercase tracking-[0.1em] text-warm-400">Message *</Label>
                  <span className={`text-[10px] font-medium ${formData.message.length < 20 ? 'text-warm-400' : 'text-green-600'}`}>
                    {formData.message.length}/500 (min 20)
                  </span>
                </div>
                <Textarea
                  id="fb-message"
                  placeholder="What's on your mind? (Minimum 20 characters)"
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  maxLength={500}
                  required
                  className="bg-warm-50/50 border-warm-200 focus:border-warm-700 focus:ring-0 rounded-2xl h-32 px-4 py-3 text-warm-700 transition-all shadow-sm resize-none"
                />
              </div>

              <DialogFooter className="pt-4 pb-2 flex flex-col sm:flex-row-reverse gap-3">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.name.trim() || formData.message.length < 20}
                  className="w-full sm:flex-1 bg-warm-700 hover:bg-warm-800 text-warm-50 rounded-2xl h-14 text-base font-bold group shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:grayscale"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send
                      <Send className="ml-2 h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  className="w-full sm:flex-1 border-warm-200 text-warm-500 rounded-2xl h-14 text-base font-bold hover:bg-warm-50 transition-all"
                >
                  Cancel
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
