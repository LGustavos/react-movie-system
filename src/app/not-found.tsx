import { EmptyState } from '@/components/EmptyState';

export default function NotFound() {
  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço acessado não existe ou foi removido."
      cta={{ label: 'Voltar para a home', href: '/' }}
    />
  );
}
