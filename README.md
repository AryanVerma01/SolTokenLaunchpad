# 🚀 Solana Token Launchpad

A modern, beautifully designed decentralized application (dApp) built on Solana. This platform allows users to effortlessly create, manage, and deploy their own SPL tokens directly on the Solana network using the Token-2022 program standard.

## ✨ Features

- **Sleek, Premium UI**: Built with a stunning dark theme, glassmorphism (`backdrop-blur`), and dynamic CSS animations utilizing Tailwind CSS v4.
- **Easy Wallet Integration**: Seamlessly connect the most popular Solana wallets (Phantom, Solflare, etc.) using `@solana/wallet-adapter`.
- **Instant Token Deployment**: Provide a Name, Symbol, Decimals, Supply, and an optional Metadata URI to mint a new token directly from the frontend.
- **Token-2022 Standard**: Leverages the latest SPL Token 2022 program for minting and metadata pointer initialization.
- **Smart Feedback**: Animated transaction flows and comprehensive inputs.

## 🛠️ Tech Stack

- **Framework**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Solana Web3**: 
  - `@solana/web3.js`
  - `@solana/spl-token`
  - `@solana/spl-token-metadata`
- **Wallet Connection**: 
  - `@solana/wallet-adapter-react`
  - `@solana/wallet-adapter-react-ui`

## 💻 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your machine.
It is highly recommended to have a Solana wallet extension like **Phantom** installed on your browser and set to Devnet.

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   cd SolTokenLaunchpad
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173` to view the app!

## 📝 How to use

1. Connect your Solana Wallet using the button in the top right corner.
2. Make sure you have some Devnet SOL for transaction fees (you can use the [Solana Faucet](https://faucet.solana.com/)).
3. Fill in the Token Details (Name, Symbol, Decimals, Supply, URI).
4. Click **Deploy Token** and approve the transaction in your wallet.
5. Your token is now minted and the supply will be available in your connected wallet!

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
