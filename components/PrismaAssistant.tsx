
import React, { useState, useRef, useEffect } from 'react';
import { askPrisma } from '../services/geminiService';
import { apiService } from '../apiService';

interface PrismaAssistantProps {
  knowledge: string;
  isAdmin?: boolean;
  onSaveKnowledge?: (txt: string) => Promise<void>;
}

export const PrismaAssistant: React.FC<PrismaAssistantProps> = ({ knowledge, isAdmin, onSaveKnowledge }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTrain, setShowTrain] = useState(false);
  const [newKnowledge, setNewKnowledge] = useState(knowledge);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'bot', text: '¡Hola! Soy Prisma Elite, el nuevo núcleo de IA de Tomauno Models. He sido actualizado con capacidades de búsqueda en tiempo real. ¿Cómo puedo asistirte hoy?' }]);
    }
  }, []);

  useEffect(() => { 
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; 
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);
    
    const botText = await askPrisma(userText, knowledge);
    setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    setLoading(false);
  };

  return (
    <div className="no-print fixed bottom-28 right-10 z-[10000]">
      {isOpen ? (
        <div className="w-[400px] h-[700px] bg-black border-2 border-red-900/40 rounded-[60px] shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-fade backdrop-blur-3xl">
          
          <div className="p-10 bg-gradient-to-br from-[#2e0505] to-black flex justify-between items-center border-b border-red-900/10">
             <div className="flex items-center gap-6">
               <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center font-black text-3xl italic shadow-[0_0_30px_rgba(255,0,0,0.4)] text-white">P</div>
               <div>
                  <p className="font-luxury font-black text-xl text-white tracking-tight">PRISMA ELITE</p>
                  <div className="flex items-center gap-2">
                     <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                     <p className="text-[9px] uppercase font-black text-zinc-500 tracking-[0.3em]">IA Lead Architect</p>
                  </div>
               </div>
             </div>
             <button onClick={()=>setIsOpen(false)} className="text-zinc-500 hover:text-white transition-all text-3xl">✕</button>
          </div>
          
          <div ref={chatRef} className="flex-1 overflow-y-auto p-10 space-y-8 bg-zinc-950/20 scrollbar-hide">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-6 rounded-[35px] text-sm shadow-2xl leading-relaxed animate-fade ${m.role === 'user' ? 'bg-red-600 text-white rounded-br-none font-bold' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none italic'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 p-5 rounded-full flex gap-3 animate-pulse border border-zinc-800">
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-black border-t border-zinc-900 flex gap-4">
            <input 
              value={input} 
              onChange={e=>setInput(e.target.value)} 
              onKeyDown={e=>e.key==='Enter' && handleSend()} 
              placeholder="Escribe una consulta técnica o casting..." 
              className="flex-1 bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-5 text-sm outline-none focus:border-red-600 text-white font-medium" 
            />
            <button 
              onClick={handleSend} 
              disabled={loading || !input.trim()}
              className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all disabled:opacity-20"
            >
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={()=>setIsOpen(true)} 
          className="w-28 h-28 bg-red-600 rounded-full flex items-center justify-center shadow-[0_20px_80px_rgba(255,0,0,0.5)] border-4 border-white/10 group transition-all hover:scale-110 active:rotate-12"
        >
           <span className="font-luxury font-black text-6xl italic text-white group-hover:animate-pulse">P</span>
        </button>
      )}
    </div>
  );
};
