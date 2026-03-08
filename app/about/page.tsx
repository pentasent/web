"use client";

import Footer from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  CheckSquare,
  Brain,
  Headphones,
  Activity,
  ChevronRight,
  Trophy,
  Sparkles,
  ShieldCheck,
  Cpu,
  Zap
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

/* ================= DATA ================= */

const products = [
  {
    name: "Communities",
    icon: Users,
    image: "/images/community_1.png",
    color: "bg-[#e78886]",
    description: "Meaningful connection, designed for growth."
  },
  {
    name: "Journaling",
    icon: BookOpen,
    image: "/images/journal_1.png",
    color: "bg-[#95936e]",
    description: "Clarity begins with reflection."
  },
  {
    name: "Tasks",
    icon: CheckSquare,
    image: "/images/task_1.png",
    color: "bg-[#78bfa0]",
    description: "Calm productivity, without burnout."
  },
  {
    name: "Meditation",
    icon: Brain,
    image: "/images/meditation_1.png",
    color: "bg-[#e28ab2]",
    description: "Pause. Breathe. Reset your system."
  },
  {
    name: "Beats",
    icon: Headphones,
    image: "/images/music_2.png",
    color: "bg-[#419ebe]",
    description: "Shift your state with sound."
  },
  {
    name: "Yoga",
    icon: Activity,
    image: "/images/yoga_1.png",
    color: "bg-[#c7956e]",
    description: "Move with awareness and strength."
  },
];

const departments = [
  {
    title: "Product Design",
    icon: Sparkles,
    color: "#f49fa2",
    description:
      "Our design philosophy is rooted in calmness. Interfaces should feel effortless and natural. Every pixel is carefully placed to reduce cognitive load and help people stay present.",
  },
  {
    title: "Engineering",
    icon: Cpu,
    color: "#78bfa0",
    description:
      "Behind the calm interface is a powerful engineering system designed for speed, privacy, and reliability. Technology should disappear so the experience feels seamless.",
  },
  {
    title: "Mind Science",
    icon: Brain,
    color: "#c7a1f1",
    description:
      "Our product thinking is influenced by mindfulness research, psychology, and real human behavior. We focus on what genuinely helps people feel better.",
  },
  {
    title: "Experience Research",
    icon: Zap,
    color: "#419ebe",
    description:
      "We constantly study how people interact with digital wellbeing tools and refine our experiences to support emotional clarity and daily balance.",
  },
];

/* ================= PAGE ================= */

