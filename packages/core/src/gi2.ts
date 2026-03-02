import { IntegrityScore } from "./types";

export function calculateGI2(scores: IntegrityScore[]): number {
  if (scores.length === 0) return 0;

  const total = scores.reduce((sum, s) => {
    return sum + (s.truth + s.responsibility + s.restraint - s.powerRisk);
  }, 0);

  return Number((total / scores.length).toFixed(2));
}
