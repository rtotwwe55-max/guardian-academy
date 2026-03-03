# guardian-academy
Guardian Academy — A scalable integrity &amp; leadership operating system for university student leaders. MVP v1: Metrics dashboard (Integrity, Stability, Trust, Sustainability, Power Risk) with PWA architecture

Guardian Academy is a research-first civic technology platform designed to measure, simulate, and institutionalize integrity in leadership systems.

This repository contains the full infrastructure for:
- Integrity metrics (GI²)
- Moral decision simulation
- University-hosted governance dashboards
- Certification and audit systems

## Repository Structure

/apps
  /web       → Next.js PWA (primary interface)
  /mobile    → React Native / Expo client (field data collection)
/packages
  /core      → Shared integrity logic, metrics, types
/docs
  → White papers, governance doctrine, research notes

## Status
Early infrastructure build (non-production).

## Firebase Setup (optional)
To sync data in Firestore rather than in-memory:
1. Create a Firebase project and enable Firestore.
2. Generate a service account JSON and set the contents in the
   `FIREBASE_SERVICE_ACCOUNT` environment variable (in your devcontainer
   or deployment) e.g.:
   ```bash
   export FIREBASE_SERVICE_ACCOUNT='{"type":"service_account", ...}'
   ```
3. The API endpoints (`/api/login`, `/api/history`, `/api/export`) will
   automatically persist to Firestore when the service account is present.

If the variable is unset, the app will attempt to initialize Firebase
but will fail; you can also keep using the in-memory store by not
including the service account.
