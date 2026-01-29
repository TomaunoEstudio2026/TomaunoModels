
export enum Gender {
  FEMALE = 'Femenino',
  MALE = 'Masculino',
  OTHER = 'Otro'
}

export enum Category {
  ALUMNO = 'Alumno Actual Tomauno Models',
  EGRESADO = 'Egresado Tomauno',
  POSTULADOS = 'Postulados ✅',
  STAFF = 'Staff ⭐',
  BEAUTY = 'Beauty Face 💎',
  DESACTUALIZADOS = 'Desactualizados ⚠️',
  NEW_FACE = 'New Face / Sin Experiencia',
  COLABORADOR = 'Modelo Colaborador (Contenido)'
}

export interface Model {
  timestamp: string;
  dni: string;
  nombre: string;
  genero: Gender;
  edad: number;
  altura: string;
  medidas: string;
  ojos: string;
  pelo: string;
  calzado: string;
  localidad: string;
  wa: string;
  waTutor?: string;
  ig: string;
  exp: string;
  cat: Category;
  quals: string[];
  beauty: boolean;
  staff: boolean;
  isCollaborator: boolean;
  foto1: string;
  foto2: string;
  foto3: string;
  composite: string;
  video1: string; // Video Presentación
  video2: string; // Video Pasarela
  lastUpdate: string;
  postulatedTo: string[];
  isSelected?: boolean;
}

export interface WallPost {
  id: string;
  dni: string;
  nombre: string;
  mensaje: string;
  timestamp: string;
}

export interface Course {
  id: string;
  titulo: string;
  fecha: string;
  horario: string;
  costo: string;
  temario: string;
  img: string;
  location: string;
  enabled: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  type: 'CASTING' | 'EVENTO' | 'TIP';
  date: string;
  desc: string;
  img?: string;
  // Fix: Added missing applicants property used in NewsSection component
  applicants?: string[];
}

// Fix: Added missing FAQ interface for FAQSection component
export interface FAQ {
  id: string;
  q: string;
  a: string;
}
