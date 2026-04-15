import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '@/pages/Landing';
import Emergency from '@/pages/Emergency';
import Tracking from '@/pages/Tracking';
import Dashboard from '@/pages/Dashboard';
import MechanicPanel from '@/pages/MechanicPanel';
import Payment from '@/pages/Payment';
import ResourceSharing from '@/pages/ResourceSharing';
import Auth from '@/pages/Auth';
import AdminPanel from '@/pages/AdminPanel';
import RegisterCylinder from '@/pages/RegisterCylinder';
import FindCylinder from '@/pages/FindCylinder';
import Chat from '@/pages/Chat';
import Profile from '@/pages/Profile';
import Community from '@/pages/Community';
import CreatePost from '@/pages/CreatePost';
import PostDetails from '@/pages/PostDetails';
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/emergency" element={<Emergency />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mechanic" element={<MechanicPanel />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/resources" element={<ResourceSharing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/register" element={<RegisterCylinder />} />
        <Route path="/find" element={<FindCylinder />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/community" element={<Community />} />
        <Route path="/community/create" element={<CreatePost />} />
        <Route path="/community/post/:id" element={<PostDetails />} />
        
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
    </Router>
  );
}

export default App;

