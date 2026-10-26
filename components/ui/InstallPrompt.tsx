"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Zap, Wifi, Sparkles } from "lucide-react";
import Image from "next/image";
import { useInstallPrompt } from "@/hooks/useInstallPrompt";
import { Button } from "@/components/ui/button";

export function InstallPrompt() {
  const { isInstallable, showPrompt, handleInstallClick } = useInstallPrompt();
  const [delayedShow, setDelayedShow] = useState(false);

  useEffect(() => {
    if (isInstallable && showPrompt) {
      const timer = setTimeout(() => setDelayedShow(true), 10000); // 3s delay
      return () => clearTimeout(timer); // Cleanup timeout on unmount
    }
  }, [isInstallable, showPrompt]);

  // if (!delayedShow) return null;
  if (!isInstallable || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-labelledby="install-prompt-title"
        aria-describedby="install-prompt-desc"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 25, scale: 0.96, transition: { duration: 0.2 } }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-60 pointer-events-auto"
      >
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-[#ded5cd]/80 dark:border-[#521c43] bg-[#fdfcfa]/95 dark:bg-[#2b0128]/95 backdrop-blur-xl shadow-[0_20px_50px_rgba(47,0,54,0.16)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.7)] p-4 sm:p-5 text-foreground">
          {/* Subtle brand glow in the background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-12 -right-12 h-36 w-36 rounded-full bg-linear-to-br from-[#bf3988]/15 via-[#4a0139]/10 to-transparent blur-2xl dark:from-[#bf3988]/25 dark:via-[#4a0139]/20"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 left-6 right-6 h-px bg-linear-to-r from-transparent via-[#4a0139]/15 dark:via-white/15 to-transparent"
          />

          {/* Header Row: Logo emblem, titles, and dismiss button */}
          <div className="relative flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-lg bg-linear-to-b from-[#f7f0eb] to-[#eeddd2] dark:from-[#4a0139] dark:to-[#35072a] border border-[#e8ded5] dark:border-[#5c234a] p-2 shadow-xs">
                <Image
                  src="/assets/images/logos/penta-icon-gradient.svg"
                  alt="Pentasent"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#4a0139]/8 dark:bg-white/10 text-[10.5px] font-semibold text-[#4a0139] dark:text-[#ffb533] tracking-wide mb-0.5">
                  <Sparkles className="w-2.5 h-2.5 text-[#ffad25]" />
                  <span>Pentasent App</span>
                </div>
                <h3
                  id="install-prompt-title"
                  className="text-[15px] sm:text-[16px] font-bold tracking-tight text-[#2f0036] dark:text-[#f2eeeb] truncate"
                >
                  Install Web App
                </h3>
              </div>
            </div>

            {/* Quick Dismiss button */}
            <button
              type="button"
              aria-label="Dismiss install prompt"
              onClick={() => handleInstallClick(true)}
              className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-[#6f6268] hover:text-[#2f0036] hover:bg-black/5 dark:text-[#cfc1b6] dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Description */}
          <p
            id="install-prompt-desc"
            className="relative mt-2.5 text-[12.5px] sm:text-[13px] leading-relaxed text-[#5f575d] dark:text-[#cfc1b6]"
          >
            Get instant home screen access, faster load times, and an uninterrupted offline experience.
          </p>

          {/* Feature Badges */}
          <div className="relative mt-3 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#4a0139] dark:text-[#f2eeeb]">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f4ece6] dark:bg-[#3d0932] border border-[#ebe1d7] dark:border-[#521c43]">
              <Zap className="w-3 h-3 text-[#ffad25]" />
              <span>Faster loading</span>
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#f4ece6] dark:bg-[#3d0932] border border-[#ebe1d7] dark:border-[#521c43]">
              <Wifi className="w-3 h-3 text-[#ffad25]" />
              <span>Offline ready</span>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="relative mt-4 flex items-center gap-2">
            <Button
              variant="default"
              onClick={() => handleInstallClick(false)}
              className="flex-1 h-11 rounded-full font-medium text-xs sm:text-sm bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm transition-all active:scale-[0.98] gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Install Now</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleInstallClick(true)}
              className="flex-1 h-11 rounded-full font-medium text-xs sm:text-sm border-[#ded5cd] dark:border-[#5b3a50] text-[#4a0139] dark:text-[#f2eeeb] hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}