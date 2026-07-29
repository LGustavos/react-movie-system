import Link from 'next/link';
import type { ReactNode } from 'react';
import { ClapperboardIcon } from './icons';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  cta,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 text-center ${className}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-500">
        {icon ?? <ClapperboardIcon className="h-8 w-8" />}
      </div>
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-100">{title}</h2>
        {description && <p className="max-w-md text-sm text-slate-400">{description}</p>}
      </div>
      {cta && (
        <Link href={cta.href} className="btn-primary">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
