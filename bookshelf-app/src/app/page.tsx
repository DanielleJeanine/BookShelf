import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { getDashboardStats } from '@/lib/database';

export const revalidate = 0;
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-wide" style={{ fontFamily: 'var(--font-cinzel)' }}>
          Dashboard
        </h1>
        <div className="flex items-center justify-center gap-4 text-muted-foreground">
          <span>✦</span>
          <p className="text-sm italic" style={{ fontFamily: 'var(--font-crimson)' }}>
            Bem-vindo à sua biblioteca encantada
          </p>
          <span>✦</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>📚</span>
              <span style={{ fontFamily: 'var(--font-cinzel)' }}>Total de Livros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary" style={{ fontFamily: 'var(--font-cinzel)' }}>
              {stats.totalBooks}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>📖</span>
              <span style={{ fontFamily: 'var(--font-cinzel)' }}>Lendo Atualmente</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary" style={{ fontFamily: 'var(--font-cinzel)' }}>
              {stats.readingBooks}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>✨</span>
              <span style={{ fontFamily: 'var(--font-cinzel)' }}>Livros Finalizados</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary" style={{ fontFamily: 'var(--font-cinzel)' }}>
              {stats.finishedBooks}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <span>📜</span>
              <span style={{ fontFamily: 'var(--font-cinzel)' }}>Páginas Lidas</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-5xl font-bold text-primary" style={{ fontFamily: 'var(--font-cinzel)' }}>
              {stats.totalPagesRead}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}