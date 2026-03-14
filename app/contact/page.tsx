'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
    Play,
    Users2,
    BookOpen,
    Activity,
    CreditCard,
    Shield,
    Smartphone,
    ChevronRight,
    Newspaper,
    Building,
    Heart,
    X
} from 'lucide-react';

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from 'next/link';
import { GlobalLayout } from '@/components/layout/global-layout';

const helpTopics = [
    { name: "Channels & Communities", icon: Users2 },
    { name: "Courses & Products", icon: BookOpen },
    { name: "Activity & Wellness", icon: Activity },
    { name: "App & Features", icon: Smartphone },
    { name: "Billing & Plans", icon: CreditCard },
    { name: "Account & Security", icon: Shield },
];

const supportOptions = [
    {
        title: "Business Inquiries",
        icon: Building,
        description: "Interested in partnering with Pentasent? We're always looking for meaningful business opportunities, partnerships, and collaborations that align with our mission of supporting wellness and connection.",
        email: "hello@pentasent.com"
    },
    {
        title: "Brand Collaborations",
        icon: Heart,
        description: "Are you a creator, influencer, or brand that shares our values? Join us in creating inspiring content and experiences for our community through authentic brand partnerships.",
        email: "hello@pentasent.com"
    },
    {
        title: "Media & Press",
        icon: Newspaper,
        description: "Find latest news, brand assets, and press releases. For media inquiries, interviews, or press kit requests, our PR team is ready to assist you.",
        email: "hello@pentasent.com"
    },
];

/* Animation Variants */

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

