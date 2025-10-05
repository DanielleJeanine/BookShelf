import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getBook, updateBook, deleteBook } from '@/lib/database';
import { ReadingStatus } from '@/generated/prisma';

const updateBookSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').optional(),
  author: z.string().min(1, 'Autor é obrigatório').optional(),
  genreId: z.string().optional(),
  year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
  pages: z.number().int().min(1).optional(),
  rating: z.number().min(1).max(5).optional(),
  synopsis: z.string().optional(),
  cover: z.string().url().optional(),
  currentPage: z.number().int().min(0).optional(),
  status: z.enum(['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO']).optional(),
  isbn: z.string().optional(),
  notes: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const book = await getBook(id);
    
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const validatedData = updateBookSchema.parse(body);

    const existingBook = await getBook(id);
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    const updatedBook = await updateBook(id, {
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const existingBook = await getBook(id);
    if (!existingBook) {
      return NextResponse.json(
        { error: 'Livro não encontrado' },
        { status: 404 }
      );
    }

    const deletedBook = await deleteBook(id);

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