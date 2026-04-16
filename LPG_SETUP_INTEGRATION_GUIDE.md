# LPG Prediction System - Complete Setup & Integration Guide

## 📍 Where to Find Everything

### Backend Files Location
```
backend/
├── controllers/
│   ├── lpgController.js              ← Cylinder & prediction handlers
│   └── lpgFeedbackController.js      ← NEW: Feedback & metrics handlers
├── routes/
│   └── lpgRoutes.js                  ← All 17 LPG endpoints
├── services/
│   └── lpgService.js                 ← Prediction engine & alerts
├── migrations/
│   ├── 002_add_lpg_prediction_tables.sql
│   ├── 003_seed_lpg_test_data.sql    ← NEW: Test data
│   └── 004_add_prediction_feedback_tables.sql  ← NEW: Feedback tables
└── models/
    └── lpg_prediction_model.pkl      ← ML model file
```

### Frontend Files Location
```
frontend/src/
├── pages/
│   └── LPGPredictionPage.tsx         ← NEW: Main LPG page with dashboard
├── components/
│   ├── LPGTracker.tsx                ← Cylinder & prediction UI
│   └── LPGAlertNotification.tsx       ← Alert notification bell
└── lib/
    └── lpgApi.ts                     ← API client with feedback functions
```

---

## 🚀 Step-by-Step Setup

### Step 1: Apply Database Migrations

Run these SQL migrations in your Supabase SQL Editor (in order):

#### 1a. Base LPG Tables
```bash
# File: backend/migrations/002_add_lpg_prediction_tables.sql
# Contains: lpg_cylinders, lpg_daily_usage, lpg_predictions, 
#           lpg_alert_config, lpg_alerts
```

#### 1b. Test Data Seeding
```bash
# File: backend/migrations/003_seed_lpg_test_data.sql
# Contains: Sample cylinders, 30 days usage history, predictions, alerts
# For users: consumer@test.com, provider@test.com, john@test.com
```

#### 1c. Feedback & Metrics Tables
```bash
# File: backend/migrations/004_add_prediction_feedback_tables.sql
# Contains: lpg_prediction_feedback, lpg_model_metrics
# For tracking prediction accuracy and model performance
```

**To execute:**
1. Open Supabase dashboard → SQL Editor
2. Copy each migration file content
3. Run them in order (003 depends on 002, 004 is independent but completes setup)

### Step 2: Backend is Already Updated ✅

The backend server.js already includes LPG routes:
```javascript
const lpgRoutes = require("./routes/lpgRoutes");
app.use("/api/lpg", lpgRoutes);
```

**Just restart backend:**
```bash
cd backend
npm start
```

### Step 3: Integrate Frontend Pages & Routes

#### Option A: React Router Setup

In your `frontend/src/App.tsx` or routing file:

```tsx
import { LPGPredictionPage } from './pages/LPGPredictionPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Other routes... */}
        <Route path="/lpg-prediction" element={<LPGPredictionPage />} />
        <Route path="/dashboard/lpg" element={<LPGPredictionPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

#### Option B: Add to Navigation

Add link in your main Navbar/Navigation component:

```tsx
<NavLink to="/lpg-prediction" className="nav-item">
  🔥 LPG Prediction
</NavLink>

// Or use dropdown
<DropdownMenu>
  <DropdownItem href="/dashboard">Dashboard</DropdownItem>
  <DropdownItem href="/lpg-prediction">LPG Tracker</DropdownItem>
  <DropdownItem href="/lpg-history">Usage History</DropdownItem>
</DropdownMenu>
```

### Step 4: Start the Application

```bash
# Terminal 1: Backend
cd backend
npm start
# Output should show: ✅ Test users seeded successfully!

# Terminal 2: Frontend
cd frontend
npm run dev
# Should run on http://localhost:5173
```

---

## 🧪 Test Data & Credentials

### Test User Accounts

All with password: `Test@123456`

```
1. Consumer (Main User)
   Email: consumer@test.com
   Role: consumer

2. Provider
   Email: provider@test.com
   Role: provider

3. Admin
   Email: admin@test.com
   Role: admin

