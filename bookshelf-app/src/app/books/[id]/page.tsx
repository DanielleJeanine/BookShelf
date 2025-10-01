// src/app/books/[id]/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarIcon, BookOpenIcon, EditIcon, ArrowLeftIcon } from 'lucide-react';
import { DeleteBookButton } from '@/components/deleteBookButton'; // Client Component para o botão de exclusão
import { Book } from '@/lib/types';

interface BookDetailPageProps {
  params: {
    id: string;
  };
}

async function getBook(id: string) {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';
  
  try {
    const response = await fetch(`${baseUrl}/api/books/${id}`, {
      cache: 'no-store', 
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Falha ao buscar livro');
    }
    
    return await response.json() as Book;
  } catch (error) {
    console.error('Erro ao buscar livro da API:', error);
    const { initialBooks } = await import('@/lib/data');
    return initialBooks.find(book => book.id === id) || null;
  }
}

function renderStars(rating: number | undefined) {
  if (!rating) return null;
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <StarIcon
          key={i}
          className={`h-5 w-5 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const book = await getBook(params.id);

  if (!book) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/books">
        <Button variant="outline" className="mb-4">
          <ArrowLeftIcon className="h-4 w-4 mr-2" /> Voltar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{book.title}</CardTitle>
          <p className="text-lg text-muted-foreground">por {book.author}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex justify-center">
            <div className="relative w-48 h-72 bg-muted flex items-center justify-center overflow-hidden rounded-lg shadow-lg">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={`Capa do livro ${book.title}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              ) : (
                <BookOpenIcon className="h-24 w-24 text-muted-foreground" />
              )}
            </div>
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-2">
              {book.genre && <Badge>{book.genre}</Badge>}
              <Badge variant="secondary">{book.status.replace('_', ' ')}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              {renderStars(book.rating)}
              {book.rating && <span className="text-muted-foreground">({book.rating}/5)</span>}
            </div>
            <div className="space-y-2">
              <p><strong>Ano de Publicação:</strong> {book.year || 'N/A'}</p>
              <p><strong>Total de Páginas:</strong> {book.pages || 'N/A'}</p>
              {book.status === 'LENDO' && book.current_page !== undefined && (
                <p><strong>Página Atual:</strong> {book.current_page} de {book.pages || '?'}</p>
              )}
              <p><strong>Sinopse:</strong> {book.synopsis || 'N/A'}</p>
              {book.notes && <p><strong>Notas Pessoais:</strong> {book.notes}</p>}
            </div>

            <div className="flex space-x-2 mt-6">
              <Link href={`/books/${book.id}/edit`}>
                <Button><EditIcon className="h-4 w-4 mr-2" /> Editar</Button>
              </Link>
              <DeleteBookButton bookId={book.id} bookTitle={book.title} /> {/* Client Component */}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}