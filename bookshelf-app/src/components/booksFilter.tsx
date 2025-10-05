'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Genre } from '@/lib/types';

interface BooksFilterProps {
  genres: Genre[];
  readingStatusOptions: readonly { value: string; label: string }[];
}

export function BooksFilter({ genres, readingStatusOptions }: BooksFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentSearch = searchParams.get('search') || '';
  const currentGenreId = searchParams.get('genreId') || '';
  const currentStatus = searchParams.get('status') || '';

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('search', term);
    } else {
      params.delete('search');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleGenreChange = (genreId: string) => {
    const params = new URLSearchParams(searchParams);
    if (genreId) {
      params.set('genreId', genreId);
    } else {
      params.delete('genreId');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    replace(pathname);
  };

  return (
    <div className="flex flex-wrap gap-4 p-4 bg-card rounded-lg shadow-sm">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título ou autor..."
          className="pl-9 pr-2"
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={currentSearch}
        />
      </div>

      <Select onValueChange={handleGenreChange} value={currentGenreId}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por Gênero" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os Gêneros</SelectItem>
          {genres.map((genre) => (
            <SelectItem key={genre.id} value={genre.id}>
              {genre.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select onValueChange={handleStatusChange} value={currentStatus}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filtrar por Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os Status</SelectItem>
          {readingStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {(currentSearch || currentGenreId || currentStatus) && (
        <Button variant="outline" onClick={handleClearFilters}>
          <X className="mr-2 h-4 w-4" /> Limpar Filtros
        </Button>
      )}
    </div>
  );
}