// hooks/useBlitzAuction.js
import { useState, useEffect } from "react";
import { AuctionContractClient } from "@/lib/contractClient";

export const useBlitzAuction = () => {
  const [auctionClient] = useState(() => new AuctionContractClient());
  const [auctionData, setAuctionData] = useState({
    summary: null,
    isActive: false,
    currentAuction: null,
    timeRemaining: 0,
    qrUrl: "",
    isLoading: true,
    error: null,
  });
  const [isPlacingBid, setIsPlacingBid] = useState(false);

  const fetchAuctionData = async () => {
    try {
      const [summary, isActive, current, timeRemaining, qrUrl] =
        await Promise.all([
          auctionClient.getAuctionSummary().catch(() => null),
          auctionClient.isAuctionActive().catch(() => false),
          auctionClient.getCurrentAuction().catch(() => null),
          auctionClient.getTimeRemaining().catch(() => "0"),
          auctionClient.getQRUrl().catch(() => ""),
        ]);

      setAuctionData({
        summary,
        isActive,
        currentAuction: current,
        timeRemaining: parseInt(timeRemaining || "0"),
        qrUrl: qrUrl || "",
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching auction data:", error);
      setAuctionData((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }));
    }
  };

  const placeBid = async (bidder, amount, preferredUrl) => {
    setIsPlacingBid(true);
    try {
      console.log("Hook: Placing bid with:", { bidder, amount, preferredUrl });

      // Get the transaction XDR from your contract client
      const result = await auctionClient.placeBid(bidder, amount, preferredUrl);
      console.log("Hook: Got transaction result:", result);

      // If your contract client returns { transaction, xdr }, we need to sign it
      if (result.xdr) {
        console.log(
          "Hook: Transaction XDR received, need to sign with Freighter"
        );
        // You'll need to import and use your wallet hook here to sign the transaction
        // The actual signing should be handled in your component with the wallet hook
        return result;
      }

      await fetchAuctionData(); // Refresh data after successful bid
      return result;
    } catch (error) {
      console.error("Hook: Error placing bid:", error);
      throw error;
    } finally {
      setIsPlacingBid(false);
    }
  };

  const startAuction = async () => {
    try {
      const result = await auctionClient.startAuction();
      await fetchAuctionData();
      return result;
    } catch (error) {
      console.error("Error starting auction:", error);
      throw error;
    }
  };

  const endAuction = async () => {
    try {
      const result = await auctionClient.endAuction();
      await fetchAuctionData();
      return result;
    } catch (error) {
      console.error("Error ending auction:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchAuctionData();
    const interval = setInterval(fetchAuctionData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    ...auctionData,
    placeBid,
    isPlacingBid,
    startAuction,
    endAuction,
    refetchData: fetchAuctionData,
    auctionClient,
  };
};
