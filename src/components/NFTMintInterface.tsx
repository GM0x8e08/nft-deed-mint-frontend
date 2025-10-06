'use client';

import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { 
  DeedFormData, 
  TransactionStatus, 
  MintingResult,
  PROPERTY_PRICING
} from '@/types/deed';
import { PropertyType } from '@/lib/contract';
import { 
  useMintDeedNFT, 
  useWaitForMintTransaction
} from '@/hooks/useContract';
import { useUploadMetadata } from '@/hooks/useIPFS';
import { getPropertyImage } from '@/lib/placeholderImages';
import LoadingSpinner from './LoadingSpinner';

interface NFTMintInterfaceProps {
  formData: DeedFormData;
  onComplete: (result: MintingResult) => void;
  onCancel: () => void;
}

export default function NFTMintInterface({ 
  formData, 
  onComplete, 
  onCancel 
}: NFTMintInterfaceProps) {
  const { address } = useAccount();
  
  // State management
  const [status, setStatus] = useState<TransactionStatus>(TransactionStatus.PREPARING);
  const [error, setError] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [metadataUri, setMetadataUri] = useState<string>('');
  
  // Prevent infinite error loop
  const lastErrorRef = React.useRef<string | null>(null);

  // Contract hooks (for future validation features)
  // const { data: isAddressUsed } = useIsAddressUsed(formData.propertyAddress);
  // const { data: hasWalletDeed } = useHasWalletDeed(address);
  // const { data: remainingSupply } = useRemainingSupply();
  // const { data: mintingActive } = useMintingActive();

  // IPFS upload hook
  const uploadMetadata = useUploadMetadata();

  // Minting hook
  const { mintDeedNFT, hash: mintHash, error: mintError } = useMintDeedNFT();

  // Wait for transaction hook
  const waitForTransaction = useWaitForMintTransaction(mintHash);

  // Calculate minting price
  const mintingPrice = formData.propertySize ? PROPERTY_PRICING[formData.propertySize as keyof typeof PROPERTY_PRICING] : 0;

  // Generate metadata for IPFS
  const generateMetadata = React.useCallback(() => {
    const propertyTypeInfo = {
      [PropertyType.House]: { label: 'House', icon: '🏠' },
      [PropertyType.Apartment]: { label: 'Apartment', icon: '🏢' },
      [PropertyType.Commercial]: { label: 'Commercial', icon: '🏬' }
    }[formData.propertyType!];

    // Get IPFS image and convert to web-friendly URL
    const ipfsImage = getPropertyImage(formData.propertyType!.toString(), formData.propertySize!);
    const httpImage = ipfsImage.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');

    return {
      name: `Property Deed NFT #${Date.now()}`,
      description: `A digital deed for ${propertyTypeInfo.label.toLowerCase()} property at ${formData.propertyAddress}`,
      image: httpImage,           // Web-friendly URL for Basescan/MetaMask
      image_ipfs: ipfsImage,      // Original IPFS reference
      external_url: 'https://nft-deed-mint.vercel.app',
      attributes: [
        {
          trait_type: 'Property Type',
          value: propertyTypeInfo.label
        },
        {
          trait_type: 'Size',
          value: `${formData.propertySize}m²`
        },
        {
          trait_type: 'Address',
          value: formData.propertyAddress
        },
        {
          trait_type: 'Minting Price',
          value: `${mintingPrice} ETH`
        },
        {
          trait_type: 'Minted By',
          value: address || 'Unknown'
        },
        {
          trait_type: 'Mint Date',
          value: new Date().toISOString()
        }
      ],
      properties: {
        property_type: formData.propertyType,
        property_size: formData.propertySize,
        property_address: formData.propertyAddress,
        legal_description: formData.legalDescription || '',
        minting_price: mintingPrice,
        minter_address: address || '',
        mint_timestamp: Date.now()
      },
      animation_url: '',
      youtube_url: '',
      background_color: 'ffffff'
    };
  }, [formData, address, mintingPrice]);

  // Start minting process
  const startMintingProcess = React.useCallback(async () => {
    try {
      setStatus(TransactionStatus.PREPARING);
      setError('');

      // Generate metadata
      const metadata = generateMetadata();
      setStatus(TransactionStatus.UPLOADING_METADATA);
      
      // Upload metadata to IPFS with retry logic
      let uploadResult;
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          uploadResult = await uploadMetadata.mutateAsync({
            data: metadata,
            name: `deed-metadata-${Date.now()}.json`
          });
          break; // Success, exit retry loop
        } catch {
          retryCount++;
          
          if (retryCount >= maxRetries) {
            throw new Error(`Failed to upload metadata to IPFS after ${maxRetries} attempts. Please check your internet connection and try again.`);
          }
          
          // Wait before retry (exponential backoff)
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        }
      }

      // Verify the uploaded metadata is accessible
      if (uploadResult) {
        try {
          const metadataUrl = uploadResult.uri.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          const response = await fetch(metadataUrl);
          if (!response.ok) {
            throw new Error(`Failed to verify metadata upload. HTTP ${response.status}: ${response.statusText}`);
          }
          await response.json();
        } catch {
          // Don't fail the entire process for verification issues, but log it
        }
      }

      if (!uploadResult) {
        throw new Error('Failed to upload metadata to IPFS');
      }

      setMetadataUri(uploadResult.uri);
      setStatus(TransactionStatus.MINTING);

      // Convert PropertyType from form to contract format
      const contractPropertyType = formData.propertyType === 0 ? PropertyType.House :
                                  formData.propertyType === 1 ? PropertyType.Apartment :
                                  PropertyType.Commercial;

      // Mint the NFT
      await mintDeedNFT(
        address!,
        formData.propertyAddress,
        contractPropertyType,
        formData.propertySize!,
        formData.legalDescription || '',
        uploadResult.uri,
        // Use exact wei conversion to avoid underpayment by rounding
        (await (async () => {
          const { parseEther } = await import('viem');
          return parseEther(String(mintingPrice));
        })())
      );

    } catch (error) {
      console.error('Minting process failed:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      setStatus(TransactionStatus.ERROR);
      
      onComplete({
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }, [formData, generateMetadata, uploadMetadata, mintDeedNFT, mintingPrice, onComplete, address]);

  // Handle transaction hash updates
  useEffect(() => {
    if (mintHash) {
      setTxHash(mintHash);
      setStatus(TransactionStatus.CONFIRMING);
    }
  }, [mintHash]);

  // Handle transaction confirmation
  useEffect(() => {
    if (waitForTransaction.data && txHash) {
      // Check if transaction was successful
      if (waitForTransaction.data.status === 'success') {
        // Extract token ID from transaction logs
        const tokenId = extractTokenIdFromReceipt(waitForTransaction.data);
        if (tokenId !== null) {
          setTokenId(tokenId);
          setStatus(TransactionStatus.SUCCESS);
          
          onComplete({
            success: true,
            tokenId,
            transactionHash: txHash
          });
        } else {
          setError('Failed to extract token ID from transaction');
          setStatus(TransactionStatus.ERROR);
          
          onComplete({
            success: false,
            error: 'Failed to extract token ID from transaction'
          });
        }
      } else {
        // Transaction reverted on-chain
        setError('Transaction reverted on-chain. Please check your inputs and try again.');
        setStatus(TransactionStatus.ERROR);
        
        onComplete({
          success: false,
          error: 'Transaction reverted on-chain. Please check your inputs and try again.'
        });
      }
    }
  }, [waitForTransaction.data, txHash, onComplete]);

  // Handle minting errors (prevent infinite loop)
  useEffect(() => {
    if (!mintError) return;
    const msg = mintError.message || 'Minting failed';
    if (lastErrorRef.current === msg) return; // prevent repeat updates
    
    // Only show error if we don't have a transaction hash yet (pre-transaction errors)
    // If we have a hash, let the transaction confirmation handle the final status
    if (!mintHash) {
      lastErrorRef.current = msg;
      setError(msg);
      setStatus(TransactionStatus.ERROR);
      onComplete({ success: false, error: msg });
    }
  }, [mintError, mintHash, onComplete]);

  // Extract token ID from transaction receipt
  const extractTokenIdFromReceipt = (receipt: { logs?: Array<{ topics?: string[] }> }): number | null => {
    try {
      // Look for Transfer event with from address 0x0 (minting event)
      const transferEvent = receipt.logs?.find((log: { topics?: string[] }) => 
        log.topics?.[0] === '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef' && // Transfer event signature
        log.topics?.[1] === '0x0000000000000000000000000000000000000000000000000000000000000000' // from address 0x0
      );

      if (transferEvent && transferEvent.topics?.[3]) {
        // Token ID is in the third topic (index 3)
        const tokenIdHex = transferEvent.topics[3];
        return parseInt(tokenIdHex, 16);
      }
    } catch (error) {
      console.error('Error extracting token ID:', error);
    }
    return null;
  };

  // Auto-start minting process when component mounts
  useEffect(() => {
    if (status === TransactionStatus.PREPARING) {
      startMintingProcess();
    }
  }, [status, startMintingProcess]);

  // Render status-specific UI
  const renderStatusContent = () => {
    switch (status) {
      case TransactionStatus.PREPARING:
        return (
          <div className="text-center">
            <LoadingSpinner size="lg" text="Preparing minting process..." />
            <p className="text-gray-300 mt-4">Setting up your NFT minting transaction...</p>
          </div>
        );

      case TransactionStatus.UPLOADING_METADATA:
        return (
          <div className="text-center">
            <LoadingSpinner size="lg" text="Uploading metadata to IPFS..." />
            <p className="text-gray-300 mt-4">Storing your property information on the decentralized web...</p>
          </div>
        );

      case TransactionStatus.MINTING:
        return (
          <div className="text-center">
            <LoadingSpinner size="lg" text="Minting your NFT..." />
            <p className="text-gray-300 mt-4">Creating your unique property deed NFT on the blockchain...</p>
          </div>
        );

      case TransactionStatus.CONFIRMING:
        return (
          <div className="text-center">
            <LoadingSpinner size="lg" text="Confirming transaction..." />
            <p className="text-gray-300 mt-4">Waiting for blockchain confirmation...</p>
            {txHash && (
              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                <p className="text-sm text-blue-300">Transaction Hash:</p>
                <p className="text-xs text-blue-200 font-mono break-all">{txHash}</p>
              </div>
            )}
          </div>
        );

      case TransactionStatus.SUCCESS:
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">NFT Minted Successfully!</h2>
            <p className="text-gray-300 mb-6">Your property deed NFT has been created on the blockchain.</p>
            
            <div className="space-y-4">
              {tokenId && (
                <div className="p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
                  <p className="text-sm text-green-300">Token ID:</p>
                  <p className="text-lg font-bold text-green-200">#{tokenId}</p>
                </div>
              )}
              
              {txHash && (
                <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                  <p className="text-sm text-blue-300">Transaction Hash:</p>
                  <p className="text-xs text-blue-200 font-mono break-all">{txHash}</p>
                </div>
              )}
              
              {metadataUri && (
                <div className="p-4 bg-purple-900/20 border border-purple-400/30 rounded-lg">
                  <p className="text-sm text-purple-300">Metadata URI:</p>
                  <p className="text-xs text-purple-200 font-mono break-all">{metadataUri}</p>
                </div>
              )}
            </div>
          </div>
        );

      case TransactionStatus.ERROR:
        return (
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-red-400 mb-4">Minting Failed</h2>
            <p className="text-gray-300 mb-6">{error}</p>
            
            <div className="space-y-4">
              <button
                onClick={startMintingProcess}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors defi-button"
              >
                Try Again
              </button>
              
              <button
                onClick={onCancel}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors defi-button ml-4"
              >
                Cancel
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="defi-card rounded-lg p-6 sm:p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2">Minting Your NFT</h2>
          <p className="text-gray-300">Please wait while we create your property deed NFT...</p>
        </div>

        {renderStatusContent()}
      </div>
    </div>
  );
}