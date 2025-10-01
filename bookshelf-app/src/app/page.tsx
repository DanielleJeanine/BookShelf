'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { initialBooks } from '@/lib/data';
import { Book } from '@/lib/types';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    
    setBooks(initialBooks);
  }, []);

  const totalBooks = books.length;
  const readingBooks = books.filter(book => book.status === 'LENDO').length;
  const finishedBooks = books.filter(book => book.status === 'LIDO').length;
  const totalPagesRead = books.reduce((sum, book) => {
    if (book.status === 'LIDO' && book.pages) {
      return sum + book.pages;
    }
    if (book.status === 'LENDO' && book.current_page) {
      return sum + book.current_page;
    }
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total de Livros</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalBooks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lendo Atualmente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{readingBooks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Livros Finalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{finishedBooks}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total de Páginas Lidas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{totalPagesRead}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}