import { EmptyState } from '@/components/EmptyState';

export default function NotFound() {
  return (
    <EmptyState
      title="Pagina nao encontrada"
      description="O endereco acessado nao existe ou foi removido."
      cta={{ label: 'Voltar para a home', href: '/' }}
    />
  );
}
