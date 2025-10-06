'use client';

import React, { useEffect } from 'react';
import { MintingResult } from '@/types/deed';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: MintingResult;
}

export default function SuccessModal({ isOpen, onClose, result }: SuccessModalProps) {
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isSuccess = result.success;
  const title = isSuccess ? 'NFT Minted Successfully!' : 'Minting Failed';
  const icon = isSuccess ? '🎉' : '❌';
  const bgColor = isSuccess ? 'bg-green-900/20' : 'bg-red-900/20';
  const borderColor = isSuccess ? 'border-green-400/30' : 'border-red-400/30';
  const textColor = isSuccess ? 'text-green-200' : 'text-red-200';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className={`relative w-full max-w-md rounded-lg border-2 ${borderColor} ${bgColor} p-6 shadow-xl defi-card ${isSuccess ? 'defi-glow-green' : 'defi-glow-orange'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-200"
          aria-label="Close modal"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          <div className="text-4xl mb-4">{icon}</div>
          
          <h2 id="modal-title" className={`text-xl font-bold mb-4 ${textColor}`}>
            {title}
          </h2>

          {isSuccess ? (
            <div className="space-y-3">
              <p className="text-gray-300">
                Your deed NFT has been successfully minted!
              </p>
              
              {result.tokenId && (
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                  <p className="text-sm text-gray-400">Token ID</p>
                  <p className="font-mono text-lg font-bold text-white">#{result.tokenId}</p>
                </div>
              )}
              
              {result.transactionHash && (
                <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-600">
                  <p className="text-sm text-gray-400">Transaction Hash</p>
                  <p className="font-mono text-xs break-all text-gray-300">
                    {result.transactionHash}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-300">
                {result.error || 'An error occurred while minting your NFT.'}
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-6 flex space-x-3">
            {isSuccess && result.transactionHash && (
              <a
                href={`https://sepolia.basescan.org/tx/${result.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-300 defi-glow defi-button defi-focus transition-all duration-300"
              >
                View on Basescan
              </a>
            )}
            
            <button
              onClick={onClose}
              className={`flex-1 px-4 py-2 rounded-lg transition-all duration-300 defi-button defi-focus ${
                isSuccess 
                  ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                  : 'bg-red-400 text-white hover:bg-red-300 defi-glow-orange'
              }`}
            >
              {isSuccess ? 'Close' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
