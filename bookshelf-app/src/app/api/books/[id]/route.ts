import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { initialBooks } from '@/lib/data';
import { Book } from '@/lib/types';

const updateBookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').optional(),
  author: z.string().min(1, 'Autor é obrigatório').optional(),
  genre: z.string().optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  pages: z.number().int().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  synopsis: z.string().optional(),
  cover: z.string().url().optional(),
  current_page: z.number().int().min(0).optional(),
  status: z.enum(['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO']).optional(),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const book = initialBooks.find(b => b.id === id);
    
    if (!book) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error('Erro ao buscar livro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    
    const validatedData = updateBookSchema.parse(body);
    const bookIndex = initialBooks.findIndex(b => b.id === id);
    
    if (bookIndex === -1) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    const updatedBook: Book = {
      ...initialBooks[bookIndex],
      ...validatedData,
    };

    initialBooks[bookIndex] = updatedBook;

    return NextResponse.json(updatedBook);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Erro ao atualizar livro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const bookIndex = initialBooks.findIndex(b => b.id === id);
    
    if (bookIndex === -1) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    const deletedBook = initialBooks.splice(bookIndex, 1)[0];

    return NextResponse.json({
      message: 'Livro removido com sucesso',
      book: deletedBook,
    });
  } catch (error) {
    console.error('Erro ao remover livro:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}