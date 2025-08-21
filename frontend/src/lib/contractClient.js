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

// Helper function to convert string to BigInt for contract calls
const convertStringToBigInt = (value) => {
  if (typeof value === "string" && /^\d+$/.test(value)) {
    return BigInt(value);
  }
  return value;
};

export class AuctionContractClient {
  constructor(rpcUrl = "https://soroban-testnet.stellar.org") {
    this.client = new Client({
      ...networks.testnet,
      rpcUrl,
      networkPassphrase: "Test SDF Network ; September 2015", // ✅ Explicit testnet passphrase
    });
  }

  // ============================================
  // READ-ONLY FUNCTIONS (No wallet required)
  // ============================================

  /**
   * Get complete auction summary - everything the frontend needs
   */
  async getAuctionSummary() {
    try {
      const tx = await this.client.get_auction_summary();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting auction summary:", error);
      throw error;
    }
  }

  /**
   * Check if auction is currently active
   */
  async isAuctionActive() {
    try {
      const tx = await this.client.is_auction_active();
      const result = await tx.simulate();
      return result.result;
    } catch (error) {
      console.error("Error checking auction status:", error);
      throw error;
    }
  }

  /**
   * Get current auction details
   */
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

  /**
   * Get last completed auction
   */
  async getLastAuction() {
    try {
      const tx = await this.client.get_last_auction();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting last auction:", error);
      throw error;
    }
  }

  /**
   * Get specific auction by ID
   */
  async getAuction(auctionId) {
    try {
      const tx = await this.client.get_auction({
        auction_id: convertStringToBigInt(auctionId),
      });
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting auction:", error);
      throw error;
    }
  }

  /**
   * Get minimum bid for current auction
   */
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

  /**
   * Get time remaining in current auction (in seconds)
   */
  async getTimeRemaining() {
    try {
      const tx = await this.client.get_time_remaining();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting time remaining:", error);
      throw error;
    }
  }

  /**
   * Get auction counter (total number of auctions)
   */
  async getAuctionCounter() {
    try {
      const tx = await this.client.get_auction_counter();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting auction counter:", error);
      throw error;
    }
  }

  /**
   * Get contract information
   */
  async getContractInfo() {
    try {
      const tx = await this.client.get_contract_info();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting contract info:", error);
      throw error;
    }
  }

  /**
   * Get auction history (last 5 auctions)
   */
  async getAuctionHistory() {
    try {
      const tx = await this.client.get_auction_history();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting auction history:", error);
      throw error;
    }
  }

  // ============================================
  // QR CODE FUNCTIONS
  // ============================================

  /**
   * Get the QR URL to display
   */
  async getQRUrl() {
    try {
      const tx = await this.client.get_qr_url();
      const result = await tx.simulate();
      return result.result;
    } catch (error) {
      console.error("Error getting QR URL:", error);
      throw error;
    }
  }

  /**
   * Get current auction URL (during bidding)
   */
  async getCurrentAuctionUrl() {
    try {
      const tx = await this.client.get_current_auction_url();
      const result = await tx.simulate();
      return result.result;
    } catch (error) {
      console.error("Error getting current auction URL:", error);
      throw error;
    }
  }

  /**
   * Check if there's an active QR URL
   */
  async hasActiveQRUrl() {
    try {
      const tx = await this.client.has_active_qr_url();
      const result = await tx.simulate();
      return result.result;
    } catch (error) {
      console.error("Error checking active QR URL:", error);
      throw error;
    }
  }

  /**
   * Get QR URL status and source
   */
  async getQRUrlStatus() {
    try {
      const tx = await this.client.get_qr_url_status();
      const result = await tx.simulate();
      return result.result;
    } catch (error) {
      console.error("Error getting QR URL status:", error);
      throw error;
    }
  }

  /**
   * Get QR URL expiry time
   */
  async getQRUrlExpiryTime() {
    try {
      const tx = await this.client.get_qr_url_expiry_time();
      const result = await tx.simulate();
      return convertBigIntToString(result.result);
    } catch (error) {
      console.error("Error getting QR URL expiry time:", error);
      throw error;
    }
  }

  // ============================================
  // WRITE FUNCTIONS (Require wallet signature)
  // ============================================

