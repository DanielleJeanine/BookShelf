'use client';

import { useState, useEffect } from 'react';
import { initialBooks } from '@/lib/data';
import { Book, availableGenres } from '@/lib/types';
import { BookCard } from '@/components/BookCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircleIcon } from 'lucide-react';

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState<string | undefined>(undefined);

  useEffect(() => {
    setBooks(initialBooks);
  }, []);

  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGenre = filterGenre ? book.genre === filterGenre : true;

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold">Minha Biblioteca</h1>
        <Link href="/add-book">
          <Button><PlusCircleIcon className="h-4 w-4 mr-2" /> Adicionar Novo Livro</Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar por título ou autor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1"
        />
        <Select onValueChange={(value) => setFilterGenre(value === 'all' ? undefined : value)} value={filterGenre || 'all'}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Gênero" />
          </SelectTrigger>
          <SelectContent>
            {availableGenres.map(genre => (
              <SelectItem key={genre} value={genre}>{genre}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBooks.map(book => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {filteredBooks.length === 0 && (
        <p className="text-center text-gray-500">Nenhum livro encontrado com os critérios de busca/filtro.</p>
      )}
    </div>
  );
}