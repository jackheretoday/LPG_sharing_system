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
      </Routes>
    </Router>
  );
}

export default App;