4. John (Extra Consumer)
   Email: john@test.com
   Role: consumer
```

### Pre-Loaded Test Data

**Consumer@test.com has:**

#### Cylinder 1: CYL-001-TEST (⚠️ LOW - Will Trigger Alert)
- Current: 3.5 kg
- Capacity: 20 kg
- Status: Active
- 30 days of usage history
- Average usage: 0.51 kg/day
- **Prediction: ~7 days until empty** ← Alert triggers at this!
- **Has alerts:** Yes (2 unread)

#### Cylinder 2: CYL-002-TEST (✅ GOOD)
- Current: 18.5 kg
- Capacity: 20 kg
- Status: Active
- 15 days of usage history
- Average usage: 0.37 kg/day
- **Prediction: ~50 days until empty**
- **Has alerts:** No

**Provider@test.com has:**

#### Cylinder: CYL-PRV-001
- Current: 15.0 kg
- Capacity: 20 kg
- Status: Active
- 10 days of usage history
- **Prediction: ~35 days until empty**

---

## 🎯 How to Use the LPG Prediction System

### From The Frontend

#### 1. **Login**
```
Go to http://localhost:5173
Email: consumer@test.com
Password: Test@123456
```

#### 2. **Navigate to LPG Prediction**
```
Click on "LPG Prediction" in navigation
URL: http://localhost:5173/lpg-prediction
```

#### 3. **View Dashboard**
You'll see:
- Model performance metrics (total predictions, accuracy %)
- Cylinder list on the left
- Main prediction panel on the right
- Alert notifications (bell icon)

#### 4. **Test Features**

**A. View Existing Prediction**
- Click on "CYL-001-TEST" (the low one)
- See the prediction: "7 days until empty"
- See the alerts in red banner

**B. Log New Usage**
- Click on a cylinder
- Enter usage amount (e.g., 0.5)
- Click "Log"
- This updates daily usage

**C. Make New Prediction**
- After logging usage, click "Predict Empty Date"
- System calculates: days = current_weight / avg_usage
- Saves prediction to database
- Shows alert if < 7 days

**D. View Alerts**
- Click bell icon (top right)
- Shows all unread alerts
- Click "Mark Read" to dismiss

#### 5. **Submit Prediction Feedback (For Model Training)**

After predicted date passes:

```tsx
// API Call example
const feedback = await lpgApi.submitPredictionFeedback(
  prediction_id,
  "2024-02-25",           // actual empty date
  95,                     // accuracy percentage (optional)
  "Worked perfectly!"     // message (optional)
);

// Response shows:
// - Was accurate or not
// - Days difference
// - Updated model metrics
```

This data trains the ML model!

---

## 🔌 API Endpoints (17 Total)

### Cylinder Management (5)
```
POST   /api/lpg/cylinders              Add cylinder
GET    /api/lpg/cylinders              Get all
GET    /api/lpg/cylinders/:id          Get one
PATCH  /api/lpg/cylinders/:id          Update
DELETE /api/lpg/cylinders/:id          Delete
```

### Daily Usage (2)
```
POST   /api/lpg/usage                  Log usage
GET    /api/lpg/usage/:cylinderId      Get history
```

### Predictions (2)
```
POST   /api/lpg/predict                Make prediction
GET    /api/lpg/predict/:cylinderId    Get latest
```

### Alerts (2)
```
GET    /api/lpg/alerts                 Get unread
PATCH  /api/lpg/alerts/:id             Mark as read
```

### Alert Config (2)
```
GET    /api/lpg/alert-config           Get settings
PATCH  /api/lpg/alert-config           Update settings
```

### Prediction Feedback (3)
```
POST   /api/lpg/feedback               Submit feedback
GET    /api/lpg/feedback               Get feedback history
GET    /api/lpg/feedback/pending       Get pending (expired) predictions
```

### Model Metrics (1)
```
GET    /api/lpg/metrics/model          Get performance metrics
```

---

## 💡 Understanding Predictions & Alerts

### How Prediction Works

1. **Get historical data** (last 30 days usage)
   ```
   Usage per day: [0.45, 0.52, 0.48, 0.55, ...]
   ```

2. **Calculate average**
   ```
   Average = sum of all / count
   Example: 15.3 kg / 30 days = 0.51 kg/day
   ```

3. **Make prediction**
   ```
   Current weight: 3.5 kg
   Days remaining: 3.5 / 0.51 = 6.86 days ≈ 7 days
   Empty date: today + 7 days
   ```

4. **Check if alert should trigger**
   ```
   if (predicted_days <= alert_threshold) {
     Create alert and notify user
   }
   ```

### When Alerts Trigger

Default threshold: **7 days**

```
Days Left | Alert Status
---------|-------------
  > 7    | ✅ Green (OK)
  5-7    | 🟡 Yellow (Soon)
  < 5    | 🔴 Red (Urgent)
