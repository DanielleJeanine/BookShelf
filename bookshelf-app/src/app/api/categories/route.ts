// src/app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { availableGenres } from '@/lib/types';

const addGenreSchema = z.object({
  genre: z.string().min(1, 'Nome do gênero é obrigatório'),
});

export async function GET() {
  try {
    return NextResponse.json({
      genres: availableGenres,
      total: availableGenres.length,
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
    
    const { genre } = addGenreSchema.parse(body);

    if (availableGenres.includes(genre)) {
      return NextResponse.json(
        { error: 'Gênero já existe' },
        { status: 409 }
      );
    }

    availableGenres.push(genre);

    return NextResponse.json({
      message: 'Gênero adicionado com sucesso',
      genre,
      genres: availableGenres,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Erro ao adicionar gênero:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}