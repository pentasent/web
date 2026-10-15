"use client"

import { useState } from 'react';
import { AtSign, Navigation, Play, Loader2 } from 'lucide-react';
import { motion } from "framer-motion";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoogleFonts } from '@/fonts';
import Image from 'next/image';
import { footerGroups, socialLinks } from '@/data/footer';
import { notify } from '@/components/ui/toast';
import { subscribeNewsletter } from '@/lib/api/newsletter';

export function DemoSection() {
    return (
        <section className="relative isolate overflow-hidden bg-[#222223] px-4 py-16 xs:px-6 sm:px-8 sm:py-20 lg:px-12 lg:py-24 text-white">

            {/* Base background */}
            <div className="absolute inset-0 z-0 bg-[linear-gradient(120deg,#19191c,#2b1729)]" />

            {/* Full-section background image */}
            <Image src="/assets/images/pages/landing/demo_bg.png" alt="" fill priority sizes="100vw" className="absolute inset-0 z-0 h-full w-full object-cover object-center opacity-70" />

            {/* Purple glow overlay */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(143,33,126,0.48),transparent_65%)]" />

            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 z-0 bg-secondary/35" />

            {/* Content */}
            <div className="relative z-10 mx-auto max-w-7xl text-center">

                <p className="mb-4 sm:mb-5 text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.28em] text-chart-4">PENTASENT intelligence</p>

                <h2 className="mx-auto max-w-200 text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.04] sm:leading-[1.02] tracking-[-1px] sm:tracking-[-2px] lg:tracking-[-2.6px]">
                    A smarter way to care for real life.
                </h2>

                <p className="mx-auto mt-5 sm:mt-7 max-w-130 text-[14px] xs:text-[15px] sm:text-[16px] leading-[1.65] sm:leading-[1.7] text-white/70">
                    Meet the people, and product behind a simpler healthcare experience.
                </p>

                <div className="mt-8 sm:mt-10 flex flex-col justify-center gap-3 sm:flex-row w-full max-w-xs sm:max-w-none mx-auto">

                    <a href="/company/contact" className="flex min-h-12 sm:min-h-14.5 items-center justify-center rounded-lg bg-chart-5 px-6 sm:px-8 text-[14px] sm:text-[15px] font-bold text-[#171318] transition-transform duration-300 hover:-translate-y-1">
                        Request a demo
                    </a>

                    <a href="/company/life" className="flex min-h-12 sm:min-h-14.5 items-center justify-center gap-3 rounded-lg border border-white/40 px-6 sm:px-8 text-[14px] sm:text-[15px] font-bold transition-colors duration-300 hover:border-chart-5 hover:bg-chart-5 hover:text-[#171318]">
                        <Play size={16} fill="currentColor" />Watch the story
                    </a>

                </div>
            </div>
        </section>
    )
}

export type FooterProps = {
    showDemo?: boolean;
};

