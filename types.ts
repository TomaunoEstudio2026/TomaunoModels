
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
  exp: string; // Experiencia y Anhelos
  cat: Category;
  quals: string[]; // Destrezas
  beauty: boolean;
  staff: boolean;
  isCollaborator: boolean;
  isPublic: boolean;
  foto1: string;
  foto2: string;
  foto3: string;
  composite: string;
  video1: string; // Video Presentación
  video2: string; // Video Pasarela
  lastUpdate?: string;
  postulatedTo?: string[];
}

export interface WallPost {
  id: string;
  dni: string;
  nombre: string;
  mensaje: string;
  timestamp: string;
  color?: string;
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
  title: string;
  desc: string;
  date: string;
  applicants?: string[];
}

export interface FAQ {
  id: string;
  q: string;
  a: string;
}
