# LPG Prediction System - Quick Setup Guide

## 🚀 What's Been Created

You now have a complete LPG prediction system with:

### Backend Files Created:
1. **Database Migration**: `backend/migrations/002_add_lpg_prediction_tables.sql`
   - 5 new database tables
   - Row Level Security policies
   - Proper indexes for performance

2. **Backend Service**: `backend/services/lpgService.js`
   - Prediction engine
   - Alert management
   - Configuration management
   - Database operations

3. **Backend Controller**: `backend/controllers/lpgController.js`
   - 13 API endpoint handlers
   - Input validation
   - Error handling

4. **Backend Routes**: `backend/routes/lpgRoutes.js`
   - All 13 LPG endpoints
   - Authentication middleware
   - Request routing

### Frontend Files Created:
1. **Main Component**: `frontend/src/components/LPGTracker.tsx`
   - Full UI for LPG tracking
   - Cylinder management
   - Usage logging
   - Predictions display
   - Responsive design

2. **Alert Component**: `frontend/src/components/LPGAlertNotification.tsx`
   - Floating notification bell
   - Real-time alert polling
   - Alert management

3. **API Client**: `frontend/src/lib/lpgApi.ts`
   - 13 API helper functions
   - Type-safe calls
   - Error handling

### Documentation:
- `LPG_PREDICTION_SYSTEM.md` - Complete documentation (15 sections)

---

## ⚡ Quick Start (5 Steps)

### Step 1: Apply Database Migration
```bash
# In Supabase Dashboard:
1. Go to SQL Editor
2. Copy content from: backend/migrations/002_add_lpg_prediction_tables.sql
3. Run the query
4. Verify tables were created
```

### Step 2: Update Backend Server
The backend server.js has been updated to include:
```javascript
const lpgRoutes = require("./routes/lpgRoutes");
app.use("/api/lpg", lpgRoutes);
```
✅ **Already done!** Just restart your backend.

### Step 3: Start Backend
```bash
cd backend
npm start
```

### Step 4: Add Frontend Components to Your App
```tsx
// In your main App.tsx or relevant page
import { LPGTracker } from './components/LPGTracker';
import { LPGAlertNotification } from './components/LPGAlertNotification';

export function App() {
  const token = localStorage.getItem('token');

  return (
    <>
      {/* Add alert notification bell */}
      <LPGAlertNotification 
        token={token}
        apiBase={import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}
      />
      
      {/* Add LPG tracking page */}
      <LPGTracker />
    </>
  );
}
```

### Step 5: Start Frontend
```bash
cd frontend
npm run dev
```

---

## 📊 API Endpoints Summary

### Cylinder Management
```
POST   /api/lpg/cylinders              → Add cylinder
GET    /api/lpg/cylinders              → Get all cylinders
GET    /api/lpg/cylinders/:id          → Get specific cylinder
PATCH  /api/lpg/cylinders/:id          → Update cylinder
DELETE /api/lpg/cylinders/:id          → Delete cylinder
```

### Usage Tracking
```
POST   /api/lpg/usage                  → Log daily usage
GET    /api/lpg/usage/:cylinderId      → Get usage history
```

### Predictions
```
POST   /api/lpg/predict                → Make prediction
GET    /api/lpg/predict/:cylinderId    → Get latest prediction
```

### Alerts
```
GET    /api/lpg/alerts                 → Get unread alerts
PATCH  /api/lpg/alerts/:alertId        → Mark alert as read
GET    /api/lpg/alert-config           → Get alert settings
PATCH  /api/lpg/alert-config           → Update alert settings
```

---

## 🎯 How It Works

### User Flow:

1. **Add Cylinder**
   - User enters: Cylinder ID, Current weight, Max capacity
   - System stores in database

2. **Log Usage**
   - User enters daily usage amount
   - System records with timestamp

3. **Make Prediction**
   - System calculates average usage from historical data
   - Uses ML model (or simple formula: days = weight / avg_usage)
   - Saves prediction to database

4. **Alert Trigger**
   - If days remaining < threshold (default 7)
   - Alert created and shown to user
   - User gets notification

---

## 🔍 Testing the System

### Test in Postman/Insomnia:

