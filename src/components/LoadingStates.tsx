'use client';

import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingCardProps {
  title: string;
  description?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingCard({ 
  title, 
  description, 
  size = 'md', 
  className = '' 
}: LoadingCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center ${className}`}>
      <LoadingSpinner size={size} text={title} />
      {description && (
        <p className="mt-4 text-gray-600 dark:text-gray-300 text-sm">
          {description}
        </p>
      )}
    </div>
  );
}

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export function Skeleton({ className = '', lines = 1 }: SkeletonProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </div>
  );
}

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  progress?: number;
}

export function LoadingOverlay({ 
  isVisible, 
  message = 'Loading...', 
  progress 
}: LoadingOverlayProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-sm w-full mx-4 text-center">
        <LoadingSpinner size="lg" text={message} />
        
        {progress !== undefined && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              {Math.round(progress)}% complete
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface LoadingButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function LoadingButton({
  isLoading,
  children,
  loadingText = 'Loading...',
  disabled = false,
  className = '',
  onClick,
  type = 'button'
}: LoadingButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`
        relative px-6 py-3 rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-current border-t-transparent" />
        </div>
      )}
      <span className={isLoading ? 'opacity-0' : 'opacity-100'}>
        {isLoading ? loadingText : children}
      </span>
    </button>
  );
}

interface LoadingTableProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export function LoadingTable({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: LoadingTableProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}>
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: columns }).map((_, index) => (
              <div key={index} className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
          
          {/* Rows */}
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-4 gap-4">
              {Array.from({ length: columns }).map((_, colIndex) => (
                <div 
                  key={colIndex} 
                  className="h-3 bg-gray-200 dark:bg-gray-700 rounded"
                  style={{ width: `${Math.random() * 40 + 60}%` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
