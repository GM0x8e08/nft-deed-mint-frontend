import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { NFT_DEED_MINT_ABI, CONTRACT_ADDRESSES, PropertyType } from '@/lib/contract';
import { useChainId } from 'wagmi';

export function useContract() {
  const chainId = useChainId();
  const contractAddress = CONTRACT_ADDRESSES[chainId as keyof typeof CONTRACT_ADDRESSES];

  return {
    contractAddress,
    abi: NFT_DEED_MINT_ABI,
    isDeployed: !!contractAddress,
  };
}

// Hook to get minting price for a property size
export function useMintingPrice(propertySize: number) {
  const { contractAddress, abi, isDeployed } = useContract();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getMintingPrice',
    args: [BigInt(propertySize)],
    query: {
      enabled: isDeployed,
    },
  });
}

// Hook to check if an address is already used
export function useIsAddressUsed(propertyAddress: string) {
  const { contractAddress, abi, isDeployed } = useContract();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'isAddressUsed',
    args: [propertyAddress],
    query: {
      enabled: isDeployed && !!propertyAddress,
    },
  });
}

// Hook to check if wallet already has a deed
export function useHasWalletDeed(walletAddress: `0x${string}` | undefined) {
  const { contractAddress, abi, isDeployed } = useContract();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'hasWalletDeed',
    args: walletAddress ? [walletAddress] : undefined,
    query: {
      enabled: isDeployed && !!walletAddress,
    },
  });
}

// Hook to get remaining supply
export function useRemainingSupply() {
  const { contractAddress, abi, isDeployed } = useContract();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'getRemainingSupply',
    query: {
      enabled: isDeployed,
    },
  });
}

// Hook to check if minting is active
export function useMintingActive() {
  const { contractAddress, abi, isDeployed } = useContract();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'mintingActive',
    query: {
      enabled: isDeployed,
    },
  });
}

// Hook to validate property type and size
export function useValidatePropertyTypeAndSize(propertyType: PropertyType, propertySize: number) {
  const { contractAddress, abi, isDeployed } = useContract();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'isValidPropertyTypeAndSize',
    args: [propertyType, BigInt(propertySize)],
    query: {
      enabled: isDeployed,
    },
  });
}

// Hook to normalize address
export function useNormalizeAddress(propertyAddress: string) {
  const { contractAddress, abi, isDeployed } = useContract();
  
  return useReadContract({
    address: contractAddress as `0x${string}`,
    abi,
    functionName: 'normalizeAddress',
    args: [propertyAddress],
    query: {
      enabled: isDeployed && !!propertyAddress,
    },
  });
}

// Hook for minting NFT
export function useMintDeedNFT() {
  const { contractAddress, abi, isDeployed } = useContract();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  
  const mintDeedNFT = async (
    to: `0x${string}`,
    propertyAddress: string,
    propertyType: PropertyType,
    propertySize: number,
    legalDescription: string,
    metadataURI: string,
    value: bigint
  ) => {
    if (!isDeployed) {
      throw new Error('Contract not deployed on this network');
    }
    
    writeContract({
      address: contractAddress as `0x${string}`,
      abi,
      functionName: 'mintDeedNFT',
      args: [
        to,
        propertyAddress,
        propertyType,
        BigInt(propertySize),
        legalDescription,
        metadataURI,
      ],
      value,
      gas: 500000n,
    });
  };

  return {
    mintDeedNFT,
    hash,
    error,
    isPending,
    isDeployed,
  };
}

// Hook to wait for minting transaction
export function useWaitForMintTransaction(hash: `0x${string}` | undefined) {
  return useWaitForTransactionReceipt({
    hash,
  });
}
