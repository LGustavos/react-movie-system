'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useFavorites } from '@/contexts/FavoritesContext';
import { buildImageUrl } from '@/services/tmdb';
import type { FavoriteMovie, Movie } from '@/types/movie';
import { HeartIcon, TrashIcon } from './icons';
import { HighlightText } from './HighlightText';

type CardMovie = Movie | FavoriteMovie;

interface MovieCardProps {
  movie: CardMovie;
  /** Termo a destacar no titulo (usado na pagina de busca). */
  highlight?: string;
  /**
   * "favorite" (default): botao de coracao no canto direito.
   * "remove": lixeira no canto direito (usado na pagina de Favoritos).
   */
  actionVariant?: 'favorite' | 'remove';
  /** Posicao no grid, usada para escalonar a animacao de entrada. */
  index?: number;
}

/** Escalonamento da entrada: reinicia a cada pagina da API (20 itens). */
const STAGGER_STEP_MS = 35;
const STAGGER_PAGE_SIZE = 20;

export function MovieCard({
  movie,
  highlight,
  actionVariant = 'favorite',
  index = 0,
}: MovieCardProps) {
  const { isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const [popping, setPopping] = useState(false);
  const favorited = isFavorite(movie.id);
  // w500: no mobile o card ocupa a linha toda, e w300 apareceria borrado.
  const poster = buildImageUrl(movie.poster_path, 'w500');
  const year = movie.release_date ? movie.release_date.slice(0, 4) : null;

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (actionVariant === 'remove') {
      removeFavorite(movie.id);
      return;
    }
    toggleFavorite(movie);
    // So no clique: cards ja favoritados nao devem pulsar ao montar.
    setPopping(true);
  };

  const actionAriaLabel =
    actionVariant === 'remove'
      ? `Remover ${movie.title} dos favoritos`
      : favorited
        ? `Remover ${movie.title} dos favoritos`
        : `Adicionar ${movie.title} aos favoritos`;

  return (
    <article
      className="group relative flex h-full animate-card-in flex-col overflow-hidden rounded-xl bg-surface-800 shadow-card ring-1 ring-white/5 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/40 hover:ring-brand-500/50"
      style={{ animationDelay: `${(index % STAGGER_PAGE_SIZE) * STAGGER_STEP_MS}ms` }}
    >
      <Link
        href={`/movie/${movie.id}`}
        className="flex flex-1 flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
        aria-label={`Ver detalhes de ${movie.title}`}
      >
        <div className="relative aspect-[2/3] w-full bg-surface-700/60">
          {poster ? (
            <Image
              src={poster}
              alt={`Poster de ${movie.title}`}
              fill
              sizes="(min-width: 1536px) 14vw, (min-width: 1280px) 16vw, (min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 480px) 50vw, 100vw"
              className="object-cover transition duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-slate-500">
              Sem poster
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2 p-3">
          {/* Altura travada em 2 linhas (leading-5 x 2 = h-10): com min-height
              um titulo longo empurrava o badge e vazava do card. */}
          <h3
            className="line-clamp-2 h-10 overflow-hidden break-words text-sm font-semibold leading-5 text-slate-100"
            title={movie.title}
          >
            <HighlightText text={movie.title} highlight={highlight} />
          </h3>
          <div className="mt-auto flex items-center text-xs">
            <span
              className="inline-flex items-center rounded-full bg-accent-500 px-2 py-0.5 font-bold text-surface-950"
              title={year ? `Nota TMDB - ${year}` : 'Nota TMDB'}
            >
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleActionClick}
        aria-label={actionAriaLabel}
        aria-pressed={actionVariant === 'favorite' ? favorited : undefined}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
      >
        {actionVariant === 'remove' ? (
          <TrashIcon className="h-4 w-4" />
        ) : (
          <HeartIcon
            filled={favorited}
            onAnimationEnd={() => setPopping(false)}
            className={`h-4 w-4 ${popping ? 'animate-pop' : ''} ${
              favorited ? 'text-red-500' : 'text-white'
            }`}
          />
        )}
      </button>
    </article>
  );
}
