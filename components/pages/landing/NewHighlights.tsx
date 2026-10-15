import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { NEW_HIGHLIGHTS_CARDS as cards } from '@/data/home';

export default function NewHighlights() {
    return (
        <section aria-label="What's new at Pentasent" className="min-h-0 bg-[#ffffff] px-4 py-12 text-foreground sm:px-6 sm:py-16 lg:px-8 xl:px-12 lg:py-20 w-full overflow-hidden">
            <div className="mx-auto max-w-7xl">
                <motion.h2
                    className="text-[30px] xs:text-[36px] sm:text-[42px] lg:text-[44px] font-semibold leading-[1.08] sm:leading-[1.02] tracking-[-0.03em] text-foreground"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                        duration: 0.65,
                        ease: 'easeOut',
                    }}
                >
                    What&apos;s new at <span className="text-border-2">Pentasent</span>
                </motion.h2>

                <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
                    {cards.map((card, index) => (
                        <motion.article
                            key={card.title}
                            className={`group flex flex-col overflow-hidden rounded-[16px] bg-[#f2efec] shadow-[0_1px_0_rgba(0,0,0,0.02)] ${index === 2 ? 'sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none w-full' : ''
                                }`}
                            initial={{
                                opacity: 0,
                                y: 24,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                            }}
                            viewport={{ once: true, amount: 0.15 }}
                            transition={{
                                delay: index * 0.1 + 0.1,
                                duration: 0.6,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                        >
                            {/* Image */}
                            <div className="relative h-48 xs:h-52 sm:h-56 lg:h-58 shrink-0 overflow-hidden bg-accent">
                                <motion.div
                                    className="relative h-full w-full"
                                    initial={false}
                                    whileHover={{
                                        scale: 1.015,
                                    }}
                                    transition={{
                                        duration: 0.5,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                >
                                    <Image
                                        src={card.image}
                                        alt={card.title}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover"
                                    />
                                </motion.div>
                            </div>

                            {/* Content */}
                            <div className="flex flex-1 flex-col px-5 py-6 xs:px-6 xs:py-7 sm:px-8 sm:py-8 lg:px-9 lg:pb-9 lg:pt-9">
                                <h3 className="text-[20px] xs:text-[22px] sm:text-[24px] lg:text-[26px] font-semibold leading-[1.2] tracking-[-0.03em] text-foreground">
                                    {card.title}
                                </h3>

                                <p className="mt-3 sm:mt-4 text-[15px] sm:text-[16px] lg:text-[16.5px] leading-[1.65] text-primary-text">
                                    {card.description}
                                </p>

                                <Link
                                    href={card.href}
                                    className="mt-6 sm:mt-auto inline-flex w-fit items-center gap-2 border-b-[3px] border-[#d59a00] pb-1 pt-4 sm:pt-6 text-[15px] sm:text-[16px] font-semibold leading-none transition-colors hover:border-primary hover:text-primary cursor-pointer"
                                >
                                    {card.action}
                                </Link>
                            </div>
                        </motion.article>
                    ))}
                </div>
            </div>
        </section>
    );
}