export default function ContactPage() {

    const [videoOpen, setVideoOpen] = useState(false);
    const [selectedSupport, setSelectedSupport] = useState<typeof supportOptions[0] | null>(null);

      const [showLoader, setShowLoader] = useState(true);
    
      useEffect(() => {
        const timer = setTimeout(() => {
          setShowLoader(false);
        }, 2000); // 2 seconds
    
        return () => clearTimeout(timer);
      }, []);
    
      if (showLoader) {
        return <GlobalLayout />;
      }

    return (
        <main className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-white relative flex flex-col font-sans overflow-x-hidden">

            <Navbar />

            <div className="relative z-10 flex-1 xl:pt-32 md:pt-32 pt-20 pb-16">

                {/* Title */}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center xl:px-6 md:px-6 px-4 mb-20 mt-8"
                >

                    <h1
                        className="text-[40px] md:text-5xl lg:text-6xl font-light text-[#3c2a34] mb-4 tracking-tight"
                        style={{ fontFamily: 'Georgia, serif' }}
                    >
                        Contact Pentasent Support
                    </h1>

                </motion.div>

                {/* Quick options */}

                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="flex flex-wrap justify-center gap-x-8 gap-y-12 mb-28"
                >

                    {supportOptions.map((itemData, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            onClick={() => setSelectedSupport(itemData)}
                            className="flex flex-col items-center gap-4 cursor-pointer group w-[200px]"
                        >

                            <itemData.icon className="w-12 h-12 text-gray-900 transition-transform group-hover:scale-110" strokeWidth={1.2} />

                            <span className="text-base flex items-center gap-2 font-medium text-rose-800 group-hover:underline">
                                {itemData.title}
                                <ChevronRight className="w-5 h-5" />
                            </span>

                        </motion.div>
                    ))}

                </motion.div>

                {/* Help Topics */}

                <div className="text-center xl:px-6 md:px-6 px-4 mb-24">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center xl:px-6 md:px-6 px-4"
                    >
                        <h2 className="text-3xl font-semibold text-gray-900 mb-20">
                            Get the help you need
                        </h2>

                    </motion.div>

                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="flex flex-wrap justify-center gap-x-6 gap-y-12 sm:gap-x-10 md:gap-x-12 max-w-5xl mx-auto"
                    >

                        {helpTopics.map((topic, index) => (

                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                                // whileHover={{ y: -5 }}
                                className="flex flex-col items-center gap-4 cursor-pointer group w-[80px] sm:w-[100px]"
                            >

                                <topic.icon
                                    className="w-10 h-10 text-gray-900 transition-transform group-hover:scale-110"
                                    strokeWidth={1.2}
                                />

                                <span className="font-medium text-gray-800 group-hover:underline text-center">
                                    {topic.name}
                                </span>

                            </motion.div>

                        ))}

                    </motion.div>

                </div>

                {/* Video Section */}

                <div className="px-6 mt-32">

                    <h2 className="text-center text-3xl font-semibold text-gray-900 mb-10">
                        Pentasent Support is here to help
                    </h2>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="w-full max-w-3xl mx-auto aspect-[16/9] rounded-3xl relative flex items-center justify-center overflow-hidden mb-8"
                    >

                        <div className="absolute inset-0 opacity-40">
                            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-500 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
                            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2"></div>
                        </div>

                        <Image
                            src="/images/support.svg"
                            alt="Support"
                            width={500}
                            height={500}
                            className="absolute inset-0 w-full h-full object-cover"
                            priority
                        />

                        <div className="absolute inset-0 bg-rose-900/10"></div>

                        {/* Play Button */}

                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            onClick={() => setVideoOpen(true)}
                            className="relative w-20 h-20 flex items-center justify-center cursor-pointer group"
                        >

                            <div className="absolute w-24 h-24 bg-pink-900/60 rounded-full animate-ping opacity-40"></div>

                            <div className="relative w-16 h-16 bg-[#4b2a3f]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#4b2a3f]/50 group-hover:bg-[#4b2a3f]/40 transition-all">

                                <Play className="w-7 h-7 text-white ml-1 fill-white" />

                            </div>

                        </motion.div>

                    </motion.div>

                    <div className="max-w-3xl mx-auto mt-6">

                        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                            Pentasent Help Center
                        </h3>

                        <p className="text-gray-600 mb-4">
                            Browse guides and learn how to use communities,
                            journals, tasks, beats and more.
                        </p>

                        <a
                            href="/help"
                            className="text-[#4b2a3f] font-medium hover:underline"
                        >
                            Visit Help Center →
                        </a>

                    </div>

                </div>

                {/* Email Support */}

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    id='contact-email'
                    className="mt-10 max-w-xl mx-auto px-6 text-center border-t-2 border-gray-200/60 pt-16"
                >

                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                        Support by Email
                    </h3>

                    <p className="text-gray-600 mb-6">
                        You can talk to a Pentasent Support Advisor by sending
                        an email for your support request.
                    </p>

                    <a
                        href="mailto:hello@pentasent.com?subject=Inquiry: Pentasent App Support"
                        className="text-[#4b2a3f] font-medium hover:underline"
                    >
                        Contact hello@pentasent.com →
                    </a>

                </motion.div>

                {/* More topics */}
                {/* 
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="mt-20 mb-10 max-w-xl mx-auto px-6 text-center"
                >

                    <h2 className="text-[28px] font-semibold text-gray-900 mb-8">
                        More topics
                    </h2>

                    <ul className="space-y-4 text-[#4b2a3f] font-medium flex flex-col items-center">

                        <li><a href="#" className="hover:underline">Create communities and channels</a></li>
                        <li><a href="#" className="hover:underline">Posting content in communities</a></li>
                        <li><a href="#" className="hover:underline">Join chat streams and conversations</a></li>

                    </ul>

                </motion.div> */}

            </div>

            {/* Video Modal */}

            <AnimatePresence>

                {videoOpen && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] px-6"
                    >

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="relative w-full max-w-4xl aspect-video"
                        >

                            <button
                                onClick={() => setVideoOpen(false)}
                                className="absolute -top-12 right-0 text-white"
                            >
                                <X className="w-8 h-8" />
                            </button>

                            <iframe
                                className="w-full h-full rounded-xl"
                                src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
                                title="Support Video"
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                            />

                        </motion.div>

                    </motion.div>

                )}

            </AnimatePresence>

            {/* Support Detail Modal */}

            <AnimatePresence>
                {selectedSupport && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSupport(null)}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[999] px-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-[32px] p-8 md:p-12 w-full max-w-lg relative border border-gray-100 shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedSupport(null)}
                                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center mb-6">
                                    <selectedSupport.icon className="w-8 h-8 text-rose-800" strokeWidth={1.5} />
                                </div>

                                <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                                    {selectedSupport.title}
                                </h2>

                                <p className="text-gray-600 leading-relaxed mb-8">
                                    {selectedSupport.description}
                                </p>

                                <div className="w-full pt-8 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider font-semibold">Contact Email</p>
                                    <a
                                        href={`mailto:${selectedSupport.email}`}
                                        className="text-lg font-light text-rose-800 hover:underline break-all"
                                    >
                                        {selectedSupport.email}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />

        </main>
    );
}


