import { useState } from 'react';
import { Plus, UserCog, Phone, Mail, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import type { User, UserRole } from '../types';

const ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: 'admin', label: 'Admin', color: 'bg-red-100 text-red-700' },
  { value: 'manager', label: 'Manager', color: 'bg-purple-100 text-purple-700' },
  { value: 'agent', label: 'Agent', color: 'bg-blue-100 text-blue-700' },
  { value: 'comptable', label: 'Comptable', color: 'bg-emerald-100 text-emerald-700' },
];

export function Employes() {
  const { users, commandes, addUser } = useStore();
  const [addModal, setAddModal] = useState(false);
  const [newUser, setNewUser] = useState<Partial<User>>({
    nom: '', prenom: '', email: '', role: 'agent', telephone: '', actif: true
  });

  const handleAdd = () => {
    addUser({
      ...newUser as User,
      id: `u${Date.now()}`,
      dateCreation: new Date().toISOString(),
      actif: true,
      performance: { commandesTraitees: 0, tauxConversion: 0, appelsTotaux: 0 }
    });
    setAddModal(false);
    setNewUser({ nom: '', prenom: '', email: '', role: 'agent', telephone: '', actif: true });
  };

  const getAgentStats = (userId: string) => {
    const agentCmds = commandes.filter(c => c.agentId === userId);
    const confirmes = agentCmds.filter(c => c.statutAppel === 'confirme').length;
    return {
      total: agentCmds.length,
      confirmes,
      taux: agentCmds.length > 0 ? Math.round((confirmes / agentCmds.length) * 100) : 0,
    };
  };

  const roleConfig: Record<UserRole, { label: string; variant: 'danger' | 'purple' | 'info' | 'success' }> = {
    admin: { label: 'Admin', variant: 'danger' },
    manager: { label: 'Manager', variant: 'purple' },
    agent: { label: 'Agent', variant: 'info' },
    comptable: { label: 'Comptable', variant: 'success' },
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employés</h1>
          <p className="text-gray-500 text-sm mt-0.5">{users.length} membres de l'équipe</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
        >
          <Plus size={16} /> Ajouter un employé
        </button>
      </div>

      {/* Team Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {ROLES.map(role => (
          <Card key={role.value}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">{role.label}s</p>
                <p className="text-2xl font-bold text-gray-900 mt-0.5">
                  {users.filter(u => u.role === role.value).length}
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${role.color}`}>{role.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map(user => {
          const stats = getAgentStats(user.id);
          const role = roleConfig[user.role];
          return (
            <div key={user.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                    {user.prenom[0]}{user.nom[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{user.prenom} {user.nom}</p>
                    <Badge variant={role.variant} size="sm">{role.label}</Badge>
                  </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${user.actif ? 'bg-emerald-400' : 'bg-gray-300'}`} title={user.actif ? 'Actif' : 'Inactif'} />
              </div>

              {/* Contact */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Mail size={11} /> {user.email}
                </div>
                {user.telephone && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Phone size={11} /> {user.telephone}
                  </div>
                )}
              </div>

              {/* Performance (pour agents/managers) */}
              {['agent', 'manager'].includes(user.role) && stats.total > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                    <TrendingUp size={11} /> Performance
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-900">{stats.total}</p>
                      <p className="text-xs text-gray-400">Appels</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-emerald-600">{stats.confirmes}</p>
                      <p className="text-xs text-gray-400">Confirmés</p>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${stats.taux > 70 ? 'text-emerald-600' : stats.taux > 50 ? 'text-amber-600' : 'text-red-600'}`}>
                        {stats.taux}%
                      </p>
                      <p className="text-xs text-gray-400">Taux</p>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${stats.taux > 70 ? 'bg-emerald-500' : stats.taux > 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${stats.taux}%` }}
                    />
                  </div>
                </div>
              )}

              {['admin', 'comptable'].includes(user.role) && (
                <div className="pt-3 border-t border-gray-100 text-center">
                  <p className="text-xs text-gray-400 italic">
                    {user.role === 'admin' ? '🔐 Accès complet système' : '📊 Gestion finances'}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Ajouter un employé" size="sm">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Prénom *</label>
              <input type="text" value={newUser.prenom || ''} onChange={e => setNewUser(u => ({ ...u, prenom: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nom *</label>
              <input type="text" value={newUser.nom || ''} onChange={e => setNewUser(u => ({ ...u, nom: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
            <input type="email" value={newUser.email || ''} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Téléphone</label>
            <input type="tel" value={newUser.telephone || ''} onChange={e => setNewUser(u => ({ ...u, telephone: e.target.value }))}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rôle</label>
            <div className="grid grid-cols-2 gap-2">
              {ROLES.map(r => (
                <button key={r.value} onClick={() => setNewUser(u => ({ ...u, role: r.value }))}
                  className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    newUser.role === r.value ? 'bg-indigo-600 text-white border-indigo-600' : `${r.color} border-transparent hover:opacity-80`
                  }`}>
                  {r.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
            <button onClick={handleAdd} disabled={!newUser.nom || !newUser.prenom || !newUser.email}
              className="flex-1 py-2.5 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium disabled:opacity-50">
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
