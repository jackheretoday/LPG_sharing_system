# LPG Prediction System - Quick Reference

## 📍 File Locations & Navigation Map

### **Frontend: Where to Find the LPG Page**

**Main LPG Page:**
```
frontend/src/pages/LPGPredictionPage.tsx
  ├─ Dashboard with model metrics
  ├─ Imports LPGTracker component
  ├─ Imports LPGAlertNotification
  └─ Shows historical performance data
```

**How to access in browser:**
```
http://localhost:5173/lpg-prediction
or
http://localhost:5173/dashboard/lpg
```

**Add to your routing (e.g., App.tsx):**
```tsx
import { LPGPredictionPage } from './pages/LPGPredictionPage';

<Route path="/lpg-prediction" element={<LPGPredictionPage />} />
```

---

### **Frontend Components**

```
frontend/src/components/
├── LPGTracker.tsx (600+ lines)
│   ├─ Cylinder management UI
│   ├─ Daily usage logging
│   ├─ Prediction display
│   ├─ Alert viewing
│   ├─ Responsive design
│   └─ Uses lpgApi for backend calls
│
└── LPGAlertNotification.tsx
    ├─ Floating bell icon
    ├─ Unread alert count
    ├─ Real-time polling (60s interval)
    └─ Alert management
```

**Frontend API Client:**
```
frontend/src/lib/lpgApi.ts (200+ lines)
  ├─ 13 original functions
  ├─ 4 new feedback functions
  └─ All type-safe TypeScript
```

---

### **Backend API Structure**

```
Total Endpoints: 17

Cylinders:      5 endpoints
Usage:          2 endpoints
Predictions:    2 endpoints
Alerts:         2 endpoints
Alert Config:   2 endpoints
Feedback:       3 endpoints  ← NEW
Metrics:        1 endpoint   ← NEW
```

**All accessible at:** `http://localhost:5000/api/lpg/*`

---

### **Database Tables (7 Total)**

```
Existing (5):
├── lpg_cylinders              [Cylinder data]
├── lpg_daily_usage            [Usage history]
├── lpg_predictions            [Prediction results]
├── lpg_alert_config           [User preferences]
└── lpg_alerts                 [Alert log]

New (2):
├── lpg_prediction_feedback    [User feedback for training]
└── lpg_model_metrics          [Model performance tracking]
```

---

## 🎯 Quick Navigation for Users

### **Step 1: Login Page**
```
URL: http://localhost:5173/login
Alternative: http://localhost:5173/auth/login
Test Account: consumer@test.com / Test@123456
```

### **Step 2: Dashboard**
```
After login, redirect to dashboard
Add link in navbar: "/lpg-prediction"
```

### **Step 3: LPG Prediction Page**
```
URL: http://localhost:5173/lpg-prediction
Shows:
  • Model performance metrics (top)
  • How it works (info box)
  • LPG Tracker component (main section)
  • Model history table (bottom)
```

### **Step 4: Interact with Tracker**
```
On left panel:
  • Click cylinder to select
  • Click "+" to add new
  • View current weight

On main panel:
  • Enter usage amount → Log
  • Click "Predict" button
  • View predictions
  • See alerts

On bell icon (top right):
  • View all alerts
  • Mark as read
```

---

## 🧪 Test Data Quick Reference

### **Consumer Account (Full Test Data)**
```
Email: consumer@test.com
Password: Test@123456

Cylinders:
1. CYL-001-TEST    → 3.5 kg (LOW ⚠️)  → 7 days until empty
2. CYL-002-TEST    → 18.5 kg (GOOD ✅) → 50 days until empty

Alerts:
✗ Unread: 2
✗ Type: low_stock + reminder
✗ Cylinder: CYL-001-TEST

History:
✗ 30 days usage data for CYL-001
✗ 15 days usage data for CYL-002
```

### **Provider Account (Simple Test Data)**
```
Email: provider@test.com
Password: Test@123456

Cylinders:
1. CYL-PRV-001     → 15.0 kg → 35 days until empty

History:
✗ 10 days usage data
```

### **Admin Account (No LPG Data)**
```
Email: admin@test.com
Password: Test@123456

For testing admin functionality only
No pre-loaded LPG data
```

---

## 🔄 Complete User Flow

```
1. USER OPENS APP
   └─→ http://localhost:5173

2. LOGIN
   └─→ Email: consumer@test.com
   └─→ Password: Test@123456

3. NAVIGATE TO LPG
   └─→ Click "LPG Prediction" in nav
   └─→ OR go to /lpg-prediction

4. VIEW DASHBOARD
   └─→ See metrics at top
   └─→ See how-it-works box
   └─→ See LPGTracker component

5. SELECT CYLINDER
   └─→ Left panel: Select CYL-001-TEST
   └─→ Shows: 3.5 kg / 20 kg

6. VIEW PREDICTION
   └─→ Already exists from test data
   └─→ Shows: 7 days until Feb 25
   └─→ Confidence: 92%

7. SEE ALERTS
   └─→ Red banner at top
   └─→ Bell icon shows "2"
   └─→ Click bell to view

8. LOG MORE USAGE
   └─→ Enter 0.5 kg
   └─→ Click "Log"
   └─→ Saved to database

9. MAKE NEW PREDICTION
   └─→ Click "Predict Empty Date"
   └─→ Recalculates with new average
   └─→ Shows updated days remaining

10. CHECK MODEL METRICS
    └─→ At top of page
    └─→ Shows accuracy %, avg error

11. SUBMIT FEEDBACK (After prediction date)
    └─→ Actual date: Feb 26
    └─→ Accuracy: 95%
    └─→ Model updates
    └─→ Metrics improve
```

