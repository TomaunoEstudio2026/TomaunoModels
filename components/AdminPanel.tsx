
import React, { useState, useMemo } from 'react';
import { Model, Category } from '../types';
import { CATEGORY_ICONS, QUALITIES_LIST, LOGO_URL } from '../constants';

interface AdminPanelProps {
  models: Model[];
  selectedDnis: string[];
  onToggleSelection: (dni: string) => void;
  onSelectAll: (dnis: string[]) => void;
  onEditModel: (dni: string) => void;
  onLogout: () => void;
  onToggleFlag: (dni: string, field: 'staff' | 'beauty') => void;
  onDeleteModel: (dni: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ models = [], selectedDnis, onToggleSelection, onSelectAll, onEditModel, onLogout, onToggleFlag, onDeleteModel }) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'gallery'>('list');
  const [filters, setFilters] = useState({ minAge: 0, maxAge: 99, minHeight: '0', maxHeight: '2,50', cat: '' });
  const [showSocials, setShowSocialsInPrint] = useState(true);

  const filtered = useMemo(() => {
    return models.filter(m => {
      const s = search.toLowerCase();
      // Filtro por nombre, DNI o destrezas
      const matchSearch = m.nombre.toLowerCase().includes(s) || 
                          m.dni.includes(s) || 
                          (m.quals && m.quals.some(q => q.toLowerCase().includes(s)));
      
      const matchAge = m.edad >= filters.minAge && m.edad <= filters.maxAge;
      
      const h = parseFloat(String(m.altura).replace(',', '.')) || 0;
      const minH = parseFloat(filters.minHeight.replace(',', '.')) || 0;
      const maxH = parseFloat(filters.maxHeight.replace(',', '.')) || 2.5;
      const matchHeight = h >= minH && h <= maxH;
      
      const matchCat = !filters.cat || m.cat === filters.cat;
      
      return matchSearch && matchAge && matchHeight && matchCat;
    });
  }, [models, search, filters]);

  const stats = {
    total: models.length,
    staff: models.filter(m => m.staff).length,
    beauty: models.filter(m => m.beauty).length,
    postulados: models.filter(m => m.cat === Category.POSTULADOS).length
  };

  const selectedModels = models.filter(m => selectedDnis.includes(m.dni));

  return (
    <div className="space-y-12 animate-fade pb-40">
      {/* Catálogo Imprimible */}
      <div className="hidden print:block">
         <div className="text-center mb-10">
            <h1 className="font-luxury text-4xl uppercase tracking-[0.3em]">TOMA<span className="text-red-600">UNO</span> MODEL'S</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">Catálogo Profesional</p>
         </div>
         <div className="print-grid">
            {selectedModels.map(m => (
               <div key={m.dni} className="print-card">
                  <img src={m.foto1 || m.composite || LOGO_URL} className="w-full h-2/3 object-cover" />
                  <div className="mt-4 text-center">
                     <h3 className="font-bold uppercase text-lg">{m.nombre}</h3>
                     <p className="text-xs uppercase font-bold">{m.edad} Años | {m.altura}m | {m.medidas}</p>
                     {showSocials && <p className="text-[10px] text-red-700 font-bold mt-1">IG: {m.ig}</p>}
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="no-print grid grid-cols-2 md:grid-cols-4 gap-4">
         {[
           { label: 'Total', val: stats.total, icon: '👥' },
           { label: 'Staff ⭐', val: stats.staff, icon: '🌟' },
           { label: 'Beauty 💎', val: stats.beauty, icon: '💎' },
           { label: 'Postulados', val: stats.postulados, icon: '🔥' }
         ].map(s => (
           <div key={s.label} className="bg-zinc-950 border border-zinc-900 p-6 rounded-[35px] text-center shadow-2xl">
              <span className="text-2xl mb-2 block">{s.icon}</span>
              <p className="text-[9px] uppercase font-black text-zinc-600 tracking-widest">{s.label}</p>
              <p className="text-3xl font-luxury font-black mt-1">{s.val}</p>
           </div>
         ))}
      </div>

      <div className="no-print glass p-8 rounded-[50px] space-y-8 border-red-900/10">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <input placeholder="🔍 Nombre, DNI o Destreza..." value={search} onChange={e=>setSearch(e.target.value)} className="bg-black border border-zinc-900 rounded-3xl p-5 outline-none focus:border-red-600" />
            <select value={filters.cat} onChange={e=>setFilters({...filters, cat: e.target.value})} className="bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-xs uppercase font-bold">
               <option value="">Categoría</option>
               {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex gap-2">
               <input placeholder="Alt. Mín" value={filters.minHeight} onChange={e=>setFilters({...filters, minHeight: e.target.value})} className="w-1/2 bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center" />
               <input placeholder="Alt. Máx" value={filters.maxHeight} onChange={e=>setFilters({...filters, maxHeight: e.target.value})} className="w-1/2 bg-black border border-zinc-900 rounded-3xl p-5 outline-none text-center" />
            </div>
         </div>
         <div className="flex justify-between items-center px-4">
            <button onClick={()=>setViewMode(viewMode==='list'?'gallery':'list')} className="text-[9px] font-black uppercase tracking-widest bg-zinc-900 px-6 py-2 rounded-full border border-zinc-800">Vista: {viewMode}</button>
            <div className="flex items-center gap-4">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={showSocials} onChange={e=>setShowSocialsInPrint(e.target.checked)} className="w-4 h-4 accent-red-600" />
                  <span className="text-[9px] font-bold uppercase text-zinc-500">Incluir Redes</span>
               </label>
               <button onClick={()=>window.print()} disabled={selectedDnis.length===0} className="bg-red-600 disabled:bg-zinc-800 px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-widest">Generar Catálogo ({selectedDnis.length})</button>
            </div>
         </div>
      </div>

      <div className={`no-print ${viewMode === 'list' ? 'space-y-4' : 'grid grid-cols-2 md:grid-cols-4 gap-6'}`}>
         {filtered.map(m => (
           <div key={m.dni} className={`group transition-all relative ${viewMode==='list'?'bg-zinc-950 p-6 rounded-[40px] flex items-center justify-between border border-zinc-900 hover:border-red-600':'glass rounded-[40px] overflow-hidden border border-zinc-900 flex flex-col'}`}>
              <div className={`flex ${viewMode==='list'?'items-center gap-6':'flex-col'}`}>
                 <input type="checkbox" checked={selectedDnis.includes(m.dni)} onChange={() => onToggleSelection(m.dni)} className={`w-5 h-5 accent-red-600 cursor-pointer ${viewMode==='gallery'?'absolute top-4 left-4 z-10':''}`} />
                 <div className={`${viewMode==='list'?'w-16 h-16 rounded-full':'w-full aspect-[4/5]'} overflow-hidden border-2 border-zinc-800 bg-black flex-shrink-0`}>
                    <img src={m.foto1 || m.composite || LOGO_URL} className="w-full h-full object-cover" />
                 </div>
                 <div className={`${viewMode==='gallery'?'p-6':''}`}>
                    <h4 className="font-bold text-lg flex items-center gap-2">{m.nombre} <span className="text-xs">{CATEGORY_ICONS[m.cat]}</span></h4>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">{m.edad} Años | {m.altura}m | {m.medidas}</p>
                    <div className="flex gap-3 mt-2">
                       <a href={`https://wa.me/${String(m.wa).replace(/\D/g,'')}`} target="_blank" className="text-[9px] font-bold text-green-500 uppercase">WA 💬</a>
                       <a href={`https://instagram.com/${String(m.ig).replace('@','')}`} target="_blank" className="text-[9px] font-bold text-red-400 uppercase">IG 📸</a>
                    </div>
                 </div>
              </div>
              <div className={`flex gap-2 ${viewMode==='gallery'?'p-4 border-t border-zinc-900 justify-center':''}`}>
                 <button onClick={()=>onEditModel(m.dni)} className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center hover:bg-white hover:text-black">✎</button>
                 <button onClick={()=>onToggleFlag(m.dni, 'staff')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${m.staff?'bg-yellow-600':'bg-zinc-900 text-zinc-600'}`}>⭐</button>
                 <button onClick={()=>onToggleFlag(m.dni, 'beauty')} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${m.beauty?'bg-blue-600':'bg-zinc-900 text-zinc-600'}`}>💎</button>
                 <button onClick={()=>onDeleteModel(m.dni)} className="w-10 h-10 bg-red-900/20 text-red-600 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">🗑️</button>
              </div>
           </div>
         ))}
      </div>
    </div>
  );
};
