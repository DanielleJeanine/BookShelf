import { MockBook } from './types';

export const initialBooks: MockBook[] = [
  {
    id: '1',
    title: 'O Senhor dos Anéis',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasia',
    year: 1954,
    pages: 1200,
    rating: 5,
    synopsis: 'Uma jornada épica para destruir um anel maligno e salvar a Terra Média.',
    cover: 'https://m.media-amazon.com/images/I/71Xl6pR0k9L._UF1000,1000_QL80_.jpg',
    current_page: 800,
    status: 'LENDO',
    notes: 'Muito envolvente, mas longo.'
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    genre: 'Ficção Científica',
    year: 1949,
    pages: 328,
    rating: 4,
    synopsis: 'Um futuro distópico onde o governo controla todos os aspectos da vida.',
    cover: 'https://m.media-amazon.com/images/I/61t0bwt1s3L._UF1000,1000_QL80_.jpg',
    current_page: 0,
    status: 'QUERO_LER',
    notes: 'Clássico da distopia.'
  },
  {
    id: '3',
    title: 'Dom Casmurro',
    author: 'Machado de Assis',
    genre: 'Literatura Brasileira',
    year: 1899,
    pages: 256,
    rating: 5,
    synopsis: 'A história de Bentinho e Capitu, e a dúvida sobre a traição.',
    cover: 'https://m.media-amazon.com/images/I/810IAPcQmoL._UF894,1000_QL80_.jpg',
    current_page: 256,
    status: 'LIDO',
    notes: 'Obra-prima da literatura nacional.'
  },
  {
    id: '4',
    title: 'Sapiens: Uma Breve História da Humanidade',
    author: 'Yuval Noah Harari',
    genre: 'História',
    year: 2011,
    pages: 464,
    rating: 5,
    synopsis: 'Uma exploração da história da humanidade desde a Idade da Pedra até o século XXI.',
    cover: 'https://m.media-amazon.com/images/I/71-ghLb8qML.jpg',
    current_page: 150,
    status: 'PAUSADO',
    notes: 'Muito informativo, mas denso.'
  },
  {
    id: '5',
    title: 'Código Limpo',
    author: 'Robert C. Martin',
    genre: 'Programação',
    year: 2008,
    pages: 464,
    rating: 4,
    synopsis: 'Um guia prático para escrever código limpo e de fácil manutenção.',
    cover: 'https://m.media-amazon.com/images/I/91lBONZ4tAL.jpg',
    current_page: 0,
    status: 'QUERO_LER',
    notes: 'Essencial para todo desenvolvedor.'
  }
];