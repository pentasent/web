'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { ImageIcon } from 'lucide-react';

interface SmartImageProps extends Omit<ImageProps, 'onLoad'> {
    fallbackIconSize?: number;
}

export const SmartImage: React.FC<SmartImageProps> = ({ fallbackIconSize = 40, className, alt = "", ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <div className={`absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-gray-100 ${className || ''}`}>
            {/* Loading Placeholder Icon */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center z-0 text-gray-300">
                    <ImageIcon size={fallbackIconSize} strokeWidth={1.5} />
                </div>
            )}

            {/* Actual Image */}
            <Image
                fill
                {...props}
                alt={alt}
                className={`transition-opacity duration-300 ease-in-out z-10 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    } ${className || ''}`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    );
};
