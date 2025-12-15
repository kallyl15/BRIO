
export interface Habit {
  id: string;
  title: string;
  color: string; // Código Hex da cor do marca-texto
  completed: Record<number, number>; // Mudança: Dia (key) -> Valor (0.5 ou 1)
}

// Interface antiga para migração, se necessário
export interface LegacyHabit {
  id: string;
  title: string;
  color: string;
  completedDays: number[];
}

export interface MoodEntry {
  day: number;
  value: number | null; // 3 (Feliz/Bom), 2 (Neutro), 1 (Triste/Ruim) ou null
}

export type JournalEntries = Record<number, string>; // Dia -> Texto do diário

// Mapeia: Dia -> Categoria -> Valor (1, 2 ou 3)
export type CheckInRecord = Record<number, Record<string, number>>;

export interface BrainDumpItem {
  id: string;
  text: string;
  isDone: boolean;
}

export interface GratitudeItem {
  id: string;
  text: string;
  date: string; // ISO Date
}

// Novo tipo para Post-its manuais
export interface StickyNoteData {
  id: string;
  text: string;
  color: string; // 'yellow', 'pink', 'blue', 'green'
  rotation: number;
}

// --- USER PROFILE ---
export interface UserProfile {
  name: string;
  bio: string; // Lema ou frase
  joinDate: string;
  avatarSeed: string; // Para gerar avatar ou url
  bestStreak: number; // Recorde de Ofensiva (dias consecutivos com tudo completo)
}

export const MONTH_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

export const CHECKIN_CATEGORIES = [
  { id: 'sleep', label: 'Qualidade do Sono' },
  { id: 'energy', label: 'Nível de Energia' },
  { id: 'food', label: 'Alimentação' },
  { id: 'focus', label: 'Foco / Produtividade' },
  { id: 'social', label: 'Interação Social' },
  { id: 'stress', label: 'Nível de Estresse', note: '(Baixo é bom)' },
];

// Paleta de cores estilo marca-texto
export const HIGHLIGHTER_COLORS = [
  '#dbfbc4', // Verde Pastel
  '#74b9ff', // Azul Suave
  '#ffeaa7', // Amarelo Pastel
  '#fab1a0', // Vermelho Suave
  '#a29bfe', // Roxo Suave
  '#fd79a8', // Rosa Suave
  '#81ecec', // Ciano Suave
];

// Dados iniciais padrão
export const DEFAULT_HABITS: Habit[] = [
  {
    id: '1',
    title: 'Yoga Matinal',
    color: '#dbfbc4', 
    completed: {},
  },
  {
    id: '2',
    title: 'Beber 2L Água',
    color: '#74b9ff', 
    completed: {},
  },
  {
    id: '3',
    title: 'Ler 30 min',
    color: '#ffeaa7', 
    completed: {},
  }
];

// Gera dados de humor vazios para iniciar o mês
export const INITIAL_MOOD_DATA: MoodEntry[] = MONTH_DAYS.map(day => ({
  day,
  value: null
}));