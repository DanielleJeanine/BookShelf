export type { Book, Genre, ReadingStatus } from '@/generated/prisma/client';

export type BookWithGenre = {
  id: string;
  title: string;
  author: string;
  genre: {
    id: string;
    name: string;
  } | null;
  genreId: string | null;
  year: number | null;
  pages: number | null;
  rating: number | null;
  synopsis: string | null;
  cover: string | null;
  currentPage: number | null;
  status: 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';
  isbn: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const availableGenres = [
  'Literatura Brasileira', 'Ficção Científica', 'Realismo Mágico', 'Ficção',
  'Fantasia', 'Romance', 'Biografia', 'História', 'Autoajuda', 'Tecnologia',
  'Programação', 'Negócios', 'Psicologia', 'Filosofia', 'Poesia'
];

export interface BookFormData {
  title: string;
  author: string;
  genreId?: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
  currentPage?: number;
  status: 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';
  isbn?: string;
  notes?: string;
}

export const readingStatusOptions = [
  { value: 'QUERO_LER', label: 'Quero Ler' },
  { value: 'LENDO', label: 'Lendo' },
  { value: 'LIDO', label: 'Lido' },
  { value: 'PAUSADO', label: 'Pausado' },
  { value: 'ABANDONADO', label: 'Abandonado' },
] as const;