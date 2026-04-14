import "./App.css";
import { useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { UnsafeBurnerWalletAdapter } from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import TokenLaunchpad from "./component/TokenLaunchpad.jsx";

import "@solana/wallet-adapter-react-ui/styles.css";

export default function App(){

  return (
    <ConnectionProvider endpoint={"https://api.devnet.solana.com"}>
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900 via-slate-950 to-black text-white font-sans selection:bg-purple-500/30">
            {/* Header / Nav */}
            <nav className="w-full flex flex-col md:flex-row justify-between items-center p-6 lg:px-12 backdrop-blur-md bg-black/20 border-b border-white/5 sticky top-0 z-50">
              <div className="flex items-center gap-3 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 tracking-tight">SolanaLaunch</h1>
              </div>
              <div className="flex gap-4 items-center">
                <WalletMultiButton className="!bg-white/10 hover:!bg-white/20 !transition-all !rounded-xl !border !border-white/10 !h-12 !text-sm lg:!text-base" />
                <WalletDisconnectButton className="!bg-red-500/10 hover:!bg-red-500/20 !text-red-400 !transition-all !rounded-xl !border !border-red-500/20 !h-12 !text-sm lg:!text-base" />
              </div>
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 mb-20 mt-10 md:mt-20">
              <div className="text-center mb-12 max-w-2xl px-4">
                <h2 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight leading-tight">
                  Launch Your Token <br className="hidden md:block"/>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 animate-pulse">In Seconds</span>
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed max-w-xl mx-auto">
                  The ultimate platform to create, manage, and deploy your Solana tokens seamlessly. Fast, secure, and impeccably designed.
                </p>
              </div>
              
              <TokenLaunchpad/>
            </main>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
