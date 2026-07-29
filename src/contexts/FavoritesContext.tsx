'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { FavoriteMovie, Movie } from '@/types/movie';

const STORAGE_KEY = 'moviedb:favorites:v1';

interface FavoritesContextValue {
  favorites: FavoriteMovie[];
  isFavorite: (id: number) => boolean;
  addFavorite: (movie: Movie | FavoriteMovie) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (movie: Movie | FavoriteMovie) => void;
  clearFavorites: () => void;
  hydrated: boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

function toFavorite(movie: Movie | FavoriteMovie): FavoriteMovie {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
  };
}

function loadFromStorage(): FavoriteMovie[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is FavoriteMovie => typeof m === 'object' && m !== null && 'id' in m,
    );
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hidrata do localStorage no mount (evita mismatch SSR).
  useEffect(() => {
    setFavorites(loadFromStorage());
    setHydrated(true);
  }, []);

  // Persiste toda mutacao apos hidratacao.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // storage cheio ou bloqueado - falha silenciosa e o estado em memoria segue funcionando
    }
  }, [favorites, hydrated]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((m) => m.id === id),
    [favorites],
  );

  const addFavorite = useCallback((movie: Movie | FavoriteMovie) => {
    setFavorites((prev) => (prev.some((m) => m.id === movie.id) ? prev : [...prev, toFavorite(movie)]));
  }, []);

  const removeFavorite = useCallback((id: number) => {
    setFavorites((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const toggleFavorite = useCallback((movie: Movie | FavoriteMovie) => {
    setFavorites((prev) => {
      const exists = prev.some((m) => m.id === movie.id);
      return exists ? prev.filter((m) => m.id !== movie.id) : [...prev, toFavorite(movie)];
    });
  }, []);

  const clearFavorites = useCallback(() => setFavorites([]), []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      isFavorite,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      clearFavorites,
      hydrated,
    }),
    [favorites, isFavorite, addFavorite, removeFavorite, toggleFavorite, clearFavorites, hydrated],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites deve ser usado dentro de <FavoritesProvider>.');
  }
  return ctx;
}
