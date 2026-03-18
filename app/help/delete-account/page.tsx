'use client';

import { motion, Variants } from 'framer-motion';
import {
    Shield,
    Mail,
    Trash2,
    Clock,
    Database,
    ChevronRight,
    User,
    MessageSquare,
    Book,
    Bell,
    Music,
    Flame
} from 'lucide-react';
import Link from 'next/link';

const deletionData = [
    { title: "Personal Details", icon: User, list: ["Full Name", "Email Address", "Profile Password", "Personal Bio"] },
    { title: "Social Content", icon: MessageSquare, list: ["Created Communities", "Posts Created", "Post Likes & Interactions", "Chat Stream History"] },
    { title: "App Activity", icon: Flame, list: ["Meditation Sessions", "Musical Beats Activities", "Journal Entries", "Task & Habit Data", "System Notifications"] }
];

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    }
};

export default function DeleteAccountPage() {
    return (
        <div className="relative z-10 xl:pt-32 md:pt-32 pt-20 pb-16">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center xl:px-6 md:px-6 px-4 mb-20 mt-8"
            >
                {/* <div className="inline-flex items-center justify-center p-3 bg-red-50 rounded-2xl mb-6">
                    <Trash2 className="w-8 h-8 text-red-600" />
                </div> */}
                <h1
                    className="text-[40px] md:text-5xl lg:text-6xl font-light text-[#3c2a34] mb-4 tracking-tight"
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    Account Deletion
                </h1>
                <p className="max-w-2xl mx-auto text-gray-500 text-lg leading-relaxed">
                    We&apos;re sorry to see you go. If you&apos;ve decided to leave Pentasent, here is everything you need to know about the deletion process and how your data is handled.
                </p>
            </motion.div>

            {/* Steps & Timeline */}
            <div className="max-w-5xl mx-auto px-6 mb-24">
                <div className="grid md:grid-cols-2 gap-8">
                    <motion.div
                        variants={item}
                        initial="hidden"
                        animate="show"
                        className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 bg-pink-50 rounded-xl">
                                <Mail className="w-6 h-6 text-rose-800" />
                            </div>
                            <h2 className="text-2xl font-semibold text-gray-900">How to request</h2>
                        </div>
                        <p className="text-gray-600 mb-6 leading-relaxed">
                            To protect your security, we require that you send a deletion request from the email address associated with your Pentasent account.
                        </p>
                        <div className="bg-[#f9f5f7] border border-[#e8d4df] rounded-xl p-6 mb-8">
                            <p className="text-sm font-semibold uppercase tracking-wider text-rose-800 mb-2">Send an email to</p>
                            <a href="mailto:hello@pentasent.com?subject=Account Deletion Request" className="text-lg font-medium text-gray-900 hover:underline break-all">
                                hello@pentasent.com
                            </a>
                            <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                                Subject: <span className="font-mono text-gray-700">Account Deletion Request - [Your Email Address]</span>
                            </p>
                        </div>
                        <p className="text-sm text-gray-500 italic">
                            Wait until our team confirms your request. We may ask for additional verification to ensure the request is legitimate.
                        </p>
                    </motion.div>

                    <motion.div
                        variants={item}
                        initial="hidden"
                        animate="show"
                        className="bg-[#3d2f4d] rounded-3xl p-8 text-white shadow-xl"
                    >
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 bg-white/10 rounded-xl">
                                <Clock className="w-6 h-6 text-white" />
                            </div>
                            <h2 className="text-2xl font-semibold">Important Timeline</h2>
                        </div>
                        <div className="space-y-8">
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">1</div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">24 Hour Processing</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        Your account will be deactivated within 24 hours of receiving your authenticated request. You will no longer be able to log in.
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold">2</div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">30 Day Permanent Purge</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">
                                        All historical data, backups, and metadata will be permanently removed from our production servers and hidden within 30 days. This action is irreversible.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Data Deletion Details */}
            <div className="max-w-7xl mx-auto px-6 mb-24">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl font-semibold text-gray-900 mb-4">What data is deleted?</h2>
                    <p className="text-gray-500">Everything we store about you is wiped across all core features.</p>
                </motion.div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-3 gap-8"
                >
                    {deletionData.map((data, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            className="p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-sm transition-all"
                        >
                            <div className="w-12 h-12 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
                                <data.icon className="w-6 h-6 text-rose-800" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-6">{data.title}</h3>
                            <ul className="space-y-4">
                                {data.list.map((listItem, listIndex) => (
                                    <li key={listIndex} className="flex items-center gap-3 text-gray-600 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-rose-200" />
                                        {listItem}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </motion.div>
            </div>

            {/* Footer Support */}
            <div className="text-center px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto border-t-2 border-gray-200/60 pt-16"
                >
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">Questions about your privacy?</h3>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        If you have questions regarding the General Data Protection Regulation (GDPR) or the California Consumer Privacy Act (CCPA), please visit our privacy policy.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <Link href="/privacy-policy" className="text-[#4b2a3f] font-medium hover:underline flex items-center gap-2">
                            Privacy Policy <ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link href="/terms-and-conditions" className="text-[#4b2a3f] font-medium hover:underline flex items-center gap-2">
                            Terms & Conditions <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
