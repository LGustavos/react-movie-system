'use client';

import { useMemo, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { MovieGrid } from '@/components/MovieGrid';
import { useFavorites } from '@/contexts/FavoritesContext';
import type { FavoriteMovie } from '@/types/movie';

type SortOption = 'title-asc' | 'title-desc' | 'rating-desc';

const SORT_LABELS: Record<SortOption, string> = {
  'title-asc': 'Título (A-Z)',
  'title-desc': 'Título (Z-A)',
  'rating-desc': 'Nota (maior-menor)',
};

function sortFavorites(list: FavoriteMovie[], sort: SortOption): FavoriteMovie[] {
  const copy = [...list];
  switch (sort) {
    case 'title-asc':
      return copy.sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
    case 'title-desc':
      return copy.sort((a, b) => b.title.localeCompare(a.title, 'pt-BR'));
    case 'rating-desc':
      return copy.sort((a, b) => b.vote_average - a.vote_average);
    default:
      return copy;
  }
}

export default function FavoritesPage() {
  const { favorites, hydrated } = useFavorites();
  const [sort, setSort] = useState<SortOption>('title-asc');

  const sorted = useMemo(() => sortFavorites(favorites, sort), [favorites, sort]);

  if (!hydrated) {
    return (
      <section className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Meus Filmes Favoritos</h1>
        <div className="h-40 animate-pulse rounded-xl bg-surface-800/50" />
      </section>
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        title="Nenhum filme favorito ainda"
        description="Comece explorando filmes populares e adicione seus favoritos!"
        cta={{ label: 'Explorar Filmes', href: '/' }}
      />
    );
  }

  return (
    <section className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-2xl font-bold text-slate-100 sm:text-3xl">Meus Filmes Favoritos</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="favorites-sort" className="text-sm text-slate-400">
            Ordenar por:
          </label>
          <select
            id="favorites-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-md border border-white/10 bg-surface-800 px-3 py-1.5 text-sm text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
          >
            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </header>

      <MovieGrid movies={sorted} actionVariant="remove" />
    </section>
  );
}
