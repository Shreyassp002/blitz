"use client";
import { useWallet } from "../hooks/useWallet";
import { useState } from "react";

export default function WalletConnect() {
  const {
    publicKey,
    isConnected,
    isLoading,
    network,
    connectWallet,
  } = useWallet();

  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleConnectWallet = async () => {
    try {
      const result = await connectWallet();
      if (result === false) {
        console.log("Wallet connection was cancelled or failed");
      }
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };

  if (!isConnected || !publicKey) {
    return (
      <button
        onClick={handleConnectWallet}
        disabled={isLoading}
        className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200 disabled:cursor-not-allowed text-sm"
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span>Connecting...</span>
          </div>
        ) : (
          "Connect Wallet"
        )}
      </button>
    );
  }

  return (
    <button
      onClick={copyAddress}
      className="bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-300 px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm"
      title="Click to copy address"
    >
      {/* Status indicator */}
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>

      {/* Network and address */}
      <div className="flex items-center space-x-2">
        <span className="text-xs text-gray-300 uppercase tracking-wide font-medium">
          {network === "TESTNET" ? "Testnet" : network}
        </span>
        <span className="font-mono text-sm">{formatAddress(publicKey)}</span>
      </div>

      {/* Copy indicator */}
      {copied && (
        <span className="text-xs text-green-400">Copied!</span>
      )}
    </button>
  );
}
