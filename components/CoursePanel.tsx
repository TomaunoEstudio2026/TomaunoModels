
import React, { useState } from 'react';
import { Course, PreRegistration } from '../types';
import { WA_NUMBER } from '../constants';

interface CoursePanelProps {
  courses: Course[];
  isAdmin: boolean;
  onPreRegister: (reg: PreRegistration) => void;
}

export const CoursePanel: React.FC<CoursePanelProps> = ({ courses, isAdmin, onPreRegister }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [regForm, setRegForm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [data, setData] = useState({ nombre: '', dni: '', wa: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    
    onPreRegister({
      id: Date.now().toString(),
      courseTitle: selectedCourse.titulo,
      nombre: data.nombre,
      dni: data.dni,
      wa: data.wa,
      timestamp: new Date().toISOString(),
      status: 'Pendiente'
    });

    setIsSuccess(true);
    
    const msg = `Hola Javier! Soy ${data.nombre} (DNI ${data.dni}). Me acabo de pre-inscribir al curso: ${selectedCourse.titulo}. Aguardo instrucciones para el pago.`;
    
    setTimeout(() => {
      window.open(`https://wa.me/${WA_NUMBER.replace(/\D/g,'')}?text=${encodeURIComponent(msg)}`);
      setSelectedCourse(null);
      setRegForm(false);
      setIsSuccess(false);
      setData({ nombre: '', dni: '', wa: '' });
    }, 3000);
  };

  return (
    <div className="animate-fade max-w-5xl mx-auto space-y-12 pb-20">
      {selectedCourse && (
        <div className="fixed inset-0 z-[10000] bg-black/98 flex items-center justify-center p-4 md:p-10 animate-fade">
           <div className="bg-zinc-950 max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-[50px] border border-red-900/30 p-10 relative shadow-[0_0_80px_rgba(153,0,0,0.5)]">
              <button onClick={()=>{setSelectedCourse(null); setRegForm(false);}} className="absolute top-8 right-8 text-zinc-600 hover:text-white text-3xl transition-colors">✕</button>
              
              {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 animate-fade">
                   <div className="w-20 h-20 bg-green-600/20 text-green-500 rounded-full flex items-center justify-center text-4xl shadow-lg border border-green-500/30">✓</div>
                   <h2 className="font-luxury text-3xl font-bold">¡Solicitud Registrada!</h2>
                   <p className="text-zinc-400">Tus datos han sido enviados con éxito. Ahora te redirigiremos a WhatsApp para confirmar los detalles del pago.</p>
                   <p className="text-[#990000] text-[9px] uppercase tracking-widest animate-pulse font-bold">Conectando con Javier Móttola...</p>
                </div>
              ) : (
                <>
                  {!regForm ? (
                    <div className="space-y-8 animate-fade">
                       <img src={selectedCourse.img} className="w-full aspect-video rounded-[35px] object-cover shadow-2xl border border-zinc-900" />
                       <div className="space-y-4">
                          <h2 className="font-luxury text-4xl text-[#990000] font-bold">{selectedCourse.titulo}</h2>
                          <div className="flex flex-wrap gap-4">
                             <span className="bg-zinc-900 px-4 py-2 rounded-full text-zinc-400 text-[10px] font-bold uppercase tracking-widest border border-zinc-800">📍 {selectedCourse.location}</span>
                             <span className="bg-zinc-900 px-4 py-2 rounded-full text-zinc-400 text-[10px] font-bold uppercase tracking-widest border border-zinc-800">💰 {selectedCourse.costo}</span>
                          </div>
                          <p className="text-zinc-300 leading-relaxed text-sm bg-black/40 p-6 rounded-[25px] border border-zinc-900">{selectedCourse.temario}</p>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6">
                          <button onClick={() => setRegForm(true)} className="bg-[#990000] py-5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all active:scale-95">Pre-Inscribirme Ahora</button>
                          <button onClick={() => window.open(`https://wa.me/${WA_NUMBER.replace(/\D/g,'')}?text=Hola!+Quiero+mas+info+del+curso+${encodeURIComponent(selectedCourse.titulo)}`)} className="bg-zinc-900 py-5 rounded-full font-bold text-xs uppercase tracking-widest border border-zinc-800 hover:border-white transition-all active:scale-95">Consultar WhatsApp</button>
                       </div>
                    </div>
                  ) : (
                    <div className="space-y-8 animate-fade">
                       <div className="text-center">
                          <h2 className="font-luxury text-3xl font-bold">Registro de <span className="text-[#990000]">Alumno</span></h2>
                          <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-2">{selectedCourse.titulo}</p>
                       </div>
                       <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-2">
                             <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Nombre Completo</label>
                             <input required value={data.nombre} onChange={e=>setData({...data, nombre: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 focus:border-[#990000] outline-none transition-all" />
                          </div>
                          <div className="grid grid-cols-2 gap-5">
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">DNI</label>
                                <input required value={data.dni} onChange={e=>setData({...data, dni: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 focus:border-[#990000] outline-none transition-all" />
                             </div>
                             <div className="space-y-2">
                                <label className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">WhatsApp</label>
                                <input required value={data.wa} onChange={e=>setData({...data, wa: e.target.value})} className="w-full bg-black border border-zinc-800 rounded-2xl p-4 focus:border-[#990000] outline-none transition-all" />
                             </div>
                          </div>
                          <button type="submit" className="w-full bg-[#990000] py-5 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl hover:bg-red-700 transition-all active:scale-95 mt-4">
                             Finalizar Pre-Inscripción
                          </button>
                       </form>
                    </div>
                  )}
                </>
              )}
           </div>
        </div>
      )}

      <div className="text-center space-y-3">
        <h2 className="font-luxury text-5xl">Nuestros <span className="text-[#990000] italic">Cursos</span></h2>
        <p className="text-zinc-500 text-[10px] tracking-[0.5em] uppercase font-bold">Capacitaciones Profesionales 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {courses.map((c) => (
          <div key={c.id} className="glass rounded-[50px] border border-zinc-900 overflow-hidden shadow-2xl flex flex-col group hover:border-[#990000] transition-all cursor-pointer" onClick={()=>setSelectedCourse(c)}>
            <div className="aspect-[16/10] relative">
               <img src={c.img} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700" />
               <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-all"></div>
               <div className="absolute top-6 left-6 bg-[#990000] px-4 py-1.5 rounded-full text-[8px] font-bold uppercase tracking-widest shadow-lg">Inscripciones Abiertas</div>
            </div>
            <div className="p-10 flex-1 flex flex-col justify-between">
              <h3 className="font-luxury text-2xl text-white group-hover:text-[#990000] transition-colors">{c.titulo}</h3>
              <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-4">Ver Programa e Inscripción →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
