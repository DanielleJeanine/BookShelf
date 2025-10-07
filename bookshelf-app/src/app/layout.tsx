// src/app/layout.tsx
import type { Metadata } from 'next';
import { Crimson_Text, Cinzel } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/providers';

const crimsonText = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-crimson'
});

const cinzel = Cinzel({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel'
});

export const metadata: Metadata = {
  title: 'Libris Arcana - Gerenciador de Livros Pessoais',
  description: 'Catalogue, organize e acompanhe seu status de leitura.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${crimsonText.variable} ${cinzel.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <Header />
          <main className="container mx-auto p-4 mt-4">
            {children}
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}