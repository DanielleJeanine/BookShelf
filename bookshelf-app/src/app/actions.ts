'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { success, z } from 'zod';
import { createBook as dbCreateBook, updateBook as dbUpdateBook, deleteBook as dbDeleteBook, createGenre, updateGenre, deleteGenre } from '@/lib/database';
import { ReadingStatus } from '@/generated/prisma';

const bookSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório.' }),
  author: z.string().min(1, { message: 'Autor é obrigatório.' }),
  genreId: z.string().optional().transform(e => e === "" ? undefined : e),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional().transform(e => isNaN(e as number) ? undefined : e),
  pages: z.coerce.number().int().min(1).optional().transform(e => isNaN(e as number) ? undefined : e),
  rating: z.coerce.number().min(1).max(5).optional().transform(e => isNaN(e as number) ? undefined : e),
  synopsis: z.string().optional().transform(e => e === "" ? undefined : e),
  cover: z.string().url({ message: 'URL da capa inválida.' }).optional().transform(e => e === "" ? undefined : e),
  currentPage: z.coerce.number().int().min(0).optional().transform(e => isNaN(e as number) ? undefined : e),
  status: z.enum(['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'], { message: 'Status de leitura inválido.' }),
  isbn: z.string().optional().transform(e => e === "" ? undefined : e),
  notes: z.string().optional().transform(e => e === "" ? undefined : e),
});

export async function createBook(prevState: unknown, formData: FormData) {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = bookSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Falha na validação do formulário.',
      };
    }

    const { title, author, genreId, year, pages, rating, synopsis, cover, currentPage, status, isbn, notes } = validatedFields.data;

    await dbCreateBook({
      title,
      author,
      genreId,
      year,
      pages,
      rating,
      synopsis,
      cover,
      currentPage,
      status: status as ReadingStatus,
      isbn,
      notes,
    });

    revalidatePath('/books');
    revalidatePath('/');
    
    return {
      errors: {},
      message: 'success',
      bookTitle: title,
    };
  } catch (error) {
    console.error('Erro ao criar livro:', error);
    return {
      errors: {},
      message: 'Erro ao criar livro. Tente novamente.',
    };
  }
}

export async function updateBook(id: string, prevState: unknown, formData: FormData) {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = bookSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Falha na validação do formulário.',
      };
    }

    const { title, author, genreId, year, pages, rating, synopsis, cover, currentPage, status, isbn, notes } = validatedFields.data;

    await dbUpdateBook(id, {
      title,
      author,
      genreId,
      year,
      pages,
      rating,
      synopsis,
      cover,
      currentPage,
      status: status as ReadingStatus,
      isbn,
      notes,
    });

    revalidatePath('/books');
    revalidatePath(`/books/${id}`);
    revalidatePath('/');
    redirect(`/books/${id}`);
    

  } catch (error) {
    console.error('Erro ao atualizar livro:', error);
    return {
      errors: {},
      message: 'Erro ao atualizar livro. Tente novamente.',
    };
  }
}

export async function deleteBook(id: string) {
  try {
    await dbDeleteBook(id);
    revalidatePath('/books');
    revalidatePath('/');
    redirect('/books');
  } catch (error) {
    console.error('Erro ao excluir livro:', error);
    throw new Error('Erro ao excluir livro');
  }
}

const genreSchema = z.object({
  name: z.string().min(1, { message: 'Nome do gênero é obrigatório.' }),
});

export async function createGenreAction(prevState: unknown, formData: FormData) {
  try {
    const rawFormData = Object.fromEntries(formData.entries());
    const validatedFields = genreSchema.safeParse(rawFormData);

    if (!validatedFields.success) {
      return {
        errors: validatedFields.error.flatten().fieldErrors,
        message: 'Falha na validação do formulário.',
      };
    }

    const { name } = validatedFields.data;

    await createGenre(name);

    revalidatePath('/books');
    revalidatePath('/add-book');
    
    return {
      success: true,
      errors: {},
      message: `Gênero "${name}" criado com sucesso!`,
    };
  } catch (error) {
    console.error('Erro ao criar gênero:', error);
    return {
      errors: {},
      message: 'Erro ao criar gênero. Pode ser que já exista um gênero com esse nome.',
    };
  }
}

export async function updateGenreAction(prevState: unknown, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;

    // Validação
    if (!name || name.trim() === '') {
      return {
        success: false,
        message: 'Nome do gênero é obrigatório',
        errors: { name: ['Nome do gênero é obrigatório'] }
      };
    }

    await updateGenre(id, name.trim());

    return {
      success: true,
      message: 'Gênero atualizado com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao atualizar gênero:', error);
    return {
      success: false,
      message: 'Erro ao atualizar gênero. Tente novamente.'
    };
  }
}

export async function deleteGenreAction(id: string) {
  try {
    await deleteGenre(id);
    return {
      success: true,
      message: 'Gênero excluído com sucesso!'
    };
  } catch (error) {
    console.error('Erro ao excluir gênero:', error);
    return {
      success: false,
      message: 'Erro ao excluir gênero. Pode haver livros associados a ele.'
    };
  }
}
