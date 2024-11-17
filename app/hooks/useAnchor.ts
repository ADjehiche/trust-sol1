"use client";
import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { getProgram } from '@/app/services/solana';

interface NewAccount {
  data: number;
}

export function useAccountData(publicKey: PublicKey) {
  const [data, setData] = useState<NewAccount | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAccountData() {
      if (!publicKey) return;

      try {
        const program = getProgram();
        const account = await program.account.newAccount.fetch(publicKey);

        // Extract the relevant data and assign it to the state
        const newAccountData: NewAccount = {
          data: account.data.toNumber(), // Assuming `data` is a BN
        };

        setData(newAccountData);
      } catch (err) {
        if (err instanceof Error) {
          console.error("Error fetching account data:", err.message);
          setError(err.message);
        } else {
          console.error("Unknown error:", err);
          setError("An unknown error occurred while fetching account data.");
        }
      }
    }

    fetchAccountData();
  }, [publicKey]);

  return { data, error };
}
