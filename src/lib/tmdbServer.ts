import 'server-only';

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
      'TMDB_TOKEN nao configurado. Copie .env.example para .env.local e preencha o token.',
    );
  }
}
