import { useNavigate } from 'react-router-dom';
import { MapView } from '../components/MapView';

export default function Tracking() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-white selection:text-black flex flex-col relative overflow-hidden">
      
      {/* Top Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8 h-16 shadow-2xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/10 rounded-md transition-all text-on-surface-variant flex items-center justify-center"
          >
            <span className="material-symbols-outlined !text-xl">arrow_back</span>
          </button>
          <div className="text-xl font-bold tracking-tighter text-white font-headline">Live Response Tracking</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full border border-red-500/30 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
            Active Emergency
          </div>
        </div>
      </nav>

      <div className="flex-1 pt-16 grid md:grid-cols-4 lg:grid-cols-5 h-[calc(100vh-4rem)]">
        
        {/* Dominant Map Area */}
        <div className="md:col-span-3 lg:col-span-3 relative bg-[#0e0e0e] border-r border-white/5">
          <div className="w-full h-full grayscale-[0.2] contrast-[1.05]">
            <MapView mode="emergency" />
          </div>
          
          {/* Map Overlay Controls */}
          <div className="absolute bottom-10 left-10 z-10">
            <div className="bg-surface-container/60 backdrop-blur-lg rounded-2xl p-6 border border-white/5 shadow-2xl">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Dispatcher Notes</h4>
              <p className="text-sm text-white font-light max-w-xs leading-relaxed">
                Unit #104 is bypassing heavy traffic on Central Avenue. Estimated arrival time remains 8-10 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Info Panel */}
        <div className="md:col-span-1 lg:col-span-2 overflow-y-auto bg-surface-container-lowest p-8 lg:p-12 space-y-10">
          
          <div>
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-8">Unit assigned</h2>
            <div className="hub-glass glass-edge p-8 rounded-3xl border border-white/5 shadow-2xl">
               <div className="flex items-center gap-6 mb-8">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCkbXcUvZPuhqi_lYlwjYFD_Oudq9R83VR_lXJSS7yZdYixOcN8lAqp_Xaz74r-vJwv25GjJVDS9NgXPICIjqVCT0LZvPcVIoGwiKhzb3idSsJwILVea0ISrWwHz9yInXlEJYXjmHTG4WAH_Bwz6rrO3NdySFckSa6H3vR4pyrSkJw197BcsGwpuJh20GvtMvqt4Pi7pSGc59P5abaKHVeIQWJtlsdWBptyih4SsYKIg2nUr1d0gN2vFQPGc0Kx_qF4sjwVqq_7AQ" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-headline font-bold text-white tracking-tight">Rajesh Kumar</h3>
                    <p className="text-on-surface-variant font-medium flex items-center gap-2">
                      <span className="material-symbols-outlined !text-sm text-blue-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                      Certified Senior Mechanic
                    </p>
                  </div>
               </div>
               
               <div className="space-y-6 pt-6 border-t border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant font-medium">Contact Number</span>
                    <span className="text-sm text-white font-bold tracking-tight">+91 98765 43210</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-on-surface-variant font-medium">Verification ID</span>
                    <span className="text-sm text-white font-bold tracking-tight">#VEX-4902</span>
                  </div>
               </div>

               <div className="mt-10">
                  <button className="w-full bg-white text-black py-4 rounded-xl font-headline font-black text-sm tracking-tight hover:bg-[#C9C6C0] active:scale-[0.98] transition-all shadow-2xl flex items-center justify-center gap-3">
                    <span className="material-symbols-outlined !text-xl">call</span>
                    Secure Voice Call
                  </button>
               </div>
            </div>
          </div>

          <div>
             <h2 className="text-xs font-black uppercase tracking-[0.3em] text-on-surface-variant/40 mb-6">Status Timeline</h2>
             <div className="space-y-0 pl-1">
                {[
                  { label: 'Incident Reported', time: '14:20', done: true },
                  { label: 'Dispatcher Assigned Unit', time: '14:22', done: true },
                  { label: 'Mechanic en Route', time: 'Live', active: true },
                  { label: 'On-site Triage', time: '--:--', pending: true }
                ].map((s, i) => (
                  <div key={i} className="flex gap-6 h-16 last:h-8 group">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full mt-1.5 shadow-lg shadow-white/5 transition-all duration-700 ${s.active ? 'bg-red-500 ring-4 ring-red-500/20 blur-[1px]' : s.done ? 'bg-white' : 'bg-white/10'}`}></div>
                      {i < 3 && <div className={`w-px flex-1 my-1 ${s.done ? 'bg-white/50' : 'bg-white/5'}`}></div>}
                    </div>
                    <div className="flex-1 flex justify-between items-start">
                      <p className={`text-sm font-bold tracking-tight ${s.active ? 'text-white' : s.done ? 'text-white/70' : 'text-white/20'}`}>{s.label}</p>
                      <span className={`text-[10px] uppercase font-black tracking-widest ${s.active ? 'text-red-500' : 'text-on-surface-variant/40'}`}>{s.time}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-2xl flex gap-4">
             <span className="material-symbols-outlined text-red-500 !text-xl animate-pulse">crisis_alert</span>
             <p className="text-xs text-red-200 font-medium leading-relaxed">
               Safety Notice: Stay clear of the cylinder area. Do not operate any electrical switches until the specialist arrives.
             </p>
          </div>

        </div>
      </div>
    </div>
  );
}
