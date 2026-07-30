'use client';

import { useEffect } from 'react';
import { ErrorState } from '@/components/ErrorState';

export default function MovieDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[movie/[id]] erro no server component:', error);
  }, [error]);

  return (
    <ErrorState
      title="Não foi possível carregar o filme"
      message={error.message || 'Ocorreu um erro inesperado ao buscar os detalhes.'}
      onRetry={reset}
    />
  );
}
