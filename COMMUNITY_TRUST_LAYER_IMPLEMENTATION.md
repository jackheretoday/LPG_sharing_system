# Community LPG Sharing Product Blueprint

Last updated: 2026-04-16

## 1) Executive Summary

This blueprint defines a complete real-world model for community LPG sharing centered on:

1. Verified community LPG sharing
2. Emergency-first discovery of nearby extra cylinders
3. Mandatory safety workflow before transaction closure

The design below is fully aligned with the current repository structure and extends it with production-ready governance, anti-abuse controls, incentives, operations KPIs, and phased rollout.

## 2) Problem and Goals

### Problem

In many localities, households face LPG shortage emergencies, while nearby users may have surplus cylinders. Existing alternatives are often unsafe, slow, or exploitative during urgent demand spikes.

### Product Goals

1. Fulfill emergency LPG requests quickly and safely.
2. Build trust through verified identities, transparent scoring, and community governance.
3. Prevent unsafe exchanges, fraud listings, and price exploitation.
4. Create sustainable supply density locality by locality.

## 3) Core Product Pillars

### Pillar A: Community Trust Layer

User types:

1. Household
2. Verified Reseller
3. Volunteer Inspector

KYC-lite onboarding:

1. Phone OTP verification
2. Address pin verification
3. Optional ID upload and review

Trust scoring factors:

1. Successful exchange rate
2. Safety checklist completion rate
3. Dispute rate
4. Emergency response speed

Badges:

1. Verified Household
2. Safety Compliant
3. Fast Responder

### Pillar B: Smart Local Matching

1. Radius-based matching: 500m, 1km, 3km
2. Priority ranking:
	1. Closest provider
	2. Highest trust score
	3. Lowest price deviation from market median
3. Emergency mode:
	1. Show only currently available providers
	2. Highlight estimated pickup time under 30 minutes

### Pillar C: Safe Exchange Workflow

Mandatory exchange states:

1. Request created
2. Request accepted
3. Meet point confirmed
4. Delivery or pickup completed
5. Dual safety check completed
6. Transaction closed

Two-sided safety confirmation:

1. Receiver confirms no leak and proper regulator fit
2. Provider confirms handover condition

Proof requirements:

1. Photo proof at handover
2. Optional geo-tag and timestamp

## 4) Stakeholders and Role Permissions

### Household

1. Create emergency and normal requests
2. View nearby providers and trust metrics
3. Complete safety checklist and close transactions
4. Raise disputes

### Verified Reseller

1. Publish available cylinder listings
2. Accept requests and commit ETA
3. Complete provider-side safety confirmation
4. Respond to disputes

### Volunteer Inspector

1. Review optional ID documents
2. Moderate disputes and suspicious behavior
3. Flag unsafe accounts/listings

### Admin (platform role)

1. Trust override in exceptional cases
2. Suspension and restoration actions
3. Policy enforcement and audit trail oversight

## 5) End-to-End User Journeys

### Journey A: New Household Onboarding

1. Signup with phone and password (or OTP-first auth)
2. Verify OTP
3. Submit address pin and optional ID
4. Receive Verified Household badge after criteria met
5. Access nearby provider view

### Journey B: Emergency Request Fulfillment

1. User taps Panic: Need LPG now
2. System broadcasts request to top ranked nearby providers
3. First trusted provider accepts
4. Meet point confirmed
5. Handover completes with photos
6. Dual safety check complete
7. Transaction closed and trust metrics update

### Journey C: Escalation Path

1. No acceptance within 10 minutes
2. Radius auto-expands to next tier
3. Local trusted partners are notified
4. User receives updated ETA options

### Journey D: Dispute Path

1. User raises dispute with reason and evidence
2. Moderator or inspector reviews both sides
3. Resolution action applied
4. Trust metrics updated by outcome

## 6) Detailed Functional Scope

## 6.1 Community Trust Layer

Required features:

1. Role-aware onboarding and access
2. Trust score display on profiles, cards, and matching results
3. Badge engine with rule-based assignment
4. ID review queue for inspectors/admins

## 6.2 Smart Local Matching

Matching steps:

1. Filter by radius
2. Filter by availability window
3. Score each candidate
4. Return ranked list

Suggested scoring formula:

matching_score =
0.45 * distance_score +
0.35 * trust_score_normalized +
0.20 * price_fairness_score

