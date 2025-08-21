#!/bin/bash

# Blitz Auction Contract Management Script
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Load configuration
if [ -f "config.env" ]; then
    source config.env
else
    echo -e "${RED}❌ Configuration file not found. Please run initialize.sh first.${NC}"
    exit 1
fi

# Function to display help
show_help() {
    echo -e "${BLUE}🔧 Blitz Auction Contract Management${NC}"
    echo "=================================="
    echo ""
    echo -e "${YELLOW}Available commands:${NC}"
    echo "  summary              - Get contract and auction summary"
    echo "  start-auction        - Start a new auction"
    echo "  end-auction          - End current auction"
    echo "  current-auction      - Get current auction details"
    echo "  last-auction         - Get last completed auction"
    echo "  auction-history      - Get auction history"
    echo "  place-bid           - Place a bid (interactive)"
    echo "  get-qr-url          - Get current QR URL to display"
    echo "  contract-info       - Get contract information"
    echo "  time-remaining      - Get time remaining in current auction"
    echo "  minimum-bid         - Get minimum bid for current auction"
    echo "  is-active           - Check if auction is active"
    echo "  set-min-increment   - Set minimum bid increment (owner only)"
    echo "  set-min-starting    - Set minimum starting bid (owner only)"
    echo "  help                - Show this help message"
    echo ""
    echo -e "${CYAN}Contract ID: ${CONTRACT_ID}${NC}"
    echo -e "${CYAN}Network: ${NETWORK}${NC}"
}

# Function to invoke contract
invoke_contract() {
    local method=$1
    shift
    
    stellar contract invoke \
        --id $CONTRACT_ID \
        --source-account $SOURCE_ACCOUNT \
        --network $NETWORK \
        --send=yes \
        -- $method "$@"
}

# Function to call contract (read-only)
call_contract() {
    local method=$1
    shift
    
    stellar contract invoke \
        --id $CONTRACT_ID \
        --source-account $SOURCE_ACCOUNT \
        --network $NETWORK \
        -- $method "$@"
}

# Main command handler
case "$1" in
    "summary")
        echo -e "${BLUE}📊 Getting auction summary...${NC}"
        call_contract get_auction_summary
        ;;
    
    "start-auction")
        echo -e "${YELLOW}🚀 Starting new auction...${NC}"
        invoke_contract start_auction
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Auction started successfully!${NC}"
        fi
        ;;
    
    "end-auction")
        echo -e "${YELLOW}🏁 Ending current auction...${NC}"
        invoke_contract end_auction
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Auction ended successfully!${NC}"
        fi
        ;;
    
    "current-auction")
        echo -e "${BLUE}📋 Getting current auction details...${NC}"
        call_contract get_current_auction
        ;;
    
    "last-auction")
        echo -e "${BLUE}📋 Getting last auction details...${NC}"
        call_contract get_last_auction
        ;;
    
    "auction-history")
        echo -e "${BLUE}📚 Getting auction history...${NC}"
        call_contract get_auction_history
        ;;
    
    "place-bid")
        echo -e "${YELLOW}💰 Place a bid${NC}"
        echo "=================="
        
        read -p "Enter bidder address: " BIDDER
        read -p "Enter bid amount (in stroops, e.g., 10000000 for 1 XLM): " AMOUNT
        read -p "Enter preferred URL: " URL
        
        if [ -z "$BIDDER" ] || [ -z "$AMOUNT" ] || [ -z "$URL" ]; then
            echo -e "${RED}❌ All fields are required!${NC}"
            exit 1
        fi
        
        echo -e "${YELLOW}⏳ Placing bid...${NC}"
        invoke_contract place_bid --bidder $BIDDER --amount $AMOUNT --preferred_url "$URL"
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Bid placed successfully!${NC}"
        fi
        ;;
    
    "get-qr-url")
        echo -e "${BLUE}📱 Getting QR URL...${NC}"
        call_contract get_qr_url
        ;;
    
    "contract-info")
        echo -e "${BLUE}ℹ️  Getting contract information...${NC}"
        call_contract get_contract_info
        ;;
    
    "time-remaining")
        echo -e "${BLUE}⏰ Getting time remaining...${NC}"
        call_contract get_time_remaining
        ;;
    
    "minimum-bid")
        echo -e "${BLUE}💵 Getting minimum bid...${NC}"
        call_contract get_minimum_bid
        ;;
    
    "is-active")
        echo -e "${BLUE}❓ Checking if auction is active...${NC}"
        call_contract is_auction_active
        ;;
    
    "set-min-increment")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Please provide increment amount in stroops${NC}"
            echo "Example: ./manage.sh set-min-increment 1000000"
            exit 1
        fi
        
        echo -e "${YELLOW}🔧 Setting minimum bid increment to $2 stroops...${NC}"
        invoke_contract set_min_bid_increment --new_increment $2
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Minimum bid increment updated!${NC}"
        fi
        ;;
    
    "set-min-starting")
        if [ -z "$2" ]; then
            echo -e "${RED}❌ Please provide starting bid amount in stroops${NC}"
            echo "Example: ./manage.sh set-min-starting 10000000"
            exit 1
        fi
        
        echo -e "${YELLOW}🔧 Setting minimum starting bid to $2 stroops...${NC}"
        invoke_contract set_min_starting_bid --new_starting_bid $2
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Minimum starting bid updated!${NC}"
        fi
        ;;
    
    "help"|"--help"|"-h"|"")
        show_help
        ;;
    
    *)
        echo -e "${RED}❌ Unknown command: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac