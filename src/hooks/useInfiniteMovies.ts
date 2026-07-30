'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Movie, PagedResponse } from '@/types/movie';

type Fetcher = (page: number) => Promise<PagedResponse<Movie>>;

interface State {
  movies: Movie[];
  page: number;
  totalPages: number;
  totalResults: number;
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
}

const INITIAL: State = {
  movies: [],
  page: 0,
  totalPages: 1,
  totalResults: 0,
  loading: true,
  loadingMore: false,
  error: null,
};

/**
 * Carrega listas paginadas do TMDB de forma incremental (infinite scroll).
 * O `key` reseta a lista quando muda (ex.: termo de busca).
 * `enabled=false` bloqueia o fetch inicial (util quando ainda nao ha query).
 */
export function useInfiniteMovies(fetcher: Fetcher, key: string, enabled = true) {
  const [state, setState] = useState<State>(INITIAL);
  const requestId = useRef(0);

  const loadPage = useCallback(
    async (nextPage: number) => {
      const myId = ++requestId.current;

      setState((s) => ({
        ...s,
        loading: nextPage === 1,
        loadingMore: nextPage > 1,
        error: null,
      }));

      try {
        const res = await fetcher(nextPage);
        if (myId !== requestId.current) return; // stale
        setState((s) => ({
          movies: nextPage === 1 ? res.results : dedupe([...s.movies, ...res.results]),
          page: res.page,
          totalPages: res.total_pages,
          totalResults: res.total_results,
          loading: false,
          loadingMore: false,
          error: null,
        }));
      } catch (err) {
        if (myId !== requestId.current) return;
        const message = err instanceof Error ? err.message : 'Falha ao carregar filmes.';
        setState((s) => ({ ...s, loading: false, loadingMore: false, error: message }));
      }
    },
    [fetcher],
  );

  useEffect(() => {
    if (!enabled) {
      setState({ ...INITIAL, loading: false });
      return;
    }
    // Mantem a lista anterior montada enquanto a nova key carrega: na busca com
    // debounce isso evita o skeleton piscando a cada pausa na digitacao.
    setState((s) => ({
      ...s,
      page: 0,
      totalPages: 1,
      loading: true,
      loadingMore: false,
      error: null,
    }));
    void loadPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, enabled]);

  const loadMore = useCallback(() => {
    if (state.loading || state.loadingMore) return;
    if (state.page >= state.totalPages) return;
    void loadPage(state.page + 1);
  }, [state.loading, state.loadingMore, state.page, state.totalPages, loadPage]);

  const retry = useCallback(() => {
    void loadPage(state.page || 1);
  }, [loadPage, state.page]);

  const hasMore = state.page < state.totalPages;

  return { ...state, loadMore, retry, hasMore };
}

function dedupe(list: Movie[]): Movie[] {
  const seen = new Set<number>();
  const out: Movie[] = [];
  for (const m of list) {
    if (seen.has(m.id)) continue;
    seen.add(m.id);
    out.push(m);
  }
  return out;
}
