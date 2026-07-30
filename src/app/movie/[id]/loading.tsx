export default function Loading() {
  return (
    <div role="status" aria-live="polite" className="mx-auto max-w-7xl">
      {/* Reserva a altura do breadcrumb para o conteudo nao pular ao carregar. */}
      <div className="skeleton mb-4 h-5 w-48 rounded" />

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <div className="skeleton aspect-video w-full rounded-2xl" />
        <div className="space-y-5">
          <div className="skeleton h-9 w-3/4 rounded" />
          <div className="skeleton h-4 w-1/2 rounded" />
          <div className="flex gap-2">
            <div className="skeleton h-6 w-16 rounded-full" />
            <div className="skeleton h-6 w-20 rounded-full" />
            <div className="skeleton h-6 w-14 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-full rounded" />
            <div className="skeleton h-4 w-2/3 rounded" />
          </div>
          <div className="skeleton h-10 w-56 rounded-lg" />
        </div>
      </div>

      <span className="sr-only">Carregando detalhes do filme...</span>
    </div>
  );
}
