"use client";
import { useState } from "react";
import { ExternalLink, Trophy, Eye, EyeOff } from "lucide-react";
import { useBlitzAuction } from "../../hooks/useBlitzAuction";
import SafeIframe from "./SafeIframe";

export default function WinnerPreview() {
  const [showPreview, setShowPreview] = useState(true);

  const { qrUrl, summary, currentAuction, isLoading, error } =
    useBlitzAuction();

  const hasWinnerUrl = qrUrl && qrUrl.trim() !== "";

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Loading winner data...</p>
        </div>
      </div>
    );
  }

  if (!hasWinnerUrl) {
    return null;
  }

  const winnerData = summary || currentAuction;

  return (
    <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-xl border border-blue-500/30 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">Winner Spotlight</h2>
        </div>
        <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm font-medium border border-blue-500/30">
          24h Display
        </span>
      </div>

      {/* Winner Info */}
      <div className="space-y-3 mb-4">
        {winnerData?.auctionId && (
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Auction #:</span>
            <span className="text-white">
              {winnerData.auctionId.toString()}
            </span>
          </div>
        )}

        {winnerData?.highestBidder && (
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Winner:</span>
            <span className="text-white text-sm">
              {winnerData.highestBidder.length > 20
                ? `${winnerData.highestBidder.slice(
                    0,
                    8
                  )}...${winnerData.highestBidder.slice(-6)}`
                : winnerData.highestBidder}
            </span>
          </div>
        )}

        {winnerData?.highestBid && (
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Winning Bid:</span>
            <span className="text-yellow-400 font-bold">
              {winnerData.highestBid} XLM
            </span>
          </div>
        )}

        {winnerData?.endTime && (
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Ended At:</span>
            <span className="text-white text-sm">
              {new Date(winnerData.endTime * 1000).toLocaleString()}
            </span>
          </div>
        )}

        {winnerData?.startTime && (
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Started At:</span>
            <span className="text-white text-sm">
              {new Date(winnerData.startTime * 1000).toLocaleString()}
            </span>
          </div>
        )}

        {/* Show basic info */}
        {!winnerData && (
          <div className="text-center py-2">
            <p className="text-blue-400 text-sm">🏆 Winner URL is active!</p>
            <p className="text-gray-500 text-xs">
              Auction details not available
            </p>
          </div>
        )}
      </div>

      {/* URL Preview */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-300">Winner's URL:</p>
          <span className="text-xs px-2 py-1 bg-green-500/20 text-green-300 rounded">
            Live on QR Code
          </span>
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-gray-600">
          <div className="flex items-center">
            <a
              href={qrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-blue-400 hover:text-blue-300 break-all text-sm p-3 pr-2 transition-colors duration-200"
            >
              {qrUrl}
            </a>
            <div className="flex border-l border-gray-600">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="p-2 text-gray-400 hover:text-blue-400 hover:bg-gray-700 transition-all duration-200"
                title={showPreview ? "Hide Preview" : "Show Preview"}
              >
                {showPreview ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() =>
                  window.open(qrUrl, "_blank", "noopener,noreferrer")
                }
                className="p-2 text-gray-400 hover:text-green-400 hover:bg-gray-700 transition-all duration-200 border-l border-gray-600"
                title="Visit Winner's Website"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Website Preview - Using SafeIframe */}
      {showPreview && (
        <div className="mb-4">
          <div className="bg-gray-800/30 rounded-lg border border-gray-600 overflow-hidden">
            <div className="bg-gray-700/50 px-3 py-2 border-b border-gray-600">
              <p className="text-xs text-gray-300">Website Preview</p>
            </div>
            <div className="p-2">
              <SafeIframe src={qrUrl} />
            </div>
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className="text-center">
        <p className="text-sm text-blue-300">
          🏆 This URL is currently displayed on the QR code
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Winner gets exclusive 24-hour display time
        </p>
      </div>
    </div>
  );
}
