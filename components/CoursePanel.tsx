
import React, { useState } from 'react';
import { Course } from '../types';
import { WA_NUMBER } from '../constants';

interface CoursePanelProps {
  courses: Course[];
  isAdmin: boolean;
  onPreRegister: (data: any) => void;
}

export const CoursePanel: React.FC<CoursePanelProps> = ({ courses = [], isAdmin, onPreRegister }) => {
  const [showReg, setShowReg] = useState<string | null>(null);
  const [selectedShift, setSelectedShift] = useState('CuroTM2026');

  return (
    <div className="space-y-16 animate-fade pb-40 px-4">
      <div className="text-center space-y-4">
        <h2 className="font-luxury text-6xl md:text-8xl uppercase tracking-tighter">Academia <span className="text-red-600 italic">Elite</span></h2>
        <p className="text-zinc-500 text-[11px] uppercase tracking-[0.6em] font-black">Formación de Modelos • Ciclo Lectivo 2026</p>
      </div>

      <div className="max-w-6xl mx-auto space-y-24">
        {courses.map((c) => (
          <div key={c.id} className="glass rounded-[60px] overflow-hidden border-zinc-900 shadow-3xl bg-zinc-950/20">
            <div className="flex flex-col lg:flex-row">
              <div className="lg:w-[40%] aspect-[3/4] overflow-hidden border-r border-zinc-900">
                <img src={c.urlFlyer} className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3000ms]" alt={c.titulo} />
              </div>
              
              <div className="lg:w-[60%] p-10 md:p-16 flex flex-col justify-between">
                <div className="space-y-10">
                  <div className="space-y-2">
                    <h3 className="font-luxury text-5xl md:text-6xl font-black uppercase leading-tight tracking-tighter">{c.titulo}</h3>
                    <div className="bg-red-600/10 border border-red-600/30 px-6 py-2 rounded-full w-fit">
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{c.fecha} | {c.horario}</p>
                    </div>
                  </div>

                  {/* CONTENEDOR DE LECTURA COMPLETA */}
                  <div className="bg-black/60 border border-zinc-900 rounded-[40px] p-8 md:p-12 max-h-[400px] overflow-y-auto scrollbar-hide">
                    <h4 className="font-luxury text-2xl text-red-600 italic mb-6">Información Detallada y Temario</h4>
                    <div className="text-zinc-300 leading-relaxed whitespace-pre-line text-lg italic space-y-4">
                      {c.temario}
                    </div>
                  </div>
                </div>

                <div className="pt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setShowReg(c.id)} 
                    className="bg-white text-black py-7 rounded-full font-black uppercase text-[11px] tracking-widest hover:bg-red-600 hover:text-white transition-all shadow-2xl"
                  >
                    Iniciar Pre-Inscripción Online
                  </button>
                  <a 
                    href={`https://wa.me/${WA_NUMBER.replace(/\D/g,'')}?text=Hola Javier! Quiero info sobre ${c.titulo}`} 
                    target="_blank" 
                    className="border-2 border-zinc-800 text-zinc-500 hover:border-red-600 py-7 rounded-full font-black uppercase text-[11px] tracking-widest text-center transition-all"
                  >
                    Consultar Costos y Cupos
                  </a>
                </div>
              </div>
            </div>

            {/* MODAL REGISTRO DINÁMICO */}
            {showReg === c.id && (
              <div className="p-12 border-t border-zinc-900 bg-black/80 animate-fade">
                <h4 className="text-center font-luxury text-3xl mb-10">Formulario de <span className="text-red-600">Aspirante</span></h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black text-zinc-600">Turno de Preferencia</label>
                    <select 
                      value={selectedShift} 
                      onChange={e=>setSelectedShift(e.target.value)}
                      className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-white font-bold outline-none focus:border-red-600"
                    >
                      <option value="CuroTM2026">Turno Mañana (TM)</option>
                      <option value="CuroTT2026">Turno Tarde (TT)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black text-zinc-600">Nombre Completo</label>
                    <input id="reg_name" className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-white font-bold" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-black text-zinc-600">DNI Aspirante</label>
                    <input id="reg_dni" className="w-full bg-zinc-900 border-2 border-zinc-800 rounded-2xl p-4 text-white font-bold" />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const n = (document.getElementById('reg_name') as HTMLInputElement).value;
                      const d = (document.getElementById('reg_dni') as HTMLInputElement).value;
                      if(n && d) {
                        onPreRegister({ nombre: n, dni: d, cursoId: selectedShift });
                        setShowReg(null);
                      } else alert('Completa todos los campos');
                    }}
                    className="flex-1 bg-red-600 py-6 rounded-full font-black uppercase tracking-widest text-xs shadow-xl"
                  >
                    Enviar Solicitud de Vacante
                  </button>
                  <button onClick={()=>setShowReg(null)} className="px-10 py-6 border border-zinc-800 rounded-full font-black uppercase text-[10px] text-zinc-500">Cancelar</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
