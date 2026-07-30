import type { FavoriteMovie, Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

interface MovieGridProps {
  movies: (Movie | FavoriteMovie)[];
  highlight?: string;
  actionVariant?: 'favorite' | 'remove';
}

export function MovieGrid({ movies, highlight, actionVariant }: MovieGridProps) {
  return (
    <div className="movie-grid">
      {movies.map((movie, index) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          index={index}
          highlight={highlight}
          actionVariant={actionVariant}
        />
      ))}
    </div>
  );
}
