"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    LayoutDashboard,
    Headphones,
    Users,
    Flower2,
    Activity,
    CheckSquare,
    BookOpen,
    ShoppingBag,
    X,
    Crown,
    Bell,
    Brain,
    Book,
    PenBox,
    User,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/contexts/AuthContext";

const sidebarItems = [
    { name: "Feed", href: "/app/feed", icon: LayoutDashboard  },
    { name: "Beats", href: "/app/beats", icon: Headphones },
    { name: "Community", href: "/app/community", icon: Users },
    { name: "Meditation", href: "/app/meditation", icon: Brain },
    { name: "Yoga", href: "/app/yoga", icon: Activity },
    { name: "Tasks", href: "/app/tasks", icon: CheckSquare },
    { name: "Journal", href: "/app/journal", icon: PenBox },
    { name: "Products", href: "/app/products", icon: ShoppingBag },
];

export function Sidebar({
    mobileOpen,
    setMobileOpen,
}: {
    mobileOpen: boolean;
    setMobileOpen: (isOpen: boolean) => void;
}) {
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);
    const [showDownload, setShowDownload] = useState(false);
    const { user } = useAuth();

    // The sidebar is logically open if it's open on mobile OR hovered on desktop
    const isOpen = mobileOpen || isHovered;

    /* -----------------------------
   Delay Download Card 2 seconds
------------------------------*/
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (isOpen) {
            timer = setTimeout(() => {
                setShowDownload(true);
            }, 1000); // 2 seconds delay
        } else {
            setShowDownload(false);
        }

        return () => clearTimeout(timer);
    }, [isOpen]);

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? 280 : 80,
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={cn(
                    "fixed inset-y-0 left-0 z-50 flex flex-col bg-warm-50 transition-all duration-300 ease-in-out h-screen",
                    // On mobile, completely translate it off-screen when hidden
                    !mobileOpen ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
                )}
            >
                {/* Header */}
                <div className="flex h-16 xl:mt-4 mt-1 shrink-0 items-center justify-between px-6">
                    <Link href="/app/feed" className="flex items-center gap-3 overflow-hidden" onClick={() => setMobileOpen(false)}>
                        <Image src="/images/penta_logo.svg" alt="Logo" width={30} height={30} className="rounded-lg" />
                        <motion.span
                            animate={{ opacity: isOpen ? 1 : 0 }}
                            initial={false}
                            className="text-xl font-bold font-serif whitespace-nowrap text-[#3c2a34]"
                        >
                            Pentasent
                        </motion.span>
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden shrink-0 bg-[#F8F2EE] p-2 rounded-full"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X className="h-5 w-5 text-[#3c2a34]" />
                    </Button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto no-scrollbar py-4 space-y-2">
                    {(user ? [...sidebarItems, { name: "Profile", href: "/app/profile", icon: User }] : sidebarItems).map((item) => {
                        const isActive = pathname === item.href || (pathname === "/" && item.href === "/app");
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-7 py-3 text-sm font-medium transition-colors relative overflow-hidden group",
                                    isActive
                                        ? "text-[#3D253B]"
                                        : "text-warm-500 hover:bg-[#F8F2EE] hover:text-[#3D253B]"
                                )}
                                title={!isOpen ? item.name : undefined}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav-item"
                                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#3D253B] rounded-r-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}
                                <item.icon
                                    className={cn(
                                        "h-5 w-5 shrink-0 transition-transform group-hover:scale-110",
                                        isActive ? "text-[#3D253B]" : "text-warm-500 group-hover:text-[#3D253B]"
                                    )}
                                />
                                <motion.span
                                    animate={{ opacity: isOpen ? 1 : 0 }}
                                    initial={false}
                                    className="whitespace-nowrap flex-1"
                                >
                                    {item.name}
                                </motion.span>

                                {item.name === "Community" && (
                                    <div className="relative flex items-center justify-center ml-auto">

                                        {/* Pulse Background */}
                                        <motion.span
                                            className="absolute w-3 h-3 rounded-full bg-red-900 opacity-40"
                                            animate={{ scale: [1, 1.8, 1.8], opacity: [0.6, 0.2, 0] }}
                                            transition={{
                                                duration: 1.8,
                                                repeat: Infinity,
                                                ease: "easeOut",
                                            }}
                                        />

                                        {/* Solid Dot */}
                                        <span className="relative w-3 h-3 rounded-full bg-red-900" />
                                    </div>
                                )}

                                {item.name === "Profile" && (
                                    <div className="flex items-center gap-4 min-w-fit pl-4">
                                        {/* <Button variant="ghost" size="icon" className="rounded-full bg-[#F8F2EE] border border-border/40 relative h-10 w-10 shrink-0">
                                            <Bell className="h-4 w-4 text-foreground" />
                                            <span className="absolute top-[8px] right-[8px] w-2 h-2 bg-red-900 rounded-full border-2 border-[#F8F2EE]" />
                                        </Button> */}
                                        <div className="flex items-center gap-2 cursor-pointer rounded-full shrink-0">
                                            <Avatar className="h-8 w-8 border border-border/40 shrink-0">
                                                <AvatarImage src={user?.avatar_url || "https://i.pravatar.cc/150?u=a042581f4e29026024e"} alt="User" />
                                                <AvatarFallback>{user?.name?.charAt(0)?.toUpperCase() || "U"}</AvatarFallback>
                                            </Avatar>
                                        </div>
                                    </div>
                                )}
                            </Link>
                        );
                    })}
                </div>

                {/* Download App Card */}
                {showDownload && (
                    <div className="p-4 mt-auto">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.4 }}
                        // animate={{
                        //     opacity: isOpen ? 1 : 0,
                        //     height: isOpen ? "auto" : 0,
                        // }}
                        // initial={false}
                        // className="overflow-hidden"
                        >
                            <div className="rounded-2xl bg-[#3D253B] p-5 text-white relative overflow-hidden group hover:shadow-lg transition-all border border-white/10">
                                {/* Decorative gradients */}
                                <div className="absolute top-0 right-0 -tralate-y-4 translate-x-4 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:bg-white/15 transition-all duration-500" />
                                <div className="absolute bottom-0 left-0 translate-y-4 -translate-x-4 w-16 h-16 bg-white/20 rounded-full blur-xl group-hover:bg-white/115transition-all duration-500" />

                                <div className="relative z-10 flex flex-col gap-3">
                                    <div className="flex items-center justify-between">
                                        <Crown className="h-6 w-6 text-white mb-1 opacity-80" />
                                        <Image src="/images/play_award.svg" alt="Logo" width={65} height={65} className="" />
                                    </div>
                                    <h4 className="font-medium text-lg leading-tight tracking-tight">
                                        Get Pentasent App Now
                                    </h4>
                                    <div className="bg-white/20 hover:bg-[#2d1f3d] text-white px-6 py-3 rounded-lg flex items-center justify-center gap-3 cursor-pointer transition-colors w-fit sm:w-auto">
                                        <div className="text-md">
                                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                                                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[10px]">GET IT ON</p>
                                            <p className="font-semibold text-[12px]">Google Play (Now)</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.aside>
        </>
    );
}
