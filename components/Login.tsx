
import React, { useState, useEffect } from 'react';
import { ADMIN_KEY } from '../constants';

interface LoginProps {
  onLogin: (dni: string) => void;
  onAdminAccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onAdminAccess }) => {
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDni('');
  }, []);

  const handleLogin = () => {
    if (!dni.trim()) {
      setError('INGRESA TU DNI');
      return;
    }
    onLogin(dni);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade py-12">
      <div className="w-full max-w-md bg-zinc-900/50 backdrop-blur-xl p-8 rounded-[40px] border border-red-900/20 shadow-2xl text-center">
        <h2 className="font-luxury text-2xl mb-8 tracking-widest uppercase">Identificación <span className="text-[#990000] italic">Elite</span></h2>
        
        <div className="space-y-6">
          <div className="relative">
            <input
              type="tel"
              value={dni}
              autoFocus
              autoComplete="off"
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ''))}
              placeholder="DNI SIN PUNTOS"
              className="w-full bg-black/60 border-b-2 border-zinc-800 rounded-2xl px-6 py-4 text-center text-xl font-bold tracking-widest focus:border-[#990000] transition-all outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            {error && <p className="text-red-500 text-[9px] mt-2 uppercase tracking-widest font-bold">{error}</p>}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#990000] hover:bg-red-700 text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-lg uppercase tracking-widest text-xs"
          >
            Entrar
          </button>
        </div>
      </div>

      <div className="text-center text-zinc-700 text-[8px] tracking-[0.4em] uppercase font-bold">
        <p>Ecosistema Tomauno Models 2026</p>
        <p className="mt-1">© Javier Móttola ®</p>
      </div>
    </div>
  );
};
