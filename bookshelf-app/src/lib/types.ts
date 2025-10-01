export type ReadingStatus = 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO';

export type Book = {
  id: string;
  title: string;
  author: string;
  genre?: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
  current_page?: number;
  status: ReadingStatus;
  notes?: string;
};

export const availableGenres = [
  'Literatura Brasileira', 'Ficção Científica', 'Realismo Mágico', 'Ficção',
  'Fantasia', 'Romance', 'Biografia', 'História', 'Autoajuda', 'Tecnologia',
  'Programação', 'Negócios', 'Psicologia', 'Filosofia', 'Poesia'
];