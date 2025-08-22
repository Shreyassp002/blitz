"use client";

import { useState, useEffect } from "react";

export default function CryptoTicker({ initialData = [] }) {
  const [cryptoData, setCryptoData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCryptoData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/crypto");

      if (!response.ok) {
        throw new Error("Failed to fetch crypto data");
      }

      const data = await response.json();
      setCryptoData(data);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      setError("Failed to update crypto prices");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchCryptoData, 80000);
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    if (price >= 1) {
      return price.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    } else {
      return price.toFixed(6);
    }
  };

  const formatChange = (change) => {
    if (!change) return "0.00%";
    const formatted = Math.abs(change).toFixed(2);
    return change >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  if (cryptoData.length === 0 && error) {
    return (
      <div className="bg-red-900/50 text-white py-3 px-6">
        <p className="text-red-200 text-sm text-center">{error}</p>
      </div>
    );
  }

  if (cryptoData.length === 0) {
    return (
      <div className="bg-gray-900 text-white py-3">
        <div className="flex items-center justify-center space-x-4">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span className="text-sm text-gray-400">
            Loading Stellar network prices...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-transparent text-white py-3 relative">
      <div className="max-w-7xl mx-auto px-6 relative overflow-hidden">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute top-1 right-0 z-10">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          </div>
        )}

        {/* Left fade overlay */}
        <div className="absolute left-6 top-0 w-12 h-full bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>

        {/* Right fade overlay */}
        <div className="absolute right-6 top-0 w-12 h-full bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

        {/* Scrolling ticker */}
        <div className="relative overflow-hidden">
          <div className="animate-scroll flex items-center space-x-8 whitespace-nowrap pl-12 pr-20">
            {[...cryptoData, ...cryptoData].map((crypto, index) => (
              <div
                key={`${crypto.id}-${index}`}
                className="flex items-center space-x-2 min-w-max"
              >
                <span
                  className={`font-semibold text-sm ${
                    crypto.isStellarRelated ? "text-blue-300" : "text-blue-400"
                  }`}
                >
                  {crypto.symbol}
                </span>
                <span className="text-sm text-white">
                  ${formatPrice(crypto.price)}
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    crypto.change24h >= 0
                      ? "bg-green-500/20 text-green-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {formatChange(crypto.change24h)}
                </span>
                {crypto.isStellarRelated && (
                  <span className="text-xs text-blue-300/70">⋆</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-scroll {
          animation: scroll 30s linear infinite;
        }

        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
