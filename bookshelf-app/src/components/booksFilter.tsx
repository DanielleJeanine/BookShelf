"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Genre } from "@/lib/types";
import { useState, useEffect } from "react";

interface BooksFilterProps {
  genres: Genre[];
  readingStatusOptions: readonly { value: string; label: string }[];
}

export function BooksFilter({
  genres,
  readingStatusOptions,
}: BooksFilterProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const currentSearch = searchParams.get("search") || "";
  const currentGenreId = searchParams.get("genreId") || "";
  const currentStatus = searchParams.get("status") || "";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  // Função para converter código de status em texto legível
  const formatStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      QUERO_LER: "Quero Ler",
      LENDO: "Lendo",
      LIDO: "Lido",
      PAUSADO: "Pausado",
      ABANDONADO: "Abandonado",
    };
    return statusMap[status] || status;
  };

  // Debounce para busca em tempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term && term.trim()) {
      params.set("search", term.trim());
      params.delete("genreId");
      params.delete("status");
    } else {
      params.delete("search");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleGenreChange = (genreId: string) => {
    const params = new URLSearchParams(searchParams);
    if (genreId && genreId !== "ALL") {
      params.set("genreId", genreId);
      params.delete("search");
      params.delete("status");
    } else {
      params.delete("genreId");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "ALL") {
      params.set("status", status);
      params.delete("search");
      params.delete("genreId");
    } else {
      params.delete("status");
    }
    replace(`${pathname}?${params.toString()}`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    replace(pathname);
  };

  return (
    <div className="flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 p-4 bg-card rounded-lg shadow-sm">
      {/* Campo de Busca com Lupa */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Buscar por título ou autor..."
          className="pl-9 pr-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Select de Gênero */}
      <Select 
        onValueChange={handleGenreChange} 
        value={currentGenreId || "ALL"}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
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

      {/* Select de Status */}
      <Select
        onValueChange={handleStatusChange}
        value={currentStatus || "ALL"}
      >
        <SelectTrigger className="w-full sm:w-[180px]">
          <SelectValue placeholder="Filtrar por Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Todos os Status</SelectItem>
          {readingStatusOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {formatStatusLabel(option.value)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Botão Limpar Filtros */}
      {(currentSearch || currentGenreId || currentStatus) && (
        <Button 
          variant="outline" 
          onClick={handleClearFilters}
          className="w-full sm:w-auto"
        >
          <X className="mr-2 h-4 w-4" /> Limpar Filtros
        </Button>
      )}
    </div>
  );
}