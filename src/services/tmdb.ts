import axios, { AxiosError } from 'axios';
import type { Movie, MovieDetails, PagedResponse } from '@/types/movie';

/**
 * Cliente HTTP para o proxy interno /api/tmdb. Nao envia o token TMDB;
 * este e injetado exclusivamente no route handler do servidor.
 */
const http = axios.create({
  baseURL: '/api/tmdb',
  timeout: 10_000,
});

http.interceptors.response.use(
  (r) => r,
  (error: AxiosError<{ error?: string }>) => {
    const message =
      error.response?.data?.error ??
      error.message ??
      'Nao foi possivel comunicar com o servico de filmes.';
    return Promise.reject(new Error(message));
  },
);

export async function fetchPopularMovies(page = 1): Promise<PagedResponse<Movie>> {
  const { data } = await http.get<PagedResponse<Movie>>('/movie/popular', {
    params: { page },
  });
  return data;
}

export async function searchMovies(query: string, page = 1): Promise<PagedResponse<Movie>> {
  const { data } = await http.get<PagedResponse<Movie>>('/search/movie', {
    params: { query, page, include_adult: false },
  });
  return data;
}

export async function fetchMovieDetails(id: number | string): Promise<MovieDetails> {
  const { data } = await http.get<MovieDetails>(`/movie/${id}`);
  return data;
}

/**
 * Constroi a URL absoluta de uma imagem servida pelo CDN da TMDB.
 * Retorna null quando o path nao existe, para o consumidor exibir fallback.
 */
export function buildImageUrl(
  path: string | null | undefined,
  size: 'w300' | 'w500' | 'original' = 'w300',
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
