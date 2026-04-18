import {
  ShoppingCart, Users, TrendingUp, DollarSign,
  Package, Truck, PhoneCall, AlertTriangle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { useStore } from '../store/useStore';
import { StatCard, Card } from '../components/ui/Card';
import { StatutCommandeBadge, StatutAppelBadge } from '../components/ui/Badge';
import { mockChiffreAffairesJour, mockDepensesParType, mockStatutsCommandes, mockPerformanceAgents } from '../data/mockData';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Dashboard() {
  const { commandes, clients, produits, depenses, currentUser } = useStore();

  // ── KPIs ─────────────────────────────────────────────────────
  const ca = commandes
    .filter(c => ['confirmee', 'en_preparation', 'expediee', 'livree'].includes(c.statut))
    .reduce((s, c) => s + c.total, 0);

  const totalCommandes = commandes.length;
  const commandesLivrees = commandes.filter(c => c.statut === 'livree').length;
  const commandesConfirmees = commandes.filter(c => ['confirmee', 'en_preparation', 'expediee', 'livree'].includes(c.statut)).length;
  const commandesRefusees = commandes.filter(c => c.statut === 'refusee').length;
  const tauxConfirmation = totalCommandes > 0 ? Math.round((commandesConfirmees / totalCommandes) * 100) : 0;
  const totalDepenses = depenses.reduce((s, d) => s + d.montant, 0);
  const profit = ca - totalDepenses;
  const stockAlertes = produits.filter(p => p.stock <= p.stockMin).length;
  const ticketMoyen = commandesConfirmees > 0 ? Math.round(ca / commandesConfirmees) : 0;

  const recentCommandes = commandes.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bonjour, {currentUser?.prenom} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })} · Voici votre résumé du jour
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-sm font-medium">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Système actif
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Chiffre d'Affaires"
          value={`${ca.toLocaleString('fr-MA')} DH`}
          icon={<TrendingUp size={20} />}
          color="indigo"
          trend={{ value: 12, label: 'vs hier' }}
        />
        <StatCard
          title="Commandes Totales"
          value={totalCommandes}
          icon={<ShoppingCart size={20} />}
          color="blue"
          trend={{ value: 8, label: 'vs hier' }}
        />
        <StatCard
          title="Profit Net"
          value={`${profit.toLocaleString('fr-MA')} DH`}
          icon={<DollarSign size={20} />}
          color={profit >= 0 ? 'emerald' : 'red'}
          trend={{ value: profit >= 0 ? 5 : -5, label: 'vs hier' }}
        />
        <StatCard
          title="Dépenses"
          value={`${totalDepenses.toLocaleString('fr-MA')} DH`}
          icon={<DollarSign size={20} />}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Taux Confirmation"
          value={`${tauxConfirmation}%`}
          icon={<PhoneCall size={20} />}
          color="purple"
        />
        <StatCard
          title="Commandes Livrées"
          value={commandesLivrees}
          icon={<Truck size={20} />}
          color="emerald"
        />
        <StatCard
          title="Total Clients"
          value={clients.length}
          icon={<Users size={20} />}
          color="blue"
        />
        <StatCard
          title="Alertes Stock"
          value={stockAlertes}
          icon={<AlertTriangle size={20} />}
          color={stockAlertes > 0 ? 'red' : 'emerald'}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CA Timeline */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-semibold text-gray-900">Chiffre d'Affaires & Profit</h3>
              <p className="text-xs text-gray-500 mt-0.5">Juin 2024 · 14 derniers jours</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 inline-block rounded" /> CA</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 inline-block rounded" /> Profit</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={mockChiffreAffairesJour}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="jour" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v: unknown) => [`${(v as number).toLocaleString('fr-MA')} DH`]}
              />
              <Line type="monotone" dataKey="ca" stroke="#6366f1" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} name="CA" />
              <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} name="Profit" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Statuts commandes */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">Statuts Commandes</h3>
          <p className="text-xs text-gray-500 mb-4">Répartition actuelle</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={mockStatutsCommandes} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="count" paddingAngle={3}>
                {mockStatutsCommandes.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {mockStatutsCommandes.map(s => (
              <div key={s.statut} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                  <span className="text-gray-600">{s.statut}</span>
                </div>
                <span className="font-semibold text-gray-900">{s.count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dépenses par type */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">Répartition des Dépenses</h3>
          <p className="text-xs text-gray-500 mb-4">Total: {totalDepenses.toLocaleString('fr-MA')} DH</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockDepensesParType} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
              <YAxis type="category" dataKey="type" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={70} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v: unknown) => [`${(v as number).toLocaleString('fr-MA')} DH`]}
              />
              <Bar dataKey="montant" radius={[0, 6, 6, 0]}>
                {mockDepensesParType.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Performance agents */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-1">Performance Call Center</h3>
          <p className="text-xs text-gray-500 mb-4">Taux de confirmation par agent (%)</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={mockPerformanceAgents}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="agent" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                formatter={(v: number) => [`${v}%`]}
              />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="confirmes" name="Confirmés" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="refuses" name="Refusés" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="injoignables" name="Injoignables" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Orders + Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card padding={false} className="lg:col-span-2 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Commandes Récentes</h3>
            <a href="/commandes" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Voir tout →</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/70">
                <tr>
                  {['Référence', 'Client', 'Montant', 'Statut', 'Appel'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentCommandes.map(cmd => (
                  <tr key={cmd.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-mono font-medium text-indigo-600">{cmd.reference}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{cmd.clientNom}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-gray-900">{cmd.total.toLocaleString('fr-MA')} DH</td>
                    <td className="px-4 py-3"><StatutCommandeBadge statut={cmd.statut} /></td>
                    <td className="px-4 py-3"><StatutAppelBadge statut={cmd.statutAppel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Stock Alerts */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Alertes Stock</h3>
            {stockAlertes > 0 && (
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">{stockAlertes}</span>
            )}
          </div>
          <div className="space-y-3">
            {produits.filter(p => p.stock <= p.stockMin).map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-red-50 border border-red-100 rounded-xl">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  <Package size={14} className="text-red-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{p.nom}</p>
                  <p className="text-xs text-red-600 font-medium">{p.stock} restant · Min: {p.stockMin}</p>
                </div>
              </div>
            ))}
            {stockAlertes === 0 && (
              <div className="text-center py-4">
                <Package size={32} className="text-emerald-300 mx-auto mb-2" />
                <p className="text-sm text-emerald-600 font-medium">Stock OK</p>
                <p className="text-xs text-gray-400">Tous les produits sont bien approvisionnés</p>
              </div>
            )}
          </div>

          {/* Quick stats */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3">
            <div className="text-center p-2 bg-gray-50 rounded-xl">
              <p className="text-lg font-bold text-gray-900">{ticketMoyen} DH</p>
              <p className="text-xs text-gray-500">Ticket moyen</p>
            </div>
            <div className="text-center p-2 bg-gray-50 rounded-xl">
              <p className="text-lg font-bold text-gray-900">{commandesRefusees}</p>
              <p className="text-xs text-gray-500">Refusées</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
