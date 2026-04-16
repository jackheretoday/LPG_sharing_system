import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, ShieldAlert, Sparkles } from 'lucide-react';
import { API_ROOT } from '@/lib/apiBase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  isEmergency?: boolean;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      text: "Namaste! I am your GasSahayak AI Assistant. How can I help you with gas safety or cylinder booking today?", 
      sender: 'ai' 
    }
  ]);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Pre-Processing for Safety
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('leak') || lowerInput.includes('smell') || lowerInput.includes('gas coming out')) {
      const emergencyMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "🚨 EMERGENCY: Turn off your regulator and open all windows immediately! Do not use any sparks or lights. Call our emergency response team now.",
        sender: 'ai',
        isEmergency: true
      };
      setMessages(prev => [...prev, emergencyMsg]);
      return;
    }

    try {
      const response = await fetch(`${API_ROOT}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })).concat([{ role: "user", content: input }])
        })
      });

      if (!response.ok) throw new Error("Backend AI failed");

      const data = await response.json();
      const aiText = data?.choices?.[0]?.message?.content || 'No response from AI model.';

      setMessages(prev => [...prev, { 
        id: (Date.now() + 2).toString(), 
        text: aiText, 
        sender: 'ai'
      }]);
    } catch (err) {
      console.error("AI Error:", err);
      setMessages(prev => [...prev, { 
        id: (Date.now() + 2).toString(), 
        text: "I'm having trouble connecting to my brain. Please check your connection or try again later.", 
        sender: 'ai'
      }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[350px] md:w-[400px] h-[500px] hub-glass rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30">
                  <Sparkles className="w-4 h-4 text-accent-blue" />
                </div>
                <div>
                  <h3 className="text-sm font-black tracking-tight text-white">Safety Assistant</h3>
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] text-white/40 uppercase font-black tracking-widest">Active AI</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/50" />
              </button>
            </div>

            {/* Chat Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth no-scrollbar"
            >
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-white text-black font-medium' 
                      : m.isEmergency 
                        ? 'bg-red-500/20 text-red-200 border border-red-500/30' 
                        : 'bg-white/5 text-white/90 border border-white/10'
                  }`}>
                    {m.isEmergency && <ShieldAlert className="w-4 h-4 mb-2" />}
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 bg-black/20 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about safety, leakage..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-accent-blue/50 transition-all"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  className="p-2 bg-white text-black rounded-xl hover:bg-white/90 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isOpen ? 'bg-white text-black' : 'bg-accent-blue text-white'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-bg-primary animate-bounce"></div>
      </motion.button>
    </div>
  );
}
