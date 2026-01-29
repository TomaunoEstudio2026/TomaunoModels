
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
import { Model, NewsItem, Course, Category, Gender, WallPost } from './types';
import { ADMIN_KEY, PRISMA_DEFAULT_KNOWLEDGE } from './constants';
import { apiService } from './services/apiService';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentUser, setCurrentUser] = useState<Model | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [models, setModels] = useState<Model[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [posts, setPosts] = useState<WallPost[]>([]);

  useEffect(() => {
    const initData = async () => {
      setTimeout(() => setShowSplash(false), 3000);
      const response = await apiService.request('getInitialData');
      if (response) {
        setModels(response.models || []);
        setPosts(response.posts || []);
        setNews([{
          id: 'news-1',
          title: 'Casting: Cierre de Temporada',
          type: 'CASTING',
          date: '25 Mayo',
          desc: response.news || "Buscamos perfiles para desfile de gala.",
          active: true,
          applicants: []
        }, {
          id: 'colab-1',
          title: 'Únete al Equipo de Contenido',
          type: 'COLABORACION',
          date: 'Abierto',
          desc: 'Si te gusta crear Reels y organizar producciones, postúlate para ser Colaborador Tomauno.',
          active: true,
          applicants: []
        }]);
      }
    };
    initData();
  }, []);

  const handleLogin = (dni: string) => {
    const existing = models.find(m => m.dni === dni);
    if (existing) {
      setCurrentUser(existing);
      setActiveTab('profile');
    } else {
      const newUser: Model = {
        timestamp: new Date().toISOString(), dni, nombre: '', genero: Gender.FEMALE, edad: 0, altura: '', medidas: '', ojos: '', pelo: '', calzado: '', localidad: 'Posadas', wa: '', ig: '', exp: '', cat: Category.NEW_FACE, quals: [], beauty: false, staff: false, isCollaborator: false, foto1: '', foto2: '', foto3: '', composite: '', video1: '', video2: '', lastUpdate: new Date().toISOString(), postulatedTo: []
      };
      setCurrentUser(newUser);
      setActiveTab('profile');
    }
  };

  const handleAdminAccess = () => {
    const pass = prompt('ACCESO DIRECTOR TOMAUNO MODELS (Clave):');
    if (pass === 'cirrus') {
      setIsAdmin(true);
      setActiveTab('admin');
    } else if (pass !== null) {
      alert('Clave incorrecta.');
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-black text-white selection:bg-red-600">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl animate-fade">
        {activeTab === 'home' && !currentUser && (
           <Login onLogin={handleLogin} onAdminAccess={handleAdminAccess} />
        )}
        
        {activeTab === 'profile' && currentUser && (
           <ModelProfile 
             model={currentUser} 
             onSave={async (m) => {
               setModels(prev => [...prev.filter(x => x.dni !== m.dni), m]);
               setCurrentUser(m);
               await apiService.request('saveModel', { model: m });
             }} 
             onDelete={async (dni) => {
               if(confirm('¿Eliminar todos tus datos?')) {
                 await apiService.request('deleteModel', { dni });
                 setCurrentUser(null);
                 setActiveTab('home');
               }
             }}
             onLogout={() => { setCurrentUser(null); setActiveTab('home'); }} 
             onClose={() => setActiveTab('home')}
           />
        )}

        {activeTab === 'admin' && isAdmin && (
           <AdminPanel 
             models={models} news={news}
             onUpdateModels={setModels}
             onEditModel={(dni) => {
                const m = models.find(x => x.dni === dni);
                if (m) { setCurrentUser(m); setActiveTab('profile'); }
             }}
           />
        )}

        {activeTab === 'wall' && (
           <CommunityWall 
             posts={posts} currentUser={currentUser} isAdmin={isAdmin} 
             onPost={async (msg) => {
                const newPost = { id: Date.now().toString(), nombre: currentUser?.nombre || 'Talento', mensaje: msg, timestamp: new Date().toISOString(), reactions: {} };
                setPosts(prev => [newPost, ...prev]);
                await apiService.request('addMuroPost', { dni: currentUser?.dni, nombre: currentUser?.nombre, txt: msg });
             }} 
             onDeletePost={() => {}} 
           />
        )}

        {activeTab === 'news' && <NewsSection news={news} currentUser={currentUser} isAdmin={isAdmin} onPostulate={()=>{}} />}
        {activeTab === 'courses' && <CoursePanel courses={[]} isAdmin={isAdmin} onPreRegister={()=>{}} />}
        {activeTab === 'about' && <AboutUs />}
        {activeTab === 'faq' && <FAQSection faqs={[{id:'1', q: '¿Cómo actualizo mis fotos?', a: 'Ingresa con tu DNI y en la sección Multimedia pega los links de tus fotos subidas a Google Drive.'}]} />}
      </main>

      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} isAdmin={isAdmin} isLoggedIn={!!currentUser} onAdminAccess={handleAdminAccess} onLogout={() => { setCurrentUser(null); setIsAdmin(false); setActiveTab('home'); }} />
      <PrismaAssistant knowledge={PRISMA_DEFAULT_KNOWLEDGE} />
    </div>
  );
};

export default App;
