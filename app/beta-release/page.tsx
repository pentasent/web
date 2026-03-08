'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Gift, ArrowRight, Mail, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const avatars = [
    "/images/users/user4.svg",
    "/images/users/user3.svg",
    "/images/users/user1.svg",
    "/images/users/user2.svg",
];

export default function BetaReleasePage() {
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!email.trim()) {
            toast({
                title: "Email required",
                description: "Please enter an email address.",
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            // Check session
            const { data: { user } } = await supabase.auth.getUser();

            // Check duplicate
            const { data: existing } = await supabase
                .from('newsletter')
                .select('id')
                .eq('email', email.trim())
                .single();

            if (existing) {
                toast({
                    title: "Waitlist entry exists",
                    description: "You are already on our waitlist!",
                    variant: "destructive",
                });
                setLoading(false);
                return;
            }

            // Insert new waitlist subscriber
            const { error } = await supabase.from('newsletter').insert({
                email: email.trim(),
                source: 'web-beta-release-page',
                status: 'subscribed',
                user_id: user?.id || null
            });

            if (error) throw error;

            toast({
                title: "Joined waitlist!",
                description: "You've been added to the beta waitlist!",
            });
            setSuccess(true);
            setEmail('');

            // Reset UI after 3 seconds
            setTimeout(() => setSuccess(false), 3000);

        } catch (error: any) {
            console.error('Waitlist error:', error);
            toast({
                title: "Failed to join",
                description: error.message || 'Failed to join waitlist. Please try again.',
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <main className="min-h-screen overflow-hidden bg-gradient-to-b from-pink-50 via-pink-50/50 to-white relative flex flex-col">
            {/* Background Blobs - matching home page */}
            <div className="absolute inset-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-pink-200 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
            </div>

            {/* Simple Navbar */}
            <nav className="relative z-50 w-full px-6 md:px-12 lg:px-20 py-6 md:flex md:justify-between md:items-center">

                {/* Logo always left */}
                <div
                    className="text-3xl font-light tracking-wide text-[#3d253b]"
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    <Link href="/">Pentasent</Link>
                </div>

                {/* Beta pill */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="
    mt-8 flex justify-center w-fit mx-auto
    md:mt-0 md:mx-0 md:inline-flex
    items-center gap-2 px-5 py-2.5
    rounded-full bg-pink-100/80 text-pink-800
    text-sm font-medium border border-pink-200
    shadow-sm backdrop-blur-sm
  "
                >
                    <Sparkles className="w-4 h-4 text-pink-600" />
                    <span>Private Beta Access</span>
                </motion.div>

            </nav>

            {/* Hero Content */}
            <div className="relative z-10  pb-12 flex-1 flex flex-col items-center justify-center px-6 md:px-12 text-center ">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.15] mb-6 text-[#3c2a34]" style={{ fontFamily: 'Georgia, serif' }}>
                        Pentasent is now in <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 font-normal">Private Beta.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        A new wellness platform for people navigating life&apos;s most transformative moments.
                        We&apos;re inviting a small group of early members to help shape the future of Pentasent.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                    className="w-full max-w-xl mx-auto"
                >
                    <form className="relative flex flex-col sm:block w-full group gap-3 sm:gap-0" onSubmit={handleSubmit}>
                        <div className="relative w-full">
                            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors z-10 pointer-events-none">
                                <Mail className="w-5 h-5" />
                            </div>
                            <input
                                type="email"
                                placeholder="Enter your email for early access"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-4 pl-14 pr-4 sm:pr-[250px] rounded-full border border-gray-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent transition-all bg-white/90 backdrop-blur-md text-gray-700 placeholder:text-gray-400 h-14"
                                disabled={loading || success}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading || success}
                            className={`sm:absolute sm:right-1.5 sm:top-1.5 sm:bottom-1.5 mt-3 sm:mt-0 text-white px-6 w-full sm:w-auto h-14 sm:h-auto rounded-full text-[15px] font-medium transition-all flex justify-center items-center gap-2 shadow-md hover:shadow-lg disabled:cursor-not-allowed whitespace-nowrap
                                ${success ? 'bg-green-600 hover:bg-green-700' : 'bg-[#3d2f4d] hover:bg-[#2d1f3d] disabled:opacity-70'}
                            `}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Joining...</>
                            ) : success ? (
                                <>Joined! ✓</>
                            ) : (
                                <>Request Early Access <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="text-[15px] text-gray-600 mt-6 flex items-center justify-center gap-2 font-medium"
                    >
                        <Gift className="w-4 h-4 text-pink-500 animate-pulse" />
                        Limited beta spots released every week!
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="mt-10 flex flex-col items-center justify-center gap-3"
                    >
                        <div className="flex -space-x-3">

                            {avatars.map((avatar, index) => (
                                <Image
                                    key={index}
                                    src={avatar}
                                    alt="User"
                                    width={100}
                                    height={100}
                                    className="w-10 h-10 rounded-full border-2 border-[#fff0f5] shadow-sm object-cover"
                                />
                            ))}

                            <div className="w-10 h-10 rounded-full border-2 border-[#fff0f5] shadow-sm bg-pink-100 flex items-center justify-center text-xs font-semibold text-pink-700 z-10">
                                12k+
                            </div>

                        </div>
                        <p className="text-sm text-gray-600 font-medium">
                            Join 12k+ people already waiting from 14 countries
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </main>
    );
}
