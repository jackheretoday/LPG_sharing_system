import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function DisputeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="bg-[#0e0e0e] text-[#e2e2e2] min-h-screen font-body selection:bg-white selection:text-black antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16 flex justify-between items-center px-8">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-white font-headline tracking-tighter">LPG Resolve</span>
          <div className="hidden md:flex space-x-6">
            <a className="text-neutral-400 hover:text-white transition-colors duration-300 font-medium text-sm" href="#">Dashboard</a>
            <a onClick={() => navigate('/disputes')} className="text-white border-b-2 border-white pb-1 font-medium text-sm cursor-pointer">My Disputes</a>
            <a className="text-neutral-400 hover:text-white transition-colors duration-300 font-medium text-sm" href="#">Resources</a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
              <span className="material-symbols-outlined text-neutral-500 text-sm">search</span>
              <input className="bg-transparent border-none focus:ring-0 text-xs w-48 text-white placeholder:text-neutral-600 outline-none" placeholder="Search claims..." type="text" />
            </div>
            <span className="material-symbols-outlined text-neutral-400 cursor-pointer hover:text-white transition-colors">notifications</span>
            <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden border border-white/10">
              <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlyFruGUJqUJQRhbIiCRUminGtbCosmNUukvys_mY-MxuCTw3REuX82Etux3Dej8gH_uXJG1OHlFH0VAEWWBVXHy6yuNniYEqqYFndSLcgy3h_LXbQ4o0PNJpVZd0g55M72RVPp9wx0GDKRWy-en_IBSUwjkup6vd_x-miSPsxp6WqSRqjGe-LvDNTigJCp-LiQA1JLdhQndFu7pulnlPivEhKzPdisrOslKm0E9rMUfMZl5vADYjKSPzpJM8i31p8swpmYBEisw" />
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div 
              onClick={() => navigate('/disputes')}
              className="flex items-center gap-2 text-neutral-400 text-sm hover:text-white transition-colors cursor-pointer w-fit"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Back to all claims</span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-white"
            >
              Dispute #{id || '88241'}
            </motion.h1>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-full border border-white/10">Under Review</span>
              <span className="text-neutral-400 text-xs font-bold flex items-center gap-1 uppercase tracking-wide">
                <span className="material-symbols-outlined text-sm">calendar_today</span> Oct 12, 2023
              </span>
              <span className="text-neutral-400 text-xs font-bold flex items-center gap-1 uppercase tracking-wide">
                <span className="material-symbols-outlined text-sm">category</span> Billing Discrepancy
              </span>
            </div>
          </div>

          {/* Description */}
          <section className="bg-surface-container-low p-8 rounded-3xl relative overflow-hidden group border border-white/5 shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 to-transparent"></div>
            <h3 className="text-lg font-headline font-bold mb-4 text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-white">description</span>
              Original Description
            </h3>
            <p className="text-neutral-400 leading-relaxed text-sm">
              The charge for the LPG delivery on October 5th shows an excess of 15.4 units compared to the meter reading provided at the time of delivery. I have attached the photographic evidence of the meter before and after the technician arrived. The billed amount is $142.50 higher than the calculated rate based on the physical meter levels.
            </p>
          </section>

          {/* Evidence */}
          <section className="space-y-6">
            <h3 className="text-lg font-headline font-bold text-white flex items-center gap-3">
              <span className="material-symbols-outlined text-white">attachment</span>
              Evidence & Documentation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {[
                'https://lh3.googleusercontent.com/aida-public/AB6AXuDyxQovDczIxLSQLXvyByOaRs6WfiSvuswi6t8igTNG2yi9Bb6wIirhZV-UEurlgDZJjhv4Lu2wX89roJVToX6M8d710ksyxHj1gS014XQmQjqgwrEuQJwqKMvKVwBG7VZioqrxEdAK83qSU5QHzcHv_HraetSDVazCnWpun-GF67vUVJd6D9tb5PK5LxlDrOM-fYFH32dvNgzSIwVrIEXC8l_bpllffODXiiv501l_k_NKMJjd7E1ccZ58y8krC-xLw2aFOqhxJw',
                'https://lh3.googleusercontent.com/aida-public/AB6AXuBx8ZInfBMh-1Kwtqz1ufYxM9LaHTi4gfXy-OC8Z5Ypk4xuDeLMhLYDp5_TLHFS_xfpofCkXPVN0JEdN0i4aQr4QsthQRV-A5sN5odKtZRJIloVvewEP7GgOf6o16KywXHRsk8DgnhDHNDSTMKUupHWCPgKlJb1YQD21tDq2oRJOwCE3M_UBsiPNBDD1Q57UDy7UfDiJehf6Wm-6kRHrFFE1foebgtL9UwtLq-XUrbyBskU_EamvLeX_-KyZthr5J-pbMNsAlKEDw'
              ].map((src, i) => (
                <div key={i} className="aspect-square bg-surface-container rounded-2xl overflow-hidden border border-white/5 group relative cursor-zoom-in">
                  <img src={src} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" alt="Evidence" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                </div>
              ))}
              <div className="flex flex-col justify-center items-center bg-white/[0.02] border-2 border-dashed border-white/5 rounded-2xl p-6 text-center hover:bg-white/5 transition-all cursor-pointer group">
                <span className="material-symbols-outlined text-3xl text-neutral-500 mb-2 group-hover:text-white transition-all">add_a_photo</span>
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest group-hover:text-white transition-all">Add more proof</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Timeline */}
          <section className="bg-surface-container p-8 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-10">Process Timeline</h3>
            <div className="space-y-10 relative">
              <div className="absolute left-3.5 top-2 bottom-2 w-px bg-white/5"></div>
              
              <div className="relative flex gap-4 opacity-20">
                <div className="z-10 w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center border border-white/10 group">
                  <span className="material-symbols-outlined text-xs">check</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Resolved</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest">Estimated: Oct 24</p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="z-10 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <span className="material-symbols-outlined text-xs text-black font-black">visibility</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Under Review</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest font-mono">Assigned: Oct 14</p>
                </div>
              </div>

              <div className="relative flex gap-4">
                <div className="z-10 w-7 h-7 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-xs text-secondary">done_all</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Claim Raised</p>
                  <p className="text-[10px] text-neutral-500 uppercase font-black tracking-widest font-mono">Filed: Oct 12</p>
                </div>
              </div>
            </div>
          </section>

          {/* Chat */}
          <section className="bg-surface-container-low rounded-3xl flex flex-col h-[500px] border border-white/5 shadow-2xl overflow-hidden">
            <div className="p-5 bg-surface-container border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                <span className="text-xs font-black uppercase tracking-widest text-white">Inspector Chat</span>
              </div>
              <span className="text-[9px] text-neutral-500 font-black uppercase tracking-widest">Online</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none">
              <div className="flex flex-col items-start max-w-[90%]">
                <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none text-xs text-neutral-300 leading-relaxed border border-white/5">
                  Hello, I'm Sarah from the resolution team. I'm currently reviewing your meter photos. Could you clarify if the seal on the valve was intact during delivery?
                </div>
                <span className="text-[9px] text-neutral-500 mt-2 font-bold uppercase tracking-widest ml-1">Sarah J. • 10:15 AM</span>
              </div>
              
              <div className="flex flex-col items-end self-end max-w-[90%]">
                <div className="bg-white text-black p-4 rounded-2xl rounded-tr-none text-xs leading-relaxed font-bold shadow-xl">
                  Yes, the seal was intact. I checked it immediately before the delivery person started.
                </div>
                <span className="text-[9px] text-neutral-500 mt-2 font-bold uppercase tracking-widest mr-1">You • 10:22 AM</span>
              </div>
            </div>

            <div className="p-5 bg-white/[0.01] border-t border-white/5">
              <div className="relative flex items-center">
                <input 
                  className="w-full bg-surface-container-lowest border-none rounded-xl py-4 pl-4 pr-12 text-xs focus:ring-1 focus:ring-white/20 text-white placeholder:text-neutral-700 outline-none transition-all" 
                  placeholder="Type a message..." 
                  type="text" 
                />
                <button className="absolute right-4 text-white hover:scale-110 transition-transform active:scale-95">
                  <span className="material-symbols-outlined text-[20px] font-black">send</span>
                </button>
              </div>
            </div>
          </section>
        </aside>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 md:hidden bg-black/90 backdrop-blur-xl border-t border-white/5 z-50">
        <button onClick={() => navigate('/disputes')} className="flex flex-col items-center text-white scale-110">
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[10px] mt-1 font-bold">Disputes</span>
        </button>
        <button className="flex flex-col items-center text-neutral-500">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-[10px] mt-1">New Claim</span>
        </button>
        <button className="flex flex-col items-center text-neutral-500">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
