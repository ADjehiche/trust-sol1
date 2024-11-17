import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program, Idl } from '@project-serum/anchor';
import idl from './idl.json';

// Add this type declaration at the top of the file
declare global {
  interface Window {
    solana?: any;
  }
}

// Move everything into functions to avoid server-side execution
export function getConnection() {
  if (typeof window === 'undefined') {
    throw new Error('Cannot initialize connection on server side');
  }
  
  const network = process.env.NEXT_PUBLIC_SOLANA_NETWORK === 'mainnet-beta' 
    ? clusterApiUrl('mainnet-beta')
    : clusterApiUrl('devnet');
    
  return new Connection(network);
}

export function getProvider() {
  const connection = getConnection();
  const wallet = window.solana;
  
  if (!wallet) {
    throw new Error('Please install Phantom wallet');
  }

  return new AnchorProvider(
    connection, 
    wallet,
    { commitment: 'processed' }
  );
}

export function getProgram() {
  if (typeof window === 'undefined') {
    throw new Error('Cannot initialize program on server side');
  }

  if (!process.env.NEXT_PUBLIC_PROGRAM_ID) {
    throw new Error('NEXT_PUBLIC_PROGRAM_ID environment variable is not set');
  }

  // Check for wallet existence first
  if (!window.solana) {
    throw new Error('Please install Phantom wallet');
  }

  // Check if wallet is connected
  if (!window.solana.isConnected) {
    throw new Error('Please connect your Phantom wallet');
  }

  const programId = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID);
  const provider = getProvider();
  return new Program(idl as Idl, programId, provider);
}