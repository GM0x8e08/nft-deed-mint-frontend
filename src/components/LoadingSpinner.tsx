'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
  'aria-label'?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

export default function LoadingSpinner({ 
  size = 'md', 
  text, 
  className = '',
  'aria-label': ariaLabel,
  'aria-live': ariaLive = 'polite'
}: LoadingSpinnerProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-2 ${className}`}>
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-gray-600 border-t-blue-400`}
        role="status"
        aria-label={ariaLabel || text || 'Loading'}
        aria-live={ariaLive}
      />
      {text && (
        <p 
          className={`text-gray-300 ${textSizeClasses[size]}`}
          aria-live={ariaLive}
        >
          {text}
        </p>
      )}
    </div>
  );
}
