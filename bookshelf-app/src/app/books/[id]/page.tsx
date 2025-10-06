import { getBook } from "@/lib/database";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DeleteBookButton } from "@/components/deleteBookButton";

interface BookDetailPageProps {
  params: { id: string };
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = params;
  const book = await getBook(id);

  if (!book) {
    notFound();
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "LENDO":
        return "default";
      case "LIDO":
        return "default";
      case "QUERO_LER":
        return "secondary";
      case "PAUSADO":
        return "outline";
      case "ABANDONADO":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold flex justify-between items-center">
            {book.title}
            <div className="flex gap-2">
              <Link href={`/books/${book.id}/edit`}>
                <Button variant="outline">Editar</Button>
              </Link>
              <DeleteBookButton bookId={book.id} />
            </div>
          </CardTitle>
          <p className="text-lg text-muted-foreground">por {book.author}</p>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            {book.cover && (
              <Image
                src={book.cover}
                alt={book.title}
                width={250}
                height={350}
                className="rounded-md shadow-lg object-cover w-full h-auto"
              />
            )}
          </div>
          <div className="md:col-span-2 space-y-4">
            <p className="text-xl font-semibold">Sinopse:</p>
            <p className="text-muted-foreground">
              {book.synopsis || "Nenhuma sinopse disponível."}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">Gênero:</p>
                <Badge variant="secondary">{book.genre?.name || "N/A"}</Badge>
              </div>
              <div>
                <p className="font-semibold">Ano:</p>
                <p>{book.year || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Páginas:</p>
                <p>{book.pages || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Avaliação:</p>
                <p>
                  {book.rating && book.rating > 0 && (<Badge variant="outline">{"⭐".repeat(book.rating)}</Badge>)}
                </p>
              </div>
              <div>
                <p className="font-semibold">ISBN:</p>
                <p>{book.isbn || "N/A"}</p>
              </div>
              <div>
                <p className="font-semibold">Status de Leitura:</p>
                <Badge variant={getStatusVariant(book.status)}>
                  {book.status.replace("_", " ")}
                </Badge>
              </div>
              {book.currentPage !== null &&
                book.currentPage !== undefined &&
                book.pages &&
                book.currentPage > 0 && (
                  <div>
                    <p className="font-semibold">Progresso:</p>
                    <p>
                      {book.currentPage} de {book.pages} páginas
                    </p>
                  </div>
                )}
            </div>

            {book.notes && (
              <div>
                <p className="text-xl font-semibold mt-4">Notas Pessoais:</p>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {book.notes}
                </p>
              </div>
            )}

            <div className="text-sm text-muted-foreground mt-4">
              <p>Criado em: {new Date(book.createdAt).toLocaleDateString()}</p>
              <p>
                Última atualização:{" "}
                {new Date(book.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
