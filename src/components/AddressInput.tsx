'use client';

import React, { useState, useEffect } from 'react';
import { StepProps, VALIDATION_RULES } from '@/types/deed';

export default function AddressInput({ 
  data, 
  errors, 
  onUpdate, 
  onNext, 
  onPrevious,
  isLoading = false 
}: StepProps) {
  const [localAddress, setLocalAddress] = useState(data.propertyAddress);

  // Update local state when data changes
  useEffect(() => {
    setLocalAddress(data.propertyAddress);
  }, [data.propertyAddress]);

  const handleAddressChange = (value: string) => {
    setLocalAddress(value);
    onUpdate({ propertyAddress: value });
    // Clear any existing errors when user types
    if (errors.propertyAddress) {
      onUpdate({ propertyAddress: value });
    }
  };

  const validateAddress = (address: string): string | null => {
    if (!address.trim()) {
      return 'Property address is required';
    }
    
    if (address.length < VALIDATION_RULES.propertyAddress.minLength) {
      return `Address must be at least ${VALIDATION_RULES.propertyAddress.minLength} characters`;
    }
    
    if (address.length > VALIDATION_RULES.propertyAddress.maxLength) {
      return `Address must be no more than ${VALIDATION_RULES.propertyAddress.maxLength} characters`;
    }
    
    if (!VALIDATION_RULES.propertyAddress.pattern.test(address)) {
      return 'Address contains invalid characters. Only letters, numbers, spaces, commas, periods, and hyphens are allowed';
    }
    
    return null;
  };

  const handleNext = () => {
    const validationError = validateAddress(localAddress);
    if (validationError) {
      onUpdate({ propertyAddress: localAddress });
      return;
    }
    onNext();
  };

  const canProceed = localAddress.trim().length >= VALIDATION_RULES.propertyAddress.minLength;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Property Address
        </h2>
        <p className="text-gray-300">
          Enter the complete property address
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="property-address" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Property Address *
            </label>
            <textarea
              id="property-address"
              value={localAddress}
              onChange={(e) => handleAddressChange(e.target.value)}
              disabled={isLoading}
              placeholder="e.g., 123 Main Street, New York, NY 10001, United States"
              className={`
                w-full px-4 py-3 border-2 rounded-lg resize-none transition-all duration-300 defi-card defi-focus
                focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent
                ${errors.propertyAddress 
                  ? 'border-orange-400 bg-orange-900/20 defi-glow-orange' 
                  : 'border-gray-600 focus:border-blue-400'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                text-white placeholder-gray-400
              `}
              rows={3}
              maxLength={VALIDATION_RULES.propertyAddress.maxLength}
              aria-describedby={errors.propertyAddress ? 'address-error' : 'address-help'}
            />
            
            {/* Character count */}
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>
                {localAddress.length} / {VALIDATION_RULES.propertyAddress.maxLength} characters
              </span>
              <span>
                Minimum {VALIDATION_RULES.propertyAddress.minLength} characters
              </span>
            </div>
          </div>

          {/* Help text */}
          <div id="address-help" className="text-sm text-gray-300 bg-blue-900/20 p-3 rounded-lg border border-blue-400/30">
            <p className="font-medium mb-1">Address Format:</p>
            <p>Include street address, city, state/region, postal code, and country for best results.</p>
          </div>

          {/* Error message */}
          {errors.propertyAddress && (
            <div id="address-error" className="text-orange-400 text-sm bg-orange-900/20 p-3 rounded-lg border border-orange-400/30">
              {errors.propertyAddress}
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevious}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg font-medium bg-gray-600 text-gray-300 hover:bg-gray-500 transition-all duration-300 defi-button defi-focus disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={!canProceed || isLoading}
          className={`
            px-8 py-3 rounded-lg font-medium transition-colors
            ${canProceed && !isLoading
              ? 'bg-blue-400 text-white hover:bg-blue-300 defi-glow defi-button' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Loading...' : 'Next: Legal Description'}
        </button>
      </div>
    </div>
  );
}
