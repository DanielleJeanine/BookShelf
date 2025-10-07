'use client';

import { use, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useRouter } from 'next/navigation';
import { updateBook, createGenreAction } from '@/app/actions';
import { readingStatusOptions, BookWithGenre, Genre } from '@/lib/types';
import { toast } from 'sonner';
import { Star } from 'lucide-react';

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

// Componente de Estrelas para Avaliação
function StarRating({ rating, onRatingChange }: { rating: number; onRatingChange: (rating: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="transition-all hover:scale-110"
        >
          <Star
            className={`h-8 w-8 ${
              star <= (hover || rating)
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-none text-gray-300'
            }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {rating > 0 ? `${rating} estrela${rating !== 1 ? 's' : ''}` : 'Sem avaliação'}
      </span>
    </div>
  );
}

// Componente de Adicionar Gênero (Separado do form principal)
function AddGenreForm({ onGenreAdded }: { onGenreAdded: () => void }) {
  const [genreName, setGenreName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!genreName.trim()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', genreName.trim());

    try {
      const result = await createGenreAction(null, formData);
      
      if (result?.message) {
        if (result.message.includes('sucesso')) {
          toast.success(result.message);
          setGenreName('');
          onGenreAdded();
        } else {
          toast.error(result.message);
        }
      }
    } catch (error) {
      toast.error('Erro ao criar gênero');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <Input
        type="text"
        placeholder="Novo Gênero"
        value={genreName}
        onChange={(e) => setGenreName(e.target.value)}
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting || !genreName.trim()}>
        {isSubmitting ? 'Adicionando...' : 'Adicionar'}
      </Button>
    </form>
  );
}

export default function EditBookPage({ params }: EditBookPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  const [book, setBook] = useState<BookWithGenre | null>(null);
  const [rating, setRating] = useState(0);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState('QUERO_LER');
  const [currentPage, setCurrentPage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBook = async () => {
    try {
      const res = await fetch(`/api/books/${id}`);
      const data = await res.json();
      
      if (res.ok) {
        setBook(data);
        setRating(data.rating || 0);
        setCurrentPage(data.currentPage || 0);
        setSelectedGenre(data.genreId || undefined);
        setSelectedStatus(data.status || 'QUERO_LER');
      } else {
        toast.error(data.error || 'Erro ao carregar livro');
      }
    } catch (error) {
      toast.error('Erro ao carregar livro');
      console.error(error);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setGenres(data.genres);
    } catch (error) {
      console.error('Erro ao carregar gêneros:', error);
    }
  };

  useEffect(() => {
    fetchBook();
    fetchGenres();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    formData.set('rating', rating.toString());
    formData.set('currentPage', currentPage.toString());
    formData.set('status', selectedStatus);
    if (selectedGenre) {
      formData.set('genreId', selectedGenre);
    }

    try {
      const result = await updateBook(id, null, formData);

      if (result?.success) {
        toast.success(result.message || 'Livro atualizado com sucesso!');
        
        // Aguardar um pouco para o toast aparecer
        setTimeout(() => {
          router.push(`/books/${id}`);
          router.refresh();
        }, 500);
      } else if (result?.message) {
        toast.error(result.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.error('Erro ao atualizar livro');
      console.error(error);
      setIsSubmitting(false);
    }
  };

  if (!book) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Carregando livro...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            ✦ Editar Livro: {book.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* FORM PRINCIPAL DO LIVRO */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título e Autor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título *</Label>
                <Input 
                  id="title" 
                  name="title" 
                  defaultValue={book.title} 
                  required 
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="author">Autor *</Label>
                <Input 
                  id="author" 
                  name="author" 
                  defaultValue={book.author} 
                  required 
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Gênero */}
            <div>
              <Label htmlFor="genreId">Gênero</Label>
              <Select 
                value={selectedGenre} 
                onValueChange={(value) => setSelectedGenre(value === 'none' ? undefined : value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um gênero" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhum</SelectItem>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ano e Páginas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Ano de Publicação</Label>
                <Input 
                  id="year" 
                  name="year" 
                  type="number" 
                  defaultValue={book.year || ''} 
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <Label htmlFor="pages">Número de Páginas</Label>
                <Input 
                  id="pages" 
                  name="pages" 
                  type="number" 
                  defaultValue={book.pages || ''} 
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* ISBN */}
            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input 
                id="isbn" 
                name="isbn" 
                type="text" 
                defaultValue={book.isbn || ''} 
                disabled={isSubmitting}
              />
            </div>

            {/* URL da Capa */}
            <div>
              <Label htmlFor="cover">URL da Capa</Label>
              <Input 
                id="cover" 
                name="cover" 
                type="url" 
                defaultValue={book.cover || ''} 
                disabled={isSubmitting}
              />
            </div>

            {/* Sinopse */}
            <div>
              <Label htmlFor="synopsis">Sinopse</Label>
              <Textarea 
                id="synopsis" 
                name="synopsis" 
                rows={4} 
                defaultValue={book.synopsis || ''} 
                disabled={isSubmitting}
              />
            </div>

            {/* Notas Pessoais */}
            <div>
              <Label htmlFor="notes">Notas Pessoais</Label>
              <Textarea 
                id="notes" 
                name="notes" 
                rows={4} 
                defaultValue={book.notes || ''} 
                disabled={isSubmitting}
              />
            </div>

            {/* Avaliação com Estrelas */}
            <div>
              <Label>Avaliação</Label>
              <input type="hidden" name="rating" value={rating} />
              <StarRating rating={rating} onRatingChange={setRating} />
            </div>

            {/* Status de Leitura */}
            <div>
              <Label>Status de Leitura</Label>
              <input type="hidden" name="status" value={selectedStatus} />
              <RadioGroup 
                value={selectedStatus} 
                onValueChange={setSelectedStatus}
                className="flex flex-wrap gap-4 mt-2"
                disabled={isSubmitting}
              >
                {readingStatusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={`edit-${option.value}`} />
                    <Label htmlFor={`edit-${option.value}`}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Página Atual */}
            <div>
              <Label htmlFor="currentPage">
                Página Atual {book.pages ? `(de ${book.pages})` : ''}
              </Label>
              <Input
                id="currentPage"
                name="currentPage"
                type="number"
                min={0}
                max={book.pages || undefined}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Atualizando...' : 'Atualizar Livro'}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => router.push(`/books/${id}`)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            </div>
          </form>

          {/* FORM DE ADICIONAR GÊNERO - FORA DO FORM PRINCIPAL */}
          <div className="mt-6 pt-6 border-t">
            <div className="p-4 bg-muted/50 rounded-md">
              <h3 className="text-sm font-medium mb-2">Adicionar Novo Gênero</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Não encontrou o gênero? Adicione um novo abaixo:
              </p>
              <AddGenreForm onGenreAdded={fetchGenres} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}