import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  MapPin, 
  ShieldCheck, 
  Star, 
  ArrowRight, 
  Filter, 
  Zap, 
  LayoutGrid, 
  List,
  Activity,
  UserCheck,
  Flame,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { trustApi, type ProviderDatasetItem } from '@/lib/trustApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AuthenticatedRoute } from '@/components/trust/AuthenticatedRoute';
import { Navbar } from '@/components/Navbar';

function FindHelpContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [providers, setProviders] = useState<ProviderDatasetItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await trustApi.listProviders();
        setProviders(res.providers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to load providers");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filteredProviders = providers.filter(p => 
    p.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500 selection:text-black overflow-x-hidden font-sans">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.3)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.3)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32">
        {/* Cinematic Header Block */}
        <section className="mb-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                    <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/80">Real-Time_Provider_Grid</span>
                </div>
                
                <div>
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase leading-[0.85] mb-4">
                        Provider <br /> <span className="text-transparent border-text">Mission Control</span>
                    </h1>
                    <p className="max-w-2xl text-neutral-400 text-lg font-medium leading-relaxed italic">
                        Deploying the Amity Trust Protocol to locate high-security LPG providers. 
                        Scan, verify, and coordinate sharing request via low-latency links.
                    </p>
                </div>
            </motion.div>
        </section>

        {/* Search & Control Interface */}
        <section className="sticky top-24 z-40 mb-12">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="hub-glass p-2 border border-white/10 rounded-3xl bg-black/40 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col md:flex-row gap-2"
            >
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" />
                    <Input 
                        placeholder="INITIATE PROVIDER SCAN (NAME, ROLE, AREA)..." 
                        className="h-16 pl-16 pr-8 bg-transparent border-none rounded-none font-black uppercase tracking-widest text-xs focus-visible:ring-0 transition-all placeholder:text-neutral-700"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-2">
                    <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-neutral-500 hover:text-white'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                    <Button className="h-14 bg-emerald-500 text-black hover:bg-white transition-all rounded-2xl px-8 font-black uppercase tracking-[0.2em] text-[10px]">
                        Initialize Filter
                    </Button>
                </div>
            </motion.div>
        </section>

        {/* Global Stats Overlay */}
        <div className="flex flex-wrap items-center gap-8 mb-12 px-4 overflow-hidden">
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Active_Nodes:</span>
                <span className="text-xl font-black italic text-emerald-500">{filteredProviders.length}</span>
            </div>
            <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Verification_Status:</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">Secured</span>
            </div>
            <div className="w-[1px] h-4 bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-600">Protocol:</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 italic">Amity_v4.2</span>
            </div>
        </div>

        {/* Results Container */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-80 rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
              ))}
            </motion.div>
          ) : filteredProviders.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="hub-glass py-32 border border-dashed border-white/10 rounded-[3rem] text-center space-y-6"
            >
              <Zap className="w-16 h-16 text-neutral-800 mx-auto" />
              <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase italic tracking-tighter text-neutral-600">Grid_Isolation_Detected</h3>
                  <p className="text-[10px] uppercase font-black tracking-[0.5em] text-neutral-700">No matching provider packets in your vicinity</p>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key={viewMode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-6"}
            >
              {filteredProviders.map((p, idx) => (
                <motion.div
                  key={p.user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                >
                  <Link
                    to={`/provider/${p.user.id}`}
                    className="block h-full"
                  >
                    <div className="hub-glass p-8 rounded-[2.8rem] border border-white/5 h-full relative overflow-hidden group-hover:border-emerald-500/40 group-hover:bg-emerald-500/[0.02] transition-all duration-500">
                      
                      {/* Interactive Visuals */}
                      <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full group-hover:blur-[80px] transition-all" />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-10">
                            <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:border-emerald-500/30 group-hover:bg-emerald-500/10 transition-colors">
                                <UserCheck className="w-6 h-6 text-white group-hover:text-emerald-500 transition-colors" />
                            </div>
                            <div className="text-right">
                                <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mb-2">
                                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-emerald-500">Verified</span>
                                </div>
                                <div className="flex items-center justify-end gap-2">
                                    <span className="text-[10px] font-black text-neutral-600 uppercase">Trust</span>
                                    <span className="text-3xl font-black italic text-white leading-none transform group-hover:scale-110 transition-transform">{p.trust.trustScore}</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 mb-10">
                            <h3 className="text-3xl font-black tracking-tighter uppercase leading-none italic group-hover:translate-x-1 transition-transform">{p.user.name}</h3>
                            <div className="flex items-center gap-2">
                                <Badge className="bg-white/5 text-neutral-400 border-white/10 rounded-md font-black uppercase tracking-widest px-2 text-[8px]">
                                    {p.user.role}
                                </Badge>
                                <div className="h-1 w-1 bg-neutral-700 rounded-full" />
                                <div className="flex items-center gap-1 text-emerald-500/70">
                                    <MapPin className="w-3 h-3" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest">Andheri West • 2 KM</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0a0a] bg-emerald-500/20 flex items-center justify-center">
                                            <Flame className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                    ))}
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-600">Ready_To_Share</span>
                            </div>
                            
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                                <ChevronRight className="w-5 h-5 text-black" />
                            </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Emergency Bottom Bar Overlay */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 p-6 pointer-events-none">
          <div className="max-w-7xl mx-auto flex justify-end">
              <Link 
                to="/emergency"
                className="pointer-events-auto hub-glass bg-red-600 border-red-500 p-6 rounded-3xl flex items-center gap-4 hover:bg-black hover:text-red-500 hover:border-red-500/40 hover:shadow-[0_0_60px_rgba(220,38,38,0.4)] transition-all group shadow-2xl"
              >
                  <div className="space-y-0.5">
                      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/60">Need Urgent Assistance?</p>
                      <p className="text-xs font-black uppercase tracking-widest">Execute SOS Handshake</p>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                      <ShieldCheck className="w-5 h-5" />
                  </div>
              </Link>
          </div>
      </footer>

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
        @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.1; }
            50% { transform: scale(1.1); opacity: 0.2; }
        }
        .animate-pulse-slow {
            animation: pulse-slow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default function FindHelp() {
  return (
    <AuthenticatedRoute>
      <FindHelpContent />
    </AuthenticatedRoute>
  );
}
