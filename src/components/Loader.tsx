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
export function MovieGridSkeleton({ count = 14 }: { count?: number }) {
  return (
    <div className="movie-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="overflow-hidden rounded-xl bg-surface-800/60 shadow-card">
          <div className="skeleton aspect-[2/3]" />
          {/* Mesma estrutura do MovieCard (titulo de 2 linhas + badge) para nao pular no lugar. */}
          <div className="flex flex-col gap-2 p-3">
            <div className="h-10 space-y-1.5">
              <div className="skeleton h-3.5 w-11/12 rounded" />
              <div className="skeleton h-3.5 w-2/3 rounded" />
            </div>
            <div className="skeleton h-5 w-10 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
