import { Connection, PublicKey, clusterApiUrl, SystemProgram } from '@solana/web3.js';
import { AnchorProvider, Program, BN, Idl } from '@project-serum/anchor';
import idl from './idl.json'; // Your IDL file

// Environment variables
const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID!);
const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK || clusterApiUrl('devnet');

// Create a Solana connection
export const connection = new Connection(network);

// Set up the Anchor provider
export function getProvider() {
  if (typeof window === 'undefined') throw new Error("No browser environment detected");
  
  const { solana } = window as any;
  if (!solana?.isPhantom) {
    throw new Error("Phantom wallet not found");
  }

  const provider = new AnchorProvider(
    connection,
    solana,
    { preflightCommitment: "processed" }
  );
  return provider;
}

// Initialize the program
export function getProgram() {
  const provider = getProvider();
  return new Program(idl as Idl, programId, provider);
}
