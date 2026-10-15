"use client";

import { motion } from "framer-motion";
import { SectionsCards as cards } from "@/data/home";
import type { SectionCard } from "@/types/landing";
import Image from "next/image";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export const SectionCards = () => {
    return (
        <section className="relative z-20 -mt-50 xs:-mt-24 sm:-mt-51 md:-mt-55 lg:-mt-39 xl:-mt-47 mx-auto w-full max-w-260 px-0 sm:px-6 lg:px-8 pt-6 sm:pt-8 overflow-visible">
            <div className="rounded-[20px] bg-white p-2.5 sm:p-3">
                <div className="grid grid-cols-1 gap-3 md:gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
                    {cards.map((card, index) => {
                        const delay = index * 0.08;

                        return (
                            <Link href={`#${card.link}`} className="block w-full" key={card.tag}>
                                <motion.article
                                    initial={{ opacity: 0, x: -6, y: 6, filter: "blur(8px)" }}
                                    whileInView={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
                                    viewport={{ once: true, amount: 0.15 }}
                                    transition={{ delay, duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
                                    whileHover={{ y: -3 }}
                                    className={`group relative flex overflow-visible rounded-[15px] ${card.bg} sm:flex-col cursor-pointer`}
                                >
                                    {/* Image - floats and overflows over the top of the card */}
                                    <div className="relative h-28 w-28 xs:h-32 xs:w-32 shrink-0 overflow-visible sm:h-40 md:h-44 lg:h-28 xl:h-36 sm:w-full">
                                        <Image
                                            src={card.images.portrait}
                                            alt={card.tag}
                                            loading="lazy"
                                            width={500}
                                            height={500} 
                                            className="absolute left-1/2 -translate-x-1/2 top-0 h-[125%] sm:h-[130%] w-full max-w-full object-contain object-bottom -translate-y-6 sm:-translate-y-11 pointer-events-none"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3 bg-[#FAFAFA] px-4 py-4 sm:py-5 rounded-r-[15px] sm:rounded-r-none sm:rounded-b-[15px]">
                                        <h3 className="min-w-0 flex-1 text-[15px] xs:text-[16px] font-bold leading-[1.15] tracking-[-0.6px] text-[#222]">
                                            {card.tag}
                                        </h3>

                                        <span className="shrink-0 text-[#111] transition-transform duration-200 group-hover:translate-x-1">
                                            <MoveRight size={18} className="text-[#111]" />
                                        </span>
                                    </div>
                                </motion.article>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
