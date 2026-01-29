
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
  isPublic: boolean;
  foto1: string;
  foto2: string;
  foto3: string;
  composite: string;
  video1: string;
  video2: string;
  lastUpdate?: string;
  postulatedTo?: string[];
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
  urlFlyer: string;
  enabled: boolean;
}

export interface NewsItem {
  id: string;
  type: 'CASTING' | 'EVENTO' | 'NOTICIA';
  date: string;
  title: string;
  desc: string;
  applicants?: string[];
}

/**
 * FAQ interface for frequently asked questions
 * Added to fix the missing export error in FAQSection.tsx
 */
export interface FAQ {
  id: string;
  q: string;
  a: string;
}
