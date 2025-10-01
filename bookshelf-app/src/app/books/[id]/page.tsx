'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { initialBooks } from '@/lib/data';
import { Book } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StarIcon, BookOpenIcon, EditIcon, Trash2Icon, ArrowLeftIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/sonner';

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [book, setBook] = useState<Book | null>(null);

  useEffect(() => {
    if (id) {
      // Futuramente isso virá do banco de dados
      const foundBook = initialBooks.find(b => b.id === id);
      setBook(foundBook || null);
    }
  }, [id]);

  if (!book) {
    return <p className="text-center text-gray-500">Livro não encontrado.</p>;
  }

  const handleDelete = () => {
    const bookIndex = initialBooks.findIndex(b => b.id === book.id);
    if (bookIndex > -1) {
      initialBooks.splice(bookIndex, 1);
      toast({
        title: 'Sucesso!',
        description: `Livro "${book.title}" excluído com sucesso.`, 
      });
      router.push('/books');
    }
  };

  const renderStars = (rating: number | undefined) => {
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
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={() => router.back()} className="mb-4">
        <ArrowLeftIcon className="h-4 w-4 mr-2" /> Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{book.title}</CardTitle>
          <p className="text-lg text-gray-600">por {book.author}</p>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 flex justify-center">
            <div className="relative w-48 h-72 bg-gray-200 flex items-center justify-center overflow-hidden rounded-lg shadow-lg">
              {book.cover ? (
                <Image
                  src={book.cover}
                  alt={`Capa do livro ${book.title}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="rounded-lg"
                />
              ) : (
                <BookOpenIcon className="h-24 w-24 text-gray-400" />
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
              {book.rating && <span className="text-gray-700">({book.rating}/5)</span>}
            </div>
            <p className="text-gray-700">**Ano de Publicação:** {book.year || 'N/A'}</p>
            <p className="text-gray-700">**Total de Páginas:** {book.pages || 'N/A'}</p>
            {book.status === 'LENDO' && book.current_page !== undefined && (
              <p className="text-gray-700">**Página Atual:** {book.current_page} de {book.pages || '?'}</p>
            )}
            <p className="text-gray-700">**Sinopse:** {book.synopsis || 'N/A'}</p>
            {book.notes && <p className="text-gray-700">**Notas Pessoais:** {book.notes}</p>}

            <div className="flex space-x-2 mt-6">
              <Link href={`/books/${book.id}/edit`}>
                <Button><EditIcon className="h-4 w-4 mr-2" /> Editar</Button>
              </Link>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="destructive"><Trash2Icon className="h-4 w-4 mr-2" /> Excluir</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Exclusão</DialogTitle>
                    <DialogDescription>
                      Tem certeza que deseja excluir o livro &quot;{book.title}&quot;? Esta ação não pode ser desfeita.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline">Cancelar</Button>
                    <Button variant="destructive" onClick={handleDelete}>Excluir</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}