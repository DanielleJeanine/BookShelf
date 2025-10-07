import { getGenres } from "@/lib/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle, BookOpen } from "lucide-react";
import { GenresTable } from "@/components/genresTable";

export const revalidate = 0;
export const dynamic = "force-dynamic";

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
      </div>
      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <Card>
              <CardHeader>
                <CardTitle>Gêneros Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <GenresTable genres={genres} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
