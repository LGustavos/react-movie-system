'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { ClapperboardIcon, SearchIcon } from './icons';

const NAV_LINKS: { href: string; label: string }[] = [
  { href: '/', label: 'Home' },
  { href: '/favorites', label: 'Favoritos' },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') ?? '';
  const [query, setQuery] = useState(initialQuery);

  // Sincroniza o input quando o usuario navega direto para /search?q=...
  useEffect(() => {
    if (pathname === '/search') {
      setQuery(searchParams.get('q') ?? '');
    }
  }, [pathname, searchParams]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      router.push('/');
      return;
    }
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-surface-950/80 backdrop-blur">
      <div className="container-page flex h-16 items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-accent-500 transition hover:opacity-90"
          aria-label="MovieDB - Ir para a home"
        >
          <ClapperboardIcon className="h-6 w-6" />
          <span className="text-lg font-bold tracking-tight text-slate-100">
            Movie<span className="text-accent-500">DB</span>
          </span>
        </Link>

        <form
          role="search"
          onSubmit={handleSubmit}
          className="mx-auto flex w-full max-w-md items-center"
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
              className="w-full rounded-full border border-white/10 bg-surface-900/80 py-2 pl-9 pr-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/40"
            />
          </div>
        </form>

        <nav aria-label="Principal" className="flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={
                  isActive
                    ? 'rounded-md bg-brand-500 px-3 py-1.5 text-sm font-semibold text-white shadow-card'
                    : 'rounded-md px-3 py-1.5 text-sm font-medium text-slate-300 hover:text-white'
                }
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
