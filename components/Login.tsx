
import React, { useState, useEffect } from 'react';

interface LoginProps {
  onLogin: (dni: string) => void;
  onAdminAccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onAdminAccess }) => {
  const [dni, setDni] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setDni('');
    setError('');
  }, []);

  const handleLogin = () => {
    const cleanDni = dni.trim().replace(/\D/g, '');
    if (!cleanDni || cleanDni.length < 5) {
      setError('INGRESA UN DNI VÁLIDO');
      return;
    }
    onLogin(cleanDni);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-fade py-12">
      <div className="w-full max-w-md bg-zinc-950/80 backdrop-blur-3xl p-10 rounded-[60px] border border-red-900/20 shadow-[0_0_80px_rgba(153,0,0,0.1)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
        
        <h2 className="font-luxury text-3xl mb-12 tracking-[0.2em] uppercase">
          Acceso <span className="text-[#990000] italic font-bold">Modelos</span>
        </h2>
        
        <div className="space-y-8">
          <div className="relative">
            <input
              type="tel"
              value={dni}
              autoFocus
              onChange={(e) => { setError(''); setDni(e.target.value.replace(/\D/g, '')); }}
              placeholder="DNI"
              className="w-full bg-black border-2 border-zinc-900 rounded-[30px] px-6 py-6 text-center text-2xl font-bold tracking-[0.3em] focus:border-[#990000] outline-none text-white placeholder:text-zinc-900"
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <p className="text-zinc-600 text-[8px] mt-3 uppercase tracking-widest font-bold">(Ingresa solo números sin puntos)</p>
            {error && <p className="text-red-600 text-[9px] mt-2 uppercase tracking-widest font-black animate-pulse">{error}</p>}
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#990000] hover:bg-red-700 text-white font-bold py-6 rounded-full transition-all active:scale-95 shadow-[0_20px_40px_rgba(153,0,0,0.3)] uppercase tracking-[0.3em] text-xs"
          >
            Ingresar
          </button>
        </div>
      </div>
    </div>
  );
};
