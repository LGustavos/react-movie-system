'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useCallback, useMemo } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Loader, MovieGridSkeleton } from '@/components/Loader';
import { MovieGrid } from '@/components/MovieGrid';
import { useInfiniteMovies } from '@/hooks/useInfiniteMovies';
import { useInfiniteScrollAnchor } from '@/hooks/useInfiniteScrollAnchor';
import { searchMovies } from '@/services/tmdb';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const rawQuery = searchParams.get('q') ?? '';
  const query = useMemo(() => rawQuery.trim(), [rawQuery]);

  const fetcher = useCallback((page: number) => searchMovies(query, page), [query]);
  const {
    movies,
    loading,
    loadingMore,
    error,
    hasMore,
    loadMore,
    retry,
    totalResults,
  } = useInfiniteMovies(fetcher, `search:${query}`, query.length > 0);

  const anchorRef = useInfiniteScrollAnchor({
    onIntersect: loadMore,
    enabled: hasMore && !loading && !error,
  });

  if (!query) {
    return (
      <EmptyState
        title="Digite algo para buscar"
        description="Use a barra de busca no topo para encontrar filmes por título."
        cta={{ label: 'Ver filmes populares', href: '/' }}
      />
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">
          Resultados para: <span className="text-accent-400">&ldquo;{query}&rdquo;</span>
        </h1>
        {!loading && !error && (
          <p className="text-sm text-slate-400">
            {totalResults > 0
              ? `Encontrados ${totalResults.toLocaleString('pt-BR')} filme${totalResults === 1 ? '' : 's'}`
              : 'Nenhum filme encontrado.'}
          </p>
        )}
      </header>

      {loading && <MovieGridSkeleton />}

      {!loading && error && (
        <ErrorState message={error} onRetry={retry} title="Erro ao buscar filmes" />
      )}

      {!loading && !error && movies.length === 0 && (
        <EmptyState
          title="Sem resultados"
          description={`Não encontramos nenhum filme para "${query}". Tente outro termo.`}
          cta={{ label: 'Voltar para a home', href: '/' }}
        />
      )}

      {!loading && !error && movies.length > 0 && (
        <MovieGrid movies={movies} highlight={query} />
      )}

      <div ref={anchorRef} aria-hidden="true" className="h-8" />

      {loadingMore && <Loader label="Carregando mais resultados..." />}
    </section>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}
