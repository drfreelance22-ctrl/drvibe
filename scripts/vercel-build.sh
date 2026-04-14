#!/bin/bash
set -e

echo "Starting Vercel build..."

# Ensure react-native-css-interop cache exists
echo "Ensuring css-interop cache..."
mkdir -p node_modules/react-native-css-interop/.cache
touch node_modules/react-native-css-interop/.cache/web.css
echo "Cache file created at node_modules/react-native-css-interop/.cache/web.css"

# Build web app
echo "Building Expo web app..."
EXPO_USE_METRO_WORKSPACE_ROOT=1 npx expo export --platform web --output-dir=dist-web 2>&1 | tail -20

# Build server
echo "Building backend server..."
pnpm build:server

echo "Build complete!"
ls -lah dist-web/ | head -20
