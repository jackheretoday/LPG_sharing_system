import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Disputes() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0e0e0e] text-[#e2e2e2] min-h-screen font-body selection:bg-white selection:text-black antialiased relative overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16 flex justify-between items-center px-8">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-white font-headline tracking-tighter">LPG Resolve</span>
          <div className="hidden md:flex gap-6 items-center">
            <a className="text-neutral-400 hover:text-white transition-colors font-medium text-sm" href="#">Dashboard</a>
            <a className="text-white border-b-2 border-white pb-1 font-medium text-sm">My Disputes</a>
            <a className="text-neutral-400 hover:text-white transition-colors font-medium text-sm" href="#">Resources</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-neutral-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden border border-white/10">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQZ7QoUHbarXVyDEEtP8SPrJ40oHKRJr05hXschfyWP3XWV16SFQxoOWRxnd742PP0sOCn1Fq_FmqA2-fYqeC6Bif8Zr4Y8gRqRmPVYqnYGkBBrNrmcHdesFHe4T8_6kTwLYozsAwGuWzbzW3MbWne8KDFZxM5toX6a7d8jArkBJzx3OMq7MBySKNJghyr2MR3BaYMpy63Csmne2URNgBsaQ2j9CLIhZ0WzDSGecp2wxThzlNg89zI7OIlo61hi9Xf3JSr6o6yHw" />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-extrabold font-headline tracking-tighter text-white mb-2"
          >
            My Disputes
          </motion.h1>
          <p className="text-on-surface-variant font-body mb-6">Track and manage your submitted resolution requests.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Active Claims', val: '08' },
            { label: 'Awaiting Review', val: '03' }
          ].map((stat) => (
            <div key={stat.label} className="bg-surface-container rounded-2xl p-8 border border-white/5 shadow-xl flex flex-col justify-between h-40">
              <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">{stat.label}</span>
              <span className="text-6xl font-black font-headline text-white mt-auto">{stat.val}</span>
            </div>
          ))}
          <div className="bg-surface-container-high p-8 rounded-2xl border border-white/5 flex flex-col justify-between group cursor-pointer hover:bg-white/5 transition-all h-40">
            <div className="space-y-2">
              <span className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">Need Help?</span>
              <p className="text-white text-sm font-medium leading-relaxed">Contact our 24/7 support team for immediate assistance.</p>
            </div>
            <div className="mt-auto flex items-center text-white font-black text-xs uppercase tracking-widest group-hover:translate-x-1 transition-transform">
              Reach Out <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['All Disputes', 'Open', 'In Review', 'Resolved'].map((f, i) => (
            <button 
              key={f} 
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                i === 0 ? 'bg-white text-black' : 'bg-surface-container hover:bg-white/10 text-neutral-400'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Disputes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[
            { id: '#LPG-99201-X', title: 'Cylinder Not Delivered', date: 'Oct 24, 2023', status: 'Open', color: 'amber-400' },
            { id: '#LPG-88412-A', title: 'Damaged Valve Assembly', date: 'Oct 21, 2023', status: 'In Review', color: 'blue-400' },
            { id: '#LPG-77103-B', title: 'Incorrect Billing Amount', date: 'Oct 15, 2023', status: 'Resolved', color: 'emerald-400' }
          ].map((d) => (
            <motion.div 
              key={d.id}
              whileHover={{ y: -4 }}
              onClick={() => navigate(`/disputes/${d.id.replace('#', '')}`)}
              className="bg-surface-container rounded-3xl p-8 border border-white/5 hover:bg-white/5 transition-all shadow-xl group cursor-pointer"
            >
              <div className="flex justify-between items-start mb-10">
                <div className="space-y-4">
                  <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-white">
                    <span className={`w-1.5 h-1.5 rounded-full mr-2 bg-${d.color}`}></span>
                    {d.status}
                  </div>
                  <h3 className="text-2xl font-bold font-headline text-white leading-tight">{d.title}</h3>
                </div>
                <span className="text-on-surface-variant text-xs font-bold font-mono">{d.date}</span>
              </div>
              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex flex-col">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-[0.2em] font-bold">Order ID</span>
                  <span className="text-sm font-black text-white">{d.id}</span>
                </div>
                <span className="material-symbols-outlined text-white/20 group-hover:text-white transition-colors">chevron_right</span>
              </div>
            </motion.div>
          ))}
          
          <div 
            onClick={() => navigate('/disputes/new/temp')}
            className="p-8 rounded-3xl border-2 border-dashed border-white/5 flex flex-col items-center justify-center min-h-[220px] group cursor-pointer hover:border-white/20 transition-all bg-white/[0.02]"
          >
            <span className="material-symbols-outlined text-4xl text-white/20 group-hover:text-white mb-2 transition-all">add_circle</span>
            <span className="text-white/40 font-bold uppercase tracking-widest text-xs group-hover:text-white transition-all">Report New Issue</span>
          </div>
        </div>
      </main>

      {/* FAB */}
      <button 
        onClick={() => navigate('/disputes/new/temp')}
        className="fixed bottom-24 right-10 w-16 h-16 rounded-full bg-white text-black shadow-2xl hidden md:flex items-center justify-center hover:scale-105 transition-all active:scale-95 z-40"
      >
        <span className="material-symbols-outlined text-3xl font-black">add</span>
      </button>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 md:hidden bg-[#131313]/90 backdrop-blur-xl border-t border-white/5 z-50">
        <button className="flex flex-col items-center text-white font-bold scale-110">
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[10px] mt-1">Disputes</span>
        </button>
        <button onClick={() => navigate('/disputes/new/temp')} className="flex flex-col items-center text-neutral-500">
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
