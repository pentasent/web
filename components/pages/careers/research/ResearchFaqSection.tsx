'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { RESEARCH_FAQ_DATA } from '@/data/research';

export default function ResearchFaqSection() {
  const { badge, title, items } = RESEARCH_FAQ_DATA;
  // First item open by default, matching reference design
  const [openId, setOpenId] = useState<string | null>(items[0]?.id || null);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-label="Frequently asked questions about research"
      className="w-full bg-white py-16 px-4 sm:px-6 lg:px-8 xl:px-12 overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-left mb-10 sm:mb-14 lg:mb-16"
        >
          {badge && (
            <span className="block text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.2em] text-[#6b185f] mb-3">
              {badge}
            </span>
          )}

          <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.12] sm:leading-[1.1] tracking-[-0.03em] text-foreground">
            {title}
          </h2>
        </motion.div>

        {/* Accordion List */}
        <div className="border-t border-[#e8e2dc]/80">
          {items.map((item, idx) => {
            const isOpen = openId === item.id;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  delay: idx * 0.06,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`transition-colors duration-200 ${
                  isOpen
                    ? 'border-b-2 border-[#6b185f]'
                    : 'border-b border-[#e8e2dc]'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left py-5 sm:py-6 lg:py-6.5 gap-4 group cursor-pointer"
                >
                  <span className="text-[17px] xs:text-[18px] sm:text-[19px] lg:text-[20px] font-bold leading-[1.3] text-foreground transition-colors group-hover:text-primary">
                    {item.question}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`shrink-0 text-foreground/70 transition-transform duration-300 ease-out group-hover:text-primary ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Collapsible Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key={`content-${item.id}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 sm:pb-7 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.75] text-primary-text max-w-3xl">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
