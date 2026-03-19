'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { getImageUrl } from '@/lib/get-image-url';
import { ImageIcon } from 'lucide-react';

interface SmartImageProps extends Omit<ImageProps, 'onLoad'> {
    fallbackIconSize?: number;
}

export const SmartImage: React.FC<SmartImageProps> = ({ 
    fallbackIconSize = 40, 
    className, 
    alt = "", 
    src,
    ...props 
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const resolvedSrc = getImageUrl(src as string);

    // Auto-detect if we should use unoptimized (for local, blob, data URLs)
    const isLocal = resolvedSrc.startsWith('data:') || 
                   resolvedSrc.startsWith('blob:') || 
                   resolvedSrc.startsWith('file:') || 
                   resolvedSrc.startsWith('content:');

    return (
        <div className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-gray-100 ${className || ''}`}>
            {/* Loading Placeholder or Error Icon */}
            {(!isLoaded || hasError) && (
                <div className="absolute inset-0 flex items-center justify-center z-0 text-gray-300">
                    <ImageIcon size={fallbackIconSize} strokeWidth={1.5} />
                </div>
            )}

            {/* Actual Image */}
            <Image
                fill
                unoptimized={isLocal}
                {...props}
                src={resolvedSrc}
                alt={alt}
                className={`transition-opacity duration-300 ease-in-out z-10 ${isLoaded && !hasError ? 'opacity-100' : 'opacity-0'
                    } ${className || ''}`}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setIsLoaded(true); // Still set to true to avoid double-loading logic if any
                }}
            />
        </div>
    );
};
