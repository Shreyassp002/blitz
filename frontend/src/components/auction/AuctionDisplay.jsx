// components/AuctionDisplay.js
"use client";
import { useState, useEffect } from "react";
import { useWallet } from "@/hooks/useWallet";
import { useBlitzAuction } from "@/hooks/useBlitzAuction";

export default function AuctionDisplay() {
  const { publicKey, isConnected, signTransaction } = useWallet();
  const {
    currentAuction,
    timeRemaining,
    isActive: isAuctionActive,
    auctionClient,
    refetchData,
    isLoading,
    error,
  } = useBlitzAuction();

  const [bidUrl, setBidUrl] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  // Update countdown for auction
  useEffect(() => {
    if (timeRemaining) {
      setTimeLeft(Number(timeRemaining));
    }
  }, [timeRemaining]);

  // Countdown timer for auction
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        return newTime <= 0 ? 0 : newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handlePlaceBid = async () => {
    if (!bidUrl || !bidAmount || !publicKey) {
      alert("Please fill in all fields and connect your wallet");
      return;
    }

    if (!isValidUrl(bidUrl)) {
      alert("Please enter a valid URL");
      return;
    }

    setIsPlacingBid(true);

    try {
      console.log("Placing bid...", { bidUrl, bidAmount, publicKey });

      // Convert display amount to contract format
      const contractAmount = auctionClient.parseBidAmount(bidAmount);
      console.log("Contract amount:", contractAmount.toString());

      // Get transaction XDR from contract client
      const txResult = await auctionClient.placeBid(
        publicKey,
        contractAmount.toString(),
        bidUrl
      );
      console.log("Transaction result:", txResult);

      if (!txResult.xdr) {
        throw new Error("No transaction XDR returned from contract");
      }

      // Sign transaction with Freighter
      console.log("Signing transaction...");
      const signedXdr = await signTransaction(
        txResult.xdr,
        "Test SDF Network ; September 2015"
      ); // Testnet passphrase

      console.log("Transaction signed successfully!");

      // Here you would submit the signed transaction to the network
      // You might need to add a submitTransaction method to your contract client

      alert("Bid placed successfully!");
      setBidUrl("");
      setBidAmount("");

      // Refetch data after successful bid
      setTimeout(refetchData, 2000);
    } catch (error) {
      console.error("Bid failed:", error);
      alert(`Bid failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsPlacingBid(false);
    }
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Calculate minimum bid using your client's methods
  const getMinimumBid = () => {
    if (!currentAuction) return "0.01";

    try {
      if (currentAuction.highest_bid && currentAuction.highest_bid !== "0") {
        // Add minimum increment (0.001 XLM = 10000 stroops)
        const nextBid = BigInt(currentAuction.highest_bid) + BigInt("10000");
        return auctionClient.formatBidAmount(nextBid.toString());
      }
      return "0.01";
    } catch (error) {
      return "0.01";
    }
  };

  const minimumBid = getMinimumBid();

  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading auction data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-red-700 rounded-xl p-6 shadow-lg">
        <div className="text-center py-8">
          <p className="text-red-400">Error loading auction: {error}</p>
          <button
            onClick={refetchData}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-4">
          ⚡ Current Blitz Auction
        </h2>

        {/* Auction Status */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                isAuctionActive
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              {isAuctionActive ? "⚡ Active" : "🔴 Ended"}
            </span>
          </div>

          {/* Auction ID */}
          {currentAuction && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Auction #:</span>
              <span className="text-white font-mono">
                {currentAuction.auction_id
                  ? currentAuction.auction_id.toString()
                  : "N/A"}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-gray-300">Time Remaining:</span>
            <span className="text-white font-mono text-lg">
              {timeLeft > 0 ? formatTimeRemaining(timeLeft) : "00:00:00"}
            </span>
          </div>

          {currentAuction && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Current Bid:</span>
                <span className="text-white font-bold">
                  {currentAuction.highest_bid &&
                  currentAuction.highest_bid !== "0"
                    ? `${auctionClient.formatBidAmount(
                        currentAuction.highest_bid
                      )} XLM`
                    : "No bids yet"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-300">Current Winner:</span>
                <span className="text-white font-mono text-sm">
                  {currentAuction.highest_bidder &&
                  currentAuction.highest_bidder !== ""
                    ? `${currentAuction.highest_bidder.slice(
                        0,
                        6
                      )}...${currentAuction.highest_bidder.slice(-4)}`
                    : "No winner yet"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Current Auction URL - Only show during active auction with bids */}
        {isAuctionActive &&
          currentAuction?.winner_url &&
          currentAuction.winner_url.trim() !== "" && (
            <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-green-300">Current Winner URL:</p>
                <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
                  🏆 Leading Bidder
                </span>
              </div>

              <a
                href={currentAuction.winner_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm break-all block"
              >
                {currentAuction.winner_url}
              </a>

              <p className="text-xs text-green-400 mt-1">
                This URL will be displayed on QR code if this bid wins
              </p>
            </div>
          )}

        {/* Show message when auction is active but no bids */}
        {isAuctionActive &&
          (!currentAuction?.winner_url ||
            currentAuction.winner_url.trim() === "") && (
            <div className="mb-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/30">
              <p className="text-sm text-yellow-300 text-center">
                ⚡ No bids placed yet - be the first to bid on Blitz!
              </p>
            </div>
          )}
      </div>

      {/* Bid Form */}
      {isConnected && isAuctionActive ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your URL
            </label>
            <input
              type="url"
              value={bidUrl}
              onChange={(e) => setBidUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              This URL will be shown on the QR code if you win
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Bid Amount (XLM)
            </label>
            <input
              type="number"
              step="0.001"
              min={minimumBid}
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder={`Minimum: ${minimumBid} XLM`}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Minimum bid: {minimumBid} XLM
            </p>
          </div>

          <button
            onClick={handlePlaceBid}
            disabled={isPlacingBid || !isValidUrl(bidUrl) || !bidAmount}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {isPlacingBid ? "⚡ Placing Bid..." : "⚡ Place Bid"}
          </button>

          {/* Debug info */}
          <div className="text-xs text-gray-500">
            <p>
              Wallet:{" "}
              {publicKey
                ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}`
                : "Not connected"}
            </p>
            <p>
              Valid URL: {bidUrl ? (isValidUrl(bidUrl) ? "✅" : "❌") : "⏳"}
            </p>
            <p>Amount: {bidAmount || "Not set"}</p>
          </div>
        </div>
      ) : !isConnected ? (
        <div className="text-center py-6">
          <p className="text-gray-400 mb-4">
            Connect your Freighter wallet to place bids
          </p>
        </div>
      ) : !isAuctionActive ? (
        <div className="text-center py-6">
          <p className="text-gray-400 mb-2">Auction has ended</p>
          <p className="text-sm text-gray-500">
            Waiting for next Blitz auction to start...
          </p>
        </div>
      ) : null}
    </div>
  );
}
