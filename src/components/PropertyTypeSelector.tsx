'use client';

import React from 'react';
import { PropertyType, PROPERTY_TYPE_INFO, StepProps } from '@/types/deed';

export default function PropertyTypeSelector({ 
  data, 
  errors, 
  onUpdate, 
  onNext, 
  isLoading = false 
}: StepProps) {
  const handleTypeSelect = (type: PropertyType) => {
    onUpdate({ 
      propertyType: type,
      propertySize: null // Reset size when type changes
    });
  };

  const canProceed = data.propertyType !== null && !errors.propertyType;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Select Property Type
        </h2>
        <p className="text-gray-300">
          Choose the type of property for your deed NFT
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PROPERTY_TYPE_INFO.map((typeInfo) => {
          const isSelected = data.propertyType === typeInfo.type;
          const isDisabled = isLoading;

          return (
            <button
              key={typeInfo.type}
              onClick={() => handleTypeSelect(typeInfo.type)}
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
              aria-describedby={errors.propertyType ? 'property-type-error' : undefined}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="text-4xl">{typeInfo.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {typeInfo.label}
                  </h3>
                  <p className="text-sm text-gray-300 mt-1">
                    {typeInfo.description}
                  </p>
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
      {errors.propertyType && (
        <div id="property-type-error" className="text-orange-400 text-sm text-center">
          {errors.propertyType}
        </div>
      )}

      {/* Next button */}
      <div className="flex justify-center pt-4">
        <button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all duration-300 defi-button defi-focus
            ${canProceed && !isLoading
              ? 'bg-blue-400 text-white hover:bg-blue-300 defi-glow' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Loading...' : 'Next: Select Size'}
        </button>
      </div>
    </div>
  );
}
