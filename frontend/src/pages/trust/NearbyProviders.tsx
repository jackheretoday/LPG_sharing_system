import { motion } from 'framer-motion';

const providers = [
  {
    id: 1,
    name: 'Titan Energy Hub',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCpD9ifTMMigcJknVYu-_cALMvkoESXuDTwsdx5f2y0VQYfhMbonQoJWMrOJsgMzJW05kP0NoWamfBnNm5Shq4fi04RrH3JEDg18VOxMzLxDnYVmddX2x_4CtfspQeTr-Fi8hr-CvwzXpi6LkQoB4HgDllonyNbRtWfS7LXav2Mcq9hNf3gZrmA7XtkrYYJiT6Byq8i7EHi_TFRloVI0DiJnubGRQVg_6HBojDpG98AE25JSYWYLr6CIc8kRUH1w8Pk6BDEKeqWaQ',
    distance: '0.8 miles',
    rating: '4.9 (1.2k)',
    status: 'Available',
    stock: '94%',
    rate: '$12.50'
  },
  {
    id: 2,
    name: 'Apex Blue Gas',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCJB-J6rSyaJsSDqOuI8Sj4d2TV19NSyxMgh0WU0Mj84iCmwvNTLoD8GtfHKOpjFeNrEPj6n9ZSKDr8E7wT4oaQmBJw_dLte6M6Oc0QNv1QnMgw6IbkOI9WbQJ0MsLmK1kvuG06p4KC9WKVQBLgMqh0f3vnKcnGCzo4aspKJmqWfiT7S4POBmeyNT_ZL7lMPjRjlW1Xnmx4qQvtzAHpIfHfg3sm5-8lv8zOrs7S0zJisR4_9g7nADQls6NltZYpQJS1IaVlSC4exw',
    distance: '1.4 miles',
    rating: '4.7 (840)',
    status: 'Low Stock',
    stock: '22%',
    rate: '$11.90'
  },
  {
    id: 3,
    name: 'EcoGas Solutions',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDi8mML9x7JQ6Vrz7iqD527-1haVqs05WBNsPsHTSuWJyF48HiC0pOF82MMDBJl_-SaQqxzRpDx4DzJbm0Qn4hLUitCJMonVxezlYwZz24CqD0D0lDK69rTBau__KwYN4USEthX0LUDldOrFHavJ_3BLNfKROwzhAJ_p7KceXoAYNCrpTtAO7Wusoz_GhSh6rLidzM1SUIPRCz6SSAKt3kweEUPtHXcxcVgXVHqiHcgzJHEgsevCnjmX1lf1Bf1lJdFWHy15u2K4g',
    distance: '2.1 miles',
    rating: '4.5 (520)',
    status: 'Available',
    stock: '65%',
    rate: '$13.10'
  }
];