```

---

## 📊 Model Training with Feedback

### The Feedback Loop

```
1. Prediction Made
   ↓
2. User waits for predicted date
   ↓
3. LPG actually empties (might be different date)
   ↓
4. User submits feedback:
   - Actual empty date
   - Accuracy rating
   - Additional notes
   ↓
5. System calculates:
   - Was prediction accurate?
   - What was the error?
   - Update model metrics
   ↓
6. Model Gets Better
   - Accuracy tracked
   - Error patterns identified
   - Model re-trained with new data
```

### Example Feedback Scenario

**Prediction:** CYL-001 will be empty on Feb 25

**Actual:** It was empty on Feb 26

**Feedback Submitted:**
```json
{
  "prediction_id": "uuid-123",
  "actual_empty_date": "2024-02-26",
  "accuracy_percentage": 95,
  "feedback_message": "Very close prediction!"
}
```

**System Analysis:**
```
Predicted: Feb 25
Actual: Feb 26
Difference: +1 day

Was Accurate: YES (within ±2 days)
Updated Metrics:
- Total: 15 predictions
- Accurate: 14
- Accuracy: 93.3%
- Avg Error: ±1.2 days
```

---

## 🗄️ Database Schema

### lpg_cylinders
Stores cylinder information

```
id: UUID
user_id: UUID (foreign key to users)
cylinder_id: TEXT (e.g., "CYL-001")
current_weight_kg: DECIMAL
max_capacity_kg: DECIMAL
status: ENUM ('active', 'critical', 'empty', etc)
last_refill_date: TIMESTAMP
notes: TEXT
```

### lpg_daily_usage
Tracks daily consumption

```
id: UUID
user_id: UUID
cylinder_id: UUID (foreign key)
usage_date: DATE
usage_kg: DECIMAL
usage_reason: TEXT (e.g., "cooking", "heating")
```

### lpg_predictions
Stores prediction results

```
id: UUID
user_id: UUID
cylinder_id: UUID
current_weight_kg: DECIMAL
daily_avg_usage_kg: DECIMAL
predicted_empty_days: INTEGER
predicted_empty_date: DATE
confidence_score: DECIMAL (0-1)
alert_status: BOOLEAN
```

### lpg_prediction_feedback
Tracks prediction accuracy

```
id: UUID
user_id: UUID
prediction_id: UUID (foreign key)
predicted_empty_days: INTEGER
actual_empty_date: DATE
actual_days_difference: INTEGER
was_accurate: BOOLEAN
feedback_message: TEXT
accuracy_percentage: DECIMAL
feedback_provided_at: TIMESTAMP
```

### lpg_model_metrics
Daily model performance

```
id: UUID
metric_date: DATE
total_predictions: INTEGER
accurate_predictions: INTEGER
average_accuracy_percentage: DECIMAL
average_error_days: DECIMAL
mae: DECIMAL
rmse: DECIMAL
```

---

## 🎨 In-App Messages & Alerts

### Alert Messages by Type

#### 1. Low Stock Alert
```
"Your LPG cylinder CYL-001-TEST will be empty in approximately 7 days.
Current level: 3.5 kg. Please schedule a refill soon!"
```

#### 2. Prediction Reminder
```
"Reminder: You should refill your cylinder in the next 3-4 days
based on your usage pattern."
```

#### 3. Critical Low
```
"⚠️ WARNING: Your LPG cylinder is critically low (< 2 kg).
Refill immediately!"
```

#### 4. Out of Stock
```
"Your LPG cylinder is empty. Please refill or contact supplier."
```

### Frontend Display

**Banner Alert** (at top of LPG Tracker)
```
If days < 3: Red background, large text
If days 3-7: Yellow background, medium text  
If days > 7: Green background, small text
```

**Notification Bell**
- Shows unread count
- Red dot if alerts exist
- Dropdown with full message
- Mark as read/dismiss option

**Inline Messages**
```
Prediction Display:
┌─────────────────────────┐
│ Days Remaining: 7       │  ← Large number in color
│ Empty Date: Feb 25      │
│ Daily Usage: 0.51 kg    │  
│ Confidence: 92%         │
└─────────────────────────┘

