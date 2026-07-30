import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useInfiniteMovies } from './useInfiniteMovies';
import type { Movie, PagedResponse } from '@/types/movie';

function makeMovie(id: number, overrides: Partial<Movie> = {}): Movie {
  return {
    id,
    title: `Filme ${id}`,
    original_title: `Filme ${id}`,
    overview: '',
    poster_path: null,
    backdrop_path: null,
    release_date: '2024-01-01',
    vote_average: 7,
    vote_count: 100,
    ...overrides,
  };
}

function makePage(page: number, ids: number[], totalPages = 3): PagedResponse<Movie> {
  return {
    page,
    results: ids.map((id) => makeMovie(id)),
    total_pages: totalPages,
    total_results: totalPages * ids.length,
  };
}

describe('useInfiniteMovies', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('carrega a primeira pagina no mount', async () => {
    const fetcher = vi.fn().mockResolvedValue(makePage(1, [1, 2, 3]));
    const { result } = renderHook(() => useInfiniteMovies(fetcher, 'k'));

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(fetcher).toHaveBeenCalledWith(1);
    expect(result.current.movies).toHaveLength(3);
    expect(result.current.hasMore).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('loadMore append proxima pagina e deduplica', async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(makePage(1, [1, 2]))
      .mockResolvedValueOnce(makePage(2, [2, 3])); // 2 duplicado

    const { result } = renderHook(() => useInfiniteMovies(fetcher, 'k'));
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.loadMore());
    await waitFor(() => expect(result.current.loadingMore).toBe(false));

    expect(result.current.movies.map((m) => m.id)).toEqual([1, 2, 3]);
    expect(fetcher).toHaveBeenNthCalledWith(2, 2);
  });

  it('define error quando fetcher falha e retry recupera', async () => {
    const fetcher = vi
      .fn()
      .mockRejectedValueOnce(new Error('boom'))
      .mockResolvedValueOnce(makePage(1, [1]));

    const { result } = renderHook(() => useInfiniteMovies(fetcher, 'k'));
    await waitFor(() => expect(result.current.error).toBe('boom'));

    act(() => result.current.retry());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.movies).toHaveLength(1);
  });

  it('enabled=false nao dispara fetch e nao fica em loading eterno', async () => {
    const fetcher = vi.fn();
    const { result } = renderHook(() => useInfiniteMovies(fetcher, 'k', false));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(fetcher).not.toHaveBeenCalled();
    expect(result.current.movies).toHaveLength(0);
  });

  it('nao trava em loading quando key muda com request em voo (regressao bug #1)', async () => {
    // Fetch da key "a" trava propositalmente. Se o guard antigo inFlight
    // ainda existisse, a request de "b" nunca sairia e loading ficaria true.
    let resolveA: (v: PagedResponse<Movie>) => void = () => {};
    const slowA = new Promise<PagedResponse<Movie>>((r) => {
      resolveA = r;
    });
    const fastB = Promise.resolve(makePage(1, [99]));

    const fetcher = vi
      .fn<(page: number) => Promise<PagedResponse<Movie>>>()
      .mockImplementationOnce(() => slowA)
      .mockImplementationOnce(() => fastB);

    const { result, rerender } = renderHook(
      ({ key }) => useInfiniteMovies(fetcher, key),
      { initialProps: { key: 'a' } },
    );

    // troca a key antes de "a" resolver
    rerender({ key: 'b' });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.movies).toEqual([expect.objectContaining({ id: 99 })]);

    // resolve a antiga - nao deve sobrescrever o resultado da nova
    act(() => resolveA(makePage(1, [1, 2, 3])));
    await new Promise((r) => setTimeout(r, 0));
    expect(result.current.movies).toEqual([expect.objectContaining({ id: 99 })]);
  });

  it('hasMore=false quando page alcanca totalPages', async () => {
    const fetcher = vi.fn().mockResolvedValue(makePage(1, [1], 1));
    const { result } = renderHook(() => useInfiniteMovies(fetcher, 'k'));

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.hasMore).toBe(false);
  });
});
