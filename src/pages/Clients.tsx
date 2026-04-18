import { useState } from 'react';
import { Search, Plus, Eye, Edit2, Star, Users, MapPin, Phone } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { StatutClientBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { StatutCommandeBadge } from '../components/ui/Badge';
import type { Client } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Clients() {
  const { clients, commandes, updateClient } = useStore();
  const [search, setSearch] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [selected, setSelected] = useState<Client | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Partial<Client>>({});

  const filtered = clients.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = !search
      || `${c.prenom} ${c.nom}`.toLowerCase().includes(q)
      || c.telephone.includes(q)
      || c.ville.toLowerCase().includes(q);
    const matchStatut = !filterStatut || c.statut === filterStatut;
    return matchSearch && matchStatut;
  });

  const getClientCommandes = (clientId: string) =>
    commandes.filter(c => c.clientId === clientId);

  const handleEdit = () => {
    if (!selected) return;
    updateClient(selected.id, editData);
    setSelected({ ...selected, ...editData });
    setEditMode(false);
  };

  const stats = {
    total: clients.length,
    vip: clients.filter(c => c.statut === 'vip').length,
    actifs: clients.filter(c => c.statut === 'actif').length,
    nouveaux: clients.filter(c => c.statut === 'nouveau').length,
  };

  const villes = [...new Set(clients.map(c => c.ville))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="text-gray-500 text-sm mt-0.5">{filtered.length} client{filtered.length > 1 ? 's' : ''} · {clients.length} total</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-indigo-200">
          <Plus size={16} /> Nouveau client
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total clients', count: stats.total, icon: Users, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'VIP', count: stats.vip, icon: Star, color: 'text-amber-600 bg-amber-50' },
          { label: 'Actifs', count: stats.actifs, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Nouveaux', count: stats.nouveaux, icon: Plus, color: 'text-purple-600 bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-lg ${s.color.split(' ')[1]}`}>
              <s.icon size={16} className={s.color.split(' ')[0]} />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900">{s.count}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + Grid */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nom, téléphone, ville..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 bg-white"
          />
        </div>
        <select
          value={filterStatut}
          onChange={e => setFilterStatut(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
        >
          <option value="">Tous statuts</option>
          {['nouveau', 'actif', 'inactif', 'vip', 'blacklist'].map(s => (
            <option key={s} value={s} className="capitalize">{s}</option>
          ))}
        </select>
        <select className="px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white">
          <option value="">Toutes les villes</option>
          {villes.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(client => {
          const cmds = getClientCommandes(client.id);
          return (
            <div
              key={client.id}
              className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all cursor-pointer group"
              onClick={() => { setSelected(client); setEditMode(false); }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    client.statut === 'vip' ? 'bg-amber-100 text-amber-700' :
                    client.statut === 'blacklist' ? 'bg-red-100 text-red-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {client.prenom[0]}{client.nom[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{client.prenom} {client.nom}</p>
                    <p className="text-xs text-gray-500">{client.ville}</p>
                  </div>
                </div>
                <StatutClientBadge statut={client.statut} />
              </div>

              <div className="space-y-1.5 mb-3">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone size={11} /> {client.telephone}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={11} /> {client.adresse ? `${client.adresse}, ` : ''}{client.ville}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-sm font-bold text-gray-900">{client.totalCommandes}</p>
                  <p className="text-xs text-gray-400">Commandes</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-indigo-600">{client.totalDepense.toLocaleString('fr-MA')} DH</p>
                  <p className="text-xs text-gray-400">CA total</p>
                </div>
                <button className="p-1.5 rounded-lg text-gray-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                  <Eye size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Users size={40} className="mx-auto mb-3 opacity-30" />
          <p>Aucun client trouvé</p>
        </div>
      )}

      {/* Client Detail Modal */}
      {selected && (
        <Modal open={!!selected} onClose={() => { setSelected(null); setEditMode(false); }} title="Fiche Client" size="lg">
          <div className="space-y-6">
            {/* Profile header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold ${
                  selected.statut === 'vip' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {selected.prenom[0]}{selected.nom[0]}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{selected.prenom} {selected.nom}</h3>
                  <StatutClientBadge statut={selected.statut} />
                </div>
              </div>
              <button
                onClick={() => { setEditMode(!editMode); setEditData({ notes: selected.notes, statut: selected.statut }); }}
                className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                <Edit2 size={14} /> {editMode ? 'Annuler' : 'Modifier'}
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Commandes', value: selected.totalCommandes },
                { label: 'CA Total', value: `${selected.totalDepense.toLocaleString('fr-MA')} DH` },
                { label: 'Membre depuis', value: format(new Date(selected.dateCreation), 'MMM yyyy', { locale: fr }) },
              ].map(s => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="font-bold text-gray-900">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Contact</h4>
                <div className="space-y-1.5">
                  <p className="text-sm text-gray-900">📞 {selected.telephone}</p>
                  {selected.telephone2 && <p className="text-sm text-gray-600">📞 {selected.telephone2}</p>}
                  {selected.email && <p className="text-sm text-gray-600">✉️ {selected.email}</p>}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Adresse</h4>
                <p className="text-sm text-gray-900">{selected.adresse}</p>
                <p className="text-sm text-gray-600">{selected.ville}, {selected.region}</p>
              </div>
            </div>

            {/* Edit form */}
            {editMode && (
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-3">
                <h4 className="text-sm font-semibold text-blue-900">Modifier le client</h4>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Statut</label>
                  <select
                    value={editData.statut || selected.statut}
                    onChange={e => setEditData(d => ({ ...d, statut: e.target.value as Client['statut'] }))}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  >
                    {['nouveau', 'actif', 'inactif', 'vip', 'blacklist'].map(s => (
                      <option key={s} value={s} className="capitalize">{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-600 mb-1 block">Notes</label>
                  <textarea
                    value={editData.notes || ''}
                    onChange={e => setEditData(d => ({ ...d, notes: e.target.value }))}
                    rows={2}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                  />
                </div>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Enregistrer
                </button>
              </div>
            )}

            {/* Notes */}
            {selected.notes && !editMode && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Notes</h4>
                <p className="text-sm text-gray-700 bg-yellow-50 border border-yellow-100 p-3 rounded-xl">
                  {selected.notes}
                </p>
              </div>
            )}

            {/* Historique commandes */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">
                Historique commandes ({getClientCommandes(selected.id).length})
              </h4>
              <div className="space-y-2">
                {getClientCommandes(selected.id).map(cmd => (
                  <div key={cmd.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-mono font-medium text-indigo-600">{cmd.reference}</p>
                      <p className="text-xs text-gray-500">{format(new Date(cmd.dateCreation), 'dd MMM yyyy', { locale: fr })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{cmd.total.toLocaleString('fr-MA')} DH</p>
                      <StatutCommandeBadge statut={cmd.statut} />
                    </div>
                  </div>
                ))}
                {getClientCommandes(selected.id).length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-3">Aucune commande</p>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
