
import React from 'react';
import { PHOTO_JAVIER, PHOTO_LUCRE, MAPS_URL, WA_NUMBER } from '../constants';

export const AboutUs: React.FC = () => {
  return (
    <div className="space-y-32 py-10 animate-fade pb-40">
      <section className="text-center space-y-8">
        <h2 className="font-luxury text-7xl md:text-8xl tracking-tighter">Nuestra <span className="text-red-600 italic font-black">Esencia</span></h2>
        <p className="text-zinc-600 leading-relaxed text-[11px] italic uppercase tracking-[0.8em] font-black max-w-2xl mx-auto">
          "Donde la estética y el profesionalismo se fusionan"
        </p>
      </section>

      {/* Staff Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-20 max-w-6xl mx-auto">
        {[
          { n: 'Javier Móttola', r: 'Director & Fotógrafo', img: PHOTO_JAVIER, bio: 'Visionario y experto en capturar la esencia estética del modelaje profesional con más de 15 años de trayectoria.', ig: '@tomaunoestudio' },
          { n: 'Lucrecia Ceballos', r: 'Directora de Pasarela', img: PHOTO_LUCRE, bio: 'Maestra de la elegancia y proyección escénica para modelos de alta gama. Especialista en estilismo profesional.', ig: '@lucre.ceballos' }
        ].map(p => (
          <div key={p.n} className="glass p-12 rounded-[60px] text-center space-y-8 border-zinc-900 hover:border-red-600/30 transition-all shadow-2xl">
            <div className="w-64 h-64 rounded-full overflow-hidden mx-auto border-[5px] border-zinc-900 bg-black shadow-2xl">
              <img src={p.img} alt={p.n} className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <h3 className="font-luxury text-4xl font-black">{p.n}</h3>
              <p className="text-red-600 text-[10px] font-black uppercase tracking-widest">{p.r}</p>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed italic px-6">"{p.bio}"</p>
            <a href={`https://instagram.com/${p.ig.replace('@','')}`} target="_blank" className="inline-block bg-zinc-950 px-8 py-3 rounded-full text-[9px] font-black uppercase border border-zinc-900 hover:text-pink-500 transition-all">Instagram {p.ig}</a>
          </div>
        ))}
      </div>

      {/* Contact Section */}
      <section className="max-w-6xl mx-auto space-y-16">
         <div className="text-center">
            <h3 className="font-luxury text-5xl uppercase font-black">Visita el <span className="text-red-600">Estudio</span></h3>
            <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest mt-2">Pedro Méndez 2069, Posadas, Misiones</p>
         </div>
         
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-[60px] overflow-hidden border-2 border-zinc-900 h-[450px] shadow-3xl bg-zinc-900">
               <iframe src={MAPS_URL} className="w-full h-full border-0 grayscale invert contrast-125 opacity-70" allowFullScreen loading="lazy"></iframe>
            </div>
            <div className="glass p-12 rounded-[60px] flex flex-col justify-center space-y-10 border-zinc-900">
               <h4 className="font-luxury text-4xl font-black italic">Contacto Directo</h4>
               <p className="text-zinc-500 leading-relaxed italic text-lg">Estamos disponibles para consultas sobre castings, books fotográficos y el alquiler de nuestro estudio profesional para producciones externas.</p>
               <div className="space-y-6">
                  <a href={`https://wa.me/${WA_NUMBER.replace(/\D/g,'')}?text=Hola Javier! Estoy en la web y quiero consultar sobre...`} target="_blank" className="w-full bg-green-900 py-7 rounded-full text-center font-black text-xs uppercase tracking-[0.3em] block shadow-2xl hover:bg-green-800 transition-all active:scale-95">WhatsApp Agencia</a>
                  <p className="text-center text-[10px] text-zinc-700 font-black uppercase tracking-widest">Lunes a Viernes 16:00 a 21:00hs</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
};
