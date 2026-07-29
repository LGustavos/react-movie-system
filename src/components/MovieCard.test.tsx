import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { FavoritesProvider, useFavorites } from '@/contexts/FavoritesContext';
import type { Movie } from '@/types/movie';
import { MovieCard } from './MovieCard';

const movie: Movie = {
  id: 99,
  title: 'Blade Runner 2049',
  original_title: 'Blade Runner 2049',
  overview: '',
  poster_path: '/blade.jpg',
  backdrop_path: null,
  release_date: '2017-10-06',
  vote_average: 8.0,
  vote_count: 500,
};

const wrapper = ({ children }: { children: ReactNode }) => (
  <FavoritesProvider>{children}</FavoritesProvider>
);

function FavStatus() {
  const { isFavorite } = useFavorites();
  return <span data-testid="fav-status">{isFavorite(movie.id) ? 'yes' : 'no'}</span>;
}

describe('MovieCard', () => {
  it('exibe titulo, nota e link para detalhes', () => {
    render(<MovieCard movie={movie} />, { wrapper });

    expect(screen.getByRole('heading', { name: /blade runner 2049/i })).toBeInTheDocument();
    expect(screen.getByText('8.0')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /ver detalhes de blade runner 2049/i })).toHaveAttribute(
      'href',
      '/movie/99',
    );
  });

  it('alterna favorito ao clicar no botao de coracao', async () => {
    const user = userEvent.setup();
    render(
      <>
        <MovieCard movie={movie} />
        <FavStatus />
      </>,
      { wrapper },
    );

    expect(screen.getByTestId('fav-status')).toHaveTextContent('no');
    const button = screen.getByRole('button', { name: /adicionar blade runner 2049 aos favoritos/i });
    await user.click(button);
    expect(screen.getByTestId('fav-status')).toHaveTextContent('yes');

    const removeButton = screen.getByRole('button', {
      name: /remover blade runner 2049 dos favoritos/i,
    });
    await user.click(removeButton);
    expect(screen.getByTestId('fav-status')).toHaveTextContent('no');
  });

  it('variante "remove" exibe lixeira e remove diretamente', async () => {
    const user = userEvent.setup();

    function Setup() {
      const { addFavorite } = useFavorites();
      return (
        <>
          <button type="button" onClick={() => addFavorite(movie)}>
            seed
          </button>
          <MovieCard movie={movie} actionVariant="remove" />
          <FavStatus />
        </>
      );
    }

    render(<Setup />, { wrapper });
    await user.click(screen.getByRole('button', { name: 'seed' }));
    expect(screen.getByTestId('fav-status')).toHaveTextContent('yes');

    await user.click(
      screen.getByRole('button', { name: /remover blade runner 2049 dos favoritos/i }),
    );
    expect(screen.getByTestId('fav-status')).toHaveTextContent('no');
  });

  it('destaca o termo buscado no titulo', () => {
    render(<MovieCard movie={movie} highlight="blade" />, { wrapper });
    const mark = document.querySelector('mark');
    expect(mark).not.toBeNull();
    expect(mark).toHaveTextContent('Blade');
  });
});
