
import React, { useState } from 'react';
import { Model, WallPost } from '../types';

interface CommunityWallProps {
  posts: WallPost[];
  currentUser: Model | null;
  isAdmin: boolean;
  onPost: (msg: string) => void;
  onDeletePost: (id: string) => void;
  models: Model[];
}

export const CommunityWall: React.FC<CommunityWallProps> = ({ posts, currentUser, isAdmin, onPost, onDeletePost, models }) => {
  const [msg, setMsg] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const forbiddenWords = ['boludo', 'pelotudo', 'mierda', 'hdp', 'concha', 'puto'];

  const formatText = (text: string) => {
    let cleanText = text;
    forbiddenWords.forEach(word => {
      const regex = new RegExp(word, 'gi');
      cleanText = cleanText.replace(regex, '****');
    });

    const withLinks = cleanText.split(/(\s+)/).map((part, i) => {
      if (part.startsWith('@')) {
        const username = part.substring(1);
        return <a key={i} href={`https://instagram.com/${username}`} target="_blank" className="text-red-500 font-bold hover:underline">{part}</a>;
      }
      if (part.match(/^\+?[0-9]{10,15}$/)) {
        return <a key={i} href={`https://wa.me/${part.replace('+', '')}`} target="_blank" className="text-green-500 font-bold hover:underline">{part}</a>;
      }
      return part;
    });

    return withLinks;
  };

  const handleSend = async () => {
    if (!msg.trim() || isPosting) return;
    setIsPosting(true);
    await onPost(msg);
    setMsg('');
    setIsPosting(false);
  };

  return (
    <div className="animate-fade max-w-4xl mx-auto space-y-16 pb-40 px-4">
      <div className="text-center space-y-4">
        <h2 className="font-luxury text-7xl md:text-8xl tracking-tighter uppercase leading-none">
          EL <span className="text-[#ff0000] font-bold italic">MURO</span>
        </h2>
        <p className="text-zinc-600 text-[11px] uppercase tracking-[1em] font-black">Comunidad Tomauno Models</p>
      </div>

      {(currentUser || isAdmin) && (
        <div className="glass p-12 rounded-[60px] space-y-8 bg-zinc-950/50 border-red-900/20 shadow-2xl">
          <textarea 
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder={`Hola ${currentUser?.nombre.split(' ')[0] || 'Admin'}, deja tu mensaje aquí...`}
            className="w-full bg-black/80 border-2 border-zinc-900 rounded-[40px] p-8 focus:border-red-600 outline-none h-40 text-xl text-zinc-100 resize-none italic shadow-inner"
          />
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-4 text-3xl bg-black px-10 py-5 rounded-full border border-zinc-900 shadow-xl">
              {['📸', '🔥', '✨', '❤️', '🌟'].map(e => (
                <button key={e} onClick={() => setMsg(prev => prev + e)} className="hover:scale-150 transition-transform active:scale-75">{e}</button>
              ))}
            </div>
            <button 
              onClick={handleSend}
              disabled={isPosting || !msg.trim()}
              className="bg-red-600 hover:bg-red-700 text-white px-20 py-6 rounded-full font-black text-xs uppercase tracking-[0.4em] disabled:opacity-50 transition-all shadow-[0_0_40px_rgba(255,0,0,0.2)]"
            >
              {isPosting ? 'Enviando...' : 'Publicar'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-10">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-700 uppercase tracking-widest py-20">El muro está esperando tu primer mensaje...</p>
        ) : (
          posts.map((post) => (
            <div 
              key={post.id} 
              className="p-10 rounded-[50px] border border-zinc-900 flex gap-8 relative group hover:border-red-600/30 transition-all shadow-2xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${post.color || '#101010'} 0%, #000000 100%)` }}
            >
              <div className="w-20 h-20 rounded-full bg-black border-2 border-zinc-800 flex items-center justify-center flex-shrink-0 shadow-2xl">
                <span className="text-3xl font-luxury italic font-black text-red-600">
                  {post.nombre?.charAt(0) || 'T'}
                </span>
              </div>

              <div className="space-y-3 flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-white font-black text-xl uppercase tracking-tighter flex items-center gap-2">
                      {post.nombre}
                      {post.dni !== 'Staff' && <span className="text-[10px] bg-red-600/20 text-red-500 px-2 py-0.5 rounded-md">MODEL</span>}
                    </span>
                    <span className="text-[9px] text-zinc-500 uppercase font-black">{post.timestamp}</span>
                  </div>
                  
                  {isAdmin && (
                    <button 
                      onClick={() => { if(confirm('¿Borrar mensaje?')) onDeletePost(String(post.id)); }}
                      className="bg-zinc-900 p-4 rounded-2xl text-zinc-600 hover:text-red-600 transition-all border border-zinc-800"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="text-zinc-200 italic text-2xl leading-relaxed font-medium pt-2">
                  {formatText(post.mensaje)}
                </div>
                <p className="text-[8px] uppercase font-black tracking-widest mt-4 text-zinc-700">Ref ID: {post.dni}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
