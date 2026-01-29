
import React, { useState } from 'react';
import { Course } from '../types';
import { FLYER_CURSO_1 } from '../constants';

interface CoursePanelProps {
  courses: Course[];
  isAdmin: boolean;
  onPreRegister: (reg: any) => Promise<boolean>;
}

export const CoursePanel: React.FC<CoursePanelProps> = ({ courses, isAdmin, onPreRegister }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [regForm, setRegForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({ 
    nombre: '', dni: '', wa: '', edad: '', altura: '', ig: '', waTutor: '', turno: 'Mañana', comentarios: '' 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Acción específica para guardar en la hoja CursoTM2026
    const ok = await onPreRegister({ ...data, courseTitle: selectedCourse?.titulo });
    setIsSubmitting(false);
    
    if(ok) {
      alert("¡PRE-INSCRIPCIÓN EXITOSA! Javier Móttola se pondrá en contacto pronto.");
      setRegForm(false);
      setSelectedCourse(null); // Volvemos a la vista general de cursos
    }
  };

  return (
    <div className="animate-fade max-w-6xl mx-auto space-y-16 pb-40 px-4">
      {selectedCourse && (
        <div className="fixed inset-0 z-[10000] bg-black/98 flex items-center justify-center p-4 animate-fade backdrop-blur-3xl">
           <div className="bg-zinc-950 max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-[60px] border border-red-900/30 p-8 md:p-16 relative shadow-2xl">
              <button onClick={()=>{setSelectedCourse(null); setRegForm(false);}} className="absolute top-10 right-10 text-zinc-600 hover:text-white text-4xl p-2">✕</button>
              
              {!regForm ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                   <div className="aspect-[3/4] rounded-[50px] overflow-hidden border-2 border-zinc-900 bg-black">
                      <img src={FLYER_CURSO_1} className="w-full h-full object-cover" />
                   </div>
                   <div className="space-y-10 flex flex-col justify-center">
                      <div className="space-y-2">
                        <p className="text-red-600 text-[10px] font-black uppercase tracking-[0.5em]">Tomauno Models Academy</p>
                        <h2 className="font-luxury text-5xl text-white font-bold">{selectedCourse.titulo}</h2>
                      </div>
                      <div className="bg-zinc-900/40 p-8 rounded-[35px] border border-zinc-800 space-y-4 text-zinc-300">
                         <p><strong>Días:</strong> {selectedCourse.fecha}</p>
                         <p><strong>Horario:</strong> {selectedCourse.horario}</p>
                         <p><strong>Inversión:</strong> $35.000 (Inscripción)</p>
                         <p className="text-sm italic text-zinc-500">Temario: Pasarela, Fotografía, Marketing Digital y Estética Profesional.</p>
                      </div>
                      <button onClick={() => setRegForm(true)} className="bg-red-600 hover:bg-red-700 py-7 rounded-full font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl transition-all active:scale-95">RESERVAR MI LUGAR ✅</button>
                   </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8 py-10">
                   <h2 className="font-luxury text-3xl text-center uppercase">Ficha de <span className="text-red-600 italic">Pre-Inscripción</span></h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input required placeholder="Nombre Completo" value={data.nombre} onChange={e=>setData({...data, nombre: e.target.value})} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 text-sm" />
                      <input required placeholder="DNI" value={data.dni} onChange={e=>setData({...data, dni: e.target.value})} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 text-sm" />
                      <input required placeholder="WhatsApp" value={data.wa} onChange={e=>setData({...data, wa: e.target.value})} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 text-sm" />
                      <input required placeholder="Edad" value={data.edad} onChange={e=>setData({...data, edad: e.target.value})} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 text-sm" />
                      <input required placeholder="Altura" value={data.altura} onChange={e=>setData({...data, altura: e.target.value})} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 text-sm" />
                      <input required placeholder="Instagram" value={data.ig} onChange={e=>setData({...data, ig: e.target.value})} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 text-sm" />
                      <div className="md:col-span-2">
                         <select value={data.turno} onChange={e=>setData({...data, turno: e.target.value})} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 text-xs font-bold uppercase text-white">
                           <option value="Mañana">Turno Mañana (Sáb 9-12hs)</option>
                           <option value="Tarde">Turno Tarde (Sáb 15-18hs)</option>
                           <option value="Viernes">Viernes Intensivo (15-18hs)</option>
                         </select>
                      </div>
                   </div>
                   <button disabled={isSubmitting} type="submit" className="w-full bg-red-600 py-7 rounded-full font-black text-[12px] uppercase shadow-2xl active:scale-95 transition-all">
                     {isSubmitting ? 'ENVIANDO A PLANILLA...' : 'CONFIRMAR PRE-INSCRIPCIÓN'}
                   </button>
                   <button type="button" onClick={()=>setRegForm(false)} className="w-full text-zinc-600 font-bold uppercase text-[9px]">Volver al programa</button>
                </form>
              )}
           </div>
        </div>
      )}

      <div className="text-center space-y-4">
        <h2 className="font-luxury text-6xl md:text-8xl tracking-tighter uppercase leading-none">Cursos <span className="text-[#990000] font-bold italic">2026</span></h2>
        <p className="text-zinc-500 text-[11px] tracking-[0.8em] uppercase font-black">Inscripciones abiertas Marzo 2026</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {courses.map((c) => (
          <div key={c.id} className="bg-zinc-950 rounded-[60px] border border-zinc-900 overflow-hidden shadow-2xl group hover:border-red-600 transition-all cursor-pointer relative" onClick={()=>setSelectedCourse(c)}>
            <div className="aspect-[3/4] relative overflow-hidden bg-black">
               <img src={FLYER_CURSO_1} className="w-full h-full object-cover group-hover:scale-110 transition-all duration-[2000ms]" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-90"></div>
               <div className="absolute bottom-12 left-10 right-10 space-y-3">
                  <h3 className="font-luxury text-4xl text-white font-bold leading-none uppercase tracking-tighter">{c.titulo}</h3>
                  <p className="text-[10px] text-zinc-400 uppercase font-black tracking-widest">{c.fecha} | Ver Detalles</p>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
