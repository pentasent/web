'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { HelpCircle, Activity } from 'lucide-react';
import { PRESS_SUPPORT_CARDS } from '@/data/press';

export default function PressSupportCards() {
  return (
    <section className="w-full max-w-full mx-auto bg-border-background px-4 py-16 sm:px-8 sm:py-20 lg:px-[3.8vw]">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {PRESS_SUPPORT_CARDS.map((card, idx) => (
          <motion.div
            key={card.id}
            className="bg-white rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col justify-between"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{
              duration: 0.75,
              delay: idx === 1 ? 0.12 : 0,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div>
              <div className="w-11 h-11 rounded-lg bg-[#5c0049] flex items-center justify-center text-white mb-6">
                {card.icon === 'help' ? (
                  <HelpCircle size={22} strokeWidth={2} />
                ) : (
                  <Activity size={22} strokeWidth={2} />
                )}
              </div>

              <h3 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-foreground">
                {card.title}
              </h3>

              <p className="mt-2.5 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65] text-primary-text">
                {card.description}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              {card.links.map((link) =>
                link.isExternal || link.href.startsWith('mailto:') ? (
                  <a
                    key={link.label}
                    href={link.href}
                    className="inline-block text-base font-bold text-primary-text border-b-2 border-[#ffa91f] pb-0.5 hover:text-[#5c0049] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="inline-block text-base font-bold text-primary-text border-b-2 border-[#ffa91f] pb-0.5 hover:text-[#5c0049] transition-colors cursor-pointer"
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
