'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';
import { CheckCircle } from 'lucide-react';

interface CreatedBookToastProps {
  bookTitle: string;
}

export function CreatedBookToast({ bookTitle }: CreatedBookToastProps) {
  useEffect(() => {
    toast.success(
      `Livro "${bookTitle}" adicionado com sucesso!`,
      {
        icon: <CheckCircle className="h-4 w-4" />,
        duration: 4000,
        description: 'O livro foi salvo na sua biblioteca.',
      }
    );
  }, [bookTitle]);

  return null;
}