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
          <div class='w-screen h-full items-center'>
            <div class="flex justify-center items-center">
              <div class="text-4xl font-semibold text-amber-400 mb-10">Solana Token Launchpad</div>
            </div>
            <div class="flex justify-center items-center ">
              <div class="mr-25"><WalletMultiButton /></div>          {/* Connect Button */}
              <div><WalletDisconnectButton /></div>     {/* Disconnect Button */}
            </div>
            <div className="mt-15">
              <TokenLaunchpad/>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
