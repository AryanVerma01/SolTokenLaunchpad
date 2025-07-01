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

    return <>
        <div class="mx-155">
            <div><input class="w-70 h-10 mb-4 border-1 border-gray rounded-md text-center" type="text" placeholder="Token Name" onChange={(e)=>setname(e.target.value)}/></div>
            <div><input class="w-70 h-10 my-4 border-1 border-gray rounded-md text-center" type="text" placeholder="Symbol" onChange={(e)=>setsymbol(e.target.value)}/></div>
            <div><input class="w-70 h-10 my-4 border-1 border-gray rounded-md text-center" type="text" placeholder="decimals" onChange={(e)=>setdecimals(e.target.value)}/></div>
            <div><input class="w-70 h-10 my-4 border-1 border-gray rounded-md text-center" type="text" placeholder="URI" onChange={(e)=>seturi(e.target.value)}/></div>
            <div><input class="w-70 h-10 my-4 border-1 border-gray rounded-md text-center" type="text" placeholder="Supply Amt" onChange={(e)=>setsupply(e.target.value)}></input></div>
            <div><button class="mx-20 bg-white text-black w-30 h-10 font-bold rounded-2xl m-10" onClick={() => launchtoken()}>Create Token</button></div>
        </div>
    </>
}