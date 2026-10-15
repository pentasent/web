"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Lock, RefreshCcw, ShieldAlert } from "lucide-react";
import { BotWarningProps } from "@/types/bot";
import { Button } from "../ui/button";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";

export default function BotWarning({ title, visibility, buttons }: BotWarningProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (visibility !== undefined) {
            setIsVisible(visibility);
            return;
        }

        const checkForBot = () => {
            const isBot =
                /bot|crawler|spider|crawling/i.test(navigator.userAgent) ||
                !navigator.webdriver === undefined ||
                document.documentElement.getAttribute("webdriver") !== null ||
                navigator.languages === undefined ||
                navigator.languages.length === 0;

            setIsVisible(isBot);
        };

        checkForBot();
    }, []);

    if (!isVisible) return null;

    return (
        <Dialog open={visibility}>
        <DialogContent className="sm:max-w-125 px-0 bg-transparent outline-none border-none shadow-none" hidden={true}>
          <DialogTitle className="px-4 text-[22px] leading-[1.2] font-medium z-20"></DialogTitle>
                <div className="p-8 overflow-hidden fixed inset-0 z-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg fixed">
                        {/* Animated Background Pattern */}
                        <div className="absolute inset-0 -z-10 opacity-5">
                            {/* <div className="absolute inset-0 -z-10 opacity-5"> */}
                            <motion.div
                                initial={{ rotate: 0 }}
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0"
                            >
                                {[...Array(6)].map((_, i) => (
                                    <Lock
                                        suppressHydrationWarning
                                        key={i}
                                        className="absolute text-red-500"
                                        style={{
                                            top: `${Math.random() * 100}%`,
                                            left: `${Math.random() * 100}%`,
                                            fontSize: `${Math.random() * 20 + 10}px`,
                                        }}
                                    />
                                ))}
                            </motion.div>
                        </div>

                        {/* Alert Icon */}
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="flex justify-center mb-6"
                        >
                            <div className="relative">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        repeatType: "reverse"
                                    }}
                                    className="absolute inset-0 bg-red-500/20 rounded-full"
                                />
                                <div className="relative bg-red-100 p-4 rounded-full">
                                    <ShieldAlert className="h-12 w-12 text-red-500" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Content */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-center space-y-6"
                        >
                            <h2 className="text-2xl font-bold text-gray-900">Access Restricted</h2>
                            <p className="text-gray-600">{title || "Automated access to this portfolio is not permitted. Please use a regular web browser."}</p>
                            <p className="text-gray-600">💝 Have a great day!!</p>
                            
                            {
                                buttons && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.6, duration: 0.5 }}
                                        className="pt-4 flex flex-col sm:flex-row gap-4 justify-center"
                                    >
                                        <Button render={<Link href="/" />} size="lg" className="gap-2">
                                             <Home className="w-4 h-4" />
                                            Back to Home
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="lg"
                                            className="gap-2"
                                            onClick={() => window.location.reload()}
                                        >
                                            <RefreshCcw className="w-4 h-4" />
                                            Reload Page
                                        </Button>
                                    </motion.div>
                                )
                            }
                        </motion.div>

                        {/* Animated Border */}
                        <svg
                            className="absolute inset-0 w-full h-full rounded-lg pointer-events-none"
                            style={{ transform: "rotate(180deg)" }}
                        >
                            <rect
                                x="0"
                                y="0"
                                width="100%"
                                height="100%"
                                fill="none"
                                stroke="rgba(239, 68, 68, 0.5)"
                                strokeWidth="2"
                                strokeDasharray="8 8"
                            />
                        </svg>
                    </div>
                </div>
        </DialogContent>
      </Dialog>
    );
}