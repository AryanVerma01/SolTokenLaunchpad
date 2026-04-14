import { createInitializeMint2Instruction, decodeInitializeMultisigInstruction, getAssociatedTokenAddressSync, getMinimumBalanceForRentExemptAccount, getMinimumBalanceForRentExemptMint, MINT_SIZE, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, ASSOCIATED_TOKEN_PROGRAM_ID, createMintToInstruction } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react"
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react";
import { TOKEN_2022_PROGRAM_ID, getMintLen, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, TYPE_SIZE, LENGTH_SIZE, ExtensionType } from "@solana/spl-token"
import { createInitializeInstruction, pack } from '@solana/spl-token-metadata';


export default function TokenLaunchpad(){

    const wallet = useWallet();
    const {connection}  = useConnection(); 

    const [name,setname] = useState(""); 
    const [decimals,setdecimals] = useState(0);
    const [uri,seturi] = useState("");
    const [supply,setsupply] = useState(0);
    const [symbol,setsymbol] = useState("");

    async function launchtoken(){

        if(!wallet.publicKey){
            throw new Error("Invalid Wallet Signature");
        }
        
        const mintkeypair = Keypair.generate();
        
        const metadata = {
            mint: mintkeypair.publicKey,
            name: name,
            symbol: symbol,
            uri: uri,
            additionalMetadata: []
        };

        const mintlen = getMintLen([ExtensionType.MetadataPointer]);              //  Mint Account space required
        const metadatalen = TYPE_SIZE + LENGTH_SIZE + pack(metadata).length;      //  MetaData space required

        const lamports = await connection.getMinimumBalanceForRentExemption(mintlen + metadatalen);  // minimum balance for space account takes
        
        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintkeypair.publicKey,
                space: mintlen,
                lamports: lamports,
                programId: TOKEN_2022_PROGRAM_ID, 
            }),
            createInitializeMetadataPointerInstruction(mintkeypair.publicKey,wallet.publicKey,mintkeypair.publicKey,TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintkeypair.publicKey,parseInt(decimals),wallet.publicKey,null,TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintkeypair.publicKey,
                metadata: mintkeypair.publicKey,
                name: metadata.name,
                symbol: metadata.symbol,
                uri: metadata.uri,
                mintAuthority: wallet.publicKey,
                updateAuthority: wallet.publicKey,
            })
        );

        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        transaction.partialSign(mintkeypair);

        await wallet.sendTransaction(transaction,connection);

        // ATA is a PDA
        const associatedToken = getAssociatedTokenAddressSync(          // All seeds to derive PDA [ Public Derived Address ]
            mintkeypair.publicKey,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID,
        )

        const transaction2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedToken,
                wallet.publicKey,
                mintkeypair.publicKey,
                TOKEN_2022_PROGRAM_ID,
            )
        )

        await wallet.sendTransaction(transaction2,connection);

        const transaction3 = new Transaction().add(
            createMintToInstruction(mintkeypair.publicKey,associatedToken,wallet.publicKey,parseInt(supply)*1000000000,[],TOKEN_2022_PROGRAM_ID)
        )

        await wallet.sendTransaction(transaction3,connection);

        alert(`Token created`)
    }

    return (
        <div className="w-full max-w-md relative group mt-8">
            {/* Glow effect behind the card */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-[2rem] blur-xl opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>
            
            {/* Main Form Card */}
            <div className="relative w-full p-8 rounded-[2rem] backdrop-blur-2xl bg-slate-900/80 border border-white/10 shadow-2xl flex flex-col gap-6">
                
                <div className="text-center mb-2">
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Token Details</h3>
                    <p className="text-sm text-slate-500 mt-1 mb-2">Configure your new token attributes</p>
                </div>

                <div className="space-y-4">
                    <div className="group relative">
                        <input className="w-full bg-black/40 border border-white/5 text-white placeholder-slate-500 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300" type="text" placeholder="Token Name" onChange={(e)=>setname(e.target.value)} />
                    </div>
                    
                    <div className="group relative">
                        <input className="w-full bg-black/40 border border-white/5 text-white placeholder-slate-500 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300" type="text" placeholder="Symbol (e.g. SOL)" onChange={(e)=>setsymbol(e.target.value)} />
                    </div>

                    <div className="flex gap-4">
                        <div className="group relative w-1/2">
                            <input className="w-full bg-black/40 border border-white/5 text-white placeholder-slate-500 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300" type="number" placeholder="Decimals" onChange={(e)=>setdecimals(e.target.value)} />
                        </div>
                        <div className="group relative w-1/2">
                            <input className="w-full bg-black/40 border border-white/5 text-white placeholder-slate-500 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300" type="number" placeholder="Supply" onChange={(e)=>setsupply(e.target.value)} />
                        </div>
                    </div>

                    <div className="group relative">
                        <input className="w-full bg-black/40 border border-white/5 text-white placeholder-slate-500 rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all duration-300" type="text" placeholder="Image URI (Optional)" onChange={(e)=>seturi(e.target.value)} />
                    </div>
                </div>

                <div className="pt-2">
                    <button 
                        className="w-full relative overflow-hidden group/btn bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]" 
                        onClick={() => launchtoken()}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Deploy Token
                            <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </span>
                        {/* Shimmer effect inside button on hover */}
                        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover/btn:animate-[shimmer_1.5s_infinite]"></div>
                    </button>
                </div>
            </div>
        </div>
    );
}