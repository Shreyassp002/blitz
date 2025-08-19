#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, token, Address, Env, String,
    Symbol, Vec,
};

// Constants
const AUCTION_DURATION: u64 = 24 * 60 * 60; // 24 hours in seconds
const URL_DISPLAY_DURATION: u64 = 24 * 60 * 60; // 24 hours in seconds
const DEFAULT_MIN_BID_INCREMENT: i128 = 1000000; // 0.1 XLM (7 decimal places)
const DEFAULT_MIN_STARTING_BID: i128 = 10000000; // 1 XLM

// Storage keys
const PLATFORM_WALLET: Symbol = symbol_short!("PLATFORM");
const AUCTION_COUNTER: Symbol = symbol_short!("COUNTER");
const CURRENT_AUCTION: Symbol = symbol_short!("CURRENT");
const LAST_AUCTION: Symbol = symbol_short!("LAST");
const OWNER: Symbol = symbol_short!("OWNER");
const TOKEN: Symbol = symbol_short!("TOKEN");
const MIN_BID_INCREMENT: Symbol = symbol_short!("MIN_INC");
const MIN_STARTING_BID: Symbol = symbol_short!("MIN_BID");

// Error codes
#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, PartialOrd, Ord)]
#[repr(u32)]
pub enum Error {
    AuctionEnded = 1,
    NoActiveAuction = 2,
    BidTooLow = 3,
    EmptyUrl = 4,
    NoAuctionToEnd = 5,
    AuctionNotEnded = 6,
    AlreadyEnded = 7,
    Unauthorized = 8,
    AlreadyInitialized = 9,
}

