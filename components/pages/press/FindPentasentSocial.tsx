'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { socialLinks } from '@/data/footer';

export default function FindPentasentSocial() {
  return (
    <section className="w-full max-w-full mx-auto bg-border-background py-16 sm:py-20 lg:py-24 px-4 sm:px-8 lg:px-[3.8vw]">
      <div className="mx-auto max-w-7xl">
        {/* Centered Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-tight tracking-[-0.035em] text-foreground"
        >
          Find Pentasent on social
        </motion.h2>

        {/* Social channels row from socialLinks */}
        <div className="mt-10 sm:mt-14 lg:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-7 lg:gap-8">
          {socialLinks.map((item, idx) => (
            <motion.a
              key={item.name}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Follow Pentasent on ${item.name}`}
              className="group flex items-center justify-between pb-3.5 sm:pb-4 border-b border-[#ded9d5] hover:border-[#6b185f] transition-all cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: idx * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
                {/* White square icon badge matching reference design */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-[6px] bg-white border border-[#e2ddd8] flex items-center justify-center shadow-[0_1px_2px_rgba(0,0,0,0.04)] group-hover:scale-105 group-hover:border-[#6b185f]/30 transition-all">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={18}
                    height={18}
                    className="object-contain brightness-0 opacity-85 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-[15px] sm:text-[16px] font-medium text-foreground group-hover:text-[#6b185f] transition-colors truncate">
                  {item.name}
                </span>
              </div>
              <ChevronRight
                size={18}
                className="text-[#7d7976] shrink-0 group-hover:text-[#6b185f] group-hover:translate-x-1 transition-all"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
