import {
  getBooks,
  getGenres,
  getReadingStatusOptions,
  searchBooks,
  getBooksByGenre,
  getBooksByStatus,
} from "@/lib/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookCard } from "@/components/BookCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, PlusCircle } from "lucide-react";
import { Suspense } from "react";
import { BooksFilter } from "@/components/booksFilter";
import { BookWithGenre } from "@/lib/types";

interface BooksPageProps {
  searchParams: Promise<{
    search?: string;
    genreId?: string;
    status?: string;
  }>;
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const { search, genreId, status } = await searchParams;

  let books: BookWithGenre[] = [];
  let totalBooks = 0;

  try {
    if (search) {
      books = (await searchBooks(search)) as BookWithGenre[];
    } else if (genreId) {
      books = (await getBooksByGenre(genreId)) as BookWithGenre[];
    } else if (status) {
      books = (await getBooksByStatus(
        status as "QUERO_LER" | "LENDO" | "LIDO" | "PAUSADO" | "ABANDONADO"
      )) as BookWithGenre[];
    } else {
      books = (await getBooks()) as BookWithGenre[];
    }
    totalBooks = books.length;
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
  }

  const genres = await getGenres();
  const readingStatusOptionsRaw = getReadingStatusOptions();
  const readingStatusOptions = readingStatusOptionsRaw.map(
    (status: string) => ({
      value: status,
      label: status,
    })
  );

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Minha Biblioteca</h1>
        <Link href="/add-book">
          <Button className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Adicionar Livro</span>
            <span className="sm:hidden">Adicionar</span>
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div>Carregando filtros...</div>}>
        <BooksFilter
          genres={genres}
          readingStatusOptions={readingStatusOptions}
        />
      </Suspense>

      <div className="mt-8">
        {totalBooks === 0 ? (
          <p className="text-center text-muted-foreground">
            Nenhum livro encontrado com os critérios selecionados.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