Emergency mode modifiers:

1. Add ETA bonus for under-30-minute candidates
2. Penalize repeated no-show providers

## 6.3 Safe Exchange Workflow

Workflow hard rules:

1. No closure without both safety confirmations
2. No closure without handover proof
3. Every state transition writes an audit log

Safety checklist fields:

1. Leak test passed
2. Regulator fit confirmed
3. Seal condition acceptable
4. Ventilation check acknowledged
5. Photo captured

## 6.4 Emergency Features

1. Panic request type with highest scheduling priority
2. Multi-provider broadcast in ranked order
3. Auto-escalation timer and radius widening
4. Optional in-app emergency helpline

## 6.5 Community Governance

Area-group model:

1. Apartment cluster
2. Ward
3. Neighborhood

Local moderator actions:

1. Flag suspicious listings
2. Temporarily block risky users
3. Fast dispute resolution for community scope

Reporting categories:

1. Price exploitation
2. Unsafe cylinder
3. No-show behavior
4. Fraud listing

## 6.6 Fair Use and Abuse Prevention

1. Daily active listing limits per user
2. Emergency pricing guardrails
3. Cooldown for repeated fake or failed requests
4. Device + phone + behavior risk checks
5. OTP and action rate limiting

## 6.7 Incentive System

Points sources:

1. Successful emergency support
2. High safety compliance streak
3. Low dispute and high reliability behavior

Redemption:

1. Priority visibility
2. Partner discounts
3. Badge upgrades and trust boosts (policy-limited)

Social proof:

1. Locality leaderboard (monthly)
2. Top responder spotlight

## 6.8 Real-World Partnerships

Anchor partners:

1. Resident Welfare Associations
2. Small LPG distributors
3. NGO and community kitchens

Partner roles:

1. Emergency fallback inventory points
2. Trust anchors for low-participation localities
3. Community education and safety campaigns

## 7) Product Modules Mapped to Current Repo

### Frontend modules in current app

Already present pages and roles include:

1. Trust auth and onboarding pages
2. Trust profile and provider views
3. Disputes flow pages
4. Admin moderation pages:
	1. ID review queue
	2. Trust override
	3. Suspension actions

### Backend modules in current app

Current route modules already support:

1. Auth and OTP
2. Verification and ID review queue
3. Trust profile, provider list, recompute, override
4. Disputes create/list/update
5. Internal exchange and emergency event logging

## 8) MVP Feature Set

### MVP-In (must ship)

1. Role-based onboarding (Household, Verified Reseller, Volunteer Inspector)
2. OTP + address pin verification
3. Provider discovery with radius and trust-first ranking
4. Emergency request flow with broadcast and acceptance
5. Safe exchange flow with dual checklist and photo proof
6. Dispute creation and admin or inspector moderation
7. Trust score and badge display
8. Basic anti-abuse guardrails

### MVP-Out (post-MVP)

1. Fully automated KYC vendor integrations
2. Advanced fraud ML models
3. Predictive shortage alerts by locality
4. AI safety advisor assistant

## 9) Complete Data Model and Schema Blueprint

Existing tables should be retained and extended. The blueprint below is the complete target model.

### 9.1 Identity and Trust Core

1. users
	1. id uuid pk
	2. name text
	3. phone text unique
	4. email text unique nullable
	5. role enum household or verified_reseller or volunteer_inspector or admin
	6. is_phone_verified bool
	7. is_suspended bool
	8. suspended_reason text nullable
	9. created_at timestamptz
	10. updated_at timestamptz

2. user_verifications
	1. id uuid pk
	2. user_id uuid fk users
	3. address_text text
	4. pin_code text
	5. is_pin_verified bool
	6. id_doc_url text nullable
	7. id_status enum not_submitted or pending or approved or rejected
	8. reviewed_by uuid fk users nullable
	9. reviewed_at timestamptz nullable
	10. created_at timestamptz

3. trust_metrics
	1. user_id uuid pk fk users
	2. total_exchanges int
	3. successful_exchanges int
	4. safety_checks_completed int
	5. disputes_count int
	6. accepted_emergency_requests int
	7. avg_response_seconds int
	8. trust_score int 0..100
	9. updated_at timestamptz

4. badges
	1. id uuid pk
	2. code text unique
	3. title text
	4. description text

5. user_badges
	1. user_id uuid fk users
	2. badge_id uuid fk badges
	3. granted_at timestamptz

