import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  MethodOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CBEFMEZLMEIIH3A2LANCSVJRLXEH2MDMKT7QOIVXGR6RN75YTZFXH7IF",
  }
} as const

export const Errors = {
  1: {message:"AuctionEnded"},
  2: {message:"NoActiveAuction"},
  3: {message:"BidTooLow"},
  4: {message:"EmptyUrl"},
  5: {message:"NoAuctionToEnd"},
  6: {message:"AuctionNotEnded"},
  7: {message:"AlreadyEnded"},
  8: {message:"Unauthorized"},
  9: {message:"AlreadyInitialized"}
}


export interface Auction {
  auction_id: u64;
  ending_time: u64;
  highest_bid: i128;
  highest_bidder: string;
  is_ended: boolean;
  preferred_url: string;
  starting_time: u64;
  url_expiry_time: u64;
}


export interface QRStatus {
  source: string;
  status: string;
}


export interface ContractInfo {
  auction_counter: u64;
  min_bid_increment: i128;
  min_starting_bid: i128;
  owner: string;
  platform_wallet: string;
  token_address: string;
}


export interface AuctionSummary {
  current_auction: Auction;
  has_active_qr: boolean;
  is_active: boolean;
  last_auction: Auction;
  qr_url: string;
  time_remaining: u64;
}

