// src/app/add-book/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Image from 'next/image';
import { useFormState, useFormStatus } from 'react-dom'; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';

import { availableGenres } from '@/lib/types';
import { createBook } from '@/app/actions'; 

const formSchema = z.object({
  title: z.string().min(1, { message: 'Título é obrigatório.' }),
  author: z.string().min(1, { message: 'Autor é obrigatório.' }),
  genre: z.string().optional(),
  year: z.coerce.number().int().min(1000).max(new Date().getFullYear()).optional().or(z.literal('')), 
  pages: z.coerce.number().int().min(1).optional().or(z.literal('')), 
  rating: z.number().min(1).max(5).optional(),
  synopsis: z.string().optional(),
  cover: z.string().url({ message: 'URL da capa inválida.' }).optional().or(z.literal('')), 
  current_page: z.coerce.number().int().min(0).optional().or(z.literal('')), 
  status: z.enum(['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'], { message: 'Status de leitura inválido.' }),
  notes: z.string().optional(),
});

export default function AddBookPage() {
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      title: '',
      author: '',
      genre: '',
      year: '',
      pages: '',
      rating: 3,
      synopsis: '',
      cover: '',
      current_page: '',
      status: 'QUERO_LER',
      notes: '',
    },
  });

  const [state, formAction] = useFormState(createBook, { errors: {}, message: '' });

  useEffect(() => {
    if (state.message && !state.errors) {
      toast.success(state.message);
      form.reset();
    } else if (state.errors) {
      Object.entries(state.errors).forEach(([key, value]) => {
        form.setError(key as keyof z.infer<typeof formSchema>, { type: 'server', message: (value as string[]).join(', ') });
      });
      toast.error(state.message || 'Erro ao adicionar livro.');
    }
  }, [state, form]);

  const coverFieldValue = form.watch('cover');
  useEffect(() => {
    if (coverFieldValue && z.string().url().safeParse(coverFieldValue).success) {
      setCoverPreview(coverFieldValue);
    } else {
      setCoverPreview(null);
    }
  }, [coverFieldValue]);

  const totalFields = Object.keys(form.getValues()).length;
  const filledFields = Object.keys(form.getValues()).filter(key => {
    const value = form.getValues(key as keyof z.infer<typeof formSchema>);
    return value !== '' && value !== undefined && value !== null;
  }).length;
  const formProgress = (filledFields / totalFields) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-center">Adicionar Novo Livro</h1>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500 ease-out" style={{ width: `${formProgress}%` }}></div>
      </div>
      <p className="text-sm text-center text-gray-500">Progresso do Formulário: {formProgress.toFixed(0)}%</p>

      <Form {...form}>
        <form action={formAction} className="space-y-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Título <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="O Nome do Vento" {...field} />
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
                <FormLabel>Autor <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Patrick Rothfuss" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="genre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gênero</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableGenres.map(genre => (
                      <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ano de Publicação</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="2007" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pages"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total de Páginas</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="672" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="rating"
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <FormLabel>Avaliação (1-5 estrelas)</FormLabel>
                <FormControl>
                  <Slider
                    min={1}
                    max={5}
                    step={1}
                    value={[value || 3]}
                    onValueChange={(val) => onChange(val[0])}
                    className="w-[60%]"
                  />
                </FormControl>
                <FormDescription>Avaliação atual: {value || 3} estrelas</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="synopsis"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sinopse</FormLabel>
                <FormControl>
                  <Textarea placeholder="Uma breve descrição do livro..." {...field} rows={4} />
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
                  <Input placeholder="https://example.com/cover.jpg" {...field} />
                </FormControl>
                {coverPreview && (
                  <div className="mt-2 w-32 h-48 relative border rounded-md overflow-hidden">
                    <Image src={coverPreview} alt="Preview da Capa" fill style={{ objectFit: 'cover' }} />
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Status de Leitura</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="flex flex-col space-y-1"
                  >
                    {['QUERO_LER', 'LENDO', 'LIDO', 'PAUSADO', 'ABANDONADO'].map(status => (
                      <FormItem key={status} className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem value={status} />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {status.replace('_', ' ')}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch('status') === 'LENDO' && (
            <FormField
              control={form.control}
              name="current_page"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Página Atual</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="150" {...field} />
                  </FormControl>
                  <FormDescription>A página em que você está atualmente.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notas Pessoais</FormLabel>
                <FormControl>
                  <Textarea placeholder="Minhas anotações sobre o livro..." {...field} rows={3} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <SubmitButton />
        </form>
      </Form>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Adicionando...' : 'Adicionar Livro'}
    </Button>
  );
}