---

## 📊 What the Numbers Mean

### **Prediction Example**

```
Cylinder Status:
├─ Current Weight: 3.5 kg
├─ Max Capacity: 20 kg
└─ Usage: 30% of full

Prediction Calculation:
├─ Days of history: 30 days
├─ Total used: 15.3 kg
├─ Average per day: 0.51 kg
└─ Days remaining: 3.5 ÷ 0.51 = 6.86 ≈ 7 days

Alert Trigger:
├─ Threshold: 7 days (configurable)
├─ Predicted days: 7
├─ Alert: ✓ YES (7 ≤ 7)
└─ Status: 🔴 RED (urgent)

Confidence Score:
├─ Model accuracy: 92%
├─ Based on: Historical patterns
└─ Meaning: 92% confident in this prediction
```

### **Model Metrics Example**

```
Total Predictions: 15
├─ This means: System made 15 predictions total
│
Accurate Predictions: 14
├─ This means: 14 out of 15 were within ±2 days
│
Accuracy Rate: 93.3%
├─ Calculation: 14 ÷ 15 × 100 = 93.3%
│
Average Error: ±1.2 days
├─ Meaning: On average, predictions were off by 1.2 days
├─ Some early, some late
└─ Goal: Get this number as small as possible
```

---

## 🔌 API Call Examples

### **Make a Prediction**
```bash
POST http://localhost:5000/api/lpg/predict
Header: Authorization: Bearer {token}
Body: {
  "cylinder_id": "CYL-001"
}

Response: {
  "success": true,
  "data": {
    "predicted_empty_days": 7,
    "predicted_empty_date": "2024-02-25",
    "daily_avg_usage_kg": 0.51,
    "confidence_score": 0.92,
    "alert_triggered": true
  }
}
```

### **Submit Feedback**
```bash
POST http://localhost:5000/api/lpg/feedback
Header: Authorization: Bearer {token}
Body: {
  "prediction_id": "uuid-123",
  "actual_empty_date": "2024-02-26",
  "accuracy_percentage": 95,
  "feedback_message": "Very accurate!"
}

Response: {
  "success": true,
  "data": {
    "was_accurate": true,
    "actual_days_difference": 1
  },
  "analysis": {
    "message": "Prediction was accurate! Empty date was 1 day later..."
  }
}
```

### **Get Model Metrics**
```bash
GET http://localhost:5000/api/lpg/metrics/model
Header: Authorization: Bearer {token}

Response: {
  "success": true,
  "metrics": {
    "overall": {
      "totalPredictions": 15,
      "accuratePredictions": 14,
      "accuracy_percentage": "93.33",
      "average_error_days": "1.20"
    },
    "historical": [...]
  }
}
```

---

## 📝 Key Concepts Explained Simply

### **Prediction Accuracy**
```
What is it?
  → Does the prediction come true?
  
How we measure:
  → If predicted Feb 25 and actually Feb 26 = Accurate! (within ±2 days)
  → If predicted Feb 25 and actually Feb 28 = Inaccurate (> 2 days)
  
Why it matters:
  → User knows if they can trust the alerts
  → Model learns to improve
```

### **Alert Threshold**
```
What is it?
  → When to warn the user
  
Default: 7 days
  → Alert triggers when 7 days or less remaining
  
User can change it:
  → Settings: Set to 10 days for earlier warning
  → Or set to 3 days for last-minute alerts
```

### **Confidence Score**
```
What is it?
  → How sure is the model about this prediction?
  
Range: 0-100%
  → 95% = Very confident
  → 70% = Less confident
  
When it's lower:
  → Not enough historical data
  → Usage patterns inconsistent
  → Model training needed
```

---

## 🚀 Deployment Checklist

Before going live:

```
Backend:
  ☐ All 4 migrations applied
  ☐ Environment variables set
  ☐ HTTPS enabled
  ☐ Rate limiting configured

Frontend:
  ☐ LPGPredictionPage added to routes
  ☐ Navigation links added
  ☐ API URL correctly set
  ☐ Built for production

Database:
  ☐ RLS policies verified
  ☐ Indexes created
  ☐ Backups enabled

Testing:
  ☐ Test account works
  ☐ Predictions display
  ☐ Alerts trigger
  ☐ Feedback submits
  ☐ Metrics calculate

Monitoring:
  ☐ Error logs setup
  ☐ API monitoring
  ☐ Database monitoring
  ☐ Alerts configured
```

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Page doesn't load | Check route added to App.tsx |
| No test data | Run migration 003 in Supabase |
| Alerts not showing | Check alert_config enabled |
| Predictions always 0 | Need at least 1 day usage data |
| Model metrics empty | Submit feedback first |
| Can't login | Check test user seeded |

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| LPG_PREDICTION_SYSTEM.md | Complete technical docs |
| LPG_QUICK_START.md | 5-step quick setup |
| LPG_IMPLEMENTATION_SUMMARY.md | Architecture & diagrams |
| LPG_SETUP_INTEGRATION_GUIDE.md | Detailed integration (latest) |
| THIS FILE | Quick reference |

---

## ✅ You're All Set!

1. ✅ Backend implemented (17 endpoints)
2. ✅ Frontend implemented (LPGPredictionPage + components)
3. ✅ Database prepared (7 tables with migrations)
4. ✅ Test data ready (consumer@test.com)
5. ✅ Feedback system for model training
6. ✅ Metrics tracking for accuracy
7. ✅ Full documentation provided

**Next:** 
- Run migrations
- Start servers
- Access http://localhost:5173/lpg-prediction
- Test with consumer@test.com / Test@123456

Enjoy! 🎉
