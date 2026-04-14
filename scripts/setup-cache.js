#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ensure react-native-css-interop cache directory and file exist
const cacheDir = path.join(__dirname, '../node_modules/react-native-css-interop/.cache');
const cacheFile = path.join(cacheDir, 'web.css');

try {
  // Create directory if it doesn't exist
  if (!fs.existsSync(cacheDir)) {
    fs.mkdirSync(cacheDir, { recursive: true });
    console.log(`✓ Created cache directory: ${cacheDir}`);
  }

  // Create cache file if it doesn't exist
  if (!fs.existsSync(cacheFile)) {
    fs.writeFileSync(cacheFile, '/* NativeWind CSS Cache */\n', 'utf8');
    console.log(`✓ Created cache file: ${cacheFile}`);
  } else {
    console.log(`✓ Cache file already exists: ${cacheFile}`);
  }

  // Verify file exists and is readable
  const stats = fs.statSync(cacheFile);
  console.log(`✓ Cache file size: ${stats.size} bytes`);
  console.log('✓ Cache setup complete');
} catch (error) {
  console.error('✗ Error setting up cache:', error.message);
  process.exit(1);
}
