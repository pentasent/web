'use client';

import { motion } from 'framer-motion';
import { Stethoscope, Building2 } from 'lucide-react';
import Link from 'next/link';
import ContactForm from '@/components/forms/ContactForm';
import {
  PRICING_PAGE_CONTENT,
  PRICING_OVERVIEW_ARTICLES,
  PRICING_STAKEHOLDER_CARDS,
} from '@/data/pricing';

export default function PricingPage() {
  return (
    <div className="w-full bg-white text-primary-text">
      {/* =========================================================
          TOP SECTION: Minimal Pure White Pricing Container
          ========================================================= */}
      <main className="mx-auto max-w-full px-4 py-8 sm:px-8 sm:py-12 lg:px-[3.8vw] lg:pb-[5vw] pt-24 sm:pt-32 lg:pt-36">
        <section className="mx-auto grid max-w-full grid-cols-1 gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:gap-[11.5vw]">
          {/* LEFT COLUMN: Request Quote Form */}
          <motion.div
            initial={{ opacity: 0, filter: 'blur(10px)', y: 0 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.85 }}
          >
            <h1 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-none tracking-[-0.055em] text-foreground">
              {PRICING_PAGE_CONTENT.formTitle}
            </h1>

            <ContactForm buttonText="Request quote" source="pentasent_pricing_page" />
          </motion.div>

          {/* RIGHT COLUMN: Pricing Breakdown and Ecosystem Content */}
          <motion.div
            className="border-t border-[#e8e4e1] pt-14 lg:border-0 lg:pt-0"
            initial={{ opacity: 0, filter: 'blur(10px)', y: 0 }}
            animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
            transition={{ duration: 0.85, delay: 0.12 }}
          >
            <h2 className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-bold leading-none tracking-[-0.055em] text-foreground">
              {PRICING_PAGE_CONTENT.overviewTitle}
            </h2>
            <div className="max-w-167.5 mt-14 lg:mt-15.5 space-y-13.25">
              {PRICING_OVERVIEW_ARTICLES.map((article) => (
                <article key={article.id} className="first:mt-0 sm:max-w-none max-w-167.5">
                  <h3 className="text-[clamp(1.45rem,2vw,1.7rem)] font-bold leading-[1.1] tracking-[-0.035em] text-foreground">
                    {article.title}
                  </h3>
                  <p className="mt-3.5 text-primary-text text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65] tracking-[0.005em]">
                    {article.parts.map((part, idx) =>
                      part.isLink && part.href ? (
                        part.href.startsWith('mailto:') || part.href.startsWith('tel:') ? (
                          <a
                            key={idx}
                            href={part.href}
                            className="text-primary underline underline-offset-2 decoration-1 cursor-pointer"
                          >
                            {part.text}
                          </a>
                        ) : (
                          <Link
                            key={idx}
                            href={part.href}
                            className="text-primary underline underline-offset-2 decoration-1 cursor-pointer"
                          >
                            {part.text}
                          </Link>
                        )
                      ) : (
                        <span key={idx}>{part.text}</span>
                      )
                    )}
                  </p>
                </article>
              ))}
            </div>
          </motion.div>
        </section>
      </main>

      {/* =========================================================
          BOTTOM SECTION: 2 Stakeholder Cards on Warm Beige Surface
          ========================================================= */}
      <section className="w-full bg-border-background px-4 py-16 sm:px-8 sm:py-20 lg:px-[3.8vw]">
        <div className="mx-auto max-w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {PRICING_STAKEHOLDER_CARDS.map((card, idx) => (
            <motion.div
              key={card.id}
              className="bg-white rounded-2xl p-8 sm:p-10 shadow-xs flex flex-col justify-between"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.75, delay: idx === 1 ? 0.12 : 0, ease: [0.22, 1, 0.36, 1] }}
            >
              <div>
                <div className="w-11 h-11 rounded-lg bg-[#5c0049] flex items-center justify-center text-white mb-6">
                  {card.icon === 'stethoscope' ? (
                    <Stethoscope size={22} strokeWidth={2} />
                  ) : (
                    <Building2 size={22} strokeWidth={2} />
                  )}
                </div>
                <h3 className="text-[26px] sm:text-[28px] font-bold tracking-tight text-foreground">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-primary-text text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65]">
                  {card.description}
                </p>
              </div>
              <div className="mt-8">
                <a
                  href={card.actionHref}
                  className="inline-block text-base font-bold text-primary-text border-b-2 border-[#ffa91f] pb-0.5 hover:text-[#5c0049] transition-colors cursor-pointer"
                >
                  {card.actionText}
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
