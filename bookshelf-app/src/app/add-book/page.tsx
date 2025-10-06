"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { StarRating } from "@/components/StarRating";
import { ImagePreview } from "@/components/ImagePreview";
import { useFormState, useFormStatus } from "react-dom";
import { createBook, createGenreAction } from "@/app/actions";
import { readingStatusOptions, Genre } from "@/lib/types";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Adicionando..." : "Adicionar Livro"}
    </Button>
  );
}

function AddGenreForm({ onGenreAdded }: { onGenreAdded: () => void }) {
  const [state, formAction] = useFormState(createGenreAction, null);
  const [genreName, setGenreName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (state?.message && isSubmitting) {
      if (state.message.includes("sucesso")) {
        toast.success(state.message);
        setGenreName("");
        setTimeout(() => {
          onGenreAdded();
          setIsSubmitting(false);
        }, 300);
      } else {
        toast.error(state.message);
        setIsSubmitting(false);
      }
    }
  }, [state, onGenreAdded, isSubmitting]);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex gap-2 mt-4">
      <Input
        type="text"
        name="name"
        placeholder="Novo Gênero"
        value={genreName}
        onChange={(e) => setGenreName(e.target.value)}
        required
        disabled={isSubmitting}
      />
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Adicionando..." : "Adicionar Gênero"}
      </Button>
    </form>
  );
}

export default function AddBookPage() {
  const [state, formAction] = useFormState(createBook, null);
  const [rating, setRating] = useState(0);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [coverUrl, setCoverUrl] = useState("");

  const fetchGenres = async () => {
    const res = await fetch("/api/categories");
    const data = await res.json();
    setGenres(data.genres);
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    if (state?.message) {
      if (state.message === "success") {
        toast.success(`Livro "${state.bookTitle}" adicionado com sucesso!`);
        setTimeout(() => {
          window.location.href = "/books";
        }, 1500);
      } else if (
        state.message.includes("Falha") ||
        state.message.includes("Erro")
      ) {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto hover:shadow-2xl transition-shadow duration-300">
        <CardHeader className="text-center border-b border-border/50 pb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-2xl">✨</span>
            <CardTitle
              className="text-3xl font-bold tracking-wide"
              style={{ fontFamily: "var(--font-cinzel)" }}
            >
              Adicionar Novo Livro
            </CardTitle>
            <span className="text-2xl">✨</span>
          </div>
          <p
            className="text-sm text-muted-foreground italic"
            style={{ fontFamily: "var(--font-crimson)" }}
          >
            Adicione um novo volume à sua coleção encantada
          </p>
        </CardHeader>
        <CardContent>
          <div className="mb-4 pb-4 border-b border-border/50">
            <Label htmlFor="genreId">Criar Novo Gênero</Label>
            <AddGenreForm onGenreAdded={fetchGenres} />
          </div>

          <form action={formAction} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Título</Label>
                <Input id="title" name="title" required />
                {state?.errors &&
                  "title" in state.errors &&
                  state.errors.title && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.title}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="author">Autor</Label>
                <Input id="author" name="author" required />
                {state?.errors &&
                  "author" in state.errors &&
                  state.errors.author && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.author}
                    </p>
                  )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {state?.errors &&
                  "genreId" in state.errors &&
                  state.errors.genreId && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.genreId}
                    </p>
                  )}
              </div>

              <div>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="year">Ano de Publicação</Label>
                <Input id="year" name="year" type="number" />
                {state?.errors &&
                  "year" in state.errors &&
                  state.errors.year && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.year}
                    </p>
                  )}
              </div>
              <div>
                <Label htmlFor="pages">Número de Páginas</Label>
                <Input id="pages" name="pages" type="number" />
                {state?.errors &&
                  "pages" in state.errors &&
                  state.errors.pages && (
                    <p className="text-red-500 text-sm mt-1">
                      {state.errors.pages}
                    </p>
                  )}
              </div>
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" name="isbn" type="text" />
              {state?.errors && "isbn" in state.errors && state.errors.isbn && (
                <p className="text-red-500 text-sm mt-1">{state.errors.isbn}</p>
              )}
            </div>

            <div>
              <Label htmlFor="synopsis">Sinopse</Label>
              <Textarea id="synopsis" name="synopsis" rows={4} />
              {state?.errors &&
                "synopsis" in state.errors &&
                state.errors.synopsis && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.synopsis}
                  </p>
                )}
            </div>

            <div>
              <Label htmlFor="notes">Notas Pessoais</Label>
              <Textarea id="notes" name="notes" rows={4} />
              {state?.errors &&
                "notes" in state.errors &&
                state.errors.notes && (
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
                defaultValue="QUERO_LER"
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
              {state?.errors &&
                "status" in state.errors &&
                state.errors.status && (
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
              {state?.errors &&
                "currentPage" in state.errors &&
                state.errors.currentPage && (
                  <p className="text-red-500 text-sm mt-1">
                    {state.errors.currentPage}
                  </p>
                )}
            </div>

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
