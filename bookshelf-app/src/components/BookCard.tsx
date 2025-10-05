import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import Link from 'next/link';
import { BookWithGenre } from '@/lib/types';

interface BookCardProps {
  book: BookWithGenre;
}

export function BookCard({ book }: BookCardProps) {
  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" | undefined => {
    switch (status) {
      case 'LENDO':
        return 'default';
      case 'LIDO':
        return 'default';
      case 'QUERO_LER':
        return 'secondary';
      case 'PAUSADO':
        return 'outline';
      case 'ABANDONADO':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <Link href={`/books/${book.id}`}>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="flex-shrink-0">
          {book.cover && (
            <div className="relative w-full h-48 mb-4">
              <Image
                src={book.cover}
                alt={book.title}
                fill
                className="rounded-md object-cover"
              />
            </div>
          )}
          <CardTitle className="text-xl line-clamp-2">{book.title}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-1">{book.author}</p>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="flex flex-wrap gap-2 mb-2">
            {book.genre?.name && <Badge variant="outline">{book.genre.name}</Badge>}
            {book.year && <Badge variant="outline">{book.year}</Badge>}
            {book.rating && book.rating > 0 && <Badge variant="outline">{'⭐'.repeat(book.rating)}</Badge>}
          </div>
          <Badge variant={getStatusVariant(book.status)}>{book.status.replace('_', ' ')}</Badge>
          {book.currentPage !== null && book.currentPage !== undefined && book.pages && book.currentPage > 0 && (
            <p className="text-sm text-muted-foreground mt-2">Pág. {book.currentPage} de {book.pages}</p>
          )}
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Atualizado em: {new Date(book.updatedAt).toLocaleDateString()}
        </CardFooter>
      </Card>
    </Link>
  );
}