
import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';
import { ModelProfile } from './components/ModelProfile';
import { AdminPanel } from './components/AdminPanel';
import { CommunityWall } from './components/CommunityWall';
import { CoursePanel } from './components/CoursePanel';
import { FAQSection } from './components/FAQSection';
import { PrismaAssistant } from './components/PrismaAssistant';
import { AboutUs } from './components/AboutUs';
import { NewsSection } from './components/NewsSection';
import { ModelPortfolioView } from './components/ModelPortfolioView';
import { Model, WallPost, Course, Category, Gender } from './types';
import { ADMIN_KEY, PRISMA_DEFAULT_KNOWLEDGE } from './constants';
import { apiService } from './apiService';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<Model | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [models, setModels] = useState<Model[]>([]);
  const [posts, setPosts] = useState<WallPost[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [visitors, setVisitors] = useState(0);
  const [prismaKnowledge, setPrismaKnowledge] = useState(PRISMA_DEFAULT_KNOWLEDGE);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [viewingPortfolioDni, setViewingPortfolioDni] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await apiService.request('getInitialData');
      if (data && data.success) {
        setModels(data.models || []);
        setPosts(data.muro || []);
        setVisitors(data.visitors || 0);
        if (data.prismaMemory) setPrismaKnowledge(data.prismaMemory);
        
        const manualCourses: Course[] = [
          {
            id: 'cursomodelo1',
            titulo: 'Modelaje Profesional Elite 2026',
            fecha: 'Abril a Diciembre',
            horario: 'Sábados (Elegir Turno)',
            costo: 'Consultar WhatsApp',
            temario: `PROGRAMA INTEGRAL:
            • Módulo 1: Pasarela Internacional y Postura.
            • Módulo 2: Fotografía de Moda y Posing.
            • Módulo 3: Automaquillaje y Estética.
            • Módulo 4: Oratoria y Marca Personal.
            • Módulo 5: Nutrición y Salud Integral.
            
            REQUISITOS: Ganas de aprender y compromiso profesional.
            INCLUYE: Certificación final y participación en desfiles exclusivos de Tomauno Models.`,
            urlFlyer: 'https://lh3.googleusercontent.com/d/1Za8YozirGOYmgC5zR7hs_r2vvcUQBzXe',
            enabled: true
          }
        ];
        setCourses(manualCourses);
      }
    } catch (e) {
      console.error("Error loading data:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    setActiveTab('home');
  };

  const handleLogin = (dni: string) => {
    const existing = models.find(m => String(m.dni) === String(dni));
    if (existing) {
      setCurrentUser(existing);
    } else {
      setCurrentUser({ 
        timestamp: new Date().toISOString(), 
        dni, 
        nombre: '', 
        genero: Gender.FEMALE, 
        edad: 0, 
        altura: '', 
        medidas: '', 
        ojos: '', 
        pelo: '', 
        calzado: '', 
        localidad: 'Posadas', 
        wa: '', 
        ig: '', 
        waTutor: '', 
        exp: '', 
        cat: Category.NEW_FACE, 
        quals: [], 
        beauty: false, 
        staff: false, 
        isCollaborator: false, 
        isPublic: false, 
        foto1: '', 
        foto2: '', 
        foto3: '', 
        composite: '', 
        video1: '', 
        video2: '', 
        postulatedTo: [] 
      });
    }
    setActiveTab('profile');
  };

  return (
    <div className="min-h-screen pb-32 bg-black text-white selection:bg-red-600">
      <Header visitors={visitors} />
      {showSplash && <SplashScreen />}
      
      {viewingPortfolioDni && (
        <ModelPortfolioView 
          model={models.find(m => String(m.dni) === String(viewingPortfolioDni))!} 
          onClose={() => setViewingPortfolioDni(null)} 
        />
      )}

      {showAdminLogin && (
        <div className="fixed inset-0 z-[20000] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl">
           <div className="glass p-12 rounded-[60px] border-red-600/30 w-full max-w-sm text-center space-y-10 animate-fade shadow-[0_0_80px_rgba(255,0,0,0.2)]">
              <h3 className="font-luxury text-3xl uppercase tracking-widest">Elite <span className="text-red-600 font-bold">Admin</span></h3>
              <input 
                type="password" autoFocus 
                value={adminPass} 
                onChange={e => setAdminPass(e.target.value)} 
                onKeyDown={e => e.key === 'Enter' && (adminPass === ADMIN_KEY ? (setIsAdmin(true), setShowAdminLogin(false), setActiveTab('admin')) : alert('Clave Incorrecta'))}
                placeholder="PASSWORD" 
                className="w-full bg-black/50 border-2 border-zinc-900 rounded-full px-8 py-6 text-center text-white focus:border-red-600 outline-none text-xl font-bold tracking-[0.5em]" 
              />
              <button onClick={() => adminPass === ADMIN_KEY ? (setIsAdmin(true), setShowAdminLogin(false), setActiveTab('admin')) : alert('Error')} className="w-full bg-red-600 py-6 rounded-full font-black uppercase text-white shadow-2xl active:scale-95 transition-all text-sm tracking-widest">Acceder al Control</button>
              <button onClick={() => setShowAdminLogin(false)} className="text-[10px] uppercase font-black text-zinc-600 hover:text-white transition-colors">Volver</button>
           </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8 max-w-7xl animate-fade">
        {activeTab === 'home' && (
          <div className="space-y-12">
             <div className="text-center space-y-4 py-12">
                <h2 className="font-luxury text-5xl md:text-7xl uppercase tracking-tighter">Bienvenido a la <br/><span className="text-red-600 italic">Elite</span></h2>
                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.6em]">Gestión Profesional de Modelos & Talentos</p>
             </div>
             {!currentUser && <Login onLogin={handleLogin} onAdminAccess={() => setShowAdminLogin(true)} />}
             <NewsSection news={[]} currentUser={currentUser} isAdmin={isAdmin} onPostulate={async (id) => {
               const res = await apiService.request('postulate', { dni: currentUser?.dni, id });
               if(res) { await fetchData(); alert('¡Postulación Exitosa!'); }
             }} />
          </div>
        )}
        
        {activeTab === 'profile' && currentUser && (
           <ModelProfile 
              model={currentUser} 
              isRegistered={models.some(m => String(m.dni) === String(currentUser.dni))} 
              onSave={async (m) => { 
                const res = await apiService.request('saveModel', { data: m }); 
                if(res) { 
                  // Actualización local inmediata para evitar pérdida de datos
                  setModels(prev => prev.map(old => old.dni === m.dni ? m : old));
                  setCurrentUser(m);
                  await fetchData(); 
                  return true; 
                } 
                return false; 
              }} 
              onDelete={async (dni) => { 
                if(confirm('¿Confirmas la baja de este registro?')) {
                  await apiService.request('deleteModel', { dni });
                  handleLogout();
                  await fetchData();
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
            onEditModel={(dni) => { const m = models.find(x => String(x.dni) === String(dni)); if (m) { setCurrentUser(m); setActiveTab('profile'); } }}
            onViewPortfolio={setViewingPortfolioDni}
            onLogout={handleLogout} 
            onToggleFlag={async (dni, field, val) => { 
               setModels(prev => prev.map(m => String(m.dni) === String(dni) ? { ...m, [field]: !val } : m));
               const colMap: Record<string, number> = { staff: 24, beauty: 18, isPublic: 26 };
               const col = colMap[field] || 24;
               await apiService.request('updateAdminToggle', { dni, col, currentVal: val }); 
            }} 
            onDeleteModel={async (dni) => { 
              if(confirm('¿Borrar este modelo definitivamente?')) {
                await apiService.request('deleteModel', { dni }); 
                await fetchData(); 
              }
            }} 
          />
        )}

        {activeTab === 'wall' && (
          <CommunityWall 
            posts={posts} 
            currentUser={currentUser} 
            isAdmin={isAdmin} 
            models={models}
            onPost={async (msg) => { 
              await apiService.request('addMuroPost', { dni: currentUser?.dni || 'Staff', nombre: currentUser?.nombre || 'Javier', txt: msg }); 
              await fetchData(); 
            }} 
            onDeletePost={async (id) => { 
              if(confirm('¿Borrar mensaje del muro?')) {
                await apiService.request('deleteMuroPost', { id }); 
                await fetchData(); 
              }
            }} 
          />
        )}
        
        {activeTab === 'courses' && (
          <CoursePanel 
            courses={courses} 
            isAdmin={isAdmin} 
            onPreRegister={async (d) => { 
              const res = await apiService.request('preRegister', { reg: d }); 
              if(res) { alert('¡Pre-Inscripción Exitosa! Nos contactaremos pronto.'); await fetchData(); }
              return true; 
            }} 
          />
        )}
        
        {activeTab === 'faq' && <FAQSection isAdmin={isAdmin} />}
        {activeTab === 'about' && <AboutUs />}
      </main>

      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} isLoggedIn={!!currentUser} onAdminAccess={() => setShowAdminLogin(true)} onLogout={handleLogout} />
      
      <PrismaAssistant 
        knowledge={prismaKnowledge} 
        isAdmin={isAdmin} 
        onSaveKnowledge={async (txt) => { 
          const ok = await apiService.request('saveGlobalNews', { txt }); 
          if(ok) { alert('Memoria Inyectada'); await fetchData(); }
        }} 
      />
    </div>
  );
};

export default App;
