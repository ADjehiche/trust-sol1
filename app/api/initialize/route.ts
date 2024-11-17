import { NextResponse } from 'next/server';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import { getProgram } from '@/app/services/solana';
import { BN } from '@project-serum/anchor';

export async function POST(request: Request) {
  try {
    // Parse the request body to get the wallet address
    const { walletAddress } = await request.json();
    if (!walletAddress) {
      return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
    }

    const publicKey = new PublicKey(walletAddress);

    // Get the Anchor program instance
    const program = getProgram();

    // Ensure the provider is connected
    const provider = program.provider;
    if (!provider || !provider.publicKey) {
      return NextResponse.json({ error: 'Wallet not connected' }, { status: 401 });
    }

    // Send the transaction to initialize the account
    const txHash = await program.methods
      .initialize(new BN(42))
      .accounts({
        newAccount: publicKey,
        signer: provider.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Return the transaction hash
    return NextResponse.json({ txHash });
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error initializing account:', err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    } else {
      console.error('Unknown error:', err);
      return NextResponse.json({ error: 'An unknown error occurred' }, { status: 500 });
    }
  }
}
