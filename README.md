<div align="center">
  <img src="logo.png" alt="Blitz Logo" width="200"/>
  
  # Blitz - QR Code Auction Platform
  
  [![Rust](https://img.shields.io/badge/Rust-000000?style=flat&logo=rust&logoColor=white)](https://www.rust-lang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
  [![Stellar](https://img.shields.io/badge/Stellar-7D00FF?style=flat&logo=stellar&logoColor=white)](https://stellar.org/)
  [![Soroban](https://img.shields.io/badge/Soroban-7D00FF?style=flat&logo=stellar&logoColor=white)](https://soroban.stellar.org/)
  [![Web3](https://img.shields.io/badge/Web3-F16822?style=flat&logo=web3.js&logoColor=white)](https://web3js.org/)
  [![Hackathon](https://img.shields.io/badge/Hackathon-Project-blue)](https://github.com/)
</div>

A decentralized auction platform where users bid on QR codes to control their destination links for 24-hour periods. The same QR code remains constant while the underlying link changes based on auction winners, making it perfect for traffic generation, promotion, and marketing campaigns.

## Project Overview

Blitz enables a continuous auction system where:
- QR codes are auctioned in 24-hour cycles
- Winners control the QR code's destination for the next 24 hours
- Auctions run continuously, creating a perpetual bidding ecosystem
- Perfect for businesses seeking traffic, promotion, and marketing exposure

## Architecture

- **Smart Contracts**: Built on Soroban smart contract platform running on the Stellar network
- **Frontend**: Next.js application with modern UI for auction participation
- **QR Code Management**: Dynamic link updates while maintaining consistent QR code appearance

## Key Features

- 24-hour auction cycles
- Real-time bidding interface
- Dynamic QR code destination management
- Decentralized auction settlement
- Continuous auction system

## Project Structure

```
Blitz/
├── contracts/          # Soroban smart contracts
├── frontend/          # Next.js web application
└── README.md          # This file
```

## Quick Start

1. **Deploy Contracts**: Navigate to [`contracts/`](./contracts/) and follow the deployment guide in their README
2. **Run Frontend**: Navigate to [`frontend/`](./frontend/) and start the development server using their README instructions
3. **Participate**: Connect your wallet and start bidding on QR codes

> **📖 Detailed Instructions**: Each directory contains its own comprehensive README with specific setup, deployment, and usage instructions.

## Technology Stack

### **Blockchain & Smart Contracts**
- **Network**: Stellar network with Soroban smart contract platform
- **Language**: Rust with wasm32v1-none target
- **Deployment**: Stellar CLI for contract management
- **Storage**: Persistent storage with Soroban SDK

### **Frontend & UI**
- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **Responsive Design**: Mobile-first approach

### **Development & Tools**
- **Package Manager**: npm/Node.js
- **Build Tool**: Cargo for Rust, Next.js build system
- **Version Control**: Git
- **Code Quality**: ESLint, Rust compiler

### **Integration & Services**
- **Wallet**: Freighter wallet integration
- **QR Codes**: Dynamic generation and management
- **Real-time Updates**: Live auction monitoring
- **API**: RESTful endpoints for contract interaction

## Use Cases

- **Marketing Campaigns**: Direct traffic to promotional content
- **Event Promotion**: Link to event details or registration
- **Product Launches**: Drive traffic to new product pages
- **Content Distribution**: Share different content through the same QR code
- **A/B Testing**: Test different landing pages with the same physical QR code
