import { motion } from 'framer-motion';

export default function AdminDisputes() {
  return (
    <div className="bg-[#0e0e0e] text-[#e2e2e2] h-screen overflow-hidden font-body flex transition-all duration-500">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col h-full w-64 border-r border-white/5 bg-black/50 backdrop-blur-3xl p-6 gap-8">
        <div>
          <h1 className="text-xl font-bold text-white font-headline tracking-tighter">Admin Console</h1>
          <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500 font-black mt-1">Dispute Control</p>
        </div>
        
        <nav className="flex-grow space-y-1">
          {[
            { icon: 'dashboard', label: 'Overview' },
            { icon: 'gavel', label: 'All Claims', active: true },
            { icon: 'assignment_late', label: 'Inspector Queue' },
            { icon: 'history', label: 'Audit Log' },
          ].map((item) => (
            <a 
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                item.active 
                ? 'bg-white text-black shadow-2xl' 
                : 'text-neutral-500 hover:bg-white/5 hover:text-white'
              }`} 
              href="#"
            >
              <span className="material-symbols-outlined text-sm">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="mt-auto space-y-6">
          <button className="w-full py-3 bg-white/5 text-white border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            Generate Report
          </button>
          <div className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
            <img className="w-10 h-10 rounded-full border border-white/10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD1hUO-Xk2FoUqgCKcKJhjv88a-st1vi2h8ejdA-5q8DLqy-q-CSnVyajTASU0Wwby51N5MseeSRpvjKoQMPooJhPKlHHOMxkp4cl60-fEUlL_wGj-ejqJTF3AUG66hAdT3q41HlHnaez522D0tpm1HyCNdbJQtQMoEDTtEfTVAxQS6_IIFMPZb2R23huMTlKcw5PCoJ3DjeO7HFtr3GM8vHesSyfhtyHT1cdLLQ4Frm7TLkvvn121zg933PIkqWkVL_a_GdHhmVA" />
            <div className="flex flex-col">
              <span className="text-xs font-black text-white">Alex Rivera</span>
              <span className="text-[9px] text-neutral-500 font-bold uppercase tracking-widest">Senior Admin</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-surface relative">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-black/20 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <span className="text-white font-bold tracking-tighter">LPG Resolve</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 text-sm">search</span>
              <input className="bg-white/5 border-none rounded-full pl-9 pr-4 py-1.5 text-xs w-64 text-white placeholder:text-neutral-700 outline-none" placeholder="Search disputes..." />
            </div>
            <button className="text-neutral-500 hover:text-white transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 space-y-12 pb-32 scrollbar-none">
          <header className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-2">
              <h2 className="text-4xl font-headline font-black tracking-tighter text-white">Dispute Management</h2>
              <p className="text-neutral-500 max-w-xl text-sm leading-relaxed">Review and resolve claims across the community. Prioritize high-impact cases and maintain structural integrity.</p>
            </div>
            <div className="flex gap-3">
              {[
                { label: 'Pending', val: '24' },
                { label: 'High Priority', val: '08', highlight: true },
                { label: 'Resolved', val: '142', dim: true }
              ].map((s) => (
                <div key={s.label} className="bg-white/5 p-5 rounded-2xl min-w-[120px] border border-white/5 shadow-xl">
                  <span className={`text-[9px] font-black tracking-widest uppercase ${s.highlight ? 'text-red-500' : 'text-neutral-500'}`}>{s.label}</span>
                  <div className={`text-3xl font-black mt-2 ${s.dim ? 'text-neutral-600' : 'text-white'}`}>{s.val}</div>
                </div>
              ))}
            </div>
          </header>

          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-white text-black">All Claims</button>
                  <button className="px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-neutral-500 hover:text-white transition-all">Pending</button>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-neutral-500 hover:text-white">
                  <span className="material-symbols-outlined text-sm">filter_list</span> Sort: Newest
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { id: '9241', title: 'Boundary Wall Structural Integrity', user: 'John Doe', date: 'Oct 12, 2023', priority: 'high' },
                  { id: '8802', title: 'Lawn Maintenance Compliance', user: 'Sarah Smith', date: 'Oct 11, 2023' },
                  { id: '8755', title: 'Unauthorized Exterior Paint Change', user: 'Mike Johnson', date: 'Oct 10, 2023' }
                ].map((claim) => (
                  <motion.div 
                    key={claim.id}
                    whileHover={{ x: 4 }}
                    className={`bg-white/5 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-white/5 group ${claim.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {claim.priority === 'high' && (
                          <span className="text-[8px] font-black bg-red-500 text-black px-2 py-0.5 rounded tracking-widest">HIGH PRIORITY</span>
                        )}
                        <span className="text-[10px] text-neutral-500 font-bold font-mono">#DIS-{claim.id}</span>
                      </div>
                      <h3 className="text-xl font-bold text-white font-headline tracking-tight">{claim.title}</h3>
                      <div className="flex items-center gap-4 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">person</span> {claim.user}</span>
                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">calendar_today</span> {claim.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="px-5 py-2.5 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 hover:bg-white/10 transition-all">Details</button>
                      <button className="px-5 py-2.5 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:opacity-90 shadow-2xl transition-all">Resolve</button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <aside className="lg:col-span-4 lg:sticky lg:top-8">
              <div className="bg-white/5 backdrop-blur-3xl p-8 rounded-3xl border border-white/10 shadow-3xl space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h3 className="text-lg font-bold text-white font-headline">Resolution Hub</h3>
                  <span className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Selected: #DIS-9241</span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 mb-3 block font-black">Inspector Notes</label>
                    <textarea 
                      className="w-full bg-black/40 border border-white/5 rounded-2xl text-xs text-white p-4 focus:ring-1 focus:ring-white/20 outline-none resize-none placeholder:text-neutral-800"
                      placeholder="Add detailed inspection observations..."
                      rows={5}
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.2em] text-neutral-500 mb-3 block font-black">Quick Actions</label>
                    {[
                      { label: 'Approve Claim', icon: 'task_alt', color: 'text-emerald-500' },
                      { label: 'Request Info', icon: 'mail', color: 'text-neutral-400' },
                      { label: 'Reject Claim', icon: 'cancel', color: 'text-red-500' }
                    ].map((btn) => (
                      <button key={btn.label} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 group">
                        <div className="flex items-center gap-3">
                          <span className={`material-symbols-outlined text-lg ${btn.color}`}>{btn.icon}</span>
                          <span className="text-xs font-bold text-white">{btn.label}</span>
                        </div>
                        <span className="material-symbols-outlined text-xs text-neutral-600 transition-transform group-hover:translate-x-1">chevron_right</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5">
                  <button className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-2xl hover:scale-[1.02] shadow-2xl transition-all active:scale-[0.98]">
                    Finalize Resolution
                  </button>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </div>
  );
}
