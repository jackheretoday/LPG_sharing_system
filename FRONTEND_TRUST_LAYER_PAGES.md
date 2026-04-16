# Frontend Pages for Community Trust Layer

## 1. Goal of This Frontend Module
This module covers all user-facing screens required to implement:
- role-based onboarding,
- KYC-lite verification,
- trust score visibility,
- badges,
- moderation and dispute workflows.

## 2. Frontend Stack (Recommended)
- React + Tailwind CSS
- React Router for page routing
- React Hook Form for forms
- Zod for schema validation
- TanStack Query (or SWR) for server state
- Axios/fetch for API calls

## 3. Route Map (Proposed)

Public / onboarding:
- /auth
- /auth/role-select
- /auth/otp-request
- /auth/otp-verify
- /onboarding/profile
- /onboarding/address
- /onboarding/id-upload (optional)

User verification + trust:
- /trust/me
- /trust/:userId
- /badges
- /verification/status

Exchange-facing trust pages:
- /providers/nearby
- /provider/:userId
- /emergency/request
- /exchange/:exchangeId/safety-check

Disputes:
- /disputes/new/:exchangeId
- /disputes
- /disputes/:id

Inspector/admin:
- /inspector/review-queue
- /inspector/review/:verificationId
- /admin/trust-dashboard

## 4. Detailed Page List

## 4.1 Auth and Role Selection

### Page: /auth
Purpose:
- Entry page with login/signup options and role selection.

UI components:
- Role cards
- Name input on signup
- Email input
- Password input
- Login/signup toggle

API calls:
- POST /api/auth/signup
- POST /api/auth/login

### Auth roles supported now
- User
- Consumer
- Provider
- Admin

Role aliases accepted by the backend:
- `household` -> `consumer`
- `verified_reseller` -> `provider`
- `volunteer_inspector` -> `admin`

### Page: /auth/role-select
Purpose:
- Choose role: Household / Verified Reseller / Volunteer Inspector.

UI components:
- Role cards with description
- Confirm role button

API calls:
- PATCH /api/users/profile (role)

## 4.2 OTP Verification

### Page: /auth/otp-request
Purpose:
- Request OTP to phone.

UI components:
- Country code + phone number input
- Request OTP button
- resend timer

API calls:
- POST /api/auth/request-otp

### Page: /auth/otp-verify
Purpose:
- Verify OTP and create authenticated session.

UI components:
- 6-digit OTP input
- Verify button
- Resend OTP action
- Email input
- Login/signup purpose toggle

API calls:
- POST /api/auth/request-otp
- POST /api/auth/verify-otp

## 4.3 Profile and KYC-lite Verification

### Page: /onboarding/profile
Purpose:
- Collect name and basic details.

UI components:
- Name input
- Alternate contact (optional)
- Save and continue

API calls:
- PATCH /api/users/profile

### Page: /onboarding/address
Purpose:
- Capture address and PIN code.

UI components:
- Address text area
- PIN code input
- Verify pin button

API calls:
- POST /api/verification/pin-verify
- PATCH /api/users/profile (if storing locality fields)

### Page: /onboarding/id-upload (optional)
Purpose:
- Upload optional ID proof for stronger trust.

UI components:
- File upload (front/back)
- Consent checkbox
- Submit for review

API calls:
- POST /api/verification/id-upload

### Page: /verification/status
Purpose:
- Show verification timeline and current status.

UI components:
- Phone verification status chip
- PIN verification status chip
- ID review status chip

API calls:
- GET /api/auth/me
- GET /api/trust/me

## 4.4 Trust and Badge Visibility

### Page: /trust/me
Purpose:
- User sees own trust score breakdown.

UI components:
- Trust score meter (0 to 100)
- Breakdown cards:
  - success rate
  - safety completion
  - dispute rate
  - response speed
- badge strip

API calls:
- GET /api/trust/me

### Page: /trust/:userId
Purpose:
- Public trust card while viewing provider/requester profile.

