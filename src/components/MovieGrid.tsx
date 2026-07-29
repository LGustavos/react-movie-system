import type { FavoriteMovie, Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: (Movie | FavoriteMovie)[];
  highlight?: string;
  actionVariant?: 'favorite' | 'remove';
}

export function MovieGrid({ movies, highlight, actionVariant }: MovieGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          highlight={highlight}
          actionVariant={actionVariant}
        />
      ))}
    </div>
  );
}
