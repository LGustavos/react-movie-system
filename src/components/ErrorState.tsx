interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Algo deu errado',
  message,
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-8 text-center ${className}`}
    >
      <h2 className="text-lg font-semibold text-red-300">{title}</h2>
      <p className="max-w-md text-sm text-slate-300">{message}</p>
      {onRetry && (
        <button type="button" className="btn-primary mt-2" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
