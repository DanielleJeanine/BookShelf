import { PrismaClient } from '@/generated/prisma';
import { initialBooks } from '../src/lib/data';
import { availableGenres } from '../src/lib/types';

const prisma = new PrismaClient();

async function migrateData() {
  console.log('🚀 Iniciando migração de dados...');

  try {
    // 1. Migrar gêneros
    console.log('📚 Migrando gêneros...');
    const genreMap = new Map<string, string>();

    for (const genreName of availableGenres) {
      const genre = await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName },
      });
      genreMap.set(genreName, genre.id);
      console.log(`✅ Gênero criado: ${genreName}`);
    }

    // 2. Migrar livros
    console.log('📖 Migrando livros...');
    let migratedCount = 0;

    for (const book of initialBooks) {
      try {
        const genreId = book.genreId ? genreMap.get(book.genreId) : undefined;
        const currentPage = book.currentPage || 0;

        let status: 'QUERO_LER' | 'LENDO' | 'LIDO' | 'PAUSADO' | 'ABANDONADO' = 'QUERO_LER';
        if (book.status) {
          status = book.status as any;
        }

        await prisma.book.upsert({
          where: { id: book.id },
          update: {
            title: book.title,
            author: book.author,
            genreId,
            year: book.year,
            pages: book.pages,
            rating: book.rating,
            synopsis: book.synopsis,
            cover: book.cover,
            currentPage,
            status,
            notes: book.notes,
          },
          create: {
            id: book.id,
            title: book.title,
            author: book.author,
            genreId,
            year: book.year,
            pages: book.pages,
            rating: book.rating,
            synopsis: book.synopsis,
            cover: book.cover,
            currentPage,
            status,
            notes: book.notes,
          },
        });

        migratedCount++;
        console.log(`✅ Livro migrado: ${book.title}`);
      } catch (error) {
        console.error(`❌ Erro ao migrar livro "${book.title}":`, error);
      }
    }

    console.log(`🎉 Migração concluída! ${migratedCount} livros migrados.`);

    // 3. Verificar dados migrados
    const totalBooks = await prisma.book.count();
    const totalGenres = await prisma.genre.count();

    console.log(`📊 Estatísticas finais:`);
    console.log(`   - Total de livros: ${totalBooks}`);
    console.log(`   - Total de gêneros: ${totalGenres}`);

  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar migração
migrateData()
  .then(() => {
    console.log('✨ Migração de dados finalizada com sucesso!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Falha na migração:', error);
    process.exit(1);
  });