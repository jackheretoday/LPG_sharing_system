import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 font-body selection:bg-white selection:text-black overflow-hidden relative">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="hub-glass glass-edge rounded-3xl p-10 md:p-12 border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.6)] text-center">
          
          <div className="mb-12">
            <div className="w-20 h-20 bg-white rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-black font-headline font-black text-4xl mt-[-2px]">A</span>
            </div>
            <h1 className="text-4xl font-headline font-black text-white tracking-tighter mb-2">Amity Hub</h1>
            <p className="text-on-surface-variant font-medium tracking-wide flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LPG Emergency Gateway
            </p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full bg-white text-black py-4 rounded-xl font-headline font-black text-sm tracking-tight hover:bg-[#C9C6C0] active:scale-[0.98] transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-3 group"
            >
              <span className="material-symbols-outlined !text-xl group-hover:translate-x-1 transition-transform">person_search</span>
              Demo Customer Side
            </button>

            <button 
              onClick={() => navigate('/mechanic')}
              className="w-full bg-surface-container-high text-white py-4 rounded-xl font-headline font-black text-sm tracking-tight hover:bg-white/10 active:scale-[0.98] transition-all border border-white/5 flex items-center justify-center gap-3 group"
            >
              <span className="material-symbols-outlined !text-xl group-hover:translate-x-1 transition-transform">engineering</span>
              Demo Mechanic Portal
            </button>

            <button 
              onClick={() => navigate('/admin')}
              className="w-full bg-transparent text-on-surface-variant py-4 rounded-xl font-headline font-black text-[11px] tracking-widest uppercase hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              <span className="material-symbols-outlined !text-lg">admin_panel_settings</span>
              Root Admin Access
            </button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-4">
            <p className="text-[10px] text-on-surface-variant/40 font-black uppercase tracking-[0.2em] mb-2 leading-relaxed">
              Secured by decentralized verification protocols
            </p>
            <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
               <span className="material-symbols-outlined !text-2xl">verified_user</span>
               <span className="material-symbols-outlined !text-2xl">shield_with_heart</span>
               <span className="material-symbols-outlined !text-2xl">security</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
