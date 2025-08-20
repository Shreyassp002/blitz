import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBEFMEZLMEIIH3A2LANCSVJRLXEH2MDMKT7QOIVXGR6RN75YTZFXH7IF",
    }
};
export const Errors = {
    1: { message: "AuctionEnded" },
    2: { message: "NoActiveAuction" },
    3: { message: "BidTooLow" },
    4: { message: "EmptyUrl" },
    5: { message: "NoAuctionToEnd" },
    6: { message: "AuctionNotEnded" },
    7: { message: "AlreadyEnded" },
    8: { message: "Unauthorized" },
    9: { message: "AlreadyInitialized" }
};
export class Client extends ContractClient {
    options;
    static async deploy(
    /** Options for initializing a Client as well as for calling a method, with extras specific to deploying. */
    options) {
        return ContractClient.deploy(null, options);
    }
    constructor(options) {
        super(new ContractSpec(["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",
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
            "AAAAAAAAAB9UcmFuc2ZlciBvd25lcnNoaXAgKG9ubHkgb3duZXIpAAAAABJ0cmFuc2Zlcl9vd25lcnNoaXAAAAAAAAEAAAAAAAAACW5ld19vd25lcgAAAAAAABMAAAABAAAD6QAAA+0AAAAAAAAAAw=="]), options);
        this.options = options;
    }
    fromJSON = {
        initialize: (this.txFromJSON),
        place_bid: (this.txFromJSON),
        start_auction: (this.txFromJSON),
        end_auction: (this.txFromJSON),
        get_qr_url: (this.txFromJSON),
        get_current_auction_url: (this.txFromJSON),
        has_active_qr_url: (this.txFromJSON),
        get_qr_url_status: (this.txFromJSON),
        get_qr_url_expiry_time: (this.txFromJSON),
        get_time_remaining: (this.txFromJSON),
        is_auction_active: (this.txFromJSON),
        get_current_auction: (this.txFromJSON),
        get_last_auction: (this.txFromJSON),
        get_auction: (this.txFromJSON),
        get_auction_counter: (this.txFromJSON),
        get_contract_info: (this.txFromJSON),
        get_auction_summary: (this.txFromJSON),
        get_minimum_bid: (this.txFromJSON),
        get_auction_history: (this.txFromJSON),
        set_min_bid_increment: (this.txFromJSON),
        set_min_starting_bid: (this.txFromJSON),
        set_platform_wallet: (this.txFromJSON),
        transfer_ownership: (this.txFromJSON)
    };
}
