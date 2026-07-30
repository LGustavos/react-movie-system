import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { FavoriteButton } from '@/components/FavoriteButton';
import { StarIcon } from '@/components/icons';
import { fetchMovieDetailsServer, TmdbNotFoundError } from '@/lib/tmdbServer';
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

async function loadMovie(id: string) {
  try {
    return await fetchMovieDetailsServer(id);
  } catch (err) {
    if (err instanceof TmdbNotFoundError) notFound();
    throw err;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const data = await fetchMovieDetailsServer(id);
    return {
      title: `${data.title} - MovieDB`,
      description: data.overview || data.tagline || `Detalhes do filme ${data.title}.`,
    };
  } catch {
    return { title: 'Filme - MovieDB' };
  }
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadMovie(id);

  const backdrop = buildImageUrl(data.backdrop_path, 'original');
  const posterFallback = buildImageUrl(data.poster_path, 'w500');
  const image = backdrop ?? posterFallback;

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

        <FavoriteButton
          movie={{
            id: data.id,
            title: data.title,
            poster_path: data.poster_path,
            vote_average: data.vote_average,
            release_date: data.release_date,
          }}
        />
      </div>
    </article>
  );
}