  /**
   * Initialize the contract (owner only)
   */
  async initialize(owner, platformWallet, tokenAddress, publicKey) {
    try {
      const tx = await this.client.initialize(
        {
          owner,
          platform_wallet: platformWallet,
          token_address: tokenAddress,
        },
        {
          simulate: false,
        }
      );

      // 🔑 Manually simulate before using toXDR
      await tx.simulate();

      return {
        transaction: tx,
        xdr: tx.toXDR(),
      };
    } catch (error) {
      console.error("Error initializing contract:", error);
      throw error;
    }
  }
  /**
   * Place a bid on the current auction
   */
  async placeBid(bidder, amount, preferredUrl, publicKey) {
    try {
      const tx = await this.client.place_bid(
        {
          bidder,
          amount: convertStringToBigInt(amount),
          preferred_url: preferredUrl,
        },
        {
          simulate: false,
        }
      );

      // 🔑 Manually simulate before using toXDR
      await tx.simulate();

      return {
        transaction: tx,
        xdr: tx.toXDR(),
      };
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  }

  /**
   * Start a new auction (owner only)
   */
  async startAuction(publicKey) {
    try {
      const tx = await this.client.start_auction({
        simulate: false,
      });

      // 🔑 Manually simulate before using toXDR
      await tx.simulate();

      return {
        transaction: tx,
        xdr: tx.toXDR(),
      };
    } catch (error) {
      console.error("Error starting auction:", error);
      throw error;
    }
  }

  /**
   * End the current auction
   */
  async endAuction(publicKey) {
    try {
      const tx = await this.client.end_auction({
        simulate: false,
      });

      // 🔑 Manually simulate before using toXDR
      await tx.simulate();

      return {
        transaction: tx,
        xdr: tx.toXDR(),
      };
    } catch (error) {
      console.error("Error ending auction:", error);
      throw error;
    }
  }

  // ============================================
  // OWNER-ONLY FUNCTIONS
  // ============================================

  /**
   * Set minimum bid increment (owner only)
   */
  async setMinBidIncrement(newIncrement, publicKey) {
    try {
      const tx = await this.client.set_min_bid_increment(
        {
          new_increment: convertStringToBigInt(newIncrement),
        },
        {
          simulate: false,
        }
      );

      // 🔑 Manually simulate before using toXDR
      await tx.simulate();

      return {
        transaction: tx,
        xdr: tx.toXDR(),
      };
    } catch (error) {
      console.error("Error setting min bid increment:", error);
      throw error;
    }
  }
  /**
   * Set minimum starting bid (owner only)
   */
  async setMinStartingBid(newStartingBid, publicKey) {
    try {
      const tx = await this.client.set_min_starting_bid(
        {
          new_starting_bid: convertStringToBigInt(newStartingBid),
        },
        {
          simulate: false,
        }
      );

      // 🔑 Manually simulate before using toXDR
      await tx.simulate();

      return {
        transaction: tx,
        xdr: tx.toXDR(),
      };
    } catch (error) {
      console.error("Error setting min starting bid:", error);
      throw error;
    }
  }

  /**
   * Update platform wallet (owner only)
   */
  async setPlatformWallet(newWallet, publicKey) {
    try {
      const tx = await this.client.set_platform_wallet(
        {
          new_wallet: newWallet,
        },
        {
          simulate: false,
        }
      );

      // 🔑 Manually simulate before using toXDR
      await tx.simulate();

      return {
        transaction: tx,
        xdr: tx.toXDR(),
      };
    } catch (error) {
      console.error("Error setting platform wallet:", error);
      throw error;
    }
  }

  /**
   * Transfer ownership (owner only)
   */
  async transferOwnership(newOwner, publicKey) {
    try {
      const tx = await this.client.transfer_ownership(
        {
          new_owner: newOwner,
        },
        {
          simulate: false,
        }
      );

      // 🔑 Manually simulate before using toXDR
      await tx.simulate();

      return {
        transaction: tx,
        xdr: tx.toXDR(),
      };
    } catch (error) {
      console.error("Error transferring ownership:", error);
      throw error;
    }
  }

  // ============================================
  // UTILITY FUNCTIONS
  // ============================================

  /**
   * Get all relevant auction data for frontend
   */
  async getAllAuctionData() {
    try {
      const [summary, isActive, contractInfo, history, hasQR, qrStatus] =
        await Promise.all([
          this.getAuctionSummary(),
          this.isAuctionActive(),
          this.getContractInfo(),
          this.getAuctionHistory(),
          this.hasActiveQRUrl(),
          this.getQRUrlStatus().catch(() => null), // QR status might fail if no active QR
        ]);

      return {
        summary,
        isActive,
        contractInfo,
        history,
        hasQR,
        qrStatus,
      };
    } catch (error) {
      console.error("Error getting all auction data:", error);
      throw error;
    }
  }

  /**
   * Format bid amount for display (assuming 7 decimal places for Stellar assets)
   */
  formatBidAmount(amount) {
    const amountStr = typeof amount === "string" ? amount : amount.toString();
    const bigintAmount = BigInt(amountStr);
    const divisor = BigInt(10000000); // 10^7 for Stellar stroop precision

    const wholePart = bigintAmount / divisor;
    const fractionalPart = bigintAmount % divisor;

    if (fractionalPart === BigInt(0)) {
      return wholePart.toString();
    }

    const fractionalStr = fractionalPart
      .toString()
      .padStart(7, "0")
      .replace(/0+$/, "");
    return `${wholePart.toString()}.${fractionalStr}`;
  }

  /**
   * Parse bid amount from display format to contract format
   */
  parseBidAmount(displayAmount) {
    const [wholePart, fractionalPart = ""] = displayAmount
      .toString()
      .split(".");
    const paddedFractional = fractionalPart.padEnd(7, "0").slice(0, 7);
    return BigInt(wholePart + paddedFractional);
  }

  /**
   * Format time remaining for display
   */
  formatTimeRemaining(seconds) {
    const secondsNum =
      typeof seconds === "string" ? parseInt(seconds) : seconds;

    if (secondsNum <= 0) return "Auction ended";

    const hours = Math.floor(secondsNum / 3600);
    const minutes = Math.floor((secondsNum % 3600) / 60);
    const remainingSeconds = secondsNum % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }

  /**
   * Check if user is the contract owner
   */
  async isOwner(userAddress) {
    try {
      const contractInfo = await this.getContractInfo();
      return contractInfo.owner === userAddress;
    } catch (error) {
      console.error("Error checking ownership:", error);
      return false;
    }
  }

  /**
   * Validate bid amount against minimum requirements
   */
  async validateBidAmount(bidAmount) {
    try {
      const minimumBid = await this.getMinimumBid();
      const bidAmountBigInt = this.parseBidAmount(bidAmount);
      const minimumBidBigInt = BigInt(minimumBid);

      return {
        isValid: bidAmountBigInt >= minimumBidBigInt,
        minimumBid: this.formatBidAmount(minimumBid),
        providedBid: this.formatBidAmount(bidAmountBigInt.toString()),
      };
    } catch (error) {
      console.error("Error validating bid amount:", error);
      throw error;
    }
  }
}
