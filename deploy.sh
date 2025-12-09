#!/bin/bash

# Cloud Run Deployment Script
# Usage: ./deploy.sh
# Prerequisites: gcloud CLI installed and authenticated

set -e

# Configuration
PROJECT_ID=$(gcloud config get-value project)
REGION="us-central1"
REPO_NAME="coding-interview-repo"
BACKEND_SERVICE="interview-backend"
FRONTEND_SERVICE="interview-frontend"

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

# 3. Build and Deploy Backend
echo "--------------------------------------------------"
echo "🔧 Building and Deploying Backend..."

# Build Backend Image
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$BACKEND_SERVICE" . -f backend/Dockerfile

# Deploy Backend Service
# --session-affinity: sticky sessions for Socket.io
# --allow-unauthenticated: makes it public
gcloud run deploy $BACKEND_SERVICE \
    --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$BACKEND_SERVICE" \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --session-affinity \
    --port 3000

# Get Backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region $REGION --format 'value(status.url)')
echo "✅ Backend deployed at: $BACKEND_URL"

# 4. Build and Deploy Frontend
echo "--------------------------------------------------"
echo "🎨 Building and Deploying Frontend..."

# Build Frontend Image
gcloud builds submit --tag "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$FRONTEND_SERVICE" frontend

# Deploy Frontend Service
# Pass VITE_API_URL as environment variable
gcloud run deploy $FRONTEND_SERVICE \
    --image "$REGION-docker.pkg.dev/$PROJECT_ID/$REPO_NAME/$FRONTEND_SERVICE" \
    --region $REGION \
    --platform managed \
    --allow-unauthenticated \
    --set-env-vars VITE_API_URL=$BACKEND_URL

# Get Frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region $REGION --format 'value(status.url)')

echo "--------------------------------------------------"
echo "🎉 Deployment Complete!"
echo "--------------------------------------------------"
echo "Backend URL: $BACKEND_URL"
echo "Frontend URL: $FRONTEND_URL"
echo "--------------------------------------------------"
echo "Important: Session Affinity is enabled on the backend to ensure sticky sessions for Socket.io."
echo "To clean up services later, run:"
echo "gcloud run services delete $BACKEND_SERVICE --region $REGION"
echo "gcloud run services delete $FRONTEND_SERVICE --region $REGION"
