const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Only use NativeWind for native platforms (iOS, Android)
// For web, we use plain CSS to avoid Metro cache issues with react-native-css-interop
const isWeb = process.env.EXPO_OS === "web" || process.env.PLATFORM === "web";

if (isWeb) {
  // For web builds, use plain Metro config without NativeWind
  module.exports = config;
} else {
  // For native builds, use NativeWind with Tailwind CSS
  module.exports = withNativeWind(config, {
    input: "./global.css",
    forceWriteFileSystem: true,
  });
}
