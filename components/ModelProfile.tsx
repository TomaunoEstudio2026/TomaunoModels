
import React, { useState, useEffect } from 'react';
import { Model, Category, Gender } from '../types';
import { QUALITIES_LIST } from '../constants';
import { apiService } from '../apiService';

interface ModelProfileProps {
  model: Model;
  isRegistered: boolean;
  onSave: (m: Model) => Promise<boolean>;
  onDelete: (dni: string) => Promise<boolean>;
  onClose: () => void;
}

export const ModelProfile: React.FC<ModelProfileProps> = ({ model, isRegistered, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState<Model>(model);
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'quals') {
      const newQuals = checked ? [...formData.quals, value] : formData.quals.filter(q => q !== value);
      setFormData(prev => ({ ...prev, quals: newQuals }));
      return;
    }

    if (name === 'altura') {
      // Forzar coma en altura
      val = value.replace('.', ',');
      if (val.length === 1 && !isNaN(val)) val += ',';
    }

    if (['nombre', 'localidad'].includes(name) && typeof val === 'string') {
      // Capitalizar primera letra
      val = val.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }

    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (tipo.includes('video') && file.size > 50 * 1024 * 1024) {
      alert("El video es demasiado pesado (Máx 50MB)");
      return;
    }

    setStatus('saving');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await apiService.request('uploadFile', {
        base64: reader.result, dni: formData.dni, nombre: formData.nombre, tipo, oldUrl: (formData as any)[tipo]
      });
      if (res && res !== "ERROR") {
        setFormData(prev => ({ ...prev, [tipo]: res }));
      }
      setStatus('idle');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade pb-40">
      {status === 'saving' && (
        <div className="fixed inset-0 z-[11000] bg-black/98 flex flex-col items-center justify-center space-y-8 backdrop-blur-xl">
           <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-luxury text-2xl tracking-[0.5em] uppercase animate-pulse">Actualizando...</p>
        </div>
      )}

      <div className="glass p-10 rounded-[60px] flex flex-col md:flex-row justify-between items-center gap-6 border-l-8 border-red-600">
        <div className="text-center md:text-left">
          <h2 className="font-luxury text-4xl">Mi <span className="text-red-600 font-bold italic">Portfolio</span></h2>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">DNI: {formData.dni}</p>
        </div>
        <div className="flex gap-4">
           {isRegistered && (
             <button type="button" onClick={() => confirm('¿Confirmas darte de baja?') && onDelete(formData.dni)} className="text-red-600 px-6 py-3 rounded-full text-[9px] font-black uppercase border border-red-900/30 hover:bg-red-600 hover:text-white transition-all">Darse de Baja</button>
           )}
           <button onClick={onClose} className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold uppercase hover:bg-red-600 hover:text-white transition-all shadow-xl">Cerrar (ESC)</button>
        </div>
      </div>

      <form onSubmit={async (e) => { e.preventDefault(); setStatus('saving'); if(await onSave(formData)) setStatus('success'); setTimeout(()=>setStatus('idle'), 2000); }} className="space-y-12">
        <div className="glass p-12 rounded-[60px] space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Nombre y Apellido</p>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required tabIndex={1} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none focus:border-red-600 text-lg font-bold" />
            </div>
            <div>
              <p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Edad</p>
              <input type="number" name="edad" value={formData.edad || ''} onChange={handleChange} tabIndex={2} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center text-lg font-bold" />
            </div>
            <div>
              <p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Altura (m)</p>
              <input name="altura" value={formData.altura} onChange={handleChange} placeholder="1,70" tabIndex={3} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center text-lg font-bold" />
            </div>
            <div>
              <p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Medidas</p>
              <input name="medidas" value={formData.medidas} onChange={handleChange} placeholder="90-60-90" tabIndex={4} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center text-lg font-bold" />
            </div>
            <div>
              <p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Localidad</p>
              <input name="localidad" value={formData.localidad} onChange={handleChange} tabIndex={5} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none" />
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-red-600 tracking-[0.5em] text-center mb-6">Cualidades</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {QUALITIES_LIST.map(q => (
                <label key={q} className={`flex items-center gap-2 p-3 rounded-2xl border transition-all cursor-pointer ${formData.quals.includes(q) ? 'bg-red-900/20 border-red-600' : 'bg-zinc-950 border-zinc-900 text-zinc-700'}`}>
                  <input type="checkbox" name="quals" value={q} checked={formData.quals.includes(q)} onChange={handleChange} className="w-4 h-4 accent-red-600" />
                  <span className="text-[8px] uppercase font-black truncate">{q}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {['foto1', 'foto2', 'foto3', 'composite'].map((f) => (
               <div key={f} className="relative aspect-[3/4] bg-zinc-950 rounded-[40px] border-2 border-zinc-900 overflow-hidden group shadow-2xl">
                  {(formData as any)[f] ? (
                    <img src={(formData as any)[f]} className="w-full h-full object-cover zoom-img" />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center opacity-30">
                       <span className="text-4xl">+</span>
                       <span className="text-[8px] uppercase font-bold tracking-widest">{f}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, f)} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
             ))}
          </div>
        </div>

        <button type="submit" className="w-full py-8 bg-red-600 hover:bg-red-700 text-white rounded-[45px] font-black text-xl uppercase tracking-[0.5em] transition-all shadow-2xl active:scale-95">
          Sincronizar Portfolio
        </button>
      </form>
    </div>
  );
};
