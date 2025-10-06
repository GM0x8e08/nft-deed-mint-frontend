'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useChainId } from 'wagmi';
import { useMintingActive, useRemainingSupply, useContract } from '@/hooks/useContract';
import { useEffect, useState } from 'react';
import DeedMintForm from '@/components/DeedMintForm';
import NFTMintInterface from '@/components/NFTMintInterface';
import ErrorBoundary from '@/components/ErrorBoundary';
import { DeedFormData, MintingResult } from '@/types/deed';

export default function Home() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { isDeployed } = useContract();
  const { data: mintingActive } = useMintingActive();
  const { data: remainingSupply } = useRemainingSupply();
  
  // Prevent hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  
  // Minting flow state management
  const [showMintingInterface, setShowMintingInterface] = useState(false);
  const [formData, setFormData] = useState<DeedFormData | null>(null);
  const [mintingResult, setMintingResult] = useState<MintingResult | null>(null);
  const [isMinting, setIsMinting] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle minting flow
  const handleMint = (data: DeedFormData) => {
    setFormData(data);
    setShowMintingInterface(true);
    setIsMinting(true);
  };

  const handleMintingComplete = (result: MintingResult) => {
    setMintingResult(result);
    setIsMinting(false);
    if (result.success) {
      // Reset form after successful mint
      setTimeout(() => {
        setShowMintingInterface(false);
        setFormData(null);
        setMintingResult(null);
      }, 3000);
    }
  };

  const handleMintingCancel = () => {
    setShowMintingInterface(false);
    setFormData(null);
    setIsMinting(false);
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen defi-gradient">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NFT Deed Mint dApp
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Mint property deed NFTs on Base blockchain
            </p>
            <div className="flex justify-center mb-8">
              <div className="animate-pulse bg-gray-600 h-10 w-32 rounded-lg"></div>
            </div>
          </header>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto"></div>
            <p className="mt-2 text-gray-300">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen defi-gradient">
        <div className="container mx-auto px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <header className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            NFT Deed Mint dApp
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Mint property deed NFTs on Base blockchain
          </p>
          
          {/* Wallet Connection */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="defi-glow rounded-lg defi-pulse">
              <ConnectButton />
            </div>
          </div>
        </header>

        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="defi-card rounded-lg p-4 sm:p-6 hover:defi-glow">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
              Wallet Status
            </h3>
            <p className="text-sm text-gray-300 break-all">
              {isConnected ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Not Connected'}
            </p>
          </div>

          <div className="defi-card rounded-lg p-4 sm:p-6 hover:defi-glow">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
              Network
            </h3>
            <p className="text-sm text-gray-300">
              {chainId === 84532 ? 'Base Sepolia (Testnet)' : 
               chainId === 8453 ? 'Base Mainnet' : 
               `Chain ID: ${chainId}`}
            </p>
          </div>

          <div className="defi-card rounded-lg p-4 sm:p-6 hover:defi-glow sm:col-span-2 lg:col-span-1">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-2 flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${mintingActive ? 'bg-green-400' : 'bg-orange-400'}`}></span>
              Minting Status
            </h3>
            <p className="text-sm text-gray-300">
              {!isDeployed ? 'Contract Not Deployed' : 
               mintingActive ? 'Active' : 'Inactive'}
            </p>
          </div>
        </div>

        {/* Contract Info */}
        <div className="defi-card rounded-lg p-4 sm:p-6 mb-8 sm:mb-12 hover:defi-glow">
          <h3 className="text-base sm:text-lg font-semibold text-white mb-4 flex items-center">
            <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
            Contract Information
          </h3>
          {isDeployed ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-blue-400">Remaining Supply:</span> {remainingSupply?.toString() || 'Loading...'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-300">
                  <span className="font-medium text-blue-400">Max Supply:</span> 1000
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-orange-900/20 border border-orange-400/30 rounded-lg p-4 defi-glow-orange">
              <p className="text-sm text-orange-200 flex items-center">
                <span className="text-orange-400 mr-2">⚠️</span>
                Contract not deployed on this network. Please switch to Base Sepolia testnet or deploy the contract first.
              </p>
            </div>
          )}
        </div>

        {/* Main Content - Form or Minting Interface */}
        <div className="mt-8 sm:mt-12">
          <ErrorBoundary>
            {showMintingInterface && formData ? (
              <NFTMintInterface
                formData={formData}
                onComplete={handleMintingComplete}
                onCancel={handleMintingCancel}
              />
            ) : (
              <DeedMintForm
                onMint={handleMint}
                isLoading={isMinting}
              />
            )}
          </ErrorBoundary>
        </div>

        {/* Success Message */}
        {mintingResult?.success && (
          <div className="mt-6 sm:mt-8 text-center">
            <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4 sm:p-6 defi-glow-green">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎉</div>
              <h3 className="text-lg sm:text-xl font-bold text-green-200 mb-2">
                NFT Minted Successfully!
              </h3>
              <p className="text-green-300 text-sm sm:text-base">
                Your deed NFT has been minted and is now available in your wallet.
              </p>
              {mintingResult.transactionHash && (
                <a
                  href={`https://sepolia.basescan.org/tx/${mintingResult.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 text-blue-400 hover:text-blue-300 text-sm underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 rounded transition-colors"
                  aria-label="View transaction on Basescan"
                >
                  View Transaction on Basescan →
                </a>
              )}
            </div>
          </div>
        )}

        </div>
      </div>
    </ErrorBoundary>
  );
}