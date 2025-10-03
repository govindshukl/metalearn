#!/bin/bash

# Cloudflare Pages Preview Deployment Script
# Usage: ./preview.sh [--pr PR_NUMBER]

set -e

PROJECT_NAME="excalidraw"
PR_NUMBER=""

while [[ "$#" -gt 0 ]]; do
  case $1 in
    --pr) PR_NUMBER="$2"; shift ;;
    *) echo "Unknown parameter: $1"; exit 1 ;;
  esac
  shift
done

echo "🔍 Creating preview deployment..."

# Navigate to project root
cd "$(dirname "$0")/../.."

# Build the application
echo "📦 Building application..."
yarn build:app

# Copy headers and redirects to build directory
echo "📋 Copying configuration files..."
cp cloudflare/_headers excalidraw-app/build/
cp cloudflare/_redirects excalidraw-app/build/

# Deploy preview
echo "☁️  Deploying preview to Cloudflare Pages..."

if [ -n "$PR_NUMBER" ]; then
  BRANCH_NAME="pr-${PR_NUMBER}"
else
  BRANCH_NAME="preview-$(date +%s)"
fi

wrangler pages deploy excalidraw-app/build \
  --project-name="${PROJECT_NAME}" \
  --branch="${BRANCH_NAME}" \
  --commit-dirty=true

echo "✅ Preview deployment complete!"
