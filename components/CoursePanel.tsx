import React from 'react';
import { Course } from '../types';

interface CoursePanelProps {
  courses: Course[];
  isAdmin: boolean;
  onPreRegister: (data: any) => void;
}

export const CoursePanel: React.FC<CoursePanelProps> = ({ courses = [], isAdmin, onPreRegister }) => {
  return (
    <div className="space-y-12 p-6">
      <h2 className="font-luxury text-5xl text-center">Nuestros <span className="text-red-600">Cursos</span></h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {courses.map(c => (
          <div key={c.id} className="glass rounded-[40px] overflow-hidden flex flex-col">
            <img src={c.urlFlyer || 'https://via.placeholder.com/400x600'} className="w-full h-[500px] object-cover" />
            <div className="p-8 space-y-4">
              <h3 className="text-3xl font-luxury">{c.titulo}</h3>
              <p className="text-zinc-400 text-sm">{c.temario || 'Cargando temario...'}</p>
              <button 
                onClick={() => {
                  const nombre = prompt('Nombre:');
                  const dni = prompt('DNI:');
                  const wa = prompt('WhatsApp:');
                  if(nombre && dni && wa) onPreRegister({ nombre, dni, wa, cursoId: c.titulo });
                }}
                className="w-full bg-red-600 py-4 rounded-2xl font-bold uppercase tracking-widest"
              >
                Pre-Inscribirme
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};