import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

// --- Sub-components ---

const TopNavBar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 shadow-[0_20px_40px_rgba(0,0,0,0.4)] flex justify-between items-center px-8 h-16">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold tracking-tighter text-white font-headline">LPG Hub</span>
        <nav className="hidden md:flex items-center gap-6">
          <Link className="text-white border-b-2 border-white pb-1 font-headline tracking-tight text-sm" to="/community">Community</Link>
          <Link className="text-[#C5C7C1] hover:text-white transition-colors font-headline tracking-tight text-sm" to="/dashboard">Map</Link>
          <Link className="text-[#C5C7C1] hover:text-white transition-colors font-headline tracking-tight text-sm" to="/resources">Resources</Link>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative group hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant !text-sm">search</span>
          <input 
            className="bg-surface-container-low border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-1 focus:ring-outline-variant w-64 transition-all text-white" 
            placeholder="Search insights..." 
            type="text"
          />
        </div>
        <button className="text-on-surface-variant hover:text-white transition-all p-2 rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined !text-xl">notifications</span>
        </button>
        <button className="text-on-surface-variant hover:text-white transition-all p-2 rounded-full hover:bg-white/10">
          <span className="material-symbols-outlined !text-xl">settings</span>
        </button>
        <img 
          alt="User profile" 
          className="w-8 h-8 rounded-full border border-white/10" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAU7X65WWbHi5hPUFfgGybpsSuwbm5NaRJ02IWixtcKvudaiQ9shrc3SMCVeoy8h0KwrkZ2yNCNn8HaWSMt030WcEUhkUKEDyNAjH7BU4Wa2UD_jN9ssFi3bWCRV16ArV1p14t1bT4_bosx41kHkXUtA8uPoxHLcYO_avlNzZ4cnpWH_VTsA4rqfBf4bGFnwoHSW9FgmA4PbC0RanXC1CGE3P6mkkd7xESObghWO4i2Tq-Z3yqlaGPjZKYnxjRodjWmsg9wh9zw9A"
        />
      </div>
    </header>
  );
};

const SideNavBar = ({ onCreatePost }: { onCreatePost: () => void }) => {
  return (
    <aside className="hidden md:flex flex-col gap-2 pt-6 h-screen w-64 fixed left-0 top-16 bg-[#0E0E0E] z-40">
      <div className="px-6 mb-8">
        <h2 className="text-lg font-black text-white font-headline">Community Insights</h2>
        <p className="text-xs text-on-surface-variant">Local LPG availability</p>
      </div>
      <nav className="flex flex-col gap-1">
        <a className="bg-white text-[#131313] rounded-md mx-2 px-4 py-3 flex items-center gap-3 font-manrope text-sm font-medium" href="#">
          <span className="material-symbols-outlined !text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>home</span> Home Feed
        </a>
        <a className="text-[#C5C7C1] mx-2 px-4 py-3 flex items-center gap-3 hover:bg-[#1F1F1F] font-manrope text-sm font-medium transition-colors" href="#">
          <span className="material-symbols-outlined !text-xl">emergency_home</span> Emergency Alerts
        </a>
        <a className="text-[#C5C7C1] mx-2 px-4 py-3 flex items-center gap-3 hover:bg-[#1F1F1F] font-manrope text-sm font-medium transition-colors" href="#">
          <span className="material-symbols-outlined !text-xl">gas_meter</span> Active Offers
        </a>
        <a className="text-[#C5C7C1] mx-2 px-4 py-3 flex items-center gap-3 hover:bg-[#1F1F1F] font-manrope text-sm font-medium transition-colors" href="#">
          <span className="material-symbols-outlined !text-xl">history</span> My Requests
        </a>
      </nav>
      <div className="mt-8 px-4">
        <button 
          onClick={onCreatePost}
          className="w-full py-3 bg-white text-black rounded-md font-bold text-sm tracking-tight hover:opacity-90 active:scale-95 transition-all"
        >
          Create Post
        </button>
      </div>
      <div className="mt-auto pb-20 flex flex-col gap-1">
        <a className="text-[#C5C7C1] mx-2 px-4 py-2 flex items-center gap-3 hover:bg-[#1F1F1F] text-xs" href="#">
          <span className="material-symbols-outlined !text-xl">help</span> Support
        </a>
        <a className="text-[#C5C7C1] mx-2 px-4 py-2 flex items-center gap-3 hover:bg-[#1F1F1F] text-xs" href="#">
          <span className="material-symbols-outlined !text-xl">description</span> Terms
        </a>
      </div>
    </aside>
  );
};

