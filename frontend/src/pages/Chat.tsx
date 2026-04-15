import { ChatBox } from '@/components/ChatBox';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Chat() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full bg-black text-white p-4 md:p-8 flex flex-col font-sans overflow-hidden">
      <div className="max-w-4xl w-full mx-auto flex-1 flex flex-col">
        <header className="mb-6 flex items-center gap-4">
           <button 
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-white/5 rounded-full transition-colors hidden md:block"
           >
             <ArrowLeft className="w-5 h-5 text-gray-400" />
           </button>
           <div>
             <h1 className="text-2xl font-light tracking-tight">Messages</h1>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Direct Communication</p>
           </div>
        </header>

        <div className="flex-1 min-h-0">
          <ChatBox />
        </div>

        <footer className="mt-6 text-center">
           <p className="text-[10px] text-gray-600">
             Safety Tip: Arrange cylinder exchange in public, well-lit spaces only. 
             Report any suspicious activity.
           </p>
        </footer>
      </div>
    </div>
  );
}
