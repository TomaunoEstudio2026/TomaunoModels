
import React, { useState, useEffect } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { Login } from './components/Login';
import { Header } from './components/Header';
import { NavBar } from './components/NavBar';
import { ModelProfile } from './components/ModelProfile';
import { AdminPanel } from './components/AdminPanel';
import { CommunityWall } from './components/CommunityWall';
import { CoursePanel } from './components/CoursePanel';
import { NewsSection } from './components/NewsSection';
import { PrismaAssistant } from './components/PrismaAssistant';
import { FAQSection } from './components/FAQSection';
import { AboutUs } from './components/AboutUs';
import { Model, NewsItem, Course, Category, Gender } from './types';
import { ADMIN_KEY } from './constants';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<Model | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [models, setModels] = useState<Model[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [visitors, setVisitors] = useState(1250);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    
    // Contador de tráfico (Simulado con localStorage)
    const hits = localStorage.getItem('t1_hits');
    const newHits = hits ? parseInt(hits) + 1 : 1250;
    localStorage.setItem('t1_hits', newHits.toString());
    setVisitors(newHits);

    setNews([
      { id: 'n1', title: 'Casting Fashion Show 2026', type: 'CASTING', date: '2026-05-25', desc: 'Buscamos 20 perfiles frescos para el cierre de temporada.', active: true, applicants: [] },
      { id: 'n2', title: 'Workshop Acting', type: 'EVENTO', date: '2026-06-12', desc: 'Expresión corporal avanzada frente a cámara.', active: true, applicants: [] },
      { id: 'n3', title: 'Tip: Fotos Polaroid', type: 'CONSEJO', date: 'Hoy', desc: 'Recuerda usar ropa neutra y luz natural para tus polas.', active: true, applicants: [] }
    ]);
    
    setCourses([{
      id: 'c5',
      titulo: 'Modelaje & Fotografía – 5ta Edición',
      fecha: '7 de Marzo',
      horario: 'Sábados 9 a 12hs',
      duracion: '4 meses',
      costo: 'Alias: tomauno.belo',
      temario: 'Un curso pensado para principiantes que quieren profesionalizarse. Incluye pasarela, fotografía, marketing y automaquillaje.',
      img: 'https://picsum.photos/seed/tomaunocourse/800/500',
      location: 'Estudio TOMAUNO',
      active: true
    }]);

    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (dni: string) => {
    const user = models.find(m => m.dni === dni);
    if (user) {
      setCurrentUser(user);
    } else {
      const newUser: Model = {
        timestamp: new Date().toISOString(),
        dni, nombre: '', edad: 0, altura: '', medidas: '', localidad: 'Posadas', 
        wa: '', waTutor: '', ig: '', exp: '', cat: Category.NEW_FACE, quals: [], 
        beauty: false, staff: false, foto1: '', foto2: '', foto3: '', composite: '', 
        video1: '', video2: '', lastUpdate: new Date().toISOString(), postulatedTo: [], 
        genero: Gender.FEMALE, ojos: '', pelo: '', calzado: '', portfolioWeb: ''
      };
      setCurrentUser(newUser);
    }
    setActiveTab('profile');
  };

  const handleAdminAccess = () => {
    const pass = prompt('ACCESO DIRECTOR TOMAUNO MODELS (Clave):');
    if (pass === ADMIN_KEY) {
      setIsAdmin(true);
      setActiveTab('admin');
    } else if (pass !== null) {
      alert('Clave incorrecta. Acceso denegado.');
    }
  };

  const onEditFromAdmin = (dni: string) => {
    const user = models.find(m => m.dni === dni);
    if (user) {
      setCurrentUser(user);
      setActiveTab('profile');
    }
  };

  if (showSplash) return <SplashScreen />;

  return (
    <div className="min-h-screen pb-24 bg-black text-white selection:bg-red-600">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl animate-fade">
        {activeTab === 'home' && !currentUser && (
           <Login 
             onLogin={handleLogin} 
             onAdminAccess={handleAdminAccess} 
           />
        )}
        
        {activeTab === 'profile' && currentUser && (
           <ModelProfile 
             model={currentUser} 
             onSave={(m) => { 
                setModels(prev => [...prev.filter(old=>old.dni!==m.dni), m]); 
                setCurrentUser(m); 
             }} 
             onLogout={() => { setCurrentUser(null); setActiveTab('home'); }} 
             onClose={() => setActiveTab('home')}
           />
        )}

        {activeTab === 'admin' && isAdmin && (
           <AdminPanel 
             models={models} 
             news={news} 
             onUpdateModels={setModels} 
             onUpdateNews={setNews} 
             onEditModel={onEditFromAdmin}
           />
        )}

        {activeTab === 'wall' && (
           <CommunityWall 
             posts={[]} // Implementar persistencia de posts
             currentUser={currentUser} 
             isAdmin={isAdmin} 
             onPost={() => {}} 
             onDeletePost={() => {}} 
           />
        )}

        {activeTab === 'courses' && <CoursePanel courses={courses} isAdmin={isAdmin} />}
        {activeTab === 'news' && <NewsSection news={news} currentUser={currentUser} isAdmin={isAdmin} />}
        {activeTab === 'faq' && <FAQSection />}
        {activeTab === 'about' && <AboutUs />}
      </main>

      <NavBar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdmin={isAdmin} 
        isLoggedIn={!!currentUser} 
        onLogout={() => { setCurrentUser(null); setIsAdmin(false); setActiveTab('home'); }} 
      />
      
      <PrismaAssistant knowledge="La academia es líder en Posadas. Javier es fotógrafo, Lucrecia es instructora de pasarela." />
      
      <footer className="no-print py-10 text-center text-[10px] text-zinc-600 uppercase tracking-[0.4em] font-bold">
        <p className="mb-2">Nº de Visitantes: <span className="text-[#990000]">{visitors}</span></p>
        <p>Tomauno Models Ecosystem 2026 • © Javier Móttola ®</p>
      </footer>
    </div>
  );
};

export default App;
