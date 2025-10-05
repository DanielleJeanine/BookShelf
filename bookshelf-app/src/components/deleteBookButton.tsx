'use client';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deleteBook } from '@/app/actions';
import { useFormStatus } from 'react-dom';

interface DeleteBookButtonProps {
  bookId: string;
}

function DeleteButtonContent() {
  const { pending } = useFormStatus();
  return (
    <Button variant="destructive" disabled={pending}>
      {pending ? 'Excluindo...' : 'Excluir'}
    </Button>
  );
}

export function DeleteBookButton({ bookId }: DeleteBookButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta ação não pode ser desfeita. Isso excluirá permanentemente este livro do seu catálogo.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <form action={deleteBook.bind(null, bookId)}>
            <DeleteButtonContent />
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}