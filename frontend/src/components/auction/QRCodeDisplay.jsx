// components/QRCodeDisplay.js
"use client";
import { useEffect, useRef, useState } from "react";
import { Download, Share2, ExternalLink } from "lucide-react";
import QRCodeLib from "qrcode";
import { useBlitzAuction } from "../../hooks/useBlitzAuction";

export default function QRCodeDisplay() {
  const canvasRef = useRef(null);
  const [qrError, setQrError] = useState(null);
  const [isQRLoading, setIsQRLoading] = useState(true);
  const { qrUrl, isLoading, error } = useBlitzAuction();

  // Default URL when contract returns empty (no winner URL active)
  const defaultUrl = "https://stellar.org";

  // QR shows ONLY winner URL or default - contract handles all logic
  const displayUrl = qrUrl && qrUrl.trim() !== "" ? qrUrl : defaultUrl;
  const isShowingDefault = displayUrl === defaultUrl;

  // Generate QR code whenever URL changes
  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !displayUrl) {
        setIsQRLoading(false);
        return;
      }

      setIsQRLoading(true);
      setQrError(null);

      try {
        // Try to import QRCode library dynamically
        const QRCode = await import("qrcode").catch(() => null);

        if (!QRCode) {
          // Fallback: Create a simple visual QR placeholder
          createQRPlaceholder(canvasRef.current, displayUrl);
          setIsQRLoading(false);
          return;
        }

        await QRCode.toCanvas(canvasRef.current, displayUrl, {
          width: 220,
          margin: 2,
          color: {
            dark: "#1f2937",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        });

        setIsQRLoading(false);
      } catch (error) {
        console.error("QR Code generation failed:", error);
        setQrError("Failed to generate QR code");

        // Create fallback placeholder
        createQRPlaceholder(canvasRef.current, displayUrl);
        setIsQRLoading(false);
      }
    };

    generateQR();
  }, [displayUrl]);

  // Fallback QR placeholder function
  const createQRPlaceholder = (canvas, url) => {
    const ctx = canvas.getContext("2d");
    canvas.width = 220;
    canvas.height = 220;

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, 220, 220);

    // Create a simple grid pattern to look like QR code
    ctx.fillStyle = "#1f2937";

    // Draw corner squares
    const drawCornerSquare = (x, y) => {
      ctx.fillRect(x, y, 35, 35);
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(x + 7, y + 7, 21, 21);
      ctx.fillStyle = "#1f2937";
      ctx.fillRect(x + 14, y + 14, 7, 7);
    };

    drawCornerSquare(10, 10); // Top-left
    drawCornerSquare(175, 10); // Top-right
    drawCornerSquare(10, 175); // Bottom-left

    // Add some random pattern in the middle
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(60 + i * 7, 60 + j * 7, 6, 6);
        }
      }
    }

    // Add text
    ctx.fillStyle = "#1f2937";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("⚡ BLITZ QR", 110, 200);

    // Add URL indicator
    ctx.font = "8px Arial";
    const shortUrl = url.length > 25 ? url.substring(0, 25) + "..." : url;
    ctx.fillText(shortUrl, 110, 212);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = `blitz-qr-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleShare = async () => {
    if (!navigator.share) {
      try {
        await navigator.clipboard.writeText(displayUrl);
        alert("URL copied!");
      } catch (error) {
        console.error("Failed to copy:", error);
        // Fallback: show the URL in a prompt
        prompt("Copy this URL:", displayUrl);
      }
      return;
    }

    try {
      await navigator.share({
        title: "⚡ Blitz Auction Platform",
        url: displayUrl,
      });
    } catch (error) {
      console.error("Failed to share:", error);
    }
  };

  const handleVisit = () => {
    window.open(displayUrl, "_blank", "noopener,noreferrer");
  };

  if (isLoading) {
    return (
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg text-center">
        <div className="py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Loading QR data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 border border-red-700 rounded-xl p-6 shadow-lg text-center">
        <div className="py-8">
          <p className="text-red-400">Error loading QR data: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg text-center">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-white mb-2">
          ⚡ Blitz QR Display
        </h2>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
            isShowingDefault
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
          }`}
        >
          {isShowingDefault ? "⏳ Default URL" : "⚡ Winner URL"}
        </span>
      </div>

      {/* QR Code */}
      <div className="mb-4 flex justify-center">
        <div className="bg-white p-3 rounded-xl shadow-lg">
          {isQRLoading ? (
            <div className="w-[220px] h-[220px] bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : qrError ? (
            <div className="w-[220px] h-[220px] bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <div className="text-2xl mb-1">❌</div>
                <p className="text-sm">{qrError}</p>
                <p className="text-xs mt-1">
                  Install qrcode: npm install qrcode
                </p>
              </div>
            </div>
          ) : (
            <canvas ref={canvasRef} className="max-w-full h-auto rounded" />
          )}
        </div>
      </div>

      {/* URL Display with Integrated Action Icons */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-300">Destination:</p>
          {!isShowingDefault && (
            <span className="text-xs px-2 py-1 bg-blue-700 rounded text-blue-300">
              🏆 Winner Display
            </span>
          )}
        </div>

        <div className="bg-gray-800/50 rounded-lg border border-gray-600 mb-2">
          <div className="flex items-center">
            {/* URL Link - Takes most of the space */}
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-blue-400 hover:text-blue-300 break-all text-sm p-3 pr-2 transition-colors"
            >
              {displayUrl.length > 35
                ? `${displayUrl.substring(0, 35)}...`
                : displayUrl}
            </a>

            {/* Action Icons */}
            <div className="flex items-center gap-1 p-2 border-l border-gray-600">
              <button
                onClick={handleDownload}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-all duration-200"
                title="Download QR Code"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={handleShare}
                className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-gray-700 rounded transition-all duration-200"
                title="Share URL"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleVisit}
                className="p-1.5 text-gray-400 hover:text-green-400 hover:bg-gray-700 rounded transition-all duration-200"
                title="Visit Website"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <p
          className={`text-sm ${
            isShowingDefault ? "text-gray-500" : "text-blue-400"
          }`}
        >
          {isShowingDefault
            ? "No winner URL active - showing default"
            : "Winner's URL (24h display period)"}
        </p>
      </div>

      {/* Info */}
      <div className="text-sm text-gray-400">
        <p>⚡ Updates automatically on Stellar network</p>
        <p className="mt-1">🏆 Winners get 24h display time</p>

        {/* Debug info */}
        <div className="mt-2 text-xs text-gray-600 border-t border-gray-700 pt-2">
          <p>QR URL: {qrUrl || "None from contract"}</p>
          <p>Showing: {isShowingDefault ? "Default" : "Winner URL"}</p>
        </div>
      </div>
    </div>
  );
}
