"use client";
import { useState, useEffect } from "react";
import { PublicKey } from "@solana/web3.js";
import Button from "@/app/(components)/Button";
import Input from "@/app/(components)/Input";

interface CreditScoreResult {
  success: boolean;
  message: string;
  walletChecked: string;
  requestedBy: string;
  creditScore?: string;
  riskLevel?: string;
  recommendations?: string;
}

export default function Home() {
  const [walletAddress, setWalletAddress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [phantomWalletAddress, setPhantomWalletAddress] = useState<
    string | null
  >(null);
  const [result, setResult] = useState<CreditScoreResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check for Phantom wallet and connection status
  useEffect(() => {
    setIsLoading(true);
    const checkWalletConnection = async () => {
      try {
        if (typeof window !== "undefined" && window.solana) {
          if (window.solana.isPhantom) {
            console.log("Phantom wallet found");

            // Check if already connected
            if (window.solana.isConnected) {
              setIsWalletConnected(true);
              const publicKey = window.solana.publicKey?.toString();
              setPhantomWalletAddress(publicKey || null);
              console.log("Wallet connected:", publicKey);
            }

            // Listen for connection events
            window.solana.on("connect", (publicKey: PublicKey) => {
              setIsWalletConnected(true);
              setPhantomWalletAddress(publicKey.toString());
              console.log("Wallet connected:", publicKey.toString());
            });
          }
        }
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    };

    checkWalletConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (typeof window === "undefined") return;

      if (!window.solana || !window.solana.isPhantom) {
        setError("Please install Phantom wallet");
        return;
      }

      const response = await window.solana.connect();
      console.log("Connected to wallet:", response.publicKey.toString());
      setPhantomWalletAddress(response.publicKey.toString());
      setIsWalletConnected(true);
      setError(null);
    } catch (err) {
      console.error("Connection error:", err);
      setError("Failed to connect wallet");
    }
  };

  const handleCalculateScore = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isWalletConnected) {
        setError("Please connect your wallet first");
        return;
      }

      if (!walletAddress.trim()) {
        setError("Please enter a wallet address");
        return;
      }

      // Validate the address
      let publicKey: PublicKey;
      try {
        publicKey = new PublicKey(walletAddress.trim());
        console.log("Valid public key created:", publicKey.toString());
      } catch (e) {
        console.error("Invalid address error:", e);
        setError("Invalid Solana address format");
        return;
      }

      console.log("Sending request to API...");
      const response = await fetch("/api/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: walletAddress.trim(),
          phantomWalletAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to calculate credit score");
      }

      setResult(data);
    } catch (err) {
      console.error("Calculate score error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to calculate credit score"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {!isWalletConnected ? (
        <div>
          <Button onClick={connectWallet} disabled={isLoading}>
            {isLoading ? "Connecting..." : "Connect Phantom Wallet"}
          </Button>
          <p className="mt-2 text-sm text-gray-600">
            Please connect your wallet to continue
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-green-600">
            Connected Wallet: {phantomWalletAddress?.slice(0, 4)}...
            {phantomWalletAddress?.slice(-4)}
          </p>
          <Input
            placeholder="Enter Solana wallet address to check"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={handleCalculateScore} disabled={isLoading}>
            {isLoading ? "Calculating..." : "Calculate Credit Score"}
          </Button>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}
      {result && (
        <div className="p-6 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Credit Score Result</h2>

          {/* Credit Score Display */}
          <div className="mb-6">
            <div className="text-4xl font-bold text-center text-blue-600">
              {result.creditScore || "N/A"}
            </div>
            <p className="text-center text-gray-600 mt-2">Credit Score</p>
          </div>

          {/* Risk Level */}
          {result.riskLevel && (
            <div
              className={`mb-6 p-4 rounded-lg ${
                result.riskLevel?.toLowerCase() === "low"
                  ? "bg-green-50 text-green-700"
                  : result.riskLevel?.toLowerCase() === "medium"
                  ? "bg-yellow-50 text-yellow-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              <h3 className="font-semibold mb-1">Risk Level</h3>
              <p>{result.riskLevel}</p>
            </div>
          )}

          {/* Recommendations */}
          {result.recommendations && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Recommendations</h3>
              <p className="text-gray-700">{result.recommendations}</p>
            </div>
          )}

          {/* Transaction Details */}
          <div className="text-sm text-gray-500 border-t pt-4">
            <p className="mb-1">
              <span className="font-medium">Wallet Checked:</span>{" "}
              <span className="break-all">{result.walletChecked}</span>
            </p>
            <p className="mb-1">
              <span className="font-medium">Requested By:</span>{" "}
              <span className="break-all">{result.requestedBy}</span>
            </p>
            <p>
              <span className="font-medium">Status:</span>{" "}
              <span
                className={result.success ? "text-green-600" : "text-red-600"}
              >
                {result.success ? "Success" : "Failed"}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
