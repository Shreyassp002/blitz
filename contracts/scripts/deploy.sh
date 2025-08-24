#!/bin/bash

# Blitz Auction Contract Deployment Script
set -e

# Configuration
NETWORK="testnet"
SOURCE_ACCOUNT="deployer"
CONTRACT_NAME="blitz"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Blitz Auction Contract Deployment${NC}"
echo "=================================="

# Check if stellar CLI is installed
if ! command -v stellar &> /dev/null; then
    echo -e "${RED}❌ Stellar CLI not found. Please install it first.${NC}"
    exit 1
fi

# Build the contract
echo -e "${YELLOW}📦 Building contract...${NC}"
cargo build --target wasm32v1-none --release

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build successful!${NC}"

# Deploy the contract
echo -e "${YELLOW}🔧 Deploying contract to ${NETWORK}...${NC}"

DEPLOY_OUTPUT=$(stellar contract deploy \
    --wasm target/wasm32v1-none/release/blitz.wasm \
    --source-account $SOURCE_ACCOUNT \
    --network $NETWORK)

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed!${NC}"
    exit 1
fi

CONTRACT_ID=$(echo "$DEPLOY_OUTPUT" | tail -n 1)
echo -e "${GREEN}✅ Contract deployed successfully!${NC}"
echo -e "${BLUE}📋 Contract ID: ${CONTRACT_ID}${NC}"

# Save contract ID to file
echo $CONTRACT_ID > contract-id.txt
echo -e "${GREEN}💾 Contract ID saved to contract-id.txt${NC}"

# Install contract (create alias)
echo -e "${YELLOW}🔗 Installing contract alias...${NC}"
stellar contract install \
    --wasm target/wasm32v1-none/release/blitz.wasm \
    --source-account $SOURCE_ACCOUNT \
    --network $NETWORK

echo -e "${GREEN}🎉 Deployment completed!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Run ./initialize.sh to initialize the contract"
echo "2. Use ./manage.sh for contract operations"
echo ""
echo -e "${YELLOW}Contract ID: ${CONTRACT_ID}${NC}"