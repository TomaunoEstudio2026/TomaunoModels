
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
  const [originalData, setOriginalData] = useState<string>(JSON.stringify(model));
  const [status, setStatus] = useState<'idle' | 'saving' | 'success'>('idle');
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setIsDirty(JSON.stringify(formData) !== originalData);
  }, [formData, originalData]);

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    let val = type === 'checkbox' ? checked : value;

    if (name === 'quals') {
      const newQuals = checked ? [...formData.quals, value] : formData.quals.filter(q => q !== value);
      setFormData(prev => ({ ...prev, quals: newQuals }));
      return;
    }

    if (name === 'altura') {
      val = value.replace('.', ',');
      if (val.length === 1 && !isNaN(val)) val += ',';
    }
    if (['nombre', 'localidad'].includes(name) && typeof val === 'string') {
      val = val.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }

    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, tipo: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (tipo.includes('video') && file.size > 50 * 1024 * 1024) {
      alert("El video no debe superar los 50MB");
      return;
    }

    setStatus('saving');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const res = await apiService.request('uploadFile', {
        base64: reader.result, dni: formData.dni, nombre: formData.nombre, tipo, oldUrl: (formData as any)[tipo]
      });
      if (res && !res.includes("ERROR")) {
        setFormData(prev => ({ ...prev, [tipo]: res }));
      }
      setStatus('idle');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('saving');
    const ok = await onSave(formData);
    if (ok) {
      setOriginalData(JSON.stringify(formData));
      setStatus('success');
      setTimeout(() => { setStatus('idle'); onClose(); }, 1500);
    } else {
      setStatus('idle');
      alert("Error al guardar. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade pb-40">
      {status === 'saving' && (
        <div className="fixed inset-0 z-[11000] bg-black/98 flex flex-col items-center justify-center space-y-8 backdrop-blur-xl">
           <div className="w-20 h-20 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
           <p className="font-luxury text-2xl tracking-[0.5em] uppercase animate-pulse">Actualizando Datos...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="fixed inset-0 z-[11000] bg-black/90 flex items-center justify-center backdrop-blur-md">
           <div className="bg-zinc-950 p-16 rounded-[60px] border border-green-600 text-center space-y-4 shadow-[0_0_100px_rgba(0,255,0,0.2)]">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">✓</div>
              <h2 className="font-luxury text-3xl font-bold uppercase tracking-widest">¡Registro Actualizado!</h2>
              <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em]">Tomauno Models agradece tu profesionalismo</p>
           </div>
        </div>
      )}

      <div className="glass p-10 rounded-[60px] flex justify-between items-center relative overflow-hidden">
        <div className="absolute left-0 top-0 h-full w-2 bg-red-600"></div>
        <div>
          <h2 className="font-luxury text-4xl">Mi <span className="text-red-600 font-bold italic">Perfil</span></h2>
          <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">DNI: {formData.dni}</p>
        </div>
        <div className="flex gap-4">
           {isRegistered && (
             <button type="button" onClick={() => confirm('¿Deseas darte de baja del sistema?') && onDelete(formData.dni)} className="bg-red-900/20 text-red-500 px-6 py-3 rounded-full text-[9px] font-bold uppercase border border-red-900/30 hover:bg-red-600 hover:text-white transition-all">Darse de Baja</button>
           )}
           <button onClick={onClose} className="bg-zinc-900 px-8 py-3 rounded-full text-[10px] font-bold uppercase border border-zinc-800">Cerrar (ESC)</button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-12">
        <div className="glass p-12 rounded-[60px] space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2"><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Nombre y Apellido</p>
              <input name="nombre" value={formData.nombre} onChange={handleChange} required tabIndex={1} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none focus:border-red-600" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Edad</p>
              <input type="number" name="edad" value={formData.edad || ''} onChange={handleChange} tabIndex={2} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Altura (m)</p>
              <input name="altura" value={formData.altura} onChange={handleChange} placeholder="1,70" tabIndex={3} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Medidas</p>
              <input name="medidas" value={formData.medidas} onChange={handleChange} placeholder="90-60-90" tabIndex={4} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Calzado</p>
              <input name="calzado" value={formData.calzado} onChange={handleChange} placeholder="38" tabIndex={5} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Ojos</p>
              <input name="ojos" value={formData.ojos} onChange={handleChange} tabIndex={6} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Pelo</p>
              <input name="pelo" value={formData.pelo} onChange={handleChange} tabIndex={7} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Localidad</p>
              <input name="localidad" value={formData.localidad} onChange={handleChange} tabIndex={8} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">WhatsApp</p>
              <input name="wa" value={formData.wa} onChange={handleChange} tabIndex={9} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none" />
            </div>
            <div><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Instagram (Usuario)</p>
              <input name="ig" value={formData.ig} onChange={handleChange} tabIndex={10} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none" />
            </div>
            <div className="md:col-span-3"><p className="text-[8px] uppercase font-bold text-zinc-600 mb-2 ml-4">Experiencia / Bio</p>
              <textarea name="exp" value={formData.exp} onChange={handleChange} tabIndex={11} className="w-full bg-black border border-zinc-900 rounded-3xl p-5 outline-none h-24 resize-none" />
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-[10px] uppercase font-bold text-red-600 tracking-[0.5em] text-center">Destrezas y Cualidades</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUALITIES_LIST.map(q => (
                <label key={q} className={`flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${formData.quals.includes(q) ? 'bg-red-900/10 border-red-600 text-white' : 'bg-black border-zinc-900 text-zinc-700 hover:border-zinc-700'}`}>
                  <input type="checkbox" name="quals" value={q} checked={formData.quals.includes(q)} onChange={handleChange} className="hidden" />
                  <span className="text-[8px] uppercase font-black">{q}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
             {['foto1', 'foto2', 'foto3', 'composite'].map((f) => (
               <div key={f} className="relative aspect-[3/4] bg-zinc-950 rounded-[40px] border-2 border-zinc-900 overflow-hidden group shadow-2xl">
                  {(formData as any)[f] ? (
                    <>
                      <img src={(formData as any)[f]} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFormData({...formData, [f]: ''})} className="absolute top-4 right-4 bg-red-600/80 backdrop-blur-md p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:scale-110 shadow-xl z-10">🗑️</button>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-zinc-800 space-y-2">
                       <span className="text-4xl">+</span>
                       <span className="text-[8px] uppercase font-bold">{f === 'composite' ? 'Composite' : 'Foto Portfolio'}</span>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={e => handleFileUpload(e, f)} className="absolute inset-0 opacity-0 cursor-pointer" />
               </div>
             ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             {[
               { key: 'video1', label: 'Video Presentación (Max 50MB)' },
               { key: 'video2', label: 'Caminata / Pasarela (Max 50MB)' }
             ].map((v) => (
               <div key={v.key} className="bg-zinc-950 p-8 rounded-[45px] border border-zinc-900 space-y-4 text-center group">
                  <p className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">{v.label}</p>
                  <div className="relative aspect-video bg-black rounded-[30px] overflow-hidden border border-zinc-800 shadow-inner group-hover:border-red-600/30 transition-all">
                    {(formData as any)[v.key] ? (
                      <video src={(formData as any)[v.key]} controls className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                         <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center text-2xl">📹</div>
                         <p className="text-[8px] text-zinc-700 font-bold uppercase">Grabar o Subir Video</p>
                      </div>
                    )}
                    <input type="file" accept="video/*" capture="user" onChange={e => handleFileUpload(e, v.key)} className="absolute inset-0 opacity-0 cursor-pointer" title="Cámara o Archivo" />
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="sticky bottom-10 px-4">
           <button type="submit" disabled={!isDirty || status === 'saving'} className={`w-full py-8 rounded-[45px] font-black text-xl uppercase tracking-[0.5em] transition-all shadow-[0_20px_60px_rgba(0,0,0,0.5)] active:scale-95 ${isDirty ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-zinc-900 text-zinc-700 grayscale cursor-not-allowed border border-zinc-800'}`}>
             {isDirty ? 'Guardar Cambios' : 'Sin cambios detectados'}
           </button>
        </div>
      </form>
    </div>
  );
};