### 9.2 Exchange and Request Domain

6. listings
	1. id uuid pk
	2. provider_user_id uuid fk users
	3. cylinder_type text
	4. quantity_available int
	5. price_per_unit numeric
	6. market_reference_price numeric
	7. price_deviation_percent numeric
	8. status enum active or paused or closed
	9. is_emergency_available bool
	10. locality_id uuid fk locality_clusters
	11. geohash text
	12. latitude numeric
	13. longitude numeric
	14. created_at timestamptz

7. requests
	1. id uuid pk
	2. requester_user_id uuid fk users
	3. request_type enum normal or emergency
	4. required_quantity int
	5. preferred_radius_meters int
	6. urgency_level int
	7. status enum created or broadcasted or accepted or meet_confirmed or fulfilled or closed or cancelled or expired
	8. locality_id uuid fk locality_clusters
	9. meet_point_lat numeric nullable
	10. meet_point_lng numeric nullable
	11. created_at timestamptz
	12. accepted_at timestamptz nullable
	13. closed_at timestamptz nullable

8. request_matches
	1. id uuid pk
	2. request_id uuid fk requests
	3. provider_user_id uuid fk users
	4. distance_meters int
	5. provider_trust_score int
	6. price_deviation_percent numeric
	7. eta_minutes int
	8. matching_score numeric
	9. rank_position int
	10. was_notified bool
	11. notified_at timestamptz nullable
	12. accepted bool
	13. accepted_at timestamptz nullable

9. exchanges
	1. id uuid pk
	2. request_id uuid fk requests
	3. requester_user_id uuid fk users
	4. provider_user_id uuid fk users
	5. final_quantity int
	6. final_price numeric
	7. status enum accepted or meet_confirmed or handover_done or safety_pending or completed or disputed or cancelled
	8. handover_photo_url text nullable
	9. completed_at timestamptz nullable

10. safety_checks
	1. id uuid pk
	2. exchange_id uuid fk exchanges
	3. actor_user_id uuid fk users
	4. actor_role text
	5. no_leak_confirmed bool
	6. regulator_fit_confirmed bool
	7. seal_condition_ok bool
	8. ventilation_ack bool
	9. photo_url text nullable
	10. submitted_at timestamptz

### 9.3 Governance and Abuse

11. disputes
	1. id uuid pk
	2. exchange_id uuid fk exchanges
	3. raised_by uuid fk users
	4. against_user_id uuid fk users
	5. reason text
	6. category enum price_exploitation or unsafe_cylinder or no_show or fraud_listing or other
	7. status enum open or under_review or resolved or rejected
	8. resolved_by uuid fk users nullable
	9. resolved_at timestamptz nullable
	10. created_at timestamptz

12. moderation_actions
	1. id uuid pk
	2. actor_user_id uuid fk users
	3. target_user_id uuid fk users nullable
	4. target_listing_id uuid fk listings nullable
	5. action_type enum flag_listing or suspend_user or unsuspend_user or trust_override or warning
	6. reason text
	7. metadata jsonb
	8. created_at timestamptz

13. abuse_signals
	1. id uuid pk
	2. user_id uuid fk users
	3. signal_type enum otp_failures or repeated_no_show or fake_request_pattern or device_risk
	4. signal_value numeric
	5. risk_score numeric
	6. observed_at timestamptz

14. pricing_guardrails
	1. locality_id uuid fk locality_clusters
	2. market_price numeric
	3. max_emergency_markup_percent numeric
	4. updated_at timestamptz

### 9.4 Community and Incentives

15. locality_clusters
	1. id uuid pk
	2. name text
	3. type enum apartment or ward or neighborhood
	4. city text
	5. state text

16. area_groups
	1. id uuid pk
	2. locality_id uuid fk locality_clusters
	3. group_name text
	4. created_by uuid fk users
	5. created_at timestamptz

17. group_members
	1. group_id uuid fk area_groups
	2. user_id uuid fk users
	3. group_role enum member or moderator
	4. joined_at timestamptz

18. points_ledger
	1. id uuid pk
	2. user_id uuid fk users
	3. event_type enum emergency_support or safety_bonus or reliability_bonus or redemption
	4. points_delta int
	5. balance_after int
	6. reference_id uuid nullable
	7. created_at timestamptz