// 'use client';

// import { motion } from 'framer-motion';
// import {
//     Play,
//     Users,
//     BookOpen,
//     CheckSquare,
//     Activity,
//     Headphones,
//     CreditCard,
//     User,
//     X,
//     Smartphone,
//     Globe,
//     Receipt,
//     ChevronRight,
//     Shield,
//     Users2,
//     Building2,
//     Handshake,
//     Newspaper,
//     Building,
//     Heart
// } from 'lucide-react';

// import Navbar from "@/components/layout/navbar";
// import Footer from "@/components/layout/footer";

// import { useState } from "react";
// import Image from 'next/image';

// const helpTopics = [
//     { name: "Channels & Communities", icon: Users2 },
//     { name: "Courses & Products", icon: BookOpen },
//     { name: "Activity & Wellness", icon: Activity },
//     { name: "App & Features", icon: Smartphone },
//     { name: "Billing & Plans", icon: CreditCard },
//     { name: "Account & Security", icon: Shield },
// ];

// const supportOptions = [
//     {
//         title: "Business Inquiries",
//         icon: Building,
//     },
//     {
//         title: "Brand Collaborations",
//         icon: Heart,
//     },
//     {
//         title: "Media & Press",
//         icon: Newspaper,
//     },
// ];

// export default function ContactPage() {

//     const [videoOpen, setVideoOpen] = useState(false);

//     return (
//         <main className="min-h-screen bg-gradient-to-b from-pink-50 via-pink-50/50 to-white relative flex flex-col font-sans overflow-x-hidden">
//             {/* Background Blobs - matching theme */}
//             {/* <div className="relative inset-0 opacity-40 pointer-events-none z-0">
//                 <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-pink-200 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
//                 <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
//             </div> */}
//             <Navbar />

//             <div className="relative z-10 flex-1 xl:pt-32 md:pt-32 pt-20 pb-16">
//                 {/* Title */}

//                 <div className="text-center px-6 mb-20 mt-8">

//                     <h1
//                         className="text-[40px] md:text-5xl lg:text-6xl font-light text-[#3c2a34] mb-4 tracking-tight"
//                         style={{ fontFamily: 'Georgia, serif' }}
//                     >
//                         Contact Pentasent Support
//                     </h1>

//                 </div>

//                 {/* Quick options */}

//                 <div className="flex flex-wrap justify-center gap-x-8 gap-y-12 mb-28">
//                     {supportOptions.map((item, index) => (
//                         <motion.div
//                             key={index}
//                             initial={{ opacity: 0, y: 20 }}
//                             animate={{ opacity: 1, y: 0 }}
//                             transition={{ duration: 0.5, delay: index * 0.05 }}
//                             className="flex flex-col items-center gap-4 cursor-pointer group w-[200px]"
//                         >
//                             <item.icon className="w-12 h-12 text-gray-900" strokeWidth={1.2} />

//                             <span className="text-base flex items-center gap-2 font-medium text-rose-800 group-hover:underline">
//                                 {item.title}
//                                 <ChevronRight className="w-5 h-5" />
//                             </span>
//                         </motion.div>
//                     ))}
//                 </div>

//                 {/* Help Topics */}

//                 <div className="text-center px-6 mb-24">

//                     <h2 className="text-3xl font-semibold text-gray-900 mb-14">
//                         Get the help you need
//                     </h2>

//                     <div className="flex flex-wrap justify-center gap-x-6 gap-y-12 sm:gap-x-10 md:gap-x-12 max-w-5xl mx-auto">

//                         {helpTopics.map((topic, index) => (

//                             <motion.div
//                                 key={index}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.5, delay: index * 0.05 }}
//                                 className="flex flex-col items-center gap-4 cursor-pointer group w-[80px] sm:w-[100px]"
//                             >

//                                 <topic.icon className="w-10 h-10 text-gray-900" strokeWidth={1.2} />

//                                 <span className="font-medium text-gray-800 group-hover:underline">
//                                     {topic.name}
//                                 </span>

//                             </motion.div>

//                         ))}

//                     </div>

//                 </div>

//                 {/* Video Section */}

//                 <div className="px-6 mt-32">

//                     <h2 className="text-center text-3xl font-semibold text-gray-900 mb-10">
//                         Pentasent Support is here to help
//                     </h2>

