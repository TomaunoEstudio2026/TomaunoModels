import React, { useState, useMemo } from 'react';
import { Model, Category, Gender } from '../types';

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedDnis, setSelectedDnis] = useState<string[]>([]);
  const [filterGender, setFilterGender] = useState('todos');

  const filtered = useMemo(() => {
    return models.filter(m => {
      const matchSearch = m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || m.dni.includes(searchTerm);
      const matchGender = filterGender === 'todos' || m.genero === filterGender;
      return matchSearch && matchGender;
    });
  }, [models, searchTerm, filterGender]);

  const stats = {
    total: models.length,
    staff: models.filter(m => m.staff).length,
    beauty: models.filter(m => m.beauty).length
  };

  return (
    <div className="space-y-10 animate-fade pb-20 no-print">
      <div className="glass p-10 rounded-[50px] border-red-600/20 sticky top-4 z-50 backdrop-blur-2xl shadow-2xl">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-8">
          <div>
            <h2 className="font-luxury text-4xl">Panel <span className="text-red-600">Director</span></h2>
            <div className="flex gap-4 mt-2 text-[10px] font-black uppercase tracking-widest text-zinc-500">
              <span>Total: <b className="text-white">{stats.total}</b></span>
              <span>★ Staff: <b className="text-red-600">{stats.staff}</b></span>
              <span>♦ Beauty: <b className="text-red-600">{stats.beauty}</b></span>
            </div>
          </div>
          <div className="flex flex-wrap gap-4">
             <input type="text" placeholder="Buscar..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} className="bg-black border border-zinc-800 rounded-full px-8 py-3 outline-none focus:border-red-600 w-64" />
             <div className="flex bg-zinc-900 p-1 rounded-2xl">
                <button onClick={() => setViewMode('grid')} className={`px-4 py-2 rounded-xl text-[10px] font-bold ${viewMode === 'grid' ? 'bg-red-600' : ''}`}>CUADRICULA</button>
                <button onClick={() => setViewMode('list')} className={`px-4 py-2 rounded-xl text-[10px] font-bold ${viewMode === 'list' ? 'bg-red-600' : ''}`}>LISTA</button>
             </div>
             <button onClick={onLogout} className="bg-white text-black px-8 py-3 rounded-2xl font-black uppercase text-[10px]">Salir</button>
          </div>
        </div>
      </div>

      <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" : "space-y-4"}>
        {filtered.map(m => (
          <div key={m.dni} className={`glass p-6 rounded-[40px] border-zinc-900 transition-all hover:border-red-600/30 ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}>
             <div className="flex items-center gap-6">
                <input type="checkbox" checked={selectedDnis.includes(m.dni)} onChange={() => setSelectedDnis(prev => prev.includes(m.dni) ? prev.filter(d=>d!==m.dni) : [...prev, m.dni])} className="w-6 h-6 accent-red-600" />
                <img src={m.foto1 || 'https://via.placeholder.com/150'} className="w-20 h-20 rounded-3xl object-cover" />
                <div>
                   <h4 className="font-luxury text-2xl leading-none">{m.nombre}</h4>
                   <p className="text-zinc-500 text-[10px] uppercase tracking-widest mt-1">{m.cat} • {m.wa || 'Sin WA'}</p>
                </div>
             </div>

             <div className={`flex gap-3 ${viewMode === 'grid' ? 'mt-6 pt-6 border-t border-zinc-900' : ''}`}>
                <button onClick={() => onToggleFlag(m.dni, 'staff', m.staff)} className={`px-4 py-2 rounded-xl text-[10px] font-black ${m.staff ? 'bg-red-600' : 'bg-zinc-900 text-zinc-600'}`}>★ STAFF</button>
                <button onClick={() => onToggleFlag(m.dni, 'beauty', m.beauty)} className={`px-4 py-2 rounded-xl text-[10px] font-black ${m.beauty ? 'bg-red-600' : 'bg-zinc-900 text-zinc-600'}`}>♦ BEAUTY</button>
                <button onClick={() => onEditModel(m.dni)} className="p-3 bg-zinc-800 rounded-xl">✏️</button>
                <button onClick={() => onDeleteModel(m.dni)} className="p-3 text-zinc-700">🗑️</button>
             </div>
          </div>
        ))}
      </div>

      {selectedDnis.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] glass px-10 py-5 rounded-full flex gap-8 items-center shadow-2xl border-red-600 bg-black/90">
           <span className="text-xs font-bold uppercase">{selectedDnis.length} Modelos Seleccionados</span>
           <button onClick={() => window.print()} className="bg-red-600 px-10 py-3 rounded-full font-black uppercase text-[10px]">Generar PDF Catálogo</button>
        </div>
      )}
    </div>
  );
};