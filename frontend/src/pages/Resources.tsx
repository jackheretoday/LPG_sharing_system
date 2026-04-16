import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Fuel, MapPin, IndianRupee, ShieldCheck, HeartPulse } from 'lucide-react';
import { resourceApi } from '@/lib/resourceApi';
import { getToken } from '@/lib/trustAuth';

export default function Resources() {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    resource_type: 'cylinder',
    price: 0
  });

  useEffect(() => {
    loadResources();
  }, []);

  const loadResources = async () => {
    try {
      const data = await resourceApi.listResources();
      if (data.success) setResources(data.resources);
    } catch (err) {
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
        alert('Please login to share a resource');
        return;
    }
    
    try {
      const res = await resourceApi.addResource(formData, token);
      if (res.success) {
        setShowAddModal(false);
        setFormData({ title: '', description: '', location: '', resource_type: 'cylinder', price: 0 });
        loadResources();
      }
    } catch (err) {
      alert('Error creating resource');
    }
  };

  const handleRequest = async (id: string) => {
    const token = getToken();
    if (!token) {
        alert('Please login to request a resource');
        return;
    }
    try {
        const res = await resourceApi.requestResource(id, token);
        if (res.success) {
            alert('Request sent to owner! Opening chat...');
            navigate('/chat');
        }
    } catch (err) {
        alert('Request failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white pt-24 pb-20 px-4 md:px-8 font-body">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <HeartPulse className="w-5 h-5" />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Resource Ecosystem</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter font-headline">Peer Sharing</h1>
          <p className="text-neutral-400 max-w-xl text-sm md:text-base leading-relaxed">
            Directly borrow or share cylinders and regulators with your neighbors. 
            No middleman, just community support.
          </p>
        </div>
        
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:bg-primary"
        >
          <Plus className="w-4 h-4" /> List My Resource
        </button>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
            <p>Loading the marketplace...</p>
        ) : resources.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-neutral-500 font-headline uppercase tracking-widest">No active listings in your area yet.</p>
            </div>
        ) : resources.map((res) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={res.id} 
            className="hub-glass glass-edge p-6 rounded-3xl border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:scale-110 transition-transform">
                <Fuel className="w-6 h-6 text-primary" />
              </div>
              <div className="text-right">
                <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mb-1">Asking Price</p>
                <p className="text-xl font-black flex items-center justify-end gap-1">
                  <IndianRupee className="w-4 h-4 text-emerald-400" /> {res.price || 'Free'}
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
              {res.title}
              <ShieldCheck className="w-4 h-4 text-blue-400" />
            </h3>
            <p className="text-sm text-neutral-400 mb-6 line-clamp-2 leading-relaxed">
              {res.description}
            </p>

            <div className="flex items-center gap-4 py-4 border-t border-white/5 mb-6 text-xs text-neutral-500 font-medium">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5" /> {res.location}
              </div>
              <div className="flex items-center gap-1.5 capitalize">
                <Plus className="w-3.5 h-3.5 rotate-45" /> {res.resource_type}
              </div>
            </div>

            <button 
              onClick={() => handleRequest(res.id)}
              className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
            >
              Request Resource
            </button>
            
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-neutral-900 border border-white/10 w-full max-w-2xl rounded-[2.5rem] relative z-10 overflow-hidden shadow-2xl"
            >
                <div className="p-8 md:p-12">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-black tracking-tighter font-headline">List a Resource</h2>
                            <p className="text-neutral-500 text-sm">Help your community by sharing spare gear.</p>
                        </div>
                        <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Title</label>
                                <input 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-neutral-700"
                                    placeholder="Ex: Spare 14kg Cylinder"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Location</label>
                                <input 
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-neutral-700"
                                    placeholder="Ex: Andheri West"
                                    value={formData.location}
                                    onChange={e => setFormData({...formData, location: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Description</label>
                            <textarea 
                                required
                                rows={3}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-neutral-700"
                                placeholder="Describe the condition, usage, or pickup instructions..."
                                value={formData.description}
                                onChange={e => setFormData({...formData, description: e.target.value})}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Category</label>
                                <select 
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all text-neutral-400"
                                    value={formData.resource_type}
                                    onChange={e => setFormData({...formData, resource_type: e.target.value})}
                                >
                                    <option value="cylinder">LPG Cylinder</option>
                                    <option value="regulator">Regulator</option>
                                    <option value="pipe">Gas Pipe</option>
                                    <option value="stove">Portable Stove</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500 ml-1">Price (₹)</label>
                                <input 
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-neutral-700"
                                    placeholder="0 for FREE"
                                    value={formData.price}
                                    onChange={e => setFormData({...formData, price: Number(e.target.value)})}
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-primary transition-all mt-4"
                        >
                            Publish Listing
                        </button>
                    </form>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
