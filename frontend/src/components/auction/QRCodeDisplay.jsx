"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Download, Share2, ExternalLink, Zap, Trophy } from "lucide-react";
import QRCodeLib from "qrcode";
import { useBlitzAuction } from "../../hooks/useBlitzAuction";

export default function QRCodeDisplay() {
  const canvasRef = useRef(null);
  const [qrError, setQrError] = useState(null);
  const [qrGenerated, setQrGenerated] = useState(false);
  const { qrUrl, isLoading, error } = useBlitzAuction();

  // Default URL
  const defaultUrl = "https://github.com/Shreyassp002/blitz";

  // QR shows winner URL or default
  const displayUrl = qrUrl && qrUrl.trim() !== "" ? qrUrl.trim() : defaultUrl;
  const isShowingDefault = displayUrl === defaultUrl;

  const generateQR = useCallback(async (url) => {
    if (!canvasRef.current || !url) {
      return;
    }

    try {
      setQrError(null);
      setQrGenerated(false);

      await QRCodeLib.toCanvas(canvasRef.current, url, {
        width: 240,
        margin: 2,
        color: {
          dark: "#1f2937",
          light: "#ffffff",
        },
        errorCorrectionLevel: "M",
      });

      setQrGenerated(true);
    } catch (error) {
      setQrError(`Failed to generate QR code: ${error.message}`);
      setQrGenerated(false);
    }
  }, []);

  // Generate QR code whenever URL changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      generateQR(displayUrl);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [displayUrl, generateQR]);

  const canvasCallbackRef = useCallback(
    (node) => {
      if (node !== null) {
        canvasRef.current = node;
        generateQR(displayUrl);
      }
    },
    [displayUrl, generateQR]
  );

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
    link.download = `blitz-qr-${timestamp}.png`;
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "⚡ Blitz Auction Platform",
          text: "Check out this Blitz Auction URL!",
          url: displayUrl,
        });
        return;
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to share:", error);
        }
      }
    }

    try {
      await navigator.clipboard.writeText(displayUrl);
      alert("URL copied to clipboard!");
    } catch (error) {
      prompt("Copy this URL:", displayUrl);
    }
  };

  const handleVisit = () => {
    window.open(displayUrl, "_blank", "noopener,noreferrer");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-xl">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
          <p className="text-gray-400 text-sm">Loading auction data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gray-900 border border-red-700 rounded-xl p-6 shadow-xl">
        <div className="text-center py-8">
          <div className="text-red-400 text-3xl mb-3">⚠️</div>
          <p className="text-red-400 text-sm">Error loading auction data</p>
          <p className="text-gray-500 text-xs mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="qr-card">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-blue-400" />
          <h2 className="text-xl font-bold text-white">QR Display</h2>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2">
          {isShowingDefault ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
              Default URL
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30">
              <Trophy className="w-3.5 h-3.5" />
              Winner URL Active
            </span>
          )}
        </div>
      </div>

      {/* QR Code Container */}
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-xl shadow-lg border-2 border-gray-200">
          {qrError ? (
            <div className="w-[240px] h-[240px] bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500 p-4">
                <div className="text-3xl mb-2">❌</div>
                <p className="text-sm font-medium mb-1">QR Generation Failed</p>
                <p className="text-xs">{qrError}</p>
                <p className="text-xs mt-2 text-gray-400">
                  Install: npm install qrcode
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Use callback ref instead of regular ref */}
              <canvas
                ref={canvasCallbackRef}
                className="max-w-full h-auto rounded-lg"
              />

              {/* Loading indicator while QR is generating */}
              {!qrGenerated && (
                <div className="w-[240px] h-[240px] bg-gray-100 rounded-lg flex items-center justify-center absolute">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* URL Display Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-300">
            {isShowingDefault ? "Default URL:" : "Winner URL:"}
          </p>
        </div>

        {/* URL Container with Actions */}
        <div className="bg-gray-800/60 rounded-lg border border-gray-600 overflow-hidden">
          <div className="flex items-center">
            {/* URL Display */}
            <div className="flex-1 p-3 flex justify-center">
              <a
                href={displayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm break-all"
                title={displayUrl}
              >
                {displayUrl.length > 50
                  ? `${displayUrl.substring(0, 47)}...`
                  : displayUrl}
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center border-l border-gray-600">
              <button
                onClick={handleDownload}
                className="p-3 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                title="Download QR Code"
                disabled={!qrGenerated}
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="p-3 text-gray-400 hover:text-blue-400 hover:bg-gray-700/50 transition-all duration-200 border-l border-gray-600"
                title="Share URL"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleVisit}
                className="p-3 text-gray-400 hover:text-green-400 hover:bg-gray-700/50 transition-all duration-200 border-l border-gray-600"
                title="Visit Website"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Status Description */}
        <p
          className={`text-sm text-center ${
            isShowingDefault ? "text-gray-500" : "text-blue-400"
          }`}
        >
          {isShowingDefault
            ? "Displaying default repository URL - no active winner"
            : "Winner's URL active for 24 hours"}
        </p>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="text-center space-y-1">
          <p className="text-sm text-gray-400 flex items-center justify-center gap-2">
            <Zap className="w-4 h-4" />
            Auto-updates via Stellar network
          </p>
        </div>
      </div>
    </div>
  );
}
