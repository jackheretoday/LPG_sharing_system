import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const [postType, setPostType] = useState('emergency');

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body selection:bg-white selection:text-black">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8 h-16 w-full shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/community')}
            className="p-2 hover:bg-white/10 rounded-md transition-all text-on-surface-variant flex items-center justify-center"
          >
            <span className="material-symbols-outlined !text-xl">arrow_back</span>
          </button>
          <div className="text-xl font-bold tracking-tighter text-white font-headline">LPG Hub</div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a className="text-white font-manrope tracking-tight text-sm" href="/community">Community</a>
          <a className="text-[#C5C7C1] hover:text-white transition-colors font-manrope tracking-tight text-sm" href="/dashboard">Map</a>
          <a className="text-[#C5C7C1] hover:text-white transition-colors font-manrope tracking-tight text-sm" href="/resources">Resources</a>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-[#C5C7C1] hover:bg-white/10 transition-all rounded-md flex items-center justify-center">
            <span className="material-symbols-outlined !text-xl">notifications</span>
          </button>
          <button className="p-2 text-[#C5C7C1] hover:bg-white/10 transition-all rounded-md flex items-center justify-center">
            <span className="material-symbols-outlined !text-xl">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden bg-surface-container ml-2">
            <img 
              alt="User" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSGsChV4S3BIowSnG5JQu4jMnDOWpsG-G4-LOz9SFIwTJjQwYrNERiNZ2-iLzVvUmPDngccssBsOOYmDKu4rNVSJPRl13hikJhNfeqeVi5CwXl9nWfs_KBnL4C0MiQgvctHmmZkjyKxtRwbYwDtzbPKs0NJgVoQwhEb_XVX6d1TPUuhnp_lkN5MPNmmBA4N_sLrIpVOty88QFAfgY0H-osxo32HsLARWiF6mfnNjFEHwjVIc0MiPzQWebtyEWk8NpNrO6i7fPUAg" 
            />
          </div>
        </div>
      </nav>

      <main className="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
        {/* Header Section */}
        <div className="w-full max-w-4xl mb-12 flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl font-headline font-extrabold tracking-tighter text-white mb-4">
              New <span className="text-on-surface-variant italic font-light">Entry</span>
            </h1>
            <p className="text-on-surface-variant text-lg font-light leading-relaxed">
              Share updates with the LPG community. Whether it's an urgent need or a local stock alert, clarity helps everyone.
            </p>
          </div>
          <div className="hidden md:block pb-2">
            <span className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/40 font-bold tracking-widest">LPG Hub / Workspace / 2026</span>
          </div>
        </div>

        {/* Form Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl hub-glass glass-edge p-8 md:p-12 rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/10"
        >
          <form className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Post Type Selection */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-black">Post Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'emergency', label: 'Emergency Request', icon: 'emergency_home', color: 'text-red-500' },
                  { id: 'availability', label: 'Availability', icon: 'gas_meter' },
                  { id: 'update', label: 'General Update', icon: 'update' }
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setPostType(t.id)}
                    className={`flex items-center gap-3 p-4 rounded-lg transition-all border ${
                      postType === t.id 
                        ? 'bg-white/10 text-white border-white/20' 
                        : 'bg-surface-container-low text-on-surface-variant border-transparent hover:bg-surface-container-high'
                    }`}
                  >
                    <span className={`material-symbols-outlined ${t.color || ''}`}>{t.icon}</span>
                    <span className="font-medium text-sm">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Title */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-black">Title</label>
              <input 
                className="w-full bg-surface-container-low border-none rounded-lg p-4 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-white/20 transition-all shadow-inner" 
                placeholder="A brief, descriptive subject..." 
                type="text"
              />
            </div>

            {/* Description */}
            <div className="col-span-1 md:col-span-2 space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-black">Description</label>
              <textarea 
                className="w-full bg-surface-container-low border-none rounded-lg p-4 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-white/20 transition-all shadow-inner" 
                placeholder="Details about the current situation or availability..." 
                rows={5}
              ></textarea>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-black">Location</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/30 !text-xl">location_on</span>
                <input 
                  className="w-full bg-surface-container-low border-none rounded-lg p-4 pl-12 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-white/20 transition-all shadow-inner" 
                  placeholder="Search area or neighborhood" 
                  type="text"
                />
              </div>
            </div>

            {/* Urgency Level */}
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-on-surface-variant font-black">Urgency Level</label>
              <select className="w-full bg-surface-container-low border-none rounded-lg p-4 text-white focus:ring-1 focus:ring-white/20 transition-all appearance-none cursor-pointer shadow-inner">
                <option value="low">Standard Utility</option>
                <option value="medium">Urgent Need</option>
                <option value="high">Critical / Emergency</option>
              </select>
            </div>

            {/* Cylinder Inventory */}
            <div className="col-span-1 md:col-span-2 p-6 rounded-lg bg-black/40 border border-white/5">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-on-surface-variant">inventory_2</span>
                  <span className="font-headline font-bold text-white tracking-tight">Cylinder Inventory</span>
                </div>
                <span className="text-[10px] text-on-surface-variant/40 uppercase tracking-[0.2em] font-black">Optional</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {['5kg', '12kg', '14kg', 'Comm.'].map((size) => (
                  <div key={size} className="space-y-2">
                    <span className="text-[10px] text-on-surface-variant/60 block font-bold uppercase tracking-widest">{size} Units</span>
                    <input 
                      className="w-full bg-surface-container-low border-none rounded-lg p-4 text-white placeholder:text-on-surface-variant/30 focus:ring-1 focus:ring-white/20 transition-all text-center" 
                      placeholder="0" 
                      type="number"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-1 md:col-span-2 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/5">
              <p className="text-on-surface-variant text-[10px] max-w-sm leading-relaxed uppercase tracking-widest font-medium opacity-50">
                By submitting this post, you agree to provide accurate information to help your community maintain reliable LPG access.
              </p>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <button 
                  onClick={() => navigate('/community')}
                  className="w-full md:w-auto px-8 py-3 text-on-surface-variant hover:text-white transition-colors font-medium text-sm" 
                  type="button"
                >
                  Discard
                </button>
                <button 
                  onClick={() => navigate('/community')}
                  className="w-full md:w-auto px-10 py-4 bg-white text-black font-headline font-black rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-xl text-sm uppercase tracking-tighter" 
                  type="button"
                >
                  Publish Post
                </button>
              </div>
            </div>
          </form>
        </motion.div>

        {/* Secondary Info */}
        <div className="w-full max-w-4xl mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-surface-container p-8 rounded-xl flex flex-col justify-between border border-white/5 group overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-white font-headline font-bold text-xl mb-4">Real-time Map Integration</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-light">Posts tagged with a specific location automatically populate the regional heat map for 24 hours.</p>
            </div>
            <div className="h-40 w-full rounded-lg overflow-hidden grayscale opacity-30 group-hover:opacity-100 transition-opacity duration-700 contrast-125">
              <img alt="Map" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBlryfb6_hg-rA89v94xlqedFPIAXxx_qtGYRDJl4n2C5hzjiV0xnhZOjDohiKE2gngPHusipF7NDkMFBhbj7C2I6bhEkAZDYW3KYgnuqkP0UIH8lK0xBdLdxAMOScaFleRgcTXLItfQ-qUt53mVegI5XR4_gbWB-g729DB2I5cJL8_XQsq80dDXfUccCeu2qAhTJCI-M4hzxluzhVDeSx1t7xUGfHvDFQGmssQJzS_ulX5Rgn7kXMTCPmQgkrkQbtd7XrxnBRWiw" />
            </div>
          </div>
          <div className="bg-surface-bright p-8 rounded-xl flex flex-col justify-center items-center text-center gap-6 border border-white/10 group">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-500">
              <span className="material-symbols-outlined !text-3xl">verified_user</span>
            </div>
            <div>
              <h3 className="text-white font-headline font-bold text-lg mb-2">Trusted Submissions</h3>
              <p className="text-on-surface-variant text-sm font-light">Verified providers receive a badge on their availability updates to ensure authenticity.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-white/5 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="font-headline font-black text-lg tracking-tighter uppercase text-white">LPG Hub</div>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant/40">
            <a className="hover:text-white transition-colors" href="#">Safety Protocols</a>
            <a className="hover:text-white transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-white transition-colors" href="#">Data Transparency</a>
          </div>
          <div className="text-on-surface-variant/30 text-[10px] font-mono">2026 CORE SYSTEM v4.2</div>
        </div>
      </footer>
    </div>
  );
}