const RightSidebar = () => {
  return (
    <aside className="hidden lg:flex flex-col gap-6 w-80 fixed right-0 top-16 h-[calc(100vh-4rem)] p-8 overflow-y-auto no-scrollbar bg-surface border-l border-white/5">
      <section className="hub-glass glass-edge p-5 rounded-xl border border-white/5">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant mb-4">Market Status</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface">Average Price</span>
            <span className="text-sm font-bold text-white">1,280 KES</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface">Demand Level</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="w-[75%] h-full bg-red-500"></div>
              </div>
              <span className="text-[10px] font-bold text-red-500">HIGH</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-on-surface">Wait Times</span>
            <span className="text-sm text-on-surface-variant">15 - 45 mins</span>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant">Hotspots Near You</h4>
          <button className="text-[10px] text-white underline font-bold">View Full Map</button>
        </div>
        <div className="aspect-square rounded-xl bg-surface-container overflow-hidden relative group cursor-pointer">
          <img 
            alt="Map" 
            className="w-full h-full object-cover grayscale contrast-125 opacity-60 group-hover:scale-110 transition-transform duration-700" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB08smE87D1shJu_a9-Tu_7tAnUUSl2oF1_4QdluSVmvBhmXR6-ZjX8oFt0ErbB_kTwhq-Nar91LDfDoOQa8ro41LMaka--Pt5FkE6UUo1qMgHw3sdJSTL3W6hyVwnUbtVeXcJ93DOQTbeQouyJe41ex7YCpjOFDk1Qbjd_An7DR4YIY1gGW8EEVG1qcRB8N-M2_ODvTj7ElEVOOW9ZDggI3snml3SrfGrHMVNN0LoaEwqaknNoL1aSUL2J-YfmZOzQleWHTQlu3Q"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
          <div className="absolute bottom-4 left-4">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              <span className="text-[10px] font-bold text-white tracking-tight">3 Active Alerts</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Top Contributors</h4>
        <div className="space-y-3">
          {[
            { name: 'Alex Mwangi', points: '1,240 Helpful Points', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDfXq705PO8eaVuor3ZrHCOm758ZfmvJqfLmxbQHQrm8iewFLJHDbOUrBPWT47o7eGWYjCAGbigSGVElRR_FDjbLm0eDM9KriT_QcA-g2ZkeXBKTEUgCDcWh6pGclj1CGSfrTuaMG0LMXZnQmJKiEfnNGNx0Gz7ztFMpsKUZk8V_vr0iNnyoQqCGMAEEFN5_njI5PQfaYO0zhJWocjkWwxizXQhUWi_QvS7O6CNMMQUZ9S6_rjMvY4sK0tCVNxkZ5krBTtjTyp8Jg' },
            { name: 'Grace Tanui', points: '980 Helpful Points', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCGtfJTNbpfT2n49dy9bcrYHAyHlrkNFvY-_lxDg91IJBVV7cqGLTEXTtSAbMxz8tDa-SqUeuQlSbtSTzFUP4qAxeOJtpUVh1KN5tEes1jbBIqg23qkqs-ssPtHYhOL8NsTZjmkYXkntAbkKQvW5YgsFPicClj5-6rZTXfXXBIJ7-3rF913Zq9hC-8uevcCyFvl6xjzD1AG8So5Ajj_RkBRNIX6dDs3_c-uKytdB67UIgpLk39DOoO7i79QgCeYeSFZrP3U4fAaaA' }
          ].map((c, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
              <img 
                alt={c.name} 
                className="w-8 h-8 rounded-full object-cover ring-2 ring-transparent group-hover:ring-white transition-all" 
                src={c.img}
              />
              <div>
                <p className="text-xs font-bold text-white">{c.name}</p>
                <p className="text-[10px] text-on-surface-variant">{c.points}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4 mt-6">
        <h4 className="text-xs font-black uppercase tracking-[0.2em] text-on-surface-variant px-1">Verified Suppliers</h4>
        <div className="space-y-3">
          {[
            { name: 'Rubis Westlands', s: 'Official Partner', icon: 'store' },
            { name: 'TotalEnergies Upper Hill', s: 'Trusted Station', icon: 'local_gas_station' }
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <span className="material-symbols-outlined !text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-white">{s.name}</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="material-symbols-outlined !text-[12px]">verified</span> {s.s}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
};

// --- Main Component ---

export default function Community() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Posts');

  const PostCard = ({ type, author, time, location, title, content, helpfulCount, commentCount, image }: any) => {
    const isEmergency = type === 'emergency';
    
    return (
      <article 
        onClick={() => navigate(`/community/post/1`)}
        className={`hub-glass glass-edge rounded-xl p-6 shadow-2xl relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 cursor-pointer ${isEmergency ? 'border border-red-500/20' : ''}`}
      >
        {isEmergency && <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {author.img ? (
              <img alt={author.name} className="w-10 h-10 rounded-full object-cover" src={author.img} />
            ) : (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isEmergency ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                <span className="material-symbols-outlined">{isEmergency ? 'emergency' : 'info'}</span>
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{author.name}</span>
                {isEmergency && (
                  <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Emergency</span>
                )}
                {author.verified && (
                  <div className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[12px] text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Verified</span>
                  </div>
                )}
                {author.available && (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
                    <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Available</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-on-surface-variant">
                <span>{location}</span>
                <span>•</span>
                <span>{time}</span>
              </div>
            </div>
          </div>
          <button className="text-on-surface-variant">
            <span className="material-symbols-outlined">more_horiz</span>
          </button>
        </div>
        
        <h3 className="text-xl font-headline font-bold text-white mb-3">{title}</h3>
        <p className="text-on-surface-variant leading-relaxed mb-6">{content}</p>
        
        {image && (
          <div className="rounded-xl overflow-hidden mb-6 aspect-video bg-surface-container-high relative">
            <img alt="Post content" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" src={image} />
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors group/btn">
              <span className="material-symbols-outlined !text-xl group-hover/btn:scale-110 transition-transform">thumb_up</span>
              <span className="text-xs font-medium">{helpfulCount} Helpful</span>
            </button>
            <button className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors group/btn">
              <span className="material-symbols-outlined !text-xl group-hover/btn:scale-110 transition-transform">chat_bubble</span>
              <span className="text-xs font-medium">{commentCount} Comments</span>
            </button>
          </div>
          {isEmergency ? (
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-red-600 text-white rounded text-xs font-bold hover:opacity-90 transition-opacity">Request Help</button>
              <button className="px-4 py-2 bg-white/5 text-white rounded text-xs font-bold hover:bg-white/10 transition-colors">Start Chat</button>
            </div>
          ) : (
            <button className="px-4 py-2 bg-white text-black rounded text-xs font-bold hover:bg-[#C9C6C0] transition-colors">Start Chat</button>
          )}
        </div>
      </article>
    );
  };

  const posts = [
    {
      type: 'emergency',
      author: { name: 'Anonymous User' },
      time: '2 mins ago',
      location: 'Upper Hill, Nairobi',
      title: 'Critical Shortage at Main Depot - Urgent help needed!',
      content: "We've been waiting for 4 hours and they just announced they've run out of 13kg cylinders. If anyone knows an alternative supplier nearby that is currently open, please share! Many families here are stranded.",
      helpfulCount: 42,
      commentCount: 12
    },
    {
      type: 'info',
      author: { 
        name: 'Sarah Kamau', 
        verified: true, 
        available: true, 
        img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDSvE05yjBDcJFI5EtLlIGvNd_caVGoiEPMdZ5IzLrVhBfNpsSwmV2QeVgUVQJeHTTBE8AlL6C_UrBEbZFC-LkJhUmWIxDVvJe_IQA8rmtkcP3zIN0jWtAhyTnEOqjnZNnQMM-c4IqI4kw1Da7_fbZzw9HePO73IwBs4Fzz4PROm3s2j7ZZCuHaFPGJ3EtiMxIJrXu5v9LGrb_h8wGxEodWo-PAKkqahp4_SShoqS8nygpjL2k7076WsLxLq2N0Wq-lftg9xLQfEQ' 
      },
      time: '15 mins ago',
      location: 'Westlands Square',
      title: 'Fresh stock just arrived at Rubis Westlands',
      content: 'Just refilled my 6kg tank. They have plenty of 6kg and 13kg in stock. Queue is moving fast (about 10 mins). Price is standard at 1,250 KES for the 6kg refill.',
      helpfulCount: 128,
      commentCount: 4,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_8D28xmWub9SIfcO9jSumktSNJ3mHWapL43Mf2jVq6w32FqJoWSUAbnPDYRbs8B6-Ca4LXAtZ1emHjJQ0AIAkj8Dizqyv1hOwGxJfRRCJ0Zrg-19T85Ior05udYU6OK5UI499ny-mSYGEeVUBx7HBk1GMwTfUlBB6RfC6rcipu50G_1uSqH5N8Z1_6uhaqmOINrkJD2yZ4ReneShkpWI0_htCFKM0KnwHzhsL8TPpY2DiON7Od93QiY_mQHUbCuU7TFgL7cPxxA'
    },
    {
      type: 'update',
      author: { name: 'Local Admin' },
      time: '1 hour ago',
      location: 'Global Update',
      title: 'New Safety Regulations for Home Delivery',
      content: "Please ensure all delivery personnel show their valid hub ID before allowing them access to your premises. We've updated the safety protocols...",
      helpfulCount: 256,
      commentCount: 0
    }
  ];

  return (
    <div className="min-h-screen bg-surface font-body text-on-surface transition-colors duration-300">
      <TopNavBar />
      <SideNavBar onCreatePost={() => navigate('/community/create')} />
      
      <main className="md:ml-64 mr-0 lg:mr-80 pt-24 px-4 md:px-8 pb-12 transition-all">
        {/* Filter Bar */}
        <div className="mb-10 flex items-center gap-3 overflow-x-auto no-scrollbar pb-2">
          {['All Posts', 'Emergency', 'Available', 'Nearby'].map((tag) => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === tag ? 'bg-white text-surface' : 'bg-surface-container-high text-on-surface-variant hover:text-white'
              }`}
            >
              {tag}
            </button>
          ))}
          <div className="h-6 w-px bg-outline-variant/30 mx-2"></div>
          <button className="flex items-center gap-2 text-on-surface-variant hover:text-white text-xs font-medium transition-colors">
            <span className="material-symbols-outlined !text-sm">filter_list</span> Sort: Newest
          </button>
        </div>

        {/* Feed Grid */}
        <div className="flex flex-col gap-6 max-w-3xl mx-auto">
          {posts.map((post, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <PostCard {...post} />
            </motion.div>
          ))}
        </div>
      </main>

      <RightSidebar />

      {/* FAB for mobile */}
      <button 
        onClick={() => navigate('/community/create')}
        className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-white text-black rounded-full shadow-2xl flex items-center justify-center z-50 active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined !text-3xl">add</span>
      </button>
    </div>
  );
}
