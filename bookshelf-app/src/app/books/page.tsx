// src/app/books/page.tsx
import { Suspense } from 'react';
import { BookCard } from '@/components/bookCard';
import { BooksFilter } from '@/components/booksFilter'; // Componente cliente para filtros
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';
import { Book } from '@/lib/types';

interface BooksPageProps {
  searchParams: {
    search?: string;
    genre?: string;
    status?: string;
  };
}

async function getBooks(searchParams: BooksPageProps['searchParams']) {
  const baseUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-domain.com' 
    : 'http://localhost:3000';
  
  const params = new URLSearchParams();
  if (searchParams.search) {
    params.append('title', searchParams.search);
   
  }
  if (searchParams.genre) params.append('genre', searchParams.genre);
  if (searchParams.status) params.append('status', searchParams.status);

  try {
    const response = await fetch(`${baseUrl}/api/books?${params.toString()}`, {
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar livros');
    }
    
    const data = await response.json();
    return data.books as Book[];
  } catch (error) {
    console.error('Erro ao buscar livros da API:', error);
    // Fallback para dados locais em caso de erro ou desenvolvimento
    const { initialBooks } = await import('@/lib/data');
    let filteredBooks = [...initialBooks];

    if (searchParams.search) {
      filteredBooks = filteredBooks.filter(book =>
        book.title.toLowerCase().includes(searchParams.search!.toLowerCase()) ||
        book.author.toLowerCase().includes(searchParams.search!.toLowerCase())
      );
    }

    if (searchParams.genre) {
      filteredBooks = filteredBooks.filter(book => book.genre === searchParams.genre);
    }

    if (searchParams.status) {
      filteredBooks = filteredBooks.filter(book => book.status === searchParams.status);
    }

    return filteredBooks;
  }
}

export default async function BooksPage({ searchParams }: BooksPageProps) {
  const books = await getBooks(searchParams);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Minha Biblioteca</h1>
        <Link href="/add-book">
          <Button><PlusCircleIcon className="h-4 w-4 mr-2" /> Adicionar Novo Livro</Button>
        </Link>
      </div>

      <Suspense fallback={<div>Carregando filtros...</div>}>
        <BooksFilter />
      </Suspense>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {books.map((book: Book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {books.length === 0 && (
        <p className="text-center text-gray-500">Nenhum livro encontrado com os critérios de busca/filtro.</p>
      )}
    </div>
  );
}