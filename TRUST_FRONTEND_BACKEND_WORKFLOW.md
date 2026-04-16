# Trust Frontend-Backend Workflow

## Overview
This document explains how the trust frontend pages are connected to the backend API and Supabase-backed trust data flow.

## What Was Implemented

### 1. Frontend runtime verification
- Frontend dev server was started successfully from the frontend folder.
- Active local URL: http://localhost:5174/
- Trust route runtime check result: all trust routes return HTTP 200 on dev server.

### 2. Shared trust API layer added
- Added frontend/src/lib/trustApi.ts
- Added frontend/src/lib/trustAuth.ts
- Added frontend/src/vite-env.d.ts

The API layer now handles:
- Base URL from VITE_API_BASE_URL (fallback: http://localhost:5000)
- Token-based Authorization header
- Centralized request error handling
- Typed calls for auth, trust, verification, and disputes

### 3. Trust routes connected to backend

#### Auth flow
- frontend/src/pages/trust/TrustLogin.tsx
  - Connected to POST /api/auth/login
  - Connected to POST /api/auth/signup
  - Connected to POST /api/auth/request-otp
  - Connected to POST /api/auth/verify-otp
  - Sends a 6-digit email OTP before creating the session
  - Stores JWT token and user info in localStorage only after OTP verification

- frontend/src/pages/trust/OTPVerify.tsx
  - Verifies the email OTP against backend state
  - Requests resend codes when needed
  - Stores token after successful OTP verification
  - Moves user to the correct role-based page after verification

#### Onboarding and verification
- frontend/src/pages/trust/ProfileSetup.tsx
  - Connected to POST /api/verification/pin-verify
  - Connected to POST /api/verification/id-upload (optional)

#### Trust profile
- frontend/src/pages/trust/TrustProfile.tsx
  - Connected to GET /api/trust/me
  - Renders live trust score, metrics, verification state, and badges

#### Providers and trust visibility
- frontend/src/pages/trust/NearbyProviders.tsx
  - Pulls candidate provider ids from disputes data
  - Fetches trust data per provider via GET /api/trust/user/:id
  - Sorts providers by trust score

- frontend/src/pages/trust/ProviderDetails.tsx
  - Connected to GET /api/trust/user/:id
  - Shows trust score, metrics, and badges for selected provider

#### Disputes
- frontend/src/pages/trust/Disputes.tsx
  - Connected to GET /api/disputes

- frontend/src/pages/trust/RaiseDispute.tsx
  - Connected to POST /api/disputes

- frontend/src/pages/trust/DisputeDetails.tsx
  - Loads live disputes list and resolves selected dispute by id

- frontend/src/pages/trust/AdminDisputes.tsx
  - Connected to GET /api/disputes
  - Connected to PATCH /api/disputes/:id
  - Includes status actions: under_review, resolved, rejected

### 4. Cross-page navigation connection
- Added shared navigation component: `frontend/src/components/trust/TrustRouteBar.tsx`
- The trust route bar is rendered in all trust pages so users can move page-to-page directly.

## Page Direction Flow

Primary user journey:
- /auth/login -> /auth/otp-verify -> /onboarding/setup -> /trust/me
- /trust/me -> /providers/nearby -> /provider/:id -> /disputes/new/:exchangeId -> /disputes -> /disputes/:id

Admin journey:
- /auth/login -> /auth/otp-verify -> /admin/disputes

Global trust navigation:
- Every trust page now includes direct links to:
  - /auth/login
  - /auth/otp-verify
  - /onboarding/setup
  - /trust/me
  - /providers/nearby
  - /provider/demo-user
  - /disputes/new/demo-exchange
  - /disputes
  - /disputes/demo-id
  - /admin/disputes

## Mapping Against FRONTEND_TRUST_LAYER_PAGES.md

### Implemented now
- /auth/login
- /auth/otp-verify
- /onboarding/setup
- /trust/me
- /providers/nearby
- /provider/:id
- /disputes/new/:exchangeId
- /disputes
- /disputes/:id
- /admin/disputes

### Not yet implemented (from the doc)
- /auth/role-select
- /auth/otp-request
- /onboarding/profile
- /onboarding/address
- /onboarding/id-upload (dedicated page)
- /verification/status
- /trust/:userId (standalone public page route)
- /badges
- /inspector/review-queue
- /inspector/review/:verificationId
- /admin/trust-dashboard

## Database Flow
- Backend auth/signup/login issues JWT.
- Frontend stores token in localStorage.
- Frontend stores pending auth email/purpose in sessionStorage until OTP is verified.
- Frontend sends Bearer token to trust/dispute/verification endpoints.
- Backend writes and reads trust data through service logic.
- If Supabase trust tables exist, trust profile and verification data are persisted in database-backed tables.

## Important Build Note
- Full frontend build now passes globally.
- Command: `npm run build`
- Result: success (warnings only for large chunks, no TypeScript errors).

## Tasks Completed Checklist
- [x] Run frontend from the frontend folder
- [x] Verify all trust routes return HTTP 200
- [x] Review trust folder route structure
- [x] Match implemented trust routes to documentation
- [x] Add shared API and token/session handling
- [x] Connect auth pages to backend
- [x] Connect verification onboarding page to backend
- [x] Connect trust profile page to backend trust endpoint
- [x] Connect disputes pages to backend endpoints
- [x] Connect admin dispute actions to backend patch endpoint
- [x] Connect trust pages with shared cross-page route bar
- [x] Add page direction flow map
- [x] Add workflow documentation

## Recommended Next Tasks
1. Implement OTP request endpoint in backend and wire /auth/otp-request properly.
2. Add dedicated verification status page and trust/:userId public trust route.
3. Implement inspector review pages and queue APIs.
4. Add route guards and role-based redirect logic for non-admin users opening /admin/disputes.
