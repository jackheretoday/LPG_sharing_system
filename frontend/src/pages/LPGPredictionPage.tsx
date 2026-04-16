import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Cpu, 
  BrainCircuit, 
  History,
  Info,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { LPGTracker } from '../components/LPGTracker';
import { LPGAlertNotification } from '../components/LPGAlertNotification';
import { getToken } from '@/lib/trustAuth';
import { Navbar } from '@/components/Navbar';
import { Badge } from '@/components/ui/badge';

interface ModelMetric {
  metric_date: string;
  total_predictions: number;
  accurate_predictions: number;
  average_accuracy_percentage: number;
  average_error_days: number;
}

interface OverallMetrics {
  totalPredictions: number;
  accuratePredictions: number;
  accuracy_percentage: string;
  average_error_days: string;
}

export const LPGPredictionPage: React.FC = () => {
  const [metrics, setMetrics] = useState<OverallMetrics | null>(null);
  const [historicalMetrics, setHistoricalMetrics] = useState<ModelMetric[]>([]);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  const rawApiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const API_BASE = String(rawApiBase).replace(/\/$/, '').endsWith('/api')
    ? String(rawApiBase).replace(/\/$/, '')
    : `${String(rawApiBase).replace(/\/$/, '')}/api`;
  const token = getToken() || localStorage.getItem('token');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE}/lpg/metrics/model`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setMetrics(data.metrics.overall);
          setHistoricalMetrics(data.metrics.historical);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, [API_BASE, token]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500 selection:text-black overflow-x-hidden font-sans">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      {/* Alert Notification Bell */}
      <LPGAlertNotification token={token || ''} apiBase={API_BASE} pollInterval={60000} />

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32">
        {/* Cinematic AI Header */}
        <section className="mb-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-500/5 border border-blue-500/10 rounded-full">
                    <BrainCircuit className="w-3.5 h-3.5 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400/80">Neural_Engine_Online</span>
                </div>
                
                <div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.85] mb-4">
                        AI Usage <br /> <span className="text-transparent border-text">Forecasting</span>
                    </h1>
                    <p className="max-w-2xl text-neutral-400 text-lg font-medium leading-relaxed italic">
                        Deploying recursive neural networks to analyze consumption physics. 
                        Predicting resource depletion with 98% accuracy via low-latency telemetry.
                    </p>
                </div>
            </motion.div>
        </section>

        {/* Global Model Metrics Overlay */}
        {!loadingMetrics && metrics && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16"
          >
            {[
              { label: 'Total Predictions', value: metrics.totalPredictions, icon: Activity, color: 'text-blue-400', sub: 'Calculated' },
              { label: 'Accurate Results', value: metrics.accuratePredictions, icon: CheckCircle, color: 'text-emerald-400', sub: 'Verified' },
              { label: 'Model Confidence', value: `${metrics.accuracy_percentage}%`, icon: Zap, color: 'text-blue-500', sub: 'Precision' },
              { label: 'Average Variance', value: `±${metrics.average_error_days}d`, icon: AlertTriangle, color: 'text-amber-500', sub: 'Tolerance' }
            ].map((m, i) => (
                <div key={i} className="hub-glass p-8 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[40px] rounded-full group-hover:bg-white/10 transition-all" />
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <div className={`p-4 bg-white/5 rounded-2xl mb-6 ${m.color}`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">{m.label}</p>
                        <p className={`text-4xl font-black italic tracking-tighter ${m.color}`}>{m.value}</p>
                        <p className="mt-2 text-[8px] font-bold text-neutral-600 uppercase tracking-widest">{m.sub}</p>
                    </div>
                </div>
            ))}
          </motion.div>
        )}

        {/* Two-Column Operation Center */}
        <div className="flex flex-col xl:flex-row gap-12 mb-16">
            {/* Left: Tracker Operation */}
            <div className="flex-1">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="hub-glass rounded-[3.5rem] border border-white/5 overflow-hidden shadow-2xl relative"
                >
                    <div className="bg-white/[0.03] border-b border-white/5 p-8 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <Cpu className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black uppercase italic tracking-tighter">Sensor Telemetry</h2>
                                <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">Live_Node_Interface</p>
                            </div>
                        </div>
                        <Badge className="bg-emerald-500 text-black border-none px-3 py-1 text-[8px] font-black tracking-[0.2em]">CONNECTED</Badge>
                    </div>
                    <div className="p-8 bg-[#0a0a0a]/50">
                        <LPGTracker />
                    </div>
                </motion.div>
            </div>

            {/* Right: Intelligence & Documentation */}
            <div className="xl:w-96 space-y-8">
                {/* How It Works Cinematic */}
                <div className="hub-glass p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 blur-[60px] rounded-full" />
                    <div className="relative z-10 space-y-8">
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter flex items-center gap-3">
                            <Info className="w-5 h-5 text-blue-400" /> Logic_Core
                        </h3>
                        <div className="space-y-6">
                            {[
                                { t: 'INITIATE', d: 'Register cylinders with initial mass telemetry' },
                                { t: 'TRACK', d: 'Log consumption cycles for behavioral extraction' },
                                { t: 'FORECAST', d: 'Autonomous calculation of depletion vectors' },
                                { t: 'REINFORCE', d: 'ML refinement through user feedback loops' }
                            ].map((s, i) => (
                                <div key={i} className="flex gap-4 group">
                                    <div className="text-[10px] font-black text-blue-500 mt-1">{`0${i+1}`}</div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest text-white group-hover:text-blue-400 transition-colors">{s.t}</p>
                                        <p className="text-[10px] text-neutral-500 leading-relaxed italic">{s.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Training CTA */}
                <div className="hub-glass p-8 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/[0.02] space-y-4">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        <h4 className="text-sm font-black uppercase tracking-[0.2em] italic">Model Refinement</h4>
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-relaxed italic">
                        Feedback loops increase neural confidence. Verified actual empty dates are used to recalibrate prediction layers dynamically.
                    </p>
                    <button className="text-[9px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2 group">
                        Submit Telemetry <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>

        {/* Historical Analysis Grid */}
        {historicalMetrics.length > 0 && (
          <motion.section 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="hub-glass rounded-[3rem] border border-white/5 overflow-hidden"
          >
            <div className="bg-white/[0.03] p-10 flex items-center gap-4">
                <History className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Temporal Analytics</h2>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600">Scan_Date</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 text-center">Batch_Size</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 text-center">Verified_Accuracy</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.4em] text-neutral-600 text-right">Variance_Delta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {historicalMetrics.slice(0, 10).map((metric, idx) => (
                    <tr key={idx} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-6 text-xs font-bold text-neutral-400 font-mono">
                        {new Date(metric.metric_date).toLocaleDateString()}
                      </td>
                      <td className="px-8 py-6 text-center text-sm font-black italic">
                        {metric.total_predictions}
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className="text-emerald-500 font-black italic text-lg px-4 py-1.5 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                          {metric.average_accuracy_percentage}%
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="inline-flex items-center gap-2 text-amber-500 text-xs font-black italic">
                            <span className="text-[10px] text-neutral-600 uppercase">±</span>
                            {parseFloat(String(metric.average_error_days)).toFixed(2)}d
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.section>
        )}
      </main>

      <style>{`
        .border-text {
            -webkit-text-stroke: 1px rgba(255,255,255,0.2);
            color: transparent;
        }
        .hub-glass {
            background: rgba(10, 10, 10, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
      `}</style>
    </div>
  );
};

export default LPGPredictionPage;
