'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-primary bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white pt-28 pb-20 ">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(112,0,91,0.22),transparent_65%)]" />

      <div className="mx-auto w-full max-w-7xl px-4 xs:px-6 sm:px-8 md:px-10 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Mission Content (Fade + Blur + Scale Animation) */}
          <motion.div
            initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-7 flex flex-col text-left"
          >
            {/* Mission Eyebrow Tag */}
            <span className="text-[13px] sm:text-[14px] font-semibold tracking-[0.16em] uppercase text-[#ffd3f0]">
              Our mission
            </span>

            {/* Main Title with Highlighted Words */}
            <h1 className="mt-3.5 sm:mt-4 text-[34px] xs:text-[40px] sm:text-[48px] lg:text-[52px] xl:text-[56px] font-bold leading-[1.08] sm:leading-[1.05] tracking-[-1px] text-white">
              Building the <span className="text-[#ffd3f0]">future </span>of human healthcare
            </h1>

            {/* Subtitle Bold Statement */}
            <p className="mt-5 sm:mt-6 text-[16px] sm:text-[18px] font-bold text-white tracking-tight">
              Pentasent eliminates the friction from modern healthcare.
            </p>

            {/* Descriptive Body Paragraph */}
            <p className="mt-3 text-[15px] sm:text-[16px] lg:text-[17px] leading-[1.7] text-white/80 font-normal">
              Pentasent is the unified healthcare ecosystem that connects patients,
              doctors, clinics, hospitals, research institutions, and innovators.
              Built on a single connected network of discovery and integrated tools,
              Pentasent allows people and organizations to collaborate, share knowledge,
              and execute more efficiently.
            </p>

            {/* Platform Explore Link with Golden Underline */}
            <div className="mt-7 sm:mt-9">
              <Link
                href="/company/life"
                className="inline-block text-[15px] sm:text-[16px] font-bold text-white border-b-2 border-[#e5a83b] pb-1 hover:text-[#ffd3f0] hover:border-[#ffd3f0] transition-colors cursor-pointer"
              >
                Explore the Life at Pentasent
              </Link>
            </div>
          </motion.div>

          {/* Right Column: Connected Ecosystem Diagram (Fade + Blur + Scale Animation) */}
          <motion.div
            initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.28, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-6 xl:col-span-5 flex items-center justify-center w-full"
          >
            <div className="relative w-full max-w-lg lg:max-w-lg xl:max-w-xl transition-transform hover:scale-[1.01] duration-300">
              <Image
                src="/assets/images/pages/about/about_connection.png"
                alt="Pentasent connected healthcare ecosystem diagram"
                width={1000}
                height={667}
                priority
                className="w-full h-auto object-contain drop-shadow-[0_20px_50px_rgba(27,0,25,0.4)]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
