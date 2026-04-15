import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

export default function PostDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Marcus Thorne',
      time: '1 hour ago',
      content: 'Confirmed. Just drove past Metro North. The queue is wrapping around the block. They\'ve posted a sign saying "Stock Expected 4 PM". I suggest trying the GreenWay Depot—they still had 50+ units 20 minutes ago.',
      likes: 14,
      replies: [
        {
          author: 'Lisa K.',
          time: '45 mins ago',
          content: 'Thanks Marcus! Just got mine from GreenWay. Life saver.',
          likes: 3
        }
      ]
    },
    {
      id: 2,
      author: 'David Chen',
      time: '30 mins ago',
      content: 'Does anyone know if the price at GreenWay is the standard government rate or is there a premium today?',
      likes: 2,
      replies: []
    }
  ]);

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-white selection:text-black">
      {/* TopNavBar */}
      <nav className="fixed top-0 w-full z-50 bg-[#131313]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-8 h-16 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-white font-headline">LPG Hub</span>
          <div className="hidden md:flex gap-6">
            <a className="text-[#C5C7C1] hover:text-white transition-colors text-sm" href="/community">Community</a>
            <a className="text-[#C5C7C1] hover:text-white transition-colors text-sm" href="/dashboard">Map</a>
            <a className="text-[#C5C7C1] hover:text-white transition-colors text-sm" href="/resources">Resources</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/10 transition-all rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined !text-xl">notifications</span>
          </button>
          <button className="p-2 hover:bg-white/10 transition-all rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined !text-xl">settings</span>
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
            <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANOqqvGAGuHubrB6YTrj37myyX1YfdWsMdSNS7qdSWME6ETTO7j7msJLpKmzwk4VOdgZbJKrb1WJHiIg9y0DbLP-BtshZyMKOpg2FokYDIKpFCBPXrAFdVaVN-WnCf_BRK8DToPEC0oom63uR0gjbq-CaFicSx8mTn5WkuFrMtmDuKMb8g-hpna_ydL_vXaDn9WSh_w9y9cZi92ruKACeImrlYp5hs8JVMOCVLBL6puyokynvSNwX2K8o9u8jVlT9hs4K3SxkVIw" />
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-4 md:px-8 max-w-5xl mx-auto">
        {/* Thread Header */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => navigate('/community')}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors text-sm"
          >
            <span className="material-symbols-outlined !text-xl group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Back to Feed
          </button>
          <div className="h-4 w-px bg-outline-variant/20"></div>
          <span className="text-xs font-medium uppercase tracking-widest text-on-surface-variant">Thread ID: {id || '#LPG-4902'}</span>
        </div>

        {/* Primary Post Card */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface-container rounded-xl overflow-hidden shadow-2xl mb-10 border-t border-white/5"
        >
          <div className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full overflow-hidden border border-white/5">
                <img alt="Sarah J." className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDg0rRaqs41L9sKZBTQVtDXOoGSOmYrEgO49rDVSfB-pt5q-bpoJNs51JToWdUkT5wW573ajkRY9q2eN_EFmsLxfV4p7XB8ihNWx5lDGCqe9JNleT9088L-y5p_tYDs8URFdn8QdzVAoQcgE70rUVHIrH3HDGbyjz2uRbC3zvqWzb0wI6xYCFPhPcqTVvQVu1j107PY8HBFcCRsBXMHLQjJYmdBwfc2ChgkOhqIL5R-YN94cOH-N-NAP44OEU7ab_pTX5TV6CL0ew" />
              </div>
              <div>
                <h3 className="font-headline font-bold text-lg text-white leading-tight inline-block">Sarah Jenkins</h3>
                <span className="inline-flex items-center gap-1 ml-2 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[#38bdf8] text-[10px] font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined !text-[14px]">verified</span> Verified Supplier
                </span>
                <p className="text-xs text-on-surface-variant">Central District • 2 hours ago</p>
              </div>
              <div className="ml-auto">
                <span className="bg-surface-container-high text-on-surface px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider underline decoration-white/20">LPG Availability</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-headline font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
              Current LPG shortage at Metro Station terminal?
            </h1>
            <p className="text-on-surface text-lg leading-relaxed mb-8 max-w-3xl font-light">
              Has anyone tried to refill at the North Metro terminal in the last hour? I'm hearing reports of long queues and potential stockouts. I need to secure a 12kg cylinder before the evening. Any verified alternatives nearby?
            </p>

            <div className="rounded-lg overflow-hidden mb-8 border border-white/5 aspect-video relative group">
              <img alt="Terminal" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD5_8KLwf2umrcQEnIKou59g6ukxyzygDuvyFL2dJ0j6onGiyptEi9IySFYBQs1zf_J8DROziQZPPRAT6_VxCnDd8mZU7ReFTig1SkLtMaEFRM6zk7IsMHx0VAeI_3UsnpKWQcpy1OKY-HWrTO7yBXrrZ5JAJsQVQhURz0NfTcQQMSExTOaAJNF5dadbp32Nrd3KJUkHyN1LYqYvorI3cfUahIDuOACrCOcuNO7CoULmhxfCADrD3gEYgsQJ5dbxXHph0EQZkMnsg" />
            </div>

            <div className="flex items-center gap-6 pt-6 border-t border-white/5">
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-xl">thumb_up</span>
                <span className="text-sm font-semibold">124</span>
              </button>
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-xl">forum</span>
                <span className="text-sm font-semibold">18 Comments</span>
              </button>
              <button className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-xl">share</span>
                <span className="text-sm font-semibold">Share</span>
              </button>
              <button className="ml-auto text-on-surface-variant hover:text-white transition-colors">
                <span className="material-symbols-outlined !text-xl">bookmark</span>
              </button>
            </div>
          </div>
        </motion.article>

        {/* Responses */}
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-headline font-bold text-xl text-white">Responses</h4>
          <div className="flex gap-2">
            <button className="text-xs font-bold px-3 py-1 bg-white text-black rounded-full">Newest</button>
            <button className="text-xs font-bold px-3 py-1 text-on-surface-variant hover:text-white transition-colors">Most Liked</button>
          </div>
        </div>

        {/* New Comment Input */}
        <div className="bg-surface-container-low rounded-xl p-4 mb-10 border-t border-white/5">
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
              <img alt="User" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChMu_6yTaedy4IwIN_yMdlJdEaGMI-kKP9IMuzz-Owin7JkuO8Y-yVuChUazumK1FT_pMu_EHnYCILu-2k7XyGa_ytfSK-OSksEiDWBFRxDghuIXJFvagmtCGUdHjwDbqvK3zTfVBiQOORGB6Aj0DzKgDwJbLFxapBI-CtlJBvuSaQFeHjI03C7ct4kWoGLpitZwPey-yM8WJaII_O5ck6ZbqaXY9jAP5y5-d6rJaTwlCVvUfkzv2W0ywpXHdLpPS1iovzr3hWnA" />
            </div>
            <div className="flex-grow">
              <textarea className="w-full bg-transparent border-none text-on-surface placeholder:text-on-surface-variant/40 focus:ring-0 resize-none min-h-[80px] p-0" placeholder="Write a thoughtful reply..."></textarea>
              <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                <div className="flex gap-2">
                  <button className="p-1.5 hover:bg-white/5 rounded text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined !text-lg">image</span>
                  </button>
                  <button className="p-1.5 hover:bg-white/5 rounded text-on-surface-variant flex items-center justify-center">
                    <span className="material-symbols-outlined !text-lg">link</span>
                  </button>
                </div>
                <button className="bg-white text-black px-6 py-1.5 rounded font-bold text-sm hover:opacity-90 transition-opacity">Post Reply</button>
              </div>
            </div>
          </div>
        </div>

        {/* Nested Comments */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-white/5">
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center text-xs font-bold text-white">
                  {comment.author[0]}
                </div>
              </div>
              <div className="flex-grow">
                <div className="bg-surface-container-low rounded-lg p-5 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-sm text-white">{comment.author}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20"></span>
                    <span className="text-xs text-on-surface-variant">{comment.time}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                    {comment.content}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs font-bold text-on-surface-variant">
                    <button className="flex items-center gap-1 hover:text-white transition-colors">
                      <span className="material-symbols-outlined !text-sm">thumb_up</span> {comment.likes}
                    </button>
                    <button className="hover:text-white transition-colors">Reply</button>
                  </div>
                </div>

                {comment.replies.map((reply, idx) => (
                  <div key={idx} className="mt-4 flex gap-4 pl-4 border-l border-white/10">
                    <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border border-white/5">
                       <div className="w-full h-full bg-surface-container-highest flex items-center justify-center text-[10px] font-bold text-white">
                        {reply.author[0]}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="bg-surface-container-high/40 rounded-lg p-4 border-t border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-xs text-white">{reply.author}</span>
                          <span className="text-xs text-on-surface-variant">{reply.time}</span>
                        </div>
                        <p className="text-sm text-on-surface-variant leading-relaxed font-light">
                          {reply.content}
                        </p>
                        <div className="flex items-center gap-4 mt-3 text-[10px] font-bold text-on-surface-variant">
                          <button className="flex items-center gap-1 hover:text-white transition-colors">
                            <span className="material-symbols-outlined !text-xs">thumb_up</span> {reply.likes}
                          </button>
                          <button className="hover:text-white transition-colors">Reply</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
