'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { getPropertyImageSafe, testImageAccessibility } from '@/lib/placeholderImages';

interface PropertyImageWithFallbackProps {
  type: string;
  size: number;
  alt?: string;
  className?: string;
  onError?: () => void;
  onSuccess?: () => void;
}

export default function PropertyImageWithFallback({
  type,
  size,
  alt = 'Property image',
  className = '',
  onError,
  onSuccess
}: PropertyImageWithFallbackProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isIPFS, setIsIPFS] = useState(false);

  useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        setHasError(false);

        const imageData = getPropertyImageSafe(type, size);
        setImageUrl(imageData.localUrl); // Start with local fallback
        setIsIPFS(imageData.hasIPFS);

        // If we have an IPFS URL, test its accessibility
        if (imageData.hasIPFS) {
          const isAccessible = await testImageAccessibility(imageData.ipfsUrl);
          
          if (isAccessible) {
            setImageUrl(imageData.ipfsUrl);
            onSuccess?.();
          } else {
            console.warn(`IPFS image not accessible, using local fallback: ${imageData.ipfsUrl}`);
            // Keep local URL as fallback
          }
        } else {
          onSuccess?.();
        }
      } catch (error) {
        console.error('Error loading property image:', error);
        setHasError(true);
        onError?.();
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [type, size, onError, onSuccess]);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">Loading image...</div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-gray-500 text-sm text-center">
          <div className="text-2xl mb-2">🖼️</div>
          <div>Image unavailable</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className="object-cover rounded-lg"
        onError={() => {
          setHasError(true);
          onError?.();
        }}
        onLoad={() => {
          onSuccess?.();
        }}
        unoptimized // For IPFS images
      />
      {isIPFS && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          IPFS
        </div>
      )}
    </div>
  );
}
