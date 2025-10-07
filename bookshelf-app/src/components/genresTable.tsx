"use client";

import { useState } from "react";
import { Genre } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Plus, Check, X } from "lucide-react";
import {
  deleteGenreAction,
  createGenreAction,
  updateGenreAction,
} from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface GenresTableProps {
  genres: Genre[];
}

export function GenresTable({ genres }: GenresTableProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [newGenreName, setNewGenreName] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = (genre: Genre) => {
    setEditingId(genre.id);
    setEditingName(genre.name);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleSaveEdit = async (id: string) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", editingName);

    const result = await updateGenreAction(null, formData);

    if (result.success) {
      toast.success(result.message);
      setEditingId(null);
      setEditingName("");

      router.refresh();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o gênero "${name}"?`)) {
      return;
    }

    setIsLoading(true);
    const result = await deleteGenreAction(id);

    if (result.success) {
      toast.success(result.message);

      router.refresh();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  const handleAddGenre = async () => {
    if (!newGenreName.trim()) {
      toast.error("Digite um nome para o gênero");
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", newGenreName);

    const result = await createGenreAction(null, formData);

    if (result.success) {
      toast.success(result.message);
      setNewGenreName("");
      setIsAdding(false);

      router.refresh();
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      toast.error(result.message);
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-4">
      {!isAdding && (
        <Button
          onClick={() => setIsAdding(true)}
          className="w-full"
          disabled={isLoading}
        >
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Novo Gênero
        </Button>
      )}

      {isAdding && (
        <div className="flex gap-2 p-4 bg-muted rounded-lg">
          <Input
            placeholder="Nome do novo gênero..."
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isLoading) handleAddGenre();
              if (e.key === "Escape") {
                setIsAdding(false);
                setNewGenreName("");
              }
            }}
            disabled={isLoading}
            autoFocus
          />
          <Button
            onClick={handleAddGenre}
            size="icon"
            variant="default"
            disabled={isLoading}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              setIsAdding(false);
              setNewGenreName("");
            }}
            size="icon"
            variant="outline"
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="border rounded-lg overflow-hidden w-full">
        <table className="w-full sm:w-auto">
          <thead className="bg-muted w-full sm:w-auto">
            <tr>
              <th className="w-full text-left p-4 font-semibold">Nome do Gênero</th>
              <th className=" text-right p-4 font-semibold w-32">Ações</th>
            </tr>
          </thead>
          <tbody>
            {genres.length === 0 ? (
              <tr>
                <td
                  colSpan={2}
                  className="text-center p-8 text-muted-foreground"
                >
                  Nenhum gênero cadastrado. Adicione o primeiro!
                </td>
              </tr>
            ) : (
              genres.map((genre) => (
                <tr key={genre.id} className="border-t hover:bg-muted/50">
                  <td className="p-4">
                    {editingId === genre.id ? (
                      <Input
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !isLoading)
                            handleSaveEdit(genre.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        disabled={isLoading}
                        autoFocus
                      />
                    ) : (
                      <span className="font-medium">{genre.name}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      {editingId === genre.id ? (
                        <>
                          <Button
                            onClick={() => handleSaveEdit(genre.id)}
                            size="icon"
                            variant="default"
                            disabled={isLoading}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleCancelEdit}
                            size="icon"
                            variant="outline"
                            disabled={isLoading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleEdit(genre)}
                            size="icon"
                            variant="outline"
                            disabled={isLoading}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => handleDelete(genre.id, genre.name)}
                            size="icon"
                            variant="destructive"
                            disabled={isLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-muted-foreground">
        Total: {genres.length} {genres.length === 1 ? "gênero" : "gêneros"}
      </p>

      {isLoading && (
        <p className="text-sm text-muted-foreground text-center">
          Processando... aguarde
        </p>
      )}
    </div>
  );
}
