import Link from 'next/link';
import type { ReactNode } from 'react';
import { ClapperboardIcon } from './ClapperboardIcon';

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
      <div className="text-lilac-400">
        {icon ?? <ClapperboardIcon className="h-14 w-14" aria-hidden />}
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-medium text-slate-400">{title}</h2>
        {description && <p className="max-w-md text-sm text-slate-500">{description}</p>}
      </div>
      {cta && (
        <Link href={cta.href} className="btn-primary">
          {cta.label}
        </Link>
      )}
    </div>
  );
}
