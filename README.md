# Guardian Academy

> **Open standards for measuring institutional integrity worldwide.**

Guardian Academy develops the **Guardian Integrity Score (GI²)** — a formal, auditable system for measuring organizational integrity across five critical dimensions: Integrity, Stability, Trust, Sustainability, and Power Risk.

This is a **standards-first monorepo** combining open specifications, governance frameworks, and reference implementations designed to scale integrity metrics globally.

---

## 🎯 What's Here

### **Standards** (Public Domain)
Everything you need to measure institutional integrity:

- **[GI² v0.1 Metrics](standards/gi2-metrics.md)** — Five core dimensions, scoring ranges, interpretation guide
- **[Scoring Formula](standards/scoring-formula.md)** — Mathematical specification, examples, implementation guide
- **[Data Collection Guidelines](standards/data-collection-guidelines.md)** — How to collect each metric, quality checks, reporting schedule

### **Governance** (Open Framework)
How Guardian Academy itself operates with transparency and accountability:

- **[Governance Charter](docs/governance-charter.md)** — Trustee structure, decision-making processes, conflicts of interest, external audits
- **[5-Year Roadmap](docs/5-year-roadmap.md)** — Milestones from MVP (10 orgs) to scale (500+ orgs by 2030)

### **Code** (MIT License)
Reference implementations and tools:

- **[Web App](apps/web)** — Next.js dashboard for viewing GI² scores and trends
- **[Mobile App](apps/mobile)** — React Native/Expo for data collection in the field
- **[Scoring Engine](packages/scoring-engine)** — Core GI² calculation logic (TypeScript)
- **[Audit Logger](packages/audit-logger)** — Tracking and logging for governance compliance
- **[Core Library](packages/core)** — Shared types, utilities, exports

---

## 📊 The GI² Score

The Guardian Integrity Score combines five weighted metrics:

```
GI² = (Integrity × 0.20) + (Stability × 0.20) + (Trust × 0.20) + 
      (Sustainability × 0.20) + ((100 - PowerRisk) × 0.20)

Result: 0–100, where 100 = exceptional institutional integrity
```

| Score | Level | Risk |
|-------|-------|------|
| 90–100 | Exceptional | Minimal |
| 75–89 | Strong | Low |
| 60–74 | Adequate | Moderate |
| 40–59 | Weak | High |
| 0–39 | Critical | Critical |

**Learn more:** [GI² Metrics Specification](standards/gi2-metrics.md)

---

## 🚀 Quick Start

### Prerequisites
- Node.js ≥ 18.0.0
- npm ≥ 9.0.0

### Install Dependencies
```bash
npm install --legacy-peer-deps
```

**Note:** `--legacy-peer-deps` is required because the monorepo mixes Next.js (React 18) and Expo (React 19). This flag safely resolves the version conflict without breaking either app.

### Run All Services
```bash
# All apps/packages simultaneously
npm run dev:all

# Or individually:
npm run dev:web       # Next.js on http://localhost:3000
npm run dev:mobile    # Expo on http://localhost:8081
npm run dev:scoring   # TypeScript compiler in watch mode
npm run dev:audit     # TypeScript compiler in watch mode
```

### Build
```bash
npm run build:all
```

### Test
```bash
npm run test:all
```

---

## 📁 Repository Structure

```
guardian-academy/
├── standards/                    # GI² specifications (public domain)
│   ├── gi2-metrics.md           # 5 core dimensions, definitions
│   ├── scoring-formula.md       # Mathematical specification
│   └── data-collection-guidelines.md  # How to collect each metric
│
├── docs/                        # Governance & strategy
│   ├── governance-charter.md    # How Guardian Academy operates
│   ├── 5-year-roadmap.md        # Milestones & scaling plan
│   └── ...                      # Additional implementation docs
│
├── apps/
│   ├── web/                     # Next.js dashboard (PWA)
│   │   ├── src/
│   │   │   ├── app/             # Pages & API routes
│   │   │   ├── components/      # React components
│   │   │   └── lib/             # Utilities, auth, Firebase
│   │   └── package.json
│   │
│   └── mobile/                  # React Native/Expo app
│       ├── app/                 # Tab-based navigation
│       ├── components/          # Reusable components
│       ├── lib/                 # Scoring, utilities
│       └── package.json
│
├── packages/
│   ├── scoring-engine/          # Core GI² calculation
│   │   ├── src/
│   │   │   └── index.ts         # calculateGI2Score() function
│   │   └── package.json
│   │
│   ├── audit-logger/            # Governance audit trails
│   │   ├── src/
│   │   │   └── index.ts         # logAuditEvent() function
│   │   └── package.json
│   │
│   └── core/                    # Shared types & utilities
│       ├── src/
│       └── package.json
│
├── package.json                 # Root monorepo config
├── tsconfig.json                # Shared TypeScript setup
└── README.md                    # You are here
```

---

## 🏗️ Standards-First Architecture

Guardian Academy prioritizes **formal specifications** over code:

1. **Standards come first** ([standards/](standards/)) — GI² metrics, formulas, and data collection are publicly documented in Markdown
2. **Governance is transparent** ([docs/governance-charter.md](docs/governance-charter.md)) — All decision-making processes, roles, and accountability mechanisms are explicit
3. **Code implements standards** ([packages/scoring-engine/src/index.ts](packages/scoring-engine/src/index.ts)) — The scoring engine strictly follows the published formula
4. **Apps consume the code** ([apps/web](apps/web), [apps/mobile](apps/mobile)) — Web and mobile interfaces display GI² scores calculated by the engine

