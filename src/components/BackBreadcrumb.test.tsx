import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent, ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BackBreadcrumb } from './BackBreadcrumb';

const backMock = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ back: backMock }),
}));

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

/** window.history.length e read-only; sobrescreve so para o teste. */
function setHistoryLength(length: number) {
  Object.defineProperty(window.history, 'length', { value: length, configurable: true });
}

beforeEach(() => {
  backMock.mockClear();
});

describe('BackBreadcrumb', () => {
  it('mostra a trilha com o titulo da pagina atual', () => {
    setHistoryLength(3);
    render(<BackBreadcrumb current="Supergirl" />);

    expect(screen.getByRole('navigation', { name: /trilha de navegacao/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar/i })).toHaveAttribute('href', '/');
    expect(screen.getByText('Supergirl')).toHaveAttribute('aria-current', 'page');
  });

  it('volta no historico quando o usuario veio de outra pagina', async () => {
    setHistoryLength(3);
    const user = userEvent.setup();
    render(<BackBreadcrumb current="Supergirl" />);

    await user.click(screen.getByRole('link', { name: /voltar/i }));

    expect(backMock).toHaveBeenCalledTimes(1);
  });

  it('sem historico (link direto) navega pelo href em vez de voltar', async () => {
    setHistoryLength(1);
    const user = userEvent.setup();
    render(<BackBreadcrumb current="Supergirl" />);

    await user.click(screen.getByRole('link', { name: /voltar/i }));

    expect(backMock).not.toHaveBeenCalled();
  });
});
