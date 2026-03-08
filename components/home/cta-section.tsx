'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function CTASection() {
  return (
    <section className="py-16 px-6 bg-[#fff1f6]">
      <div className="relative max-w-6xl mx-auto rounded-[40px] bg-gradient-to-br from-[#e7c5cc] to-[#d9aeb8] overflow-hidden px-8 md:px-16 py-16 md:py-20">

        {/* Decorative background shape */}
        <div className="absolute right-[-200px] top-[-100px] w-[600px] h-[200px] bg-pink-950/60 rounded-full blur-3xl"></div>

        <div className="grid lg:grid-cols-2 items-center gap-12">

          {/* ===== LEFT CONTENT ===== */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-light text-[#3a2a2f] leading-tight">
              Start feeling<br />
              more like you.
            </h2>

            <p className="mt-6 text-[#5e4a50] text-lg">
              Get the Pentasent app and start tracking what matters.
            </p>
{/* 
            <div className="mt-8 flex gap-4 flex-wrap">
              <a href='/beta-release'>
              <button className="px-6 py-3 bg-[#3d253b] text-white rounded-full shadow-md hover:shadow-lg transition">
                Get the app
              </button>
              </a>

              <a href='#pricing'>
                <button className="px-6 py-3 bg-white/60 backdrop-blur border border-white/40 text-[#3a2a2f] rounded-full hover:bg-white transition">
                  Pricing Plans
                </button>
              </a>
            </div> */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mt-8">
  
  <a href="/beta-release" className="w-full sm:w-auto">
    <button className="w-full sm:w-auto bg-[#3d2f4d] text-white px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-[#2d1f3d] transition-all">
      Get the app
    </button>
  </a>

  <a href="#pricing" className="w-full sm:w-auto">
    <button className="w-full sm:w-auto bg-white text-gray-700 px-8 py-3.5 rounded-full text-[15px] font-medium hover:bg-gray-50 transition-all border border-gray-200">
      Pricing Plans
    </button>
  </a>

</div>
          </motion.div>

          {/* ===== RIGHT PHONE MOCKUPS ===== */}
          <div className="relative h-[220px] hidden lg:block">

            {/* Back Phone */}
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: 6 }}
              whileInView={{ opacity: 1, x: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className='absolute -right-[150px] top-10 inset-[8px] w-[430px] h-[660px] mx-auto rotate-[6deg]'>
              <Image
                alt="Pentasent Community"
                src="/images/Community.svg"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 60, rotate: -6 }}
              whileInView={{ opacity: 1, x: 0, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className='absolute right-[140px] top-0 inset-[8px] w-[430px] h-[660px] mx-auto -rotate-[6deg]'>
              <Image
                alt="Pentasent Welcome"
                src="/images/Splashscreen.svg"
                width={1000}
                height={1000}
                className="w-full h-full object-contain"
              />
            </motion.div>
            {/* <motion.div
              initial={{ opacity: 0, x: 60, rotate: 6 }}
              whileInView={{ opacity: 1, x: 0, rotate: 6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="absolute right-0 top-10 w-[230px] h-[460px] bg-black rounded-[36px] shadow-2xl rotate-[6deg]"
            >
              <div className="absolute inset-[8px] bg-white rounded-[28px] overflow-hidden flex items-center justify-center text-gray-400 text-sm">
                Mobile Screen
              </div>
            </motion.div> */}

            {/* Front Phone */}
            {/* <motion.div
              initial={{ opacity: 0, x: 60, rotate: -6 }}
              whileInView={{ opacity: 1, x: 0, rotate: -6 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute right-[140px] top-0 w-[230px] h-[460px] bg-black rounded-[36px] shadow-2xl -rotate-[6deg]"
            >
              <div className="absolute inset-[8px] bg-white rounded-[28px] overflow-hidden flex items-center justify-center text-gray-400 text-sm">
                Mobile Screen
              </div>
            </motion.div> */}

          </div>

        </div>
      </div>
    </section>
  );
}