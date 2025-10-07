'use client';

import Link from 'next/link';
import { BookOpen, Sparkles, Menu, X } from 'lucide-react';
import { ThemeToggle } from './themeToggle';
import { useState } from 'react';
import { Button } from './ui/button';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Dashboard' },
    { href: '/books', label: 'Minha Biblioteca' },
    { href: '/add-book', label: 'Adicionar Livro' },
    { href: '/genres', label: 'Gêneros' },
  ];

  return (
    <header className="bg-primary text-primary-foreground p-4 md:p-6 shadow-lg border-b-2 border-primary/30 relative overflow-hidden">
      {/* Decoração de fundo sutil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-2 left-10">✦</div>
        <div className="absolute top-4 right-20">✧</div>
        <div className="absolute bottom-2 left-1/4">❖</div>
        <div className="absolute bottom-3 right-1/3">✦</div>
      </div>
      
      <div className="container mx-auto relative z-10">
        {/* Desktop e Mobile: Logo + Botões */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 md:space-x-3 group">
            <div className="relative">
              <BookOpen className="h-6 w-6 md:h-8 md:w-8 transition-transform group-hover:scale-110" />
              <Sparkles className="h-3 w-3 md:h-4 md:w-4 absolute -top-1 -right-1 text-primary-foreground/70 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-bold tracking-wider" style={{ fontFamily: 'var(--font-cinzel)' }}>
                BookShelf
              </span>
              <span className="text-[10px] md:text-xs tracking-widest opacity-80" style={{ fontFamily: 'var(--font-crimson)' }}>
                Biblioteca Encantada
              </span>
            </div>
          </Link>
          
          {/* Desktop: Menu + Theme Toggle */}
          <div className="hidden md:flex items-center space-x-6">
            <nav>
              <ul className="flex space-x-6">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link 
                      href={link.href}
                      className="hover:text-primary-foreground/80 transition-colors font-semibold tracking-wide relative group"
                      style={{ fontFamily: 'var(--font-crimson)' }}
                    >
                      <span className="relative">
                        {link.label}
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-foreground/60 transition-all group-hover:w-full"></span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <ThemeToggle />
          </div>

          {/* Mobile: Theme Toggle + Menu Hambúrguer */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile: Menu Dropdown */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-primary-foreground/20 pt-4">
            <ul className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-2 px-4 hover:bg-primary-foreground/10 rounded-md transition-colors font-semibold tracking-wide"
                    style={{ fontFamily: 'var(--font-crimson)' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}