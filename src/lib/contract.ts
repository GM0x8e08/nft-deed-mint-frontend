// Contract ABI for NFTDeedMint
export const NFT_DEED_MINT_ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "baseTokenURI",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "AddressAlreadyMinted",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InsufficientPayment",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidAddress",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidPropertySize",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "InvalidPropertyType",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "MaxSupplyReached",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "MintingNotActive",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "WalletAlreadyHasDeed",
    "type": "error"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "propertyAddress",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "enum NFTDeedMint.PropertyType",
        "name": "propertyType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "propertySize",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "legalDescription",
        "type": "string"
      }
    ],
    "name": "DeedMinted",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "MAX_SUPPLY",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "propertySize",
        "type": "uint256"
      }
    ],
    "name": "getMintingPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getRemainingSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wallet",
        "type": "address"
      }
    ],
    "name": "hasWalletDeed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyAddress",
        "type": "string"
      }
    ],
    "name": "isAddressUsed",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum NFTDeedMint.PropertyType",
        "name": "propertyType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "propertySize",
        "type": "uint256"
      }
    ],
    "name": "isValidPropertyTypeAndSize",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "propertyAddress",
        "type": "string"
      },
      {
        "internalType": "enum NFTDeedMint.PropertyType",
        "name": "propertyType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "propertySize",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "legalDescription",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadataURI",
        "type": "string"
      }
    ],
    "name": "mintDeedNFT",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "mintingActive",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "propertyAddress",
        "type": "string"
      }
    ],
    "name": "normalizeAddress",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "pure",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalSupply",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Base testnet (Sepolia)
  84532: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE_SEPOLIA || '',
  // Base mainnet
  8453: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS_BASE_MAINNET || '',
} as const;

// Property types enum (matching the smart contract)
export enum PropertyType {
  House = 0,
  Apartment = 1,
  Commercial = 2,
}

// Property sizes for each type
export const PROPERTY_SIZES = {
  [PropertyType.House]: [150, 220],
  [PropertyType.Apartment]: [90, 120],
  [PropertyType.Commercial]: [500, 1500],
} as const;

// Pricing structure (in wei)
export const PRICING = {
  90: '10000000000000000', // 0.01 ETH
  120: '15000000000000000', // 0.015 ETH
  150: '20000000000000000', // 0.02 ETH
  220: '30000000000000000', // 0.03 ETH
  500: '40000000000000000', // 0.04 ETH
  1500: '50000000000000000', // 0.05 ETH
} as const;