```bash
# 1. Add a cylinder
POST http://localhost:5000/api/lpg/cylinders
Header: Authorization: Bearer {your_token}
Body: {
  "cylinder_id": "CYL-001",
  "current_weight_kg": 20,
  "max_capacity_kg": 20
}

# 2. Log usage (do this 3-4 times with different dates)
POST http://localhost:5000/api/lpg/usage
Header: Authorization: Bearer {your_token}
Body: {
  "cylinder_id": "CYL-001",
  "usage_kg": 0.5,
  "usage_reason": "cooking"
}

# 3. Make prediction
POST http://localhost:5000/api/lpg/predict
Header: Authorization: Bearer {your_token}
Body: {
  "cylinder_id": "CYL-001"
}

# 4. Get alerts
GET http://localhost:5000/api/lpg/alerts
Header: Authorization: Bearer {your_token}
```

---

## 📈 Features by Type

### Basic Features ✅
- [x] Add/remove cylinders
- [x] Log daily usage
- [x] Get usage history
- [x] Make predictions
- [x] View alerts

### Advanced Features ✅
- [x] Configurable alert thresholds
- [x] Multiple notification methods
- [x] Confidence scoring
- [x] Automatic alert dismissal
- [x] Usage pattern analysis

### Security ✅
- [x] JWT authentication on all endpoints
- [x] Row Level Security in database
- [x] User data isolation
- [x] Input validation

---

## 🛠️ Integration Points

### If You Have an Existing Dashboard:

```tsx
// Add to your imports
import { LPGTracker } from './components/LPGTracker';

// Add to your page/route
<LPGTracker />

// Or add alert bell to navbar
<LPGAlertNotification token={token} apiBase={API_BASE} />
```

### If You Want Custom UI:

```tsx
import { lpgApi } from './lib/lpgApi';

// Use these functions in your custom components
const cylinders = await lpgApi.getCylinders();
const prediction = await lpgApi.predictEmptyDate(cylinderId);
const alerts = await lpgApi.getAlerts();
```

---

## 📝 Environment Setup

### Frontend (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

### Backend (.env)
Make sure you have:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 🚨 Common Issues & Solutions

### "Cylinder not found"
→ Make sure cylinder exists: `GET /api/lpg/cylinders`

### "No alerts showing"
→ Log usage first, then make prediction with threshold < 7 days

### "Days remaining is NaN"
→ You need at least 1 day of usage data before prediction

### "Connection refused"
→ Backend not running: `cd backend && npm start`

---

## 📚 Full Documentation

See `LPG_PREDICTION_SYSTEM.md` for:
- Complete API documentation
- Database schema details
- Component props and usage
- Architecture diagrams
- Error handling guide
- Security best practices
- ML model integration guide
- Troubleshooting section
- FAQ

---

## 🎁 Next Steps (Optional Enhancements)

1. **ML Model Integration**
   - Replace simple formula with actual pickle model
   - See "Machine Learning Model Integration" in main docs

2. **Email Notifications**
   - Configure SMTP service
   - Send alert emails to users

3. **Mobile App**
   - Create React Native version
   - Share API endpoints

4. **Analytics**
   - Add charts showing usage trends
   - Monthly/yearly analytics

5. **Supplier Integration**
   - Connect with LPG suppliers
   - Auto-order refills

---

## 📞 Support Files

All code is well-commented. Check:
- `backend/services/lpgService.js` - Service logic with JSDoc
- `backend/controllers/lpgController.js` - Controller handlers with comments
- `frontend/src/components/LPGTracker.tsx` - React component with inline comments

---

## ✅ Checklist Before Going Live

- [ ] Database migration applied
- [ ] Backend running without errors
- [ ] Frontend components added to app
- [ ] Test add cylinder
- [ ] Test log usage
- [ ] Test make prediction
- [ ] Test alerts display
- [ ] Test on mobile
- [ ] Update .env files for production
- [ ] Enable HTTPS
- [ ] Setup rate limiting
- [ ] Setup monitoring

---

## 🎉 You're All Set!

Your LPG prediction system is ready to use. Start with the Quick Start guide above, test the endpoints, and integrate into your app!

For detailed information, see: **LPG_PREDICTION_SYSTEM.md**
