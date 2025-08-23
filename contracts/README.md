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

The scripts use Stellar CLI commands like:
- `stellar contract deploy` - Deploy the contract
- `stellar contract install` - Install contract alias
- `stellar contract invoke` - Call contract functions

## Contract Functions

- **create_auction**: Initialize a new QR code auction
- **place_bid**: Submit a bid for the current auction
- **finalize_auction**: Complete the auction and determine winner
- **update_destination**: Set the QR code destination for the winner
- **get_auction_status**: Query current auction information

## Configuration

Contract parameters can be configured in `scripts/config.env`:
- Auction duration
- Minimum bid increments
- Platform fees
- Network endpoints

## Security Features

- Bid validation and verification
- Time-based auction enforcement
- Secure winner determination
- Access control for admin functions