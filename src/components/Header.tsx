'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { PiListBold, PiXBold } from 'react-icons/pi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { ClapperboardIcon } from './ClapperboardIcon';
import { SearchIcon } from './icons';

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/favorites', label: 'Favoritos' },
];

const SEARCH_DEBOUNCE_MS = 400;

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  const [query, setQuery] = useState(urlQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE_MS);

  /**
   * Ultimo termo que este componente colocou na URL. Serve para distinguir
   * uma mudanca de URL causada pela propria digitacao (que nao deve voltar
   * para o input) de uma navegacao externa (voltar/avancar, clique no menu).
   */
  const lastNavigatedRef = useRef(urlQuery);
  // Lido dentro de `navigate` via ref para manter a funcao estavel: assim a
  // busca so dispara quando o termo muda, nunca por troca de rota.
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const navigate = useCallback(
    (term: string) => {
      if (term === lastNavigatedRef.current) return;
      lastNavigatedRef.current = term;

      // Apagar o termo devolve o usuario para a home.
      if (!term) {
        if (pathnameRef.current === '/search') router.replace('/');
        return;
      }

      const url = `/search?q=${encodeURIComponent(term)}`;
      // Refinar a busca substitui a entrada atual para nao poluir o historico;
      // entrar na busca a partir de outra pagina empilha, para o "voltar" funcionar.
      if (pathnameRef.current === '/search') router.replace(url);
      else router.push(url);
    },
    [router],
  );

  // Busca automatica quando o usuario para de digitar.
  useEffect(() => {
    navigate(debouncedQuery.trim());
  }, [debouncedQuery, navigate]);

  // Reflete no input as navegacoes que nao vieram da digitacao.
  useEffect(() => {
    if (urlQuery === lastNavigatedRef.current) return;
    lastNavigatedRef.current = urlQuery;
    setQuery(urlQuery);
  }, [pathname, urlQuery]);

  // Fecha o menu mobile ao trocar de rota (inclusive pela busca).
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Esc fecha o menu, como esperado de um overlay.
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  // Enter busca na hora, sem esperar o debounce.
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate(query.trim());
  };

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface-950/80 backdrop-blur">
      <div className="container-page">
        {/*
         * No mobile a linha quebra: logo + hamburguer em cima, busca ocupando
         * a largura toda embaixo. A partir de md volta a ser uma linha so.
         */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 md:h-16 md:flex-nowrap md:gap-4 md:py-0">
          <Link
            href="/"
            className="mr-auto flex items-center gap-2 text-accent-500 transition hover:opacity-90 md:mr-0"
            aria-label="MovieDB - Ir para a home"
          >
            <ClapperboardIcon className="h-6 w-6 shrink-0 text-lilac-400" aria-hidden />
            <span className="text-lg font-bold tracking-tight">MovieDB</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 md:hidden"
          >
            {menuOpen ? (
              <PiXBold className="h-5 w-5" aria-hidden />
            ) : (
              <PiListBold className="h-5 w-5" aria-hidden />
            )}
          </button>

          <form
            role="search"
            onSubmit={handleSubmit}
            className="order-last w-full md:order-none md:mx-auto md:max-w-md"
          >
            <label htmlFor="global-search" className="sr-only">
              Buscar filmes
            </label>
            <div className="relative w-full">
              <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="global-search"
                type="search"
                name="q"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar filmes..."
                autoComplete="off"
                className="w-full rounded-full border border-white/10 bg-surface-800 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
              />
            </div>
          </form>

          <nav aria-label="Principal" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? 'page' : undefined}
                className={
                  isActive(link.href)
                    ? 'rounded-md bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white shadow-card'
                    : 'rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white'
                }
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {menuOpen && (
          <nav id="menu-mobile" aria-label="Menu principal" className="pb-3 md:hidden">
            <ul className="flex flex-col gap-1 border-t border-white/10 pt-3">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive(link.href) ? 'page' : undefined}
                    className={
                      isActive(link.href)
                        ? 'block rounded-md bg-brand-500 px-3 py-2 text-sm font-semibold text-white'
                        : 'block rounded-md px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white'
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </header>
  );
}
