
export enum Gender {
  FEMALE = 'Femenino',
  MALE = 'Masculino'
}

export enum Category {
  NEW_FACE = 'New Face / Sin Experiencia',
  ALUMNO = 'Alumno Actual',
  EGRESADO = 'Egresado Tomauno',
  FREELANCE = 'Freelance',
  AGENCIA = 'Agencia'
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
  agenciaName?: string;
  quals: string[]; // [Pasarela, Fotografía, Actuación, Baile, etc.]
  beauty: boolean;
  staff: boolean;
  isCollaborator: boolean; // Si es parte del grupo de contenido
  foto1: string;
  foto2: string;
  foto3: string;
  composite: string;
  video1: string;
  video2: string;
  portfolioWeb?: string;
  lastUpdate: string;
  postulatedTo: string[];
}

export interface Course {
  id: string;
  titulo: string;
  fecha: string;
  horario: string;
  duracion: string;
  costo: string;
  temario: string;
  img: string;
  location: string;
  active: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  type: 'CASTING' | 'EVENTO' | 'CONSEJO' | 'COLABORACION';
  date: string;
  desc: string;
  img?: string;
  active: boolean;
  applicants: string[]; 
}

export interface FAQ {
  id: string;
  q: string;
  a: string;
}

export interface WallPost {
  id: string;
  nombre: string;
  mensaje: string;
  timestamp: string;
  reactions: Record<string, number>;
  color?: string; // Para varianza visual
}

// Added to fix: Module '"../types"' has no exported member 'PreRegistration'
export interface PreRegistration {
  id: string;
  courseTitle: string;
  nombre: string;
  dni: string;
  wa: string;
  timestamp: string;
  status: string;
}
