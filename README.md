# NFT Deed Mint dApp

A decentralized application for minting property deed NFTs on the Base blockchain.

## Features

- 🏠 **Property Types**: House, Apartment, Commercial
- 📏 **Size Options**: Multiple size categories for each property type
- 🖼️ **Dynamic Images**: IPFS-hosted property images
- 💰 **Dynamic Pricing**: Based on property size
- 🔗 **Base Network**: Deployed on Base Sepolia testnet
- 📱 **Responsive Design**: Works on desktop and mobile

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Wagmi, Viem, RainbowKit
- **Storage**: Pinata IPFS
- **Network**: Base Sepolia

## Contract

- **Address**: `0xf7B6a1Dd012Ee812f6d1b7Ac35108FeeF230aDb4`
- **Network**: Base Sepolia
- **Explorer**: [View on Basescan](https://sepolia.basescan.org/address/0xf7B6a1Dd012Ee812f6d1b7Ac35108FeeF230aDb4)

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables for production:

- `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
- `NEXT_PUBLIC_CONTRACT_ADDRESS_BASE_SEPOLIA`
- `NEXT_PUBLIC_PINATA_API_KEY`
- `PINATA_SECRET_API_KEY`
- `PINATA_JWT`

## License

MIT
