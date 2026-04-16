import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '@/pages/Landing';
import RefillBooking from '@/pages/RefillBooking';
import Emergency from '@/pages/Emergency';
import EmergencyAssessment from '@/pages/EmergencyAssessment';
import Tracking from '@/pages/Tracking';
import Dashboard from '@/pages/Dashboard';
import MechanicPanel from '@/pages/MechanicPanel';
import Payment from '@/pages/Payment';
import ResourceSharing from '@/pages/ResourceSharing';
import Auth from '@/pages/Auth';
import AdminPanel from '@/pages/AdminPanel';
import AdminHome from '@/pages/admin/Home';
import AdminProfile from '@/pages/admin/Profile';
import IdReviewQueue from '@/pages/admin/IdReviewQueue';
import TrustOverride from '@/pages/admin/TrustOverride';
import Suspensions from '@/pages/admin/Suspensions';
import UserHome from '@/pages/user/Home';
import ConsumerHome from '@/pages/consumer/Home';
import RegisterCylinder from '@/pages/RegisterCylinder';
import FindCylinder from '@/pages/FindCylinder';
import Chat from '@/pages/Chat';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import CreatePost from '@/pages/CreatePost';
import PostDetails from '@/pages/PostDetails';
import { LPGPredictionPage } from '@/pages/LPGPredictionPage';
import TrustLogin from '@/pages/trust/TrustLogin';
import OTPVerify from '@/pages/trust/OTPVerify';
import ProfileSetup from '@/pages/trust/ProfileSetup';
import TrustProfile from '@/pages/trust/TrustProfile';
import NearbyProviders from '@/pages/trust/NearbyProviders';
import ProviderDetails from '@/pages/trust/ProviderDetails';
import RaiseDispute from '@/pages/trust/RaiseDispute';
import Disputes from '@/pages/trust/Disputes';
import DisputeDetails from '@/pages/trust/DisputeDetails';
import AdminDisputes from '@/pages/trust/AdminDisputes';

import { AIChatbot } from './components/AIChatbot';
import { AuthenticatedRoute } from '@/components/trust/AuthenticatedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/emergency/assessment" element={<EmergencyAssessment />} />
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
        <Route path="/mechanic" element={<MechanicPanel />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/resources" element={<ResourceSharing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<TrustLogin />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/admin/legacy" element={<AdminPanel />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/id-review-queue" element={<IdReviewQueue />} />
        <Route path="/admin/trust-override" element={<TrustOverride />} />
        <Route path="/admin/suspensions" element={<Suspensions />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/consumer" element={<ConsumerHome />} />
        <Route path="/register" element={<RegisterCylinder />} />
        <Route path="/find" element={<FindCylinder />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/create" element={<CreatePost />} />
        <Route path="/community/post/:id" element={<PostDetails />} />
        <Route path="/lpg-prediction" element={<LPGPredictionPage />} />
        <Route path="/dashboard/lpg" element={<LPGPredictionPage />} />
        
        {/* Trust Layer Routes */}
        <Route path="/auth/login" element={<TrustLogin />} />
        <Route path="/auth/otp-verify" element={<OTPVerify />} />
        <Route path="/onboarding/setup" element={<ProfileSetup />} />
        <Route path="/trust/me" element={<TrustProfile />} />
        <Route path="/providers/nearby" element={<NearbyProviders />} />
        <Route path="/provider/:id" element={<ProviderDetails />} />
        <Route path="/disputes/new/:exchangeId" element={<RaiseDispute />} />
        <Route path="/disputes" element={<Disputes />} />
        <Route path="/disputes/:id" element={<DisputeDetails />} />
        <Route path="/admin/disputes" element={<AdminDisputes />} />
      </Routes>
      <AIChatbot />
    </Router>
  );
}

export default App;
