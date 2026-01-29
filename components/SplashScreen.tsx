
import React from 'react';
import { LOGO_URL } from '../constants';

export const SplashScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center justify-center animate-pulse">
      <div className="relative">
        <div className="w-32 h-32 rounded-full border-2 border-red-600 flex items-center justify-center p-2 bg-white overflow-hidden shadow-[0_0_30px_rgba(153,0,0,0.5)]">
           <img src={LOGO_URL} alt="Logo Tomauno" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
      <div className="mt-8 text-center space-y-4">
        <h1 className="font-luxury text-3xl tracking-[0.3em] uppercase">
          TOMA<span className="text-red-600">UNO</span>
        </h1>
        <p className="font-luxury italic text-xl text-gray-400 animate-bounce opacity-80">
          Javier Móttola ®
        </p>
      </div>
    </div>
  );
};
