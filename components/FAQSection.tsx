
import React, { useState } from 'react';
import { FAQ } from '../types';

interface FAQSectionProps {
  faqs: FAQ[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-10 animate-fade">
      <div className="text-center space-y-2">
        <h2 className="font-luxury text-4xl">Preguntas <span className="text-[#990000] italic font-bold">Frecuentes</span></h2>
        <p className="text-zinc-500 text-[10px] mt-2 uppercase tracking-[0.5em] font-bold">Despeja tus dudas al instante</p>
      </div>

      <div className="space-y-4">
        {faqs.map((f) => (
          <div key={f.id} className="glass rounded-[25px] overflow-hidden border border-zinc-900 hover:border-zinc-700 transition-all">
            <button onClick={()=>setOpen(open === f.id ? null : f.id)} className="w-full p-6 text-left flex justify-between items-center transition-all">
              <span className="font-bold text-sm pr-4">{f.q}</span>
              <span className="text-[#990000] text-2xl leading-none">{open === f.id ? '−' : '+'}</span>
            </button>
            {open === f.id && (
              <div className="px-6 pb-6 text-zinc-400 text-xs leading-relaxed animate-fade border-t border-zinc-900/50 pt-4">
                {f.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
