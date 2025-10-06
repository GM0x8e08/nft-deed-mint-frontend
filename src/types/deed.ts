// Property types and enums
export enum PropertyType {
  HOUSE = 0,
  APARTMENT = 1,
  COMMERCIAL = 2
}

// Property size options for each type
export const PROPERTY_SIZE_OPTIONS = {
  [PropertyType.HOUSE]: [150, 220],
  [PropertyType.APARTMENT]: [90, 120],
  [PropertyType.COMMERCIAL]: [500, 1500]
} as const;

// Pricing structure (in ETH)
export const PROPERTY_PRICING = {
  90: 0.01,   // Apartment 90m²
  120: 0.01,  // Apartment 120m²
  150: 0.02,  // House 150m²
  220: 0.03,  // House 220m²
  500: 0.04,  // Commercial 500m²
  1500: 0.05  // Commercial 1500m²
} as const;

// Form state interfaces
export interface DeedFormData {
  propertyType: PropertyType | null;
  propertySize: number | null;
  propertyAddress: string;
  legalDescription: string;
}

// Validation types
export interface ValidationErrors {
  propertyType?: string;
  propertySize?: string;
  propertyAddress?: string;
  legalDescription?: string;
  general?: string;
}

// Component props interfaces
export interface StepProps {
  data: DeedFormData;
  errors: ValidationErrors;
  onUpdate: (data: Partial<DeedFormData>) => void;
  onNext: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
}

// Property type display information
export interface PropertyTypeInfo {
  type: PropertyType;
  label: string;
  icon: string;
  description: string;
}

// Property type display data
export const PROPERTY_TYPE_INFO: PropertyTypeInfo[] = [
  {
    type: PropertyType.HOUSE,
    label: 'House',
    icon: '🏠',
    description: 'Single-family residential property'
  },
  {
    type: PropertyType.APARTMENT,
    label: 'Apartment',
    icon: '🏢',
    description: 'Multi-unit residential building'
  },
  {
    type: PropertyType.COMMERCIAL,
    label: 'Commercial',
    icon: '🏬',
    description: 'Business or commercial property'
  }
];

// Form step definitions
export enum FormStep {
  PROPERTY_TYPE = 1,
  PROPERTY_SIZE = 2,
  ADDRESS_INPUT = 3,
  LEGAL_DESCRIPTION = 4,
  REVIEW_MINT = 5
}

// Step configuration
export const FORM_STEPS = {
  [FormStep.PROPERTY_TYPE]: {
    title: 'Select Property Type',
    description: 'Choose the type of property for your deed NFT'
  },
  [FormStep.PROPERTY_SIZE]: {
    title: 'Select Property Size',
    description: 'Choose the size of your property'
  },
  [FormStep.ADDRESS_INPUT]: {
    title: 'Property Address',
    description: 'Enter the complete property address'
  },
  [FormStep.LEGAL_DESCRIPTION]: {
    title: 'Legal Description',
    description: 'Add additional legal details (optional)'
  },
  [FormStep.REVIEW_MINT]: {
    title: 'Review & Mint',
    description: 'Review your information and mint your deed NFT'
  }
} as const;

// Transaction status types
export enum TransactionStatus {
  IDLE = 'idle',
  PREPARING = 'preparing',
  UPLOADING_METADATA = 'uploading_metadata',
  MINTING = 'minting',
  CONFIRMING = 'confirming',
  SUCCESS = 'success',
  ERROR = 'error'
}

// Minting result interface
export interface MintingResult {
  success: boolean;
  transactionHash?: string;
  tokenId?: number;
  error?: string;
}

// Validation rules
export const VALIDATION_RULES = {
  propertyAddress: {
    required: true,
    minLength: 10,
    maxLength: 200,
    pattern: /^[a-zA-Z0-9\s,.-]+$/
  },
  legalDescription: {
    required: false,
    maxLength: 500
  }
} as const;
