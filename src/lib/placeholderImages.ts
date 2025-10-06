// Auto-generated placeholder image mappings
// Generated on: 2025-09-30T17:19:27.180Z

export interface PropertyImage {
  type: 'house' | 'apartment' | 'commercial';
  size: number;
  filename: string;
  ipfsHash: string;
  ipfsUrl: string;
  pinSize: number;
  timestamp: string;
}

export const PROPERTY_IMAGES: Record<string, PropertyImage> = {
  "house-150": {
    "type": "house",
    "size": 150,
    "filename": "house150m.png",
    "ipfsHash": "QmebmmFP5mwZTVuAkWw5WXGNoPxFPLhrWDZYPj9etMgKJm",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmebmmFP5mwZTVuAkWw5WXGNoPxFPLhrWDZYPj9etMgKJm",
    "pinSize": 301115,
    "timestamp": "2025-09-30T17:18:55.111Z"
  },
  "house-220": {
    "type": "house",
    "size": 220,
    "filename": "house220.png",
    "ipfsHash": "QmTCHwfk4aH5TKHGLqQXpWshuNwBQEuSB17TWiQttCrXtq",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmTCHwfk4aH5TKHGLqQXpWshuNwBQEuSB17TWiQttCrXtq",
    "pinSize": 294975,
    "timestamp": "2025-09-30T17:19:00.845Z"
  },
  "apartment-90": {
    "type": "apartment",
    "size": 90,
    "filename": "apt90m.png",
    "ipfsHash": "QmU1grko7AvYuvX7bfTQSzSiHJAY4Rb8MgyqP4M9EwxPJF",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmU1grko7AvYuvX7bfTQSzSiHJAY4Rb8MgyqP4M9EwxPJF",
    "pinSize": 208095,
    "timestamp": "2025-09-30T17:19:07.525Z"
  },
  "apartment-120": {
    "type": "apartment",
    "size": 120,
    "filename": "apt120m.png",
    "ipfsHash": "QmYmYmKHQCZBHZKMUzUfew4pcbQZH3ajB7v76k63CeBa2i",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmYmYmKHQCZBHZKMUzUfew4pcbQZH3ajB7v76k63CeBa2i",
    "pinSize": 206069,
    "timestamp": "2025-09-30T17:19:14.303Z"
  },
  "commercial-500": {
    "type": "commercial",
    "size": 500,
    "filename": "cmrc500m.png",
    "ipfsHash": "QmbJRSUtu4xgH5i1YtoZdDau6AEwpieBVvziGxaQnis9Q3",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmbJRSUtu4xgH5i1YtoZdDau6AEwpieBVvziGxaQnis9Q3",
    "pinSize": 276583,
    "timestamp": "2025-09-30T17:19:22.080Z"
  },
  "commercial-1500": {
    "type": "commercial",
    "size": 1500,
    "filename": "cmrc1500m.png",
    "ipfsHash": "QmfW9x8yWvfLZ8JckrcbqbAXtbc6acvh1zdbMeZN6kntgC",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmfW9x8yWvfLZ8JckrcbqbAXtbc6acvh1zdbMeZN6kntgC",
    "pinSize": 296599,
    "timestamp": "2025-09-30T17:19:27.180Z"
  }
};

export function getPropertyImage(type: string, size: number): string {
  const key = `${type}-${size}`;
  const image = PROPERTY_IMAGES[key];
  if (image) {
    return `ipfs://${image.ipfsHash}`;
  }
  return 'ipfs://QmebmmFP5mwZTVuAkWw5WXGNoPxFPLhrWDZYPj9etMgKJm'; // Default house image
}

// Enhanced function to get property image with error handling and fallback
export function getPropertyImageSafe(type: string, size: number): {
  ipfsUrl: string;
  localUrl: string;
  hasIPFS: boolean;
} {
  const key = `${type}-${size}`;
  const image = PROPERTY_IMAGES[key];
  
  if (image) {
    return {
      ipfsUrl: image.ipfsUrl,
      localUrl: `/images/${image.filename}`,
      hasIPFS: true
    };
  }
  
  // Fallback to default image
  return {
    ipfsUrl: 'ipfs://QmebmmFP5mwZTVuAkWw5WXGNoPxFPLhrWDZYPj9etMgKJm',
    localUrl: '/images/placeholders/default.png',
    hasIPFS: true
  };
}

// Function to test IPFS image accessibility
export async function testImageAccessibility(ipfsUrl: string): Promise<boolean> {
  try {
    const response = await fetch(ipfsUrl, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

export function getPropertyImageByKey(key: string): PropertyImage | undefined {
  return PROPERTY_IMAGES[key];
}

// Helper function to get all images for a specific property type
export function getImagesByType(type: 'house' | 'apartment' | 'commercial'): PropertyImage[] {
  return Object.values(PROPERTY_IMAGES).filter(img => img.type === type);
}

// Helper function to get all available sizes for a property type
export function getSizesByType(type: 'house' | 'apartment' | 'commercial'): number[] {
  return getImagesByType(type).map(img => img.size).sort((a, b) => a - b);
}

// Helper function to get the local fallback image path
export function getLocalImagePath(type: string, size: number): string {
  const key = `${type}-${size}`;
  const image = PROPERTY_IMAGES[key];
  return image ? `/images/${image.filename}` : '/images/placeholders/default.png';
}