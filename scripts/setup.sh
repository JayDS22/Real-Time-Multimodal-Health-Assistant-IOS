#!/usr/bin/env bash
# One-command setup for the Health Assistant project.
# Installs the demo platform dependencies and prints next steps for the iOS app.

set -euo pipefail

# Color helpers
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  Real-Time Multimodal Health Assistant — setup${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# Resolve repo root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- Demo platform ---
echo -e "\n${YELLOW}[1/2]${NC} Setting up the demo platform..."
if ! command -v node >/dev/null 2>&1; then
  echo -e "${RED}✗ Node.js is not installed.${NC} Install Node 18+ from https://nodejs.org and re-run."
  exit 1
fi

NODE_MAJOR=$(node -v | sed 's/v\([0-9]*\).*/\1/')
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo -e "${RED}✗ Node $NODE_MAJOR detected.${NC} Please upgrade to Node 18 or later."
  exit 1
fi

echo -e "  Node $(node -v) ✓"

cd "$REPO_ROOT/Demo"
echo -e "  Installing demo dependencies (this may take a minute)..."
npm install --no-audit --no-fund --silent
echo -e "${GREEN}  ✓ Demo platform ready.${NC}"

# --- iOS app ---
echo -e "\n${YELLOW}[2/2]${NC} Checking the iOS app..."
if [ "$(uname)" != "Darwin" ]; then
  echo -e "  Not running on macOS — skipping Xcode checks."
  echo -e "  ${YELLOW}!${NC} The iOS app can only be built on macOS with Xcode 15+."
else
  if ! command -v xcodebuild >/dev/null 2>&1; then
    echo -e "  ${YELLOW}!${NC} xcodebuild not found. Install Xcode from the Mac App Store."
  else
    XCODE_VERSION=$(xcodebuild -version | head -n 1)
    echo -e "  $XCODE_VERSION ✓"
  fi
fi

# --- Done ---
echo -e "\n${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}  Setup complete.${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo
echo -e "Next steps:"
echo -e "  ${BLUE}•${NC} Start the demo:   ${YELLOW}cd Demo && npm run dev${NC}"
echo -e "  ${BLUE}•${NC} Open in browser:  ${YELLOW}http://localhost:3000${NC}"
echo -e "  ${BLUE}•${NC} Build iOS app:    ${YELLOW}cd iOS && open HealthAssistant.xcodeproj${NC}"
echo
