
import React, { useState, useRef, useEffect } from 'react';
import { askPrisma } from '../services/geminiService';

export const PrismaAssistant: React.FC<{ knowledge: string }> = ({ knowledge }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Solo saludar una vez por sesión de navegador
    const greeted = sessionStorage.getItem('prisma_greeted');
    if (!greeted) {
      setMessages([{ role: 'bot', text: '¡Hola! Soy Prisma. Estoy aquí para guiar tu camino profesional en Tomauno Models. ¿En qué puedo ayudarte hoy?' }]);
      sessionStorage.setItem('prisma_greeted', 'true');
    } else if (messages.length === 0) {
      setMessages([{ role: 'bot', text: 'Bienvenido de nuevo. ¿Tienes alguna otra consulta sobre los cursos o castings?' }]);
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
    
    // Aquí se podría disparar un log al administrador si se desea
  };

  return (
    <div className="no-print fixed bottom-24 right-6 z-[9999]">
      {isOpen ? (
        <div className="w-[340px] h-[500px] bg-zinc-950 border border-red-900/40 rounded-[35px] shadow-[0_20px_60px_rgba(153,0,0,0.3)] flex flex-col overflow-hidden animate-fade">
          <div className="p-5 bg-gradient-to-r from-[#4d0000] to-black flex justify-between items-center border-b border-red-900/20">
             <div className="flex items-center gap-3">
               <div className="w-9 h-9 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg italic shadow-lg">P</div>
               <div>
                 <p className="font-luxury font-bold text-sm tracking-widest">Prisma AI</p>
                 <p className="text-[8px] text-zinc-400 uppercase tracking-tighter">Asistente Virtual Activo</p>
               </div>
             </div>
             <button onClick={()=>setIsOpen(false)} className="text-zinc-500 hover:text-white transition-colors">✕</button>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-5 space-y-5 scroll-smooth">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-[20px] text-[13px] leading-relaxed shadow-md ${m.role === 'user' ? 'bg-[#990000] text-white rounded-br-none' : 'bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-bl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl rounded-bl-none animate-pulse">
                   <div className="flex gap-1">
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce"></div>
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                     <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                   </div>
                </div>
              </div>
            )}
          </div>
          <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 flex gap-3">
            <input 
              value={input} 
              onChange={e=>setInput(e.target.value)} 
              onKeyDown={e=>e.key==='Enter' && handleSend()} 
              placeholder="Pregúntame sobre el curso..." 
              className="flex-1 bg-black border border-zinc-800 rounded-full px-5 py-3 text-xs outline-none focus:border-red-600 transition-all" 
            />
            <button onClick={handleSend} className="bg-[#990000] w-10 h-10 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={()=>setIsOpen(true)} 
          title="Hablar con Prisma AI"
          className="w-16 h-16 bg-[#990000] rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(153,0,0,0.5)] border-2 border-white/10 hover:scale-110 active:scale-90 transition-all animate-bounce"
        >
           <span className="font-luxury font-bold text-3xl italic">P</span>
        </button>
      )}
    </div>
  );
};
