import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapView } from '../components/MapView';

// Using Material Symbols font spans instead of MUI icons to match the design system exactly.
export default function Dashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('map'); // 'map' or 'feed'
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="h-screen bg-surface text-on-surface font-body selection:bg-white selection:text-black overflow-hidden flex flex-col">
      
      {/* Top Navigation Bar */}
      <nav className="w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-8 h-16 shrink-0 transition-all">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-white font-headline cursor-pointer" onClick={() => navigate('/')}>LPG Hub</span>
          <div className="hidden md:flex gap-6">
            <Link className="text-[#C5C7C1] hover:text-white transition-colors text-sm font-manrope font-medium" to="/community">Community</Link>
            <Link className="text-white border-b-2 border-white pb-1 text-sm font-manrope font-medium" to="/dashboard">Map</Link>
            <Link className="text-[#C5C7C1] hover:text-white transition-colors text-sm font-manrope font-medium" to="/resources">Resources</Link>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant !text-sm">search</span>
            <input 
              className="bg-surface-container-low border-none rounded-md pl-10 pr-4 py-1.5 text-sm focus:ring-1 focus:ring-outline-variant/40 transition-all w-64 text-white placeholder:text-on-surface-variant/30" 
              placeholder="Search areas..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="p-2 hover:bg-white/10 transition-all rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white">notifications</span>
          </button>
          <button className="p-2 hover:bg-white/10 transition-all rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-white">settings</span>
          </button>
          <div className="h-8 w-8 rounded-full border border-white/10 overflow-hidden cursor-pointer" onClick={() => navigate('/profile')}>
            <img alt="User profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU7X65WWbHi5hPUFfgGybpsSuwbm5NaRJ02IWixtcKvudaiQ9shrc3SMCVeoy8h0KwrkZ2yNCNn8HaWSMt030WcEUhkUKEDyNAjH7BU4Wa2UD_jN9ssFi3bWCRV16ArV1p14t1bT4_bosx41kHkXUtA8uPoxHLcYO_avlNzZ4cnpWH_VTsA4rqfBf4bGFnwoHSW9FgmA4PbC0RanXC1CGE3P6mkkd7xESObghWO4i2Tq-Z3yqlaGPjZKYnxjRodjWmsg9wh9zw9A" />
          </div>
        </div>
      </nav>

      {/* Main Layout Area */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex w-64 bg-[#0E0E0E] flex-col gap-2 pt-6 font-manrope text-sm font-medium border-r border-white/5">
          <div className="px-6 mb-6">
            <h2 className="text-lg font-black text-white">Community Insights</h2>
            <p className="text-xs text-on-surface-variant">Local LPG availability</p>
          </div>
          
          <nav className="flex flex-col gap-1">
            <button onClick={() => navigate('/community')} className="w-full text-left text-[#C5C7C1] mx-0 px-6 py-3 flex items-center gap-3 hover:bg-[#1F1F1F] transition-all duration-300 group">
              <span className="material-symbols-outlined">dashboard</span>
              <span>Home Feed</span>
            </button>
            <button className="w-full text-left text-[#C5C7C1] mx-0 px-6 py-3 flex items-center gap-3 hover:bg-[#1F1F1F] transition-all duration-300 group">
              <span className="material-symbols-outlined">emergency_home</span>
              <span>Emergency Alerts</span>
            </button>
            <button className="w-full text-left bg-white/5 text-white mx-0 px-6 py-3 flex items-center gap-3 transition-all duration-300">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>gas_meter</span>
              <span>Active Offers</span>
            </button>
            <button className="w-full text-left text-[#C5C7C1] mx-0 px-6 py-3 flex items-center gap-3 hover:bg-[#1F1F1F] transition-all duration-300 group">
              <span className="material-symbols-outlined">history</span>
              <span>My Requests</span>
            </button>
          </nav>

          <div className="mt-auto p-4 flex flex-col gap-4 border-t border-white/5 pb-20">
            <button 
              onClick={() => navigate('/register')}
              className="bg-white text-black font-bold py-3 rounded-md hover:bg-white/90 active:scale-[0.98] transition-all text-center text-sm"
            >
              Register Cylinder
            </button>
            <div className="flex flex-col gap-1">
              <a className="text-[#C5C7C1] px-4 py-2 flex items-center gap-3 text-xs hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined !text-sm">help</span>
                <span>Support</span>
              </a>
              <a className="text-[#C5C7C1] px-4 py-2 flex items-center gap-3 text-xs hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined !text-sm">description</span>
                <span>Terms</span>
              </a>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 relative overflow-hidden bg-surface-container-lowest">
          
          {/* Real Leaflet Map */}
          <div className="absolute inset-0 z-0 grayscale-[0.5] contrast-[1.1] brightness-[0.8] transition-all duration-700">
            <MapView />
          </div>

          {/* UI Overlays */}
          
          {/* Search / Filter Chips */}
          <div className="absolute top-6 left-6 flex gap-3 z-10 overflow-x-auto max-w-[calc(100%-200px)] no-scrollbar">
            <button className="bg-surface-bright/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm text-white flex items-center gap-2 hover:bg-white/20 transition-all whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-red-500 blur-[2px]"></span>
              Emergency Requests
            </button>
            <button className="bg-surface-bright/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm text-white flex items-center gap-2 hover:bg-white/20 transition-all whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-emerald-500 blur-[2px]"></span>
              Bulk Availability
            </button>
            <button className="bg-surface-bright/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-sm text-white flex items-center gap-2 hover:bg-white/20 transition-all whitespace-nowrap">
              <span className="material-symbols-outlined !text-sm">filter_list</span>
              More Filters
            </button>
          </div>

          {/* Floating Controls (Zoom / Location) */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-10">
            <div className="bg-surface-container/80 backdrop-blur-md rounded-lg p-1 border border-white/5 flex flex-col shadow-2xl">
              <button className="p-2 hover:bg-white/10 text-white transition-all rounded-md flex items-center justify-center">
                <span className="material-symbols-outlined">add</span>
              </button>
              <div className="h-px bg-white/5 mx-2"></div>
              <button className="p-2 hover:bg-white/10 text-white transition-all rounded-md flex items-center justify-center">
                <span className="material-symbols-outlined">remove</span>
              </button>
            </div>
            <button className="bg-surface-container/80 backdrop-blur-md p-2 rounded-lg border border-white/5 text-white hover:bg-white/10 transition-all shadow-2xl flex items-center justify-center">
              <span className="material-symbols-outlined">my_location</span>
            </button>
          </div>

          {/* Mode Toggle (Map / Feed) */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
            <div className="bg-surface-container-highest/80 backdrop-blur-xl p-1.5 rounded-full border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.6)] flex items-center gap-2">
              <button 
                onClick={() => setActiveView('map')}
                className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all ${activeView === 'map' ? 'bg-white text-black shadow-lg scale-[1.05]' : 'text-on-surface-variant hover:text-white'}`}
              >
                <span className="material-symbols-outlined !text-sm">map</span>
                Map View
              </button>
              <button 
                onClick={() => navigate('/community')}
                className={`px-6 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-all ${activeView === 'feed' ? 'bg-white text-black' : 'text-on-surface-variant hover:text-white'}`}
              >
                <span className="material-symbols-outlined !text-sm">view_agenda</span>
                Feed View
              </button>
            </div>
          </div>

          {/* Map Legend (Bottom Right) */}
          <div className="absolute bottom-10 right-10 z-10 hidden lg:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-surface-container/60 backdrop-blur-lg border border-white/5 rounded-2xl p-6 shadow-2xl min-w-[200px]"
            >
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant/60 mb-4">Live Legend</h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  <span className="text-xs text-white font-medium">Critical Need</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                  <span className="text-xs text-white font-medium">Verified Stock</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-400 shadow-[0_0_10px_rgba(156,163,175,0.5)]"></div>
                  <span className="text-xs text-white font-medium">Community Refill</span>
                </div>
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <span className="material-symbols-outlined text-blue-400 !text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  <span className="text-xs text-white font-medium">Verified Source</span>
                </div>
              </div>
            </motion.div>
          </div>

        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden w-full bg-[#131313]/90 backdrop-blur-xl z-50 flex justify-around items-center h-16 border-t border-white/5 shrink-0">
        <button onClick={() => navigate('/community')} className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] uppercase tracking-tighter font-bold">Feed</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-white">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
          <span className="text-[10px] uppercase tracking-tighter font-bold">Map</span>
        </button>
        <div className="-mt-10">
          <button 
            onClick={() => navigate('/community/create')}
            className="bg-white text-black p-4 rounded-full shadow-[0_10px_30px_rgba(255,255,255,0.2)] active:scale-90 transition-transform flex items-center justify-center"
          >
            <span className="material-symbols-outlined !text-2xl">add</span>
          </button>
        </div>
        <button className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined">gas_meter</span>
          <span className="text-[10px] uppercase tracking-tighter font-bold">Offers</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-white transition-colors">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] uppercase tracking-tighter font-bold">Profile</span>
        </button>
      </nav>

    </div>
  );
}
