interface LoaderProps {
  label?: string;
  className?: string;
}

export function Loader({ label = 'Carregando...', className = '' }: LoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`flex items-center justify-center gap-3 py-10 text-slate-400 ${className}`}
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-brand-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/**
 * Skeleton para o grid enquanto a primeira pagina carrega.
 */
export function MovieGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse overflow-hidden rounded-xl bg-surface-800/60 shadow-card"
        >
          <div className="aspect-[2/3] bg-surface-700/60" />
          <div className="space-y-2 p-3">
            <div className="h-3 w-3/4 rounded bg-surface-700/70" />
            <div className="h-3 w-1/3 rounded bg-surface-700/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
