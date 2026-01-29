
import React, { useState, useMemo } from 'react';
import { Model, Category } from '../types';
import { LOGO_URL, QUALITIES_LIST } from '../constants';

interface AdminPanelProps {
  models: Model[];
  onEditModel: (dni: string) => void;
  onViewPortfolio: (dni: string) => void;
  onLogout: () => void;
  onToggleFlag: (dni: string, field: string, currentVal: any) => void;
  onDeleteModel: (dni: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ 
  models = [], onEditModel, onViewPortfolio, onLogout, onToggleFlag, onDeleteModel 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat] = useState('Todas');
  const [selectedQual, setSelectedQual] = useState('');
  const [minHeight, setMinHeight] = useState('');
  const [maxHeight, setMaxHeight] = useState('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [filterLoc, setFilterLoc] = useState('');
  const [selectedDnis, setSelectedDnis] = useState<string[]>([]);
  const [printMode, setPrintMode] = useState(false);
  const [showContactsInPrint, setShowContactsInPrint] = useState(true);

  const stats = useMemo(() => ({
    total: models.length,
    staff: models.filter(m => m.staff).length,
    beauty: models.filter(m => m.beauty).length,
    outdated: models.filter(m => {
      const lastUpd = new Date(m.timestamp).getTime();
      return (Date.now() - lastUpd) > (150 * 24 * 60 * 60 * 1000); 
    }).length,
  }), [models]);

  const filtered = useMemo(() => {
    return models.filter(m => {
      const matchesSearch = m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.dni.includes(searchTerm);
      const matchesCat = filterCat === 'Todas' || m.cat === filterCat || 
                        (filterCat === 'Staff ⭐' && m.staff) ||
                        (filterCat === 'Beauty Face 💎' && m.beauty);
      
      const matchesQual = !selectedQual || m.quals.includes(selectedQual);

      const hNum = parseFloat(String(m.altura).replace(',', '.'));
      const matchesHeight = (!minHeight || hNum >= parseFloat(minHeight)) && (!maxHeight || hNum <= parseFloat(maxHeight));
      const ageNum = Number(m.edad);
      const matchesAge = (!minAge || ageNum >= parseInt(minAge)) && (!maxAge || ageNum <= parseInt(maxAge));
      const matchesLoc = !filterLoc || m.localidad.toLowerCase().includes(filterLoc.toLowerCase());

      return matchesSearch && matchesCat && matchesQual && matchesHeight && matchesAge && matchesLoc;
    }).sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [models, searchTerm, filterCat, selectedQual, minHeight, maxHeight, minAge, maxAge, filterLoc]);

  if (printMode) {
    const selected = models.filter(m => selectedDnis.includes(m.dni));
    return (
      <div className="bg-white text-black min-h-screen p-8 animate-fade font-sans">
        <div className="no-print flex flex-col md:flex-row gap-8 justify-between bg-black p-10 rounded-[50px] mb-12 items-center shadow-3xl">
          <div className="flex items-center gap-10">
            <button onClick={() => setPrintMode(false)} className="text-white font-black uppercase text-xs tracking-widest hover:text-red-600 transition-all">← Volver al Panel</button>
            <label className="text-white text-[11px] font-black uppercase flex items-center gap-4 cursor-pointer select-none">
              <input type="checkbox" checked={showContactsInPrint} onChange={e => setShowContactsInPrint(e.target.checked)} className="w-6 h-6 accent-red-600" />
              Ver Contactos (IG/WA)
            </label>
          </div>
          <button onClick={() => window.print()} className="bg-red-600 text-white px-12 py-5 rounded-full font-black uppercase text-xs tracking-[0.3em] shadow-xl hover:scale-105 transition-all">Generar PDF A4 (6 por hoja)</button>
        </div>
        
        <div className="grid grid-cols-2 gap-x-10 gap-y-8">
          {selected.map(m => (
            <div key={m.dni} className="border-2 border-zinc-100 p-6 rounded-[30px] flex flex-col h-[13.6cm] break-inside-avoid shadow-sm text-center bg-white">
               <div className="h-[9cm] w-full rounded-2xl overflow-hidden mb-5">
                  <img src={m.foto1 || LOGO_URL} className="w-full h-full object-cover" />
               </div>
               <h3 className="font-luxury text-3xl uppercase font-black leading-none mb-3 tracking-tight border-b-2 border-red-600 inline-block mx-auto pb-1">{m.nombre}</h3>
               <div className="text-[10px] font-bold opacity-80 uppercase grid grid-cols-2 gap-x-6 gap-y-2 mb-4 bg-zinc-50 p-3 rounded-xl">
                 <span>{m.edad} Años</span>
                 <span>H: {m.altura}m</span>
                 <span>Ojos: {m.ojos}</span>
                 <span>Medidas: {m.medidas || 'S/D'}</span>
               </div>
               {showContactsInPrint && (
                 <div className="mt-auto pt-2 space-y-1">
                   <p className="text-red-600 font-black text-[12px] tracking-widest uppercase">IG: @{String(m.ig).replace('@','')}</p>
                   <p className="text-green-600 font-black text-[12px] tracking-widest uppercase">WA: {m.wa}</p>
                 </div>
               )}
               <p className="text-[8px] mt-4 opacity-30 font-black tracking-widest uppercase">Tomauno Models ® Ecosystem</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade pb-40 no-print px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: 'Total Modelos', v: stats.total, c: 'border-zinc-800' },
          { l: 'Staff ⭐', v: stats.staff, c: 'border-red-600/40 text-red-500' },
          { l: 'Beauty 💎', v: stats.beauty, c: 'border-blue-600/40 text-blue-400' },
          { l: 'Desactualizados ⚠️', v: stats.outdated, c: 'border-orange-600/40 text-orange-400' }
        ].map(s => (
          <div key={s.l} className={`glass p-5 rounded-3xl border text-center shadow-xl ${s.c}`}>
             <p className="text-[9px] uppercase font-black opacity-60 mb-1 tracking-widest">{s.l}</p>
             <p className="text-2xl font-luxury font-black">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="glass p-6 rounded-[40px] border-red-600/20 space-y-4 shadow-2xl sticky top-2 z-[100] backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input type="text" placeholder="🔍 Nombre o DNI..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="bg-black border-2 border-zinc-900 rounded-full px-6 py-3 outline-none focus:border-red-600 text-sm font-bold w-full" />
          
          <select value={selectedQual} onChange={e=>setSelectedQual(e.target.value)} className="bg-black border-2 border-zinc-900 rounded-full px-6 py-3 text-xs font-bold outline-none focus:border-red-600">
            <option value="">Todas las Destrezas</option>
            {QUALITIES_LIST.map(q => <option key={q} value={q}>{q}</option>)}
          </select>

          <div className="flex gap-2">
            <input type="number" step="0.01" placeholder="H Mín" value={minHeight} onChange={e=>setMinHeight(e.target.value)} className="w-1/2 bg-black border-2 border-zinc-900 rounded-full px-4 py-2 text-xs font-bold" />
            <input type="number" step="0.01" placeholder="H Máx" value={maxHeight} onChange={e=>setMaxHeight(e.target.value)} className="w-1/2 bg-black border-2 border-zinc-900 rounded-full px-4 py-2 text-xs font-bold" />
          </div>
          <input type="text" placeholder="📍 Localidad..." value={filterLoc} onChange={e=>setFilterLoc(e.target.value)} className="bg-black border-2 border-zinc-900 rounded-full px-6 py-3 text-xs font-bold" />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((m) => {
          const isOutdated = (Date.now() - new Date(m.timestamp).getTime()) > 150*24*60*60*1000;
          return (
            <div key={m.dni} className="glass p-4 rounded-3xl border-zinc-900 hover:border-red-600/40 transition-all flex items-center gap-6 group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 cursor-pointer shadow-lg" onClick={()=>onViewPortfolio(m.dni)}>
                 <img src={m.foto1 || LOGO_URL} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                 <div className="flex items-center gap-3">
                    <h4 className="font-luxury text-lg uppercase font-black truncate group-hover:text-red-600">{m.nombre}</h4>
                    <a href={`https://instagram.com/${String(m.ig).replace('@','')}`} target="_blank" className="text-pink-600 text-xs opacity-60 hover:opacity-100 transition-opacity">📸</a>
                 </div>
                 <p className="text-[9px] text-zinc-500 uppercase font-black tracking-widest">{m.altura}m | {m.edad}A | {m.medidas || 'S/D'}</p>
              </div>
              
              <div className="flex items-center gap-2">
                 <input type="checkbox" checked={selectedDnis.includes(m.dni)} onChange={()=>setSelectedDnis(prev=>prev.includes(m.dni)?prev.filter(d=>d!==m.dni):[...prev, m.dni])} className="w-5 h-5 accent-red-600 cursor-pointer" />
                 <button onClick={()=>onEditModel(m.dni)} className="text-xl p-2 hover:bg-zinc-800 rounded-xl">✏️</button>
                 <button onClick={()=>onToggleFlag(m.dni, 'staff', m.staff)} className={`text-xl transition-all ${m.staff?'opacity-100 scale-125':'opacity-10'}`}>⭐</button>
                 <button onClick={()=>onToggleFlag(m.dni, 'beauty', m.beauty)} className={`text-xl transition-all ${m.beauty?'opacity-100 scale-125':'opacity-10'}`}>💎</button>
                 {isOutdated && <span className="text-xl">⚠️</span>}
                 <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteModel(m.dni); }} 
                    className="text-xl text-red-600 hover:bg-red-900/20 p-2 rounded-xl"
                 >
                    🗑️
                 </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedDnis.length > 0 && (
        <div className="fixed bottom-32 left-1/2 -translate-x-1/2 glass px-10 py-5 rounded-full border-red-600 border-2 flex gap-8 items-center shadow-2xl z-[500] animate-bounce">
           <span className="text-white font-black text-xs uppercase">{selectedDnis.length} Marcados</span>
           <button onClick={()=>setPrintMode(true)} className="bg-red-600 text-white px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">Generar Catálogo PDF</button>
        </div>
      )}
    </div>
  );
};
