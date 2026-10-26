"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Shield, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
    { icon: Wifi, title: "Works offline", description: "Use the app even without internet" },
    { icon: Shield, title: "Secure & fast", description: "Enhanced security and performance" }
];

export default function PWANotification() {
    const [isVisible, setIsVisible] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        console.log("🔍 Checking PWA status...");

        const isPWAInstalled =
            window.matchMedia("(display-mode: standalone)").matches ||
            (window.navigator as any).standalone;

        console.log("📌 Is PWA installed?", isPWAInstalled);

        if (isPWAInstalled) {
            setIsVisible(false);
            return;
        }

        // Capture beforeinstallprompt event
        const handleBeforeInstallPrompt = (event: any) => {
            console.log("✅ `beforeinstallprompt` event fired!");
            event.preventDefault();
            setDeferredPrompt(event);
            setTimeout(() => setIsVisible(true), 3000);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) {
            console.log("⚠️ No install prompt available!");
            return;
        }

        console.log("📢 Showing install prompt...");
        deferredPrompt.prompt();

        const { outcome } = await deferredPrompt.userChoice;
        console.log("👤 User choice:", outcome);

        if (outcome === "accepted") {
            console.log("🎉 PWA Installed!");
            setIsVisible(false);
            setDeferredPrompt(null);
        }
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-4 left-4 right-4 md:right-4 md:w-[400px] z-50">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="bg-white rounded-2xl shadow-2xl p-6"
                    >
                        <h2 className="text-xl font-semibold">Install App</h2>
                        <p className="text-gray-600 text-sm mb-4">
                            Get the best experience by installing our app on your device.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {features.map((feature, index) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 + index * 0.1 }}
                                    className="flex flex-col items-center text-center p-3 bg-gray-100 rounded-xl"
                                >
                                    <feature.icon className="w-6 h-6 text-blue-500 mb-2" />
                                    <h3 className="text-sm font-medium">{feature.title}</h3>
                                    <p className="text-xs text-gray-500">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsVisible(false)}>Maybe later</Button>
                            <Button onClick={handleInstallClick}>
                                <Download className="w-4 h-4 mr-2" />
                                Install now
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}