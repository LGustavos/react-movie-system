'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ErrorState } from '@/components/ErrorState';
import { HeartIcon, StarIcon } from '@/components/icons';
import { Loader } from '@/components/Loader';
import { useFavorites } from '@/contexts/FavoritesContext';
import { useMovieDetails } from '@/hooks/useMovieDetails';
import { buildImageUrl } from '@/services/tmdb';

function formatDate(date: string): string {
  if (!date) return 'Nao informada';
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function MovieDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { data, loading, error, retry } = useMovieDetails(id);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (loading) {
    return <Loader label="Carregando detalhes do filme..." />;
  }

  if (error || !data) {
    return (
      <ErrorState
        title="Nao foi possivel carregar o filme"
        message={error ?? 'Filme nao encontrado.'}
        onRetry={retry}
      />
    );
  }

  const backdrop = buildImageUrl(data.backdrop_path, 'original');
  const posterFallback = buildImageUrl(data.poster_path, 'w500');
  const image = backdrop ?? posterFallback;
  const favorited = isFavorite(data.id);

  return (
    <article className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-surface-800/60 shadow-card ring-1 ring-white/5">
        {image ? (
          <Image
            src={image}
            alt={`Imagem de ${data.title}`}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover"
            priority
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-slate-500">
            Imagem indisponivel
          </div>
        )}
      </div>

      <div className="space-y-5">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-100 sm:text-4xl">{data.title}</h1>
          {data.tagline && (
            <p className="text-sm italic text-slate-400">&ldquo;{data.tagline}&rdquo;</p>
          )}
          {data.genres.length > 0 && (
            <ul className="flex flex-wrap gap-2" aria-label="Generos">
              {data.genres.map((g) => (
                <li
                  key={g.id}
                  className="rounded-full bg-brand-500/90 px-3 py-1 text-xs font-semibold text-white"
                >
                  {g.name}
                </li>
              ))}
            </ul>
          )}
        </header>

        <dl className="grid grid-cols-1 gap-3 text-sm">
          <div>
            <dt className="font-semibold text-slate-100">Data de lancamento:</dt>
            <dd className="text-slate-300">{formatDate(data.release_date)}</dd>
          </div>
          <div className="flex items-center gap-2">
            <dt className="font-semibold text-slate-100">Nota TMDB:</dt>
            <dd>
              <span className="inline-flex items-center gap-1 rounded-full bg-accent-500/90 px-2.5 py-0.5 text-xs font-semibold text-surface-950">
                <StarIcon className="h-3 w-3" />
                {data.vote_average.toFixed(1)}
              </span>
              <span className="ml-2 text-xs text-slate-400">
                ({data.vote_count.toLocaleString('pt-BR')} votos)
              </span>
            </dd>
          </div>
        </dl>

        <section>
          <h2 className="mb-1 text-base font-semibold text-slate-100">Sinopse</h2>
          <p className="text-sm leading-relaxed text-slate-300">
            {data.overview || 'Sinopse nao disponivel em portugues.'}
          </p>
        </section>

        <button
          type="button"
          onClick={() => toggleFavorite(data)}
          aria-pressed={favorited}
          className={
            favorited
              ? 'btn-danger'
              : 'btn-primary'
          }
        >
          <HeartIcon filled={favorited} className="h-4 w-4" />
          {favorited ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
        </button>
      </div>
    </article>
  );
}
