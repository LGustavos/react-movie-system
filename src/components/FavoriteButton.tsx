'use client';

import { useFavorites } from '@/contexts/FavoritesContext';
import type { FavoriteMovie } from '@/types/movie';
import { HeartIcon } from './icons';

interface FavoriteButtonProps {
  movie: FavoriteMovie;
}

export function FavoriteButton({ movie }: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite, hydrated } = useFavorites();
  const favorited = isFavorite(movie.id);

  return (
    <button
      type="button"
      onClick={() => toggleFavorite(movie)}
      aria-pressed={favorited}
      disabled={!hydrated}
      className={favorited ? 'btn-outline-danger' : 'btn-danger'}
    >
      <HeartIcon filled={favorited} className="h-4 w-4" />
      {favorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
    </button>
  );
}
