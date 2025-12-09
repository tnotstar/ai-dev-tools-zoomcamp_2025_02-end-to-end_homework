#!/bin/bash

# Cloud Run Deployment Script
# Usage: ./deploy.sh
# Prerequisites: gcloud CLI installed and authenticated

set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
REPO_NAME="coding-interview-repo"
SERVICE_NAME="interview-platform"

echo "🚀 Starting Deployment to Google Cloud Run..."
echo "Project ID: $PROJECT_ID"
echo "Region: $REGION"

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Error: No Google Cloud Project selected. Run 'gcloud config set project <PROJECT_ID>' first."
  exit 1
fi

# 1. Enable Required Services
echo "--------------------------------------------------"
echo "📦 Enabling required GCP services..."
gcloud services enable artifactregistry.googleapis.com \
    cloudbuild.googleapis.com \
    run.googleapis.com

# 2. Create Artifact Registry Repository
echo "--------------------------------------------------"
echo "🏭 Creating Artifact Registry repository..."
if ! gcloud artifacts repositories describe $REPO_NAME --location=$REGION &>/dev/null; then
    gcloud artifacts repositories create $REPO_NAME \
        --repository-format=docker \
        --location=$REGION \
        --description="Docker repository for Coding Interview Platform"
    echo "✅ Repository created."
else
    echo "✅ Repository $REPO_NAME already exists."
fi

# 3. Build and Deploy Unified Service
echo "--------------------------------------------------"
echo "🔧 Building and Deploying Unified Platform..."

# Build Unified Image (from root Dockerfile)
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME" .

# Deploy Cloud Run Service
# --session-affinity: sticky sessions for Socket.io
# --allow-unauthenticated: makes it public
gcloud run deploy $SERVICE_NAME \
    --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$SERVICE_NAME" \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --session-affinity \
    --port 3000

# Get Service URL
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format 'value(status.url)')

echo "--------------------------------------------------"
echo "🎉 Deployment Complete!"
echo "--------------------------------------------------"
echo "App URL: $SERVICE_URL"
echo "--------------------------------------------------"
echo "Important: Session Affinity is enabled to ensure sticky sessions for Socket.io."
echo "To clean up, run:"
echo "gcloud run services delete $SERVICE_NAME --region $REGION"
