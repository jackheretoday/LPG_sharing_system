import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  MapPin, 
  Flame, 
  Zap, 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  Search,
  Activity,
  ArrowRight,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Community() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Posts');
  const [searchQuery, setSearchQuery] = useState('');

  const posts = [
    {
      id: '1',
      type: 'emergency',
      author: { name: 'Anonymous Node', verified: false, trust: 12 },
      time: '2 mins ago',
      location: 'Andheri East, Mumbai',
      title: 'CRITICAL_BUFFER_EMPTY: Urgent assistance needed at JVLR Junction',
      content: "Node reporting zero stocks. Area depot is completely dry. If any nearby household has a spare cylinder for temporary exchange, please establish contact immediately. Trust scores will be rewarded.",
      helpfulCount: 42,
      commentCount: 12,
      category: 'Emergency'
    },
    {
      id: '2',
      type: 'offer',
      author: { 
        name: 'Sarah Kamau', 
        verified: true, 
        trust: 98,
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSvE05yjBDcJFI5EtLlIGvNd_caVGoiEPMdZ5IzLrVhBfNpsSwmV2QeVgUVQJeHTTBE8AlL6C_UrBEbZFC-LkJhUmWIxDVvJe_IQA8rmtkcP3zIN0jWtAhyTnEOqjnZNnQMM-c4IqI4kw1Da7_fbZzw9HePO73IwBs4Fzz4PROm3s2j7ZZCuHaFPGJ3EtiMxIJrXu5v9LGrb_h8wGxEodWo-PAKkqahp4_SShoqS8nygpjL2k7076WsLxLq2N0Wq-lftg9xLQfEQ' 
      },
      time: '15 mins ago',
      location: 'Westlands Square',
      title: 'RESOURCE_AVAILABLE: 13KG Cylinder Refill ready for exchange',
      content: 'I have an extra 13kg cylinder just refilled from Rubis. Ready to help anyone in the Westlands area who is struggling with stock today. Protocol standard pricing applies.',
      helpfulCount: 128,
      commentCount: 4,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_8D28xmWub9SIfcO9jSumktSNJ3mHWapL43Mf2jVq6w32FqJoWSUAbnPDYRbs8B6-Ca4LXAtZ1emHjJQ0AIAkj8Dizqyv1hOwGxJfRRCJ0Zrg-19T85Ior05udYU6OK5UI499ny-mSYGEeVUBx7HBk1GMwTfUlBB6RfC6rcipu50G_1uSqH5N8Z1_6uhaqmOINrkJD2yZ4ReneShkpWI0_htCFKM0KnwHzhsL8TPpY2DiON7Od93QiY_mQHUbCuU7TFgL7cPxxA',
      category: 'Available'
    },
    {
      id: '3',
      type: 'update',
      author: { name: 'System Admin', verified: true, trust: 999 },
      time: '1 hour ago',
      location: 'Global Hub',
      title: 'PROTOCOL_UPDATE_V8.1: Enhanced Community Trust Layer Activated',
      content: "The Amity Trust Protocol has been upgraded. Every interaction now directly contributes to your global safety score. Please ensure you document every exchange.",
      helpfulCount: 256,
      commentCount: 0,
      category: 'System'
    }
  ];

  const filteredPosts = posts.filter(p => {
    const matchesFilter = filter === 'All Posts' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500 selection:text-black font-sans">
      <Navbar />
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,18,18,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(18,18,18,0.2)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20" />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-32 flex flex-col lg:flex-row gap-12">
        
        {/* Left Sidebar */}
        <aside className="lg:w-72 space-y-8 shrink-0">
            <div className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Hub_Feed_Live</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter italic uppercase leading-none">
                        Community <br /> <span className="text-transparent border-text">Insights</span>
                    </h2>
                </div>

                <div className="space-y-2">
                    {['All Posts', 'Emergency', 'Available', 'System'].map((tag) => (
                        <button
                            key={tag}
                            onClick={() => setFilter(tag)}
                            className={`w-full text-left px-5 py-3 rounded-2xl flex items-center justify-between transition-all group ${filter === tag ? 'bg-white text-black' : 'bg-white/5 text-neutral-500 hover:text-white'}`}
                        >
                            <span className="text-xs font-black uppercase tracking-widest">{tag === 'All Posts' ? 'Primary Feed' : tag}</span>
                            {filter === tag ? <Zap className="w-3 h-3 text-black font-black" /> : <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />}
                        </button>
                    ))}
                </div>

                <Button 
                    onClick={() => navigate('/community/create')}
                    className="w-full bg-white text-black hover:bg-emerald-500 hover:text-white h-14 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all"
                >
                    <Plus className="w-4 h-4" /> Broadcast Insight
                </Button>
            </div>

            <div className="hub-glass p-6 rounded-[2rem] border border-white/5 space-y-6">
                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">Active_Market_Node</span>
                    </div>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-600">
                            <span>AVG_EXCHANGE_VALUE</span>
                            <span className="text-white">₹950.00</span>
                        </div>
                    </div>
                </div>
            </div>
        </aside>

        {/* Center Feed */}
        <div className="flex-1 space-y-8">
            <div className="relative group overflow-hidden rounded-[2rem]">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-emerald-500 transition-colors" />
                <Input 
                    placeholder="SCANNING COMMUNITY DATABASE..." 
                    className="h-16 pl-16 pr-8 bg-white/5 border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-xs focus-visible:ring-1 focus-visible:ring-emerald-500/50 transition-all placeholder:text-neutral-700"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="space-y-6">
                {filteredPosts.map((post) => (
                    <article
                        key={post.id}
                        onClick={() => navigate(`/community/post/${post.id}`)}
                        className={`group relative hub-glass p-8 rounded-[2.5rem] border border-white/5 cursor-pointer hover:border-emerald-500/30 transition-all duration-500 overflow-hidden ${post.type === 'emergency' ? 'bg-red-500/[0.02] border-red-500/20' : ''}`}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 blur-[60px] rounded-full transition-all duration-700 opacity-10 group-hover:opacity-30 ${post.type === 'emergency' ? 'bg-red-500' : 'bg-emerald-500'}`} />
                        
                        <div className="relative z-10 flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                                    {post.author.img ? (
                                        <img src={post.author.img} alt={post.author.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Users className="w-5 h-5 text-neutral-600" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-black uppercase tracking-tight">{post.author.name}</h4>
                                    <div className="flex items-center gap-3 text-neutral-500 text-[10px] font-bold uppercase tracking-widest">
                                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {post.location}</span>
                                        <span>{post.time}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black uppercase tracking-widest text-neutral-600 italic">Trust</p>
                                <p className="text-2xl font-black italic text-white">{post.author.trust}</p>
                            </div>
                        </div>

                        <div className="relative z-10 space-y-4 mb-8">
                            <h3 className="text-2xl md:text-3xl font-black tracking-tighter italic uppercase leading-tight">
                                {post.title}
                            </h3>
                            <p className="text-neutral-400 text-sm italic leading-relaxed">
                                {post.content}
                            </p>
                        </div>

                        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/5">
                            <div className="flex items-center gap-8">
                                <button className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors">
                                    <ThumbsUp className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{post.helpfulCount} HELPFUL</span>
                                </button>
                                <button className="flex items-center gap-2 text-neutral-500 hover:text-white transition-colors">
                                    <MessageSquare className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">{post.commentCount} INTEL</span>
                                </button>
                            </div>
                            <ArrowRight className="w-5 h-5 text-emerald-500" />
                        </div>
                    </article>
                ))}
            </div>
        </div>
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
}
