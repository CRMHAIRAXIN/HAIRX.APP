import { useState } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Trash2, Filter } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { useStore } from '../store/useStore';
import { Card, StatCard } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import type { Depense, TypeDepense } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { mockChiffreAffairesJour, mockDepensesParType } from '../data/mockData';

const TYPES_DEPENSE: { value: TypeDepense; label: string; emoji: string }[] = [
  { value: 'publicite', label: 'Publicité', emoji: '📢' },
  { value: 'salaires', label: 'Salaires', emoji: '👥' },
  { value: 'livraison', label: 'Livraison', emoji: '🚚' },
  { value: 'loyer', label: 'Loyer', emoji: '🏢' },
  { value: 'achat_stock', label: 'Achat Stock', emoji: '📦' },
  { value: 'autre', label: 'Autre', emoji: '💼' },
];

export function Finance() {
  const { commandes, depenses, addDepense, deleteDepense, currentUser } = useStore();
  const [addModal, setAddModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [newDepense, setNewDepense] = useState<Partial<Depense>>({
    titre: '', montant: 0, type: 'publicite', description: '', date: new Date().toISOString().split('T')[0]
  });

  // ── KPIs ─────────────────────────────────────────────────────
  const ca = commandes
    .filter(c => ['confirmee', 'en_preparation', 'expediee', 'livree'].includes(c.statut))
    .reduce((s, c) => s + c.total, 0);

  const totalDepenses = depenses.reduce((s, d) => s + d.montant, 0);
  const profit = ca - totalDepenses;
  const margeNette = ca > 0 ? ((profit / ca) * 100) : 0;

  const filteredDepenses = depenses.filter(d => !filterType || d.type === filterType);

  const depensesParType = TYPES_DEPENSE.map(t => ({
    ...t,
    montant: depenses.filter(d => d.type === t.value).reduce((s, d) => s + d.montant, 0),
  })).filter(t => t.montant > 0);

  const handleAddDepense = () => {
    addDepense({
      ...newDepense as Depense,
      id: `d${Date.now()}`,
      creePar: currentUser?.id || 'u1',
    });
    setAddModal(false);
    setNewDepense({ titre: '', montant: 0, type: 'publicite', description: '', date: new Date().toISOString().split('T')[0] });
  };

  const PIE_COLORS = ['#6366f1', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Finance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Vue d'ensemble financière du business</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus size={16} /> Nouvelle dépense
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Chiffre d'Affaires" value={`${ca.toLocaleString('fr-MA')} DH`} icon={<TrendingUp size={20} />} color="indigo" trend={{ value: 12, label: 'vs mois dernier' }} />
        <StatCard title="Total Dépenses" value={`${totalDepenses.toLocaleString('fr-MA')} DH`} icon={<TrendingDown size={20} />} color="red" />
        <StatCard title="Profit Net" value={`${profit.toLocaleString('fr-MA')} DH`} icon={<DollarSign size={20} />} color={profit >= 0 ? 'emerald' : 'red'} trend={{ value: profit >= 0 ? 5 : -5, label: 'vs mois dernier' }} />
        <StatCard title="Marge Nette" value={`${margeNette.toFixed(1)}%`} icon={<TrendingUp size={20} />} color={margeNette > 30 ? 'emerald' : margeNette > 10 ? 'amber' : 'red'} />
      </div>

      {/* Profit Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-6 text-white shadow-lg lg:col-span-2">
          <h3 className="font-semibold mb-4 opacity-90">Résumé Financier</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="opacity-80">Chiffre d'affaires</span>
              <span className="font-bold text-xl">+{ca.toLocaleString('fr-MA')} DH</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="opacity-80">Total dépenses</span>
              <span className="font-bold text-xl text-red-300">-{totalDepenses.toLocaleString('fr-MA')} DH</span>
            </div>
            <div className="h-px bg-white/20" />
            <div className="flex justify-between items-center">
              <span className="font-semibold">Profit Net</span>
              <span className={`font-bold text-2xl ${profit >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                {profit >= 0 ? '+' : ''}{profit.toLocaleString('fr-MA')} DH
              </span>
            </div>
          </div>
        </div>

        {/* Dépenses par type donut */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">Dépenses par type</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={depensesParType} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="montant" paddingAngle={3}>
                {depensesParType.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v: unknown) => [`${(v as number).toLocaleString('fr-MA')} DH`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1 mt-1">
            {depensesParType.slice(0, 4).map((t, i) => (
              <div key={t.value} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-gray-600">{t.emoji} {t.label}</span>
                </div>
                <span className="font-semibold text-gray-900">{t.montant.toLocaleString('fr-MA')} DH</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">CA vs Profit (14 jours)</h3>
          <p className="text-xs text-gray-500 mb-4">Évolution quotidienne</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={mockChiffreAffairesJour}>
              <defs>
                <linearGradient id="caGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="jour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v: unknown) => [`${(v as number).toLocaleString('fr-MA')} DH`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="ca" stroke="#6366f1" strokeWidth={2} fill="url(#caGrad)" name="CA" />
              <Area type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} fill="url(#profitGrad)" name="Profit" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">Dépenses par catégorie</h3>
          <p className="text-xs text-gray-500 mb-4">Répartition détaillée</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockDepensesParType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="type" tick={{ fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v: unknown) => [`${(v as number).toLocaleString('fr-MA')} DH`]} />
              <Bar dataKey="montant" radius={[6, 6, 0, 0]}>
                {mockDepensesParType.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Dépenses List */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-semibold text-gray-900">Liste des Dépenses</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Filter size={14} />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
              >
                <option value="">Tous types</option>
                {TYPES_DEPENSE.map(t => (
                  <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>
                ))}
              </select>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Total: {filteredDepenses.reduce((s, d) => s + d.montant, 0).toLocaleString('fr-MA')} DH
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {['Titre', 'Type', 'Montant', 'Date', 'Description', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDepenses.map(dep => {
                const type = TYPES_DEPENSE.find(t => t.value === dep.type);
                return (
                  <tr key={dep.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-sm font-medium text-gray-900">{dep.titre}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 bg-gray-100 rounded-lg text-gray-700">
                        {type?.emoji} {type?.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-sm font-bold text-red-600">-{dep.montant.toLocaleString('fr-MA')} DH</span>
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(dep.date), 'dd MMM yyyy', { locale: fr })}
                    </td>
                    <td className="px-5 py-3 text-sm text-gray-400 max-w-xs truncate">{dep.description || '—'}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => deleteDepense(dep.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Depense Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Nouvelle Dépense" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Titre *</label>
            <input
              type="text"
              value={newDepense.titre || ''}
              onChange={e => setNewDepense(d => ({ ...d, titre: e.target.value }))}
              placeholder="Ex: Facebook Ads - Juin"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Montant (DH) *</label>
              <input
                type="number"
                value={newDepense.montant || ''}
                onChange={e => setNewDepense(d => ({ ...d, montant: Number(e.target.value) }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Date</label>
              <input
                type="date"
                value={newDepense.date || ''}
                onChange={e => setNewDepense(d => ({ ...d, date: e.target.value }))}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
            <div className="grid grid-cols-2 gap-2">
              {TYPES_DEPENSE.map(t => (
                <button
                  key={t.value}
                  onClick={() => setNewDepense(d => ({ ...d, type: t.value }))}
                  className={`flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border transition-all ${
                    newDepense.type === t.value ? 'bg-indigo-600 text-white border-indigo-600' : 'border-gray-200 text-gray-700 hover:border-indigo-300'
                  }`}
                >
                  {t.emoji} {t.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
            <textarea
              value={newDepense.description || ''}
              onChange={e => setNewDepense(d => ({ ...d, description: e.target.value }))}
              rows={2}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
            <button
              onClick={handleAddDepense}
              disabled={!newDepense.titre || !newDepense.montant}
              className="flex-1 py-2.5 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium disabled:opacity-50"
            >
              Ajouter
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
