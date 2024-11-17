"use client";
import { useState } from "react";
import Button from "@/app/(components)/Button";
import Input from "@/app/(components)/Input";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { BN } from "@project-serum/anchor";
import { getProgram } from "@/app/services/solana";

export default function HomePage() {
  const [address, setAddress] = useState("");
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInitialize = async () => {
    try {
      setError(null);

      if (!address) {
        setError("Please enter a valid wallet address");
        return;
      }

      const publicKey = new PublicKey(address);
      const program = getProgram();

      // Ensure that the wallet is connected
      const provider = program.provider;
      const walletPublicKey = provider.publicKey;
      if (!walletPublicKey) {
        setError("Please connect your Phantom wallet");
        return;
      }

      // Send the transaction
      const txHash = await program.methods
        .initialize(new BN(42))
        .accounts({
          newAccount: publicKey,
          signer: walletPublicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("Transaction Hash:", txHash);
      setTransactionHash(txHash);
    } catch (err) {
      console.error("Error:", err);
      setError((err as Error).message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Solana Dapp</h1>
      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter Public Key"
      />
      <Button onClick={handleInitialize}>Initialize Account</Button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {transactionHash && (
        <p className="text-green-500 mt-4">
          Transaction Hash: {transactionHash}
        </p>
      )}
    </div>
  );
}
