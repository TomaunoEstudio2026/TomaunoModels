
import React, { useState, useEffect } from 'react';
import { Model } from '../types';
import { LOGO_URL } from '../constants';

interface ModelPortfolioViewProps {
  model: Model;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
}

export const ModelPortfolioView: React.FC<ModelPortfolioViewProps> = ({ model, onClose, onNext, onPrev }) => {
  const [activePhoto, setActivePhoto] = useState(model.foto1 || model.composite);
  const photos = [model.foto1, model.foto2, model.foto3, model.composite].filter(Boolean);

  useEffect(() => {
    setActivePhoto(model.foto1 || model.composite);
    
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' && onNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [model, onNext, onPrev]);

  const handleShare = () => {
    const url = `${window.location.origin}${window.location.pathname}?dni=${model.dni}`;
    navigator.clipboard.writeText(url);
    alert("¡Link de Portfolio copiado! Ideal para compartir en tu biografía.");
  };

  const renderVideo = (url: string) => {
    if (!url) return null;
    
    // Si es Google Drive
    if (url.includes('drive.google.com')) {
      const embedUrl = url.replace('/view', '/preview').replace('file/d/', 'file/d/').split('?')[0] + '/preview';
      return <iframe src={embedUrl} className="w-full h-full rounded-[40px]" allow="autoplay" frameBorder="0"></iframe>;
    }
    
    // Si es un archivo directo (o base64)
    return <video src={url} controls className="w-full h-full object-cover rounded-[40px]" />;
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black overflow-y-auto animate-fade selection:bg-red-600">
       <header className="sticky top-0 z-30 glass py-6 px-10 flex justify-between items-center border-b border-red-900/20">
          <div className="flex items-center gap-4">
             <img src={LOGO_URL} className="w-10 h-10 rounded-full bg-white p-1" />
             <h1 className="font-luxury text-xl tracking-widest uppercase">TOMA<span className="text-red-600">UNO</span> <span className="italic opacity-60">Portfolio Elite</span></h1>
          </div>
          <div className="flex gap-4">
             <button onClick={handleShare} className="bg-zinc-900 px-6 py-2 rounded-full text-[9px] font-black uppercase tracking-widest border border-zinc-800 hover:bg-white hover:text-black transition-all">Compartir Portfolio 🔗</button>
             <button onClick={onClose} className="bg-red-600 px-8 py-2 rounded-full text-[9px] font-black uppercase tracking-widest hover:bg-red-700 shadow-xl transition-all">Cerrar (ESC)</button>
          </div>
       </header>

       <div className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
             <div className="aspect-[4/5] rounded-[60px] overflow-hidden border-2 border-zinc-900 bg-zinc-950 shadow-3xl group relative">
                <img src={activePhoto} className="w-full h-full object-cover transition-transform duration-[2000ms]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
                {onPrev && <button onClick={onPrev} className="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 hover:bg-red-600 flex items-center justify-center text-2xl transition-all">←</button>}
                {onNext && <button onClick={onNext} className="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/40 hover:bg-red-600 flex items-center justify-center text-2xl transition-all">→</button>}
             </div>
             <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {photos.map(p => (
                   <button key={p} onClick={() => setActivePhoto(p)} className={`w-24 h-32 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${activePhoto === p ? 'border-red-600 scale-105' : 'border-zinc-900 opacity-60'}`}>
                      <img src={p} className="w-full h-full object-cover" />
                   </button>
                ))}
             </div>
          </div>

          <div className="flex flex-col justify-center space-y-12">
             <div className="space-y-2">
                <p className="text-red-600 text-[11px] font-black uppercase tracking-[0.8em]">Talento Exclusivo</p>
                <h2 className="font-luxury text-7xl md:text-8xl font-black text-white leading-none uppercase tracking-tighter">
                   {model.nombre.split(' ')[0]} <br/> <span className="text-red-600 italic">{model.nombre.split(' ').slice(1).join(' ')}</span>
                </h2>
             </div>

             <div className="grid grid-cols-3 gap-8 border-y border-zinc-900 py-10 text-center">
                {[ { l: 'Edad', v: `${model.edad} Años` }, { l: 'Altura', v: `${model.altura}m` }, { l: 'Medidas', v: model.medidas || 'S/D' } ].map(d => (
                   <div key={d.l}>
                      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">{d.l}</p>
                      <p className="text-xl font-bold font-luxury">{d.v}</p>
                   </div>
                ))}
             </div>

             <div className="space-y-8">
                <h4 className="font-luxury text-2xl italic text-red-600">Multimedia / Pasarela</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {[model.video1, model.video2].map((v, i) => (
                      v && (
                        <div key={i} className="aspect-video bg-zinc-900 rounded-[40px] overflow-hidden border border-zinc-800 shadow-xl relative group">
                           {renderVideo(v)}
                           <div className="absolute top-4 left-4 bg-black/50 px-3 py-1 rounded-full text-[8px] uppercase font-black tracking-widest">Video {i+1}</div>
                        </div>
                      )
                   ))}
                </div>
             </div>

             <div className="pt-10 flex flex-wrap gap-6">
                <a href={`https://instagram.com/${String(model.ig).replace('@','')}`} target="_blank" className="flex-1 bg-gradient-to-r from-purple-900 to-pink-900 py-6 rounded-full text-center font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Instagram Profile</a>
                <a href={`https://wa.me/${String(model.wa).replace(/\D/g,'')}`} target="_blank" className="flex-1 bg-green-900 py-6 rounded-full text-center font-black text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-all">Enviar Consulta Directa</a>
             </div>
          </div>
       </div>

       <footer className="mt-20 py-20 text-center space-y-4 border-t border-zinc-900 bg-zinc-950/50">
          <p className="text-zinc-600 text-[9px] font-black uppercase tracking-[0.6em]">Representado por Tomauno Models ®</p>
          <p className="font-luxury italic text-xl text-zinc-800">Javier Móttola Studio 2026</p>
       </footer>
    </div>
  );
};
