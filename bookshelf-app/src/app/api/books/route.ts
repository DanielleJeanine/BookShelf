import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { initialBooks } from '@/lib/data'; 
import { Book } from '@/lib/types';

const createBookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  author: z.string().min(1, 'Autor é obrigatório'),
  genre: z.string().optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  pages: z.number().int().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  synopsis: z.string().optional(),
  cover: z.string().url().optional(),
  current_page: z.number().int().min(0).optional(),
  status: z.enum(['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO']),
  notes: z.string().optional(),
});


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const author = searchParams.get('author');
    const genre = searchParams.get('genre');
    const status = searchParams.get('status');

    let filteredBooks = [...initialBooks];

    if (title) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(title.toLowerCase()) ||
        book.author.toLowerCase().includes(title.toLowerCase()) // Busca por título ou autor
      );
    }

    if (genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === genre);
    }

    if (status) {
      filteredBooks = filteredBooks.filter(book => book.status === status);
    }

    return NextResponse.json({
      books: filteredBooks,
      total: filteredBooks.length,
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

    const newBook: Book = {
      id: uuidv4(),
      ...validatedData,
    };

    initialBooks.push(newBook);

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