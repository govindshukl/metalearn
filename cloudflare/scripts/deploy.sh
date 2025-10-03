#!/bin/bash

# Cloudflare Pages Deployment Script
# Usage: ./deploy.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}
PROJECT_NAME="metalearn"

echo "🚀 Deploying Metalearn to Cloudflare Pages (${ENVIRONMENT})..."

# Navigate to project root
cd "$(dirname "$0")/../.."

# Build the application
echo "📦 Building application..."
yarn build:app

# Copy headers and redirects to build directory
echo "📋 Copying configuration files..."
cp cloudflare/_headers excalidraw-app/build/
cp cloudflare/_redirects excalidraw-app/build/

# Deploy to Cloudflare Pages
echo "☁️  Deploying to Cloudflare Pages..."

if [ "$ENVIRONMENT" = "production" ]; then
  wrangler pages deploy excalidraw-app/build \
    --project-name="${PROJECT_NAME}" \
    --branch=main \
    --commit-dirty=true
else
  wrangler pages deploy excalidraw-app/build \
    --project-name="${PROJECT_NAME}-${ENVIRONMENT}" \
    --branch="${ENVIRONMENT}" \
    --commit-dirty=true
fi

echo "✅ Deployment complete!"
echo ""
echo "📍 Your application is live at:"
if [ "$ENVIRONMENT" = "production" ]; then
  echo "   https://learn.metaglass.ai"
  echo "   https://${PROJECT_NAME}.pages.dev"
else
  echo "   https://${ENVIRONMENT}.${PROJECT_NAME}.pages.dev"
fi
