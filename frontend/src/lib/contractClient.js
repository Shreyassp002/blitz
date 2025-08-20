import { Client, networks } from "../contracts/dist/index.js";

// Helper function to convert BigInt to string recursively
const convertBigIntToString = (obj) => {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === "bigint") {
    return obj.toString();
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  if (typeof obj === "object") {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToString(value);
    }
    return converted;
  }

  return obj;
};

export class AuctionContractClient {
  constructor() {
    this.client = new Client({
      ...networks.testnet,
      rpcUrl: "https://soroban-testnet.stellar.org",
    });
  }

  async getAuctionSummary() {
    try {
      const tx = await this.client.get_auction_summary();
      const result = await tx.simulate();

      // Convert BigInt values to strings
      const convertedResult = convertBigIntToString(result.result);
      return convertedResult;
    } catch (error) {
      console.error("Error getting auction summary:", error);
      throw error;
    }
  }

  async isAuctionActive() {
    try {
      const tx = await this.client.is_auction_active();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error checking auction status:", error);
      throw error;
    }
  }

  async getCurrentAuction() {
    try {
      const tx = await this.client.get_current_auction();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting current auction:", error);
      throw error;
    }
  }

  async getMinimumBid() {
    try {
      const tx = await this.client.get_minimum_bid();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting minimum bid:", error);
      throw error;
    }
  }
}