UI components:
- User basic info
- Trust score
- badges
- recent reliability indicators

API calls:
- GET /api/trust/user/:id

### Page: /badges
Purpose:
- Explain badge meaning and how to earn each.

UI components:
- Badge card list
- Current progress indicators

API calls:
- GET /api/trust/me

## 4.5 Trust-Aware Exchange Pages

### Page: /providers/nearby
Purpose:
- Show nearby providers sorted by trust + distance.

UI components:
- Map/list toggle
- Trust score pill
- badge chips
- estimated response time

API calls:
- existing provider listing API
- GET trust summary per listed provider

### Page: /provider/:userId
Purpose:
- Detailed provider profile before requesting exchange.

UI components:
- verification status
- trust score trend
- badges
- recent completion statistics
- request button

API calls:
- provider profile API
- GET /api/trust/user/:id

### Page: /exchange/:exchangeId/safety-check
Purpose:
- Mandatory checklist before completion.

UI components:
- checkbox list for safety steps
- photo upload optional
- dual confirmation section

API calls:
- existing exchange safety endpoints
- POST /api/internal/exchange-completed (backend-internal trigger)

## 4.6 Disputes and Moderation

### Page: /disputes/new/:exchangeId
Purpose:
- Raise issue against exchange.

UI components:
- reason dropdown
- details text area
- submit complaint

API calls:
- POST /api/disputes

### Page: /disputes
Purpose:
- User sees disputes raised by or against them.

UI components:
- status tabs (open, under_review, resolved)
- dispute cards with timeline

API calls:
- GET /api/disputes

### Page: /disputes/:id
Purpose:
- Detailed dispute thread and resolution state.

API calls:
- GET /api/disputes
- PATCH /api/disputes/:id (authorized roles)

## 4.7 Inspector/Admin Pages

### Page: /inspector/review-queue
Purpose:
- Volunteer inspector sees pending ID verifications.

UI components:
- queue table
- quick approve/reject buttons

API calls:
- GET verification queue endpoint

### Page: /inspector/review/:verificationId
Purpose:
- Review single verification submission.

API calls:
- POST /api/verification/id-review

### Page: /admin/trust-dashboard
Purpose:
- System health and trust analytics view.

UI components:
- suspicious user flags
- low safety users
- high dispute users
- score distribution charts

API calls:
- admin analytics endpoints

## 5. Reusable UI Components Needed
- RoleCard
- OtpInput
- VerificationStatusChip
- TrustScoreMeter
- BadgeChip
- SafetyChecklistCard
- DisputeStatusPill
- TrustBreakdownCard

## 6. Frontend State Model (Suggested)

Auth state:
- user
- accessToken
- role
- isPhoneVerified

Trust state:
- trustScore
- metricsBreakdown
- badges
- verificationStatus

Moderation state:
- disputes
- pendingReviews (inspector/admin)

## 7. API Integration Contracts (Minimum)

Auth client methods:
- requestOtp(phone)
- verifyOtp(phone, otp)
- me()

Verification client methods:
- verifyPin(pinCode, address)
- uploadId(file)
- reviewId(verificationId, decision)

Trust client methods:
- getMyTrust()
- getUserTrust(userId)

Dispute client methods:
- createDispute(payload)
- listDisputes()
- updateDispute(id, payload)

## 8. Frontend Build Order (Recommended)
1. Auth + OTP pages
2. Role select + profile + address verification
3. Trust profile and badge UI
4. Trust-aware nearby providers and provider profile
5. Safety checklist page
6. Dispute pages
7. Inspector/admin pages

## 9. MVP Page Set (If Time Is Limited)
Must-have pages:
- /auth
- /auth/otp-request
- /auth/otp-verify
- /onboarding/role-select
- /onboarding/address
- /trust/me
- /providers/nearby
- /exchange/:exchangeId/safety-check
- /disputes/new/:exchangeId

This page set is enough to validate the community trust layer in production-like pilot testing.
