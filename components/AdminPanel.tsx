
import React, { useState } from 'react';
import { Model, NewsItem, FAQ, Category } from '../types';
import { CATEGORY_ICONS, WA_NUMBER } from '../constants';

interface AdminPanelProps {
  models: Model[];
  news: NewsItem[];
  onUpdateModels: (m: Model[]) => void;
  onEditModel: (dni: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ models, news, onUpdateModels, onEditModel }) => {
  const [activeTab, setActiveTab] = useState<'lista' | 'novedades' | 'colaboradores'>('lista');
  const [search, setSearch] = useState('');

  const isStale = (dateStr: string) => {
    const last = new Date(dateStr);
    const now = new Date();
    const months = (now.getFullYear() - last.getFullYear()) * 12 + (now.getMonth() - last.getMonth());
    return months >= 5;
  };

  const filtered = models.filter(m => m.nombre.toLowerCase().includes(search.toLowerCase()) || m.dni.includes(search));

  const stats = {
    total: models.length,
    staff: models.filter(m => m.staff).length,
    colabs: models.filter(m => m.isCollaborator).length,
    desact: models.filter(m => isStale(m.lastUpdate)).length
  };

  return (
    <div className="space-y-10 animate-fade">
      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Modelos', val: stats.total, color: 'border-zinc-800' },
          { label: 'Staff Elite', val: stats.staff, color: 'border-red-900/40' },
          { label: 'Colaboradores', val: stats.colabs, color: 'border-blue-900/40' },
          { label: 'Desactualizados', val: stats.desact, color: 'border-orange-900/40 text-orange-500' }
        ].map(s => (
          <div key={s.label} className={`glass p-6 rounded-[30px] border ${s.color} text-center`}>
            <p className="text-[8px] uppercase tracking-widest text-zinc-500 font-bold mb-1">{s.label}</p>
            <p className={`text-3xl font-luxury font-bold ${s.label.includes('Desact') ? 'text-orange-500' : 'text-white'}`}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 bg-zinc-950 p-2 rounded-full border border-zinc-900 max-w-md mx-auto no-print">
        {['lista', 'novedades', 'colaboradores'].map(t => (
          <button key={t} onClick={() => setActiveTab(t as any)} className={`flex-1 py-2 rounded-full text-[9px] font-bold uppercase tracking-widest transition-all ${activeTab === t ? 'bg-[#990000] shadow-lg' : 'text-zinc-600 hover:text-white'}`}>{t}</button>
        ))}
      </div>

      {activeTab === 'lista' && (
        <div className="space-y-6">
          <input 
            placeholder="Buscar por Nombre o DNI..." 
            value={search} onChange={e=>setSearch(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-900 p-4 rounded-2xl text-xs outline-none focus:border-red-900"
          />

          <div className="bg-zinc-950 rounded-[35px] border border-zinc-900 overflow-hidden overflow-x-auto shadow-2xl">
            <table className="w-full text-left text-[11px]">
               <thead className="bg-zinc-900 text-zinc-500 uppercase font-bold tracking-widest">
                  <tr>
                    <th className="p-5">Modelo</th>
                    <th className="p-5">Dato Elite</th>
                    <th className="p-5">Estado</th>
                    <th className="p-5 text-right">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-zinc-900">
                  {filtered.map(m => (
                    <tr key={m.dni} className="hover:bg-red-900/5 transition-colors group">
                      <td className="p-5">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center font-bold text-red-600">
                             {CATEGORY_ICONS[m.cat] || '✨'}
                           </div>
                           <div>
                              <p className="font-bold text-white text-sm">{m.nombre}</p>
                              <p className="text-zinc-600 text-[9px]">{m.dni}</p>
                           </div>
                         </div>
                      </td>
                      <td className="p-5 text-zinc-400">
                         {m.edad} Años • {m.altura}m<br/>
                         {m.localidad}
                      </td>
                      <td className="p-5">
                         {isStale(m.lastUpdate) && (
                           <div className="flex items-center gap-1 text-orange-500 font-bold uppercase text-[8px] animate-pulse">
                              <span>⚠️ DESACTUALIZADO</span>
                           </div>
                         )}
                         <span className="text-zinc-600 text-[9px]">{m.cat.split(' ')[0]}</span>
                      </td>
                      <td className="p-5 text-right space-x-2">
                         <button onClick={()=>onEditModel(m.dni)} className="p-2 bg-zinc-900 rounded-lg text-white hover:bg-white hover:text-black transition-all">✎</button>
                         <a href={`https://wa.me/${m.wa.replace(/\D/g,'')}?text=Hola+${m.nombre}!+Te+escribo+de+Tomauno+Models+para+que+actualices+tus+datos...`} target="_blank" className="p-2 bg-green-600/10 text-green-500 rounded-lg hover:bg-green-600 hover:text-white inline-block">WA</a>
                      </td>
                    </tr>
                  ))}
               </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