export interface Client {
  /**
   * Construct and simulate a initialize transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Initialize the contract
   */
  initialize: ({owner, platform_wallet, token_address}: {owner: string, platform_wallet: string, token_address: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a place_bid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Place a bid on the current auction
   */
  place_bid: ({bidder, amount, preferred_url}: {bidder: string, amount: i128, preferred_url: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a start_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Start a new auction (only owner)
   */
  start_auction: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a end_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * End the current auction
   */
  end_auction: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a get_qr_url transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get the QR URL to display
   */
  get_qr_url: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a get_current_auction_url transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current auction URL (during bidding)
   */
  get_current_auction_url: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<string>>

  /**
   * Construct and simulate a has_active_qr_url transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if there's an active QR URL
   */
  has_active_qr_url: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_qr_url_status transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get QR URL status and source
   */
  get_qr_url_status: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<QRStatus>>

  /**
   * Construct and simulate a get_qr_url_expiry_time transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get QR URL expiry time
   */
  get_qr_url_expiry_time: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_time_remaining transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get time remaining in current auction
   */
  get_time_remaining: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a is_auction_active transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Check if auction is currently active
   */
  is_auction_active: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<boolean>>

  /**
   * Construct and simulate a get_current_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get current auction details
   */
  get_current_auction: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Auction>>

  /**
   * Construct and simulate a get_last_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get last completed auction
   */
  get_last_auction: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Auction>>

  /**
   * Construct and simulate a get_auction transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get specific auction by ID (limited implementation due to format! constraint)
   */
  get_auction: ({auction_id}: {auction_id: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Option<Auction>>>

  /**
   * Construct and simulate a get_auction_counter transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get auction counter
   */
  get_auction_counter: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u64>>

  /**
   * Construct and simulate a get_contract_info transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get contract information
   */
  get_contract_info: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<ContractInfo>>

  /**
   * Construct and simulate a get_auction_summary transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get auction summary (everything frontend needs)
   */
  get_auction_summary: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<AuctionSummary>>

  /**
   * Construct and simulate a get_minimum_bid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Calculate minimum bid for current auction
   */
  get_minimum_bid: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_auction_history transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Get auction history (simplified - returns last 5 auctions)
   */
  get_auction_history: (options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<Auction>>>

  /**
   * Construct and simulate a set_min_bid_increment transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set minimum bid increment (only owner)
   */
  set_min_bid_increment: ({new_increment}: {new_increment: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_min_starting_bid transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Set minimum starting bid (only owner)
   */
  set_min_starting_bid: ({new_starting_bid}: {new_starting_bid: i128}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a set_platform_wallet transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Update platform wallet (only owner)
   */
  set_platform_wallet: ({new_wallet}: {new_wallet: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

  /**
   * Construct and simulate a transfer_ownership transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   * Transfer ownership (only owner)
   */
  transfer_ownership: ({new_owner}: {new_owner: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  static async deploy<T = Client>(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options: MethodOptions &
      Omit<ContractClientOptions, "contractId"> & {
        /** The hash of the Wasm blob, which must already be installed on-chain. */
        wasmHash: Buffer | string;
        /** Salt used to generate the contract's ID. Passed through to {@link Operation.createCustomContract}. Default: random. */
        salt?: Buffer | Uint8Array;
        /** The format used to decode `wasmHash`, if it's provided as a string. */
        format?: "hex" | "base64";
      }
  ): Promise<AssembledTransaction<T>> {
    return ContractClient.deploy(null, options)
  }
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "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",
        "AAAAAAAAACVHZXQgdGltZSByZW1haW5pbmcgaW4gY3VycmVudCBhdWN0aW9uAAAAAAAAEmdldF90aW1lX3JlbWFpbmluZwAAAAAAAAAAAAEAAAAG",
        "AAAAAAAAACRDaGVjayBpZiBhdWN0aW9uIGlzIGN1cnJlbnRseSBhY3RpdmUAAAARaXNfYXVjdGlvbl9hY3RpdmUAAAAAAAAAAAAAAQAAAAE=",
        "AAAAAAAAABtHZXQgY3VycmVudCBhdWN0aW9uIGRldGFpbHMAAAAAE2dldF9jdXJyZW50X2F1Y3Rpb24AAAAAAAAAAAEAAAfQAAAAB0F1Y3Rpb24A",
        "AAAAAAAAABpHZXQgbGFzdCBjb21wbGV0ZWQgYXVjdGlvbgAAAAAAEGdldF9sYXN0X2F1Y3Rpb24AAAAAAAAAAQAAB9AAAAAHQXVjdGlvbgA=",
        "AAAAAAAAAE1HZXQgc3BlY2lmaWMgYXVjdGlvbiBieSBJRCAobGltaXRlZCBpbXBsZW1lbnRhdGlvbiBkdWUgdG8gZm9ybWF0ISBjb25zdHJhaW50KQAAAAAAAAtnZXRfYXVjdGlvbgAAAAABAAAAAAAAAAphdWN0aW9uX2lkAAAAAAAGAAAAAQAAA+gAAAfQAAAAB0F1Y3Rpb24A",
        "AAAAAAAAABNHZXQgYXVjdGlvbiBjb3VudGVyAAAAABNnZXRfYXVjdGlvbl9jb3VudGVyAAAAAAAAAAABAAAABg==",
        "AAAAAAAAABhHZXQgY29udHJhY3QgaW5mb3JtYXRpb24AAAARZ2V0X2NvbnRyYWN0X2luZm8AAAAAAAAAAAAAAQAAB9AAAAAMQ29udHJhY3RJbmZv",
        "AAAAAAAAAC9HZXQgYXVjdGlvbiBzdW1tYXJ5IChldmVyeXRoaW5nIGZyb250ZW5kIG5lZWRzKQAAAAATZ2V0X2F1Y3Rpb25fc3VtbWFyeQAAAAAAAAAAAQAAB9AAAAAOQXVjdGlvblN1bW1hcnkAAA==",
        "AAAAAAAAAClDYWxjdWxhdGUgbWluaW11bSBiaWQgZm9yIGN1cnJlbnQgYXVjdGlvbgAAAAAAAA9nZXRfbWluaW11bV9iaWQAAAAAAAAAAAEAAAAL",
        "AAAAAAAAADpHZXQgYXVjdGlvbiBoaXN0b3J5IChzaW1wbGlmaWVkIC0gcmV0dXJucyBsYXN0IDUgYXVjdGlvbnMpAAAAAAATZ2V0X2F1Y3Rpb25faGlzdG9yeQAAAAAAAAAAAQAAA+oAAAfQAAAAB0F1Y3Rpb24A",
        "AAAAAAAAACZTZXQgbWluaW11bSBiaWQgaW5jcmVtZW50IChvbmx5IG93bmVyKQAAAAAAFXNldF9taW5fYmlkX2luY3JlbWVudAAAAAAAAAEAAAAAAAAADW5ld19pbmNyZW1lbnQAAAAAAAALAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAACVTZXQgbWluaW11bSBzdGFydGluZyBiaWQgKG9ubHkgb3duZXIpAAAAAAAAFHNldF9taW5fc3RhcnRpbmdfYmlkAAAAAQAAAAAAAAAQbmV3X3N0YXJ0aW5nX2JpZAAAAAsAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAACNVcGRhdGUgcGxhdGZvcm0gd2FsbGV0IChvbmx5IG93bmVyKQAAAAATc2V0X3BsYXRmb3JtX3dhbGxldAAAAAABAAAAAAAAAApuZXdfd2FsbGV0AAAAAAATAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAB9UcmFuc2ZlciBvd25lcnNoaXAgKG9ubHkgb3duZXIpAAAAABJ0cmFuc2Zlcl9vd25lcnNoaXAAAAAAAAEAAAAAAAAACW5ld19vd25lcgAAAAAAABMAAAABAAAD6QAAA+0AAAAAAAAAAw==" ]),
      options
    )
  }
  public readonly fromJSON = {
    initialize: this.txFromJSON<Result<void>>,
        place_bid: this.txFromJSON<Result<void>>,
        start_auction: this.txFromJSON<Result<void>>,
        end_auction: this.txFromJSON<Result<void>>,
        get_qr_url: this.txFromJSON<string>,
        get_current_auction_url: this.txFromJSON<string>,
        has_active_qr_url: this.txFromJSON<boolean>,
        get_qr_url_status: this.txFromJSON<QRStatus>,
        get_qr_url_expiry_time: this.txFromJSON<u64>,
        get_time_remaining: this.txFromJSON<u64>,
        is_auction_active: this.txFromJSON<boolean>,
        get_current_auction: this.txFromJSON<Auction>,
        get_last_auction: this.txFromJSON<Auction>,
        get_auction: this.txFromJSON<Option<Auction>>,
        get_auction_counter: this.txFromJSON<u64>,
        get_contract_info: this.txFromJSON<ContractInfo>,
        get_auction_summary: this.txFromJSON<AuctionSummary>,
        get_minimum_bid: this.txFromJSON<i128>,
        get_auction_history: this.txFromJSON<Array<Auction>>,
        set_min_bid_increment: this.txFromJSON<Result<void>>,
        set_min_starting_bid: this.txFromJSON<Result<void>>,
        set_platform_wallet: this.txFromJSON<Result<void>>,
        transfer_ownership: this.txFromJSON<Result<void>>
  }
}