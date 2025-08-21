#!/bin/bash

# Blitz Auction Contract Initialization Script
set -e

# Configuration
NETWORK="testnet"
SOURCE_ACCOUNT="deployer"

# Default addresses (update these with your actual addresses)
OWNER_ADDRESS="GANVOL5URROHRSW634VIMFQQH7YTTFZPUMLT4X5QGQO6P76YBFDLN7U5"
PLATFORM_WALLET="GAGMVR2MR4KQZWOQWYL57I7OWPYHP7WFRALRUH72D2VON5ELP3J2OTPN"
TOKEN_ADDRESS="CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔧 Blitz Auction Contract Initialization${NC}"
echo "======================================="

# Check if contract ID file exists
if [ ! -f "contract-id.txt" ]; then
    echo -e "${RED}❌ Contract ID not found. Please run deploy.sh first or create contract-id.txt with your contract ID.${NC}"
    exit 1
fi

CONTRACT_ID=$(cat contract-id.txt)
echo -e "${BLUE}📋 Contract ID: ${CONTRACT_ID}${NC}"

# Allow user to override addresses
echo -e "${YELLOW}🔍 Current configuration:${NC}"
echo "Owner Address: $OWNER_ADDRESS"
echo "Platform Wallet: $PLATFORM_WALLET"
echo "Token Address: $TOKEN_ADDRESS"
echo ""

read -p "Do you want to use custom addresses? (y/n): " USE_CUSTOM

if [ "$USE_CUSTOM" = "y" ] || [ "$USE_CUSTOM" = "Y" ]; then
    read -p "Enter Owner Address: " CUSTOM_OWNER
    read -p "Enter Platform Wallet Address: " CUSTOM_PLATFORM
    read -p "Enter Token Address (or press Enter for default): " CUSTOM_TOKEN
    
    if [ ! -z "$CUSTOM_OWNER" ]; then
        OWNER_ADDRESS=$CUSTOM_OWNER
    fi
    
    if [ ! -z "$CUSTOM_PLATFORM" ]; then
        PLATFORM_WALLET=$CUSTOM_PLATFORM
    fi
    
    if [ ! -z "$CUSTOM_TOKEN" ]; then
        TOKEN_ADDRESS=$CUSTOM_TOKEN
    fi
fi

echo ""
echo -e "${YELLOW}🚀 Initializing contract with:${NC}"
echo "Owner: $OWNER_ADDRESS"
echo "Platform Wallet: $PLATFORM_WALLET"
echo "Token: $TOKEN_ADDRESS"
echo ""

# Initialize the contract
echo -e "${YELLOW}⏳ Initializing contract...${NC}"

stellar contract invoke \
    --id $CONTRACT_ID \
    --source-account $SOURCE_ACCOUNT \
    --network $NETWORK \
    --send=yes \
    -- initialize \
    --owner $OWNER_ADDRESS \
    --platform_wallet $PLATFORM_WALLET \
    --token_address $TOKEN_ADDRESS

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Contract initialized successfully!${NC}"
    
    # Save configuration
    cat > config.env << EOF
CONTRACT_ID=$CONTRACT_ID
OWNER_ADDRESS=$OWNER_ADDRESS
PLATFORM_WALLET=$PLATFORM_WALLET
TOKEN_ADDRESS=$TOKEN_ADDRESS
NETWORK=$NETWORK
SOURCE_ACCOUNT=$SOURCE_ACCOUNT
EOF
    
    echo -e "${GREEN}💾 Configuration saved to config.env${NC}"
    echo ""
    echo -e "${BLUE}🎉 Initialization completed!${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Run './manage.sh summary' to check contract status"
    echo "2. Run './manage.sh start-auction' to start the first auction"
else
    echo -e "${RED}❌ Initialization failed!${NC}"
    exit 1
fi