'use client';

import React from 'react';
import { PROPERTY_SIZE_OPTIONS, PROPERTY_PRICING, StepProps } from '@/types/deed';
import { PropertyType } from '@/lib/contract';

export default function PropertySizeSelector({ 
  data, 
  errors, 
  onUpdate, 
  onNext, 
  onPrevious,
  isLoading = false 
}: StepProps) {
  const selectedType = data.propertyType;
  
  if (selectedType === null || selectedType === undefined) {
    return (
      <div className="text-center text-gray-500">
        Please select a property type first.
      </div>
    );
  }

  const sizeOptions = PROPERTY_SIZE_OPTIONS[selectedType];
  const typeInfo = {
    [PropertyType.House]: { label: 'House', icon: '🏠' },
    [PropertyType.Apartment]: { label: 'Apartment', icon: '🏢' },
    [PropertyType.Commercial]: { label: 'Commercial', icon: '🏬' }
  }[selectedType];

  const handleSizeSelect = (size: number) => {
    onUpdate({ propertySize: size });
  };

  const canProceed = data.propertySize !== null && !errors.propertySize;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Select Property Size
        </h2>
        <p className="text-gray-300">
          Choose the size of your {typeInfo.label.toLowerCase()}
        </p>
        <div className="flex items-center justify-center mt-2">
          <span className="text-2xl mr-2">{typeInfo.icon}</span>
          <span className="text-lg font-medium text-gray-300">{typeInfo.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {sizeOptions.map((size) => {
          const isSelected = data.propertySize === size;
          const price = PROPERTY_PRICING[size as keyof typeof PROPERTY_PRICING];
          const isDisabled = isLoading;

          return (
            <button
              key={size}
              onClick={() => handleSizeSelect(size)}
              disabled={isDisabled}
              className={`
                relative p-6 rounded-lg border-2 transition-all duration-300 text-left defi-card defi-focus
                ${isSelected 
                  ? 'border-blue-400 defi-glow bg-blue-900/20 defi-glow-pulse' 
                  : 'border-gray-600 hover:border-blue-400 hover:defi-glow'
                }
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
              aria-pressed={isSelected}
              aria-describedby={errors.propertySize ? 'property-size-error' : undefined}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {size}m²
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {(() => {
                      const sizeDescriptions: Record<number, string> = {
                        90: 'Compact apartment',
                        120: 'Spacious apartment',
                        150: 'Family house',
                        220: 'Large family house',
                        500: 'Small commercial space',
                        1500: 'Large commercial complex'
                      };
                      return sizeDescriptions[size] || '';
                    })()}
                  </p>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">
                    {price} ETH
                  </div>
                  <div className="text-xs text-gray-400">
                    Minting price
                  </div>
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center defi-glow">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Error message */}
      {errors.propertySize && (
        <div id="property-size-error" className="text-orange-400 text-sm text-center">
          {errors.propertySize}
        </div>
      )}

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
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className={`
            px-8 py-3 rounded-lg font-medium transition-colors
            ${canProceed && !isLoading
              ? 'bg-blue-400 text-white hover:bg-blue-300 defi-glow defi-button' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Loading...' : 'Next: Enter Address'}
        </button>
      </div>
    </div>
  );
}
