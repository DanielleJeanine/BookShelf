import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getGenres, createGenre } from '@/lib/database';

const addGenreSchema = z.object({
  name: z.string().min(1, 'Nome do gênero é obrigatório'),
});

export async function GET() {
  try {
    const genres = await getGenres();
    
    return NextResponse.json({
      genres,
      total: genres.length,
    });
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name } = addGenreSchema.parse(body);

    const newGenre = await createGenre(name);

    return NextResponse.json({
      message: 'Gênero adicionado com sucesso',
      genre: newGenre,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        { error: 'Gênero já existe' },
        { status: 409 }
      );
    }

    console.error('Erro ao adicionar gênero:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}