19. leaderboards
	1. id uuid pk
	2. locality_id uuid fk locality_clusters
	3. month_key text
	4. user_id uuid fk users
	5. reliability_score numeric
	6. rank int

20. partner_orgs
	1. id uuid pk
	2. locality_id uuid fk locality_clusters
	3. org_type enum rwa or distributor or ngo or community_kitchen
	4. name text
	5. contact_phone text
	6. emergency_support_enabled bool

21. audit_logs
	1. id uuid pk
	2. actor_user_id uuid fk users nullable
	3. action text
	4. entity_type text
	5. entity_id text
	6. details jsonb
	7. created_at timestamptz

## 10) Trust Score and Badge Engine

### Trust score formula (MVP)

success_rate = successful_exchanges / max(total_exchanges, 1)
safety_rate = safety_checks_completed / max(total_exchanges, 1)
response_speed_score = clamp(1 - avg_response_seconds / 1800, 0, 1)
dispute_score = clamp(1 - disputes_count / max(total_exchanges, 1), 0, 1)

trust_score = round((0.40*success_rate + 0.25*safety_rate + 0.20*response_speed_score + 0.15*dispute_score) * 100)

### Badge rules

1. Verified Household:
	1. role = household
	2. phone verified true
	3. pin verified true
2. Safety Compliant:
	1. total_exchanges >= 10
	2. safety completion rate >= 0.95
3. Fast Responder:
	1. accepted_emergency_requests >= 10
	2. avg_response_seconds <= 300

## 11) API Blueprint

The endpoints below include currently implemented and required extensions.

### 11.1 Auth and Identity

Current:

1. POST /api/auth/signup
2. POST /api/auth/login
3. POST /api/auth/request-otp
4. POST /api/auth/verify-otp
5. GET /api/auth/me
6. GET /api/auth/admins
7. DELETE /api/auth/users/:id
8. PATCH /api/auth/users/:id/suspension

Recommended additions:

1. PATCH /api/users/profile
2. GET /api/users/:id/public-profile

### 11.2 Verification

Current:

1. POST /api/verification/pin-verify
2. POST /api/verification/id-upload
3. GET /api/verification/id-review-queue
4. POST /api/verification/id-review

### 11.3 Trust and Providers

Current:

1. GET /api/trust/me
2. GET /api/trust/user/:id
3. GET /api/trust/providers
4. POST /api/trust/recompute/:userId
5. PATCH /api/trust/override/:userId

Recommended additions:

1. GET /api/trust/leaderboard?localityId=...&month=...

### 11.4 Requests and Matching (new required)

1. POST /api/requests
2. GET /api/requests/:id
3. GET /api/requests?status=...&type=...
4. POST /api/requests/:id/broadcast
5. POST /api/requests/:id/escalate
6. GET /api/requests/:id/matches
7. POST /api/requests/:id/accept (provider)
8. POST /api/requests/:id/meet-point
9. POST /api/requests/:id/cancel

### 11.5 Exchanges and Safety (new required)

1. POST /api/exchanges/:id/handover
2. POST /api/exchanges/:id/safety-check/requester
3. POST /api/exchanges/:id/safety-check/provider
4. POST /api/exchanges/:id/close

Current internal hooks already present:

1. POST /api/internal/exchange-completed
2. POST /api/internal/emergency-response-logged

### 11.6 Disputes and Governance

Current:

1. POST /api/disputes
2. GET /api/disputes
3. PATCH /api/disputes/:id

Recommended additions:

1. POST /api/reports
2. GET /api/moderation/actions
3. POST /api/moderation/flag-listing

### 11.7 Incentives and Partnerships (new required)

1. GET /api/points/me
2. GET /api/leaderboard?locality=...&month=...
3. GET /api/partners/nearby

## 12) UI Screen List Mapped to Current Frontend

### 12.1 Already present in current app

General:

1. / (Landing)
2. /auth (combined auth)
3. /emergency
4. /tracking
5. /chat
6. /community, /community/create, /community/post/:id

Role hubs:

1. /admin
2. /user
3. /consumer

Trust layer:

1. /auth/login
2. /auth/otp-verify
3. /onboarding/setup
4. /trust/me
5. /providers/nearby
6. /provider/:id
7. /disputes/new/:exchangeId
8. /disputes
9. /disputes/:id
10. /admin/disputes

Admin moderation:

