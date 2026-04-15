import { motion } from 'framer-motion';

export default function TrustProfile() {
  return (
    <div className="flex bg-[#0e0e0e] text-[#e2e2e2] min-h-screen font-body selection:bg-white selection:text-black antialiased">
      {/* Side Navigation Shell */}
      <aside className="hidden lg:flex flex-col h-screen w-64 border-r border-white/10 bg-neutral-900/80 backdrop-blur-2xl p-4 gap-4 sticky top-0">
        <div className="mb-4 px-2">
          <p className="text-lg font-black text-white font-headline tracking-tighter">Lumina Utility</p>
          <p className="text-xs text-on-surface-variant font-medium">Verified Provider</p>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { name: 'Emergency', icon: 'emergency_heat', active: false },
            { name: 'Providers', icon: 'local_gas_station', active: false },
            { name: 'Community', icon: 'groups', active: false },
            { name: 'Verification', icon: 'verified_user', active: true },
            { name: 'Settings', icon: 'settings', active: false },
          ].map((item) => (
            <a 
              key={item.name}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all group ${
                item.active 
                ? 'bg-white text-black font-bold shadow-lg' 
                : 'text-neutral-400 hover:bg-neutral-800/50 hover:translate-x-1'
              }`} 
              href="#"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
        <div className="mt-auto p-4 bg-surface-container rounded-xl border border-white/5">
          <button className="w-full bg-white text-black py-2.5 rounded-md font-bold text-xs uppercase tracking-widest hover:brightness-90 transition-all">
            Request Emergency Refill
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto pt-24 lg:pt-12">
        <header className="mb-12 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-6xl font-headline font-extrabold tracking-tighter text-white mb-2"
          >
            Account Trust Center
          </motion.h1>
          <p className="text-on-surface-variant max-w-xl">Manage your verified status, documentation, and infrastructure health in one unified obsidian interface.</p>
        </header>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Profile Identity Card */}
          <section className="md:col-span-8 bg-surface-container rounded-3xl overflow-hidden shadow-2xl glass-gradient border border-white/5 relative">
            <div className="p-8 flex flex-col md:flex-row gap-8 items-start relative z-10">
              <div className="relative">
                <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0TMyCNaXHUpELRSshnPhysoJIKqCLqYLdS6W0RtL_NIRuOxJLPjlw0QZNosLglTkeONuUoJD70Foss2gL7xR9IMROHxZMDcuk2LVdfS2mvmfyV_at9zMI4Pc1be52QMRqwm_sCHZAwG90wBTibpbsVVG2SyTM4KkjjbT2WIxbCL_xWcV2VXx6fJMHxZO2DU-MyN70gJofOl9ef2HLlEqaa-pTD8WT2bpMVm_ARgy2MNmp14MO84oK9k_7CeJAcS1JZXqypOsJ7w" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white text-black p-1.5 rounded-lg shadow-xl">
                  <span className="material-symbols-outlined text-sm font-bold">verified</span>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-headline font-bold text-white">Marcus Sterling</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20">Verified Provider</span>
                </div>
                <p className="text-on-surface-variant font-medium mb-6">Senior Logistics Lead • District 7</p>
                <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/5">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Trust Score</p>
                    <p className="text-2xl font-headline font-bold text-white">98.4<span className="text-sm font-normal text-on-surface-variant">/100</span></p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">Account Age</p>
                    <p className="text-2xl font-headline font-bold text-white">4.2 <span className="text-sm font-normal text-on-surface-variant">Years</span></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-8 py-4 bg-white/5 flex justify-between items-center relative z-10 border-t border-white/5">
              <span className="text-xs text-on-surface-variant">Last activity: 14 minutes ago from London, UK</span>
              <button className="text-xs font-bold text-white hover:underline transition-all">View History</button>
            </div>
          </section>

          {/* Status Summary */}
          <section className="md:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 font-bold">Refill Status</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-white border border-white/5">
                  <span className="material-symbols-outlined text-3xl">emergency_heat</span>
                </div>
                <div>
                  <p className="text-lg font-headline font-bold text-white">Standby</p>
                  <p className="text-xs text-on-surface-variant">Next window: 04:00 AM</p>
                </div>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-white w-3/4 rounded-full"></div>
              </div>
            </div>
            <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5 shadow-inner">
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mb-4 font-bold">Document Queue</p>
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">License_A7.pdf</span>
                  <span className="text-sm">✅</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Safety_Audit.doc</span>
                  <span className="text-sm">⏳</span>
                </div>
              </div>
            </div>
          </section>

          {/* Cylinder Inventory */}
          <section className="md:col-span-12 bg-surface-container-low rounded-3xl p-8 border border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl -mr-32 -mt-32 rounded-full transition-all group-hover:bg-white/10"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h3 className="text-2xl font-headline font-bold text-white mb-1">Cylinder Inventory</h3>
                  <p className="text-on-surface-variant text-sm">Real-time availability of utility units across localized sectors.</p>
                </div>
                <button className="bg-white/5 text-white px-4 py-2 rounded-lg text-xs font-bold border border-white/10 hover:bg-white/10 transition-colors">
                  View Full Map
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { sector: 'Alpha-7 Sector', status: '84% Capacity', unit: '09', color: 'primary' },
                  { sector: 'Beta-Prime', status: '12% Capacity', unit: '12', color: 'error' },
                  { sector: 'Gamma Ridge', status: '98% Capacity', unit: '04', color: 'primary' },
                  { sector: 'Delta Port', status: 'Ready', unit: '21', color: 'secondary' },
                ].map((item) => (
                  <div key={item.unit} className="bg-surface-container p-5 rounded-2xl border-t border-white/10 shadow-lg group/item hover:translate-y-[-4px] transition-all">
                    <div className="flex justify-between mb-4">
                      <span className="material-symbols-outlined text-neutral-500">database</span>
                      <span className="text-[10px] font-bold text-white bg-white/10 px-2 py-0.5 rounded">UNIT {item.unit}</span>
                    </div>
                    <p className="text-sm font-bold mb-1 text-white">{item.sector}</p>
                    <p className="text-xs text-on-surface-variant mb-4">{item.status}</p>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div 
                          key={i} 
                          className={`h-1 flex-1 rounded-full ${
                            i <= (item.status.includes('12') ? 1 : 4) 
                            ? (item.color === 'error' ? 'bg-red-500' : 'bg-white') 
                            : 'bg-white/10'
                          }`}
                        ></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-black/90 backdrop-blur-xl border-t border-white/10 flex justify-around items-center z-50">
        {[
          { icon: 'dashboard', label: 'Panel' },
          { icon: 'verified_user', label: 'Trust' },
          { icon: 'database', label: 'Storage' },
          { icon: 'person', label: 'Profile' },
        ].map((item, idx) => (
          <button key={item.label} className={`flex flex-col items-center gap-1 ${idx === 1 ? 'text-white' : 'text-neutral-500'}`}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
