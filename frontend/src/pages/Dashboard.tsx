import { useState } from 'react';
import { StatusTimeline } from '../components/StatusTimeline';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { MapView } from '../components/MapView';
import { Siren, Search, PlusCircle, User, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [emergencyActive, setEmergencyActive] = useState(false);

  return (
    <div className="h-screen w-full bg-black text-white flex flex-col md:flex-row overflow-hidden">
      {/* LEFT ASPECT: Dominant Map */}
      <div className="flex-1 relative h-[50vh] md:h-full">
        <MapView mode={emergencyActive ? 'emergency' : 'discovery'} />
        {emergencyActive && (
          <div className="absolute top-6 left-6 z-[1000] p-4 bg-red-950/40 border border-red-500/50 rounded-xl backdrop-blur-md animate-pulse">
            <div className="flex items-center gap-3">
              <Siren className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-red-100 font-medium">Emergency Ongoing</p>
                <p className="text-red-300 text-xs">Tracking live response...</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT ASPECT: Control Panel */}
      <div className="w-full md:w-[400px] lg:w-[450px] border-l border-white/10 flex flex-col liquid-glass overflow-y-auto">
        {/* Top Branding / User Profile Nav */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-black/40 backdrop-blur-lg z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-white flex items-center justify-center">
              <span className="text-black font-bold">A</span>
            </div>
            <h1 className="text-xl font-light tracking-tight">Cylinder System</h1>
          </div>
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <User className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Link to="/find" className="col-span-1">
              <Card className="hover:bg-white/10 transition-colors border-white/10 cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <Search className="w-6 h-6 text-gray-400" />
                  <p className="text-sm font-light">Find Cylinder</p>
                </CardContent>
              </Card>
            </Link>
            <Link to="/register" className="col-span-1">
              <Card className="hover:bg-white/10 transition-colors border-white/10 cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <PlusCircle className="w-6 h-6 text-gray-400" />
                  <p className="text-sm font-light">Register Yours</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Active Status */}
          <Card className="border-white/10 liquid-glass">
            <CardHeader className="p-5 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-medium">Order Status</CardTitle>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest bg-white/5 border-white/10">Active</Badge>
              </div>
              <CardDescription className="text-xs">Ref #AM-92341 (Verified)</CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-4">
              <StatusTimeline currentStep={1} />
            </CardContent>
          </Card>

          {/* Messages Sneak Peek */}
          <Card className="border-white/10 bg-transparent">
            <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <MessageCircle className="w-4 h-4 text-gray-500" />
            </CardHeader>
            <CardContent className="p-5 pt-2">
               <div className="space-y-3">
                 {[
                   { user: 'Suresh R.', msg: 'Available for pickup after 5pm', time: '12m ago' },
                   { user: 'Admin', msg: 'Document verification successful', time: '1h ago' }
                 ].map((act, i) => (
                   <div key={i} className="flex flex-col border-b border-white/5 pb-2 last:border-0">
                     <div className="flex justify-between items-center mb-0.5">
                       <span className="text-xs font-medium text-white">{act.user}</span>
                       <span className="text-[10px] text-gray-500">{act.time}</span>
                     </div>
                     <p className="text-[11px] text-gray-400 truncate">{act.msg}</p>
                   </div>
                 ))}
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Emergency Trigger Bottom */}
        <div className="p-6 border-t border-white/10">
          <Button 
            className={`w-full h-12 gap-2 text-sm font-medium transition-all ${emergencyActive ? 'bg-red-600 hover:bg-red-700' : 'bg-white text-black'}`}
            onClick={() => setEmergencyActive(!emergencyActive)}
          >
            {emergencyActive ? 'Cancel Emergency' : 'Raise Silent Emergency'}
          </Button>
        </div>
      </div>
    </div>
  );
}

