"use client";
import { useWallet } from "../hooks/useWallet";

export default function WalletConnect() {
  const {
    publicKey,
    isConnected,
    isLoading,
    network,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  return (
    <div className="flex items-center space-x-4">
      {!isConnected ? (
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 disabled:opacity-50"
        >
          {isLoading ? (
            <span>Connecting...</span>
          ) : (
            <>
              <span>🔗</span>
              <span>Connect Freighter</span>
            </>
          )}
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
            Connected to {network}
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
            {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
          </div>
          <button
            onClick={disconnectWallet}
            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-sm"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
