import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SeverityForm } from '../components/SeverityForm';

export default function EmergencyAssessment() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(30,41,59,0.75),rgba(2,6,23,0.98)_55%)] text-slate-100 p-6 md:p-12 flex flex-col items-center justify-center font-body selection:bg-slate-200 selection:text-slate-900 relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[45vh] bg-blue-500/10 blur-[120px] pointer-events-none" />

      <div className="max-w-3xl w-full relative z-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-12">
          <button
            onClick={() => navigate('/emergency')}
            className="p-3 hover:bg-slate-700/40 rounded-xl transition-all text-slate-200 flex items-center justify-center border border-slate-600/50"
          >
            <span className="material-symbols-outlined !text-2xl">arrow_back</span>
          </button>
          <div>
            <h1 className="text-4xl font-headline font-black text-slate-50 tracking-tighter">Emergency Assessment</h1>
            <p className="text-slate-300 text-sm font-medium tracking-wide">Single-page rapid response input</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="assessment-panel p-10 md:p-12 rounded-3xl shadow-[0_40px_100px_rgba(2,6,23,0.65)]"
        >
          <div className="flex items-start gap-6 mb-10 pb-8 border-b border-slate-700/60">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/15 flex items-center justify-center text-blue-300 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <span className="material-symbols-outlined !text-4xl">priority_high</span>
            </div>
            <p className="text-slate-200/90 font-light text-xl leading-relaxed">
              Fill the emergency details once. Submission immediately triggers the response workflow.
            </p>
          </div>

          <SeverityForm />
        </motion.div>
      </div>
    </div>
  );
}
