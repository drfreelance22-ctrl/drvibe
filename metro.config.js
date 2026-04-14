const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const fs = require("fs");
const path = require("path");

const config = getDefaultConfig(__dirname);

// Ensure cache directory exists before Metro starts
const cacheDir = path.join(__dirname, "node_modules/react-native-css-interop/.cache");
const cacheFile = path.join(cacheDir, "web.css");

try {
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
  }
  if (!fs.existsSync(cacheFile)) {
    fs.writeFileSync(cacheFile, "/* NativeWind CSS Cache */\n", "utf8");
  }
} catch (error) {
  console.warn("Warning: Could not create cache file:", error.message);
}

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Force write CSS to file system instead of virtual modules
  // This fixes iOS styling issues in development mode
  forceWriteFileSystem: true,
});
