# Data Collection Guidelines for GI² v0.1

**Version:** 0.1  
**Last Updated:** March 2026  

---

## Overview

This document specifies how to reliably and auditably collect data for each GI² metric dimension.

---

## 1. Integrity Data Collection

### What to Measure

- **Transparency Score** (0–100): Percentage of major decisions with public rationale
- **Consistency Score** (0–100): Track alignment between stated values and actions over past 12 months
- **Policy Adherence** (0–100): Percentage of documented compliance with internal policies
- **Ethical Track Record** (0–100): Third-party assessment of historical ethical conduct

### Data Sources

1. **Internal Audit Logs**
   - All decisions logged in governance system
   - Weekly review of decision rationale
   - Flag any decisions lacking transparency

2. **Stakeholder Surveys**
   - Quarterly: "Do you believe [Organization] acts consistently with its stated values?"
   - Scale: 0–100
   - Sample size: 30+ respondents from diverse backgrounds

3. **Compliance Database**
   - Track all policy violations and corrections
   - Calculate: (Compliant months) / (Total months) × 100

4. **Third-Party Audit**
   - Annual ethical conduct review by external firm
   - Use peer benchmarks or industry standards

### Data Quality Checks

- [ ] Decision logs updated daily
- [ ] Survey response rate ≥ 50%
- [ ] No missing compliance months
- [ ] External audit completed within past 12 months

---

## 2. Stability Data Collection

### What to Measure

- **Financial Runway** (0–100): (Months funded) / 12 × 100
- **Key Personnel Redundancy** (0–100): (Roles with backups) / (Total critical roles) × 100
- **Operational Resilience** (0–100): Assessment of backup systems and contingencies
- **Legal Risk** (0–100): (100 − Active lawsuits severity score) / Worst case scenario

### Data Sources

1. **Financial Statements**
   - Quarterly P&L, balance sheet
   - Calculate: Current reserves / Monthly burn rate = Months of runway
   - Normalize to 0–100 (assume max runway = 24 months)

2. **Organizational Structure Audit**
   - Map all critical roles
   - For each role: Does a backup exist?
   - Calculate: Count of covered roles / Total critical roles

3. **Operational Audits**
   - Quarterly review of disaster recovery plans
   - Check: Backup power, data replication, secondary facilities
   - Score redundancy gap vs. industry best practices

4. **Legal Status Tracking**
   - Monitor active lawsuits, regulatory investigations
   - Assign severity: Critical (100), High (50), Medium (10), Low (5)
   - Calculate: 100 − (Sum of severities / Max possible) × 100

### Data Quality Checks

- [ ] Financial statements audited by external firm
- [ ] Org structure updated quarterly
- [ ] Disaster recovery plans tested annually
- [ ] Legal cases tracked in centralized registry

---

## 3. Trust Data Collection

### What to Measure

- **Stakeholder Satisfaction** (0–100): Survey-based
- **Third-Party Endorsements** (0–100): Count and weighting of endorsements
- **Commitment Fulfillment** (0–100): Tracking of promises kept vs. made
- **Reputation Score** (0–100): Aggregated from media and community sources

### Data Sources

1. **Stakeholder Surveys (Quarterly)**
   - Question: "How much do you trust this organization?"
   - Scale: 0 (no trust) to 100 (complete trust)
   - Segments: Beneficiaries, partners, donors, employees
   - Sample size: 50+ per segment

2. **Third-Party Endorsements Registry**
   - Track: NGO certifications, awards, peer recognition
   - Weighting: Prestige of endorsing organization
   - Calculate: (Sum of endorsement weights) / (Max possible) × 100

3. **Commitment Tracking**
   - Maintain public commitments log (from website, reports, statements)
   - Quarterly: Mark as "fulfilled" or "in progress"
   - Calculate: (Fulfilled) / (Total made) × 100

4. **Reputation Analysis**
   - Monthly: Scan media, reviews, social media for sentiment
   - Use: Sentiment analysis tool (e.g., NLP) or manual coding
   - Aggregate to 0–100 scale (−1 to +1 sentiment → 0–100)

### Data Quality Checks

- [ ] Survey conducted by neutral third party
- [ ] Endorsements independently verified
- [ ] Commitment log updated weekly
- [ ] Media sentiment reviewed by 2+ independent coders

---

## 4. Sustainability Data Collection

### What to Measure

- **Funding Security** (0–100): Diversity and predictability of revenue streams
- **Environmental Impact Alignment** (0–100): Progress on environmental commitments
- **Social Impact Progress** (0–100): Achievement of stated goals
- **Operational Scalability** (0–100): Assessment of growth capacity

### Data Sources

1. **Financial Diversification Analysis**
   - List all revenue streams
   - Calculate: Herfindahl-Hirschman Index of revenue concentration
   - Higher diversity = higher score (0–100)

2. **Environmental Impact Audit**
   - Track: Carbon footprint, waste, water, energy
   - Compare: Actual vs. targets for each metric
   - Calculate: (Targets met) / (Total targets) × 100

3. **Social Impact Dashboard**
   - Quarterly: Measure progress on stated social goals
   - Use: Logic models, outcome metrics, third-party evaluation
   - Calculate: (Goals achieved) / (Goals planned) × 100

4. **Scalability Assessment**
   - Annual review: Can current operations scale 2x/5x/10x?
   - Assess: Technology, people, funding, infrastructure
   - Score: 100 if fully scalable, lower for identified bottlenecks

### Data Quality Checks

- [ ] Revenue streams verified from audited statements
- [ ] Environmental data independently measured
- [ ] Social impact measured by external evaluator
- [ ] Scalability review conducted by technology consultant

---

## 5. Power Risk Data Collection

### What to Measure

- **Leadership Concentration** (0–100): Percentage of power held by top leaders
- **Board Independence** (0–100): Percentage of independent directors
- **Accountable Oversight** (0–100): Existence and effectiveness of checks on power
- **Conflict-of-Interest Transparency** (0–100): Disclosure rates and management

### Data Sources

1. **Leadership Analysis**
   - Identify all decision-making power holders (CEO, founders, board)
   - Analyze: Voting control, veto power, unilateral decision authority
   - Calculate: (% of power held by top 3) → Inverse to 0–100 scale

2. **Board Governance Review**
   - Board structure: Size, composition, independence criteria
   - Calculate: (Independent directors) / (Total directors) × 100
   - Independent = no material financial ties to organization

3. **Oversight Mechanisms Audit**
   - Document: External audits, compliance reviews, board committees
   - Assess: Frequency, scope, independence, enforcement
   - Score: Based on robustness vs. best practices

4. **Conflict-of-Interest Registry**
   - Maintain: Centralized COI disclosures for all leaders
   - Quarterly: Review and enforce disclosure compliance
   - Calculate: (Compliant disclosures) / (Required disclosures) × 100

### Data Quality Checks

- [ ] Leadership structure reviewed by governance expert
- [ ] Board independence verified by external counsel
- [ ] Oversight mechanisms tested for effectiveness
- [ ] COI disclosures independently verified

---

## Reporting Schedule

| Metric | Collection | Review | Publication |
|--------|------------|--------|-------------|
| Integrity | Continuous | Monthly | Public quarterly |
| Stability | Monthly | Monthly | Public quarterly |
| Trust | Monthly | Monthly | Public quarterly |
| Sustainability | Quarterly | Quarterly | Public quarterly |
| PowerRisk | Bi-annual | Annual | Public annual |

All data must be archived and made available for audit.

