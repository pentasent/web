"use client"


import Benifits from '@/components/pages/landing/Benifits';
import ExploreSection from '@/components/pages/landing/ExploreSection';
import { FeaturesSlider } from '@/components/pages/landing/FeaturesSlider';
import NewHighlights from '@/components/pages/landing/NewHighlights';
import { SectionCards } from '@/components/pages/landing/SectionsCard';
import UserFeedbackSection from '@/components/pages/landing/UserFeedbackSection';
import { motion } from 'framer-motion';
import { LANDING_HERO_DATA } from '@/data/home';


export default function Home() {

  return (
    <main id="top" className='bg-white w-full overflow-x-hidden min-w-0'>
      <section className="relative isolate flex min-h-135 h-auto sm:h-[78svh] sm:min-h-140 sm:max-h-140 pb-28 sm:pb-36 overflow-hidden bg-[linear-gradient(135deg,#4a003e_0%,#43003b_52%,#350030_100%)] text-white">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(112,0,91,0.14),transparent_58%)]" />

        {/* Large Subtle Watermark Logo Text in Background */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center items-end select-none pointer-events-none translate-y-2 sm:translate-y-12 lg:translate-y-18">
          <span className="text-[20vw] sm:text-[22vw] font-bold text-white/4 leading-none tracking-tight">
            {LANDING_HERO_DATA.watermarkText}
          </span>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.055, filter: 'blur(18px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ delay: 0.12, duration: 1.75, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-7xl flex-col items-center px-4 xs:px-6 pt-24 sm:pt-[12vh] text-center"
        >
          <p className="mb-4 sm:mb-6 text-[13px] xs:text-[14px] sm:text-[15px] tracking-[-0.2px] text-[#fbf0f8]">
            {LANDING_HERO_DATA.badge.prefix}
            <strong className="font-bold">{LANDING_HERO_DATA.badge.highlight}</strong>
            {LANDING_HERO_DATA.badge.suffix}
          </p>
          <h1 className="max-w-7xl text-[34px] xs:text-[42px] sm:text-[62px] lg:text-[70px] font-semibold leading-[1.04] sm:leading-[0.99] tracking-[-1px] sm:tracking-[-1.2px] text-[#fffaff]">
            {LANDING_HERO_DATA.title.line1}<br />
            <span className="font-semibold text-[#d5bbd0]">{LANDING_HERO_DATA.title.highlight}</span>
            {LANDING_HERO_DATA.title.line2}
          </h1>
          <p className="mt-4 sm:mt-5 max-w-2xl lg:max-w-3xl text-[14px] xs:text-[15px] sm:text-[16px] leading-[1.65] sm:leading-[1.75] tracking-[-0.15px] text-white/80">
            {LANDING_HERO_DATA.description.line1}
            <br className="hidden sm:block" />
            {LANDING_HERO_DATA.description.line2}
          </p>
        </motion.div>
      </section>

      <SectionCards />

      <FeaturesSlider />

      <Benifits />

      <ExploreSection />

      <NewHighlights />

      <UserFeedbackSection />
    </main>
  );
}

