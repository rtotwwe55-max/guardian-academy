#!/usr/bin/env node

/**
 * Watch Standards Changes
 * Monitors the standards/ directory for changes and logs them
 * Runs as part of `npm run dev:full`
 */

const fs = require('fs');
const path = require('path');

const STANDARDS_DIR = path.join(__dirname, '../standards');

console.log('📋 Standards Monitor: Watching for changes...\n');

let lastChangeTime = Date.now();

fs.watch(STANDARDS_DIR, { recursive: true }, (eventType, filename) => {
  // Debounce rapid changes
  const now = Date.now();
  if (now - lastChangeTime < 1000) return;
  lastChangeTime = now;

  const filePath = path.join(STANDARDS_DIR, filename);
  const fileExt = path.extname(filename);

  if (fileExt === '.md') {
    console.log(`\n📝 Standards Updated: ${filename}`);
    console.log(`   Event: ${eventType}`);
    console.log(`   Path: ${filePath}`);
    console.log(`   Time: ${new Date().toLocaleTimeString()}`);
    console.log('   ⚠️  Remember: Update implementations to match new standards!\n');
  }
});

console.log(`Watching: ${STANDARDS_DIR}`);
console.log('Press Ctrl+C to stop.\n');
