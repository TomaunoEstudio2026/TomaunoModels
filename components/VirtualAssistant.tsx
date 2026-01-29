
import React, { useState, useRef, useEffect } from 'react';
// Fix: Corrected imported member name from geminiService
import { askPrisma } from '../services/geminiService';
import { Course } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface VirtualAssistantProps {
  courses: Course[];
}

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ courses }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: '¡Hola! Soy el asistente virtual de Tomauno Models. ¿En qué puedo ayudarte hoy? Consultame sobre cursos, inscripciones o cómo ser parte del staff.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    const context = `Cursos disponibles: ${courses.map(c => c.titulo).join(', ')}. Info general: Se requiere compromiso y estética profesional.`;
    // Fix: Call askPrisma instead of non-existent askVirtualAssistant
    const response = await askPrisma(userMsg, context);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setLoading(false);
  };

  return (
    <div className="animate-slideUp max-w-2xl mx-auto h-[70vh] flex flex-col space-y-4">
      <div className="text-center space-y-1">
        <h2 className="font-luxury text-3xl">Asistente <span className="text-red-600 font-bold italic">Virtual</span></h2>
        <p className="text-zinc-500 text-[10px] tracking-widest uppercase">Powered by Gemini Flash 3</p>
      </div>

      <div className="flex-1 bg-zinc-900/40 rounded-[30px] border border-red-900/20 shadow-2xl overflow-hidden flex flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-black/60 border border-zinc-800 text-zinc-300 rounded-bl-none'
              }`}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-black/60 border border-zinc-800 p-4 rounded-2xl rounded-bl-none">
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1 h-1 bg-red-600 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-black/40 border-t border-zinc-800 flex gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu consulta aquí..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-6 py-3 focus:border-red-600 outline-none"
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            className="bg-red-600 p-3 rounded-full hover:bg-red-700 transition-all disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};