1. /admin/id-review-queue
2. /admin/trust-override
3. /admin/suspensions
4. /admin/profile

### 12.2 Screens to add next (for complete community blueprint)

1. Request creation wizard
	1. Normal request
	2. Panic emergency request
2. Match result list with ranking rationale
3. Live exchange tracker with step state timeline
4. Dual safety checklist submission screens
5. Handover proof upload and preview screen
6. Emergency escalation status screen
7. Area group membership and moderator panel
8. Reporting categories quick-submit sheet
9. Points wallet and redemption screen
10. Locality leaderboard screen
11. Partner anchor directory screen
12. Operations dashboard screen for admin

## 13) Operations Dashboard (KPI Spec)

Track, graph, and alert on:

1. Average emergency fulfillment time
2. Percent transactions completed with full safety checklist
3. Failed request causes (no provider, timeout, no-show, cancelled)
4. Active provider density by locality
5. Repeat user rate (30-day and 90-day)
6. Dispute frequency and median resolution time
7. Price exploitation incident rate
8. Emergency escalation rate and success after escalation

## 14) Rollout Plan

### Phase 1: Closed Pilot (single neighborhood)

1. Invite-only households and known resellers
2. Enable core trust onboarding
3. Validate emergency request and matching latency

### Phase 2: Safety and Dispute Hardening

1. Enforce dual safety + photo proof
2. Launch dispute and moderation flow
3. Tune trust score weights

### Phase 3: Area-wise Expansion

1. Add locality groups and moderators
2. Add anti-abuse and fair pricing guardrails
3. Begin partnership integration in low-density areas

### Phase 4: Intelligence Layer

1. AI Safety Advisor
2. Predictive shortage alerts
3. Dynamic demand-supply balancing by locality

## 15) Architecture and Implementation Notes

### Backend layering (aligned to current structure)

1. routes: endpoint contracts
2. controllers: request orchestration and auth checks
3. services: trust engine, matching engine, moderation logic
4. models or stores: persistence adapters
5. middleware: auth, role gating, rate limits, input validation

### Frontend layering

1. pages: route-level user journeys
2. components: reusable cards, timeline, badges, safety checklist
3. lib: API client and auth session helpers
4. role hubs: dynamic state cards backed by APIs

## 16) Quality and Testing Blueprint

### 16.1 Unit tests

1. Trust score calculation
2. Badge assignment rules
3. Match ranking logic
4. Pricing guardrail checks
5. escalation timer logic

### 16.2 API tests

1. OTP lifecycle
2. Verification and review queue
3. Provider listing and trust endpoint consistency
4. Request -> match -> accept -> close workflow
5. Dispute and moderation actions

### 16.3 Integration and E2E

1. Emergency panic flow under simulated low-supply
2. Dual safety failure path (closure blocked)
3. No-provider escalation path
4. Suspended-user behavior checks

### 16.4 Security tests

1. Role bypass attempts
2. OTP abuse and brute-force limits
3. Signed URL and document access control
4. Audit integrity for moderation actions

## 17) Risks and Mitigations

1. Low supply density in early phase
	1. Mitigation: trusted partner anchors + localized onboarding drives
2. Unsafe behavior during urgency
	1. Mitigation: hard workflow gates for safety closure
3. Price spikes in emergencies
	1. Mitigation: dynamic guardrails and moderation alerts
4. Fake users and listings
	1. Mitigation: multi-signal abuse scoring and cooldowns
5. Slow dispute handling
	1. Mitigation: locality moderators + SLA dashboards

## 18) Launch Checklist

### Product readiness

1. Emergency flow tested across all status transitions
2. Dual safety checks enforced by backend
3. Trust and badges visible in all matching surfaces

### Governance readiness

1. Moderator playbook defined
2. Reporting categories and suspension policy configured
3. Audit logs enabled for all critical actions

### Operations readiness

1. KPI dashboard live
2. Escalation alerts configured
3. Partner response roster active

## 19) Immediate Next Build Actions for This Repo

1. Add request, matching, exchange, safety tables and APIs.
2. Add emergency panic request UI and live exchange state timeline pages.
3. Implement auto-escalation worker for 10-minute no-accept cases.
4. Add reporting and moderation categories to disputes flow.
5. Add points ledger, locality leaderboard, and partner directory pages.

This document is the complete implementation blueprint for turning the current trust layer into a production-ready community LPG sharing platform.
