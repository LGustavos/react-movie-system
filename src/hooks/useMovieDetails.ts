'use client';

import { useCallback, useEffect, useState } from 'react';
import { fetchMovieDetails } from '@/services/tmdb';
import type { MovieDetails } from '@/types/movie';

interface State {
  data: MovieDetails | null;
  loading: boolean;
  error: string | null;
}

export function useMovieDetails(id: string | number) {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  const load = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const data = await fetchMovieDetails(id);
      setState({ data, loading: false, error: null });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Nao foi possivel carregar os detalhes do filme.';
      setState({ data: null, loading: false, error: message });
    }
  }, [id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { ...state, retry: load };
}
