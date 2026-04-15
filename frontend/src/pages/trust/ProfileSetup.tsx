import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function ProfileSetup() {
  const navigate = useNavigate();
  const [role, setRole] = useState<'consumer' | 'mechanic'>('consumer');

  const handleComplete = () => {
    navigate('/trust/me');
  };

  return (
    <div className="flex min-h-screen bg-surface-container-lowest text-on-surface antialiased overflow-x-hidden font-body selection:bg-primary selection:text-on-primary">
      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col h-screen p-4 gap-4 bg-neutral-900/80 backdrop-blur-2xl border-r border-neutral-50/10 w-64 fixed left-0 top-0 z-50">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">verified_user</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-neutral-50 font-headline tracking-tighter">Lumina Utility</h1>
            <p className="text-[10px] text-neutral-400 font-medium">Verified Provider</p>
          </div>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          {['Emergency', 'Providers', 'Community', 'Verification', 'Settings'].map((item) => (
            <a 
              key={item}
              className={`flex items-center gap-3 px-4 py-3 transition-all font-medium text-sm rounded-md ${
                item === 'Verification' 
                  ? 'bg-neutral-50 text-neutral-950 font-bold shadow-lg' 
                  : 'text-neutral-400 hover:bg-neutral-800/50 hover:translate-x-1'
              }`} 
              href="#"
            >
              <span className="material-symbols-outlined">
                {item === 'Emergency' ? 'emergency_heat' : 
                 item === 'Providers' ? 'local_gas_station' :
                 item === 'Community' ? 'groups' :
                 item === 'Verification' ? 'verified_user' : 'settings'}
              </span>
              <span>{item}</span>
            </a>
          ))}
        </nav>
        <div className="mt-auto">
          <button className="w-full py-3 bg-neutral-800 text-neutral-50 rounded-md text-xs font-bold uppercase tracking-widest hover:bg-neutral-700 transition-colors">
            Request Emergency Refill
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:ml-64 bg-surface-container-lowest min-h-screen px-6 py-12 md:px-16 md:py-20 lg:px-24 relative">
        {/* Background Aesthetic Elements */}
        <div className="fixed top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
        <div className="fixed bottom-[-5%] left-[10%] w-[30%] h-[30%] bg-surface-bright/20 blur-[100px] rounded-full -z-10 pointer-events-none"></div>

        {/* Header Section */}
        <header className="mb-16 max-w-4xl relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold tracking-widest uppercase">Profile Setup</span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high border border-white/5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-[10px] font-semibold text-on-surface-variant">Pending Verification</span>
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-4">Identity <span className="text-outline">&amp;</span> Role</h1>
          <p className="text-on-surface-variant max-w-xl text-lg leading-relaxed">Configure your workspace identity. Choose your primary role to unlock specialized utility features within the Lumina ecosystem.</p>
        </header>

        {/* Role Selection Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl relative z-10">
          <div 
            onClick={() => setRole('consumer')}
            className={`group relative glass-card p-8 rounded-xl cursor-pointer transition-all duration-500 border border-white/5 ${role === 'consumer' ? 'bg-primary/5 border-primary/20' : 'hover:bg-surface-container-highest/40'}`}
          >
            <div className={`mb-8 w-14 h-14 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${role === 'consumer' ? 'bg-primary' : 'bg-surface-container'}`}>
              <span className={`material-symbols-outlined text-3xl ${role === 'consumer' ? 'text-on-primary' : 'text-primary'}`}>person</span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Consumer</h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Access maintenance logs, directory of verified mechanics, and real-time utility tracking.</p>
            <div className="flex items-center text-primary text-xs font-bold tracking-widest uppercase">
              {role === 'consumer' ? (
                <>
                  <span className="material-symbols-outlined mr-2 text-sm">check_circle</span>
                  <span>Selected Profile</span>
                </>
              ) : (
                <>
                  <span>Select Role</span>
                  <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </>
              )}
            </div>
            <div className={`absolute inset-0 border-2 border-primary rounded-xl transition-opacity ${role === 'consumer' ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>

          <div 
            onClick={() => setRole('mechanic')}
            className={`group relative glass-card p-8 rounded-xl cursor-pointer transition-all duration-500 border border-white/5 ${role === 'mechanic' ? 'bg-primary/5 border-primary/20' : 'hover:bg-surface-container-highest/40'}`}
          >
            <div className={`mb-8 w-14 h-14 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110 ${role === 'mechanic' ? 'bg-primary' : 'bg-surface-container'}`}>
              <span className={`material-symbols-outlined text-3xl ${role === 'mechanic' ? 'text-on-primary' : 'text-primary'}`}>build</span>
            </div>
            <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Mechanic/Provider</h3>
            <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Manage service requests, verification badges, and connect with local community consumers.</p>
            <div className="flex items-center text-primary text-xs font-bold tracking-widest uppercase">
              {role === 'mechanic' ? (
                <>
                  <span className="material-symbols-outlined mr-2 text-sm">check_circle</span>
                  <span>Selected Profile</span>
                </>
              ) : (
                <>
                  <span>Select Role</span>
                  <span className="material-symbols-outlined ml-2 text-sm">arrow_forward</span>
                </>
              )}
            </div>
            <div className={`absolute inset-0 border-2 border-primary rounded-xl transition-opacity ${role === 'mechanic' ? 'opacity-100' : 'opacity-0'}`}></div>
          </div>
        </section>

        {/* Profile Form & Verification */}
        <section className="max-w-5xl relative z-10">
          <div className="flex items-baseline justify-between border-b border-white/5 pb-4 mb-10">
            <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tight">Personal Verification</h2>
            <span className="text-xs text-on-surface-variant font-mono uppercase tracking-widest">Step 02/03</span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-7 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Full Legal Name</label>
                  <input className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 focus:bg-surface-container-high transition-all outline-none" placeholder="Johnathan Doe" type="text" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Aadhaar Number (Masked)</label>
                  <div className="relative">
                    <input className="w-full bg-surface-container-low border-none rounded-md px-4 py-3 text-on-surface focus:ring-1 focus:ring-primary/40 focus:bg-surface-container-high transition-all outline-none" type="password" defaultValue="123456789012" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant text-lg cursor-pointer">visibility_off</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Permanent Residential Address</label>
                <textarea className="w-full bg-surface-container-low border-none rounded-md px-4 py-4 text-on-surface placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-primary/40 focus:bg-surface-container-high transition-all resize-none outline-none" placeholder="Enter your full verifiable address..." rows={4}></textarea>
              </div>
            </div>
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant px-1">Identity Proof (Aadhaar/Address)</label>
                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-xl p-10 hover:border-primary/40 transition-colors bg-surface-container-low/50 hover:bg-surface-container-low cursor-pointer">
                  <div className="mb-4 w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                  </div>
                  <p className="text-sm font-medium text-on-surface mb-1">Drop documents here</p>
                  <p className="text-[11px] text-on-surface-variant font-medium">PDF, JPEG or PNG up to 10MB</p>
                  <input className="absolute inset-0 opacity-0 cursor-pointer" type="file" disabled />
                </div>
              </div>
              <div className="glass-card p-6 rounded-lg border-l-4 border-amber-500/50 bg-amber-500/5">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-amber-500">info</span>
                  <div>
                    <h4 className="text-sm font-bold text-on-surface mb-1">Verification Processing</h4>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Identity verification typically takes 24-48 hours. You will receive a notification once your profile is verified.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <p className="text-[11px] text-on-surface-variant italic max-w-xs leading-relaxed">By proceeding, you consent to our decentralized verification protocol and privacy standards.</p>
            <div className="flex gap-4 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none px-8 py-3 rounded-md text-sm font-bold text-on-surface-variant hover:text-on-surface transition-colors">Save Draft</button>
              <button 
                onClick={handleComplete}
                className="flex-1 sm:flex-none brushed-metal text-on-primary px-10 py-3 rounded-md text-sm font-bold shadow-2xl hover:opacity-90 transition-all active:scale-95"
              >
                Complete Setup
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
