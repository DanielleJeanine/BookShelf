import Link from 'next/link';
import { BookOpen, Sparkles } from 'lucide-react';
import { ThemeToggle } from './themeToggle';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <BookOpen className="h-8 w-8 transition-transform group-hover:scale-110" />
            <Sparkles className="h-4 w-4 absolute -top-1 -right-1 text-primary-foreground/70 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-2xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-cinzel)' }}>
              BookShelf
            </span>
            <span className="text-xs tracking-widest opacity-80" style={{ fontFamily: 'var(--font-crimson)' }}>
              Biblioteca Encantada
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-4">
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
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}