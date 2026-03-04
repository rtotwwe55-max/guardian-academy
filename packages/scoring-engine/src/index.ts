/**
 * Guardian Academy GI² Scoring Engine
 * Core logic for calculating Guardian Integrity Score (GI²)
 * Based on standards/scoring-formula.md v0.1
 */

/**
 * GI² Input metrics (each on 0–100 scale)
 */
export interface GI2Input {
  /** Transparency, consistency, policy adherence, ethical track record */
  integrity: number;
  /** Financial reserves, personnel redundancy, operational resilience, legal stability */
  stability: number;
  /** User confidence, third-party validation, track record */
  trust: number;
  /** Long-term viability, succession planning, resource sustainability */
  sustainability: number;
  /** Concentration of power, accountability mechanisms (inverted in calculation) */
  powerRisk: number;
}

/**
 * GI² Score result with component breakdown
 */
export interface GI2Result {
  /** Final composite GI² score (0–100) */
  score: number;
  /** Individual component scores */
  components: GI2Input;
  /** ISO 8601 timestamp of calculation */
  timestamp: string;
  /** Validation status */
  valid: boolean;
  /** Validation errors (if any) */
  errors: string[];
}

/**
 * Validate GI² input metrics
 * @param input - metrics to validate
 * @returns validation errors (empty array if valid)
 */
export function validateGI2Input(input: Partial<GI2Input>): string[] {
  const errors: string[] = [];

  if (input === null || typeof input !== 'object') {
    errors.push('Input must be a valid object');
    return errors;
  }

  const requiredFields = ['integrity', 'stability', 'trust', 'sustainability', 'powerRisk'];
  
  for (const field of requiredFields) {
    const value = (input as any)[field];
    
    if (value === undefined) {
      errors.push(`Missing required field: ${field}`);
      continue;
    }

    if (typeof value !== 'number') {
      errors.push(`Field ${field} must be a number, got ${typeof value}`);
      continue;
    }

    if (isNaN(value)) {
      errors.push(`Field ${field} cannot be NaN`);
      continue;
    }

    if (value < 0 || value > 100) {
      errors.push(`Field ${field} must be between 0 and 100, got ${value}`);
    }
  }

  return errors;
}

/**
 * Calculate the GI² score based on input metrics
 * 
 * Formula (from standards/scoring-formula.md):
 * GI² = (I × 0.20) + (S × 0.20) + (T × 0.20) + (U × 0.20) + ((100 − P) × 0.20)
 * 
 * Where:
 * - I: Integrity (20% weight)
 * - S: Stability (20% weight)
 * - T: Trust (20% weight)
 * - U: Sustainability (20% weight)
 * - P: PowerRisk (inverted, 20% weight)
 * 
 * @param input - GI² input metrics (0-100 scale)
 * @returns GI² result with computed score and validation
 * @throws Error if input is invalid
 */
export function calculateGI2Score(input: GI2Input): GI2Result {
  const errors = validateGI2Input(input);
  
  const result: GI2Result = {
    score: 0,
    components: input,
    timestamp: new Date().toISOString(),
    valid: errors.length === 0,
    errors,
  };

  // If validation failed, return early
  if (!result.valid) {
    return result;
  }

  // Apply the GI² formula
  const score =
    input.integrity * 0.2 +
    input.stability * 0.2 +
    input.trust * 0.2 +
    input.sustainability * 0.2 +
    (100 - input.powerRisk) * 0.2;

  // Round to 2 decimal places
  result.score = Math.round(score * 100) / 100;

  return result;
}

/**
 * Get human-readable GI² score interpretation
 * @param score - the GI² score (0–100)
 * @returns text interpretation of score
 */
export function interpretGI2Score(score: number): string {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  if (score >= 20) return 'Poor';
  return 'Critical';
}

/**
 * Batch calculate GI² scores for multiple inputs
 * @param inputs - array of GI² inputs
 * @returns array of GI² results
 */
export function calculateGI2ScoreBatch(inputs: GI2Input[]): GI2Result[] {
  return inputs.map(calculateGI2Score);
}

/**
 * Calculate average GI² score across results
 * @param results - array of GI² results
 * @returns average score (0–100)
 */
export function averageGI2Scores(results: GI2Result[]): number {
  if (results.length === 0) return 0;

  const validScores = results
    .filter(r => r.valid)
    .map(r => r.score);

  if (validScores.length === 0) return 0;

  const sum = validScores.reduce((a, b) => a + b, 0);
  return Math.round((sum / validScores.length) * 100) / 100;
}

export default {
  calculateGI2Score,
  validateGI2Input,
  interpretGI2Score,
  calculateGI2ScoreBatch,
  averageGI2Scores,
};
