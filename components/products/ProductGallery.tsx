'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductMediaDTO } from '@/types/products';

interface ProductGalleryProps {
  screenshots: ProductMediaDTO[];
  productName: string;
}

export default function ProductGallery({ screenshots, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!screenshots || screenshots.length === 0) {
    return null;
  }

  const currentScreenshot = screenshots[selectedIndex] || screenshots[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Preview Container */}
      <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg bg-[#faf9f8] border-2 border-[#ded9d5] group shadow-2xs">
        <Image
          src={currentScreenshot.cloudinaryUrl}
          alt={`${productName} screenshot ${selectedIndex + 1}`}
          fill
          priority={selectedIndex === 0}
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover object-top transition-all duration-300"
        />

        {/* Carousel Prev / Next Controls (if multiple) */}
        {screenshots.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
              aria-label="Previous screenshot"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-md"
              aria-label="Next screenshot"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Counter Badge */}
        <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-md bg-black/60 text-white text-[12px] font-medium backdrop-blur-xs">
          {selectedIndex + 1} / {screenshots.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {screenshots.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {screenshots.map((s, idx) => (
            <button
              key={s.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-20 sm:w-24 aspect-16/10 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                selectedIndex === idx
                  ? 'border-primary ring-2 ring-primary/20 scale-102'
                  : 'border-[#ded9d5] opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={s.cloudinaryUrl}
                alt={`Thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
