#!/bin/bash

echo "🚀 Setting up Firebase Cloud Functions for Email Notifications"
echo "============================================================"
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "⚠️  Firebase CLI not found. Installing..."
    npm install -g firebase-tools
else
    echo "✅ Firebase CLI found"
fi

# Install functions dependencies
echo ""
echo "📦 Installing Cloud Functions dependencies..."
cd functions
npm install
cd ..
echo "✅ Dependencies installed"

# Create .env file for functions if it doesn't exist
if [ ! -f "functions/.env" ]; then
    echo ""
    echo "📝 Creating functions/.env file..."
    cp functions/.env.example functions/.env
    echo "⚠️  Please edit functions/.env and add your WEBHOOK_URL"
    echo "   Your webhook URL from .env.example:"
    grep WEBHOOK_URL .env.example | head -1
else
    echo "✅ functions/.env already exists"
fi

echo ""
echo "============================================================"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit functions/.env and add your WEBHOOK_URL"
echo "2. Set up GitHub secrets (see DEPLOYMENT_SETUP.md)"
echo "3. Configure Firebase Functions secret:"
echo "   firebase functions:secrets:set WEBHOOK_URL"
echo ""
echo "To test locally:"
echo "   cd functions && npm run serve"
echo ""
echo "To deploy:"
echo "   firebase deploy --only hosting,functions"
echo ""
echo "For detailed instructions, see DEPLOYMENT_SETUP.md"
echo "============================================================"
