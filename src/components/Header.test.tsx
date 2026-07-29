import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

const pushMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renderiza logo, input de busca e links de navegacao', () => {
    render(<Header />);
    expect(screen.getByLabelText(/moviedb - ir para a home/i)).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /buscar filmes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Favoritos' })).toHaveAttribute('href', '/favorites');
  });

  it('envia usuario para /search?q= ao submeter busca', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const input = screen.getByRole('searchbox', { name: /buscar filmes/i });
    await user.type(input, 'aventura{Enter}');

    expect(pushMock).toHaveBeenCalledWith('/search?q=aventura');
  });

  it('busca vazia redireciona para home', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const input = screen.getByRole('searchbox', { name: /buscar filmes/i });
    await user.type(input, '   {Enter}');

    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
