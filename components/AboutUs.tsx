
import React from 'react';
import { MAPS_URL, WA_NUMBER, PHOTO_JAVIER, PHOTO_LUCRE } from '../constants';

export const AboutUs: React.FC = () => {
  const staff = [
    { 
      nombre: 'Javier Móttola', 
      rol: 'Director General & Fotógrafo', 
      img: PHOTO_JAVIER,
      bio: 'Especialista en imagen profesional y coaching para nuevos talentos. Visionario detrás del ecosistema Tomauno.',
      ig: '@tomaunoestudio'
    },
    { 
      nombre: 'Lucrecia Ceballos', 
      rol: 'Directora & Pasarela', 
      img: PHOTO_LUCRE,
      bio: 'Instructora de técnica de pasarela, desfile y actitud profesional. Formadora de modelos elite.',
      ig: '@lucre.ceballos'
    },
  ];

  return (
    <div className="space-y-20 py-10 animate-fade">
      <section className="text-center space-y-6">
        <h2 className="font-luxury text-5xl">La <span className="text-[#990000] italic">Academia</span></h2>
        <div className="max-w-3xl mx-auto">
          <p className="text-zinc-400 leading-relaxed text-lg italic">
            "Donde tu imagen cobra vida y tus sueños encuentran su primer paso profesional."
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {staff.map(p => (
          <div key={p.nombre} className="glass p-10 rounded-[50px] text-center space-y-6 hover:border-red-600/50 transition-all group relative overflow-hidden">
            <div className="w-48 h-48 rounded-full overflow-hidden mx-auto border-4 border-[#990000]/30 group-hover:border-[#990000] transition-colors shadow-2xl bg-zinc-900">
              <img src={p.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>
            <div>
              <h3 className="font-luxury text-3xl font-bold">{p.nombre}</h3>
              <p className="text-[#990000] text-xs font-bold uppercase tracking-widest mt-1">{p.rol}</p>
            </div>
            <p className="text-zinc-500 text-sm leading-relaxed px-4 italic">"{p.bio}"</p>
            <div className="pt-4">
               <a href={`https://instagram.com/${p.ig.replace('@','')}`} target="_blank" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                 📷 Instagram: {p.ig}
               </a>
            </div>
          </div>
        ))}
      </div>

      <section className="glass p-12 rounded-[50px] space-y-10 border border-zinc-900 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#990000]"></div>
        <div className="text-center space-y-2">
           <h3 className="font-luxury text-3xl font-bold">Ubicación & <span className="text-[#990000]">Contacto</span></h3>
        </div>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-8">
             <div className="space-y-4">
               <div className="flex items-center gap-5 text-zinc-300">
                 <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center text-red-600 border border-red-600/20">📍</div>
                 <span className="font-medium">Pedro Méndez 2069, B° Palomar, Posadas</span>
               </div>
               <div className="flex items-center gap-5 text-zinc-300">
                 <div className="w-12 h-12 bg-green-600/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-600/20">📱</div>
                 <a href={`https://wa.me/${WA_NUMBER.replace(/\D/g, '')}`} target="_blank" className="font-medium hover:text-green-500 transition-colors">
                   WhatsApp: {WA_NUMBER}
                 </a>
               </div>
             </div>
             <a href={MAPS_URL} target="_blank" className="inline-block bg-white text-black px-10 py-4 rounded-full font-bold text-xs uppercase tracking-[0.2em] hover:bg-[#990000] hover:text-white transition-all shadow-xl">Ver en Google Maps</a>
          </div>
          <div className="w-full md:w-1/2 aspect-video bg-zinc-900 rounded-[35px] overflow-hidden border border-zinc-800">
             <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3542.922119156385!2d-55.897825!3d-27.375678!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9457be332b508933%3A0xc6c7c093a12a5789!2sPedro%20M%C3%A9ndez%202069%2C%20N3300%20Posadas%2C%20Misiones!5e0!3m2!1ses!2sar!4v1715694321234!5m2!1ses!2sar" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};
