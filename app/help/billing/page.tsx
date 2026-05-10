'use client';

import { motion } from 'framer-motion';
import {
    CreditCard,
    CheckCircle2,
    ShieldCheck,
    Zap,
    Mail,
    ArrowRight,
    Search,
    UserCircle,
    BadgeHelp,
    History,
    ChevronRight
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import Link from 'next/link';

/* Animation Variants - Matching Contact Page */
const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
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

export default function BillingHelpPage() {
    return (
        <div className="relative z-10 flex-1 xl:pt-32 md:pt-32 pt-20 pb-16">
            
            {/* Background Blobs - Subtle and well-blended */}
            <div className="absolute inset-0 opacity-20 pointer-events-none -z-10 overflow-hidden">
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-pink-400 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-400 rounded-full blur-[150px] translate-x-1/2 translate-y-1/2"></div>
            </div>

            {/* Title Section - Matching Contact Page */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center xl:px-6 md:px-6 px-4 mb-20 mt-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/50 text-pink-800 text-sm font-medium border border-pink-200/50 mb-6 backdrop-blur-sm">
                    <BadgeHelp className="w-4 h-4" />
                    <span>Billing Support</span>
                </div>
                <h1
                    className="text-[40px] md:text-5xl lg:text-6xl font-light text-[#3c2a34] mb-4 tracking-tight"
                    style={{ fontFamily: 'Georgia, serif' }}
                >
                    Help & Billing Center
                </h1>
                <p className="max-w-2xl mx-auto text-gray-500 text-lg leading-relaxed">
                    Detailed information about your Pentasent subscription, secure payments, and account security.
                </p>
            </motion.div>

            {/* Quick Search - Premium UI */}
            <div className="max-w-4xl mx-auto px-6 mb-24">
                <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-pink-500 transition-colors z-10 pointer-events-none">
                        <Search className="w-5 h-5" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for billing questions..."
                        className="w-full py-5 pl-14 pr-8 rounded-2xl border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-pink-200 focus:border-transparent transition-all bg-white/60 backdrop-blur-md text-gray-700 placeholder:text-gray-400"
                    />
                </div>
            </div>

            {/* Content Sections */}
            <div className="max-w-4xl mx-auto px-6 space-y-24">
                
                {/* Account & Security */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
                            <UserCircle className="w-7 h-7 text-gray-900" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Account & Security</h2>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="acc-1" className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-7 text-lg group">
                                <span>How do I keep my account safe?</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-[16px]">
                                Pentasent uses industry-leading encryption and secure authentication protocols. To ensure maximum safety, we recommend using a unique password and keeping your registered email address secure. We will never ask for your password via email or direct message.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="acc-2" className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-7 text-lg">
                                <span>Can I change my registered email?</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-[16px]">
                                Yes, email changes are handled manually to ensure account security. Please contact us at <a href="mailto:hello@pentasent.com" className="text-rose-800 font-medium hover:underline">hello@pentasent.com</a> from your current registered email address, and our team will guide you through the verification process.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.section>

                {/* Subscriptions & Plans */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
                            <Zap className="w-7 h-7 text-gray-900" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Subscriptions & Plans</h2>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="sub-1" className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-7 text-lg">
                                <span>What are the available plans?</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-[16px]">
                                We offer a tiered experience designed to grow with your wellness journey:
                                <div className="mt-6 space-y-4">
                                    <div className="p-6 bg-gray-50/50 rounded-[20px] border border-gray-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-green-500" />
                                            <h4 className="font-semibold text-gray-900">Free Plan</h4>
                                        </div>
                                        <p className="text-sm pl-5 text-gray-500">Automatically added to your account upon creation. This plan renews yearly at no cost and includes all essential Pentasent features.</p>
                                    </div>
                                    <div className="p-6 bg-pink-50/30 rounded-[20px] border border-pink-100/50">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-pink-500" />
                                            <h4 className="font-semibold text-gray-900">Premium</h4>
                                        </div>
                                        <p className="text-sm pl-5 text-gray-500">Billed monthly. Includes enhanced AI interaction limits, custom musical beats, and advanced wellness tracking tools.</p>
                                    </div>
                                    <div className="p-6 bg-purple-50/30 rounded-[20px] border border-purple-100/50">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-2 h-2 rounded-full bg-purple-600" />
                                            <h4 className="font-semibold text-gray-900">Premium+</h4>
                                        </div>
                                        <p className="text-sm pl-5 text-gray-500">Our most comprehensive monthly plan. Offers maximum limits, priority support, and exclusive access to beta features and content.</p>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="sub-2" className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-7 text-lg">
                                <span>How do I upgrade or see plan details?</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-[16px]">
                                You can explore our detailed offerings and current plans by visiting the <Link href="/#pricing" className="text-rose-800 font-semibold hover:underline">Subscription Section</Link> on our website or app. From there, you can easily upgrade or manage your current plan.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="sub-3" className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-7 text-lg">
                                <span>What happens if my subscription expires?</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-[16px]">
                                If your paid subscription is not renewed, your account will automatically transition to our Free plan. You will never lose your historical data, but access to specific premium features will be adjusted based on the free tier limits.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.section>

                {/* Billing & Payments */}
                <motion.section
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                >
                    <div className="flex items-center gap-4 mb-10">
                        <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
                            <CreditCard className="w-7 h-7 text-gray-900" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">Billing & Payments</h2>
                    </div>
                    
                    <Accordion type="single" collapsible className="w-full space-y-4">
                        <AccordionItem value="bill-1" className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-7 text-lg">
                                <span>How am I billed for paid plans?</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-[16px]">
                                All paid subscriptions (Premium and Premium+) are billed on a monthly basis. Your billing cycle starts on the day you upgrade, and your payment method will be charged every 30 days.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bill-2" className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-7 text-lg">
                                <span>How can I see my payment history?</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-[16px]">
                                Transparency is key. You can view your full history by navigating to <span className="font-semibold text-gray-900">Profile &gt; My Subscription</span> in the Pentasent app and clicking on <span className="font-semibold text-gray-900">View Payment History</span>. There you can see all past transactions and download invoices.
                            </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="bill-3" className="bg-white/80 backdrop-blur-sm rounded-[24px] px-8 border border-gray-100 shadow-sm transition-all hover:shadow-md overflow-hidden">
                            <AccordionTrigger className="text-left font-medium text-gray-900 hover:no-underline py-7 text-lg">
                                <span>Are my payments secure?</span>
                            </AccordionTrigger>
                            <AccordionContent className="text-gray-600 leading-relaxed pb-8 text-[16px]">
                                Absolutely. We use industry-standard payment processors that are PCI-DSS compliant. Pentasent does not store your full payment details on our servers, ensuring your sensitive information remains private and secure.
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </motion.section>
            </div>

            {/* Support Footer - Matching Contact Page Section Style */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mt-32 max-w-xl mx-auto px-6 text-center border-t-2 border-gray-200/60 pt-20"
            >
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                    <Mail className="w-8 h-8 text-rose-800" strokeWidth={1.5} />
                </div>

                <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                    Support by Email
                </h3>

                <p className="text-gray-600 mb-8 leading-relaxed">
                    If you still have questions, you can talk to a Pentasent Support Advisor by sending an email for your support request.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <a
                        href="mailto:hello@pentasent.com?subject=Inquiry: Pentasent Billing Support"
                        className="inline-flex items-center gap-2 text-rose-800 font-medium hover:underline text-lg"
                    >
                        Contact hello@pentasent.com <ChevronRight className="w-5 h-5" />
                    </a>
                    <Link
                        href="/#pricing"
                        className="text-gray-900 font-medium hover:underline text-lg"
                    >
                        View Plans
                    </Link>
                </div>

                <div className="mt-8 text-sm text-gray-400 flex items-center justify-center gap-2">
                    <History className="w-4 h-4" />
                    <span>Typical response time: &lt; 24h</span>
                </div>
            </motion.div>
        </div>
    );
}
