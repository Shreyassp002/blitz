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

  // Close dropdown
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
      <button
        onClick={connectWallet}
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
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="bg-black/30 hover:bg-black/50 backdrop-blur-md border border-gray-700/50 hover:border-gray-600 text-white px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 text-sm"
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

        {/* Dropdown arrow */}
        <svg
          className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${
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
        <div className="absolute right-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-2xl py-2 z-50 animate-in slide-in-from-top-2 duration-200">
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
