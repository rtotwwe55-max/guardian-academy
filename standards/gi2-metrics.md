# GI² v0.1: Guardian Integrity Score Metrics

**Version:** 0.1  
**Effective Date:** March 2026  
**Status:** Draft  

---

## Overview

The Guardian Integrity Score (GI²) is a composite metric designed to measure institutional integrity across five critical dimensions. The score ranges from **0–100**, where 100 represents perfect institutional integrity.

---

## Five Core Metrics

### 1. **Integrity** (20% weight)

**Definition:** The degree to which an organization's actions align with stated values and commitments.

**Measurement Dimensions:**
- Transparency of decision-making processes
- Consistency between public statements and actions
- Adherence to published policies
- Public track record of ethical conduct

**Data Sources:**
- Internal audit logs
- Third-party assessments
- Historical compliance records

**Scoring Range:** 0–100

---

### 2. **Stability** (20% weight)

**Definition:** The organization's ability to maintain operational continuity and resist catastrophic failure.

**Measurement Dimensions:**
- Financial reserves (months of operating expenses)
- Key personnel redundancy
- Operational resilience (backup systems, contingency plans)
- Legal stability (active lawsuits, enforcement actions)

**Data Sources:**
- Financial statements
- Organizational structure audits
- Risk assessments

**Scoring Range:** 0–100

---

### 3. **Trust** (20% weight)

**Definition:** The level of confidence stakeholders have in the organization's competence and benevolence.

**Measurement Dimensions:**
- Stakeholder satisfaction surveys
- Third-party endorsements
- Historical performance on commitments
- Reputation in relevant communities

**Data Sources:**
- Survey data
- Public reviews and ratings
- Media analysis
- Stakeholder interviews

**Scoring Range:** 0–100

---

### 4. **Sustainability** (20% weight)

**Definition:** The organization's ability to maintain its mission and impact over time.

**Measurement Dimensions:**
- Long-term funding security
- Environmental impact alignment with values
- Social impact progress toward stated goals
- Scalability of core operations

**Data Sources:**
- Financial projections
- Outcome measurements
- Strategic plans
- Third-party ESG assessments

**Scoring Range:** 0–100

---

### 5. **Power Risk** (20% weight, inverse scoring)

**Definition:** The organizational context risk posed by concentrations of power, unaccountable decision-making, or potential for abuse.

**Measurement Dimensions:**
- Leadership concentration (% of power held by top 3 leaders)
- Governance structure diversity (board independence)
- Accountability mechanisms (third-party oversight)
- Conflict-of-interest disclosures

**Data Sources:**
- Governance documents
- Organizational charts
- Board meeting minutes
- Conflict-of-interest registries

**Scoring Range:** 0–100 (where 100 = high risk, converted to inverse in final score)

---

## Composite Score Formula

```
GI² = (Integrity × 0.20) + (Stability × 0.20) + (Trust × 0.20) + 
      (Sustainability × 0.20) + ((100 - PowerRisk) × 0.20)
```

**Result:** A single GI² score from 0–100.

---

## Interpretation Guide

| GI² Score | Integrity Level | Risk Assessment |
|-----------|-----------------|-----------------|
| 90–100    | Exceptional     | Minimal risk    |
| 75–89     | Strong          | Low risk        |
| 60–74     | Adequate        | Moderate risk   |
| 40–59     | Weak            | High risk       |
| 0–39      | Critical        | Critical risk   |

---

## Implementation Requirements

1. All metrics must be collected and validated using the defined data sources.
2. Scores should update quarterly or upon significant organizational changes.
3. Each metric component must be transparently documented and auditable.
4. Historical scores must be archived for trend analysis.

---

## Version History

- **v0.1** (March 2026): Initial draft with five core metrics
