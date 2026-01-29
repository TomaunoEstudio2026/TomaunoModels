
import React, { useState } from 'react';
import { WallPost, Model } from '../types';

interface CommunityWallProps {
  posts: WallPost[];
  currentUser: Model | null;
  isAdmin: boolean;
  onPost: (msg: string) => Promise<void>;
  onDeletePost: (id: string) => Promise<void>;
}

export const CommunityWall: React.FC<CommunityWallProps> = ({ posts, currentUser, isAdmin, onPost, onDeletePost }) => {
  const [msg, setMsg] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    if (!msg.trim() || isPosting) return;
    setIsPosting(true);
    try {
      await onPost(msg);
      setMsg('');
    } catch (e) {
      alert("Error al publicar.");
    } finally {
      setIsPosting(false);
    }
  };

  const getUserColor = (dni: string) => {
    const colors = ['bg-red-950/20 border-red-900/30', 'bg-zinc-900/60 border-zinc-800', 'bg-black border-zinc-900'];
    let hash = 0;
    for (let i = 0; i < dni.length; i++) hash = dni.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="animate-fade max-w-4xl mx-auto space-y-16 pb-40 px-4">
      <div className="text-center space-y-4">
        <h2 className="font-luxury text-7xl tracking-tighter uppercase">EL <span className="text-[#990000] font-bold italic">MURO</span></h2>
        <p className="text-zinc-500 text-[11px] uppercase tracking-[0.8em] font-black">Comunidad & Network Tomauno</p>
      </div>

      {/* Input de Mensaje */}
      {(currentUser || isAdmin) && (
        <div className="glass p-12 rounded-[50px] border border-red-900/10 shadow-[0_30px_80px_rgba(0,0,0,0.5)] space-y-8 relative overflow-hidden bg-zinc-950/50">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent"></div>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Saluda, comparte tu IG o deja un consejo para el staff..."
            className="w-full bg-black/80 border-2 border-zinc-900 rounded-[35px] p-8 focus:border-red-600 outline-none h-44 text-lg text-zinc-100 resize-none italic shadow-inner transition-all placeholder:text-zinc-800"
          />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex gap-4 text-3xl bg-black/80 px-8 py-5 rounded-full border border-zinc-900 shadow-xl">
                {['📸', '🔥', '✨', '❤️', '🌟'].map(e => (
                  <button key={e} onClick={() => setMsg(prev => prev + e)} className="hover:scale-150 transition-transform active:scale-90 duration-300">{e}</button>
                ))}
             </div>
             <button 
               onClick={handlePost} 
               disabled={isPosting || !msg.trim()}
               className="bg-red-600 disabled:bg-zinc-800 disabled:text-zinc-600 hover:bg-red-700 text-white px-20 py-7 rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-2xl transition-all active:scale-95"
             >
               {isPosting ? 'Sincronizando...' : 'Publicar Ahora'}
             </button>
          </div>
        </div>
      )}

      {/* Feed de Mensajes */}
      <div className="space-y-10">
        {posts.length === 0 ? (
          <div className="text-center py-24 space-y-4 opacity-30">
             <span className="text-6xl block">🗞️</span>
             <p className="font-bold uppercase tracking-[0.5em] text-xs">Aún no hay publicaciones</p>
          </div>
        ) : posts.map((post) => (
          <div key={post.id} className={`p-12 rounded-[55px] border-2 space-y-8 transition-all relative group shadow-3xl ${getUserColor(post.dni || 'Staff')}`}>
            <div className="flex items-center gap-6">
               <div className="w-18 h-18 rounded-full bg-zinc-950 flex items-center justify-center font-luxury font-black text-red-600 border-2 border-red-600/30 text-4xl shadow-2xl">
                 {post.nombre?.charAt(0) || 'T'}
               </div>
               <div>
                  <span className="text-white font-bold text-2xl block tracking-tight uppercase">{post.nombre || 'Administración'}</span>
                  <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-black">{new Date(post.timestamp).toLocaleString('es-AR')}</span>
               </div>
            </div>
            <div className="text-zinc-300 text-xl leading-relaxed italic px-6 font-medium">
               "{post.mensaje}"
            </div>
            {isAdmin && (
               <button onClick={() => confirm('¿Borrar mensaje?') && onDeletePost(post.id)} className="absolute top-12 right-12 text-[10px] text-red-900 uppercase font-black hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 p-2">Eliminar Registro ✕</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
