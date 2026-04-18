import { Truck, Package, CheckCircle, Clock, AlertCircle, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const statutLivraisonConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'info' | 'danger' | 'gray' | 'default' | 'purple'; icon: React.ReactNode }> = {
  en_attente: { label: 'En attente', variant: 'gray', icon: <Clock size={12} /> },
  ramasse: { label: 'Ramassé', variant: 'info', icon: <Package size={12} /> },
  en_transit: { label: 'En transit', variant: 'warning', icon: <Truck size={12} /> },
  en_livraison: { label: 'En livraison', variant: 'default', icon: <Truck size={12} /> },
  livre: { label: 'Livré ✓', variant: 'success', icon: <CheckCircle size={12} /> },
  echec: { label: 'Échec', variant: 'danger', icon: <AlertCircle size={12} /> },
  retourne: { label: 'Retourné', variant: 'danger', icon: <AlertCircle size={12} /> },
};

export function Livraisons() {
  const { commandes, transporteurs } = useStore();

  const commandesAvecLivraison = commandes.filter(c =>
    ['confirmee', 'en_preparation', 'expediee', 'livree', 'retournee'].includes(c.statut)
  );

  const stats = {
    enAttente: commandesAvecLivraison.filter(c => !c.statutLivraison || c.statutLivraison === 'en_attente').length,
    enTransit: commandesAvecLivraison.filter(c => c.statutLivraison === 'en_transit').length,
    livrees: commandesAvecLivraison.filter(c => c.statutLivraison === 'livre').length,
    echecs: commandesAvecLivraison.filter(c => c.statutLivraison === 'echec' || c.statutLivraison === 'retourne').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livraisons</h1>
          <p className="text-gray-500 text-sm mt-0.5">{commandesAvecLivraison.length} livraisons à gérer</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-xl text-blue-700 text-xs font-medium">
          <ExternalLink size={12} /> API transporteurs — Prête à connecter
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'En attente', value: stats.enAttente, color: 'text-gray-700 bg-gray-50', border: 'border-gray-200' },
          { label: 'En transit', value: stats.enTransit, color: 'text-amber-700 bg-amber-50', border: 'border-amber-200' },
          { label: 'Livrées', value: stats.livrees, color: 'text-emerald-700 bg-emerald-50', border: 'border-emerald-200' },
          { label: 'Échecs / Retours', value: stats.echecs, color: 'text-red-700 bg-red-50', border: 'border-red-200' },
        ].map(s => (
          <div key={s.label} className={`border ${s.border} rounded-xl p-4 ${s.color.split(' ')[1]} shadow-sm`}>
            <p className="text-2xl font-bold">{s.value}</p>
            <p className={`text-sm ${s.color.split(' ')[0]} font-medium mt-0.5`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Transporteurs */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Transporteurs Partenaires</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {transporteurs.map(t => (
            <div key={t.id} className={`p-4 border rounded-xl ${t.actif ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50 opacity-60'}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Truck size={14} className="text-indigo-600" />
                </div>
                <div className="flex gap-1">
                  <Badge variant={t.actif ? 'success' : 'gray'} size="sm">{t.actif ? 'Actif' : 'Inactif'}</Badge>
                  {t.apiDisponible && <Badge variant="info" size="sm">API</Badge>}
                </div>
              </div>
              <h4 className="font-semibold text-gray-900">{t.nom}</h4>
              <p className="text-sm text-gray-500 mt-0.5">{t.tarifBase} DH/colis</p>
              {t.apiDisponible && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    Intégration API disponible
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Livraisons en cours */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Suivi des Livraisons</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {['Commande', 'Client', 'Ville', 'Transporteur', 'N° Suivi', 'Statut livraison', 'Date expé.'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {commandesAvecLivraison.map(cmd => {
                const statutConfig = cmd.statutLivraison ? statutLivraisonConfig[cmd.statutLivraison] : statutLivraisonConfig['en_attente'];
                return (
                  <tr key={cmd.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-semibold text-indigo-600">{cmd.reference}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{cmd.clientNom}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{cmd.clientVille}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{cmd.transporteurNom || <span className="text-gray-400 italic">Non assigné</span>}</td>
                    <td className="px-4 py-3">
                      {cmd.numeroSuivi ? (
                        <span className="text-xs font-mono bg-gray-100 text-gray-700 px-2 py-1 rounded">{cmd.numeroSuivi}</span>
                      ) : (
                        <span className="text-xs text-gray-400 italic">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {statutConfig && (
                        <Badge variant={statutConfig.variant} size="sm">
                          <span className="flex items-center gap-1">{statutConfig.icon} {statutConfig.label}</span>
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {cmd.dateExpedition
                        ? format(new Date(cmd.dateExpedition), 'dd MMM', { locale: fr })
                        : <span className="text-gray-300">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* API Notice */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-100 rounded-xl">
            <ExternalLink size={20} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">🚀 Intégration API Transporteurs</h3>
            <p className="text-sm text-gray-600 mb-3">
              La structure est prête pour connecter les APIs des transporteurs. Vous pourrez créer des bons de livraison, 
              suivre les colis en temps réel et recevoir les webhooks de statut automatiquement.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { name: 'Amana', status: 'API prête', color: 'bg-emerald-100 text-emerald-700' },
                { name: 'Chronopost', status: 'API prête', color: 'bg-emerald-100 text-emerald-700' },
                { name: 'CTM', status: 'En développement', color: 'bg-amber-100 text-amber-700' },
                { name: 'Barid', status: 'Planifié', color: 'bg-gray-100 text-gray-700' },
              ].map(api => (
                <div key={api.name} className="bg-white border border-blue-100 rounded-lg p-2">
                  <p className="text-xs font-semibold text-gray-900">{api.name}</p>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${api.color}`}>{api.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
