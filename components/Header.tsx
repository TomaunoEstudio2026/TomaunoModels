
import React from 'react';
import { LOGO_URL } from '../constants';

export const Header: React.FC = () => {
  return (
    <header className="no-print bg-gradient-to-b from-[#2e0505] to-black py-8 border-b border-red-900/30 flex flex-col items-center shadow-2xl">
      <div className="w-20 h-20 rounded-full border border-white bg-white p-1 mb-4 shadow-xl">
        <img src={LOGO_URL} alt="Logo Tomauno" className="w-full h-full rounded-full object-cover" />
      </div>
      <h1 className="font-luxury text-2xl md:text-3xl tracking-[0.25em] text-white">
        TOMA<span className="text-red-600">UNO</span> <span className="font-light italic text-red-600">MODEL'S</span>
      </h1>
      <p className="text-[10px] tracking-[0.4em] text-gray-400 mt-2 uppercase font-semibold">Agencia & Academia de Modelos Elite</p>
    </header>
  );
};
