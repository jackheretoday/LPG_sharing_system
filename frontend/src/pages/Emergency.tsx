import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SeverityForm } from '../components/SeverityForm';

export default function Emergency() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface text-on-surface p-6 md:p-12 flex flex-col items-center justify-center font-body selection:bg-white selection:text-black relative">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[50vh] bg-red-500/5 blur-[120px] pointer-events-none"></div>

      <div className="max-w-3xl w-full relative z-10">
         <motion.div 
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           className="flex items-center gap-4 mb-12"
         >
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-3 hover:bg-white/5 rounded-xl transition-all text-on-surface-variant flex items-center justify-center border border-white/5"
            >
              <span className="material-symbols-outlined !text-2xl">arrow_back</span>
            </button>
            <div>
              <h1 className="text-4xl font-headline font-black text-white tracking-tighter">Emergency Assessment</h1>
              <p className="text-on-surface-variant text-sm font-medium tracking-wide">Rapid response activation protocol</p>
            </div>
         </motion.div>

         <motion.div 
           initial={{ opacity: 0, scale: 0.98 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ delay: 0.2 }}
           className="hub-glass glass-edge border border-white/5 p-10 md:p-12 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.6)]"
         >
            <div className="flex items-start gap-6 mb-10 pb-8 border-b border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <span className="material-symbols-outlined !text-4xl animate-pulse">priority_high</span>
              </div>
              <p className="text-white/80 font-light text-xl leading-relaxed">
                Please stay calm. Your safety is our priority. Answer these critical questions to help us deploy the specific specialized assistance required for your situation.
              </p>
            </div>

            <div className="space-y-8">
              <SeverityForm />
            </div>

            <div className="mt-12 flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
               <span className="material-symbols-outlined text-on-surface-variant">info</span>
               <p className="text-[11px] text-on-surface-variant uppercase tracking-widest font-black leading-tight">
                 Identity and location data will be shared with the emergency response unit upon submission.
               </p>
            </div>
         </motion.div>
      </div>
    </div>
  );
}
