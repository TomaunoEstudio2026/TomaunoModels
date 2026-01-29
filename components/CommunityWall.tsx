
import React, { useState } from 'react';
import { WallPost, Model } from '../types';

interface CommunityWallProps {
  posts: WallPost[];
  currentUser: Model | null;
  isAdmin: boolean;
  onPost: (msg: string) => void;
  onDeletePost: (id: string) => void;
}

export const CommunityWall: React.FC<CommunityWallProps> = ({ posts, currentUser, isAdmin, onPost, onDeletePost }) => {
  const [msg, setMsg] = useState('');
  
  const handleEmojiClick = (emoji: string) => {
    setMsg(prev => prev + emoji);
  };

  const handlePost = () => {
    if (!msg.trim()) return;
    onPost(msg);
    setMsg('');
  };

  return (
    <div className="animate-fade max-w-4xl mx-auto space-y-16 pb-32">
      <div className="text-center space-y-4">
        <h2 className="font-luxury text-5xl tracking-tighter">Muro de la <span className="text-[#990000] font-bold italic">Comunidad</span></h2>
        <p className="text-zinc-500 text-[10px] uppercase tracking-[0.5em] font-bold">Conecta con la Academia</p>
      </div>

      {(currentUser || isAdmin) && (
        <div className="glass p-10 rounded-[40px] border border-red-900/10 shadow-2xl space-y-6">
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="¡Escribe tu mensaje aquí!..."
            className="w-full bg-black/60 border-2 border-zinc-900 rounded-[30px] p-6 focus:border-[#990000] outline-none h-28 text-base text-zinc-100 resize-none shadow-inner"
          />
          <div className="flex justify-between items-center">
             <div className="flex gap-3 text-2xl bg-black/40 p-2 rounded-full border border-zinc-900">
                {['🔥', '✨', '📸', '❤️', '🌟'].map(e => (
                  <button key={e} onClick={() => handleEmojiClick(e)} className="hover:scale-125 transition-transform">{e}</button>
                ))}
             </div>
             <button 
               onClick={handlePost}
               className="bg-[#990000] hover:bg-red-700 text-white px-10 py-4 rounded-full font-bold text-xs uppercase tracking-widest shadow-xl transition-all"
             >
               Publicar
             </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {posts.map((post, i) => (
          <div key={post.id} className={`p-8 rounded-[35px] border space-y-4 relative overflow-hidden transition-all hover:scale-[1.02] ${
            i % 3 === 0 ? 'bg-zinc-900/50 border-zinc-800' : 
            i % 3 === 1 ? 'bg-[#990000]/5 border-red-900/20' : 'bg-black border-zinc-900'
          }`}>
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-luxury font-bold text-red-600 border border-red-600/20">
                 {post.nombre?.charAt(0)}
               </div>
               <div>
                  <span className="text-white font-bold text-sm block">{post.nombre}</span>
                  <span className="text-[8px] text-zinc-600 uppercase tracking-widest">{new Date(post.timestamp).toLocaleString()}</span>
               </div>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed italic">"{post.mensaje}"</p>
            {isAdmin && (
               <button onClick={() => confirm('¿Borrar?') && onDeletePost(post.id)} className="absolute top-4 right-4 text-[9px] text-red-900 uppercase font-bold">Borrar</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
