import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function RaiseDispute() {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/disputes');
  };

  return (
    <div className="bg-[#0e0e0e] text-[#e2e2e2] min-h-screen font-body selection:bg-white selection:text-black antialiased overflow-x-hidden">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl h-16 flex justify-between items-center px-8">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold text-white font-headline tracking-tighter">LPG Resolve</span>
          <div className="hidden md:flex items-center gap-6">
            <a className="text-neutral-400 hover:text-white transition-colors font-medium text-sm" href="#">Dashboard</a>
            <a onClick={() => navigate('/disputes')} className="text-white border-b-2 border-white pb-1 font-medium text-sm cursor-pointer">My Disputes</a>
            <a className="text-neutral-400 hover:text-white transition-colors font-medium text-sm" href="#">Resources</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-neutral-400 hover:text-white transition-colors">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <div className="w-8 h-8 rounded-full bg-white/5 overflow-hidden border border-white/10">
            <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAEQto754UFaLJJYt_J4OkL-o6JSQPTeH6GZ4Sj3Azj7ainfW8P-RqcF9TaNooIZbxffRcWPFQ5Vbdv6vP3AF0-IxYJWe2svMUM5U91yfAmLBXZMIiT90Rvhi-e3MdnNfOgSh1t7WAwgRoPck4UL6IlYAFEEmoE-VN7_oLtQauSGCAR31fbzB7tFj-cqrRvJiYc1Y1zqBnfPMhpI1NhApUEpnkAh8PokK3EsfCrlNlIGC-kGc9IHZsSjF1s6KEIjxVf65PSWE_CQ" />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-4 md:px-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter text-white mb-4"
          >
            Raise a Dispute
          </motion.h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
            We understand that things don't always go as planned. Describe your concern below, and our resolution team will take it from here.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Main Form */}
          <section className="lg:col-span-7">
            <div className="bg-surface-container-low rounded-3xl p-8 border border-white/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Order Reference */}
                <div className="space-y-2">
                  <label className="block font-headline text-sm font-bold tracking-tight text-white uppercase tracking-widest text-[10px]">Order Reference</label>
                  <div className="relative">
                    <select className="w-full bg-surface-container border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-white/20 transition-all appearance-none outline-none">
                      <option>Select an active order</option>
                      <option>#LPG-88291 - Delivered Oct 12</option>
                      <option>#LPG-88104 - Delivered Oct 05</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500">expand_more</span>
                  </div>
                </div>

                {/* Dispute Type */}
                <div className="space-y-2">
                  <label className="block font-headline text-sm font-bold tracking-tight text-white uppercase tracking-widest text-[10px]">Issue Category</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: 'local_shipping', label: 'Delivery' },
                      { icon: 'payments', label: 'Payment' },
                      { icon: 'security', label: 'Safety' },
                      { icon: 'more_horiz', label: 'Other' },
                    ].map((t) => (
                      <label key={t.label} className="cursor-pointer group">
                        <input className="hidden peer" name="type" type="radio" />
                        <div className="p-4 text-center rounded-xl bg-surface-container border border-white/5 peer-checked:border-white/40 peer-checked:bg-white/10 transition-all hover:bg-white/5">
                          <span className="material-symbols-outlined block mb-1 text-neutral-400 group-hover:text-white transition-colors">{t.icon}</span>
                          <span className="text-xs font-bold text-neutral-500 peer-checked:text-white">{t.label}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="block font-headline text-sm font-bold tracking-tight text-white uppercase tracking-widest text-[10px]">Description</label>
                  <textarea 
                    className="w-full bg-surface-container border-none rounded-xl py-4 px-4 text-white focus:ring-1 focus:ring-white/20 transition-all resize-none placeholder:text-neutral-600 outline-none" 
                    placeholder="Tell us exactly what happened..." 
                    rows={5}
                  ></textarea>
                </div>

                {/* File Upload */}
                <div className="space-y-2">
                  <label className="block font-headline text-sm font-bold tracking-tight text-white uppercase tracking-widest text-[10px]">Attach Evidence</label>
                  <div className="border border-dashed border-white/10 rounded-xl p-8 text-center hover:bg-white/5 transition-colors cursor-pointer group">
                    <span className="material-symbols-outlined text-4xl text-neutral-500 mb-2 group-hover:text-white transition-colors">cloud_upload</span>
                    <p className="text-white font-bold text-sm mb-1">Click to upload media</p>
                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Max 10MB • JPG, PNG, PDF</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full brushed-metal text-black font-black uppercase tracking-widest text-xs py-4 rounded-xl hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-2xl active:scale-[0.98]">
                    Submit Dispute
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </button>
                </div>
              </form>
            </div>
          </section>

          {/* Sidebar / Info */}
          <aside className="lg:col-span-5 space-y-8">
            <div className="bg-surface-container-low p-8 rounded-3xl border border-white/5 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10">
                  <span className="material-symbols-outlined text-white">verified_user</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-white">You are heard.</h3>
                  <p className="text-on-surface-variant text-sm font-medium">Fair resolution protocol active.</p>
                </div>
              </div>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                Our resolution system prioritizes fairness. Once submitted, a dispute inspector will review your claim and the evidence provided within 24 hours. You can track progress in your dashboard.
              </p>
            </div>

            <div className="space-y-6 px-4">
              {[
                { step: '01', title: 'Review Phase', desc: 'An inspector reviews your submission against our service level agreements.' },
                { step: '02', title: 'Mediation', desc: 'We contact the relevant partners to verify logs and status reports.' },
                { step: '03', title: 'Resolution', desc: 'Final decision issued. Refunds or credits processed immediately.' }
              ].map((s) => (
                <div key={s.step} className="flex gap-4">
                  <span className="text-white font-black text-2xl opacity-10 font-headline">{s.step}</span>
                  <div>
                    <h4 className="font-bold text-white mb-1">{s.title}</h4>
                    <p className="text-on-surface-variant text-sm leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-2xl border border-white/5 relative group">
              <img className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjPexz2C0B-C01nyjUgrWwqSrjDQ85SXBeOveaFnCzlCq6HH1mFC0P83zj5zQCxFCX42nGCFv8hYjox-v9jKrMPmHP5iBawasT2f-UoKrEGYYoa1Vxn5tUAb_w0SHmPWHG0LKHlW1WIiSYYP2VSi0Esm49UOKRhj07fNaHuDqnQwzbhC3RFKpTskECRMGaJvo7mveR3qXtE1hTbwhmskeHxqVydALgL74Rg2YNoxEVhoeaDH9FmxKO2-zPZRpQKWt0oo--al4E4A" />
              <div className="absolute inset-0 bg-black/40"></div>
            </div>
          </aside>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center py-4 md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10 z-50">
        <button onClick={() => navigate('/disputes')} className="flex flex-col items-center text-neutral-500">
          <span className="material-symbols-outlined">list_alt</span>
          <span className="text-[10px] font-bold mt-1">Disputes</span>
        </button>
        <button className="flex flex-col items-center text-white font-bold scale-110">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="text-[10px] mt-1">New Claim</span>
        </button>
        <button className="flex flex-col items-center text-neutral-500">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px] font-bold mt-1">Profile</span>
        </button>
      </nav>
    </div>
  );
}
