#!/usr/bin/env node
/**
 * Quick demo/test of the GI² scoring engine
 * Shows the algorithm working with the example from standards/scoring-formula.md
 */

// Import from the built output
import {
  calculateGI2Score,
  interpretGI2Score,
  calculateGI2ScoreBatch,
  averageGI2Scores,
  GI2Input,
} from './src/index.js';

console.log('═══════════════════════════════════════════════════════════');
console.log('  GI² Scoring Engine - Quick Test');
console.log('═══════════════════════════════════════════════════════════\n');

// Example 1: From standards/scoring-formula.md
console.log('Example 1: Standard Formula Example');
console.log('─────────────────────────────────────');

const example1: GI2Input = {
  integrity: 85,
  stability: 72,
  trust: 88,
  sustainability: 79,
  powerRisk: 45,
};

const result1 = calculateGI2Score(example1);

console.log(`Input:
  - Integrity:      ${example1.integrity}
  - Stability:      ${example1.stability}
  - Trust:          ${example1.trust}
  - Sustainability: ${example1.sustainability}
  - Power Risk:     ${example1.powerRisk}`);

console.log(`\nCalculation:
  GI² = (${example1.integrity} × 0.20) + (${example1.stability} × 0.20) + (${example1.trust} × 0.20) + (${example1.sustainability} × 0.20) + ((100 − ${example1.powerRisk}) × 0.20)
  GI² = ${example1.integrity * 0.2} + ${example1.stability * 0.2} + ${example1.trust * 0.2} + ${example1.sustainability * 0.2} + ${(100 - example1.powerRisk) * 0.2}
  GI² = ${result1.score}`);

console.log(`\nResult:
  Score: ${result1.score}
  Status: ${interpretGI2Score(result1.score)}
  Valid: ${result1.valid}`);

// Example 2: Perfect score (all metrics at max)
console.log('\n\nExample 2: Perfect Scenario');
console.log('─────────────────────────────────────');

const example2: GI2Input = {
  integrity: 100,
  stability: 100,
  trust: 100,
  sustainability: 100,
  powerRisk: 0,
};

const result2 = calculateGI2Score(example2);

console.log(`Input: All metrics at optimal levels`);
console.log(`Result:
  Score: ${result2.score}
  Status: ${interpretGI2Score(result2.score)}
  Valid: ${result2.valid}`);

// Example 3: Critical scenario (all metrics low)
console.log('\n\nExample 3: Critical Scenario');
console.log('─────────────────────────────────────');

const example3: GI2Input = {
  integrity: 10,
  stability: 20,
  trust: 15,
  sustainability: 25,
  powerRisk: 90,
};

const result3 = calculateGI2Score(example3);

console.log(`Input: All metrics critically low`);
console.log(`Result:
  Score: ${result3.score}
  Status: ${interpretGI2Score(result3.score)}
  Valid: ${result3.valid}`);

// Batch example
console.log('\n\nExample 4: Batch Processing');
console.log('─────────────────────────────────────');

const batchInputs: GI2Input[] = [
  { integrity: 90, stability: 85, trust: 88, sustainability: 81, powerRisk: 20 },
  { integrity: 60, stability: 65, trust: 70, sustainability: 62, powerRisk: 50 },
  { integrity: 75, stability: 80, trust: 82, sustainability: 78, powerRisk: 35 },
];

const batchResults = calculateGI2ScoreBatch(batchInputs);
const avgScore = averageGI2Scores(batchResults);

console.log(`Processed ${batchInputs.length} organizations:\n`);
batchResults.forEach((res, i) => {
  console.log(`  Org ${i + 1}: ${res.score} (${interpretGI2Score(res.score)})`);
});

console.log(`\nAverage GI² Score: ${avgScore} (${interpretGI2Score(avgScore)})`);

// Validation example
console.log('\n\nExample 5: Input Validation');
console.log('─────────────────────────────────────');

const invalidInput = {
  integrity: 150, // Out of range!
  stability: 72,
  trust: 88,
  sustainability: 79,
  powerRisk: 45,
};

const result5 = calculateGI2Score(invalidInput as any);

console.log(`Input: Invalid (integrity = 150, outside 0-100 range)`);
console.log(`Result:
  Valid: ${result5.valid}
  Errors: ${result5.errors.join(', ')}`);

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  ✅ GI² Scoring Engine Demo Complete');
console.log('═══════════════════════════════════════════════════════════\n');
