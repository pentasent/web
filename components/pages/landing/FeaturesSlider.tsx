import { marqueeWords } from "@/data/home";
import type { MarqueeItem } from "@/types/landing";

export function FeaturesSlider() {

return (
    <section
        aria-label="PENTASENT highlights"
        className="overflow-hidden py-7 sm:py-16"
    >
        <div className="relative flex">
            {[0, 1].map((copy) => (
                <div
                    key={copy}
                    aria-hidden={copy === 1}
                    className="flex shrink-0 animate-marquee items-center gap-0 whitespace-nowrap pl-0"
                >
                    {marqueeWords.map((word, index) => (
                        <span key={index} className="flex items-center">
                            <span className="flex items-center gap-2.5 sm:gap-3 px-5 sm:px-8 uppercase">
                                <word.icon
                                    size={22}
                                    strokeWidth={1.6}
                                    className="shrink-0 font-extrabold text-black sm:h-6 sm:w-6"
                                />

                                <span className="text-[9px] sm:text-[10px] font-semibold leading-normal tracking-[1px] text-[#171A18]">
                                    {word.label}
                                </span>
                            </span>
                        </span>
                    ))}
                </div>
            ))}
        </div>
    </section>
);
}