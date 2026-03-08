'use client';

import { motion } from 'framer-motion';
import { MessageCircle, HelpCircle, Sparkles, ChevronRight } from 'lucide-react';
import Image from 'next/image';

function MobileMockup({ image }: { image: string }) {
  return (
    <div className="relative w-[230px] h-[460px] mx-auto">
      <Image
        alt="Pentasent preview"
        src={image}
        width={1000}
        height={1000}
        className="w-full h-full object-contain"
      />
    </div>
  );
}

export default function AppShowcaseSection() {
  return (
    <section className="relative bg-[#f6eef1] py-20 lg:py-28 overflow-hidden" id='glance'>

      {/* BACKGROUND BLOBS */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full blur-[140px] opacity-20"
        style={{
          background: "radial-gradient(circle at center, #f19fc5 0%, transparent 70%)",
        }}
      />

      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-60 -right-60 w-[900px] h-[900px] rounded-full blur-[160px] opacity-15"
        style={{
          background: "radial-gradient(circle at center, #c7a1f1 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

        {/* ===== TOP GRID ===== */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">

          {/* CARD 1 */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white rounded-3xl shadow-sm transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="pt-10 px-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-pink-500" />
                </div>
                <h3 className="text-2xl font-light text-gray-900">
                  Feel the Frequency.
                </h3>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Immerse yourself in binaural beats, calming soundscapes,
                and mindful audio rituals designed to elevate your mood.
              </p>
              <a href='/beta-release'>
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium group w-fit border-2 border-gray-100 py-2.5 px-5 rounded-full mb-10">
                Explore beats
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </a>
            </div>

            <div className="relative h-[260px] overflow-hidden">
              <MobileMockup image="/images/beats.svg" />
            </div>
          </motion.div>

          {/* CARD 2 */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="bg-white rounded-3xl shadow-sm transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className="pt-10 px-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-purple-500" />
                </div>
                <h3 className="text-2xl font-light text-gray-900">
                  Join the Conversation.
                </h3>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                Dive into real-time chatstreams where women connect,
                support each other, and grow together daily.
              </p>
              <a href='/beta-release'>
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium group w-fit border-2 border-gray-100 py-2.5 px-5 rounded-full mb-10">
                Enter chat
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </a>
            </div>

            <div className="relative h-[260px] overflow-hidden">
              <MobileMockup image="/images/chats.svg" />
            </div>
          </motion.div>
        </div>

        {/* ===== BOTTOM FULL WIDTH CARD ===== */}
        <motion.div
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="bg-white rounded-3xl shadow-sm transition-all duration-300 overflow-hidden flex flex-col"
        >
          <div className="grid lg:grid-cols-2 gap-12 items-start pt-12">

            <div className='px-12'>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-sm tracking-wider text-gray-500 uppercase">
                  Community Space
                </span>
              </div>

              <h3 className="text-4xl font-light text-gray-900 mb-6 leading-tight">
                Share freely,<br />ask confidently
              </h3>

              <p className="text-gray-600 mb-8 leading-relaxed">
                Post your thoughts, ask late-night questions,
                and receive genuine support from your circle.
              </p>
              <a href='/beta-release'>
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900 font-medium group w-fit border-2 border-gray-100 py-2.5 px-5 rounded-full mb-10">
                Share Post
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              </a>
            </div>

            <div className="relative h-[380px] overflow-hidden -mt-8">
              <MobileMockup image="/images/community.svg" />
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
