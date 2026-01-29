
import React, { useState } from 'react';
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
  const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

  // Consideramos mayor de edad a partir de los 18 años
  const isMinor = formData.edad > 0 && formData.edad < 18;

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;
    
    if (name === 'quals') {
      const newQuals = checked ? [...formData.quals, value] : formData.quals.filter(q => q !== value);
      setFormData(prev => ({ ...prev, quals: newQuals }));
      return;
    }
    
    if (name === 'altura') val = value.replace('.', ',');
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setStatus('saving');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await apiService.request('uploadFile', {
        base64: reader.result, dni: formData.dni, nombre: formData.nombre, tipo
      });
      if (res && res.url) {
        setFormData(prev => ({ ...prev, [tipo]: res.url }));
        setStatus('idle');
      } else {
        setStatus('error');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    try {
      const success = await onSave(formData);
      if (success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 2000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade pb-40 px-4">
      <div className="glass p-8 rounded-[40px] border-l-[10px] border-red-600 flex justify-between items-center shadow-xl">
        <h2 className="font-luxury text-3xl md:text-4xl uppercase font-black">
          {isRegistered ? 'Mi Perfil' : 'Registro'} <span className="text-red-600 italic">Elite</span>
        </h2>
        <button onClick={onClose} className="bg-white text-black px-6 py-2 rounded-full font-black text-[10px] uppercase hover:bg-red-600 hover:text-white transition-all">Cerrar</button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass p-8 md:p-12 rounded-[50px] space-y-10 border border-zinc-900 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Nombre Completo</label>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required className="w-full bg-black border-2 border-zinc-900 rounded-2xl p-4 outline-none focus:border-red-600 font-bold transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Edad</label>
              <input type="number" name="edad" value={formData.edad || ''} onChange={handleChange} required className="w-full bg-black border-2 border-zinc-900 rounded-2xl p-4 outline-none text-center font-bold focus:border-red-600 transition-all" />
            </div>
          </div>

          {isMinor ? (
            <div className="p-8 bg-red-950/10 border-2 border-red-600/20 rounded-[40px] animate-fade">
               <label className="text-[11px] font-black uppercase text-red-500 mb-3 block tracking-widest">📞 WhatsApp del Tutor (Requerido para menores)</label>
               <input name="waTutor" value={formData.waTutor} onChange={handleChange} required placeholder="+54 9 376..." className="w-full bg-black border-2 border-zinc-900 rounded-2xl p-4 outline-none focus:border-red-600" />
            </div>
          ) : (
            <div className="p-6 bg-zinc-900/30 rounded-[40px] border border-zinc-800">
               <label className="text-[10px] font-black uppercase text-zinc-500 mb-2 block tracking-widest">WhatsApp de Emergencia o Tutor (Opcional)</label>
               <input name="waTutor" value={formData.waTutor} onChange={handleChange} placeholder="Contacto alternativo..." className="w-full bg-black border-2 border-zinc-900 rounded-2xl p-4 outline-none focus:border-red-600" />
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {[
               {n:'altura',l:'Altura (m)'}, {n:'medidas',l:'Medidas'}, 
               {n:'ojos',l:'Color de Ojos'}, {n:'pelo',l:'Color de Pelo'}, 
               {n:'calzado',l:'Talle Calzado'}, {n:'localidad',l:'Localidad'}, 
               {n:'wa',l:'WhatsApp'}, {n:'ig',l:'Instagram'}
             ].map(f=>(
               <div key={f.n} className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-zinc-500 tracking-widest">{f.l}</label>
                  <input name={f.n} value={(formData as any)[f.n]} onChange={handleChange} placeholder={f.l} className="w-full bg-black border-2 border-zinc-900 rounded-2xl p-4 text-center font-bold focus:border-red-600 transition-all" />
               </div>
             ))}
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">Experiencias, Destrezas y Anhelos</label>
            <textarea 
              name="exp" 
              value={formData.exp} 
              onChange={handleChange} 
              placeholder="Escribe aquí tu trayectoria, capacitaciones o metas en el modelaje..."
              className="w-full bg-black border-2 border-zinc-900 rounded-3xl p-6 outline-none focus:border-red-600 font-medium h-40 resize-none"
            />
          </div>

          <div className="space-y-8">
             <label className="text-[11px] font-black uppercase text-red-600 text-center block tracking-widest">Multimedia (Sube tus mejores materiales)</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {['foto1', 'foto2', 'foto3', 'composite'].map(f=>(
                 <div key={f} className="relative aspect-[3/4] bg-zinc-950 rounded-3xl border-2 border-zinc-900 overflow-hidden shadow-lg group">
                    {(formData as any)[f] ? <img src={(formData as any)[f]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /> : <div className="h-full flex items-center justify-center opacity-20 text-[10px] uppercase font-black">{f}</div>}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span className="text-white text-[10px] font-black uppercase">Cambiar Archivo</span>
                    </div>
                    <input type="file" accept="image/*" onChange={e=>handleFileUpload(e, f)} className="absolute inset-0 opacity-0 cursor-pointer" />
                 </div>
               ))}
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {[ {f:'video1',l:'Video Presentación'}, {f:'video2',l:'Video Pasarela'} ].map(v => (
                 <div key={v.f} className="glass p-6 rounded-[35px] border-zinc-900 text-center space-y-4 shadow-xl">
                    <p className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{v.l}</p>
                    {(formData as any)[v.f] ? (
                      <div className="flex items-center justify-center gap-2 text-green-500 font-black text-xs uppercase">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" /></svg>
                        Material Cargado
                      </div>
                    ) : <div className="text-zinc-700 italic text-[10px] uppercase">Sin Cargar</div>}
                    <input type="file" accept="video/*" onChange={e=>handleFileUpload(e, v.f)} className="w-full bg-zinc-900 rounded-xl p-3 text-[9px] cursor-pointer" />
                 </div>
               ))}
             </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button 
            type="submit" 
            disabled={status === 'saving'}
            className={`w-full py-7 rounded-[40px] font-black text-xl uppercase tracking-[0.5em] shadow-2xl transition-all active:scale-95 ${
              status === 'success' ? 'bg-green-600' : status === 'error' ? 'bg-red-900' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {status === 'saving' ? 'Subiendo datos...' : status === 'success' ? '¡Perfil Actualizado!' : status === 'error' ? 'Error al Guardar' : 'Confirmar Cambios'}
          </button>
          
          {isRegistered && (
            <button 
              type="button"
              onClick={() => confirm('¿Deseas darte de baja definitivamente?') && onDelete(formData.dni)}
              className="text-zinc-800 hover:text-red-900 font-black uppercase text-[10px] tracking-widest transition-colors py-4"
            >
              Dar de baja mi registro definitivamente
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
