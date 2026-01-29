
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
      setMessages([{ role: 'bot', text: '¡Hola! Soy Prisma. Estoy aquí para guiar tu camino en Tomauno Models. ¿Qué deseas consultar hoy?' }]);
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
    const botText = await askPrisma(userText, newKnowledge);
    setMessages(prev => [...prev, { role: 'bot', text: botText }]);
    setLoading(false);
  };

  const handleTrain = async () => {
    setIsSaving(true);
    const res = await apiService.request('saveGlobalNews', { txt: newKnowledge });
    setIsSaving(false);
    if(res) {
       alert('¡Cerebro de Prisma actualizado correctamente!');
       setShowTrain(false);
       setIsOpen(false); // Cerramos tras el éxito
    }
  };

  return (
    <div className="no-print fixed bottom-24 right-6 z-[9999]">
      {isOpen ? (
        <div className="w-[350px] h-[550px] bg-zinc-950 border border-red-900/40 rounded-[45px] shadow-[0_30px_90px_rgba(153,0,0,0.5)] flex flex-col overflow-hidden animate-fade backdrop-blur-3xl">
          <div className="p-6 bg-[#2e0505] flex justify-between items-center relative overflow-hidden">
             <div className="absolute bottom-0 left-0 w-full h-[1px] bg-red-600/50"></div>
             <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-xl italic shadow-lg animate-pulse">P</div>
               <div>
                  <p className="font-luxury font-bold text-sm tracking-widest text-white">Prisma AI</p>
                  <p className="text-[7px] uppercase font-black text-red-400 tracking-tighter">Powered by Gemini 3</p>
               </div>
             </div>
             <div className="flex gap-4">
                {isAdmin && <button onClick={()=>setShowTrain(!showTrain)} className="text-zinc-400 hover:text-white transition-all text-sm">⚙️</button>}
                <button onClick={()=>setIsOpen(false)} className="text-zinc-600 hover:text-white transition-all text-lg">✕</button>
             </div>
          </div>
          
          {showTrain ? (
            <div className="p-8 space-y-6 flex flex-col flex-1 animate-fade">
               <div className="space-y-2">
                  <p className="text-[8px] uppercase font-black text-red-600 tracking-widest">Base de Conocimientos</p>
                  <p className="text-[7px] text-zinc-500 uppercase italic">Describe cursos, precios y reglas de la academia.</p>
               </div>
               <textarea value={newKnowledge} onChange={e=>setNewKnowledge(e.target.value)} className="flex-1 bg-black border border-zinc-900 rounded-3xl p-6 text-xs italic outline-none focus:border-red-600 shadow-inner resize-none text-zinc-300" />
               <button onClick={handleTrain} disabled={isSaving} className="bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 py-5 rounded-full text-[9px] font-black uppercase tracking-[0.3em] shadow-xl transition-all">
                  {isSaving ? 'Sincronizando...' : 'Entrenar Prisma'}
               </button>
               <button onClick={()=>setShowTrain(false)} className="text-[8px] uppercase font-bold text-zinc-700 hover:text-white">Volver al chat</button>
            </div>
          ) : (
            <>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-black/20 to-transparent">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-5 rounded-[28px] text-[12px] shadow-lg leading-relaxed ${m.role === 'user' ? 'bg-[#990000] text-white rounded-br-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none italic'}`}>
                      {m.text}
                    </div>
                  </div>
                ))}
                {loading && (
                   <div className="flex justify-start">
                      <div className="bg-zinc-900 p-4 rounded-full flex gap-1 animate-pulse">
                         <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                         <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                         <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                      </div>
                   </div>
                )}
              </div>
              <div className="p-5 bg-black/40 backdrop-blur-md border-t border-zinc-900 flex gap-3">
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter' && handleSend()} placeholder="Consultar a Prisma..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-6 py-4 text-xs outline-none focus:border-red-600 shadow-inner text-white" />
                <button onClick={handleSend} className="bg-red-600 w-14 h-14 rounded-full flex items-center justify-center shadow-[0_10px_20px_rgba(153,0,0,0.3)] hover:bg-red-700 transition-all active:scale-90">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </>
          )}
        </div>
      ) : (
        <button onClick={()=>setIsOpen(true)} className="w-20 h-20 bg-[#990000] rounded-full flex items-center justify-center shadow-[0_20px_50px_rgba(153,0,0,0.5)] border-4 border-white/10 group transition-all hover:scale-110 active:scale-90">
           <span className="font-luxury font-black text-4xl italic text-white group-hover:animate-pulse">P</span>
        </button>
      )}
    </div>
  );
};
