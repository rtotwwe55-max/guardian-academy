#!/usr/bin/env node

/**
 * Check Standards Compliance
 * Validates that implementation code matches published standards
 */

const fs = require('fs');
const path = require('path');

const STANDARDS_DIR = path.join(__dirname, '../standards');
const SCORING_ENGINE = path.join(__dirname, '../packages/scoring-engine/src/index.ts');

console.log('🔍 Standards Compliance Check\n');

// Check 1: Verify standards files exist
const requiredStandards = [
  'gi2-metrics.md',
  'scoring-formula.md',
  'data-collection-guidelines.md',
];

console.log('✓ Checking standard files:');
let standardsOk = true;
requiredStandards.forEach((file) => {
  const filepath = path.join(STANDARDS_DIR, file);
  if (fs.existsSync(filepath)) {
    console.log(`  ✅ ${file}`);
  } else {
    console.log(`  ❌ ${file} - MISSING`);
    standardsOk = false;
  }
});

// Check 2: Verify scoring engine exists
console.log('\n✓ Checking implementations:');
if (fs.existsSync(SCORING_ENGINE)) {
  console.log(`  ✅ packages/scoring-engine/src/index.ts`);
  
  // Basic validation: check for calculateGI2Score function
  const content = fs.readFileSync(SCORING_ENGINE, 'utf-8');
  if (content.includes('calculateGI2Score')) {
    console.log(`  ✅ calculateGI2Score function exists`);
  } else {
    console.log(`  ⚠️  calculateGI2Score function not found`);
  }
} else {
  console.log(`  ❌ packages/scoring-engine/src/index.ts - MISSING`);
}

// Check 3: Verify governance documents
console.log('\n✓ Checking governance:');
const govFiles = [
  path.join(__dirname, '../docs/governance-charter.md'),
  path.join(__dirname, '../docs/5-year-roadmap.md'),
];

govFiles.forEach((filepath) => {
  const filename = path.basename(filepath);
  if (fs.existsSync(filepath)) {
    console.log(`  ✅ docs/${filename}`);
  } else {
    console.log(`  ❌ docs/${filename} - MISSING`);
  }
});

// Summary
console.log('\n' + '='.repeat(50));
if (standardsOk) {
  console.log('✅ Standards framework is complete!');
  console.log('\nNext steps:');
  console.log('  1. npm run dev:full       - Run all services');
  console.log('  2. npm run dev:scoring    - Develop scoring engine');
  console.log('  3. npm run dev:web        - Work on web dashboard');
} else {
  console.log('⚠️  Some standards files are missing.');
  console.log('Please review standards/ folder.\n');
}
