
import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';
import { ModelProfile } from './components/ModelProfile';
import { AdminPanel } from './components/AdminPanel';
import { CommunityWall } from './components/CommunityWall';
import { CoursePanel } from './components/CoursePanel';
import { PrismaAssistant } from './components/PrismaAssistant';
import { AboutUs } from './components/AboutUs';
import { Model, WallPost, Course, Category, Gender } from './types';
import { ADMIN_KEY, PRISMA_DEFAULT_KNOWLEDGE, VERSION } from './constants';
import { apiService } from './apiService';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [currentUser, setCurrentUser] = useState<Model | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [models, setModels] = useState<Model[]>([]);
  const [selectedDnis, setSelectedDnis] = useState<string[]>([]);
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const data = await apiService.request('getInitialData');
    if (data) {
      setModels(data.models || []);
      setPosts(data.posts || []);
      setCourses([{ 
        id: 'c1', titulo: 'Modelo Profesional Nivel 1', fecha: 'Sábados', horario: '9 a 12hs / 15 a 18hs',
        costo: '$35.000 (Inscripción)', temario: 'Pasarela, Fotografía Editorial, Automaquillaje, Oratoria, Marketing Digital, Casting y Comportamiento Social.', img: '', location: 'Pedro Méndez 2069', enabled: true
      }]);
    } else {
      setError(true);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setShowSplash(false), 3000);
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showAdminLogin) setShowAdminLogin(false);
        else if (activeTab === 'profile') setActiveTab(isAdmin ? 'admin' : 'home');
        else if (activeTab !== 'home') setActiveTab('home');
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showAdminLogin, activeTab, isAdmin]);

  const handleLogin = (dni: string) => {
    const existing = models.find(m => String(m.dni) === String(dni));
    if (existing) {
      setCurrentUser(existing);
    } else {
      setCurrentUser({ 
        timestamp: new Date().toISOString(), dni, nombre: '', genero: Gender.FEMALE, edad: 0, altura: '', medidas: '', ojos: '', pelo: '', calzado: '', localidad: 'Posadas', wa: '', waTutor: '', ig: '', exp: '', cat: Category.NEW_FACE, quals: [], beauty: false, staff: false, isCollaborator: false, foto1: '', foto2: '', foto3: '', composite: '', video1: '', video2: '', lastUpdate: new Date().toISOString(), postulatedTo: [] 
      });
    }
    setActiveTab('profile');
  };

  const toggleModelSelection = (dni: string) => {
    setSelectedDnis(prev => prev.includes(dni) ? prev.filter(d => d !== dni) : [...prev, dni]);
  };

  return (
    <div className="min-h-screen pb-32 bg-black text-white selection:bg-red-600">
      <Header />
      
      {showSplash && <SplashScreen />}

      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[5000] bg-red-600 text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-2xl animate-bounce">
          ⚠️ Revisa la conexión con Google Sheets.
        </div>
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[20000] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="bg-zinc-950 p-10 rounded-[50px] border border-red-600/30 w-full max-w-sm text-center space-y-8 shadow-[0_0_100px_rgba(153,0,0,0.2)]">
              <h3 className="font-luxury text-2xl font-bold uppercase tracking-widest text-white">Acceso <span className="text-red-600">Staff</span></h3>
              <input 
                type="password" 
                autoFocus 
                value={adminPass} 
                onChange={e=>setAdminPass(e.target.value)} 
                onKeyDown={e=>e.key==='Enter' && (adminPass === ADMIN_KEY ? (setIsAdmin(true), setShowAdminLogin(false), setActiveTab('admin')) : alert('Clave Incorrecta'))} 
                placeholder="CLAVE" 
                className="w-full bg-black border border-zinc-800 rounded-3xl p-5 text-center text-xl tracking-[0.4em] outline-none text-white focus:border-red-600 transition-all" 
              />
              <button onClick={() => adminPass === ADMIN_KEY ? (setIsAdmin(true), setShowAdminLogin(false), setActiveTab('admin')) : alert('Clave Incorrecta')} className="w-full bg-red-600 py-4 rounded-full font-bold text-[10px] uppercase text-white shadow-lg active:scale-95 transition-all">Entrar</button>
              <button onClick={()=>setShowAdminLogin(false)} className="text-zinc-600 text-[10px] uppercase font-bold hover:text-white">Cancelar (ESC)</button>
           </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-7xl animate-fade">
        {activeTab === 'home' && !currentUser && <Login onLogin={handleLogin} onAdminAccess={() => setShowAdminLogin(true)} />}
        
        {activeTab === 'profile' && currentUser && (
           <ModelProfile 
              model={currentUser} 
              isRegistered={models.some(m => String(m.dni) === String(currentUser.dni))} 
              onSave={async (m) => { 
                const res = await apiService.request('saveModel', { model: m }); 
                if(res) { fetchData(); return true; } 
                return false; 
              }} 
              onDelete={async (dni) => { 
                const ok = await apiService.request('deleteModel', { dni }); 
                if(ok) {
                  fetchData(); 
                  setCurrentUser(null);
                  setActiveTab('home');
                  return true;
                }
                return false;
              }} 
              onClose={() => setActiveTab(isAdmin ? 'admin' : 'home')} 
           />
        )}

        {activeTab === 'admin' && isAdmin && (
          <AdminPanel 
            models={models} 
            selectedDnis={selectedDnis}
            onToggleSelection={toggleModelSelection}
            onSelectAll={(dnis) => setSelectedDnis(dnis)}
            onEditModel={(dni) => { 
              const m = models.find(x => String(x.dni) === String(dni)); 
              if (m) { setCurrentUser(m); setActiveTab('profile'); } 
            }} 
            onLogout={() => { setIsAdmin(false); setActiveTab('home'); }} 
            onToggleFlag={async (dni, field) => { 
              const target = models.find(m => String(m.dni) === String(dni));
              if(!target) return;
              const updatedModel = { ...target, [field]: !target[field] };
              // Actualización Local Inmediata
              setModels(prev => prev.map(m => String(m.dni) === String(dni) ? updatedModel : m));
              await apiService.request('saveModel', { model: updatedModel });
            }} 
            onDeleteModel={async (dni) => { 
              if(confirm('¿Eliminar permanentemente este registro?')) {
                const ok = await apiService.request('deleteModel', { dni }); 
                if(ok) setModels(prev => prev.filter(m => String(m.dni) !== String(dni)));
                else alert("Error al eliminar en servidor.");
              }
            }} 
          />
        )}

        {activeTab === 'wall' && (
          <CommunityWall 
            posts={posts} 
            currentUser={currentUser} 
            isAdmin={isAdmin} 
            onPost={async (msg) => { 
              const res = await apiService.request('addMuroPost', { dni: currentUser?.dni || 'Staff', nombre: currentUser?.nombre || 'Javier Móttola', txt: msg }); 
              if(res) fetchData(); 
            }} 
            onDeletePost={async (id) => { 
              await apiService.request('deleteMuroPost', { id }); 
              fetchData(); 
            }} 
          />
        )}
        
        {activeTab === 'courses' && (
          <CoursePanel 
            courses={courses} 
            isAdmin={isAdmin} 
            onPreRegister={async (data) => { 
              const ok = await apiService.request('registerToCourse', { registration: data }); 
              return !!ok;
            }} 
          />
        )}
        {activeTab === 'about' && <AboutUs />}
      </main>

      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 text-[8px] opacity-20 font-bold uppercase tracking-[0.5em] pointer-events-none z-0">
        Elite Ecosistema Digital <span className="text-red-600">{VERSION}</span> | Javier Móttola ®
      </div>

      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} isLoggedIn={!!currentUser} onAdminAccess={() => setShowAdminLogin(true)} onLogout={() => { setCurrentUser(null); setIsAdmin(false); setActiveTab('home'); }} />
      <PrismaAssistant knowledge={PRISMA_DEFAULT_KNOWLEDGE} isAdmin={isAdmin} />
    </div>
  );
};

export default App;
