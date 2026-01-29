
import React, { useState, useEffect } from 'react';
import { Model } from '../types';
import { LOGO_URL } from '../constants';

interface HomeCarouselProps {
  models: Model[];
  onViewPortfolio: (dni: string) => void;
}

export const HomeCarousel: React.FC<HomeCarouselProps> = ({ models, onViewPortfolio }) => {
  const publicModels = models.filter(m => m.isPublic && m.foto1);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (publicModels.length === 0) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % publicModels.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [publicModels.length]);

  if (publicModels.length === 0) return null;

  const current = publicModels[index];

  return (
    <div className="w-full h-[500px] md:h-[700px] relative overflow-hidden rounded-[80px] shadow-[0_30px_100px_rgba(0,0,0,0.8)] animate-fade group cursor-pointer" onClick={() => onViewPortfolio(current.dni)}>
       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10"></div>
       <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40 z-10"></div>
       
       <img 
         key={current.dni} 
         src={current.foto1} 
         className="w-full h-full object-cover animate-fade-in-slow scale-100 group-hover:scale-105 transition-transform duration-[5000ms]" 
         alt={current.nombre} 
       />

       <div className="absolute bottom-20 left-16 z-20 space-y-4">
          <div className="flex items-center gap-3">
             <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
             <p className="text-white text-[10px] uppercase font-black tracking-[0.8em]">Talento Destacado</p>
          </div>
          <h2 className="font-luxury text-6xl md:text-8xl text-white font-black leading-none uppercase tracking-tighter drop-shadow-2xl">
             {current.nombre.split(' ')[0]} <br/> <span className="text-red-600 italic">{current.nombre.split(' ')[1] || ''}</span>
          </h2>
          <div className="flex gap-6 items-center pt-4">
             <p className="text-zinc-400 text-xs uppercase font-bold tracking-widest">{current.altura}m | {current.medidas}</p>
             <button className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-red-600 hover:text-white transition-all shadow-2xl">Ver Portfolio</button>
          </div>
       </div>

       <div className="absolute bottom-10 right-16 z-20 flex gap-2">
          {publicModels.map((_, i) => (
             <div key={i} className={`h-1 transition-all duration-500 rounded-full ${i === index ? 'w-12 bg-red-600' : 'w-3 bg-white/20'}`}></div>
          ))}
       </div>
    </div>
  );
};
