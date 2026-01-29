
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
  const tabs = [
    { id: 'home', title: 'Inicio', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'news', title: 'Castings', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { id: 'wall', title: 'Muro', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { id: 'about', title: 'Staff', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    { id: 'faq', title: 'Ayuda', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
  ];

  return (
    <nav className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 glass rounded-full px-6 py-4 flex items-center gap-6 shadow-[0_15px_50px_rgba(153,0,0,0.5)] z-[5000] border border-red-900/20 scale-90 md:scale-100 transition-transform">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`transition-all transform p-2 ${activeTab === tab.id ? 'scale-125 text-red-600' : 'text-zinc-500 hover:text-white'}`}
          title={tab.title}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={tab.icon} />
          </svg>
        </button>
      ))}
      
      <button
        onClick={() => isAdmin ? setActiveTab('admin') : onAdminAccess()}
        className={`transition-all transform p-2 ${activeTab === 'admin' ? 'scale-125 text-red-600' : 'text-zinc-500 hover:text-white'}`}
        title="Administración"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <circle cx="12" cy="12" r="3" strokeWidth={2.5} />
        </svg>
      </button>

      {(isLoggedIn || isAdmin) && (
        <button onClick={onLogout} className="text-zinc-700 hover:text-red-500 ml-4 border-l border-zinc-800 pl-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7" />
          </svg>
        </button>
      )}
    </nav>
  );
};
