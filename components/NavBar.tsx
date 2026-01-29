
import React from 'react';

interface NavBarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  isAdmin: boolean;
  isLoggedIn: boolean;
  onAdminAccess: () => void;
  onLogout: () => void;
}

export const NavBar: React.FC<NavBarProps> = ({ activeTab, setActiveTab, isAdmin, isLoggedIn, onAdminAccess, onLogout }) => {
  // Solo mostramos pestañas seguras para el público
  const tabs = [
    { id: 'home', title: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'wall', title: 'Muro', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'courses', title: 'Cursos', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332-4.5-1.253' },
    { id: 'about', title: 'Staff', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <nav className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 glass rounded-full px-6 py-4 flex items-center gap-6 md:gap-10 shadow-[0_20px_50px_rgba(255,0,0,0.2)] z-[5000] border border-red-900/10">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`transition-all transform p-2 ${activeTab === tab.id ? 'scale-125 text-red-600 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]' : 'text-zinc-600 hover:text-white'}`}
          title={tab.title}
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
          </svg>
        </button>
      ))}
      
      {/* Botón de Administrador separado para seguridad */}
      <button
        onClick={isAdmin ? () => setActiveTab('admin') : onAdminAccess}
        className={`transition-all transform p-2 ${isAdmin ? 'text-red-600' : 'text-zinc-600 hover:text-white'}`}
        title="Admin Control"
      >
        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" strokeWidth={2} />
        </svg>
      </button>

      {(isLoggedIn || isAdmin) && (
        <button onClick={onLogout} className="text-zinc-800 hover:text-red-600 ml-4 border-l border-zinc-900 pl-6 group transition-all">
          <svg className="w-7 h-7 group-active:scale-75 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
        </button>
      )}
    </nav>
  );
};
