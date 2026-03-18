'use client';

import { motion } from 'framer-motion';
import { Activity, Apple, Headphones, CheckCircle2, ChevronRight, Users2, Users, UsersRound, Music, NotebookPen, Notebook } from 'lucide-react';
import Image from 'next/image';
import { SmartImage } from '../ui/SmartImage';

export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-pink-50 via-pink-50/50 to-white overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-pink-200 rounded-full blur-3xl -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-200 rounded-full blur-3xl translate-x-1/4 translate-y-1/4"></div>
      </div>

      <div className="relative z-10 mx-auto pt-32 pb-12">
<div className="px-6 md:px-12 lg:px-20 mb-32">
  <div className="max-w-7xl mx-auto">
    
    <div className="grid lg:grid-cols-[2fr_1fr] gap-12 lg:gap-16 items-center">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-[1.15] mb-6 text-[#3c2a34]">
          Small daily rituals.<br />
          Real, lasting change.
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl leading-relaxed">
          A wellness app for humans navigating life’s most transformative moments, with clarity, care, and calm.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <a href="/signup" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-[#3d2f4d] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-[#2d1f3d] transition-all">
              Get Started
            </button>
          </a>

          <a href="#pricing" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto bg-white text-gray-700 px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-all border border-gray-200">
              Pricing Plans
            </button>
          </a>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="flex justify-center lg:justify-end"
      >
        <Image
          src="/images/large/banner.svg"
          alt="Banner"
          width={600}
          height={600}
          className="w-full max-w-md lg:max-w-lg h-auto object-contain"
        />
      </motion.div>

    </div>
  </div>
</div>

<div className="relative overflow-hidden">
  <div className="max-w-7xl mx-auto">
    
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="flex gap-4 pb-4 relative px-6 w-[calc(100%+6rem)] -ml-[6rem]"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      
      {/* LEFT IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] rounded-lg overflow-hidden shadow-sm h-[380px]"
      >
        <Image
          src="/images/banner_1.png"
          alt="Woman meditating"
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* COLUMN 1 */}
      <div className="flex-shrink-0 flex flex-col gap-4 w-[130px] sm:w-[150px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-gradient-to-br from-pink-300 to-pink-400 rounded-lg p-6 shadow-sm flex-1 flex flex-col items-center justify-center"
        >
          <Users2 className="w-10 h-10 text-pink-800 mb-2" />
          <span className="text-sm font-medium text-pink-900">Communities</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.65 }}
          className="bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg p-6 shadow-sm flex-1 flex flex-col items-center justify-center"
        >
          <Music className="w-10 h-10 text-pink-800 mb-2" />
          <span className="text-sm font-medium text-pink-900">Beats</span>
        </motion.div>
      </div>

      {/* COLUMN 2 */}
      <div className="flex-shrink-0 flex flex-col gap-4 w-[130px] sm:w-[150px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="bg-gradient-to-br from-purple-300 to-purple-400 rounded-lg p-6 shadow-sm flex-1 flex flex-col items-center justify-center"
        >
          <Notebook className="w-10 h-10 text-purple-800 mb-2" />
          <span className="text-sm font-medium text-purple-900">Journal</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.75 }}
          className="bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg p-6 shadow-sm flex-1 flex flex-col items-center justify-center"
        >
          <CheckCircle2 className="w-10 h-10 text-orange-800 mb-2" />
          <span className="text-sm font-medium text-orange-900">Tasks</span>
        </motion.div>
      </div>

      {/* CENTER IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] rounded-lg overflow-hidden shadow-sm h-[380px]"
      >
        <Image
          src="/images/banner_2.png"
          alt="Woman meditating home"
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
        className="flex-shrink-0 w-[280px] sm:w-[320px] bg-white rounded-lg shadow-sm p-6 h-[380px]"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Daily goal</h3>
          <button className="text-sm text-gray-500 flex items-center gap-1 cursor-auto">
            View details <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="relative w-48 h-48 mx-auto mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="#f3f4f6" strokeWidth="16" fill="none" />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="url(#gradient)"
              strokeWidth="16"
              fill="none"
              strokeDasharray="502"
              strokeDashoffset="125"
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#f59e0b" />
              </linearGradient>
            </defs>
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xs text-gray-500 mb-1">SCORE ⓘ</span>
            <span className="text-5xl font-light text-purple-600">75</span>
          </div>
        </div>

        <div className="bg-pink-50 rounded-2xl p-4">
          <p className="text-sm text-gray-600 italic leading-relaxed">
            Every human deserves her best.<br />
            You are special every day.
          </p>
        </div>
      </motion.div>

      {/* RIGHT IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
        className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[240px] rounded-lg overflow-hidden shadow-sm h-[380px]"
      >
        <Image
          src="/images/banner_3.png"
          alt="Woman Jungle Meditation"
          width={100}
          height={100}
          className="w-full h-full object-cover"
        />
      </motion.div>

    </motion.div>
  </div>
</div>
      </div>
    </section>
  );
}
