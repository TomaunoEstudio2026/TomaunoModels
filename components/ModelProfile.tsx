
import React, { useState, useEffect } from 'react';
import { Model, Gender, Category } from '../types';

interface ModelProfileProps {
  model: Model;
  onSave: (m: Model) => void;
  onDelete: (dni: string) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const ModelProfile: React.FC<ModelProfileProps> = ({ model, onSave, onDelete, onLogout, onClose }) => {
  const [formData, setFormData] = useState<Model>(model);
  const [loading, setLoading] = useState(false);

  const QUALITIES = ['Pasarela', 'Fotografía', 'Actuación', 'Baile', 'Publicidad', 'Alta Costura'];

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'quals') {
        const newQuals = checked 
          ? [...formData.quals, value] 
          : formData.quals.filter(q => q !== value);
        setFormData(prev => ({ ...prev, quals: newQuals }));
      } else {
        setFormData(prev => ({ ...prev, [name]: checked }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const isFormValid = formData.nombre.trim() !== '' && formData.edad > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onSave({ ...formData, lastUpdate: new Date().toISOString() });
      setLoading(false);
      alert('¡Portfolio Actualizado con Éxito!');
    }, 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20 animate-fade">
      <div className="flex justify-between items-center bg-zinc-950 p-6 rounded-[30px] border border-zinc-900 shadow-xl">
        <h2 className="font-luxury text-2xl uppercase tracking-tighter">Mi <span className="text-[#990000] italic">Portfolio 2026</span></h2>
        <div className="flex gap-3">
          <button onClick={onClose} className="text-[10px] font-bold uppercase tracking-widest bg-zinc-900 px-6 py-2 rounded-full border border-zinc-800">Cerrar</button>
          {model.nombre && (
            <button onClick={() => confirm('¿Seguro quieres darte de baja? Esta acción es permanente.') && onDelete(model.dni)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-white border border-red-900/30 px-6 py-2 rounded-full">Darse de Baja</button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass p-10 rounded-[40px] space-y-10">
          {/* Datos Personales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500">Nombre Completo*</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-[#990000] outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500">DNI (Inmutable)</label>
              <input value={formData.dni} disabled className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-zinc-500 cursor-not-allowed" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500">Edad*</label>
              <input type="number" name="edad" value={formData.edad || ''} onChange={handleChange} required className="w-full bg-black border border-zinc-800 rounded-xl p-4 focus:border-[#990000] outline-none" />
            </div>
            
            {/* TUTOR CONDICIONAL */}
            {formData.edad > 0 && formData.edad < 18 && (
              <div className="md:col-span-2 space-y-2 animate-fade">
                <label className="text-[10px] uppercase font-bold text-red-500 tracking-widest">WhatsApp del Tutor (Obligatorio por ser menor)*</label>
                <input name="waTutor" value={formData.waTutor} onChange={handleChange} required className="w-full bg-red-900/10 border border-red-900/50 rounded-xl p-4 outline-none" placeholder="Número de mamá, papá o tutor" />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500">Altura (Ejem: 1,70)*</label>
              <input name="altura" value={formData.altura} onChange={handleChange} required className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500">WhatsApp*</label>
              <input name="wa" value={formData.wa} onChange={handleChange} required className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-zinc-500">Instagram (@usuario)*</label>
              <input name="ig" value={formData.ig} onChange={handleChange} required className="w-full bg-black border border-zinc-800 rounded-xl p-4 outline-none" />
            </div>
          </div>

          {/* Cualidades */}
          <div className="space-y-4 pt-6 border-t border-zinc-900">
            <h3 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Cualidades y Destrezas</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {QUALITIES.map(q => (
                <label key={q} className="flex items-center gap-3 bg-zinc-900/50 p-3 rounded-xl border border-zinc-800 cursor-pointer hover:border-red-900/30 transition-all">
                  <input type="checkbox" name="quals" value={q} checked={formData.quals.includes(q)} onChange={handleChange} className="w-4 h-4 accent-red-600" />
                  <span className="text-[11px] uppercase tracking-tighter text-zinc-400">{q}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Experiencia y Anhelos */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-bold text-zinc-500">Tu Historia, Experiencia y Anhelos</label>
            <textarea name="exp" value={formData.exp} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-[25px] p-6 h-32 outline-none focus:border-[#990000] transition-all resize-none text-sm leading-relaxed" placeholder="Cuéntanos sobre ti, tus trabajos previos o qué esperas lograr..." />
          </div>

          {/* Multimedia */}
          <div className="space-y-6 pt-6 border-t border-zinc-900">
             <h3 className="text-[10px] uppercase font-bold text-zinc-500 tracking-widest">Multimedia (Links Drive o Web)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[1,2,3,4].map(i => (
                  <div key={i} className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-zinc-600">Foto {i}</label>
                    <input name={`foto${i}`} value={(formData as any)[`foto${i}`]} onChange={handleChange} placeholder="Link de imagen" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-[10px]" />
                  </div>
                ))}
                {[1,2].map(i => (
                  <div key={i} className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-red-900">Video Presentación {i}</label>
                    <input name={`video${i}`} value={(formData as any)[`video${i}`]} onChange={handleChange} placeholder="Link de video o archivo" className="w-full bg-black border border-zinc-800 rounded-lg p-3 text-[10px]" />
                  </div>
                ))}
             </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !isFormValid}
          className="w-full bg-[#990000] hover:bg-red-700 py-6 rounded-full font-bold text-lg uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-30"
        >
          {loading ? 'Sincronizando con la Nube...' : 'Guardar Portfolio 2026'}
        </button>
      </form>
    </div>
  );
};
