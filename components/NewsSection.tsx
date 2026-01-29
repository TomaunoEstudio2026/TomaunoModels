
import React from 'react';
import { NewsItem, Model } from '../types';

interface NewsSectionProps {
  news: NewsItem[];
  currentUser: Model | null;
  isAdmin: boolean;
  onPostulate: (id: string) => void;
}

export const NewsSection: React.FC<NewsSectionProps> = ({ news, currentUser, isAdmin, onPostulate }) => {
  return (
    <div className="animate-fade max-w-5xl mx-auto space-y-12">
      <div className="text-center space-y-3">
        <h2 className="font-luxury text-4xl md:text-5xl">Noticias & <span className="text-[#990000] italic font-bold">Novedades</span></h2>
        <p className="text-zinc-500 text-[10px] tracking-[0.4em] uppercase font-bold">Oportunidades de Casting en Tiempo Real</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {news.map((item) => {
          const isPostulated = currentUser?.postulatedTo.includes(item.id);
          
          return (
            <div key={item.id} className={`glass rounded-[40px] border overflow-hidden shadow-2xl flex flex-col md:flex-row group transition-all ${isPostulated ? 'border-green-600/30 bg-green-950' : 'border-zinc-900 hover:border-[#990000]'}`}>
               <div className="md:w-48 bg-black flex flex-col items-center justify-center p-8 border-r border-zinc-900">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full mb-3 ${
                     item.type === 'CASTING' ? 'bg-red-600/20 text-red-500' : 
                     item.type === 'EVENTO' ? 'bg-blue-600/20 text-blue-500' : 'bg-green-600/20 text-green-500'
                  }`}>{item.type}</span>
                  <span className="text-zinc-500 text-[10px] text-center uppercase tracking-tighter">{item.date}</span>
               </div>
               <div className="p-10 flex-1 space-y-4">
                  <h3 className={`font-luxury text-2xl transition-colors ${isPostulated ? 'text-green-500' : 'group-hover:text-red-600'}`}>{item.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
                  
                  <div className="flex flex-wrap gap-4 pt-4">
                     {item.type === 'CASTING' && (
                        <button 
                          onClick={() => onPostulate(item.id)}
                          disabled={isPostulated}
                          className={`px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg active:scale-95 flex items-center gap-2 ${
                             isPostulated ? 'bg-green-600/20 text-green-500 border border-green-600/30' : 'bg-[#990000] hover:bg-red-700 text-white shadow-[0_10px_20px_rgba(153,0,0,0.3)]'
                          }`}
                        >
                           {isPostulated ? (
                             <>
                               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                               ¡Ya Postulado!
                             </>
                           ) : 'Postularme Ahora'}
                        </button>
                     )}
                     
                     {isAdmin && (
                        <div className="flex items-center gap-2 bg-black/50 px-5 py-3 rounded-full border border-zinc-800">
                           <span className="text-[9px] text-zinc-500 uppercase font-bold">Postulados:</span>
                           <span className="text-red-500 font-bold text-sm">{item.applicants?.length || 0}</span>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
