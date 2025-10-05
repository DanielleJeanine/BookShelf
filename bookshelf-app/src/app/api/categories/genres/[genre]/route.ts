import { NextRequest, NextResponse } from 'next/server';
import { deleteGenre, getGenres } from '@/lib/database';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ genre: string }> }
) {
  try {
    const { genre: genreId } = await params;
    
    const decodedGenreId = decodeURIComponent(genreId);
    
    const deletedGenre = await deleteGenre(decodedGenreId);

    return NextResponse.json({
      message: 'Gênero removido com sucesso',
      genre: deletedGenre,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('Record to delete does not exist')) {
      return NextResponse.json(
        { error: 'Gênero não encontrado' },
        { status: 404 }
      );
    }

    if (error instanceof Error && error.message.includes('Foreign key constraint')) {
      return NextResponse.json(
        { error: 'Não é possível remover o gênero pois há livros associados a ele' },
        { status: 409 }
      );
    }

    console.error('Erro ao remover gênero:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}