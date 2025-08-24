# Blitz Frontend

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Web3](https://img.shields.io/badge/Web3-F16822?style=flat&logo=web3.js&logoColor=white)](https://web3js.org/)

The web application for the Blitz QR Code Auction platform, built with Next.js. This frontend provides an intuitive interface for users to participate in auctions, place bids, and manage QR code destinations.

## Overview

The Blitz frontend enables users to:
- View active auctions and their current status
- Place bids on QR codes with their preferred URLs in real-time
- Monitor auction progress and time remaining
- Submit preferred URLs during bidding (URLs are displayed if they win)
- Connect wallets for blockchain interactions

## Features

- **Auction Interface**: Real-time display of auction information
- **Bidding System**: Interactive bid placement with validation
- **Wallet Integration**: Seamless connection to freighter wallets
- **QR Code Management**: Dynamic destination updates for winners
- **Responsive Design**: Mobile-friendly interface for all devices

## Project Structure

```
frontend/
├── src/
│   ├── app/            # Next.js app router pages
│   │   ├── auction/    # Auction page components
│   │   ├── api/        # API routes
│   │   └── globals.css # Global styles
│   ├── components/     # Reusable React components
│   │   ├── auction/    # Auction-specific components
│   │   ├── Home/       # Landing page components
│   │   └── WalletConnect.jsx
│   ├── hooks/          # Custom React hooks
│   ├── lib/            # Utility libraries and configurations
│   └── contracts/      # Contract interaction layer
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Building

```bash
npm run build
```

### Production

```bash
npm start
```

## Key Components

- **AuctionDisplay**: Shows current auction status and bidding interface
- **QRCodeDisplay**: Renders QR codes with current destinations
- **SafeIframe**: Safely displays external URLs in iframes
- **WinnerPreview**: Displays auction results and winner information
- **WalletConnect**: Handles wallet connection and blockchain interactions
- **CryptoTicker**: Displays cryptocurrency price information
- **Header & Footer**: Navigation and branding components
- **HeroSection**: Landing page hero section
- **FeaturesGrid**: Showcases platform features

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Library**: React 18
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **Blockchain**: Stellar Network
- **Wallet Support**: Freighter wallet integration
- **QR Codes**: Dynamic QR code generation and management



## Integration

The frontend integrates with:
- Blitz smart contracts on Soroban (running on Stellar network)
- Freighter wallet for blockchain transactions
- QR code generation services
- Real-time auction updates
