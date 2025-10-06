import { getGenres } from '@/lib/database';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PlusCircle, BookOpen } from 'lucide-react';
import { GenresTable } from '@/components/genresTable';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function GenresPage() {
  const genres = await getGenres();

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8" />
            Gerenciar Gêneros
          </h1>
          <p className="text-muted-foreground mt-2">
            Crie, edite e organize os gêneros literários da sua biblioteca
          </p>
        </div>
        <Link href="/books">
          <Button variant="outline">
            Voltar para Biblioteca
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gêneros Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <GenresTable genres={genres} />
        </CardContent>
      </Card>
    </div>
  );
}