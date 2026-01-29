
import React from 'react';
import { MAPS_URL, WA_NUMBER, PHOTO_JAVIER, PHOTO_LUCRE } from '../constants';

export const AboutUs: React.FC = () => {
  const staff = [
    { 
      nombre: 'Javier Móttola', 
      rol: 'Director & Fotógrafo', 
      img: PHOTO_JAVIER,
      bio: 'Visionario y experto en capturar la esencia estética del modelaje profesional.',
      ig: '@tomaunoestudio'
    },
    { 
      nombre: 'Lucrecia Ceballos', 
      rol: 'Directora de Pasarela', 
      img: PHOTO_LUCRE,
      bio: 'Maestra de la elegancia y proyección escénica para modelos de alta gama.',
      ig: '@lucre.ceballos'
    },
  ];

  return (
    <div className="space-y-32 py-10 animate-fade pb-40">
      <section className="text-center space-y-8">
        <h2 className="font-luxury text-7xl md:text-8xl tracking-tighter">Nuestra <span className="text-[#990000] italic font-black">Esencia</span></h2>
        <p className="text-zinc-600 leading-relaxed text-[11px] italic uppercase tracking-[0.8em] font-black max-w-2xl mx-auto">
          "Donde la estética y el profesionalismo se fusionan"
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
        {staff.map(p => (
          <div key={p.nombre} className="glass p-16 rounded-[80px] text-center space-y-10 hover:border-red-600/40 transition-all group relative shadow-2xl bg-zinc-950/40 border border-zinc-900">
            <div className="w-72 h-72 rounded-full overflow-hidden mx-auto border-[6px] border-red-900/20 group-hover:border-red-600 transition-all shadow-2xl bg-black p-1">
              <img src={p.img} alt={p.nombre} className="w-full h-full rounded-full object-cover scale-[1.1] group-hover:scale-[1.2] transition-transform duration-[2000ms]" />
            </div>
            <div className="space-y-4">
              <h3 className="font-luxury text-5xl font-black text-white">{p.nombre}</h3>
              <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.6em]">{p.rol}</p>
            </div>
            <p className="text-zinc-400 text-lg leading-relaxed italic px-8">"{p.bio}"</p>
            <div className="pt-6">
               <a href={`https://instagram.com/${p.ig.replace('@','')}`} target="_blank" className="bg-black/80 px-10 py-5 rounded-full inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all border border-zinc-900 shadow-xl">
                 <span className="text-red-600">IG</span> {p.ig}
               </a>
            </div>
          </div>
        ))}
      </div>
      
      <section className="glass p-16 rounded-[80px] space-y-16 border border-zinc-900 shadow-3xl relative overflow-hidden bg-gradient-to-br from-zinc-950 to-black">
        <div className="absolute top-0 left-0 w-3 h-full bg-red-600"></div>
        <div className="text-center space-y-4">
           <h3 className="font-luxury text-5xl font-black italic">Estudio <span className="text-red-600">Central</span></h3>
           <p className="text-[11px] text-zinc-600 uppercase tracking-[0.5em] font-black">Pedro Méndez 2069 - Posadas, Misiones</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 space-y-12">
             <div className="space-y-8">
               <div className="flex items-center gap-8 group">
                 <div className="w-20 h-20 bg-red-950/20 rounded-[30px] flex items-center justify-center text-red-600 border border-red-900/30 text-3xl shadow-lg transition-transform group-hover:scale-110">📍</div>
                 <div className="space-y-1">
                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">Ubicación</p>
                    <p className="font-black text-white text-lg">Pedro Méndez 2069, B° Palomar</p>
                 </div>
               </div>
               <div className="flex items-center gap-8 group">
                 <div className="w-20 h-20 bg-green-950/20 rounded-[30px] flex items-center justify-center text-green-500 border border-green-900/30 text-3xl shadow-lg transition-transform group-hover:scale-110">📱</div>
                 <div className="space-y-1">
                    <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest">WhatsApp Directo</p>
                    <a href={`https://wa.me/${WA_NUMBER.replace(/\D/g, '')}`} target="_blank" className="font-black text-white text-lg hover:text-green-500 transition-colors">{WA_NUMBER}</a>
                 </div>
               </div>
             </div>
             <a href={MAPS_URL} target="_blank" className="inline-block bg-white text-black px-16 py-6 rounded-full font-black text-[11px] uppercase tracking-[0.6em] hover:bg-red-600 hover:text-white transition-all shadow-2xl active:scale-95">Trazar Ruta</a>
          </div>
          <div className="w-full lg:w-1/2 h-[450px] bg-black rounded-[60px] overflow-hidden border-2 border-zinc-900 shadow-inner">
             <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3542.922119156385!2d-55.897825!3d-27.375678!2m3!1f0!2f0!3f0!3m2!i1024!2i768!4f13.1!3m3!1m2!1s0x9457be332b508933%3A0xc6c7c093a12a5789!2sPedro%20M%C3%A9ndez%202069%2C%20N3300%20Posadas%2C%20Misiones!5e0!3m2!1ses!2sar!4v1715694321234!5m2!1ses!2sar" width="100%" height="100%" style={{border:0, filter: 'invert(90%) hue-rotate(180deg)'}} allowFullScreen loading="lazy"></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};
