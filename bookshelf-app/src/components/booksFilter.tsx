'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { availableGenres } from '@/lib/types';
import { useCallback, useEffect, useState } from 'react';

export function BooksFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [filterGenre, setFilterGenre] = useState(searchParams.get('genre') || 'all');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
    setFilterGenre(searchParams.get('genre') || 'all');
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    router.push(`/books?${createQueryString('search', value)}`);
  };

  const handleGenreChange = (value: string) => {
    setFilterGenre(value);
    const genreValue = value === 'all' ? '' : value;
    router.push(`/books?${createQueryString('genre', genreValue)}`);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <Input
        placeholder="Buscar por título ou autor..."
        value={searchTerm}
        onChange={(e) => handleSearchChange(e.target.value)}
        className="flex-1"
      />
      <Select onValueChange={handleGenreChange} value={filterGenre}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por Gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Gêneros</SelectItem>
          {availableGenres.map(genre => (
            <SelectItem key={genre} value={genre}>{genre}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}