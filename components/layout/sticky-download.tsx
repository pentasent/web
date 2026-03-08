"use client"

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

export const StickyDownload = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !isDismissed) {
        setIsVisible(true);
      } else if (window.scrollY <= 300) {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4"
        >
          <div className="bg-gradient-to-r from-[#3d2f4d] to-[#2d1f3d] text-white rounded-2xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="relative p-6">
              <button
                onClick={handleDismiss}
                className="absolute cursor-pointer top-3 right-3 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
                aria-label="Dismiss notification"
              >
                <X size={16} />
              </button>

              <div className="flex flex-col sm:flex-row gap-4 w-fit sm:w-auto pr-8">
                <div className='flex items-center gap-4'>
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Download size={24} />
                  </div>

                  <div className="flex-1">
                    <div className="font-semibold text-lg mb-1">Get Pentasent</div>
                    <div className="text-sm text-white/90">Download now and start your wellness journey</div>
                  </div>
                </div>
                <a href='/beta-release'>
                {/* <a href='https://play.google.com/store/apps/details?id=com.pentasent.app'> */}
                <div className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg flex items-center gap-3 cursor-pointer transition-colors w-fit sm:w-auto">
                  <div className="text-md">
                    <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs">GET IT ON</p>
                    <p className="font-semibold text-sm">Google Play</p>
                  </div>
                </div>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
