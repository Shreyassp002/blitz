# Blitz Smart Contracts

[![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Stellar](https://img.shields.io/badge/Stellar-7D00FF?style=flat&logo=stellar&logoColor=white)](https://stellar.org/)
[![Soroban](https://img.shields.io/badge/Soroban-7D00FF?style=flat&logo=stellar&logoColor=white)](https://soroban.stellar.org/)
[![WASM](https://img.shields.io/badge/WASM-654FF0?style=flat&logo=webassembly&logoColor=white)](https://webassembly.org/)
[![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-000000?style=flat&logo=ethereum&logoColor=white)](https://ethereum.org/)

Smart contracts for the Blitz QR Code Auction platform, built on the Soroban smart contract platform running on the Stellar network. These contracts manage the auction system, bidding mechanics, and QR code destination updates.

## Overview

The Blitz contracts implement a continuous auction system where:
- QR codes are auctioned in 24-hour cycles
- Winners control the QR code destination for the next period
- Auctions run perpetually with automatic cycle transitions
- Bidding and settlement are handled on-chain

## Contract Architecture

- **Auction Management**: Handles auction creation, bidding, and settlement
- **QR Code Control**: Manages destination link updates for auction winners
- **Time Management**: Ensures 24-hour auction cycles and automatic transitions
- **Bid Processing**: Manages bid placement, validation, and winner determination

## Project Structure

```
contracts/
├── blitz/              # Main auction contract
│   ├── src/
│   │   ├── lib.rs      # Core contract logic
│   │   └── test.rs     # Contract tests
│   ├── Cargo.toml      # Contract dependencies
│   └── Makefile        # Build and deployment scripts
├── scripts/            # Deployment and management scripts
├── Cargo.toml          # Workspace configuration
└── README.md           # This file
```

## Development

### Prerequisites

- Rust toolchain
- Stellar CLI
- Stellar testnet account
- wasm32v1-none target: `rustup target add wasm32v1-none`

> **Official Setup Guide**: For detailed setup instructions, follow the [official Stellar smart contract setup guide](https://developers.stellar.org/docs/build/smart-contracts/getting-started/setup).

### Building

```bash
cargo build --target wasm32v1-none --release
```

### Testing

```bash
cargo test
```

### Deployment

Use the provided deployment scripts in the `scripts/` directory:

```bash
cd scripts
./deploy.sh
```

### Initialization

After deployment, initialize the contract with owner, platform wallet, and token addresses:

```bash
cd scripts
./initialize.sh
```

The initialization script will:
- Load the contract ID from deployment
- Allow you to set custom addresses or use defaults
- Initialize the contract with proper configuration
- Create a `config.env` file for future operations

### Management

Use the management script for ongoing contract operations:

```bash
cd scripts
./manage.sh [command]
```

Available commands:
- `start-auction` - Start a new auction
- `place-bid` - Place a bid interactively
- `summary` - Get auction status
- `help` - Show all available commands

The scripts use Stellar CLI commands like:
- `stellar contract deploy` - Deploy the contract
- `stellar contract install` - Install contract alias
- `stellar contract invoke` - Call contract functions

## Contract Functions

### **Core Auction Functions**
- **initialize**: Initialize the contract with owner and configuration
- **start_auction**: Start a new QR code auction
- **place_bid**: Submit a bid with preferred URL for the current auction
- **end_auction**: End the current auction and determine winner

### **Query Functions**
- **get_current_auction**: Get current auction details
- **get_last_auction**: Get last completed auction
- **get_auction_summary**: Get comprehensive auction status
- **get_minimum_bid**: Calculate minimum bid for current auction
- **get_time_remaining**: Get time left in current auction
- **is_auction_active**: Check if auction is currently active

### **QR Code Management**
- **get_qr_url**: Get the current QR code destination URL
- **get_current_auction_url**: Get URL during active bidding
- **get_qr_url_status**: Get QR code status and source
- **get_qr_url_expiry_time**: Get when current URL expires

### **Owner Functions**
- **set_min_bid_increment**: Set minimum bid increment (owner only)
- **set_min_starting_bid**: Set minimum starting bid (owner only)
- **set_platform_wallet**: Update platform wallet address (owner only)
- **transfer_ownership**: Transfer contract ownership (owner only)

### **Utility Functions**
- **get_contract_info**: Get contract configuration and status
- **get_auction_counter**: Get total number of auctions
- **get_auction_history**: Get history of completed auctions

## Configuration

The `scripts/config.env` file contains contract deployment and initialization settings:

- **CONTRACT_ID**: The deployed contract's address
- **OWNER_ADDRESS**: Contract owner's Stellar address
- **PLATFORM_WALLET**: Wallet address for receiving auction fees
- **TOKEN_ADDRESS**: Stellar token address for payments
- **NETWORK**: Network (testnet/mainnet)
- **SOURCE_ACCOUNT**: Account used for contract operations

> **Note**: Auction duration, bid increments, and other parameters are hardcoded in the smart contract and can be modified by the owner using the `set_min_bid_increment` and `set_min_starting_bid` functions.

## Security Features

- Bid validation and verification
- Time-based auction enforcement
- Secure winner determination
- Access control for admin functions