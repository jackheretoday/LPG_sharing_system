import { useState, useRef, useEffect } from 'react';
import { Send, User, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { mockMessages } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function ChatBox() {
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: input, sender: 'user' }]);
    setInput('');
    
    // Simple mock reply
    setTimeout(() => {
      setMessages(prev => [...prev, { id: 'reply', text: 'I understand. Let me check the timing for you.', sender: 'owner' }]);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="md:hidden p-1 mr-1">
            <ChevronLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <User className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-white flex items-center gap-1.5">
              Suresh Raina
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            </p>
            <p className="text-[10px] text-green-400">Verifed Seller • Online</p>
          </div>
        </div>
        <div className="hidden md:block">
           <Badge className="bg-white/5 text-[10px] text-gray-400 border-white/10">Ref: LP-9021</Badge>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
      >
        <div className="text-center py-4 opacity-30">
          <p className="text-[10px] uppercase tracking-widest px-4 py-1 border border-white/20 rounded-full inline-block">
            Secure End-to-End Chat
          </p>
        </div>

        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className={cn(
                "flex w-full",
                m.sender === 'user' ? "justify-end" : "justify-start"
              )}
            >
              <div className={cn(
                "max-w-[80%] rounded-2xl px-4 py-3 text-sm font-light leading-relaxed",
                m.sender === 'user' 
                  ? "bg-white text-black rounded-tr-none shadow-lg shadow-white/5" 
                  : "bg-white/5 text-gray-100 border border-white/10 rounded-tl-none"
              )}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl focus-within:border-white/30 transition-all">
          <Input 
            placeholder="Type your message..." 
            className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-10 flex-1 px-3"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className="rounded-xl w-10 h-10 bg-white text-black hover:bg-white/90"
            onClick={handleSend}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Simple Badge helper if needed
function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", className)}>
      {children}
    </div>
  )
}
