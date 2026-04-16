import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import RefillBooking from '@/pages/RefillBooking';
import Emergency from '@/pages/Emergency';
import EmergencyAssessment from '@/pages/EmergencyAssessment';
import Tracking from '@/pages/Tracking';
import Dashboard from '@/pages/Dashboard';
import Payment from '@/pages/Payment';
import ResourceSharing from '@/pages/ResourceSharing';
import TrustLogin from '@/pages/trust/TrustLogin';
import AdminPanel from '@/pages/AdminPanel';
import AdminHome from '@/pages/admin/Home';
import AdminProfile from '@/pages/admin/Profile';
import IdReviewQueue from '@/pages/admin/IdReviewQueue';
import TrustOverride from '@/pages/admin/TrustOverride';
import Suspensions from '@/pages/admin/Suspensions';
import UserHome from '@/pages/user/Home';
import ConsumerHome from '@/pages/consumer/Home';
import MechanicPanel from '@/pages/MechanicPanel';
import { RoleProtectedRoute } from '@/pages/shared/RoleProtectedRoute';
import RegisterCylinder from '@/pages/RegisterCylinder';
import FindCylinder from '@/pages/FindCylinder';
import Chat from '@/pages/Chat';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import CreatePost from '@/pages/CreatePost';
import PostDetails from '@/pages/PostDetails';
import { LPGPredictionPage } from '@/pages/LPGPredictionPage';
import OTPVerify from '@/pages/trust/OTPVerify';
import ProfileSetup from '@/pages/trust/ProfileSetup';
import TrustProfile from '@/pages/trust/TrustProfile';
import NearbyProviders from '@/pages/trust/NearbyProviders';
import ProviderDetails from '@/pages/trust/ProviderDetails';
import RaiseDispute from '@/pages/trust/RaiseDispute';
import Disputes from '@/pages/trust/Disputes';
import DisputeDetails from '@/pages/trust/DisputeDetails';
import AdminDisputes from '@/pages/trust/AdminDisputes';
import AdminLogin from '@/pages/trust/AdminLogin';
import AdminRouter from '@/admin-app/AdminRouter';
import { AdminProtectedRoute } from '@/admin-app/components/AdminProtectedRoute';
import FindHelp from '@/pages/consumer/FindHelp';

import { AIChatbot } from './components/AIChatbot';
import { AuthenticatedRoute } from '@/components/trust/AuthenticatedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/emergency/assessment" element={<EmergencyAssessment />} />
        
        {/* Unified Auth */}
        <Route path="/auth" element={<Navigate to="/auth/login" replace />} />
        <Route path="/login" element={<Navigate to="/auth/login" replace />} />
        <Route path="/auth/login" element={<TrustLogin />} />
        <Route path="/auth/admin" element={<AdminLogin />} />
        <Route path="/auth/otp-verify" element={<OTPVerify />} />

        {/* Unified Consumer Workspace */}
        <Route 
          path="/consumer/home" 
          element={
            <RoleProtectedRoute allowedRoles={['consumer', 'household', 'user']}>
              <ConsumerHome />
            </RoleProtectedRoute>
          } 
        />
        <Route path="/consumer/providers" element={<Navigate to="/providers/nearby" replace />} />
        <Route path="/consumer/trust-profile" element={<Navigate to="/trust/me" replace />} />
        <Route path="/consumer/verification" element={<Navigate to="/onboarding/setup" replace />} />
        <Route path="/consumer/disputes" element={<Navigate to="/disputes" replace />} />
        <Route path="/consumer/lpg" element={<Navigate to="/lpg-prediction" replace />} />
        <Route path="/consumer/find-help" element={<FindHelp />} />

        {/* Unified Provider Workspace */}
        <Route 
          path="/provider/home" 
          element={
            <RoleProtectedRoute allowedRoles={['provider', 'verified_reseller', 'mechanic']}>
              <MechanicPanel />
            </RoleProtectedRoute>
          } 
        />

        {/* Legacy / Compatibility Routes */}
        <Route path="/user" element={<Navigate to="/consumer/home" replace />} />
        <Route path="/consumer" element={<Navigate to="/consumer/home" replace />} />
        <Route path="/mechanic" element={<Navigate to="/provider/home" replace />} />

        <Route path="/booking/:id" element={<RefillBooking />} />
        <Route
          path="/tracking"
          element={(
            <AuthenticatedRoute>
              <Tracking />
            </AuthenticatedRoute>
          )}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/resources" element={<ResourceSharing />} />
        
        {/* Admin Modern Portal */}
        <Route 
          path="/admin/*" 
          element={
            <AdminProtectedRoute>
              <AdminRouter />
            </AdminProtectedRoute>
          } 
        />

        {/* Admin Legacy Portal */}
        <Route path="/admin/legacy" element={<AdminPanel />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/id-review-queue" element={<IdReviewQueue />} />
        <Route path="/admin/trust-override" element={<TrustOverride />} />
        <Route path="/admin/suspensions" element={<Suspensions />} />
        <Route path="/admin/disputes" element={<AdminDisputes />} />

        <Route path="/register" element={<RegisterCylinder />} />
        <Route path="/find" element={<Navigate to="/consumer/find-help" replace />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/create" element={<CreatePost />} />
        <Route path="/community/post/:id" element={<PostDetails />} />
        <Route path="/lpg-prediction" element={<LPGPredictionPage />} />
        <Route path="/dashboard/lpg" element={<LPGPredictionPage />} />
        
        {/* Trust Layer Additional Routes */}
        <Route path="/onboarding/setup" element={<ProfileSetup />} />
        <Route path="/trust/me" element={<TrustProfile />} />
        <Route path="/providers/nearby" element={<NearbyProviders />} />
        <Route path="/provider/:id" element={<ProviderDetails />} />
        <Route path="/disputes/new/:exchangeId" element={<RaiseDispute />} />
        <Route path="/disputes" element={<Disputes />} />
        <Route path="/disputes/:id" element={<DisputeDetails />} />
      </Routes>
      <AIChatbot />
    </Router>
  );
}

export default App;
