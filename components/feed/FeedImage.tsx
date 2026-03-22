'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { getImageUrl } from '@/lib/get-image-url';
import { ImageIcon, Loader2 } from 'lucide-react';

interface FeedImageProps {
    src: string;
    alt?: string;
    className?: string;
    priority?: boolean;
}

export const FeedImage: React.FC<FeedImageProps> = ({ 
    src, 
    alt = "Post media", 
    className = "",
    priority = false 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const resolvedSrc = getImageUrl(src);

    // Auto-detect if we should use unoptimized (for local, blob, data URLs)
    const isLocal = resolvedSrc.startsWith('data:') || 
                   resolvedSrc.startsWith('blob:') || 
                   resolvedSrc.startsWith('file:') || 
                   resolvedSrc.startsWith('content:');

    return (
        <div className={`relative w-full overflow-hidden bg-warm-50/50 flex items-center justify-center ${className}`}>
            {/* Loading/Placeholder state */}
            {!isLoaded && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-warm-50/30 min-h-[200px]">
                    <Loader2 className="w-6 h-6 text-warm-300 animate-spin" />
                </div>
            )}

            {hasError && (
                <div className="w-full min-h-[200px] flex flex-col items-center justify-center bg-warm-50/50 text-warm-300 gap-2 font-medium">
                    <ImageIcon size={32} strokeWidth={1.5} />
                    <span className="text-xs">Failed to load image</span>
                </div>
            )}

            <Image
                src={resolvedSrc}
                alt={alt}
                width={0}
                height={0}
                sizes="100vw"
                unoptimized={isLocal}
                loading={priority ? 'eager' : 'lazy'}
                className={`w-full h-auto transition-opacity duration-500 ease-in-out ${
                    isLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true);
                }}
                style={{
                    maxHeight: '700px', // Prevent extremely long images from taking too much space
                    objectFit: 'contain',
                    width: '100%',
                    height: 'auto'
                }}
            />
        </div>
    );
};
