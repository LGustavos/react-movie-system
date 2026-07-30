import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

type LinkProps = {
  href: string;
  children: ReactNode;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
} & Record<string, unknown>;

// jsdom nao implementa navegacao; sem isso o clique num link polui o stderr.
vi.mock('next/link', () => ({
  default: ({ href, children, onClick, ...rest }: LinkProps) => (
    <a
      href={href}
      onClick={(e) => {
        e.preventDefault();
        onClick?.(e);
      }}
      {...rest}
    >
      {children}
    </a>
  ),
}));

const pushMock = vi.fn();
const replaceMock = vi.fn();

let pathname = '/';
let searchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock, replace: replaceMock }),
  useSearchParams: () => searchParams,
  usePathname: () => pathname,
}));

/** Coloca o teste na pagina de busca com um termo ja aplicado na URL. */
function onSearchPage(term: string) {
  pathname = '/search';
  searchParams = new URLSearchParams({ q: term });
}

beforeEach(() => {
  pushMock.mockClear();
  replaceMock.mockClear();
  pathname = '/';
  searchParams = new URLSearchParams();
});

describe('Header', () => {
  it('renderiza logo, input de busca e links de navegacao', () => {
    render(<Header />);
    expect(screen.getByLabelText(/moviedb - ir para a home/i)).toBeInTheDocument();
    expect(screen.getByRole('searchbox', { name: /buscar filmes/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Favoritos' })).toHaveAttribute('href', '/favorites');
  });

  it('busca sozinho quando o usuario para de digitar, sem precisar de Enter', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.type(screen.getByRole('searchbox', { name: /buscar filmes/i }), 'aventura');

    await waitFor(() => expect(pushMock).toHaveBeenCalledWith('/search?q=aventura'));
  });

  it('Enter dispara a busca na hora, sem esperar o debounce', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const input = screen.getByRole('searchbox', { name: /buscar filmes/i });
    await user.type(input, 'aventura{Enter}');

    expect(pushMock).toHaveBeenCalledWith('/search?q=aventura');
    expect(pushMock).toHaveBeenCalledTimes(1);
  });

  it('apagar o termo devolve o usuario para a home', async () => {
    onSearchPage('aventura');
    const user = userEvent.setup();
    render(<Header />);

    const input = screen.getByRole('searchbox', { name: /buscar filmes/i });
    expect(input).toHaveValue('aventura');

    await user.clear(input);

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/'));
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('refinar a busca dentro de /search substitui a URL em vez de empilhar historico', async () => {
    onSearchPage('acao');
    const user = userEvent.setup();
    render(<Header />);

    const input = screen.getByRole('searchbox', { name: /buscar filmes/i });
    await user.clear(input);
    await user.type(input, 'drama');

    await waitFor(() => expect(replaceMock).toHaveBeenCalledWith('/search?q=drama'));
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('menu mobile comeca fechado e o hamburguer abre com Home e Favoritos', async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole('button', { name: /abrir menu/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('navigation', { name: /menu principal/i })).not.toBeInTheDocument();

    await user.click(toggle);

    const menu = screen.getByRole('navigation', { name: /menu principal/i });
    expect(within(menu).getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(within(menu).getByRole('link', { name: 'Favoritos' })).toHaveAttribute(
      'href',
      '/favorites',
    );
    expect(screen.getByRole('button', { name: /fechar menu/i })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('menu fecha ao clicar num link e ao apertar Esc', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole('button', { name: /abrir menu/i }));
    const menu = screen.getByRole('navigation', { name: /menu principal/i });
    await user.click(within(menu).getByRole('link', { name: 'Favoritos' }));
    expect(screen.queryByRole('navigation', { name: /menu principal/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /abrir menu/i }));
    expect(screen.getByRole('navigation', { name: /menu principal/i })).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('navigation', { name: /menu principal/i })).not.toBeInTheDocument();
  });

  it('nao navega ao montar com um termo que ja veio da URL', async () => {
    onSearchPage('aventura');
    render(<Header />);

    await new Promise((resolve) => setTimeout(resolve, 600));
    expect(pushMock).not.toHaveBeenCalled();
    expect(replaceMock).not.toHaveBeenCalled();
  });
});
