const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");
const fs = require("fs");

// CRITICAL: Ensure the react-native-css-interop cache file exists BEFORE Metro starts.
// Metro tries to compute SHA-1 of this file during bundling, and fails if it doesn't exist.
// This must happen at module load time (before any Metro operations).
const cacheDir = path.join(__dirname, "node_modules", "react-native-css-interop", ".cache");
const cacheFile = path.join(cacheDir, "web.css");
try {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  if (!fs.existsSync(cacheFile)) {
    fs.writeFileSync(cacheFile, "/* generated cache placeholder */\n");
  }
} catch (e) {
  console.warn("Warning: Could not create css-interop cache file:", e.message);
}

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
