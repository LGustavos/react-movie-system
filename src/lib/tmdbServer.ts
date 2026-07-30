import 'server-only';
import type { MovieDetails } from '@/types/movie';

/**
 * Configuracao TMDB acessada APENAS no servidor (route handlers e RSC).
 * O token nunca deve chegar ao bundle do cliente.
 */
export const TMDB_API_URL = process.env.TMDB_API_URL ?? 'https://api.themoviedb.org/3';
export const TMDB_LANGUAGE = process.env.TMDB_LANGUAGE ?? 'pt-BR';
export const TMDB_TOKEN = process.env.TMDB_TOKEN ?? '';

export function assertTmdbToken(): void {
  if (!TMDB_TOKEN) {
    throw new Error(
      'TMDB_TOKEN não configurado. Copie .env.example para .env.local e preencha o token.',
    );
  }
}

export class TmdbNotFoundError extends Error {
  constructor(message = 'Filme não encontrado.') {
    super(message);
    this.name = 'TmdbNotFoundError';
  }
}

/**
 * Busca detalhes de um filme direto no TMDB (uso em Server Components).
 * Lanca TmdbNotFoundError em 404 para o caller chamar notFound().
 */
export async function fetchMovieDetailsServer(id: string | number): Promise<MovieDetails> {
  assertTmdbToken();
  const url = `${TMDB_API_URL}/movie/${id}?language=${encodeURIComponent(TMDB_LANGUAGE)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${TMDB_TOKEN}`,
      Accept: 'application/json',
    },
    next: { revalidate: 60 },
  });
  if (res.status === 404) throw new TmdbNotFoundError();
  if (!res.ok) throw new Error(`TMDB respondeu ${res.status}`);
  return (await res.json()) as MovieDetails;
}
