import { prisma } from "@/lib/prisma";
import EditBookForm from "@/components/EditBookForm";

interface Params {
  id: string;
}

export default async function EditBookPage({ params }: { params: Params }) {
  const book = await prisma.book.findUnique({
    where: { id: params.id },
    include: { genre: true },
  });

  const genres = await prisma.genre.findMany();

  if (!book) {
    return <div className="container mx-auto py-8 text-center">Livro não encontrado</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <EditBookForm book={book} genres={genres} />
    </div>
  );
}
