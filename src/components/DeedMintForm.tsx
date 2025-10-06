'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  DeedFormData, 
  ValidationErrors, 
  FormStep, 
  FORM_STEPS, 
  VALIDATION_RULES 
} from '@/types/deed';
import { PropertyType } from '@/lib/contract';
import { 
  useIsAddressUsed,
  useHasWalletDeed,
  useRemainingSupply,
  useMintingActive,
  useMintingPrice,
  useContract
} from '@/hooks/useContract';
import PropertyTypeSelector from './PropertyTypeSelector';
import PropertySizeSelector from './PropertySizeSelector';
import AddressInput from './AddressInput';
import LoadingSpinner from './LoadingSpinner';

interface DeedMintFormProps {
  onMint: (formData: DeedFormData) => void;
  isLoading?: boolean;
}

export default function DeedMintForm({ onMint, isLoading = false }: DeedMintFormProps) {
  const { isConnected, address } = useAccount();
  
  // Form state
  const [currentStep, setCurrentStep] = useState<FormStep>(FormStep.PROPERTY_TYPE);
  const [formData, setFormData] = useState<DeedFormData>({
    propertyType: null,
    propertySize: null,
    propertyAddress: '',
    legalDescription: ''
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [contractErrors, setContractErrors] = useState<ValidationErrors>({});
  const [shouldValidate, setShouldValidate] = useState(false);

  // Contract hooks - conditional validation
  const { isDeployed } = useContract();
  const { data: isAddressUsed, isLoading: checkingAddress } = useIsAddressUsed(
    shouldValidate ? formData.propertyAddress : ''
  );
  const { data: hasWalletDeed, isLoading: checkingWallet } = useHasWalletDeed(
    shouldValidate ? address : undefined
  );
  const { data: remainingSupply, isLoading: checkingSupply } = useRemainingSupply();
  const { data: mintingActive, isLoading: checkingMinting } = useMintingActive();
  const { isLoading: checkingPrice } = useMintingPrice(formData.propertySize || 0);

  // Reset form when wallet disconnects
  useEffect(() => {
    if (!isConnected) {
      setCurrentStep(FormStep.PROPERTY_TYPE);
      setFormData({
        propertyType: null,
        propertySize: null,
        propertyAddress: '',
        legalDescription: ''
      });
      setErrors({});
      setContractErrors({});
    }
  }, [isConnected]);

  // Contract validation - only when shouldValidate is true
  useEffect(() => {
    if (!shouldValidate) return; // Only validate when needed
    
    const newContractErrors: ValidationErrors = {};

    // Check if contract is deployed
    if (!isDeployed) {
      newContractErrors.general = 'Contract is not deployed on this network. Please switch to Base Sepolia testnet.';
    }

    // Check if address is already used (only if address is not empty)
    if (formData.propertyAddress.trim() && !checkingAddress) {
      if (isAddressUsed) {
        newContractErrors.propertyAddress = 'This property address has already been used to mint an NFT.';
      }
    }

    // Check if wallet already has a deed
    if (!checkingWallet && hasWalletDeed) {
      newContractErrors.general = 'You can only mint one deed NFT per wallet.';
    }

    // Check remaining supply
    if (!checkingSupply && remainingSupply !== undefined && remainingSupply <= 0) {
      newContractErrors.general = 'No more deed NFTs available for minting.';
    }

    // Check if minting is active
    if (!checkingMinting && mintingActive === false) {
      newContractErrors.general = 'Minting is currently disabled.';
    }

    setContractErrors(newContractErrors);
  }, [shouldValidate, isDeployed, isAddressUsed, hasWalletDeed, remainingSupply, mintingActive, checkingAddress, checkingWallet, checkingSupply, checkingMinting, formData.propertyAddress]);

  // Form validation
  const validateStep = (step: FormStep): boolean => {
    const newErrors: ValidationErrors = {};

    // Check for contract errors first
    if (Object.keys(contractErrors).length > 0) {
      setErrors({ ...errors, ...contractErrors });
      return false;
    }

    switch (step) {
      case FormStep.PROPERTY_TYPE:
        if (formData.propertyType === null || formData.propertyType === undefined) {
          newErrors.propertyType = 'Please select a property type';
        }
        break;

      case FormStep.PROPERTY_SIZE:
        if (formData.propertySize === null || formData.propertySize === undefined) {
          newErrors.propertySize = 'Please select a property size';
        }
        break;

      case FormStep.ADDRESS_INPUT:
        if (!formData.propertyAddress.trim()) {
          newErrors.propertyAddress = 'Property address is required';
        } else if (formData.propertyAddress.length < VALIDATION_RULES.propertyAddress.minLength) {
          newErrors.propertyAddress = `Address must be at least ${VALIDATION_RULES.propertyAddress.minLength} characters`;
        } else if (formData.propertyAddress.length > VALIDATION_RULES.propertyAddress.maxLength) {
          newErrors.propertyAddress = `Address must be no more than ${VALIDATION_RULES.propertyAddress.maxLength} characters`;
        } else if (!VALIDATION_RULES.propertyAddress.pattern.test(formData.propertyAddress)) {
          newErrors.propertyAddress = 'Address contains invalid characters';
        }
        break;

      case FormStep.LEGAL_DESCRIPTION:
        if (formData.legalDescription.length > VALIDATION_RULES.legalDescription.maxLength) {
          newErrors.legalDescription = `Description must be no more than ${VALIDATION_RULES.legalDescription.maxLength} characters`;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Navigation handlers
  const handleNext = () => {
    setShouldValidate(true); // Trigger validation
    if (validateStep(currentStep)) {
      const nextStep = currentStep + 1;
      if (nextStep <= FormStep.REVIEW_MINT) {
        setCurrentStep(nextStep as FormStep);
      }
    }
  };

  const handlePrevious = () => {
    const prevStep = currentStep - 1;
    if (prevStep >= FormStep.PROPERTY_TYPE) {
      setCurrentStep(prevStep as FormStep);
      setShouldValidate(false); // Reset validation state when going back
      // Clear errors when going back
      setErrors({});
    }
  };

  const handleUpdate = (data: Partial<DeedFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setShouldValidate(false); // Reset validation state when user types
    // Clear related errors when data is updated
    const newErrors = { ...errors };
    Object.keys(data).forEach(key => {
      delete newErrors[key as keyof ValidationErrors];
    });
    setErrors(newErrors);
  };

  // Check if any contract validation is in progress
  const isContractValidating = checkingAddress || checkingWallet || checkingSupply || checkingMinting || checkingPrice;

  // Check if form can proceed (no contract errors and not validating)
  const canProceed = Object.keys(contractErrors).length === 0 && !isContractValidating;

  const handleMint = () => {
    if (validateStep(currentStep)) {
      onMint(formData);
    }
  };

  // Render current step
  const renderCurrentStep = () => {
    const stepProps = {
      data: formData,
      errors: { ...errors, ...contractErrors },
      onUpdate: handleUpdate,
      onNext: handleNext,
      onPrevious: currentStep > FormStep.PROPERTY_TYPE ? handlePrevious : undefined,
      isLoading: isLoading || isContractValidating
    };

    switch (currentStep) {
      case FormStep.PROPERTY_TYPE:
        return <PropertyTypeSelector {...stepProps} />;
      
      case FormStep.PROPERTY_SIZE:
        return <PropertySizeSelector {...stepProps} />;
      
      case FormStep.ADDRESS_INPUT:
        return <AddressInput {...stepProps} />;
      
      case FormStep.LEGAL_DESCRIPTION:
        return <LegalDescriptionStep {...stepProps} />;
      
      case FormStep.REVIEW_MINT:
        return <ReviewMintStep {...stepProps} onMint={handleMint} canProceed={canProceed} />;
      
      default:
        return null;
    }
  };

  // Show wallet connection requirement
  if (!isConnected) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔗</div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-gray-300 mb-6">
            Please connect your wallet to start minting your deed NFT
          </p>
          <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              You&apos;ll need a wallet with Base Sepolia testnet ETH to mint your NFT
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show contract validation errors
  if (contractErrors.general) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-400 mb-4">
            Cannot Proceed
          </h2>
          <p className="text-gray-300 mb-6">
            {contractErrors.general}
          </p>
          <div className="bg-red-900/20 border border-red-400/30 rounded-lg p-4">
            <p className="text-sm text-red-300">
              Please resolve this issue before continuing with the minting process.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Step labels for progress indicator
  const stepLabels = {
    1: 'Property',
    2: 'Size', 
    3: 'Address',
    4: 'About',
    5: 'Mint'
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-6 sm:mb-8">
        {/* Large Desktop: Full horizontal layout with connecting lines */}
        <div className="hidden xl:flex items-center justify-center mb-4">
          <div className="flex items-center">
            {Object.values(FormStep).filter(step => typeof step === 'number').map((step) => {
              const stepNumber = step as number;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              const stepInfo = FORM_STEPS[stepNumber as FormStep];

              return (
                <div key={stepNumber} className="flex items-center">
                  <div 
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-base font-bold
                      transition-all duration-300 defi-button
                      ${isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white defi-glow-green shadow-lg' 
                        : isActive 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white defi-glow shadow-lg defi-pulse' 
                          : 'bg-gray-700 text-gray-400 border border-gray-600 hover:border-gray-500'
                      }
                    `}
                    role="progressbar"
                    aria-valuenow={stepNumber}
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-label={`Step ${stepNumber}: ${stepInfo.title}`}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium transition-colors duration-300 ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                      {stepLabels[stepNumber as keyof typeof stepLabels]}
                    </p>
                  </div>
                  {stepNumber < FormStep.REVIEW_MINT && (
                    <div className={`
                      w-12 h-0.5 mx-4 transition-all duration-300
                      ${isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 defi-glow-green' 
                        : isActive
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 defi-glow'
                          : 'bg-gray-600'
                      }
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Medium Desktop/Tablet: Compact horizontal layout */}
        <div className="hidden lg:flex xl:hidden items-center justify-center mb-4">
          <div className="flex items-center space-x-3">
            {Object.values(FormStep).filter(step => typeof step === 'number').map((step) => {
              const stepNumber = step as number;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              const stepInfo = FORM_STEPS[stepNumber as FormStep];

              return (
                <div key={stepNumber} className="flex items-center">
                  <div 
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      transition-all duration-300 defi-button
                      ${isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white defi-glow-green shadow-lg' 
                        : isActive 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white defi-glow shadow-lg defi-pulse' 
                          : 'bg-gray-700 text-gray-400 border border-gray-600 hover:border-gray-500'
                      }
                    `}
                    role="progressbar"
                    aria-valuenow={stepNumber}
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-label={`Step ${stepNumber}: ${stepInfo.title}`}
                  >
                    {isCompleted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <div className="ml-2">
                    <p className={`text-xs font-medium transition-colors duration-300 ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                      {stepLabels[stepNumber as keyof typeof stepLabels]}
                    </p>
                  </div>
                  {stepNumber < FormStep.REVIEW_MINT && (
                    <div className={`
                      w-4 h-0.5 mx-2 transition-all duration-300
                      ${isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 defi-glow-green' 
                        : isActive
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 defi-glow'
                          : 'bg-gray-600'
                      }
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: Compact grid layout */}
        <div className="lg:hidden">
          <div className="grid grid-cols-5 gap-1 sm:gap-2 mb-4">
            {Object.values(FormStep).filter(step => typeof step === 'number').map((step) => {
              const stepNumber = step as number;
              const isActive = currentStep === stepNumber;
              const isCompleted = currentStep > stepNumber;
              const stepInfo = FORM_STEPS[stepNumber as FormStep];

              return (
                <div key={stepNumber} className="flex flex-col items-center">
                  <div 
                    className={`
                      w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold
                      transition-all duration-300 defi-button
                      ${isCompleted 
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white defi-glow-green shadow-lg' 
                        : isActive 
                          ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white defi-glow shadow-lg defi-pulse' 
                          : 'bg-gray-700 text-gray-400 border border-gray-600'
                      }
                    `}
                    role="progressbar"
                    aria-valuenow={stepNumber}
                    aria-valuemin={1}
                    aria-valuemax={5}
                    aria-label={`Step ${stepNumber}: ${stepInfo.title}`}
                  >
                    {isCompleted ? (
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      stepNumber
                    )}
                  </div>
                  <p className={`text-xs font-medium mt-1 text-center transition-colors duration-300 ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-400'}`}>
                    {stepLabels[stepNumber as keyof typeof stepLabels]}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Mobile progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-1 mb-2">
            <div 
              className="bg-gradient-to-r from-blue-400 to-blue-500 h-1 rounded-full transition-all duration-500 defi-glow"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
          <p className="text-center text-sm text-gray-400">
            Step {currentStep} of 5
          </p>
        </div>
        
        {/* Current step info */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            {FORM_STEPS[currentStep].title}
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            {FORM_STEPS[currentStep].description}
          </p>
        </div>
      </div>

      {/* Contract validation status */}
      {isContractValidating && (
        <div className="mb-6 bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-center">
            <LoadingSpinner size="sm" text="" />
            <span className="ml-2 text-blue-300 text-sm">
              Validating contract information...
            </span>
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="defi-card rounded-lg p-4 sm:p-6 md:p-8">
        {isLoading || isContractValidating ? (
          <div className="flex justify-center py-8 sm:py-12">
            <LoadingSpinner 
              size="lg" 
              text={isContractValidating ? "Validating..." : "Processing..."}
              aria-live="assertive"
            />
          </div>
        ) : (
          renderCurrentStep()
        )}
      </div>
    </div>
  );
}

// Legal Description Step Component
function LegalDescriptionStep({ 
  data, 
  errors, 
  onUpdate, 
  onNext, 
  onPrevious,
  isLoading = false 
}: {
  data: DeedFormData;
  errors: ValidationErrors;
  onUpdate: (data: Partial<DeedFormData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
}) {
  const [localDescription, setLocalDescription] = useState(data.legalDescription);

  useEffect(() => {
    setLocalDescription(data.legalDescription);
  }, [data.legalDescription]);

  const handleDescriptionChange = (value: string) => {
    setLocalDescription(value);
    onUpdate({ legalDescription: value });
  };

  const canProceed = localDescription.length <= VALIDATION_RULES.legalDescription.maxLength && 
                    !errors.legalDescription;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Legal Description
        </h2>
        <p className="text-gray-300">
          Add additional legal details (optional)
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label 
              htmlFor="legal-description" 
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Legal Description
            </label>
            <textarea
              id="legal-description"
              value={localDescription}
              onChange={(e) => handleDescriptionChange(e.target.value)}
              disabled={isLoading}
              placeholder="e.g., Lot 15, Block 3, Subdivision ABC, as recorded in Book 123, Page 456..."
              className={`
                w-full px-4 py-3 border-2 rounded-lg resize-none transition-all duration-300
                focus:outline-none defi-focus
                ${errors.legalDescription 
                  ? 'border-red-400 bg-red-900/20 text-red-100 placeholder-red-300' 
                  : 'border-gray-600 bg-gray-800/50 text-white placeholder-gray-400 focus:border-blue-400 focus:bg-gray-800/70'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              rows={4}
              maxLength={VALIDATION_RULES.legalDescription.maxLength}
              aria-describedby={errors.legalDescription ? 'legal-description-error' : 'legal-description-help'}
            />
            
            {/* Character count */}
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>
                {localDescription.length} / {VALIDATION_RULES.legalDescription.maxLength} characters
              </span>
              <span>Optional field</span>
            </div>
          </div>

          {/* Help text */}
          <div id="legal-description-help" className="text-sm text-gray-300 bg-blue-900/20 border border-blue-400/30 p-3 rounded-lg">
            <p className="font-medium mb-1 text-blue-300">Legal Description:</p>
            <p>Include any additional legal details about the property such as lot numbers, subdivision names, or other identifying information.</p>
          </div>

          {/* Error message */}
          {errors.legalDescription && (
            <div id="legal-description-error" className="text-red-300 text-sm bg-red-900/20 border border-red-400/30 p-3 rounded-lg">
              {errors.legalDescription}
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevious}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed defi-button"
        >
          ← Back
        </button>
        
        <button
          onClick={onNext}
          disabled={!canProceed || isLoading}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all duration-300 defi-button
            ${canProceed && !isLoading
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 defi-glow' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Loading...' : 'Next: Review & Mint'}
        </button>
      </div>
    </div>
  );
}

// Review Mint Step Component
function ReviewMintStep({ 
  data, 
  onPrevious,
  onMint,
  isLoading = false,
  canProceed = true
}: {
  data: DeedFormData;
  onPrevious?: () => void;
  onMint: () => void;
  isLoading?: boolean;
  canProceed?: boolean;
}) {
  const propertyTypeInfo = {
    [PropertyType.House]: { label: 'House', icon: '🏠' },
    [PropertyType.Apartment]: { label: 'Apartment', icon: '🏢' },
    [PropertyType.Commercial]: { label: 'Commercial', icon: '🏬' }
  }[data.propertyType!];

  const price = data.propertySize ? {
    90: 0.01, 120: 0.02, 150: 0.02, 220: 0.03, 500: 0.04, 1500: 0.05
  }[data.propertySize] || 0 : 0;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          Review & Mint
        </h2>
        <p className="text-gray-300">
          Review your information and mint your deed NFT
        </p>
      </div>

      {/* Review content */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Property details */}
        <div className="defi-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Property Details</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Type:</span>
              <div className="flex items-center">
                <span className="text-xl mr-2">{propertyTypeInfo.icon}</span>
                <span className="font-medium text-white">{propertyTypeInfo.label}</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Size:</span>
              <span className="font-medium text-white">{data.propertySize}m²</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-gray-300">Price:</span>
              <span className="font-bold text-blue-400">{price} ETH</span>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="defi-card rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Property Address</h3>
          <p className="text-gray-300 whitespace-pre-wrap">{data.propertyAddress}</p>
        </div>

        {/* Legal description */}
        {data.legalDescription && (
          <div className="defi-card rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Legal Description</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{data.legalDescription}</p>
          </div>
        )}

        {/* Cost summary */}
        <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-4">Cost Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-blue-200">Minting Price:</span>
              <span className="font-medium text-blue-300">{price} ETH</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-200">Gas Fee:</span>
              <span className="font-medium text-blue-300">~0.001 ETH</span>
            </div>
            <div className="border-t border-blue-400/30 pt-2">
              <div className="flex justify-between">
                <span className="font-semibold text-blue-300">Total:</span>
                <span className="font-bold text-blue-200">~{price + 0.001} ETH</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onPrevious}
          disabled={isLoading}
          className="px-6 py-3 rounded-lg font-medium bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed defi-button"
        >
          ← Back
        </button>
        
        <button
          onClick={onMint}
          disabled={isLoading || !canProceed}
          className={`
            px-8 py-3 rounded-lg font-medium transition-all duration-300 defi-button
            ${!isLoading && canProceed
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 defi-glow-green' 
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? 'Minting...' : 'Mint NFT'}
        </button>
      </div>
    </div>
  );
}