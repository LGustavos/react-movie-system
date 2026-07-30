'use client';

import { useCallback } from 'react';
import { ErrorState } from '@/components/ErrorState';
import { Loader, MovieGridSkeleton } from '@/components/Loader';
import { MovieGrid } from '@/components/MovieGrid';
import { useInfiniteMovies } from '@/hooks/useInfiniteMovies';
import { useInfiniteScrollAnchor } from '@/hooks/useInfiniteScrollAnchor';
import { fetchPopularMovies } from '@/services/tmdb';

export default function HomePage() {
  const fetcher = useCallback((page: number) => fetchPopularMovies(page), []);
  const { movies, loading, loadingMore, error, hasMore, loadMore, retry } = useInfiniteMovies(
    fetcher,
    'popular',
  );

  const anchorRef = useInfiniteScrollAnchor({
    onIntersect: loadMore,
    enabled: hasMore && !loading && !error,
  });

  return (
    <section>
      {/* O design de referencia leva direto ao grid; o titulo fica so para leitores de tela. */}
      <h1 className="sr-only">Filmes Populares</h1>

      {loading && <MovieGridSkeleton />}

      {!loading && error && (
        <ErrorState
          message={error}
          onRetry={retry}
          title="Não foi possível carregar os filmes populares"
        />
      )}

      {!loading && !error && movies.length > 0 && <MovieGrid movies={movies} />}

      <div ref={anchorRef} aria-hidden="true" className="h-8" />

      {loadingMore && <Loader label="Carregando mais filmes..." />}

      {!hasMore && !loading && movies.length > 0 && (
        <p className="pb-6 text-center text-xs text-slate-500">
          Você chegou ao fim da lista popular.
        </p>
      )}
    </section>
  );
}