export default function AboutPage() {
  return (
    <div className="bg-gradient-to-b from-pink-50 via-pink-50/50 to-white text-gray-700 overflow-x-hidden">
      <Navbar />

      {/* HERO - Matching Articles style */}
      <section className="bg-gradient-to-t from-pink-50 via-pink-50/50 to-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3c2a34] leading-tight mb-6 max-w-4xl"
          >
            Building technology
            <br />
            that helps people slow down
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-base md:text-lg text-gray-600 max-w-2xl"
          >
            Pentasent was created with a simple idea, technology should support your mind,
            not compete for your attention. We focus on clarity, calmness, and meaningful digital experiences.
          </motion.p>
        </div>
      </section>

      {/* PRODUCT ECOSYSTEM - Refined Circular Cards */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20 text-center">
         <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 }}
            className="text-3xl font-medium text-[#3c2a34] mb-16" style={{ fontFamily: 'Georgia, serif' }}>
            The Pentasent Ecosystem
          </motion.h2>

          <div className="grid grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12">
            {products.map((product, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group flex flex-col items-center"
              >
                <div className="relative mb-6">
                  {/* Circular Image Container */}
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  {/* Hover Reveal Card */}
                  <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-64 max-w-[calc(100vw-40px)] p-6 bg-white rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:-translate-y-2 transition-all duration-300 z-[20] border border-gray-100 text-left pointer-events-none group-hover:pointer-events-auto`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`${product.color} p-1.5 rounded-lg text-white`}>
                        <product.icon size={16} />
                      </div>
                      <span className="font-semibold text-gray-900">{product.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {product.description}
                    </p>
                    {/* <Link href="/beta-release" className="text-xs text-rose-800 font-medium flex items-center gap-1 hover:underline">
                      Go to {product.name} <ChevronRight size={14} />
                    </Link> */}

                    {/* Pin/Arrow */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2">
                      <div className="border-8 border-transparent border-t-white drop-shadow-sm" />
                    </div>
                  </div>
                </div>
                <h3 className="text-sm md:text-base font-medium text-gray-900 group-hover:text-rose-800 transition-colors uppercase tracking-wider">{product.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPANY GALLERY - Shrunk dimensions */}
      <section className="pb-24 bg-pink-50/30 py-16">
        <div className="max-w-6xl mx-auto px-6 md:px-10 lg:px-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium text-[#3c2a34] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Inside Pentasent
            </h2>
            <p className=" text-gray-600 max-w-lg mx-auto leading-relaxed text-base md:text-lg">
              A space designed for focus, collaboration, and the pursuit of digital wellbeing.
            </p>
          </div>

          <div className="space-y-6">
            {/* Main Image - Shrunk */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[300px] md:h-[470px] w-full rounded-[32px] overflow-hidden shadow-xl"
            >
              <Image
                src="/images/office/main_office.svg"
                alt="Main Office"
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            </motion.div>

            {/* 3 Smaller Images */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                "office_1", "office_2", "office_3"
              ].map((id, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative h-48 rounded-2xl overflow-hidden shadow-md"
                >
                  <Image
                    src={`/images/office/${id}.svg`}
                    alt={`Gallery ${i}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-110"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY - Refined with background circles */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-rose-100/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-6 md:px-10 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-light text-[#3c2a34] mb-8 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
              Why Pentasent feels different
            </h2>
            <p className="text-gray-500 leading-relaxed text-base md:text-lg font-light max-w-2xl mx-auto">
              Most platforms are designed to keep you scrolling. Pentasent is designed to help you pause.
              Our goal isn&apos;t maximizing engagement it&apos;s creating moments of clarity, reflection,
              and emotional balance in everyday life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* DEPARTMENTS - Soft Tinted Cards */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
          <h2 className="text-2xl text-center font-medium text-[#3c2a34] my-14 uppercase tracking-widest">
            Core Disciplines
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            {departments.map((dept, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="p-10 rounded-[40px] transition-transform hover:-translate-y-1 duration-300"
                style={{ backgroundColor: `${dept.color}10` }}
              >
                 <div className="w-14 h-14 rounded-full flex items-center justify-center shadow-sm" style={{ backgroundColor: `${dept.color}20` }}>
                  <dept.icon style={{ color: dept.color }} size={28} strokeWidth={1.5} />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 my-4">{dept.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {dept.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ACHIEVEMENT - Shrunk */}
      <section className="pb-32">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#3c2a34]/90 rounded-[40px] lg:p-12 md:p-8 p-4 text-center relative overflow-hidden shadow-xl"
          >
          <Image 
          src="/images/play_award.svg" 
          width={100} height={100}
          className="w-full h-full"
          alt="Award logo" />
          </motion.div>
          {/* <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#3c2a34] rounded-[40px] p-10 md:p-16 text-center relative overflow-hidden shadow-xl"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-rose-400/15 blur-[100px] rounded-full" />

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-pink-100/10 rounded-full flex items-center justify-center mb-8 text-rose-300">
                <Trophy size={32} strokeWidth={1} />
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
                App of the Year 2024
              </h2>
              <p className="text-rose-100/50 text-base mb-10 max-w-md mx-auto leading-relaxed">
                Recognized for excellence in interaction design and digital wellbeing.
              </p>
              <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-6 py-3 rounded-full text-white/80 text-sm">
                <ShieldCheck className="text-rose-400" size={18} />
                <span className="font-medium tracking-wide">Design Excellence</span>
              </div>
            </div>
          </motion.div> */}
        </div>
      </section>

      <Footer />
    </div>
  );
}
