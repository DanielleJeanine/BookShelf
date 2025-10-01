import Link from 'next/link';
import Image from 'next/image';
import { Book } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StarIcon, BookOpenIcon, Trash2Icon, EditIcon } from 'lucide-react';

interface BookCardProps {
  book: Book;
}

export function BookCard({ book }: BookCardProps) {
  const renderStars = (rating: number | undefined) => {
    if (!rating) return null;
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${i < rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="relative p-0">
        <div className="relative w-full h-48 bg-gray-200 flex items-center justify-center overflow-hidden rounded-t-lg">
          {book.cover ? (
            <Image
              src={book.cover}
              alt={`Capa do livro ${book.title}`}
              fill
              style={{ objectFit: 'cover' }}
              className="rounded-t-lg"
            />
          ) : (
            <BookOpenIcon className="h-16 w-16 text-gray-400" />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-bold mb-1 line-clamp-2">{book.title}</CardTitle>
        <CardDescription className="text-sm text-gray-600 mb-2">{book.author}</CardDescription>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          {book.year && <span>{book.year}</span>}
          {renderStars(book.rating)}
        </div>
        {book.genre && <Badge variant="secondary" className="mb-2">{book.genre}</Badge>}
        <p className="text-sm text-gray-700 line-clamp-3">{book.synopsis}</p>
      </CardContent>
      <CardFooter className="p-4 border-t flex justify-end space-x-2">
        <Link href={`/books/${book.id}`}>
          <Button variant="outline" size="sm">Visualizar</Button>
        </Link>
        <Link href={`/books/${book.id}/edit`}>
          <Button variant="outline" size="sm"><EditIcon className="h-4 w-4 mr-2" />Editar</Button>
        </Link>
        <Button variant="destructive" size="sm"><Trash2Icon className="h-4 w-4 mr-2" />Excluir</Button>
      </CardFooter>
    </Card>
  );
}