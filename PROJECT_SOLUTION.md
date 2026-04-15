# LPG Sharing System - Project Solution Document

## 1. Problem Statement
In many communities, LPG supply delays force households to borrow cylinders informally. This creates risks:
- unsafe handling,
- no verification of cylinder condition,
- unfair pricing during emergencies,
- no traceable accountability.

## 2. Proposed Solution
Build a community-based LPG sharing and emergency access platform where verified users can:
- list extra LPG cylinders,
- request nearby cylinders in urgent situations,
- complete verified and safety-checked exchanges.

This replaces unsafe informal exchanges with a structured, trackable, and trust-based digital process.

## 3. Core Objectives
- Enable fast access to LPG in emergency and shortage situations.
- Ensure safety before and after each exchange.
- Create a trusted local network of providers and requesters.
- Keep transactions transparent, verifiable, and fair.

## 4. Value Proposition
- Safer than neighborhood informal borrowing.
- Faster emergency resolution through location-based matching.
- Transparent and traceable exchange history.
- Community trust through verification and ratings.

## 5. Solution Architecture

### Frontend
- React + Tailwind CSS
- Mobile-first experience
- Modules for auth, dashboard, emergency flow, map search, and profile

### Backend
- Node.js + Express
- REST APIs for auth, listing, request, transaction, and safety checks
- JWT-based session handling

### Data/Auth Layer
- Current stage: temporary in-memory auth for development
- Planned stage: Supabase-backed persistent storage and auth workflows

### Maps and Proximity
- Leaflet + OpenStreetMap
- Nearest provider discovery and radius-based search

## 6. End-to-End User Flow
1. User signs up and verifies phone/email.
2. User creates profile and location.
3. Provider posts LPG availability.
4. Requester raises emergency request.
5. System matches nearest trusted providers.
6. Exchange is accepted and meetup confirmed.
7. Mandatory safety checklist is completed by both sides.
8. Transaction closes with rating and audit log.

## 7. Community-Based Sharing Model

### User Roles
- Household Requester
- Household Provider
- Local Moderator/Admin

### Trust Model
- Verified badge for validated users
- Reliability score based on successful safe exchanges
- Flags/reporting for suspicious behavior

### Fairness Controls
- Limit excessive active listings
- Detect repeated no-show/fake requests
- Moderate abnormal emergency pricing

## 8. Safety Framework
Safety is mandatory, not optional.

Safety checkpoints:
- visual cylinder inspection,
- regulator and hose check,
- leakage test confirmation,
- final dual acknowledgement before completion.

The app should not mark the exchange complete unless both users pass the checklist.

## 9. Current Implementation Status
- Backend server is running with Express middleware.
- Auth routes available:
  - POST /api/auth/signup
  - POST /api/auth/login
  - GET /api/auth/me
- JWT token flow implemented.
- Temporary in-memory user store used for development.
- Frontend auth page currently acts as a demo access gateway; full login/signup form integration is the next step.

## 10. Proposed Database Design (Supabase - planned)
Core entities:
- users
- user_verification
- cylinder_listings
- emergency_requests
- transactions
- safety_checklists
- ratings
- dispute_reports

## 11. API Modules (Target)
- Auth: signup, login, me, refresh
- Users: profile, verification status
- Listings: create, update, nearby search
- Requests: create emergency request, accept/decline, status tracking
- Transactions: handover, completion, proof upload
- Safety: checklist submission and validation
- Community: ratings, reports, moderation actions

## 12. MVP Scope
MVP should include:
- Login/signup with persistent database
- Nearby listing discovery
- Emergency request flow
- Provider acceptance and status tracking
- Safety checklist enforcement
- Transaction close with rating

## 13. KPIs for Success
- Average emergency fulfillment time
- Percentage of transactions completed with safety checklist
- Repeat usage rate
- Dispute rate per 100 transactions
- Active provider density by locality

## 14. Risks and Mitigations
- Fake users or listings:
  - Mitigation: verification + trust scoring + moderation
- Unsafe exchanges:
  - Mitigation: mandatory checklist + completion gate
- Low liquidity in some areas:
  - Mitigation: expand search radius + community onboarding campaigns

## 15. Next Execution Plan
1. Replace temp auth store with Supabase tables.
2. Build real frontend login/signup form and connect to backend auth APIs.
3. Implement listing + emergency request APIs.
4. Add map-based nearby provider matching.
5. Add safety checklist UI and completion gate.
6. Add moderator/reporting flow and analytics dashboard.

## 16. Conclusion
The LPG Sharing System is a practical, community-first safety platform designed to reduce household risk during LPG shortages. By combining verified identity, local matching, and mandatory safety protocols, it can provide fast and trustworthy emergency access to LPG while building long-term community resilience.
