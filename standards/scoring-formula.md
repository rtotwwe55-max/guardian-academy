# GI² Scoring Formula & Implementation Guide

**Version:** 0.1  
**Last Updated:** March 2026  

---

## Mathematical Specification

### Input Parameters

```
Input:
  - Integrity (I):    0–100 (continuous)
  - Stability (S):    0–100 (continuous)
  - Trust (T):        0–100 (continuous)
  - Sustainability (U): 0–100 (continuous)
  - PowerRisk (P):    0–100 (continuous, inverted in calculation)
```

### GI² Calculation

```
GI² = (I × 0.20) + (S × 0.20) + (T × 0.20) + (U × 0.20) + ((100 − P) × 0.20)

Where:
  - Each weight = 0.20 (20% of composite score)
  - PowerRisk is inverted: (100 − P) to align direction
  - Final GI² ∈ [0, 100]
```

### Example Calculation

```
Given:
  Integrity = 85
  Stability = 72
  Trust = 88
  Sustainability = 79
  PowerRisk = 45

GI² = (85 × 0.20) + (72 × 0.20) + (88 × 0.20) + (79 × 0.20) + ((100 − 45) × 0.20)
    = 17 + 14.4 + 17.6 + 15.8 + (55 × 0.20)
    = 17 + 14.4 + 17.6 + 15.8 + 11
    = 75.8

Result: GI² = 75.8 (Strong integrity level)
```

---

## Implementation Steps

### Step 1: Collect Input Data

Gather raw metrics for each dimension:

| Dimension     | Collection Method | Frequency | Owner |
|---------------|-------------------|-----------|-------|
| Integrity     | Audit logs + surveys | Quarterly | Compliance |
| Stability     | Financial analysis | Monthly | Finance |
| Trust         | Stakeholder feedback | Monthly | Operations |
| Sustainability| Impact assessments | Quarterly | Strategy |
| PowerRisk     | Org structure audit | Bi-annual | Governance |

### Step 2: Normalize to 0–100 Scale

Raw data may arrive in different formats. Normalize using:

```
Normalized = (Raw − Min) / (Max − Min) × 100
```

**Example:** If Stability is measured as "6 months of runway" and max is "12 months":
```
Stability = (6 − 0) / (12 − 0) × 100 = 50
```

### Step 3: Apply Weighting

Each metric contributes 20% to the final score:

```
Weighted = Metric × 0.20
```

### Step 4: Invert Power Risk

Power Risk is inverted because higher power concentration = lower integrity:

```
InvertedPowerRisk = (100 − PowerRisk) × 0.20
```

### Step 5: Sum to Final GI²

```
GI² = Sum(all weighted metrics)
```

### Step 6: Track & Archive

Store GI² result with:
- Timestamp
- Component scores
- Data sources used
- Auditor signature
- Version of this formula

---

## Edge Cases & Validation

### Missing Data

If any component metric is unavailable:

**Option A (Conservative):** Use 0 for the missing component.
```
GI² = (I × 0.20) + (S × 0.20) + (T × 0.20) + (0 × 0.20) + (U_inverted × 0.20)
```

**Option B (Weighted Redistribution):** Redistribute weights proportionally:
```
Adjusted weight for each available metric = 0.20 / (number_of_available_metrics)
```

### Out-of-Range Values

If any component exceeds 100 or falls below 0:
- **Cap at 100** if > 100
- **Cap at 0** if < 0
- **Log as data quality issue** for investigation

### Audit Trail

Every GI² calculation must be logged with:
```json
{
  "timestamp": "2026-03-04T12:00:00Z",
  "integrity": 85,
  "stability": 72,
  "trust": 88,
  "sustainability": 79,
  "powerRisk": 45,
  "gi2Score": 75.8,
  "formulaVersion": "0.1",
  "auditor": "compliance@guardian.org",
  "dataQualityFlags": []
}
```

---

## Code Implementation Reference

See `packages/scoring-engine/src/index.ts` for TypeScript implementation.
