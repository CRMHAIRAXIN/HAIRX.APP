import { cn } from '../../utils/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple' | 'gray';
  size?: 'sm' | 'md';
  className?: string;
}

const variants = {
  default: 'bg-indigo-100 text-indigo-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700',
  gray: 'bg-gray-100 text-gray-600',
};

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center font-medium rounded-full',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}

// Helper pour statut commande
export function StatutCommandeBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    nouvelle: { label: 'Nouvelle', variant: 'purple' },
    en_attente: { label: 'En attente', variant: 'warning' },
    confirmee: { label: 'Confirmée', variant: 'info' },
    en_preparation: { label: 'En prépa.', variant: 'default' },
    expediee: { label: 'Expédiée', variant: 'info' },
    livree: { label: 'Livrée', variant: 'success' },
    refusee: { label: 'Refusée', variant: 'danger' },
    retournee: { label: 'Retournée', variant: 'danger' },
    annulee: { label: 'Annulée', variant: 'gray' },
  };
  const c = config[statut] || { label: statut, variant: 'gray' as const };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

export function StatutAppelBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    non_appele: { label: 'Non appelé', variant: 'gray' },
    en_cours: { label: 'En cours', variant: 'info' },
    confirme: { label: 'Confirmé', variant: 'success' },
    rappel: { label: 'Rappel', variant: 'warning' },
    injoignable: { label: 'Injoignable', variant: 'warning' },
    refuse: { label: 'Refusé', variant: 'danger' },
    numero_invalide: { label: 'N° invalide', variant: 'danger' },
  };
  const c = config[statut] || { label: statut, variant: 'gray' as const };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}

export function StatutClientBadge({ statut }: { statut: string }) {
  const config: Record<string, { label: string; variant: BadgeProps['variant'] }> = {
    nouveau: { label: 'Nouveau', variant: 'purple' },
    actif: { label: 'Actif', variant: 'success' },
    inactif: { label: 'Inactif', variant: 'gray' },
    vip: { label: '⭐ VIP', variant: 'warning' },
    blacklist: { label: '🚫 Blacklist', variant: 'danger' },
  };
  const c = config[statut] || { label: statut, variant: 'gray' as const };
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
