#!/bin/bash

# Cloudflare Pages Rollback Script
# Usage: ./rollback.sh [staging|production]

set -e

ENVIRONMENT=${1:-staging}
PROJECT_NAME="excalidraw"

echo "⏪ Rolling back Cloudflare Pages deployment (${ENVIRONMENT})..."

if [ "$ENVIRONMENT" = "production" ]; then
  DEPLOYMENT_NAME="${PROJECT_NAME}"
else
  DEPLOYMENT_NAME="${PROJECT_NAME}-${ENVIRONMENT}"
fi

echo "📋 Fetching deployment history..."
wrangler pages deployment list --project-name="${DEPLOYMENT_NAME}"

echo ""
echo "To rollback to a specific deployment, use:"
echo "  wrangler pages deployment rollback <DEPLOYMENT_ID> --project-name=${DEPLOYMENT_NAME}"
