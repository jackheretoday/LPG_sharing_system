import { motion } from 'framer-motion';

export default function ProviderDetails() {
  return (
    <div className="flex bg-[#0e0e0e] text-[#e2e2e2] min-h-screen font-body selection:bg-white selection:text-black antialiased">
      {/* SideNavBar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 bg-neutral-900/80 backdrop-blur-2xl text-neutral-50 font-medium border-r border-white/10 p-4 gap-4 sticky top-0">
        <div className="flex items-center gap-3 mb-6 px-2">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
            <span className="material-symbols-outlined text-black font-bold">verified_user</span>
          </div>
          <div>
            <div className="text-lg font-black text-white leading-tight font-headline tracking-tighter">Lumina Utility</div>
            <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Verified Provider</div>
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {[
            { name: 'Emergency', icon: 'emergency_heat', active: false },
            { name: 'Providers', icon: 'local_gas_station', active: true },
            { name: 'Community', icon: 'groups', active: false },
            { name: 'Verification', icon: 'verified_user', active: false },
            { name: 'Settings', icon: 'settings', active: false },
          ].map((item) => (
            <a 
              key={item.name}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                item.active 
                ? 'bg-white text-black font-bold shadow-lg' 
                : 'text-neutral-400 hover:bg-neutral-800/50 hover:translate-x-1'
              }`} 
              href="#"
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
        <div className="mt-auto p-4 bg-surface-container rounded-xl border border-white/5">
          <p className="text-[10px] text-on-surface-variant mb-2 uppercase font-bold tracking-widest">Urgent Action</p>
          <button className="w-full py-2 bg-white text-black text-xs font-bold rounded-md hover:opacity-90 transition-all">
            Request Emergency Refill
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full pt-24 lg:pt-12">
        {/* Header Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4 mb-4">
              <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold tracking-widest uppercase rounded-full border border-white/10">Elite Tier Provider</span>
              <span className="text-on-surface-variant text-sm flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">location_on</span> Oslo, Norway
              </span>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-headline text-5xl md:text-7xl font-extrabold tracking-tighter text-white mb-6"
            >
              Aether Gas Systems
            </motion.h1>
            <p className="font-body text-on-surface-variant text-lg max-w-2xl leading-relaxed">
              Precision LPG distribution and industrial mechanic services. Specializing in high-pressure systems and residential sustainable energy logistics since 2012.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-6">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full"></div>
              <div className="relative w-48 h-48 bg-surface-container-high rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                <div className="text-center">
                  <div className="text-6xl font-headline font-black text-white">98</div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-bold">Trust Score</div>
                </div>
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle cx="96" cy="96" fill="none" r="90" stroke="rgba(255,255,255,0.05)" strokeWidth="4"></circle>
                  <circle cx="96" cy="96" fill="none" r="90" stroke="white" strokeDasharray="565" strokeDashoffset="11" strokeLinecap="round" strokeWidth="4"></circle>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Action Card */}
          <div className="md:col-span-1 bg-surface-container rounded-3xl p-8 flex flex-col justify-between border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 via-white to-white/20"></div>
            <div>
              <h3 className="font-headline text-2xl font-bold mb-4 text-white">Direct Service</h3>
              <p className="text-on-surface-variant text-sm mb-8">Average response time: <span className="text-white font-semibold">14 minutes</span></p>
              <div className="space-y-4">
                {['Certified Safety Inspection', 'Digital Compliance Logs', 'Secure Token Payments'].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-white/40">check_circle</span>
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="mt-12 w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs rounded-xl active:scale-[0.98] transition-all hover:brightness-90 shadow-xl">
              Request Service
            </button>
          </div>

          {/* Activity Log */}
          <div className="md:col-span-2 bg-surface-container-low rounded-3xl p-8 border border-white/5">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-headline text-xl font-bold text-white">Activity Log</h3>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Live Feed</span>
            </div>
            <div className="space-y-6">
              {[
                { title: 'Bulk Delivery Completed', time: '2h ago', desc: 'Residential Complex Nord-B, Oslo. 450L Refill.', active: true },
                { title: 'Safety Certification Renewed', time: 'Yesterday', desc: 'ISO 9001:2023 Audit passed with 0 discrepancies.', active: false },
                { title: 'Maintenance Dispatch', time: 'Oct 24', desc: 'Valve replacement at Central Utility Hub.', active: false },
              ].map((log, idx) => (
                <div key={idx} className={`flex gap-4 items-start ${log.active ? '' : 'opacity-40'}`}>
                  <div className={`w-2 h-2 rounded-full mt-2 ${log.active ? 'bg-white' : 'bg-neutral-500'}`}></div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-semibold text-white">{log.title}</span>
                      <span className="text-xs text-on-surface-variant">{log.time}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant">{log.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="bg-surface-container-low rounded-3xl p-8 border border-white/5 mb-12">
          <div className="flex flex-col md:flex-row gap-12">
            <div className="md:w-1/3">
              <h3 className="font-headline text-xl font-bold mb-2 text-white">Customer Sentiment</h3>
              <div className="text-5xl font-black text-white mb-4">4.9<span className="text-xl text-on-surface-variant font-normal">/5.0</span></div>
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="material-symbols-outlined text-white">star</span>
                ))}
              </div>
              <p className="text-sm text-on-surface-variant leading-relaxed">Based on 1,240 verified interactions. Rated highly for technical expertise and punctual arrival.</p>
            </div>
            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'Erik V.', role: 'Verified Client', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAMCOLFQVNgotBkUAWyQlbmeGShPcpA05bOICaije-yKfjwRdSIWI7ZtUfvwmrKRihSZLoCYYrwfi-JJFMMb_BFMwXDnR6fyINsJrYyuqFHHWK46kMXi8SZfuMBsIWxqLRvW3qudOkFSToddqed-NagKmWw8CnBFKNjVSu-aL4faqmuDTGbd7g9F6XpVA_m0c2xBBRa1-GXP5pUqNnfMXPdwdwjxjkDHwi6JI4TTu_oZHPKE-5XpikyH_i2izsWKo5v5ShluMLJg', text: '"Unmatched precision. Their mechanics caught a slow leak our previous provider missed for years."' },
                { name: 'Marta S.', role: 'Operations Director', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_EYj9iG1X0rOXJBn-GKriRMd8_dxaYB9qx-zOj2vWuDhNjDa55yVnh-CLqt7jkWAlWEjsmEkDvMt9apubCD4nHYMGMzCbu8EK7gz54jrmLWjU9OqAadgGi7DDOaz7YviwOdmDsRVnCpOGgT_IoB4N60gFx-8nEGmSIu4rZqIjFU3KWK8f2n_80qxYWixMA_cF7p3Iz96I-JZm764LsBHSodcu23CETw3TmC_gfM4tgg78tRNeK5C4NCha9P2R-xrqI944acjfeg', text: '"Lumina utility integration is seamless. Real-time tracking and automated billing are game changers."' }
              ].map((rev, idx) => (
                <div key={idx} className="bg-surface-container rounded-2xl p-6 border border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={rev.img} alt={rev.name} className="w-8 h-8 rounded-full border border-white/10" />
                    <div>
                      <div className="text-xs font-bold text-white">{rev.name}</div>
                      <div className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">{rev.role}</div>
                    </div>
                  </div>
                  <p className="text-xs italic text-on-surface-variant leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Showcase */}
        <section className="mb-12">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mb-2 font-bold">Technical Capability</p>
              <h2 className="font-headline text-3xl font-bold text-white">Facility <span className="text-neutral-500">&amp;</span> Equipment</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 h-[500px]">
            <div className="col-span-2 row-span-2 rounded-3xl overflow-hidden border border-white/5">
              <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVP1BzaY0rTzyDC-SdNUVTsWbj0ItiW19yN_8MagNVQBMb7plh6MlQLSmGTUkqEmiUjbBpcIbBcWLWklIcXQE-oycEdIfVC22DPY9-N9x1dISG4A8_snNv9q3P-h12FAc1HQiZ21FcskfNQKPaKBTFd3G-9JxvsgrwcjCeyGoy1kv1C1w2q-8JXrBqkLdZBNoxjSQwa6YvZGiEf5O8hf80s-5Rrism-dBJSr51V8OhPICe3yy-uIsZ-sTupCRxKhllYWCK0ZZSow" />
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/5">
              <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuaBhcvMXKrt_CBVvf447owm6Yiccpjh-eIGkWuyzKruvXh7wba_599xuPmFwwRoGOWz6l13-GVWhbMmR7KgS6QItBpwFh3r5q4WIbtnYjBCLY1IWWQBWYdbFcMSTgM-N4e6oP7hhPGDBoWbBpKTwO3NtQ-b44z2gRCHDCq1iA2wTnVoGV_aukK4owlOMDmWXRUoSItijhR20AkmV5Gray7g-VPJ0AfmoKd651nDI-Y40gIrXDZSzqPpnUmmxrg6jlqHvXRGocew" />
            </div>
            <div className="rounded-3xl overflow-hidden border border-white/5">
              <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDOdpl3ClCPzm5r4tN9nUxbz-2gQsNSc8rGdfvYm9nP84Wa5-ANWG6ZnoNSIlVoDeUWFAQMppdRHQgftZ3gX9Z6NHCD2yVrJKVLBvFrLjyUaor9Lgl6nTRWcwFIexbo4ryvJAaX64XOLj9V7J4I7py2P8VklZifNmtm0Tggt4xATcFlknGd6vxJOZqPqAR1YyPoJyPDhDSIcu-5cpey-B4G8vbI5ZQeCqmesFcg095nBhvmjbcRKDIIF4aFeyUCqYzAP1RsCPfJ-A" />
            </div>
            <div className="col-span-2 rounded-3xl overflow-hidden border border-white/5 h-auto">
              <img className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAP9U5XdQyOhCHUBU7b41QyeybO-Tj5hwu7CbXU1I4bFzd8QaMSL0HDXb2W4rKxsXvlMOknzXkHISE17TTSaFk0J2ewDpWV5ZvzZya2-KSbuw8LOObyG0BGiHGNq2LZx4rIQhEd30gGvvKYD-fOqE2ygVM1yIMGKR2bBBXYq45fs6jG6DuAQGGD2BGqdMdaT607ayIIzSK9XPiakUjylS_mTG5ZWiQiE8GmXWlphNu8vSy4lblJg3ukUTy4LIIDaNgofKkqCBljg" />
            </div>
          </div>
        </section>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black/90 backdrop-blur-xl border-t border-white/10 px-6 py-3 z-50 flex justify-between items-center">
        {[
          { icon: 'home', label: 'Home' },
          { icon: 'local_gas_station', label: 'Providers', active: true },
          { icon: 'emergency_heat', label: 'Urgent' },
          { icon: 'account_circle', label: 'Profile' }
        ].map((item) => (
          <button key={item.label} className={`flex flex-col items-center gap-1 ${item.active ? 'text-white' : 'text-neutral-500'}`}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
