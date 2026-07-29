import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { FavoritesProvider, useFavorites } from './FavoritesContext';
import type { Movie } from '@/types/movie';

const movie: Movie = {
  id: 1,
  title: 'Interstellar',
  original_title: 'Interstellar',
  overview: '',
  poster_path: '/poster.jpg',
  backdrop_path: null,
  release_date: '2014-11-05',
  vote_average: 8.5,
  vote_count: 1000,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

describe('FavoritesContext', () => {
  it('adiciona, remove e detecta favoritos', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(1)).toBe(false);

    act(() => result.current.addFavorite(movie));
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.isFavorite(1)).toBe(true);

    // idempotente - nao duplica
    act(() => result.current.addFavorite(movie));
    expect(result.current.favorites).toHaveLength(1);

    act(() => result.current.removeFavorite(1));
    expect(result.current.favorites).toHaveLength(0);
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it('toggleFavorite alterna entre adicionar e remover', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => result.current.toggleFavorite(movie));
    expect(result.current.isFavorite(1)).toBe(true);

    act(() => result.current.toggleFavorite(movie));
    expect(result.current.isFavorite(1)).toBe(false);
  });

  it('persiste favoritos no localStorage', () => {
    const { result } = renderHook(() => useFavorites(), { wrapper });
    act(() => result.current.addFavorite(movie));

    const stored = window.localStorage.getItem('moviedb:favorites:v1');
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored ?? '[]');
    expect(parsed).toEqual([
      {
        id: 1,
        title: 'Interstellar',
        poster_path: '/poster.jpg',
        vote_average: 8.5,
        release_date: '2014-11-05',
      },
    ]);
  });

  it('hidrata favoritos existentes do localStorage no mount', () => {
    window.localStorage.setItem(
      'moviedb:favorites:v1',
      JSON.stringify([
        {
          id: 42,
          title: 'Duna',
          poster_path: null,
          vote_average: 7.9,
          release_date: '2021-09-15',
        },
      ]),
    );

    const { result } = renderHook(() => useFavorites(), { wrapper });
    expect(result.current.isFavorite(42)).toBe(true);
    expect(result.current.favorites).toHaveLength(1);
    expect(result.current.hydrated).toBe(true);
  });
});
