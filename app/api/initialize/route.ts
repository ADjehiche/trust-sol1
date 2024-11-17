import { NextResponse } from 'next/server';
import { PublicKey } from '@solana/web3.js';

export async function POST(request: Request) {
  try {
    const { walletAddress, phantomWalletAddress } = await request.json();
    
    if (!walletAddress || !phantomWalletAddress) {
      return NextResponse.json({ 
        error: 'Missing required parameters' 
      }, { status: 400 });
    }

    // Validate addresses
    try {
      const targetPublicKey = new PublicKey(walletAddress);
      const connectedPublicKey = new PublicKey(phantomWalletAddress);
      
      // Your credit score calculation logic here
      // For now, return a mock response
      return NextResponse.json({
        success: true,
        message: "Credit score calculation initiated",
        walletChecked: targetPublicKey.toString(),
        requestedBy: connectedPublicKey.toString()
      });
    } catch (e) {
      return NextResponse.json({ 
        error: 'Invalid public key format' 
      }, { status: 400 });
    }
  } catch (err) {
    console.error('API Error:', err);
    return NextResponse.json({ 
      error: err instanceof Error ? err.message : 'Unknown error occurred' 
    }, { status: 500 });
  }
}
