import { useState, useRef, useEffect } from 'react';
import { Send, User, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { mockMessages } from '@/lib/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function ChatBox() {
  const [messages, setMessages] = useState<any[]>(mockMessages);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

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

  const simulateOwnerPaymentRequest = () => {
    const amount = '950';
    setMessages(prev => [...prev, { 
      id: 'pay-' + Date.now(), 
      text: `Payment Request: ₹${amount} for Spare Cylinder (Andheri West)`, 
      sender: 'owner',
      isPaymentRequest: true,
      amount
    }]);
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0e0e]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
          >
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center flex flex-col items-center">
              <div className="w-16 h-1 bg-neutral-200 rounded-full mb-6"></div>
              <h3 className="text-black text-xl font-black mb-1">Scan to Pay</h3>
              <p className="text-neutral-500 text-sm mb-6">UPI Payment Simulation</p>
              
              {/* Simulated QR */}
              <div className="w-48 h-48 bg-neutral-100 rounded-2xl p-4 mb-6 border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center">
                <div className="grid grid-cols-4 gap-2 opacity-80">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className={`w-6 h-6 rounded-sm ${Math.random() > 0.5 ? 'bg-black' : 'bg-transparent'}`}></div>
                  ))}
                </div>
                <p className="text-[10px] text-black font-bold mt-4 uppercase tracking-[0.2em]">UPI ID: gassahayak@upi</p>
              </div>

              <p className="text-2xl font-black text-black mb-8">₹{paymentAmount}</p>
              
              <button 
                onClick={() => {
                  setShowPaymentModal(false);
                  const transactionId = 'GS-' + Math.random().toString(36).substring(7).toUpperCase();
                  alert('Payment Successful! Transaction ID: ' + transactionId);
                  
                  setMessages(prev => [
                    ...prev, 
                    { id: 'sys-' + Date.now(), text: '✅ Payment of ₹' + paymentAmount + ' Verified by GasSahayak SecurePay.', sender: 'system' },
                    { 
                      id: 'sys-contact-' + Date.now(), 
                      text: `🤝 Contact Information Exchanged:\n\nOwner: Rahul Sharma (+91 98XXX XXX01)\nBuyer: You (Jay Kshirsagar - +91 88XXX XXX12)\n\nPlease coordinate the pickup/delivery now.`, 
                      sender: 'system' 
                    }
                  ]);
                }}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
              >
                Confirm Payment
              </button>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="mt-4 text-neutral-400 text-xs font-bold uppercase tracking-widest"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Header */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1 mr-1">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <User className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-bold text-white flex items-center gap-1.5">
              Rahul Sharma
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            </p>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">Verifed Owner • Online</p>
          </div>
        </div>
        <button 
          onClick={simulateOwnerPaymentRequest}
          className="text-[10px] bg-white text-black px-3 py-1.5 rounded-full font-black uppercase tracking-tighter hover:bg-primary transition-colors"
        >
          Dev: Simulation Pay Req
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m: any) => (
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
                "max-w-[85%] rounded-2xl px-4 py-3 text-sm transition-all",
                m.sender === 'user' 
                  ? "bg-white text-black rounded-tr-none font-bold" 
                  : m.sender === 'system'
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-center w-full rounded-xl text-xs font-bold"
                  : "bg-white/5 text-gray-100 border border-white/10 rounded-tl-none"
              )}>
                {m.text}
                
                {m.isPaymentRequest && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <button 
                      onClick={() => {
                        setPaymentAmount(m.amount);
                        setShowPaymentModal(true);
                      }}
                      className="w-full py-2 bg-emerald-500 text-black rounded-lg text-xs font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors"
                    >
                      Pay Now via UPI
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div className="p-5 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <Input 
            placeholder="Type your message..." 
            className="border-0 bg-transparent focus-visible:ring-0 text-sm h-10 flex-1 px-3 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button 
            size="icon" 
            className="rounded-xl w-10 h-10 bg-white text-black hover:bg-primary transition-colors"
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
