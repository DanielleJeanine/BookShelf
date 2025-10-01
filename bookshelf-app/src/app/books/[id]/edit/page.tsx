"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { initialBooks } from "@/lib/data";

const formSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  author: z.string().min(1, "Autor é obrigatório"),
  genre: z.string().optional(),
  year: z.string().optional(),
  pages: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  synopsis: z.string().optional(),
  cover: z.string().optional(),
  current_page: z.string().optional(),
  status: z.enum(["lido", "lendo", "quero ler"]),
  notes: z.string().optional(),
});

export default function EditBookForm() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [bookToEdit, setBookToEdit] = useState<any>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      genre: "",
      year: "",
      pages: "",
      rating: 3,
      synopsis: "",
      cover: "",
      current_page: "",
      status: "quero ler",
      notes: "",
    },
  });

  useEffect(() => {
    if (id) {
      const foundBook = initialBooks.find((b) => b.id === id);
      if (foundBook) {
        setBookToEdit(foundBook);
        const statusMap: Record<string, "lido" | "lendo" | "quero ler"> = {
          LIDO: "lido",
          LENDO: "lendo",
          QUERO_LER: "quero ler",
          "lido": "lido",
          "lendo": "lendo",
          "quero ler": "quero ler",
        };
        form.reset({
          title: foundBook.title,
          author: foundBook.author,
          genre: foundBook.genre || "",
          year: foundBook.year !== undefined && foundBook.year !== null ? String(foundBook.year) : "",
          pages: foundBook.pages !== undefined && foundBook.pages !== null ? String(foundBook.pages) : "",
          rating: foundBook.rating || 3,
          synopsis: foundBook.synopsis || "",
          cover: foundBook.cover || "",
          current_page: foundBook.current_page !== undefined && foundBook.current_page !== null ? String(foundBook.current_page) : "",
          status: statusMap[foundBook.status] ?? "quero ler",
          notes: foundBook.notes || "",
        });
        setCoverPreview(foundBook.cover || null);
      } else {
        toast(
          <div>
            <strong>Erro</strong>
            <div>Livro não encontrado para edição.</div>
          </div>
        );
        router.push("/books");
      }
    }
  }, [id]);

  const formValues = form.watch();
  const totalFields = Object.keys(formValues).length;
  const filledFields = Object.values(formValues).filter(
    (v) => v !== "" && v !== undefined && v !== null
  ).length;
  const formProgress = (filledFields / totalFields) * 100;

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form enviado:", values);
    toast(
      <div>
        <strong>Livro atualizado</strong>
        <div>{values.title} foi atualizado com sucesso!</div>
      </div>
    );
    router.push("/books");
  };

  if (!bookToEdit) return <p>Carregando livro...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Livro</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o título" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Autor</FormLabel>
                <FormControl>
                  <Input placeholder="Digite o autor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <FormField
            control={form.control}
            name="cover"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL da Capa</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://..."
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setCoverPreview(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

         
          {coverPreview && (
            <div className="mt-2">
              <Image
                src={coverPreview}
                alt="Preview da capa"
                width={200}
                height={300}
                className="rounded-md shadow"
              />
            </div>
          )}

          
          <FormField
            control={form.control}
            name="synopsis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sinopse</FormLabel>
                <FormControl>
                  <Textarea placeholder="Escreva a sinopse..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Progresso: {formProgress.toFixed(0)}%
            </p>
            <div className="w-full bg-gray-200 rounded h-2">
              <div
                className="bg-blue-500 h-2 rounded"
                style={{ width: `${formProgress}%` }}
              />
            </div>
          </div>

         
          <Button type="submit" className="mt-4">
            Salvar Alterações
          </Button>
        </form>
      </Form>
    </div>
  );
}
