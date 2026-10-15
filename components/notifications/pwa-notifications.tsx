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



















// "use client";

// import { useEffect, useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { Download, X, Phone as DevicePhone, Shield, Wifi } from "lucide-react";
// import { Button } from "@/components/ui/button";

// const features = [
//     {
//         icon: Wifi,
//         title: "Works offline",
//         description: "Use the app even without internet"
//     },
//     {
//         icon: Shield,
//         title: "Secure & fast",
//         description: "Enhanced security and performance"
//     }
// ];

// export default function PWANotification() {
//     const [isVisible, setIsVisible] = useState(false);
//     const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

//     useEffect(() => {
//         const lastShown = localStorage.getItem("pwaPromptLastShown");
//         const today = new Date().toISOString().split("T")[0];


//         const isPWAInstalled =
//             window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone;

//         if (isPWAInstalled || lastShown === today) {
//             setIsVisible(false);
//             return;
//         }

//         setTimeout(() => {
//             setIsVisible(true);
//         }, 3000);
        
//         const handleBeforeInstallPrompt = (event: Event) => {
//             event.preventDefault();
//             setDeferredPrompt(event);
//             setTimeout(() => {
//                 setIsVisible(true);
//             }, 3000);
//         };

//         window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

//         return () => {
//             window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
//         };
//     }, []);

//     const handleInstallClick = async () => {
//         if (!deferredPrompt) return;

//         const promptEvent = deferredPrompt as any;
//         promptEvent.prompt();

//         const { outcome } = await promptEvent.userChoice;
//         if (outcome === "accepted") {
//             localStorage.setItem("pwaPromptLastShown", new Date().toISOString().split("T")[0]);
//             setIsVisible(false);
//         }
//     };

//     const handleClose = () => {
//         localStorage.setItem("pwaPromptLastShown", new Date().toISOString().split("T")[0]);
//         setIsVisible(false);
//     };

//     if (!isVisible) return null;

//     return (
//         <AnimatePresence>
//             {isVisible && (
//                 <div className="overflow-hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//                     <motion.div
//                         initial={{ opacity: 0, y: 50 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: 50 }}
//                         className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-[400px] z-50"
//                     >
//                         <motion.div
//                             className="bg-gray-50 rounded-2xl shadow-2xl p-6 relative overflow-hidden"
//                             initial={{ scale: 0.95 }}
//                             animate={{ scale: 1 }}
//                             transition={{ delay: 0.1 }}
//                         >
//                             {/* Background Pattern */}
//                             <div className="absolute inset-0 opacity-5">
//                                 <div className="absolute inset-0 bg-gradient-to-br bg-opacity-75 from-blue-500 to-purple-500" />
//                                 <div className="absolute inset-0" style={{
//                                     backgroundImage: "radial-gradient(circle at 2px 2px, black 1px, transparent 0)",
//                                     backgroundSize: "20px 20px"
//                                 }} />
//                             </div>

//                             {/* Content */}
//                             <div className="relative">
//                                 <div className="flex items-start space-x-4">
//                                     <div className="flex-1">
//                                         <h2 className="text-xl font-semibold text-gray-900 mb-2">
//                                             Install App
//                                         </h2>
//                                         <p className="text-gray-600 text-sm mb-4">
//                                             Get the best experience by installing our app on your device
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* Features */}
//                                 <div className="grid grid-cols-2 gap-4 mb-6">
//                                     {features.map((feature, index) => (
//                                         <motion.div
//                                             key={feature.title}
//                                             initial={{ opacity: 0, y: 20 }}
//                                             animate={{ opacity: 1, y: 0 }}
//                                             transition={{ delay: 0.2 + index * 0.1 }}
//                                             className="flex flex-col items-center text-center p-3 rounded-xl bg-gray-50"
//                                         >
//                                             <feature.icon className="w-6 h-6 text-blue-500 mb-2" />
//                                             <h3 className="text-sm font-medium text-gray-900 mb-1">
//                                                 {feature.title}
//                                             </h3>
//                                             <p className="text-xs text-gray-500">
//                                                 {feature.description}
//                                             </p>
//                                         </motion.div>
//                                     ))}
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="flex flex-col sm:flex-row gap-2">
//                                     <Button
//                                         onClick={handleClose}
//                                         variant="outline"
//                                         className="flex-1 "
//                                     >
//                                         Maybe later
//                                     </Button>
//                                     <Button
//                                         className="flex-1"
//                                         onClick={handleInstallClick}
//                                     >
//                                         <Download className="w-4 h-4 mr-2" />
//                                         Install now
//                                     </Button>
//                                 </div>
//                             </div>
//                         </motion.div>
//                     </motion.div>
//                 </div>
//             )}
//         </AnimatePresence>
//     );
// }