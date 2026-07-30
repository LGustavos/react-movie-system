'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { PiArrowLeftBold } from 'react-icons/pi';

interface BackBreadcrumbProps {
  /** Titulo da pagina atual, exibido como ultimo item da trilha. */
  current: string;
}

export function BackBreadcrumb({ current }: BackBreadcrumbProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Deixa passar ctrl/cmd/shift-clique e botao do meio (abrir em nova aba).
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    // Sem historico (link compartilhado, aba nova) o href="/" assume.
    if (window.history.length <= 1) return;

    e.preventDefault();
    // Volta de onde o usuario veio - busca ou favoritos - preservando o termo
    // buscado e a posicao do scroll, o que um link fixo para a home perderia.
    router.back();
  };

  return (
    <nav aria-label="Trilha de navegacao" className="mb-4">
      <ol className="flex min-w-0 items-center gap-2 text-sm">
        <li className="shrink-0">
          <Link
            href="/"
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 font-medium text-slate-400 transition hover:text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
          >
            <PiArrowLeftBold className="h-3.5 w-3.5" aria-hidden />
            Voltar
          </Link>
        </li>
        <li aria-hidden="true" className="shrink-0 text-slate-600">
          /
        </li>
        {/* min-w-0 e o que permite o truncate encolher dentro do flex. */}
        <li aria-current="page" className="min-w-0 truncate text-slate-300">
          {current}
        </li>
      </ol>
    </nav>
  );
}
