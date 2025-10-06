import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base, baseSepolia } from 'wagmi/chains';
import { http } from 'viem';

// Configure chains for the app
export const config = getDefaultConfig({
  appName: 'NFT Deed Mint dApp',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'your-project-id',
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  ssr: false, // Disable SSR to prevent multiple initializations
});

// Export the config for use in other files
export default config;