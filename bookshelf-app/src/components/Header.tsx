import Link from 'next/link';
import { BookIcon } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookIcon className="h-6 w-6" />
          <span className="text-xl font-bold">BookShelf</span>
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:underline">
                Dashboard
              </Link>
            </li>
            <li>
              <Link href="/books" className="hover:underline">
                Minha Biblioteca
              </Link>
            </li>
            <li>
              <Link href="/add-book" className="hover:underline">
                Adicionar Livro
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}