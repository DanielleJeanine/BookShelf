'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { initialBooks } from '@/lib/data';
import { Book } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

const bookSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório.' }),
  author: z.string().min(1, { message: 'Autor é obrigatório.' }),
  genre: z.string().optional().transform(e => e === "" ? undefined : e),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional().transform(e => isNaN(e as number) ? undefined : e),
  pages: z.coerce.number().int().min(1).optional().transform(e => isNaN(e as number) ? undefined : e),
  rating: z.coerce.number().min(1).max(5).optional().transform(e => isNaN(e as number) ? undefined : e),
  synopsis: z.string().optional().transform(e => e === "" ? undefined : e),
  cover: z.string().url({ message: 'URL da capa inválida.' }).optional().transform(e => e === "" ? undefined : e),
  current_page: z.coerce.number().int().min(0).optional().transform(e => isNaN(e as number) ? undefined : e),
  status: z.enum(['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'], { message: 'Status de leitura inválido.' }),
  notes: z.string().optional().transform(e => e === "" ? undefined : e),
});

export async function createBook(prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = bookSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Falha na validação do formulário.',
    };
  }

  const { title, author, genre, year, pages, rating, synopsis, cover, current_page, status, notes } = validatedFields.data;

  const newBook: Book = {
    id: uuidv4(),
    title,
    author,
    genre,
    year,
    pages,
    rating,
    synopsis,
    cover,
    current_page,
    status,
    notes,
  };

  initialBooks.push(newBook);

  revalidatePath('/books'); 
  redirect('/books'); 
}

export async function updateBook(id: string, prevState: any, formData: FormData) {
  const rawFormData = Object.fromEntries(formData.entries());
  const validatedFields = bookSchema.safeParse(rawFormData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Falha na validação do formulário.',
    };
  }

  const { title, author, genre, year, pages, rating, synopsis, cover, current_page, status, notes } = validatedFields.data;

  const bookIndex = initialBooks.findIndex(b => b.id === id);
  if (bookIndex === -1) {
    return { message: 'Livro não encontrado para atualização.' };
  }

  const updatedBook: Book = {
    ...initialBooks[bookIndex],
    title,
    author,
    genre,
    year,
    pages,
    rating,
    synopsis,
    cover,
    current_page,
    status,
    notes,
  };

  initialBooks[bookIndex] = updatedBook;

  revalidatePath('/books'); 
  revalidatePath(`/books/${id}`); 
  redirect(`/books/${id}`); 
}

export async function deleteBook(id: string) {
  const bookIndex = initialBooks.findIndex(b => b.id === id);
  if (bookIndex === -1) {
    return { message: 'Livro não encontrado para exclusão.' };
  }

  initialBooks.splice(bookIndex, 1);

  revalidatePath('/books'); 
  redirect('/books'); 
}