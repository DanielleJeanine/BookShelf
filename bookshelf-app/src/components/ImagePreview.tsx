'use client';

import { useState, useEffect } from 'react';
import { ImageOff } from 'lucide-react';
import Image from 'next/image';

interface ImagePreviewProps {
  url: string;
  alt?: string;
}

export function ImagePreview({ url, alt = 'Preview da capa' }: ImagePreviewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageUrl, setImageUrl] = useState(url);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImageUrl(url);
  }, [url]);

  if (!url || url.trim() === '') {
    return null;
  }

  if (hasError) {
    return (
      <div className="w-full h-64 bg-muted rounded-lg flex flex-col items-center justify-center gap-2 border-2 border-dashed">
        <ImageOff className="h-12 w-12 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">Não foi possível carregar a imagem</p>
        <p className="text-xs text-muted-foreground">Verifique se a URL está correta</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <p className="text-sm font-medium mb-2">Preview da Capa:</p>
      <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden border">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-contain"
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setHasError(true);
            setIsLoading(false);
          }}
        />
      </div>
    </div>
  );
}