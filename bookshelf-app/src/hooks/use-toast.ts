import { toast } from "sonner";

export const useToast = () => {
  return {
    toast: (options: {
      title?: string;
      description?: string;
      variant?: "default" | "destructive";
    }) => {
      if (options.variant === "destructive") {
        toast.error(options.title || "Erro", {
          description: options.description,
        });
      } else {
        toast.success(options.title || "Sucesso", {
          description: options.description,
        });
      }
    },
  };
};

export { toast };