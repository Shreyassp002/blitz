"use client";
import { useWallet } from "../hooks/useWallet";
import { useState, useRef, useEffect } from "react";

export default function WalletConnect() {
  const {
    publicKey,
    isConnected,
    isLoading,
    network,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  if (!isConnected) {
    return (
      <div className="relative">
        <button
          onClick={connectWallet}
          disabled={isLoading}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <div className="relative">
                  <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.739 8.89 9.95 0.066.001 0.133.002 0.2.002s0.134-.001 0.2-.002C16.16 26.739 20 22.55 20 17V7L12 2zm0 2.236L18 7.236V17c0 4.26-2.79 7.582-6.55 7.952C7.79 24.582 5 21.26 5 17V7.236L12 4.236z" />
                      <path d="M12 8L8 12h3v6h2v-6h3L12 8z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <span>Connect Wallet</span>
              </>
            )}
          </div>

          {/* Shimmer effect */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="group relative bg-gray-900/50 hover:bg-gray-900/70 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 text-white px-4 py-3 rounded-xl transition-all duration-200 flex items-center space-x-3"
      >
        <div className="flex items-center space-x-3">
          {/* Status indicator */}
          <div className="relative">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75"></div>
          </div>

          {/* Wallet info */}
          <div className="flex flex-col items-start">
            <div className="text-xs text-gray-400 uppercase tracking-wide font-medium">
              {network === "TESTNET" ? "Testnet" : network}
            </div>
            <div className="font-mono text-sm font-semibold">
              {formatAddress(publicKey)}
            </div>
          </div>
        </div>

        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
          {/* Connected status */}
          <div className="px-4 py-3 border-b border-gray-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-white">Connected</span>
            </div>
            <div className="text-xs text-gray-400">
              Network:{" "}
              <span className="text-green-400 font-medium">{network}</span>
            </div>
          </div>

          {/* Address section */}
          <div className="px-4 py-3 border-b border-gray-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 uppercase tracking-wide">
                Address
              </span>
              <button
                onClick={copyAddress}
                className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="font-mono text-sm text-white bg-gray-800/50 px-3 py-2 rounded-lg break-all">
              {publicKey}
            </div>
          </div>

          {/* Actions */}
          <div className="px-2 py-2">
            <button
              onClick={() => {
                disconnectWallet();
                setIsDropdownOpen(false);
              }}
              className="w-full flex items-center space-x-3 px-3 py-2 text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <div>
                <div className="text-sm font-medium">Disconnect from dApp</div>
                <div className="text-xs text-gray-500">
                  Freighter stays connected
                </div>
              </div>
            </button>

            {/* Info about full disconnect */}
            <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start space-x-2">
                <svg
                  className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <div>
                  <div className="text-xs text-amber-300 font-medium">
                    Full Disconnect
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    To revoke Freighter access: Extension → Settings → Connected
                    Sites
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-gray-700/50">
            <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
              <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">F</span>
              </div>
              <span>Powered by Freighter</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
