"use client";

import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "@/components/StarRating";
import { ImagePreview } from "@/components/ImagePreview";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useFormState, useFormStatus } from "react-dom";
import { updateBook, createGenreAction } from "@/app/actions";
import { readingStatusOptions, BookWithGenre, Genre } from "@/lib/types";
import { toast } from "sonner";

interface EditBookPageProps {
  params: Promise<{ id: string }>;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Atualizando..." : "Atualizar Livro"}
    </Button>
  );
}

function AddGenreForm({ onGenreAdded }: { onGenreAdded: () => void }) {
  const [state, formAction] = useFormState(createGenreAction, null);
  const [genreName, setGenreName] = useState("");

  useEffect(() => {
    if (state?.message) {
      if (state.message.includes("sucesso")) {
        toast.success(state.message);
        setGenreName("");
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

export default function EditBookPage({ params }: EditBookPageProps) {
  const router = useRouter();
  
  // ✅ CORREÇÃO: Use React.use() para desembrulhar Promise em Client Component
  const { id } = use(params);
  
  const [book, setBook] = useState<BookWithGenre | null>(null);
  const [rating, setRating] = useState(0);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [coverUrl, setCoverUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [state, formAction] = useFormState(updateBook.bind(null, id), null);

  const fetchBook = async () => {
    try {
      console.log('Buscando livro com ID:', id);
      const res = await fetch(`/api/books/${id}`);
      console.log('Resposta da API:', res.status);
      
      const data = await res.json();
      console.log('Dados recebidos:', data);
      
      if (res.ok) {
        setBook(data);
        setRating(data.rating || 0);
        setCurrentPage(data.currentPage || 0);
        setCoverUrl(data.cover || "");
        setError(null);
      } else {
        const errorMsg = data.error || "Erro ao carregar livro";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Erro ao buscar livro:', err);
      const errorMsg = "Erro ao conectar com o servidor";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGenres = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setGenres(data.genres);
    } catch (err) {
      console.error('Erro ao buscar gêneros:', err);
      toast.error("Erro ao carregar gêneros");
    }
  };

  useEffect(() => {
    if (id) {
      fetchBook();
      fetchGenres();
    }
  }, [id]);

  useEffect(() => {
    if (state && !state.errors && state.message) {
      toast.success(state.message || "Livro atualizado com sucesso!");
      router.push(`/books/${id}`);
    } else if (state?.message && state.message.includes("Falha")) {
      toast.error(state.message);
    }
  }, [state, router, id]);

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando livro...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !book) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-destructive">
              Livro não encontrado
            </h2>
            <p className="text-muted-foreground mb-6">
              {error || "O livro que você está tentando editar não existe ou foi removido."}
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => router.push("/books")}>
                Voltar para Biblioteca
              </Button>
              <Button variant="outline" onClick={() => window.location.reload()}>
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Editar Livro: {book.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  name="title"
                  defaultValue={book.title}
                  required
                />
                {state?.errors?.title && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.title}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="author">Autor</Label>
                <Input
                  id="author"
                  name="author"
                  defaultValue={book.author}
                  required
                />
                {state?.errors?.author && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.author}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="genreId">Gênero</Label>
              <Select name="genreId" defaultValue={book.genreId || ""}>
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
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.genreId}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Ano de Publicação</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  defaultValue={book.year || ""}
                />
                {state?.errors?.year && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.year}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="pages">Número de Páginas</Label>
                <Input
                  id="pages"
                  name="pages"
                  type="number"
                  defaultValue={book.pages || ""}
                />
                {state?.errors?.pages && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.pages}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input
                id="isbn"
                name="isbn"
                type="text"
                defaultValue={book.isbn || ""}
              />
              {state?.errors?.isbn && (
                <p className="text-red-500 text-sm mt-1">{state.errors.isbn}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cover">URL da Capa</Label>
                <Input
                  id="cover"
                  name="cover"
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="https://exemplo.com/capa.jpg"
                />
                {state?.errors &&
                  "cover" in state.errors &&
                  state.errors.cover && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.cover}
                    </p>
                  )}
              </div>
              <div>
                <ImagePreview url={coverUrl} alt="Preview da capa do livro" />
              </div>
            </div>

            <div>
              <Label htmlFor="synopsis">Sinopse</Label>
              <Textarea
                id="synopsis"
                name="synopsis"
                rows={4}
                defaultValue={book.synopsis || ""}
              />
              {state?.errors?.synopsis && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.synopsis}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="notes">Notas Pessoais</Label>
              <Textarea
                id="notes"
                name="notes"
                rows={4}
                defaultValue={book.notes || ""}
              />
              {state?.errors?.notes && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.notes}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="rating">Avaliação</Label>
              <input type="hidden" name="rating" value={rating} />
              <StarRating value={rating} onChange={setRating} />
              {state?.errors &&
                "rating" in state.errors &&
                state.errors.rating && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.rating}
                  </p>
                )}
            </div>

            <div>
              <Label>Status de Leitura</Label>
              <RadioGroup
                name="status"
                defaultValue={book.status}
                className="flex flex-wrap gap-4 mt-2"
              >
                {readingStatusOptions.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {state?.errors?.status && (
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.status}
                </p>
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
                <p className="text-red-500 text-sm mt-1">
                  {state.errors.currentPage}
                </p>
              )}
            </div>

            <div className="flex gap-4">
              <SubmitButton />
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(`/books/${id}`)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}