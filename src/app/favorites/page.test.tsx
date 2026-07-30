import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { ReactNode } from 'react';
import FavoritesPage from './page';
import { FavoritesProvider } from '@/contexts/FavoritesContext';
import type { FavoriteMovie } from '@/types/movie';

const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

function seedFavorites(list: FavoriteMovie[]) {
  window.localStorage.setItem('moviedb:favorites:v1', JSON.stringify(list));
}

describe('FavoritesPage', () => {
  it('renderiza estado vazio quando nao ha favoritos', async () => {
    render(<FavoritesPage />, { wrapper });
    expect(await screen.findByText(/nenhum filme favorito ainda/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /explorar filmes/i })).toHaveAttribute('href', '/');
  });

  it('lista favoritos hidratados do localStorage', async () => {
    seedFavorites([
      { id: 1, title: 'Duna', poster_path: null, vote_average: 8.1, release_date: '2021-09-15' },
      { id: 2, title: 'Arrival', poster_path: null, vote_average: 7.9, release_date: '2016-11-11' },
    ]);

    render(<FavoritesPage />, { wrapper });
    expect(await screen.findByRole('heading', { name: /meus filmes favoritos/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/ordenar por:/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /duna/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: /arrival/i })).toBeInTheDocument();
  });

  it('ordena por titulo (Z-A) quando o select muda', async () => {
    seedFavorites([
      { id: 1, title: 'Amelie', poster_path: null, vote_average: 8.0, release_date: '2001-04-25' },
      { id: 2, title: 'Zodiac', poster_path: null, vote_average: 7.7, release_date: '2007-03-02' },
    ]);
    const user = userEvent.setup();

    render(<FavoritesPage />, { wrapper });
    await screen.findByRole('heading', { name: /meus filmes favoritos/i });

    const select = screen.getByLabelText(/ordenar por:/i);
    await user.selectOptions(select, 'title-desc');

    const titles = screen
      .getAllByRole('heading', { level: 3 })
      .map((h) => h.textContent?.trim());
    expect(titles).toEqual(['Zodiac', 'Amelie']);
  });

  it('cada card exibe botao de remover (variant remove)', async () => {
    seedFavorites([
      { id: 1, title: 'Duna', poster_path: null, vote_average: 8.1, release_date: '2021-09-15' },
    ]);

    render(<FavoritesPage />, { wrapper });
    const card = await screen.findByRole('article');
    expect(
      within(card).getByRole('button', { name: /remover duna dos favoritos/i }),
    ).toBeInTheDocument();
  });
});
