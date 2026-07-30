export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-7xl animate-pulse">
      {/* Reserva a altura do breadcrumb para o conteudo nao pular ao carregar. */}
      <div className="mb-4 h-5 w-48 rounded bg-surface-800/70" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <div className="aspect-video w-full rounded-2xl bg-surface-800/60" />
        <div className="space-y-5">
          <div className="h-9 w-3/4 rounded bg-surface-800/70" />
          <div className="h-4 w-1/2 rounded bg-surface-800/60" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded-full bg-surface-800/70" />
            <div className="h-6 w-20 rounded-full bg-surface-800/70" />
            <div className="h-6 w-14 rounded-full bg-surface-800/70" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-surface-800/60" />
            <div className="h-4 w-full rounded bg-surface-800/60" />
            <div className="h-4 w-2/3 rounded bg-surface-800/60" />
          </div>
          <div className="h-10 w-56 rounded-lg bg-surface-800/70" />
        </div>
      </div>

      <span className="sr-only">Carregando detalhes do filme...</span>
    </div>
  );
}
