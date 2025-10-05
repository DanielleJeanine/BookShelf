import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getBooks, createBook, searchBooks, getBooksByGenre, getBooksByStatus } from '@/lib/database';
import { ReadingStatus } from '@/generated/prisma';

const createBookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  author: z.string().min(1, 'Autor é obrigatório'),
  genreId: z.string().optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  pages: z.number().int().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  synopsis: z.string().optional(),
  cover: z.string().url().optional(),
  currentPage: z.number().int().min(0).optional(),
  status: z.enum(['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO']).default('QUERO_LER'),
  isbn: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const title = searchParams.get('title');
    const genreId = searchParams.get('genreId');
    const status = searchParams.get('status');

    let books;

    if (search || title) {
      books = await searchBooks(search || title || '');
    } else if (genreId) {
      books = await getBooksByGenre(genreId);
    } else if (status) {
      books = await getBooksByStatus(status as ReadingStatus);
    } else {
      books = await getBooks();
    }

    return NextResponse.json({
      books,
      total: books.length,
    });
  } catch (error) {
    console.error('Erro ao buscar livros:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const validatedData = createBookSchema.parse(body);

    const newBook = await createBook({
      title: validatedData.title,
      author: validatedData.author,
      genreId: validatedData.genreId,
      year: validatedData.year,
      pages: validatedData.pages,
      rating: validatedData.rating,
      synopsis: validatedData.synopsis,
      cover: validatedData.cover,
      currentPage: validatedData.currentPage,
      status: validatedData.status as ReadingStatus,
      isbn: validatedData.isbn,
      notes: validatedData.notes,
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Erro ao criar livro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}