#!/bin/bash
set -e

echo "Starting Vercel build..."

# Build web app
echo "Building Expo web app..."
EXPO_USE_METRO_WORKSPACE_ROOT=1 npx expo export --platform web --output-dir=dist-web 2>&1 | tail -20

# Build server
echo "Building backend server..."
pnpm build:server

echo "Build complete!"
ls -lah dist-web/ | head -20