If days ≤ 7:
⚠️ Your cylinder is running low. Schedule a refill soon!
```

---

## 🔍 Testing the Complete Flow

### Test Scenario: Complete Prediction & Feedback Cycle

1. **Login** → `consumer@test.com` / `Test@123456`

2. **View Predictions**
   - Navigate to LPG Prediction page
   - See CYL-001-TEST with 7 days prediction
   - See alerts in red banner

3. **Log More Usage** (to see prediction update)
   ```
   Add 1.5 kg usage
   Prediction recalculates: 3.5 - 1.5 = 2.0 kg left
   Days: 2.0 / 0.51 ≈ 4 days
   Alert still shows (< 7 threshold)
   ```

4. **View Model Metrics**
   - At top of page see:
     - Total predictions: X
     - Accurate predictions: Y
     - Accuracy rate: Z%
     - Average error: ±N days

5. **Check Feedback (After Predicted Date)**
   - Click "Pending Feedback" button
   - See expired predictions
   - Submit actual empty date
   - See accuracy calculated
   - See model metrics updated

---

## 🐛 Troubleshooting

### "Predictions not showing"
→ Make sure test data migration was run (003_seed_lpg_test_data.sql)

### "Alerts not appearing"
→ Check alert config: `GET /api/lpg/alert-config`
→ Ensure alert_enabled is true

### "Model metrics show 0%"
→ No feedback submitted yet
→ Submit feedback first: `POST /api/lpg/feedback`

### "Can't make prediction"
→ Need at least 1 day of usage data
→ Log usage first: `POST /api/lpg/usage`

---

## 🚀 Next Steps

1. **Deploy to production**
   - Update environment variables
   - Apply migrations on production DB
   - Test with real data

2. **Integrate actual ML model**
   - Replace simple formula with pickle model
   - Use Python subprocess for predictions
   - Cache model in memory

3. **Add more features**
   - Email alerts
   - SMS notifications
   - Supplier integration
   - Bulk cylinder management
   - Family/shared cylinders

4. **Monitor model performance**
   - Track metrics daily
   - Retrain model weekly
   - Collect feedback for improvement

---

## 📚 Related Files

- Backend: `LPG_PREDICTION_SYSTEM.md`
- Implementation: `LPG_IMPLEMENTATION_SUMMARY.md`
- Quick Start: `LPG_QUICK_START.md`
- API Docs: In main `LPG_PREDICTION_SYSTEM.md`

---

## ✅ Checklist

- [ ] Run migration 002 (base tables)
- [ ] Run migration 003 (test data)
- [ ] Run migration 004 (feedback tables)
- [ ] Backend running on port 5000
- [ ] Frontend running on port 5173
- [ ] Logged in with test account
- [ ] LPG Prediction page loads
- [ ] Can see test cylinders
- [ ] Can see predictions
- [ ] Can see alerts
- [ ] Can log usage
- [ ] Can submit feedback
- [ ] Model metrics update after feedback

---

## 🎓 Learning Resources

**Understanding the System:**
1. Cylinders store gas containers and current weight
2. Daily usage tracks consumption patterns
3. Predictions calculate when gas empties
4. Alerts notify users before running out
5. Feedback trains the model to improve predictions
6. Metrics show model performance over time

**Key Insight:**
The more feedback users provide, the better the predictions become!