// Data structures
#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct Auction {
    pub auction_id: u64,
    pub starting_time: u64,
    pub ending_time: u64,
    pub highest_bid: i128,
    pub highest_bidder: Address,
    pub preferred_url: String,
    pub is_ended: bool,
    pub url_expiry_time: u64,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct QRStatus {
    pub status: String,
    pub source: String,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ContractInfo {
    pub owner: Address,
    pub platform_wallet: Address,
    pub token_address: Address,
    pub auction_counter: u64,
    pub min_bid_increment: i128,
    pub min_starting_bid: i128,
}

#[contracttype]
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AuctionSummary {
    pub current_auction: Auction,
    pub last_auction: Auction,
    pub is_active: bool,
    pub time_remaining: u64,
    pub has_active_qr: bool,
    pub qr_url: String,
}

#[contract]
pub struct Blitz;

#[contractimpl]
impl Blitz {
    /// Initialize the contract
    pub fn initialize(
        env: Env,
        owner: Address,
        platform_wallet: Address,
        token_address: Address, // Native XLM token address
    ) -> Result<(), Error> {
        owner.require_auth();

        // Check if already initialized
        if env.storage().persistent().has(&OWNER) {
            return Err(Error::AlreadyInitialized);
        }

        // Set contract owner
        env.storage().persistent().set(&OWNER, &owner);

        // Set platform wallet for receiving payments
        env.storage()
            .persistent()
            .set(&PLATFORM_WALLET, &platform_wallet);

        // Set token address
        env.storage().persistent().set(&TOKEN, &token_address);

        // Initialize auction counter
        env.storage().persistent().set(&AUCTION_COUNTER, &0u64);

        // Set default bid parameters
        env.storage()
            .persistent()
            .set(&MIN_BID_INCREMENT, &DEFAULT_MIN_BID_INCREMENT);
        env.storage()
            .persistent()
            .set(&MIN_STARTING_BID, &DEFAULT_MIN_STARTING_BID);

        // Create empty initial auction
        let empty_auction = Auction {
            auction_id: 0,
            starting_time: 0,
            ending_time: 0,
            highest_bid: 0,
            highest_bidder: owner.clone(),
            preferred_url: String::from_str(&env, ""),
            is_ended: true,
            url_expiry_time: 0,
        };

        env.storage()
            .persistent()
            .set(&CURRENT_AUCTION, &empty_auction);
        env.storage()
            .persistent()
            .set(&LAST_AUCTION, &empty_auction);

        // Emit initialization event
        env.events().publish(
            (symbol_short!("init"),),
            (&owner, &platform_wallet, &token_address),
        );

        Ok(())
    }

    /// Place a bid on the current auction
    pub fn place_bid(
        env: Env,
        bidder: Address,
        amount: i128,
        preferred_url: String,
    ) -> Result<(), Error> {
        bidder.require_auth();

        let mut current_auction: Auction = env
            .storage()
            .persistent()
            .get(&CURRENT_AUCTION)
            .ok_or(Error::NoActiveAuction)?;

        let current_time = env.ledger().timestamp();

        // Check if auction is active
        if current_time >= current_auction.ending_time {
            return Err(Error::AuctionEnded);
        }

        if current_auction.starting_time == 0 {
            return Err(Error::NoActiveAuction);
        }

        // Check URL is not empty
        if preferred_url.len() == 0 {
            return Err(Error::EmptyUrl);
        }

        // Calculate minimum bid using stored values
        let min_starting_bid = Self::get_min_starting_bid(&env);
        let min_bid_increment = Self::get_min_bid_increment(&env);

        let minimum_bid = if current_auction.highest_bid == 0 {
            min_starting_bid
        } else {
            current_auction.highest_bid + min_bid_increment
        };

        if amount < minimum_bid {
            return Err(Error::BidTooLow);
        }

        // Get token client
        let token_address: Address = env.storage().persistent().get(&TOKEN).unwrap();
        let token = token::Client::new(&env, &token_address);

        // Refund previous highest bidder if exists and different from current bidder
        if current_auction.highest_bidder != bidder && current_auction.highest_bid > 0 {
            token.transfer(
                &env.current_contract_address(),
                &current_auction.highest_bidder,
                &current_auction.highest_bid,
            );
        }

        // Transfer new bid from bidder to contract
        token.transfer(&bidder, &env.current_contract_address(), &amount);

        // Update auction data
        current_auction.highest_bid = amount;
        current_auction.highest_bidder = bidder.clone();
        current_auction.preferred_url = preferred_url.clone();

        // Save updated auction
        env.storage()
            .persistent()
            .set(&CURRENT_AUCTION, &current_auction);

        // Emit event - Fixed: use symbol_short with max 9 characters and clone String
        env.events().publish(
            (symbol_short!("bid_place"), current_auction.auction_id),
            (bidder.clone(), amount, preferred_url.clone(), current_time),
        );

        Ok(())
    }

    /// Start a new auction (only owner)
    pub fn start_auction(env: Env) -> Result<(), Error> {
        let owner: Address = env.storage().persistent().get(&OWNER).unwrap();
        owner.require_auth();

        let mut counter: u64 = env
            .storage()
            .persistent()
            .get(&AUCTION_COUNTER)
            .unwrap_or(0);
        let current_time = env.ledger().timestamp();

        // End current auction if it exists and hasn't been ended
        let current_auction: Auction = env.storage().persistent().get(&CURRENT_AUCTION).unwrap();

        if current_auction.starting_time > 0 && !current_auction.is_ended {
            Self::end_current_auction(&env)?;
        }

        // Increment counter
        counter += 1;
        env.storage().persistent().set(&AUCTION_COUNTER, &counter);

        // Create new auction
        let new_auction = Auction {
            auction_id: counter,
            starting_time: current_time,
            ending_time: current_time + AUCTION_DURATION,
            highest_bid: 0,
            highest_bidder: owner.clone(),
            preferred_url: String::from_str(&env, ""),
            is_ended: false,
            url_expiry_time: 0,
        };

        env.storage()
            .persistent()
            .set(&CURRENT_AUCTION, &new_auction);

        // Emit event
        env.events().publish(
            (symbol_short!("started"), counter),
            (current_time, new_auction.ending_time),
        );

        Ok(())
    }

    /// End the current auction
    pub fn end_auction(env: Env) -> Result<(), Error> {
        let current_auction: Auction = env.storage().persistent().get(&CURRENT_AUCTION).unwrap();

        if current_auction.starting_time == 0 {
            return Err(Error::NoAuctionToEnd);
        }

        let current_time = env.ledger().timestamp();
        if current_time <= current_auction.ending_time {
            return Err(Error::AuctionNotEnded);
        }

        if current_auction.is_ended {
            return Err(Error::AlreadyEnded);
        }

        Self::end_current_auction(&env)
    }

    /// Internal function to end current auction
    fn end_current_auction(env: &Env) -> Result<(), Error> {
        let mut current_auction: Auction =
            env.storage().persistent().get(&CURRENT_AUCTION).unwrap();

        let current_time = env.ledger().timestamp();

        // Transfer winning bid to platform wallet if there's a winner
        if current_auction.highest_bid > 0 {
            let platform_wallet: Address =
                env.storage().persistent().get(&PLATFORM_WALLET).unwrap();
            let token_address: Address = env.storage().persistent().get(&TOKEN).unwrap();
            let token = token::Client::new(env, &token_address);

            token.transfer(
                &env.current_contract_address(),
                &platform_wallet,
                &current_auction.highest_bid,
            );
        }

        // Mark auction as ended and set URL expiry
        current_auction.is_ended = true;
        current_auction.url_expiry_time = current_time + URL_DISPLAY_DURATION;

        // Store completed auction in history - Fixed: use static string instead of format!
        let auction_id = current_auction.auction_id;
        let auction_key = if auction_id <= 99 {
            // For auction IDs 1-99, we can create static keys
            match auction_id {
                1 => symbol_short!("auct_1"),
                2 => symbol_short!("auct_2"),
                3 => symbol_short!("auct_3"),
                4 => symbol_short!("auct_4"),
                5 => symbol_short!("auct_5"),
                _ => symbol_short!("auct_def"), // fallback for other IDs
            }
        } else {
            symbol_short!("auct_def") // fallback for high IDs
        };

        env.storage()
            .persistent()
            .set(&auction_key, &current_auction);

        // Update last completed auction
        env.storage()
            .persistent()
            .set(&LAST_AUCTION, &current_auction);

        // Update current auction
        env.storage()
            .persistent()
            .set(&CURRENT_AUCTION, &current_auction);

        // Emit event - Fixed: clone String values
        env.events().publish(
            (symbol_short!("ended"), current_auction.auction_id),
            (
                current_auction.highest_bidder.clone(),
                current_auction.highest_bid,
                current_auction.preferred_url.clone(),
                current_time,
                current_auction.url_expiry_time,
            ),
        );

        Ok(())
    }

    /// Get the QR URL to display
    pub fn get_qr_url(env: Env) -> String {
        let last_auction: Auction = env
            .storage()
            .persistent()
            .get(&LAST_AUCTION)
            .unwrap_or_else(|| Self::get_empty_auction(&env));

        let current_time = env.ledger().timestamp();

        // If last auction is ended and URL is still valid
        if last_auction.is_ended
            && current_time < last_auction.url_expiry_time
            && last_auction.preferred_url.len() > 0
        {
            return last_auction.preferred_url;
        }

        String::from_str(&env, "")
    }

    /// Get current auction URL (during bidding)
    pub fn get_current_auction_url(env: Env) -> String {
        if Self::is_auction_active(env.clone()) {
            let current_auction: Auction =
                env.storage().persistent().get(&CURRENT_AUCTION).unwrap();
            if current_auction.preferred_url.len() > 0 {
                return current_auction.preferred_url;
            }
        }
        String::from_str(&env, "")
    }

    /// Check if there's an active QR URL
    pub fn has_active_qr_url(env: Env) -> bool {
        Self::get_qr_url(env).len() > 0
    }

    /// Get QR URL status and source
    pub fn get_qr_url_status(env: Env) -> QRStatus {
        if Self::is_auction_active(env.clone()) {
            let current_auction: Auction =
                env.storage().persistent().get(&CURRENT_AUCTION).unwrap();
            if current_auction.preferred_url.len() > 0 {
                return QRStatus {
                    status: String::from_str(&env, "auction_active"),
                    source: String::from_str(&env, "Current Auction"),
                };
            }
        }

        let last_auction: Auction = env
            .storage()
            .persistent()
            .get(&LAST_AUCTION)
            .unwrap_or_else(|| Self::get_empty_auction(&env));
        let current_time = env.ledger().timestamp();

        if last_auction.is_ended
            && current_time < last_auction.url_expiry_time
            && last_auction.preferred_url.len() > 0
        {
            return QRStatus {
                status: String::from_str(&env, "winner_display"),
                source: String::from_str(&env, "Winner Display"),
            };
        }

        QRStatus {
            status: String::from_str(&env, "default"),
            source: String::from_str(&env, "Default"),
        }
    }

    /// Get QR URL expiry time
    pub fn get_qr_url_expiry_time(env: Env) -> u64 {
        if Self::is_auction_active(env.clone()) {
            let current_auction: Auction =
                env.storage().persistent().get(&CURRENT_AUCTION).unwrap();
            if current_auction.preferred_url.len() > 0 {
                return current_auction.ending_time + URL_DISPLAY_DURATION;
            }
        }

        let last_auction: Auction = env
            .storage()
            .persistent()
            .get(&LAST_AUCTION)
            .unwrap_or_else(|| Self::get_empty_auction(&env));
        let current_time = env.ledger().timestamp();

        if last_auction.is_ended && current_time < last_auction.url_expiry_time {
            return last_auction.url_expiry_time;
        }

        0
    }

    /// Get time remaining in current auction
    pub fn get_time_remaining(env: Env) -> u64 {
        let current_auction: Auction = env
            .storage()
            .persistent()
            .get(&CURRENT_AUCTION)
            .unwrap_or_else(|| Self::get_empty_auction(&env));
        let current_time = env.ledger().timestamp();

        if current_time >= current_auction.ending_time {
            return 0;
        }

        current_auction.ending_time - current_time
    }

    /// Check if auction is currently active
    pub fn is_auction_active(env: Env) -> bool {
        let current_auction: Auction = env
            .storage()
            .persistent()
            .get(&CURRENT_AUCTION)
            .unwrap_or_else(|| Self::get_empty_auction(&env));
        let current_time = env.ledger().timestamp();

        current_auction.starting_time > 0
            && current_time < current_auction.ending_time
            && !current_auction.is_ended
    }

    /// Get current auction details
    pub fn get_current_auction(env: Env) -> Auction {
        env.storage()
            .persistent()
            .get(&CURRENT_AUCTION)
            .unwrap_or_else(|| Self::get_empty_auction(&env))
    }

    /// Get last completed auction
    pub fn get_last_auction(env: Env) -> Auction {
        env.storage()
            .persistent()
            .get(&LAST_AUCTION)
            .unwrap_or_else(|| Self::get_empty_auction(&env))
    }

    /// Get specific auction by ID (limited implementation due to format! constraint)
    pub fn get_auction(env: Env, auction_id: u64) -> Option<Auction> {
        let auction_key = match auction_id {
            1 => symbol_short!("auct_1"),
            2 => symbol_short!("auct_2"),
            3 => symbol_short!("auct_3"),
            4 => symbol_short!("auct_4"),
            5 => symbol_short!("auct_5"),
            _ => return None, // For now, only support first 5 auctions due to format! limitation
        };
        env.storage().persistent().get(&auction_key)
    }

    /// Get auction counter
    pub fn get_auction_counter(env: Env) -> u64 {
        env.storage()
            .persistent()
            .get(&AUCTION_COUNTER)
            .unwrap_or(0)
    }

    /// Get contract information
    pub fn get_contract_info(env: Env) -> ContractInfo {
        ContractInfo {
            owner: env.storage().persistent().get(&OWNER).unwrap(),
            platform_wallet: env.storage().persistent().get(&PLATFORM_WALLET).unwrap(),
            token_address: env.storage().persistent().get(&TOKEN).unwrap(),
            auction_counter: Self::get_auction_counter(env.clone()),
            min_bid_increment: Self::get_min_bid_increment(&env),
            min_starting_bid: Self::get_min_starting_bid(&env),
        }
    }

    /// Get auction summary (everything frontend needs)
    pub fn get_auction_summary(env: Env) -> AuctionSummary {
        let current_auction = Self::get_current_auction(env.clone());
        let last_auction = Self::get_last_auction(env.clone());
        let is_active = Self::is_auction_active(env.clone());
        let time_remaining = Self::get_time_remaining(env.clone());
        let has_active_qr = Self::has_active_qr_url(env.clone());
        let qr_url = Self::get_qr_url(env.clone());

        AuctionSummary {
            current_auction,
            last_auction,
            is_active,
            time_remaining,
            has_active_qr,
            qr_url,
        }
    }

    /// Calculate minimum bid for current auction
    pub fn get_minimum_bid(env: Env) -> i128 {
        let current_auction = Self::get_current_auction(env.clone());
        let min_starting_bid = Self::get_min_starting_bid(&env);
        let min_bid_increment = Self::get_min_bid_increment(&env);

        if current_auction.highest_bid == 0 {
            min_starting_bid
        } else {
            current_auction.highest_bid + min_bid_increment
        }
    }

    /// Get auction history (simplified - returns last 5 auctions)
    pub fn get_auction_history(env: Env) -> Vec<Auction> {
        let mut auctions = Vec::new(&env);

        // Due to format! limitation, we can only retrieve first 5 auctions
        for i in 1..=5 {
            if let Some(auction) = Self::get_auction(env.clone(), i) {
                auctions.push_back(auction);
            }
        }

        auctions
    }

    // === OWNER FUNCTIONS ===

    /// Set minimum bid increment (only owner)
    pub fn set_min_bid_increment(env: Env, new_increment: i128) -> Result<(), Error> {
        let owner: Address = env.storage().persistent().get(&OWNER).unwrap();
        owner.require_auth();

        env.storage()
            .persistent()
            .set(&MIN_BID_INCREMENT, &new_increment);

        env.events()
            .publish((symbol_short!("min_inc"),), new_increment);

        Ok(())
    }

    /// Set minimum starting bid (only owner)
    pub fn set_min_starting_bid(env: Env, new_starting_bid: i128) -> Result<(), Error> {
        let owner: Address = env.storage().persistent().get(&OWNER).unwrap();
        owner.require_auth();

        env.storage()
            .persistent()
            .set(&MIN_STARTING_BID, &new_starting_bid);

        env.events()
            .publish((symbol_short!("min_bid"),), new_starting_bid);

        Ok(())
    }

    /// Update platform wallet (only owner)
    pub fn set_platform_wallet(env: Env, new_wallet: Address) -> Result<(), Error> {
        let owner: Address = env.storage().persistent().get(&OWNER).unwrap();
        owner.require_auth();

        env.storage()
            .persistent()
            .set(&PLATFORM_WALLET, &new_wallet);

        env.events()
            .publish((symbol_short!("platform"),), new_wallet);

        Ok(())
    }

    /// Transfer ownership (only owner)
    pub fn transfer_ownership(env: Env, new_owner: Address) -> Result<(), Error> {
        let owner: Address = env.storage().persistent().get(&OWNER).unwrap();
        owner.require_auth();

        env.storage().persistent().set(&OWNER, &new_owner);

        env.events()
            .publish((symbol_short!("owner"),), (owner, new_owner));

        Ok(())
    }

    // === HELPER FUNCTIONS ===

    /// Get minimum bid increment
    fn get_min_bid_increment(env: &Env) -> i128 {
        env.storage()
            .persistent()
            .get(&MIN_BID_INCREMENT)
            .unwrap_or(DEFAULT_MIN_BID_INCREMENT)
    }

    /// Get minimum starting bid
    fn get_min_starting_bid(env: &Env) -> i128 {
        env.storage()
            .persistent()
            .get(&MIN_STARTING_BID)
            .unwrap_or(DEFAULT_MIN_STARTING_BID)
    }

    /// Create empty auction for defaults
    fn get_empty_auction(env: &Env) -> Auction {
        let owner: Address = env.storage().persistent().get(&OWNER).unwrap();
        Auction {
            auction_id: 0,
            starting_time: 0,
            ending_time: 0,
            highest_bid: 0,
            highest_bidder: owner,
            preferred_url: String::from_str(env, ""),
            is_ended: true,
            url_expiry_time: 0,
        }
    }
}
