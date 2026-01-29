
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
  const [isSaving, setIsSaving] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{ role: 'bot', text: '¡Hola! Soy Prisma, la IA de Tomauno Models. ¿Deseas saber sobre nuestros próximos cursos o los castings de moda en la ciudad? Pregúntame lo que quieras.' }]);
    }
    setNewKnowledge(knowledge);
  }, [knowledge]);

  useEffect(() => { 
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; 
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setLoading(true);
    
    // Prisma usa Gemini 3 Pro con Google Search habilitado para noticias de moda
    const botText = await askPrisma(userText, knowledge);
    setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    setLoading(false);
  };

  const handleTrain = async () => {
    setIsSaving(true);
    const ok = await apiService.request('saveGlobalNews', { txt: newKnowledge });
    if(ok) {
       if (onSaveKnowledge) await onSaveKnowledge(newKnowledge);
       setShowTrain(false);
    }
    setIsSaving(false);
  };

  return (
    <div className="no-print fixed bottom-24 right-8 z-[9999]">
      {isOpen ? (
        <div className="w-[380px] h-[650px] bg-zinc-950 border-2 border-red-600/20 rounded-[50px] shadow-[0_50px_100px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden animate-fade backdrop-blur-3xl">
          
          <div className="p-8 bg-gradient-to-r from-[#2e0505] to-black flex justify-between items-center border-b border-red-600/10">
             <div className="flex items-center gap-5">
               <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-black text-2xl italic shadow-[0_0_20px_rgba(255,0,0,0.5)] text-white">P</div>
               <div>
                  <p className="font-luxury font-black text-lg text-white tracking-tight">PRISMA AI</p>
                  <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                     <p className="text-[9px] uppercase font-black text-zinc-500 tracking-widest">Digital Elite Assistant</p>
                  </div>
               </div>
             </div>
             <div className="flex gap-4">
                {isAdmin && (
                  <button onClick={()=> setShowTrain(!showTrain)} className={`transition-all p-2 rounded-full bg-black/40 ${showTrain ? 'text-red-500 shadow-[0_0_10px_rgba(255,0,0,0.3)]' : 'text-zinc-500 hover:text-white'}`}>⚙️</button>
                )}
                <button onClick={()=>setIsOpen(false)} className="text-zinc-500 hover:text-white transition-all text-2xl p-2">✕</button>
             </div>
          </div>
          
          {showTrain ? (
            <div className="p-10 space-y-6 flex flex-col flex-1 bg-black/60">
               <div className="space-y-2">
                  <p className="text-[10px] uppercase font-black text-red-600 tracking-[0.4em]">Memoria Maestra Prisma</p>
                  <p className="text-[11px] text-zinc-500 italic">Entrena a tu asistente alimentando el Google Doc desde aquí.</p>
               </div>
               <textarea 
                  value={newKnowledge} 
                  onChange={e=>setNewKnowledge(e.target.value)} 
                  className="flex-1 bg-zinc-900/50 border-2 border-zinc-800 rounded-[35px] p-8 text-xs italic outline-none focus:border-red-600 text-zinc-100 resize-none shadow-inner" 
                  placeholder="Actualiza precios, horarios o noticias aquí..." 
               />
               <button 
                  onClick={handleTrain} 
                  disabled={isSaving} 
                  className="bg-red-600 hover:bg-red-700 py-6 rounded-full text-[10px] font-black uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95 text-white"
               >
                  {isSaving ? 'Sincronizando...' : 'Guardar Memoria'}
               </button>
            </div>
          ) : (
            <>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-black/20 scrollbar-hide">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[30px] text-xs shadow-2xl leading-relaxed animate-fade ${m.role === 'user' ? 'bg-red-600 text-white rounded-br-none font-bold' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none italic'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-zinc-900 p-4 rounded-full flex gap-2 animate-pulse border border-zinc-800">
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-6 bg-black border-t border-zinc-900 flex gap-4">
                <input 
                  value={input} 
                  onChange={e=>setInput(e.target.value)} 
                  onKeyDown={e=>e.key==='Enter' && handleSend()} 
                  placeholder="Escribe tu consulta..." 
                  className="flex-1 bg-zinc-900 border-2 border-zinc-800 rounded-full px-8 py-5 text-sm outline-none focus:border-red-600 text-white" 
                />
                <button 
                  onClick={handleSend} 
                  disabled={loading || !input.trim()}
                  className="bg-red-600 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all disabled:opacity-20"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button 
          onClick={()=>setIsOpen(true)} 
          className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center shadow-[0_15px_60px_rgba(255,0,0,0.6)] border-4 border-white/20 group transition-all hover:scale-110 active:rotate-12"
        >
           <span className="font-luxury font-black text-5xl italic text-white group-hover:animate-pulse">P</span>
        </button>
      )}
    </div>
  );
};