This ensures that:
- ✅ Standards can be used independently (no code required)
- ✅ Code can be audited against published specifications
- ✅ Governance decisions are transparent and traceable
- ✅ Anyone can implement GI² in their own system

---

## 🔗 Path Aliases

The monorepo uses TypeScript path aliases for clean imports:

```typescript
import { calculateGI2Score } from '@scoring/index';
import { logAuditEvent } from '@audit/index';
import metrics from '@standards/gi2-metrics.md';  // Future: load specs as data
```

See [tsconfig.json](tsconfig.json) for configuration.

---

## 📖 Documentation

### For Standard Users
- **[GI² Metrics](standards/gi2-metrics.md)** — What the 5 dimensions measure
- **[Data Collection Guide](standards/data-collection-guidelines.md)** — How to gather data for scoring

### For Implementers
- **[Scoring Formula](standards/scoring-formula.md)** — Mathematical details and examples
- **[packages/scoring-engine/src/index.ts](packages/scoring-engine/src/index.ts)** — Reference TypeScript implementation

### For Governance & Strategy
- **[Governance Charter](docs/governance-charter.md)** — How Trustees, Auditors, and Committees work
- **[5-Year Roadmap](docs/5-year-roadmap.md)** — Scaling from MVP (2026) to global adoption (2030)

### For Developers
- [Web App README](apps/web/README.md)
- [Mobile App README](apps/mobile/README.md)

---

## 🔐 Firebase Setup (Optional)

To persist data to Firestore instead of in-memory storage:

1. Create a Firebase project and enable Firestore
2. Generate a service account JSON key
3. Set environment variable:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account", ...}'
   ```
4. The API routes (`/api/login`, `/api/export`, `/api/reports`) will automatically sync to Firestore

If unset, the app will use in-memory storage.

---

## 📈 Development Status

| Component | Status | Target |
|-----------|--------|--------|
| GI² Specifications | ✅ v0.1 Draft | Public by Q2 2026 |
| Scoring Engine | ✅ Implemented | Production-ready Q3 2026 |
| Governance Charter | ✅ v0.1 Draft | Trustee ratification Q2 2026 |
| Web Dashboard | ✅ WIP | MVP Q3 2026 |
| Mobile App | ✅ WIP | Field-ready Q3 2026 |
| Audit System | 🔄 Planned | Q3 2026 |
| First 10 Pilot Orgs | 🔄 Recruiting | Q3 2026 |

---

## 🤝 Contributing

Guardian Academy welcomes contributions across three levels:

### 1. **Improve the Standards** (Highest Impact)

Have feedback on GI² metrics, the scoring formula, or data collection?

1. Open an issue describing the suggestion
2. Reference the relevant standard file ([standards/](standards/))
3. Explain the evidence or rationale
4. The Standards Committee will review quarterly

📋 See [Governance Charter §3](docs/governance-charter.md#3-decision-making-processes) for the standards change process.

### 2. **Build or Improve Implementations**

Help implement GI² in your own context:

- Fork this repo and create a variant in your language
- Open a PR to link your implementation
- We'll feature it in the [5-Year Roadmap](docs/5-year-roadmap.md#year-2-2027-scale--adoption)

### 3. **Use & Submit Data**

Become a pilot organization and get your institution scored:

- Email: [apply@guardianacademy.org](mailto:apply@guardianacademy.org) (coming soon)
- Or open an issue titled `[Pilot] Organization Name`

---

## 📜 License

- **Standards** ([standards/](standards/)) — **Public Domain (CC0)** — Use freely, modify, implement
- **Code** ([apps/](apps/), [packages/](packages/)) — **MIT License** — Open-source, attribution required
- **Documentation** ([docs/](docs/)) — **CC-BY-4.0** — Share with attribution

See [LICENSE](LICENSE) for full details.

---

## 🏛️ Governance & Accountability

Guardian Academy is governed by an independent Board of Trustees and subject to the same standards it promotes.

- **Current Status:** Founder-led; Trustee recruitment in Q2 2026
- **Governance Structure:** [Governance Charter](docs/governance-charter.md)
- **GI² Self-Assessment:** Minimum score of 60/100 required; published quarterly
- **External Audits:** Annual financial and governance audits by independent firm

📊 [Read the full Governance Charter](docs/governance-charter.md)

---

## 🗺️ Roadmap

**2026 (Foundation):** GI² v0.1 published, 10 pilot organizations scored  
**2027 (Scale):** 50 organizations, GI² v0.2 released, 20 certified auditors  
**2028 (Expansion):** 150 organizations, sector-specific variants, government partnerships  
**2029 (Institutionalization):** GI² v1.0 published, 300 organizations, academic institute  
**2030 (Legacy):** 500+ organizations globally, endowment established, independent governance  

📈 [Full 5-Year Roadmap](docs/5-year-roadmap.md)

---

## 📞 Reach Out

- **Questions about standards?** Open an issue in [standards/](standards/)
- **Interested in implementing GI²?** Email or open an issue
- **Want to be a pilot organization?** Email (coming soon)
- **Governance feedback?** See [Governance Charter §4](docs/governance-charter.md#4-accountability-mechanisms)

---

## 🙏 Acknowledgments

Guardian Academy is built on the insights of:
- Academic research on institutional integrity
- Governance best practices from leading nonprofits and institutions
- Community feedback from early adopters and stakeholders

We're grateful to everyone contributing ideas, critiques, and implementations.

---

**Guardian Academy** © 2026 | [Governance Charter](docs/governance-charter.md) | [Standards](standards/) | [Roadmap](docs/5-year-roadmap.md)
