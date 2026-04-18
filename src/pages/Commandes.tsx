import { useState } from 'react';
import { Search, Plus, Filter, Eye, Phone, ChevronDown } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { StatutCommandeBadge, StatutAppelBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import type { Commande, StatutCommande, StatutAppel } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUTS_COMMANDE: StatutCommande[] = [
  'nouvelle', 'en_attente', 'confirmee', 'en_preparation', 'expediee', 'livree', 'refusee', 'retournee', 'annulee'
];

const STATUTS_APPEL: StatutAppel[] = [
  'non_appele', 'en_cours', 'confirme', 'rappel', 'injoignable', 'refuse', 'numero_invalide'
];

const SOURCES = ['Tous', 'Facebook Ads', 'Instagram Ads', 'TikTok Ads', 'Site Web', 'WhatsApp', 'Récurrent'];

export function Commandes() {
  const { commandes, users, produits, updateCommandeStatut, updateCommandeAppel, assignerAgent, addCommande } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [filterSource, setFilterSource] = useState('');
  const [selected, setSelected] = useState<Commande | null>(null);
  const [callModal, setCallModal] = useState<Commande | null>(null);
  const [callStatut, setCallStatut] = useState<StatutAppel>('confirme');
  const [callNote, setCallNote] = useState('');

  const agents = users.filter(u => ['agent', 'manager'].includes(u.role));

  const filtered = commandes.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search || c.reference.toLowerCase().includes(q) || c.clientNom.toLowerCase().includes(q) || c.clientTelephone.includes(q);
    const matchStatut = !filterStatut || c.statut === filterStatut;
    const matchSource = !filterSource || filterSource === 'Tous' || c.source === filterSource;
    return matchSearch && matchStatut && matchSource;
  });

  const handleCallSave = () => {
    if (!callModal) return;
    updateCommandeAppel(callModal.id, callStatut, callNote);
    if (callStatut === 'confirme') updateCommandeStatut(callModal.id, 'confirmee');
    if (callStatut === 'refuse') updateCommandeStatut(callModal.id, 'refusee');
    setCallModal(null);
    setCallNote('');
    setCallStatut('confirme');
  };

  const statutColors: Record<string, string> = {
    nouvelle: 'bg-purple-50 border-purple-200',
    en_attente: 'bg-amber-50 border-amber-200',
    confirmee: 'bg-blue-50 border-blue-200',
    en_preparation: 'bg-indigo-50 border-indigo-200',
    expediee: 'bg-cyan-50 border-cyan-200',
    livree: 'bg-emerald-50 border-emerald-200',
    refusee: 'bg-red-50 border-red-200',
    retournee: 'bg-orange-50 border-orange-200',
    annulee: 'bg-gray-50 border-gray-200',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Commandes</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} commande{filtered.length > 1 ? 's' : ''} · {commandes.length} total</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-indigo-200">
          <Plus size={16} /> Nouvelle commande
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Nouvelles', count: commandes.filter(c => c.statut === 'nouvelle').length, color: 'bg-purple-100 text-purple-700' },
          { label: 'Confirmées', count: commandes.filter(c => c.statut === 'confirmee').length, color: 'bg-blue-100 text-blue-700' },
          { label: 'Expédiées', count: commandes.filter(c => c.statut === 'expediee').length, color: 'bg-cyan-100 text-cyan-700' },
          { label: 'Livrées', count: commandes.filter(c => c.statut === 'livree').length, color: 'bg-emerald-100 text-emerald-700' },
          { label: 'Refusées', count: commandes.filter(c => c.statut === 'refusee').length, color: 'bg-red-100 text-red-700' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-3 text-center shadow-sm">
            <div className={`text-xl font-bold ${s.color.split(' ')[1]}`}>{s.count}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card padding={false}>
        <div className="p-4 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-48">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Référence, client, téléphone..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
            />
          </div>
          <div className="relative">
            <Filter size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterStatut}
              onChange={e => setFilterStatut(e.target.value)}
              className="pl-9 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none bg-white"
            >
              <option value="">Tous les statuts</option>
              {STATUTS_COMMANDE.map(s => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div className="relative">
            <select
              value={filterSource}
              onChange={e => setFilterSource(e.target.value)}
              className="px-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none bg-white"
            >
              {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70 border-t border-gray-100">
              <tr>
                {['Référence', 'Client', 'Ville', 'Articles', 'Total', 'Source', 'Statut', 'Appel', 'Agent', 'Date', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(cmd => (
                <tr key={cmd.id} className={`hover:bg-gray-50/70 transition-colors ${statutColors[cmd.statut] ? '' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="text-sm font-mono font-semibold text-indigo-600">{cmd.reference}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{cmd.clientNom}</p>
                      <p className="text-xs text-gray-500">{cmd.clientTelephone}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{cmd.clientVille}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-gray-600">{cmd.items.length} article{cmd.items.length > 1 ? 's' : ''}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-semibold text-gray-900">{cmd.total.toLocaleString('fr-MA')} DH</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-lg text-gray-600">{cmd.source}</span>
                  </td>
                  <td className="px-4 py-3"><StatutCommandeBadge statut={cmd.statut} /></td>
                  <td className="px-4 py-3"><StatutAppelBadge statut={cmd.statutAppel} /></td>
                  <td className="px-4 py-3 text-xs text-gray-500">{cmd.agentNom || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                    {format(new Date(cmd.dateCreation), 'dd MMM', { locale: fr })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelected(cmd)}
                        className="p-1.5 hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 rounded-lg transition-colors"
                        title="Voir détails"
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        onClick={() => { setCallModal(cmd); setCallStatut(cmd.statutAppel as StatutAppel || 'confirme'); setCallNote(cmd.notesAgent || ''); }}
                        className="p-1.5 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 rounded-lg transition-colors"
                        title="Mettre à jour appel"
                      >
                        <Phone size={14} />
                      </button>
                      <div className="relative group">
                        <button className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg transition-colors">
                          <ChevronDown size={14} />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-10 hidden group-hover:block">
                          {STATUTS_COMMANDE.filter(s => s !== cmd.statut).map(s => (
                            <button
                              key={s}
                              onClick={() => updateCommandeStatut(cmd.id, s)}
                              className="w-full text-left px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl capitalize"
                            >
                              → {s.replace(/_/g, ' ')}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Search size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">Aucune commande trouvée</p>
            </div>
          )}
        </div>
      </Card>

      {/* Detail Modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => setSelected(null)} title={`Commande ${selected.reference}`} size="lg">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Client</h4>
                <p className="font-semibold text-gray-900">{selected.clientNom}</p>
                <p className="text-sm text-gray-600">{selected.clientTelephone}</p>
                <p className="text-sm text-gray-600">{selected.clientVille}</p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Commande</h4>
                <div className="flex items-center gap-2 mb-1"><StatutCommandeBadge statut={selected.statut} /></div>
                <p className="text-sm text-gray-600">Source: {selected.source}</p>
                <p className="text-sm text-gray-600">Date: {format(new Date(selected.dateCreation), 'dd MMMM yyyy', { locale: fr })}</p>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">Articles commandés</h4>
              <div className="border border-gray-100 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Produit', 'Qté', 'Prix unit.', 'Total'].map(h => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {selected.items.map(item => (
                      <tr key={item.id}>
                        <td className="px-4 py-2.5 text-sm text-gray-900">{item.produitNom}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-600">{item.quantite}</td>
                        <td className="px-4 py-2.5 text-sm text-gray-600">{item.prixUnitaire} DH</td>
                        <td className="px-4 py-2.5 text-sm font-semibold text-gray-900">{item.total} DH</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2.5 text-sm text-right text-gray-600">Livraison:</td>
                      <td className="px-4 py-2.5 text-sm text-gray-900">{selected.fraisLivraison} DH</td>
                    </tr>
                    <tr>
                      <td colSpan={3} className="px-4 py-2.5 text-sm font-bold text-right text-gray-900">Total:</td>
                      <td className="px-4 py-2.5 text-base font-bold text-indigo-600">{selected.total} DH</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Assign agent */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Assigner Agent</h4>
              <select
                defaultValue={selected.agentId || ''}
                onChange={e => assignerAgent(selected.id, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="">— Non assigné —</option>
                {agents.map(a => (
                  <option key={a.id} value={a.id}>{a.prenom} {a.nom} ({a.role})</option>
                ))}
              </select>
            </div>

            {selected.notes && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</h4>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl">{selected.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Call Modal */}
      {callModal && (
        <Modal open={!!callModal} onClose={() => setCallModal(null)} title={`Appel — ${callModal.clientNom}`} size="sm">
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-900">{callModal.reference}</p>
              <p className="text-sm text-gray-600 mt-0.5">{callModal.clientTelephone} · {callModal.clientVille}</p>
              <p className="text-sm font-medium text-gray-800 mt-1">{callModal.total.toLocaleString('fr-MA')} DH</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Résultat de l'appel</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUTS_APPEL.map(s => (
                  <button
                    key={s}
                    onClick={() => setCallStatut(s)}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all text-left capitalize ${
                      callStatut === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                    }`}
                  >
                    {s.replace(/_/g, ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes agent</label>
              <textarea
                value={callNote}
                onChange={e => setCallNote(e.target.value)}
                rows={3}
                placeholder="Remarques sur l'appel..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCallModal(null)} className="flex-1 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                Annuler
              </button>
              <button onClick={handleCallSave} className="flex-1 py-2 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium">
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
