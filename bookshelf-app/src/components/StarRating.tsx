'use client';

import { Star } from 'lucide-react';
import { useState } from 'react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  size?: number;
}

export function StarRating({ value, onChange, max = 5, size = 24 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex gap-1">
      {Array.from({ length: max }, (_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= (hoverValue || value);

        return (
          <button
            key={starValue}
            type="button"
            onClick={() => onChange(starValue)}
            onMouseEnter={() => setHoverValue(starValue)}
            onMouseLeave={() => setHoverValue(0)}
            className="transition-all duration-200 hover:scale-110 focus:outline-none"
            aria-label={`${starValue} estrela${starValue > 1 ? 's' : ''}`}
          >
            <Star
              size={size}
              className={`transition-colors duration-200 ${
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-none text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        );
      })}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground self-center">
          {value} {value === 1 ? 'estrela' : 'estrelas'}
        </span>
      )}
    </div>
  );
}