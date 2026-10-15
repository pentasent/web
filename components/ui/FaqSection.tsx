'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqSectionProps {
  title?: string;
  subtitle?: string;
  items: FaqItem[];
  defaultOpenId?: string | null;
  className?: string;
}

export default function FaqSection({
  title = 'FAQs',
  subtitle = 'Quick answers to common questions, privacy safeguards, and policies.',
  items,
  defaultOpenId = null,
  className = '',
}: FaqSectionProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(defaultOpenId);

  const toggleFaq = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-label={title}
      className={`w-full bg-[#f4efe9] py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Heading & Subtitle */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-[1.12] sm:leading-[1.1] tracking-[-0.03em] text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3.5 sm:mt-4 text-[15px] sm:text-[16px] text-primary-text leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-8 border-t border-[#e5e0dc]">
            {items.map((item) => {
              const isOpen = openFaqId === item.id;

              return (
                <div
                  key={item.id}
                  className="border-b border-[#e5e0dc] transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(item.id)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between text-left py-5 sm:py-6 gap-4 group cursor-pointer"
                  >
                    <span className="text-[17px] xs:text-[18px] sm:text-[19px] lg:text-[20px] font-semibold leading-[1.3] text-foreground transition-colors group-hover:text-primary">
                      {item.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`shrink-0 text-foreground/60 transition-transform duration-300 ease-out group-hover:text-primary ${
                        isOpen ? 'rotate-180 text-primary' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key={`faq-content-${item.id}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 text-[15px] sm:text-[16px] leading-[1.7] text-primary-text max-w-2xl">
                          <p>{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
