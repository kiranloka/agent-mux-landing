#!/usr/bin/env bash
# agentmux installer
# Usage: curl -fsSL https://agentmux.reviate0.com/install.sh | bash

set -e

BINARY="agentmux"
INSTALL_DIR="/usr/local/bin"
REPO="reviate0/agentmux"
VERSION="v0.1.0"

echo ""
echo "  agentmux installer"
echo "  ─────────────────────────────────────"

# Detect OS and arch
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
case $ARCH in
  x86_64) ARCH="amd64" ;;
  aarch64|arm64) ARCH="arm64" ;;
  *) echo "Unsupported architecture: $ARCH"; exit 1 ;;
esac

# Check if we can write to install dir
if [ ! -w "$INSTALL_DIR" ]; then
  SUDO="sudo"
  echo "  Will use sudo to install to $INSTALL_DIR"
fi

# Build from source (for now, until binaries are published)
if command -v go &>/dev/null; then
  echo "  Building from source with Go..."
  TMP=$(mktemp -d)
  cd "$TMP"

  # Clone and build
  if command -v git &>/dev/null; then
    git clone https://github.com/$REPO.git agentmux 2>/dev/null || {
      echo "  ✗ Could not clone repo. Build manually:"
      echo "    go build -buildvcs=false -o agentmux && sudo mv agentmux $INSTALL_DIR/"
      exit 1
    }
    cd agentmux
    go build -buildvcs=false -ldflags="-s -w" -o agentmux .
    $SUDO mv agentmux "$INSTALL_DIR/agentmux"
    $SUDO chmod +x "$INSTALL_DIR/agentmux"
    rm -rf "$TMP"
  fi
else
  echo "  Go not found. Please install Go (https://go.dev) and run:"
  echo "    go build -buildvcs=false -o agentmux && sudo mv agentmux $INSTALL_DIR/"
  exit 1
fi

echo ""
echo "  ✓ agentmux installed to $INSTALL_DIR/agentmux"
echo ""
echo "  Quick start:"
echo "    agentmux account add claude myaccount"
echo "    agentmux account add codex work"
echo "    agentmux workspace create dev myaccount work"
echo "    agentmux boot dev"
echo ""
