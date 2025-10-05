'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { useFormState, useFormStatus } from 'react-dom';
import { createBook, createGenreAction } from '@/app/actions';
import { readingStatusOptions, Genre } from '@/lib/types';
import { toast } from 'sonner';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? 'Adicionando...' : 'Adicionar Livro'}
    </Button>
  );
}

function AddGenreForm({ onGenreAdded }: { onGenreAdded: () => void }) {
  const [state, formAction] = useFormState(createGenreAction, null);
  const [genreName, setGenreName] = useState('');

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes('sucesso')) {
        toast.success(state.message);
        setGenreName('');
        onGenreAdded(); 
      } else {
        toast.error(state.message);
      }
    }
  }, [state, onGenreAdded]);

  return (
    <form action={formAction} className="flex gap-2 mt-4">
      <Input
        type="text"
        name="name"
        placeholder="Novo Gênero"
        value={genreName}
        onChange={(e) => setGenreName(e.target.value)}
        required
      />
      <Button type="submit">Adicionar Gênero</Button>
    </form>
  );
}

export default function AddBookPage() {
  const [state, formAction] = useFormState(createBook, null);
  const [rating, setRating] = useState(0);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  const fetchGenres = async () => {
    const res = await fetch('/api/categories');
    const data = await res.json();
    setGenres(data.genres);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (state?.message && state.message.includes('Falha')) {
      toast.error(state.message);
    }
  }, [state]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Adicionar Novo Livro</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" required />
                {state?.errors?.title && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.title}</p>
                )}
              </div>
              <div>
                <Label htmlFor="author">Autor</Label>
                <Input id="author" name="author" required />
                {state?.errors?.author && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.author}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="genreId">Gênero</Label>
              <Select name="genreId">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um gênero" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre.id} value={genre.id}>
                      {genre.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <AddGenreForm onGenreAdded={fetchGenres} />
              {state?.errors?.genreId && (
                <p className="text-red-500 text-sm mt-1">{state.errors.genreId}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Ano de Publicação</Label>
                <Input id="year" name="year" type="number" />
                {state?.errors?.year && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.year}</p>
                )}
              </div>
              <div>
                <Label htmlFor="pages">Número de Páginas</Label>
                <Input id="pages" name="pages" type="number" />
                {state?.errors?.pages && (
                  <p className="text-red-500 text-sm mt-1">{state.errors.pages}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" name="isbn" type="text" />
              {state?.errors?.isbn && (
                <p className="text-red-500 text-sm mt-1">{state.errors.isbn}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cover">URL da Capa</Label>
              <Input id="cover" name="cover" type="url" />
              {state?.errors?.cover && (
                <p className="text-red-500 text-sm mt-1">{state.errors.cover}</p>
              )}
            </div>

            <div>
              <Label htmlFor="synopsis">Sinopse</Label>
              <Textarea id="synopsis" name="synopsis" rows={4} />
              {state?.errors?.synopsis && (
                <p className="text-red-500 text-sm mt-1">{state.errors.synopsis}</p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notas Pessoais</Label>
              <Textarea id="notes" name="notes" rows={4} />
              {state?.errors?.notes && (
                <p className="text-red-500 text-sm mt-1">{state.errors.notes}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rating">Avaliação ({rating} estrelas)</Label>
              <Slider
                id="rating"
                name="rating"
                min={0}
                max={5}
                step={1}
                value={[rating]}
                onValueChange={(value) => setRating(value[0])}
                className="mt-2"
              />
              {state?.errors?.rating && (
                <p className="text-red-500 text-sm mt-1">{state.errors.rating}</p>
              )}
            </div>

            <div>
              <Label>Status de Leitura</Label>
              <RadioGroup name="status" defaultValue="QUERO_LER" className="flex flex-wrap gap-4 mt-2">
                {readingStatusOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {state?.errors?.status && (
                <p className="text-red-500 text-sm mt-1">{state.errors.status}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currentPage">Página Atual</Label>
              <Input
                id="currentPage"
                name="currentPage"
                type="number"
                min={0}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
              />
              {state?.errors?.currentPage && (
                <p className="text-red-500 text-sm mt-1">{state.errors.currentPage}</p>
              )}
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}