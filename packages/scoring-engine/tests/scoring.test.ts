/**
 * Unit tests for GI² Scoring Engine
 */

import {
  calculateGI2Score,
  validateGI2Input,
  interpretGI2Score,
  calculateGI2ScoreBatch,
  averageGI2Scores,
  GI2Input,
  GI2Result,
} from '../src/index';

describe('GI² Scoring Engine', () => {
  describe('validateGI2Input', () => {
    it('should accept valid input with all metrics between 0-100', () => {
      const input: GI2Input = {
        integrity: 85,
        stability: 72,
        trust: 88,
        sustainability: 79,
        powerRisk: 45,
      };

      const errors = validateGI2Input(input);
      expect(errors).toEqual([]);
    });

    it('should accept perfect input (all 100s)', () => {
      const input: GI2Input = {
        integrity: 100,
        stability: 100,
        trust: 100,
        sustainability: 100,
        powerRisk: 100,
      };

      const errors = validateGI2Input(input);
      expect(errors).toEqual([]);
    });

    it('should accept zero values (all 0s)', () => {
      const input: GI2Input = {
        integrity: 0,
        stability: 0,
        trust: 0,
        sustainability: 0,
        powerRisk: 0,
      };

      const errors = validateGI2Input(input);
      expect(errors).toEqual([]);
    });

    it('should reject missing required fields', () => {
      const input = { integrity: 85, stability: 72 };
      const errors = validateGI2Input(input);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some(e => e.includes('Missing required field'))).toBe(true);
    });

    it('should reject non-numeric values', () => {
      const input = { integrity: 'not a number', stability: 72, trust: 88, sustainability: 79, powerRisk: 45 };
      const errors = validateGI2Input(input);
      expect(errors.some(e => e.includes('must be a number'))).toBe(true);
    });

    it('should reject values below 0', () => {
      const input: GI2Input = {
        integrity: -5,
        stability: 72,
        trust: 88,
        sustainability: 79,
        powerRisk: 45,
      };

      const errors = validateGI2Input(input);
      expect(errors.some(e => e.includes('must be between 0 and 100'))).toBe(true);
    });

    it('should reject values above 100', () => {
      const input: GI2Input = {
        integrity: 105,
        stability: 72,
        trust: 88,
        sustainability: 79,
        powerRisk: 45,
      };

      const errors = validateGI2Input(input);
      expect(errors.some(e => e.includes('must be between 0 and 100'))).toBe(true);
    });

    it('should reject NaN values', () => {
      const input = { integrity: NaN, stability: 72, trust: 88, sustainability: 79, powerRisk: 45 };
      const errors = validateGI2Input(input);
      expect(errors.some(e => e.includes('cannot be NaN'))).toBe(true);
    });
  });

  describe('calculateGI2Score', () => {
    it('should calculate the correct score from the formula', () => {
      // Example from standards/scoring-formula.md:
      // I=85, S=72, T=88, U=79, P=45
      // GI² = (85×0.20) + (72×0.20) + (88×0.20) + (79×0.20) + ((100−45)×0.20)
      //     = 17 + 14.4 + 17.6 + 15.8 + 11 = 75.8
      const input: GI2Input = {
        integrity: 85,
        stability: 72,
        trust: 88,
        sustainability: 79,
        powerRisk: 45,
      };

      const result = calculateGI2Score(input);

      expect(result.score).toBe(75.8);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
      expect(result.components).toEqual(input);
    });

    it('should return score 100 when all metrics are 100', () => {
      const input: GI2Input = {
        integrity: 100,
        stability: 100,
        trust: 100,
        sustainability: 100,
        powerRisk: 0, // inverted, so powerRisk=0 gives max contribution
      };

      const result = calculateGI2Score(input);
      expect(result.score).toBe(100);
      expect(result.valid).toBe(true);
    });

    it('should return score 0 when all metrics are 0', () => {
      const input: GI2Input = {
        integrity: 0,
        stability: 0,
        trust: 0,
        sustainability: 0,
        powerRisk: 100, // inverted, so powerRisk=100 gives min contribution
      };

      const result = calculateGI2Score(input);
      expect(result.score).toBe(0);
      expect(result.valid).toBe(true);
    });

    it('should handle powerRisk inversion correctly', () => {
      const input: GI2Input = {
        integrity: 100,
        stability: 100,
        trust: 100,
        sustainability: 100,
        powerRisk: 50, // Should contribute (100-50)*0.2 = 10
      };

      const result = calculateGI2Score(input);
      // (100*0.2) + (100*0.2) + (100*0.2) + (100*0.2) + ((100-50)*0.2)
      // = 20 + 20 + 20 + 20 + 10 = 90
      expect(result.score).toBe(90);
    });

    it('should mark result as invalid if input is invalid', () => {
      const input = { integrity: 105, stability: 72, trust: 88, sustainability: 79, powerRisk: 45 };
      const result = calculateGI2Score(input as any);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should include timestamp in result', () => {
      const input: GI2Input = {
        integrity: 85,
        stability: 72,
        trust: 88,
        sustainability: 79,
        powerRisk: 45,
      };

      const result = calculateGI2Score(input);
      expect(result.timestamp).toBeDefined();
      // Should be ISO 8601 format
      expect(/^\d{4}-\d{2}-\d{2}T/.test(result.timestamp)).toBe(true);
    });

    it('should round scores to 2 decimal places', () => {
      const input: GI2Input = {
        integrity: 33,
        stability: 33,
        trust: 33,
        sustainability: 33,
        powerRisk: 33,
      };

      const result = calculateGI2Score(input);
      // Should not have more than 2 decimal places
      const decimalPlaces = (result.score.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });

  describe('interpretGI2Score', () => {
    it('should interpret score 80+ as Excellent', () => {
      expect(interpretGI2Score(100)).toBe('Excellent');
      expect(interpretGI2Score(80)).toBe('Excellent');
      expect(interpretGI2Score(85)).toBe('Excellent');
    });

    it('should interpret score 60-79 as Good', () => {
      expect(interpretGI2Score(79)).toBe('Good');
      expect(interpretGI2Score(60)).toBe('Good');
      expect(interpretGI2Score(70)).toBe('Good');
    });

    it('should interpret score 40-59 as Fair', () => {
      expect(interpretGI2Score(59)).toBe('Fair');
      expect(interpretGI2Score(40)).toBe('Fair');
      expect(interpretGI2Score(50)).toBe('Fair');
    });

    it('should interpret score 20-39 as Poor', () => {
      expect(interpretGI2Score(39)).toBe('Poor');
      expect(interpretGI2Score(20)).toBe('Poor');
      expect(interpretGI2Score(30)).toBe('Poor');
    });

    it('should interpret score <20 as Critical', () => {
      expect(interpretGI2Score(19)).toBe('Critical');
      expect(interpretGI2Score(0)).toBe('Critical');
      expect(interpretGI2Score(10)).toBe('Critical');
    });
  });

  describe('calculateGI2ScoreBatch', () => {
    it('should calculate scores for multiple inputs', () => {
      const inputs: GI2Input[] = [
        { integrity: 85, stability: 72, trust: 88, sustainability: 79, powerRisk: 45 },
        { integrity: 100, stability: 100, trust: 100, sustainability: 100, powerRisk: 0 },
      ];

      const results = calculateGI2ScoreBatch(inputs);

      expect(results).toHaveLength(2);
      expect(results[0].score).toBe(75.8);
      expect(results[1].score).toBe(100);
    });

    it('should handle empty input array', () => {
      const results = calculateGI2ScoreBatch([]);
      expect(results).toEqual([]);
    });

    it('should preserve order of results', () => {
      const inputs: GI2Input[] = [
        { integrity: 90, stability: 90, trust: 90, sustainability: 90, powerRisk: 10 },
        { integrity: 10, stability: 10, trust: 10, sustainability: 10, powerRisk: 90 },
      ];

      const results = calculateGI2ScoreBatch(inputs);

      expect(results[0].score).toBeGreaterThan(results[1].score);
    });
  });

  describe('averageGI2Scores', () => {
    it('should calculate average of valid scores', () => {
      const results: GI2Result[] = [
        { score: 80, components: {} as any, timestamp: '', valid: true, errors: [] },
        { score: 90, components: {} as any, timestamp: '', valid: true, errors: [] },
        { score: 100, components: {} as any, timestamp: '', valid: true, errors: [] },
      ];

      const average = averageGI2Scores(results);
      expect(average).toBe(90);
    });

    it('should ignore invalid results', () => {
      const results: GI2Result[] = [
        { score: 80, components: {} as any, timestamp: '', valid: true, errors: [] },
        { score: 0, components: {} as any, timestamp: '', valid: false, errors: ['invalid'] },
        { score: 100, components: {} as any, timestamp: '', valid: true, errors: [] },
      ];

      const average = averageGI2Scores(results);
      expect(average).toBe(90); // (80 + 100) / 2
    });

    it('should return 0 for empty array', () => {
      const average = averageGI2Scores([]);
      expect(average).toBe(0);
    });

    it('should return 0 if all results are invalid', () => {
      const results: GI2Result[] = [
        { score: 0, components: {} as any, timestamp: '', valid: false, errors: ['invalid'] },
        { score: 0, components: {} as any, timestamp: '', valid: false, errors: ['invalid'] },
      ];

      const average = averageGI2Scores(results);
      expect(average).toBe(0);
    });

    it('should round average to 2 decimal places', () => {
      const results: GI2Result[] = [
        { score: 33.33, components: {} as any, timestamp: '', valid: true, errors: [] },
        { score: 66.67, components: {} as any, timestamp: '', valid: true, errors: [] },
      ];

      const average = averageGI2Scores(results);
      const decimalPlaces = (average.toString().split('.')[1] || '').length;
      expect(decimalPlaces).toBeLessThanOrEqual(2);
    });
  });
});