//                     <motion.div
//                         initial={{ opacity: 0, scale: 0.98 }}
//                         animate={{ opacity: 1, scale: 1 }}
//                         transition={{ duration: 0.7 }}
//                         className="w-full max-w-3xl mx-auto aspect-[16/9] rounded-3xl relative flex items-center justify-center overflow-hidden mb-8"
//                     >
//                         <div className="absolute inset-0 opacity-40">
//                             <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-pink-500 rounded-full blur-[80px] -translate-x-1/2 -translate-y-1/2"></div>
//                             <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2"></div>
//                         </div>
//                         {/* Banner image */}

//                         <Image
//                             src="/images/support.svg"
//                             alt='Supoort'
//                             width={500}
//                             height={500}
//                             className="absolute inset-0 w-full h-full object-cover"
//                         />

//                         <div className="absolute inset-0 bg-rose-900/10"></div>

//                         {/* Play Button */}
//                         <div onClick={() => setVideoOpen(true)} className="relative w-20 h-20 flex items-center justify-center cursor-pointer group">
//                             <div className="absolute xl:w-24 w-12 xl:h-24 h-12 bg-pink-900/60 rounded-full animate-ping opacity-40"></div>
//                             <div className="absolute w-16 h-16 bg-white/20 rounded-full mix-blend-overlay"></div>
//                             <div className="relative w-16 h-16 bg-[#4b2a3f]/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-[#4b2a3f]/50 group-hover:bg-[#4b2a3f]/40 transition-all">
//                                 <Play className="w-6 h-6 sm:w-8 sm:h-8 text-white ml-1 fill-white" />
//                             </div>
//                         </div>

//                     </motion.div>

//                     <div className="max-w-3xl mx-auto mt-6">

//                         <h3 className="text-2xl font-semibold text-gray-900 mb-2">
//                             Pentasent Help Center
//                         </h3>

//                         <p className="text-gray-600 mb-4">
//                             Browse guides and learn how to use communities,
//                             journals, tasks, beats and more.
//                         </p>

//                         <a
//                             href="/help"
//                             className="text-[#4b2a3f] font-medium hover:underline"
//                         >
//                             Visit Help Center →
//                         </a>

//                     </div>

//                 </div>

//                 {/* Email Support */}

//                 <div className="mt-10 max-w-xl mx-auto px-6 text-center border-t-2 border-gray-200/60 pt-16">

//                     <h3 className="text-2xl font-semibold text-gray-900 mb-4">
//                         Support by Email
//                     </h3>

//                     <p className="text-gray-600 mb-6">
//                         You can talk to a Pentasent Support Advisor by sending
//                         an email for your support request.
//                     </p>

//                     <a
//                         href="mailto:hello@pentasent.com?subject=Inquiry: Pentasent App Support"
//                         className="text-[#4b2a3f] font-medium hover:underline"
//                     >
//                         Contact hello@pentasent.com →
//                     </a>

//                 </div>

//                 {/* More topics */}
//                 <div className="mt-20 mb-10 max-w-xl mx-auto px-6 text-center">
//                     <h2 className="text-[28px] font-semibold text-gray-900 mb-8">More topics</h2>
//                     <ul className="space-y-4 text-[#4b2a3f] font-medium flex flex-col items-center">
//                         <li><a href="#" className="hover:underline">Create communities and channels</a></li>
//                         <li><a href="#" className="hover:underline"> Posting content in communities</a></li>
//                         <li><a href="#" className="hover:underline">Join chat streams and conversations</a></li>
//                     </ul>
//                 </div>

//             </div>

//             {/* Video Modal */}

//             {videoOpen && (

//                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] px-6">

//                     <div className="relative w-full max-w-4xl aspect-video">

//                         <button
//                             onClick={() => setVideoOpen(false)}
//                             className="absolute -top-12 right-0 text-white"
//                         >
//                             <X className="w-8 h-8" />
//                         </button>

//                         <iframe
//                             className="w-full h-full rounded-xl"
//                             src="https://www.youtube.com/embed/YOUR_VIDEO_ID?autoplay=1"
//                             title="Support Video"
//                             allow="autoplay; encrypted-media"
//                             allowFullScreen
//                         />

//                     </div>

//                 </div>

//             )}


//             <Footer />

//         </main>
//     );
// }
