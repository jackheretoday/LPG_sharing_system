# Role-Based Route Guards Guide

## Overview
Role-based route guards have been implemented to protect trust pages from unauthorized access. Two guard components handle different protection levels:

1. **AuthenticatedRoute** - Protects pages requiring any authenticated user
2. **ProtectedRoute** - Protects pages requiring specific roles (e.g., admin)

---

## How to Test Route Guards

### Setup
1. Ensure frontend dev server is running on `http://localhost:5175`
2. Trust pages are located at:
   - `/auth/login` - Login page (no guards)
   - `/trust/me` - User profile (authentication required)
   - `/admin/disputes` - Admin panel (admin role required)

### Test Case 1: Access Protected Page Without Authentication

**Steps:**
1. Open `http://localhost:5175/trust/me` in a new incognito window
2. Or clear localStorage: `localStorage.clear()` in console

**Expected Behavior:**
- Screen shows "Verifying access..." briefly
- User is automatically redirected to `/auth/login`
- Token is not present in localStorage

**Why:** `AuthenticatedRoute` checks for token in localStorage. No token → redirect to login.

---

### Test Case 2: Access Protected Page With Authentication

**Steps:**
1. Go to `http://localhost:5175/auth/login`
2. Sign up or login with test credentials:
   - Email: `test@example.com`
   - Password: `password123`
   - Role: `consumer` or `mechanic`
3. After login, token is auto-stored in localStorage (key: `trust_token`)
4. Navigate to `http://localhost:5175/trust/me`

**Expected Behavior:**
- Page loads immediately with "Verifying access..." message
- Trust profile page displays user data
- Navigation bar shows all accessible pages

**Why:** `AuthenticatedRoute` finds token in localStorage → access granted.

---

### Test Case 3: Non-Admin Tries to Access Admin Page

**Steps:**
1. Login as regular user (role: `consumer` or `mechanic`)
2. Try to access `http://localhost:5175/admin/disputes`
3. Or click the admin link if visible in navigation

**Expected Behavior:**
- Screen shows "Verifying access..." briefly
- After auth check completes, shows "Access Denied" message:
  ```
  Access Denied
  You don't have permission to access this page.
  
  [Go to Profile] button
  ```
- Clicking "Go to Profile" redirects to `/trust/me`
- Token remains in localStorage

**Why:** `ProtectedRoute` checks user role from localStorage. Role ≠ "admin" → redirect to user profile.

---

### Test Case 4: Admin User Accesses Admin Page

**Steps:**
1. Login with admin account (role: `admin`) 
2. Navigate to `http://localhost:5175/admin/disputes`

**Expected Behavior:**
- Admin Dispute Panel loads successfully
- List of disputes displays
- Action buttons (Mark Under Review, Resolve, Reject) are functional
- Full admin functionality available

**Why:** `ProtectedRoute` verifies role matches "admin" → access granted.

---

## Protected Pages Summary

### Authentication-Protected (AuthenticatedRoute)
All of these require any valid user token:

| Page | Route | Role Required |
|------|-------|:--:|
| OTP Verification | `/auth/otp-verify` | Any |
| Profile Setup | `/onboarding/setup` | Any |
| Trust Profile | `/trust/me` | Any |
| Nearby Providers | `/providers/nearby` | Any |
| Provider Details | `/provider/:id` | Any |
| Raise Dispute | `/disputes/new/:id` | Any |
| Disputes List | `/disputes` | Any |
| Dispute Details | `/disputes/:id` | Any |

### Admin-Protected (ProtectedRoute with role="admin")

| Page | Route | Role Required |
|------|-------|:--:|
| Admin Disputes | `/admin/disputes` | `admin` |

### Unprotected
- Login/Signup: `/auth/login` (no guards, required for entry)

---

## Implementation Details

### Component Files

**`frontend/src/components/trust/AuthenticatedRoute.tsx`**
```typescript
// Checks if user has valid token
// Redirects to /auth/login if missing
// Shows "Verifying access..." during check
export function AuthenticatedRoute({ children }: AuthenticatedRouteProps)
```

**`frontend/src/components/trust/ProtectedRoute.tsx`**
```typescript
// Checks if user is authenticated + has required role
// Redirects to /auth/login if not authenticated
// Redirects to /trust/me if role doesn't match
// Shows "Access Denied" message for role mismatch
// Shows "Verifying access..." during check
export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps)
```

### Where Guards Are Applied

Each protected page is wrapped like:
```typescript
// Example: TrustProfile.tsx

function TrustProfileContent() {
  // Page logic here
  return <div>...page content...</div>;
}

export default function TrustProfile() {
  return (
    <AuthenticatedRoute>
      <TrustProfileContent />
    </AuthenticatedRoute>
  );
}
```

Or for admin pages:
```typescript
// Example: AdminDisputes.tsx

function AdminDisputesContent() {
  // Page logic here
  return <div>...admin content...</div>;
}

export default function AdminDisputes() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDisputesContent />
    </ProtectedRoute>
  );
}
```

---

## localStorage Key Reference

| Key | Type | Purpose |
|-----|------|---------|
| `trust_token` | string | JWT token for API authentication |
| `trust_user` | JSON | User object with name, email, role |

Example `trust_user` structure:
```json
{
  "id": "user-123",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "admin" // or "consumer" or "household" etc.
}
```

---

## Debugging Route Guards

### Check If Token Exists
In browser console:
```javascript
// View token
localStorage.getItem('trust_token')

// View user
JSON.parse(localStorage.getItem('trust_user'))

// Clear all (for testing unauthenticated state)
localStorage.clear()
```

### Common Issues

**Issue:** Stuck on "Verifying access..."
- **Solution:** 
  - Check browser console for errors
  - Verify API is running on http://localhost:5000
  - Check localStorage for token (`console.log(localStorage)`)

**Issue:** Logged-in user redirected to login page
- **Solution:**
  - Token may have expired
  - Check localStorage for valid `trust_token`
  - Try logging in again

**Issue:** Admin can't access admin page
- **Solution:**
  - Check that user role in localStorage is `"admin"` (case-sensitive)
  - Verify `ProtectedRoute requiredRole="admin"` in AdminDisputes.tsx
  - Check console for any TypeScript errors

---

## UX Flow Diagrams

### Unauthenticated User Flow
```
User → Protected Page → Check Token? 
                           ↓ No
                       "Verifying..."
                           ↓
                       Redirect to Login
                           ↓
                       Login Page
```

### Regular User → Admin Page Flow
```
User → Admin Page → Check Auth? ✓
                        ↓
                    Check Role?
                        ↓ Not Admin
                    "Verifying..."
                        ↓
                    "Access Denied"
                        ↓
                    [Go to Profile]
                        ↓
                    User Profile Page
```

### Admin User → Admin Page Flow
```
User → Admin Page → Check Auth? ✓
                        ↓
                    Check Role? ✓
                        ↓
                    Admin Page Content
                        ↓
                    Full Functionality
```

---

## Build Status
✅ **Build Passing** - 3778 modules, 897.40 kB bundle
✅ **No TypeScript Errors** - All protected pages validated
✅ **Routes Verified** - All 10 trust routes accessible at HTTP 200

---

## Next Steps

### Recommended Enhancements
1. ✅ Add route guards (COMPLETED)
2. Add loading skeleton screens while auth checks
3. Highlight active route in TrustRouteBar
4. Add logout confirmation modal
5. Implement token refresh mechanism
6. Add 404 page for invalid routes

### Future Admin Features
- Add user management page
- Add badge management interface
- Add verification review queue
- Add dispute resolution workflow
