"use client";

import { useState, useEffect } from "react";
import { BookWithGenre, Genre, readingStatusOptions } from "@/lib/types";
import { toast } from "sonner";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { StarRating } from "@/components/StarRating";
import { ImagePreview } from "@/components/ImagePreview";

interface EditBookFormProps {
  book: BookWithGenre;
  genres: Genre[];
}

export default function EditBookForm({ book, genres }: EditBookFormProps) {
  const [coverUrl, setCoverUrl] = useState(book.cover || "");
  const [rating, setRating] = useState(book.rating || 0);
  const [currentPage, setCurrentPage] = useState(book.currentPage || 0);
  const [bookGenres, setBookGenres] = useState(genres);
  const [genreId, setGenreId] = useState(book.genreId || "");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData(e.currentTarget);
    form.set("rating", String(rating));
    form.set("currentPage", String(currentPage));
    form.set("genreId", genreId);

    const res = await fetch(`/api/books/${book.id}`, {
      method: "PUT",
      body: form,
    });

    const data = await res.json();
    if (res.ok) {
      toast.success("Livro atualizado com sucesso!");
    } else {
      toast.error(data.error || "Erro ao atualizar livro");
    }
  };

  const handleAddGenre = async (name: string) => {
    const res = await fetch("/api/genres", {
      method: "POST",
      body: JSON.stringify({ name }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (res.ok) {
      setBookGenres((prev) => [...prev, data]);
      toast.success("Gênero adicionado!");
    } else {
      toast.error(data.error || "Erro ao adicionar gênero");
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Editar Livro: {book.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" name="title" defaultValue={book.title} required />
          </div>

          <div>
            <Label htmlFor="author">Autor</Label>
            <Input id="author" name="author" defaultValue={book.author} required />
          </div>

          <div>
            <Label htmlFor="genreId">Gênero</Label>
            <Select value={genreId} onValueChange={setGenreId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um gênero" />
              </SelectTrigger>
              <SelectContent>
                {bookGenres.map((g) => (
                  <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2 mt-2">
              <Input
                type="text"
                placeholder="Novo gênero"
                onKeyDown={async (e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    await handleAddGenre(e.currentTarget.value.trim());
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button type="button">Adicionar</Button>
            </div>
          </div>

          <div>
            <Label htmlFor="year">Ano de Publicação</Label>
            <Input id="year" name="year" type="number" defaultValue={book.year || ""} />
          </div>

          <div>
            <Label htmlFor="pages">Número de Páginas</Label>
            <Input id="pages" name="pages" type="number" defaultValue={book.pages || ""} />
          </div>

          <div>
            <Label htmlFor="isbn">ISBN</Label>
            <Input id="isbn" name="isbn" type="text" defaultValue={book.isbn || ""} />
          </div>

          <div>
            <Label htmlFor="cover">URL da Capa</Label>
            <Input
              id="cover"
              name="cover"
              type="url"
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
            />
            <ImagePreview url={coverUrl} alt="Preview da capa do livro" />
          </div>

          <div>
            <Label htmlFor="synopsis">Sinopse</Label>
            <Textarea id="synopsis" name="synopsis" defaultValue={book.synopsis || ""} />
          </div>

          <div>
            <Label htmlFor="notes">Notas Pessoais</Label>
            <Textarea id="notes" name="notes" defaultValue={book.notes || ""} />
          </div>

          <div>
            <Label>Avaliação</Label>
            <StarRating value={rating} onChange={setRating} />
          </div>

          <div>
            <Label>Status de Leitura</Label>
            <RadioGroup name="status" defaultValue={book.status} className="flex gap-4 mt-2">
              {readingStatusOptions.map((opt) => (
                <div key={opt.value} className="flex items-center gap-2">
                  <RadioGroupItem id={opt.value} value={opt.value} />
                  <Label htmlFor={opt.value}>{opt.label}</Label>
                </div>
              ))}
            </RadioGroup>
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
          </div>

          <Button type="submit">Atualizar Livro</Button>
        </form>
      </CardContent>
    </Card>
  );
}
