# Product Brief: NFT Deed Mint dApp (Base Blockchain)

## Project Overview
Build a **simple NFT minting dApp** on the **Base blockchain** (testnet first, mainnet later) as a **foundational MVP** for users to mint NFTs representing deeds. Prioritize **simplicity**, **functionality**, and **scalability** for future advanced features (e.g., bonding curves, tokenization).

- **Tech Stack**: Base testnet (Sepolia), ERC-721 smart contracts, Next.js frontend, MetaMask/Coinbase Wallet, IPFS (Pinata/NFT.Storage).
- **Key Goal**: Enable users to connect wallets, upload deed info, generate metadata, and mint an ERC-721 NFT on Base.
- **Success Metrics**:
  - Successful NFT minting on testnet with no errors.
  - Metadata correctly stored and accessible on IPFS.
  - NFTs viewable on Basescan and supported wallets.
  - Full minting journey (connect → upload → mint) completed in <2 minutes.
  - Zero critical bugs during testnet deployment.

## Coding Standards and Best Practices

### General Rules
- Write **clear, well-documented code** optimized for Web3 beginners and internal developers.
- Use **descriptive function names** (e.g., `mintNFT`, `uploadMetadata`) for smart contracts.
- Follow **functional programming** patterns in Next.js (hooks, no class components).
- Ensure **basic accessibility** (WCAG 2.1) in UI components.
- Include **comprehensive unit tests** for all smart contract functions.

### Naming Conventions
- **Smart Contracts**: kebab-case (e.g., `nft-deed-mint.sol`).
- **Frontend Files**: kebab-case (e.g., `mint-interface.tsx`).
- **Components**: PascalCase (e.g., `MintInterface`).
- **Variables/Functions**: camelCase (e.g., `generateMetadata`).

## Target Audience
- Web3 beginners who want to see their deeds as NFTs.
- Developers (internal) learning Base smart contract deployment.