export default function NearbyProviders() {
  return (
    <div className="flex bg-[#0e0e0e] text-[#e2e2e2] h-screen overflow-hidden font-body selection:bg-white selection:text-black">
      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col h-full w-64 border-r border-white/10 bg-neutral-900/80 backdrop-blur-2xl p-4 gap-4">
        <div className="flex items-center gap-3 px-2 py-4">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <span className="material-symbols-outlined text-black font-bold">verified_user</span>
          </div>
          <div>
            <h2 className="text-lg font-black text-white font-headline leading-none">Lumina Utility</h2>
            <p className="text-[10px] uppercase tracking-widest text-[#c5c7c1] font-bold mt-1">Verified Provider</p>
          </div>
        </div>
        <nav className="flex flex-col gap-1 mt-4">
          {[
            { name: 'Emergency', icon: 'emergency_heat', active: false },
            { name: 'Providers', icon: 'local_gas_station', active: true },
            { name: 'Community', icon: 'groups', active: false },
            { name: 'Verification', icon: 'verified_user', active: false },
            { name: 'Settings', icon: 'settings', active: false },
          ].map((item) => (
            <a 
              key={item.name}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-200 rounded-md text-sm font-medium ${
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
        <div className="mt-auto p-4 bg-surface-container rounded-xl">
          <p className="text-xs text-on-surface-variant mb-3 font-medium">Need immediate service?</p>
          <button className="w-full bg-white text-black py-2.5 rounded-md text-xs font-bold active:opacity-80 transition-opacity">
            Request Emergency Refill
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden bg-surface-container-lowest relative pt-16 lg:pt-0">
        {/* Left Panel: List */}
        <section className="w-full md:w-[450px] lg:w-[500px] flex flex-col border-r border-white/5 bg-surface h-full z-10">
          <div className="p-6 pb-4">
            <h1 className="text-3xl font-bold font-headline tracking-tighter text-white">Providers</h1>
            <p className="text-on-surface-variant text-sm mt-1 mb-6">Found 24 verified stations near you</p>
            
            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-none">
              <button className="px-4 py-1.5 bg-white text-black rounded-full text-xs font-semibold whitespace-nowrap">Nearby</button>
              {['Most Trusted', 'Lowest Price'].map(f => (
                <button key={f} className="px-4 py-1.5 bg-white/5 text-white rounded-full text-xs font-semibold whitespace-nowrap hover:bg-white/10 transition-colors border border-white/5">{f}</button>
              ))}
              <button className="px-4 py-1.5 bg-white/5 text-white rounded-full text-xs font-semibold whitespace-nowrap flex items-center gap-1 border border-white/5">
                <span className="material-symbols-outlined text-[14px]">tune</span> Filters
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-6 space-y-4 pb-12 custom-scrollbar">
            {providers.map((p) => (
              <motion.div 
                key={p.id}
                whileHover={{ y: -2 }}
                className="glass-card p-5 rounded-xl group transition-all hover:bg-white/5 border border-white/5"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 rounded-lg overflow-hidden bg-white/5 ring-1 ring-white/5">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-white text-lg leading-tight">{p.name}</h3>
                        <span className="material-symbols-outlined text-white text-[18px]">verified</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-on-surface-variant mt-1">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">near_me</span> {p.distance}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">star</span> {p.rating}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mb-1">Status</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      p.status === 'Available' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-5">
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight mb-1">LPG Availability</div>
                    <div className="text-sm font-bold text-white">{p.stock} Stock</div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-lg border border-white/5">
                    <div className="text-[10px] text-on-surface-variant font-medium uppercase tracking-tight mb-1">Current Rate</div>
                    <div className="text-sm font-bold text-white">{p.rate} <span className="text-[10px] text-on-surface-variant">/kg</span></div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-md text-xs font-bold transition-all border border-white/5">View Profile</button>
                  <button className="w-10 h-9 flex items-center justify-center bg-white text-black rounded-md active:scale-95 transition-all">
                    <span className="material-symbols-outlined text-[20px]">directions</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Right Panel: Map Representation */}
        <section className="hidden md:block flex-1 relative bg-[#0e0e0e]">
          <div className="absolute inset-0 grayscale contrast-125 opacity-40 mix-blend-screen pointer-events-none">
            <div 
              className="w-full h-full" 
              style={{ 
                backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAc0Smiy22N1VcZJsgjKSCN2kF5SkJR4zHL2o__dZKcd8E-zMgIjLXNCAaY7rKAvKx2MSL1sWx5ymZmJDqvVQlFgsS2J86xgFubzQngClzqjzUlcVfwiwuXT3gg1Z5jEd0Vs7jav6KCM_hcIZxBjsCB1FrAf7wJ47VBnr-4bbnphs_AYc_bfzdHzxus2qcNFw6_QkUXta1PvQLYIWpP5UOw7o3QSL0ufKmZAqLpkw_r5GZPbtrSNbxeIoPHJP8qJwI4XYux6hqEgA)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
              }}
            ></div>
          </div>
          
          <div className="absolute top-6 left-6 flex flex-col gap-2 z-20">
            <button className="w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined">add</span>
            </button>
            <button className="w-10 h-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg flex items-center justify-center hover:bg-white/10 transition-all">
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>

          <div className="absolute bottom-6 right-6 flex flex-col gap-3 items-end z-20">
            <div className="bg-black/80 backdrop-blur-xl border border-white/5 p-4 rounded-2xl shadow-2xl max-w-xs">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Live Activity</p>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <div className="absolute -inset-1 bg-white/20 rounded-full animate-ping"></div>
                </div>
                <p className="text-xs text-white leading-tight">4 refilling tankers active in your quadrant.</p>
              </div>
            </div>
            <button className="bg-white text-black px-5 py-2.5 rounded-full text-xs font-bold shadow-2xl flex items-center gap-2 active:scale-95 transition-all">
              <span className="material-symbols-outlined text-sm">my_location</span> Center My Location
            </button>
          </div>

          {/* Map Markers */}
          <div className="absolute top-1/3 left-1/4 z-10">
            <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)] cursor-pointer"></div>
          </div>
          <div className="absolute top-1/2 left-2/3 z-10">
            <div className="w-4 h-4 bg-white/40 rounded-full border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.3)] cursor-pointer"></div>
          </div>
        </section>
      </main>
    </div>
  );
}
