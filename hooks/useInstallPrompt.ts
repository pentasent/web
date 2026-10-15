"use client";

import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);

      // Check if we should show the prompt
      const lastPrompt = localStorage.getItem('lastInstallPrompt');
      if (!lastPrompt || Date.now() - parseInt(lastPrompt) > 24 * 60 * 60 * 1000) {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isSafariStandalone = 'standalone' in window.navigator && (window.navigator as any).standalone === true;

      if (isStandalone || isSafariStandalone) {
        setIsInstallable(false);
        setShowPrompt(false);
      }
    };

    checkInstalled();
    window.addEventListener('appinstalled', checkInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', checkInstalled);
    };
  }, []);

  const handleInstallClick = async (shouldDismiss = false) => {
    if (shouldDismiss) {
      setShowPrompt(false);
      localStorage.setItem('lastInstallPrompt', Date.now().toString());
      return;
    }

    if (!deferredPrompt) return;

    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === 'accepted') {
      setIsInstallable(false);
    }

    setDeferredPrompt(null);
    localStorage.setItem('lastInstallPrompt', Date.now().toString());
    setShowPrompt(false);
  };

  return {
    isInstallable,
    showPrompt,
    handleInstallClick,
  };
}