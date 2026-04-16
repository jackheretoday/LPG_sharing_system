import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertCircle, 
  Droplet, 
  TrendingDown, 
  Calendar, 
  Plus, 
  Zap, 
  ShieldCheck, 
  ChevronRight,
  Flame,
  Clock,
  Gauge,
  Database,
  Activity
} from 'lucide-react';
import { getToken } from '@/lib/trustAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Cylinder {
  id: string;
  cylinder_id: string;
  current_weight_kg: number;
  max_capacity_kg: number;
  status: string;
  last_refill_date: string;
  created_at: string;
  updated_at: string;
}

interface Prediction {
  id: string;
  predicted_empty_days: number;
  predicted_empty_date: string;
  daily_avg_usage_kg: number;
  confidence_score: number;
  alert_status: boolean;
}

interface Alert {
  id: string;
  alert_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const LPGTracker: React.FC = () => {
  const [cylinders, setCylinders] = useState<Cylinder[]>([]);
  const [predictions, setPredictions] = useState<Record<string, Prediction>>({});
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCylinder, setSelectedCylinder] = useState<Cylinder | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [usageInput, setUsageInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [formData, setFormData] = useState({
    cylinder_id: '',
    current_weight_kg: '',
    max_capacity_kg: '20',
  });

  const [pendingFeedback, setPendingFeedback] = useState<any[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [activeFeedback, setActiveFeedback] = useState<any>(null);
  const [feedbackDate, setFeedbackDate] = useState('');

  const rawApiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const API_BASE = String(rawApiBase).replace(/\/$/, '').endsWith('/api')
    ? String(rawApiBase).replace(/\/$/, '')
    : `${String(rawApiBase).replace(/\/$/, '')}/api`;
  const token = getToken() || localStorage.getItem('token');

  const fetchCylinders = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/lpg/cylinders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setCylinders(data.data);
        if (data.data.length > 0 && !selectedCylinder) {
          setSelectedCylinder(data.data[0]);
          fetchPredictions(data.data[0].id);
        }
      }
    } catch (error) {
      console.error('Error fetching cylinders:', error);
    }
  };

  const fetchPredictions = async (cylinderId: string) => {
    try {
      const response = await fetch(`${API_BASE}/lpg/predict/${cylinderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success && data.data) {
        setPredictions((prev) => ({ ...prev, [cylinderId]: data.data }));
      }
    } catch (error) {
      console.error('Error fetching predictions:', error);
    }
  };

  const fetchAlerts = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/lpg/alerts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fetching alerts:', error);
    }
  };

  const fetchPendingFeedback = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE}/lpg/feedback/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setPendingFeedback(data.data);
      }
    } catch (error) {
      console.error('Error fetching pending feedback:', error);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await Promise.all([
          fetchCylinders(),
          fetchAlerts(),
          fetchPendingFeedback()
        ]);
      } catch (error) {
        console.error('Initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAddCylinder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    const currentWeight = parseFloat(formData.current_weight_kg);
    const maxCapacity = parseFloat(formData.max_capacity_kg);

    try {
      const response = await fetch(`${API_BASE}/lpg/cylinders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cylinder_id: formData.cylinder_id.trim(),
          current_weight_kg: currentWeight,
          max_capacity_kg: maxCapacity,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCylinders([...cylinders, data.data]);
        setSelectedCylinder(data.data);
        setShowAddForm(false);
        setFormData({ cylinder_id: '', current_weight_kg: '', max_capacity_kg: '20' });
        
        // AUTO-PREDICT: Immediately fetch initial prediction for the new node
        try {
            const predResponse = await fetch(`${API_BASE}/lpg/predict`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                cylinder_id: data.data.cylinder_id,
              }),
            });
            const predData = await predResponse.json();
            if (predData.success) {
              setPredictions((prev) => ({ ...prev, [data.data.id]: predData.data }));
            }
        } catch (predErr) {
            console.error('Initial prediction failed:', predErr);
        }
      }
    } catch (error) {
      console.error('Error adding cylinder:', error);
    }
  };

  const handleLogUsage = async () => {
    if (!selectedCylinder || !usageInput) return;
    try {
      const response = await fetch(`${API_BASE}/lpg/usage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cylinder_id: selectedCylinder.cylinder_id,
          usage_kg: parseFloat(usageInput),
          usage_reason: 'daily_use',
        }),
      });
      const data = await response.json();
      if (data.success) {
        setUsageInput('');
        fetchPredictions(selectedCylinder.id);
        fetchCylinders();
      }
    } catch (error) {
      console.error('Error logging usage:', error);
    }
  };

  const handlePredictNow = async () => {
    if (!selectedCylinder) return;
    try {
      const response = await fetch(`${API_BASE}/lpg/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cylinder_id: selectedCylinder.cylinder_id,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setPredictions((prev) => ({ ...prev, [selectedCylinder.id]: data.data }));
        if (data.data.alertTriggered) fetchAlerts();
      }
    } catch (error) {
      console.error('Error making prediction:', error);
    }
  };

  const handleSubmitFeedback = async (wasAccurate: boolean) => {
    if (!activeFeedback || !feedbackDate || !token) return;
    try {
      const response = await fetch(`${API_BASE}/lpg/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prediction_id: activeFeedback.id,
          actual_empty_date: feedbackDate,
          was_accurate: wasAccurate,
          feedback_message: wasAccurate ? 'Accurate prediction' : 'Slightly off from original prediction'
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowFeedbackModal(false);
        setActiveFeedback(null);
        fetchPendingFeedback();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    }
  };

  const getStatusColor = (days: number | undefined) => {
    if (!days) return 'text-neutral-500';
    if (days <= 3) return 'text-red-500';
    if (days <= 7) return 'text-amber-500';
    return 'text-emerald-500';
  };

  if (loading) return (
    <div className="flex items-center justify-center p-20">
      <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const currentPrediction = selectedCylinder ? predictions[selectedCylinder.id] : null;

  return (
    <div className="space-y-12 pb-12 relative">
      {/* Tracker Body */}
      <div className="flex flex-col xl:flex-row gap-10">
        
        {/* Left: Cylinder Stack */}
        <div className="xl:w-80 space-y-4 shrink-0">
            <div className="flex items-center justify-between px-4 mb-6">
                <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500">My_Cylinders</span>
                </div>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="p-2.5 bg-white text-black hover:bg-emerald-500 hover:text-white rounded-xl transition-all shadow-xl active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                </button>
            </div>

            <AnimatePresence mode="wait">
                {showAddForm && (
                  <motion.form 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    onSubmit={handleAddCylinder} 
                    className="p-6 bg-white/[0.03] border border-white/10 rounded-3xl space-y-4 mx-2"
                  >
                    <Input
                      placeholder="ENTER CYLINDER ID"
                      value={formData.cylinder_id}
                      onChange={(e) => setFormData({ ...formData, cylinder_id: e.target.value })}
                      className="h-12 bg-black/40 border-white/5 text-[10px] font-black uppercase tracking-widest placeholder:text-neutral-700 text-white"
                      required
                    />
                    <Input
                      type="number"
                      placeholder="WEIGHT (KG)"
                      step="0.1"
                      value={formData.current_weight_kg}
                      onChange={(e) => setFormData({ ...formData, current_weight_kg: e.target.value })}
                      className="h-12 bg-black/40 border-white/5 text-[10px] font-black uppercase tracking-widest placeholder:text-neutral-700 text-white"
                      required
                    />
                    <Button type="submit" className="w-full bg-emerald-500 text-black h-12 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all">
                        Register_Node
                    </Button>
                  </motion.form>
                )}
            </AnimatePresence>

            <div className="space-y-3 px-2">
                {cylinders.map((cylinder) => (
                    <button
                        key={cylinder.id}
                        onClick={() => {
                            setSelectedCylinder(cylinder);
                            fetchPredictions(cylinder.id);
                        }}
                        className={`w-full p-6 rounded-[2.5rem] border transition-all duration-300 relative group ${selectedCylinder?.id === cylinder.id ? 'bg-white text-black border-transparent shadow-[0_20px_40px_rgba(255,255,255,0.1)]' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] text-white'}`}
                    >
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${selectedCylinder?.id === cylinder.id ? 'text-neutral-500' : 'text-neutral-600'}`}>Node_Status: Active</span>
                            {selectedCylinder?.id === cylinder.id && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        </div>
                        <p className="text-xl font-black italic uppercase tracking-tighter truncate">{cylinder.cylinder_id}</p>
                        <div className="mt-4 flex items-end gap-2">
                             <span className="text-sm font-black italic">{cylinder.current_weight_kg} <span className="text-[10px] not-italic text-neutral-400">KG</span></span>
                        </div>
                    </button>
                ))}
            </div>
        </div>

        {/* Right: Detailed Analysis */}
        <div className="flex-1 space-y-8">
            <AnimatePresence mode="wait">
                {selectedCylinder ? (
                    <motion.div 
                        key={selectedCylinder.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-8"
                    >
                        {/* Main Status Showcase */}
                        <div className="hub-glass p-12 rounded-[4rem] border border-white/5 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.4)]">
                            <div className="absolute top-[-20%] right-[-20%] w-[50%] h-[50%] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
                            
                            <div className="relative z-10 flex flex-col md:flex-row items-center gap-16">
                                {/* Fuel Gauge Visual */}
                                <div className="relative w-48 h-48 md:w-64 md:h-64 shrink-0">
                                    <svg className="w-full h-full rotate-[-90deg]">
                                        <circle
                                            cx="50%" cy="50%" r="45%"
                                            className="stroke-white/5 fill-transparent"
                                            strokeWidth="12"
                                        />
                                        <motion.circle
                                            cx="50%" cy="50%" r="45%"
                                            className="stroke-emerald-500 fill-transparent shadow-[0_0_30px_#10b981]"
                                            strokeWidth="12"
                                            strokeDasharray="283"
                                            initial={{ strokeDashoffset: 283 }}
                                            animate={{ strokeDashoffset: 283 - (283 * (selectedCylinder.current_weight_kg / selectedCylinder.max_capacity_kg)) }}
                                            strokeLinecap="round"
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-2">Available</p>
                                        <p className="text-5xl font-black italic uppercase tracking-tighter text-white">
                                            {Math.round((selectedCylinder.current_weight_kg / selectedCylinder.max_capacity_kg) * 100)}%
                                        </p>
                                        <p className="text-[8px] font-bold text-neutral-600 uppercase mt-1 tracking-widest">{selectedCylinder.current_weight_kg} / {selectedCylinder.max_capacity_kg} KG</p>
                                    </div>
                                </div>

                                <div className="space-y-12 flex-1 w-full">
                                    <div className="space-y-4">
                                        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase leading-[0.85] text-white">{selectedCylinder.cylinder_id}</h2>
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                                                <Flame className="w-3 h-3 text-orange-500" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-300">Premium_Propane_Mix</span>
                                            </div>
                                            <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full flex items-center gap-2">
                                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[8px] font-black uppercase tracking-widest text-neutral-300">Certified_Node</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-3">
                                            <p className="text-[9px] font-black text-neutral-500 uppercase tracking-widest">Update_Consumption</p>
                                            <div className="flex gap-2">
                                                <Input 
                                                    type="number"
                                                    step="0.1"
                                                    placeholder="KG USED"
                                                    value={usageInput}
                                                    onChange={(e) => setUsageInput(e.target.value)}
                                                    className="h-14 bg-white/5 border-white/5 rounded-2xl font-black italic px-6 focus-visible:ring-emerald-500/50 text-white"
                                                />
                                                <Button onClick={handleLogUsage} className="h-14 bg-white text-black hover:bg-emerald-500 hover:text-white px-8 rounded-2xl font-black uppercase tracking-widest whitespace-nowrap">
                                                    SYNC_DATA
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-end">
                                            <Button 
                                                onClick={handlePredictNow}
                                                className="w-full h-14 bg-emerald-500 text-black hover:bg-white transition-all rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[0_20px_50px_rgba(16,185,129,0.3)]"
                                            >
                                                <TrendingDown className="w-5 h-5" /> RECALCULATE_HORIZON
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Forecast Result Node */}
                        {currentPrediction && (
                            <motion.div 
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`hub-glass p-12 rounded-[3.5rem] border border-white/5 relative group transition-all duration-500 ${currentPrediction.predicted_empty_days <= 3 ? 'bg-red-500/[0.04] border-red-500/30' : 'hover:border-emerald-500/30'}`}
                            >
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 opacity-50 text-neutral-400">
                                            <Clock className="w-3.5 h-3.5" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Depletion_Time</p>
                                        </div>
                                        <p className={`text-6xl font-black italic tracking-tighter ${getStatusColor(currentPrediction.predicted_empty_days)}`}>
                                            {currentPrediction.predicted_empty_days}<span className="text-sm ml-2">DAYS</span>
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 opacity-50 text-neutral-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Estimated_Empty</p>
                                        </div>
                                        <p className="text-2xl font-black uppercase italic text-white tracking-tighter">
                                            {new Date(currentPrediction.predicted_empty_date).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 opacity-50 text-neutral-400">
                                            <Zap className="w-3.5 h-3.5" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Daily_Flow_Rate</p>
                                        </div>
                                        <p className="text-2xl font-black uppercase italic text-white font-mono tracking-tighter">
                                            {(currentPrediction.daily_avg_usage_kg || 0).toFixed(2)} KG
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 opacity-50 text-neutral-400">
                                            <Activity className="w-3.5 h-3.5" />
                                            <p className="text-[9px] font-black uppercase tracking-widest">Confidence_LVL</p>
                                        </div>
                                        <p className="text-xl font-black uppercase italic text-blue-400 tracking-tighter">
                                            {((currentPrediction.confidence_score || 0) * 100).toFixed(0)}%
                                        </p>
                                    </div>
                                </div>

                                {currentPrediction.predicted_empty_days <= 7 && (
                                    <motion.div 
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="mt-12 p-6 bg-red-600/10 border border-red-500/30 rounded-[2rem] flex items-center gap-6 animate-pulse"
                                    >
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                        <div>
                                            <p className="text-xs font-black uppercase tracking-widest text-red-500">Critical_Buffer_Warning</p>
                                            <p className="text-[10px] text-red-500/70 font-bold uppercase tracking-widest">SYSTEM_DEPLETI0N_NODE_IMMINENT • INITIATE_REFILL_SEQUENCE</p>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* Pending Feedback Node */}
                        {pendingFeedback.length > 0 && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="hub-glass p-8 rounded-[3rem] border border-emerald-500/20 bg-emerald-500/[0.02] space-y-6"
                            >
                                <div className="flex items-center gap-3">
                                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                                    <h3 className="text-lg font-black uppercase italic tracking-tighter text-white">Verification_Protocol_Pending</h3>
                                </div>
                                <div className="space-y-4">
                                    {pendingFeedback.map(f => (
                                        <div key={f.id} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Session_{f.id.slice(0, 8)}</p>
                                                <p className="text-sm font-black italic uppercase tracking-tighter text-white">Depletion predicted on {new Date(f.predicted_empty_date).toLocaleDateString()}</p>
                                            </div>
                                            <Button 
                                                onClick={() => {
                                                    setActiveFeedback(f);
                                                    setShowFeedbackModal(true);
                                                }}
                                                className="bg-white text-black hover:bg-emerald-500 hover:text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest"
                                            >
                                                Submit_Actuals
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ) : (
                    <div className="hub-glass h-[600px] rounded-[4rem] border border-white/5 flex flex-col items-center justify-center text-center p-12">
                        <motion.div 
                           animate={{ 
                             scale: [1, 1.1, 1],
                             opacity: [0.3, 0.6, 0.3]
                           }}
                           transition={{ duration: 4, repeat: Infinity }}
                           className="mb-8"
                        >
                            <Droplet className="w-20 h-20 text-neutral-800" />
                        </motion.div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-neutral-700">Awaiting_Source_Selection</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-800 mt-2 max-w-sm">Please select a fuel node from the inventory stack to begin real-time analysis.</p>
                    </div>
                )}
            </AnimatePresence>
        </div>
      </div>

      {/* Verification Protocol Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowFeedbackModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg hub-glass p-10 rounded-[3rem] border border-white/10 space-y-8 shadow-[0_50px_100px_rgba(0,0,0,0.5)] overflow-hidden"
            >
              <div className="space-y-2">
                <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white">Verification_Handshake</h3>
                <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">Input_Actual_Source_Depletion_Telemetry</p>
              </div>

              <div className="space-y-4">
                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400 block mb-2">Actual_Empty_Date</label>
                <Input 
                  type="date"
                  value={feedbackDate}
                  onChange={(e) => setFeedbackDate(e.target.value)}
                  className="h-14 bg-white/5 border-white/5 rounded-2xl font-black italic px-6 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={() => handleSubmitFeedback(true)}
                  className="h-14 bg-emerald-500 text-black hover:bg-white rounded-2xl font-black uppercase tracking-widest"
                >
                  Confirm_Accuracy
                </Button>
                <Button 
                   onClick={() => handleSubmitFeedback(false)}
                   className="h-14 bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest"
                >
                   Flag_Variance
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .hub-glass {
            background: rgba(10, 10, 10, 0.4);
            backdrop-filter: blur(30px);
            -webkit-backdrop-filter: blur(30px);
        }
      `}</style>
    </div>
  );
};

export default LPGTracker;
