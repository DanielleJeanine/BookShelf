import { prisma } from './prisma';
import { Book, Genre, ReadingStatus } from '@/generated/prisma/client';


export interface CreateBookData {
  title: string;
  author: string;
  genreId?: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
  currentPage?: number;
  status?: ReadingStatus;
  isbn?: string;
  notes?: string;
}

export interface UpdateBookData {
  title?: string;
  author?: string;
  genreId?: string;
  year?: number;
  pages?: number;
  rating?: number;
  synopsis?: string;
  cover?: string;
  currentPage?: number;
  status?: ReadingStatus;
  isbn?: string;
  notes?: string;
}


export async function getBooks() {
  try {
    return await prisma.book.findMany({
      include: {
        genre: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw new Error('Falha ao buscar livros');
  }
}

export async function getBook(id: string) {
  try {
    return await prisma.book.findUnique({
      where: { id },
      include: {
        genre: true,
      },
    });
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    throw new Error('Falha ao buscar livro');
  }
}

export async function createBook(data: CreateBookData) {
  try {
    return await prisma.book.create({
      data,
      include: {
        genre: true,
      },
    });
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    throw new Error('Falha ao criar livro');
  }
}

export async function updateBook(id: string, data: UpdateBookData) {
  try {
    return await prisma.book.update({
      where: { id },
      data,
      include: {
        genre: true,
      },
    });
  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    throw new Error('Falha ao atualizar livro');
  }
}

export async function deleteBook(id: string) {
  try {
    return await prisma.book.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Erro ao deletar livro:', error);
    throw new Error('Falha ao deletar livro');
  }
}

export async function getGenres() {
  try {
    return await prisma.genre.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar gêneros:', error);
    throw new Error('Falha ao buscar gêneros');
  }
}


export async function createGenre(name: string) {
  try {
    return await prisma.genre.create({
      data: { name },
    });
  } catch (error) {
    console.error('Erro ao criar gênero:', error);
    throw new Error('Falha ao criar gênero');
  }
}

export async function updateGenre(id: string, name: string) {
  try {
    return await prisma.genre.update({
      where: { id },
      data: { name },
    });
  } catch (error) {
    console.error('Erro ao atualizar gênero:', error);
    throw new Error('Falha ao atualizar gênero');
  }
}

export async function getGenre(id: string) {
  try {
    return await prisma.genre.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Erro ao buscar gênero:', error);
    throw new Error('Falha ao buscar gênero');
  }
}

export async function deleteGenre(id: string) {
  try {
    return await prisma.genre.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Erro ao deletar gênero:', error);
    throw new Error('Falha ao deletar gênero');
  }
}

export function getReadingStatusOptions(): ReadingStatus[] {
  return ['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'];
}


export async function searchBooks(query: string) {
  try {
    return await prisma.book.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            author: {
              contains: query,
            },
          },
        ],
      },
      include: {
        genre: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    throw new Error('Falha ao buscar livros');
  }
}

export async function getBooksByGenre(genreId: string) {
  try {
    return await prisma.book.findMany({
      where: { genreId },
      include: {
        genre: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar livros por gênero:', error);
    throw new Error('Falha ao buscar livros por gênero');
  }
}

export async function getBooksByStatus(status: ReadingStatus) {
  try {
    return await prisma.book.findMany({
      where: { status },
      include: {
        genre: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Erro ao buscar livros por status:', error);
    throw new Error('Falha ao buscar livros por status');
  }
}

export async function getDashboardStats() {
  try {
    // Busca todos os livros do banco de dados
    const books = await prisma.book.findMany({
      include: {
        genre: true,
      },
    });

    // Calcula as estatísticas
    const stats = {
      totalBooks: books.length,
      readingBooks: books.filter(book => book.status === 'LENDO').length,
      finishedBooks: books.filter(book => book.status === 'LIDO').length,
      totalPagesRead: books.reduce((sum, book) => {
        if (book.status === 'LIDO' && book.pages) {
          return sum + book.pages;
        }
        if (book.status === 'LENDO' && book.currentPage) {
          return sum + book.currentPage;
        }
        return sum;
      }, 0),
    };

    return stats;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw new Error('Falha ao buscar estatísticas do dashboard');
  }
}