export function Footer({ showDemo }: FooterProps = {}) {
    const pathname = usePathname();
    const normalizedPath = pathname ? pathname.replace(/\/$/, '') || '/' : '/';
    const isHomeOrAbout =
        normalizedPath === '/' ||
        normalizedPath === '/company/about' ||
        normalizedPath === '/about';

    const shouldShowDemo = showDemo !== undefined ? showDemo : isHomeOrAbout;
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = email.trim();
        if (!trimmed || !trimmed.includes('@')) {
            notify.error('Please enter a valid email address.');
            return;
        }

        setIsSubmitting(true);
        try {
            await subscribeNewsletter({
                email: trimmed,
                sourcePlatform: 'web',
                sourcePage: normalizedPath,
                consentSource: 'footer_newsletter',
            });
            notify.success('Subscribed!', 'Thank you for subscribing to Pentasent updates.');
            setEmail('');
        } catch (err: unknown) {
            const errorMsg = err instanceof Error ? err.message : 'Failed to subscribe. Please try again.';
            notify.error('Subscription failed', errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <footer className='bg-black w-full overflow-hidden max-w-full mx-auto'>

            {/* Demo Section (rendered dynamically on home or about pages) */}
            {shouldShowDemo && <DemoSection />}

            {/* Footer Section */}
            <section id="contact" className="overflow-hidden text-white">
                <div className={`mx-auto w-full px-4 xs:px-6 sm:px-8 bg-[#1e1e1f] lg:px-12 rounded-b-[32px] sm:rounded-b-[42px]`}>
                    {/* <div className={`mx-auto max-w-7xl px-4 xs:px-6 sm:px-8 bg-[#1e1e1f] lg:px-12 rounded-b-[32px] sm:rounded-b-[42px] ${!shouldShowDemo ? 'rounded-t-[32px] sm:rounded-t-[42px]' : ''}`}> */}
                    <div className="grid max-w-7xl mx-auto gap-10 sm:gap-12 border-b border-white/10 py-12 sm:py-16 grid-cols-2 lg:grid-cols-4 lg:gap-16 xl:gap-24 lg:py-20">
                        {footerGroups.map((group) => (
                            <div key={group.title}>
                                <h3 className="text-[12px] font-bold uppercase tracking-[0.18em] text-white/40">{group.title}</h3>
                                <ul className="mt-4 sm:mt-6 space-y-3.5 sm:space-y-4">
                                    {group.links.map((link) => (
                                         <li key={link.label}>
                                            <a href={link.link} className="text-[15px] sm:text-[16px] text-white/85 transition-colors hover:text-chart-7">
                                                {link.label}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <div className="flex flex-col max-w-7xl mx-auto gap-6 sm:gap-7 border-b border-white/10 py-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <h2 className="max-w-2xl text-[24px] xs:text-[28px] sm:text-[34px] lg:text-[38px] font-medium leading-[1.1] sm:leading-[1.08] tracking-[-1px] sm:tracking-[-1.4px]">
                                Subscribe to stay updated with Pentasent News, Events
                            </h2>
                        </div>
                        <div className="flex flex-col w-full max-w-md lg:max-w-105 gap-2">
                            <form
                                className="flex w-full items-center rounded-xl bg-white p-1.5 shadow-sm border border-transparent focus-within:ring-2 focus-within:ring-chart-4/60 transition-all duration-200"
                                onSubmit={handleSubscribe}
                            >
                                <input
                                    aria-label="Email address"
                                    type="email"
                                    placeholder="Enter your email address..."
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    disabled={isSubmitting}
                                    className="h-10 min-w-0 flex-1 bg-transparent px-3.5 text-[14px] sm:text-[15px] text-[#171717] placeholder:text-[#7f787b] outline-none disabled:opacity-60"
                                />
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="h-10 shrink-0 cursor-pointer rounded-lg bg-chart-3 px-4 sm:px-5 text-[12px] sm:text-[13px] font-semibold tracking-wide text-[#171318] transition-all duration-200 hover:bg-chart-6 active:scale-97 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1.5"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                            <span>Subscribing...</span>
                                        </>
                                    ) : (
                                        <span>Subscribe</span>
                                    )}
                                </button>
                            </form>
                            <p className="text-[12px] text-white/50 text-right pr-1">
                                Already subscribed?{' '}
                                <Link href="/newsletter/manage" className="text-chart-4 hover:underline font-medium">
                                    Manage preferences
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div className="flex flex-col max-w-7xl mx-auto gap-6 py-8 sm:py-10 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3 text-white/70">
                            {socialLinks.map((link, index) => (
                                <Link key={index} href={link.link} aria-label="Social media" className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-chart-7 hover:text-[#111214]">
                                    <Image src={link.icon} alt={link.name} width={20} height={20} className='object-contain' />
                                </Link>
                            ))}
                        </div>
                        <div className="flex-wrap hidden sm:flex items-center gap-3 sm:gap-4 text-[13px] sm:text-[14px] font-semibold text-white/85">
                            <Link href="mailto:hello@pentasent.com" className="rounded-full group flex items-center gap-2 border border-white/25 px-3.5 sm:px-4 py-1.5 sm:py-2 transition-colors hover:border-chart-7 hover:text-chart-7">
                                <AtSign size={18} className="text-white/50 group-hover:text-chart-4 transition-colors shrink-0" />
                                <span>hello@pentasent.com</span>
                            </Link>
                            <Link href="#" className="rounded-full group flex items-center gap-2 border border-white/25 px-3.5 sm:px-4 py-1.5 sm:py-2 transition-colors hover:border-chart-7 hover:text-chart-7 text-xs sm:text-[14px]">
                                <Navigation size={18} className="text-white/50 group-hover:text-chart-4 transition-colors shrink-0" />
                                <span>1401, 2nd floor, London, United Kingdom</span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Effects and Copyright Section */}
                <div className="relative w-full max-w-7xl mx-auto overflow-hidden py-4 sm:py-8">
                    <motion.div
                        initial={{
                            opacity: 0,
                            y: 35,
                        }}
                        whileInView={{
                            opacity: 1,
                            y: 0,
                        }}
                        viewport={{
                            once: true,
                            amount: 0.2,
                        }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        className="relative h-[20vw] sm:h-[22vw] min-h-24 sm:min-h-32 max-h-56 w-full overflow-hidden"
                    >
                        <div
                            className="
                                absolute
                                left-1/2
                                top-1/2
                                w-max
                                -translate-x-1/2
                                -translate-y-1/2
                                whitespace-nowrap
                                text-center
                                text-[18vw]
                                font-black
                                leading-[0.72]
                                tracking-[-0.08em]
                                text-white/[0.07]
                                select-none
                            "
                        >
                            PENTASENT

                            {/* Bottom fade / blend */}
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-x-0
                                    bottom-0
                                    h-[38%]
                                    bg-linear-to-t
                                    from-black
                                    via-black/80
                                    to-transparent
                                "
                            />
                        </div>
                    </motion.div>

                    <div className="py-4 sm:py-6 text-center text-[13px] sm:text-[14px] text-white/80">
                        © {new Date().getFullYear()}{" "}
                        <span className={GoogleFonts.sanchez.className}>
                            PENTASENT
                        </span>
                        . All rights reserved.
                    </div>
                </div>
            </section>
        </footer>
    );
}

export default Footer;