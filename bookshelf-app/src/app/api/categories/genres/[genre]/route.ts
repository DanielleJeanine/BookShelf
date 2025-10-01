import { NextRequest, NextResponse } from 'next/server';
import { availableGenres } from '@/lib/types'; 

export async function DELETE(
  request: NextRequest,
  { params }: { params: { genre: string } }
) {
  try {
    const { genre } = params;
    
    const decodedGenre = decodeURIComponent(genre);
    
    const genreIndex = availableGenres.findIndex(g => g === decodedGenre);
    
    if (genreIndex === -1) {
      return NextResponse.json(
        { error: 'Gênero não encontrado' },
        { status: 404 }
      );
    }

    const removedGenre = availableGenres.splice(genreIndex, 1)[0];

    return NextResponse.json({
      message: 'Gênero removido com sucesso',
      genre: removedGenre,
      genres: availableGenres,
    });
  } catch (error) {
    console.error('Erro ao remover gênero:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}