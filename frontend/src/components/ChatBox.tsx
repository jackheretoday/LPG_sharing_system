import { useEffect, useRef, useState } from "react";
import { Send, User, ChevronLeft, ShieldCheck } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { chatApi } from "@/lib/chatApi";
import { getStoredUser } from "@/lib/trustAuth";

export function ChatBox() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState("");
  const [partner, setPartner] = useState<any>(null);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = getStoredUser();

  useEffect(() => {
    const run = async () => {
      try {
        const res = await chatApi.bootstrap();
        setConversationId(res.conversationId);
        setPartner(res.partner);
        setMessages(res.messages || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load chat");
      }
    };
    run();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !conversationId) return;
    try {
      const res = await chatApi.sendMessage(conversationId, { body: input.trim() });
      setMessages((prev) => [...prev, res.message]);
      setInput("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0e0e0e]/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
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
              {partner?.name || "Conversation"}
              {partner?.is_verified && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
            </p>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-widest">
              {partner?.role || "partner"}
            </p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <AnimatePresence initial={false}>
          {messages.map((m: any) => {
            const isMine = m.sender_id === user?.id;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={cn("flex w-full", isMine ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm transition-all",
                    isMine ? "bg-white text-black rounded-tr-none font-bold" : "bg-white/5 text-gray-100 border border-white/10 rounded-tl-none"
                  )}
                >
                  {m.body}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="p-5 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 rounded-2xl">
          <Input
            placeholder="Type your message..."
            className="border-0 bg-transparent focus-visible:ring-0 text-sm h-10 flex-1 px-3 text-white"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button size="icon" className="rounded-xl w-10 h-10 bg-white text-black hover:bg-primary transition-colors" onClick={handleSend}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
