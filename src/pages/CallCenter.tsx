import { useState } from 'react';
import { Phone, PhoneCall, PhoneOff, Clock, CheckCircle, XCircle, AlertCircle, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { StatutAppelBadge, StatutCommandeBadge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import type { Commande, StatutAppel } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const STATUTS_APPEL: { value: StatutAppel; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'confirme', label: 'Confirmé', icon: <CheckCircle size={14} />, color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  { value: 'refuse', label: 'Refusé', icon: <XCircle size={14} />, color: 'bg-red-100 text-red-700 border-red-200' },
  { value: 'rappel', label: 'Rappel', icon: <Clock size={14} />, color: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'injoignable', label: 'Injoignable', icon: <PhoneOff size={14} />, color: 'bg-gray-100 text-gray-700 border-gray-200' },
  { value: 'en_cours', label: 'En cours', icon: <PhoneCall size={14} />, color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'numero_invalide', label: 'N° invalide', icon: <AlertCircle size={14} />, color: 'bg-red-100 text-red-700 border-red-200' },
];

export function CallCenter() {
  const { commandes, users, currentUser, updateCommandeAppel, updateCommandeStatut } = useStore();
  const [activeTab, setActiveTab] = useState<'leads' | 'mes_appels' | 'performance'>('leads');
  const [callModal, setCallModal] = useState<Commande | null>(null);
  const [callStatut, setCallStatut] = useState<StatutAppel>('confirme');
  const [callNote, setCallNote] = useState('');
  const [rappelDate, setRappelDate] = useState('');
  const [filterStatut, setFilterStatut] = useState('');

  const agents = users.filter(u => ['agent', 'manager'].includes(u.role));
  const isAgent = currentUser?.role === 'agent';

  // Leads à traiter
  const leads = commandes.filter(c => {
    const needsCall = ['non_appele', 'injoignable', 'rappel', 'en_cours'].includes(c.statutAppel);
    const notDone = !['livree', 'annulee'].includes(c.statut);
    const myFilter = isAgent ? c.agentId === currentUser?.id || !c.agentId : true;
    const statutFilter = !filterStatut || c.statutAppel === filterStatut;
    return needsCall && notDone && myFilter && statutFilter;
  });

  // Mes appels du jour
  const mesAppels = commandes.filter(c =>
    c.agentId === currentUser?.id && ['confirme', 'refuse', 'rappel', 'injoignable'].includes(c.statutAppel)
  );

  const handleCallSave = () => {
    if (!callModal) return;
    updateCommandeAppel(callModal.id, callStatut, callNote);
    if (callStatut === 'confirme') updateCommandeStatut(callModal.id, 'confirmee');
    if (callStatut === 'refuse') updateCommandeStatut(callModal.id, 'refusee');
    setCallModal(null);
    setCallNote('');
    setCallStatut('confirme');
    setRappelDate('');
  };

  // Stats agents
  const agentStats = agents.map(agent => {
    const agentCmds = commandes.filter(c => c.agentId === agent.id);
    const confirmes = agentCmds.filter(c => c.statutAppel === 'confirme').length;
    const refuses = agentCmds.filter(c => c.statutAppel === 'refuse').length;
    const injoignables = agentCmds.filter(c => c.statutAppel === 'injoignable').length;
    const total = agentCmds.length;
    return {
      agent,
      total,
      confirmes,
      refuses,
      injoignables,
      taux: total > 0 ? Math.round((confirmes / total) * 100) : 0,
    };
  });

  // KPIs call center
  const totalLeads = commandes.filter(c => !['annulee', 'livree'].includes(c.statut)).length;
  const confirmes = commandes.filter(c => c.statutAppel === 'confirme').length;
  const nonAppeles = commandes.filter(c => c.statutAppel === 'non_appele').length;
  const rappels = commandes.filter(c => c.statutAppel === 'rappel').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Call Center</h1>
          <p className="text-gray-500 text-sm mt-0.5">{leads.length} lead{leads.length > 1 ? 's' : ''} à traiter</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium">
          <Phone size={14} /> Prêt pour appels
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total leads', value: totalLeads, icon: PhoneCall, color: 'text-indigo-600 bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Confirmés', value: confirmes, icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Non appelés', value: nonAppeles, icon: Phone, color: 'text-purple-600 bg-purple-50', border: 'border-purple-100' },
          { label: 'À rappeler', value: rappels, icon: Clock, color: 'text-amber-600 bg-amber-50', border: 'border-amber-100' },
        ].map(s => (
          <Card key={s.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">{s.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.color.split(' ')[1]}`}>
                <s.icon size={18} className={s.color.split(' ')[0]} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        {[
          { id: 'leads', label: '📋 Leads', count: leads.length },
          { id: 'mes_appels', label: '📞 Mes appels', count: mesAppels.length },
          { id: 'performance', label: '📊 Performance', count: null },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {tab.count !== null && (
              <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full font-bold ${
                activeTab === tab.id ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-600'
              }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* LEADS TAB */}
      {activeTab === 'leads' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setFilterStatut('')} className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors ${!filterStatut ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              Tous ({leads.length})
            </button>
            {['non_appele', 'injoignable', 'rappel', 'en_cours'].map(s => (
              <button key={s} onClick={() => setFilterStatut(s === filterStatut ? '' : s)}
                className={`px-3 py-1.5 text-xs rounded-lg border font-medium transition-colors capitalize ${filterStatut === s ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {s.replace(/_/g, ' ')} ({commandes.filter(c => c.statutAppel === s).length})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {leads.map(cmd => (
              <div key={cmd.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                      <Phone size={16} className="text-indigo-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-xs text-indigo-600 font-semibold">{cmd.reference}</span>
                        <StatutCommandeBadge statut={cmd.statut} />
                        <StatutAppelBadge statut={cmd.statutAppel} />
                      </div>
                      <p className="font-semibold text-gray-900">{cmd.clientNom}</p>
                      <p className="text-sm text-gray-500">📞 {cmd.clientTelephone} · 📍 {cmd.clientVille}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{cmd.total.toLocaleString('fr-MA')} DH</p>
                    <p className="text-xs text-gray-400 mb-2">
                      {format(new Date(cmd.dateCreation), 'dd MMM yyyy', { locale: fr })}
                    </p>
                    <button
                      onClick={() => { setCallModal(cmd); setCallStatut('confirme'); setCallNote(cmd.notesAgent || ''); }}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
                    >
                      <Phone size={12} /> Appeler
                    </button>
                  </div>
                </div>
                {cmd.notesAgent && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 bg-yellow-50 border border-yellow-100 px-3 py-2 rounded-lg">
                      💬 {cmd.notesAgent}
                    </p>
                  </div>
                )}
                <div className="mt-2 flex gap-2 flex-wrap">
                  {cmd.items.map(item => (
                    <span key={item.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg">
                      {item.quantite}× {item.produitNom}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <PhoneCall size={40} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium">Tous les leads sont traités ! 🎉</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MES APPELS TAB */}
      {activeTab === 'mes_appels' && (
        <div className="space-y-3">
          {mesAppels.map(cmd => (
            <div key={cmd.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs text-indigo-600 font-semibold">{cmd.reference}</span>
                  <StatutAppelBadge statut={cmd.statutAppel} />
                </div>
                <p className="font-medium text-gray-900">{cmd.clientNom} · {cmd.clientTelephone}</p>
                {cmd.notesAgent && <p className="text-xs text-gray-500 mt-0.5">💬 {cmd.notesAgent}</p>}
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{cmd.total.toLocaleString('fr-MA')} DH</p>
                <p className="text-xs text-gray-400">{format(new Date(cmd.dateCreation), 'dd MMM', { locale: fr })}</p>
              </div>
            </div>
          ))}
          {mesAppels.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <Phone size={40} className="mx-auto mb-3 opacity-30" />
              <p>Aucun appel enregistré</p>
            </div>
          )}
        </div>
      )}

      {/* PERFORMANCE TAB */}
      {activeTab === 'performance' && (
        <div className="space-y-4">
          {agentStats.sort((a, b) => b.taux - a.taux).map(({ agent, total, confirmes, refuses, injoignables, taux }) => (
            <Card key={agent.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-sm font-bold text-white">
                    {agent.prenom[0]}{agent.nom[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{agent.prenom} {agent.nom}</p>
                    <p className="text-xs text-gray-500 capitalize">{agent.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">{taux}%</p>
                  <p className="text-xs text-gray-500">Taux confirmation</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-3">
                <div
                  className={`h-full rounded-full transition-all ${taux > 70 ? 'bg-emerald-500' : taux > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${taux}%` }}
                />
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: 'Total', value: total, color: 'text-gray-900' },
                  { label: 'Confirmés', value: confirmes, color: 'text-emerald-600' },
                  { label: 'Refusés', value: refuses, color: 'text-red-600' },
                  { label: 'Injoignables', value: injoignables, color: 'text-amber-600' },
                ].map(s => (
                  <div key={s.label} className="text-center p-2 bg-gray-50 rounded-xl">
                    <p className={`font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-gray-400">{s.label}</p>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Call Modal */}
      {callModal && (
        <Modal open={!!callModal} onClose={() => setCallModal(null)} title={`📞 Appel — ${callModal.clientNom}`} size="sm">
          <div className="space-y-4">
            {/* Client info */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs text-indigo-600 font-semibold">{callModal.reference}</span>
                <StatutCommandeBadge statut={callModal.statut} />
              </div>
              <p className="font-semibold text-gray-900 text-lg">{callModal.clientNom}</p>
              <p className="text-indigo-700 font-medium text-lg mt-1">📞 {callModal.clientTelephone}</p>
              <p className="text-sm text-gray-600">📍 {callModal.clientVille}</p>
              <div className="mt-3 pt-3 border-t border-indigo-100">
                {callModal.items.map(item => (
                  <p key={item.id} className="text-sm text-gray-700">• {item.quantite}× {item.produitNom} — {item.total} DH</p>
                ))}
                <p className="font-bold text-gray-900 mt-2 text-right">{callModal.total.toLocaleString('fr-MA')} DH total</p>
              </div>
            </div>

            {/* Résultat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Résultat de l'appel</label>
              <div className="grid grid-cols-2 gap-2">
                {STATUTS_APPEL.map(s => (
                  <button
                    key={s.value}
                    onClick={() => setCallStatut(s.value)}
                    className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                      callStatut === s.value ? 'bg-indigo-600 text-white border-indigo-600' : `${s.color} border hover:opacity-80`
                    }`}
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {callStatut === 'rappel' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Date de rappel</label>
                <input
                  type="datetime-local"
                  value={rappelDate}
                  onChange={e => setRappelDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
              <textarea
                value={callNote}
                onChange={e => setCallNote(e.target.value)}
                rows={3}
                placeholder="Remarques, objections, infos importantes..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button onClick={() => setCallModal(null)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button
                onClick={handleCallSave}
                className={`flex-1 py-2.5 text-sm text-white rounded-xl font-medium transition-colors ${
                  callStatut === 'confirme' ? 'bg-emerald-600 hover:bg-emerald-700' :
                  callStatut === 'refuse' ? 'bg-red-600 hover:bg-red-700' :
                  'bg-indigo-600 hover:bg-indigo-700'
                }`}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
