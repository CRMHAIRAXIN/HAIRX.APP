import { BarChart3, TrendingUp, Package, Users, Download } from 'lucide-react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, RadarChart, PolarGrid, PolarAngleAxis, Radar
} from 'recharts';
import { useStore } from '../store/useStore';
import { Card } from '../components/ui/Card';
import { mockChiffreAffairesJour, mockPerformanceAgents } from '../data/mockData';

export function Rapports() {
  const { commandes, clients, produits, depenses } = useStore();

  const ca = commandes.filter(c => ['confirmee', 'en_preparation', 'expediee', 'livree'].includes(c.statut)).reduce((s, c) => s + c.total, 0);
  const totalDepenses = depenses.reduce((s, d) => s + d.montant, 0);
  const profit = ca - totalDepenses;
  const totalCommandes = commandes.length;
  const livrees = commandes.filter(c => c.statut === 'livree').length;
  const refusees = commandes.filter(c => c.statut === 'refusee').length;
  const tauxLivraison = totalCommandes > 0 ? Math.round((livrees / totalCommandes) * 100) : 0;
  const tauxRefus = totalCommandes > 0 ? Math.round((refusees / totalCommandes) * 100) : 0;

  // Produits top vendeurs
  const produitsVentes = produits.map(p => {
    const vendu = commandes.flatMap(c => c.items).filter(i => i.produitId === p.id).reduce((s, i) => s + i.quantite, 0);
    const ca_prod = commandes.flatMap(c => c.items).filter(i => i.produitId === p.id).reduce((s, i) => s + i.total, 0);
    return { ...p, vendu, ca_prod };
  }).sort((a, b) => b.vendu - a.vendu);

  // Villes top
  const villesData = commandes.reduce((acc: Record<string, { commandes: number; ca: number }>, c) => {
    if (!acc[c.clientVille]) acc[c.clientVille] = { commandes: 0, ca: 0 };
    acc[c.clientVille].commandes++;
    acc[c.clientVille].ca += c.total;
    return acc;
  }, {});
  const villesArray = Object.entries(villesData).map(([ville, data]) => ({ ville, ...data })).sort((a, b) => b.ca - a.ca);

  // Sources
  const sourcesData = commandes.reduce((acc: Record<string, number>, c) => {
    acc[c.source] = (acc[c.source] || 0) + 1;
    return acc;
  }, {});
  const sourcesArray = Object.entries(sourcesData).map(([source, count]) => ({ source, count })).sort((a, b) => b.count - a.count);

  // Radar data pour performance
  const radarData = [
    { metric: 'CA', value: Math.min(100, (ca / 20000) * 100) },
    { metric: 'Livraison', value: tauxLivraison },
    { metric: 'Satisfaction', value: 82 },
    { metric: 'Stock', value: Math.min(100, ((produits.filter(p => p.stock > p.stockMin).length / produits.length) * 100)) },
    { metric: 'Clients VIP', value: Math.min(100, (clients.filter(c => c.statut === 'vip').length / clients.length) * 100) },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports & Analytiques</h1>
          <p className="text-gray-500 text-sm mt-0.5">Vue d'ensemble complète de votre business</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
          <Download size={16} /> Exporter PDF
        </button>
      </div>

      {/* Business Score */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 rounded-2xl p-6 text-white">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: 'Chiffre d\'Affaires', value: `${(ca/1000).toFixed(1)}k DH`, icon: TrendingUp },
            { label: 'Profit Net', value: `${(profit/1000).toFixed(1)}k DH`, icon: BarChart3 },
            { label: 'Taux Livraison', value: `${tauxLivraison}%`, icon: Package },
            { label: 'Taux Refus', value: `${tauxRefus}%`, icon: Users },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="inline-flex p-2 bg-white/10 rounded-xl mb-2">
                <s.icon size={18} />
              </div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-4">CA, Commandes & Profit — 14 jours</h3>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={mockChiffreAffairesJour}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="jour" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v/1000}k`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="ca" fill="#6366f1" opacity={0.8} radius={[4, 4, 0, 0]} name="CA (DH)" />
              <Bar yAxisId="left" dataKey="profit" fill="#10b981" opacity={0.8} radius={[4, 4, 0, 0]} name="Profit (DH)" />
              <Line yAxisId="right" type="monotone" dataKey="commandes" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name="Commandes" />
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Score Business</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
              <Radar name="Score" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }}
                formatter={(v: unknown) => [`${Math.round(v as number)}%`]} />
            </RadarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Villes */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Top Villes par CA</h3>
          <div className="space-y-3">
            {villesArray.slice(0, 6).map((v, i) => (
              <div key={v.ville}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">#{i+1} {v.ville}</span>
                  <div className="text-right">
                    <span className="font-bold text-gray-900">{v.ca.toLocaleString('fr-MA')} DH</span>
                    <span className="text-gray-400 ml-2 text-xs">({v.commandes} cmd)</span>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                    style={{ width: `${(v.ca / villesArray[0].ca) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Sources */}
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Sources d'Acquisition</h3>
          <div className="space-y-3">
            {sourcesArray.map((s, i) => {
              const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-amber-500', 'bg-emerald-500'];
              return (
                <div key={s.source}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{s.source}</span>
                    <span className="font-bold text-gray-900">{s.count} commande{s.count > 1 ? 's' : ''}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${colors[i % colors.length]}`}
                      style={{ width: `${(s.count / sourcesArray[0].count) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Top Produits */}
      <Card padding={false}>
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Top Produits Vendus</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/70">
              <tr>
                {['#', 'Produit', 'SKU', 'Catégorie', 'Unités vendues', 'CA généré', 'Prix vente', 'Marge'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {produitsVentes.map((p, i) => (
                <tr key={p.id} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 text-sm font-bold text-gray-400">#{i+1}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{p.nom}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-400">{p.sku}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{p.categorie}</td>
                  <td className="px-4 py-3">
                    <span className="text-sm font-bold text-indigo-600">{p.vendu}</span>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{p.ca_prod.toLocaleString('fr-MA')} DH</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{p.prixVente} DH</td>
                  <td className="px-4 py-3">
                    {p.marge ? (
                      <span className={`text-xs font-bold ${p.marge > 50 ? 'text-emerald-600' : p.marge > 30 ? 'text-amber-600' : 'text-red-600'}`}>
                        {p.marge.toFixed(1)}%
                      </span>
                    ) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Agent performance */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Performance Équipe Call Center</h3>
        <ResponsiveContainer width="100%" height={200}>
          <ComposedChart data={mockPerformanceAgents}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="agent" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 11 }}
              formatter={(v: unknown) => [`${v}%`]} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="confirmes" name="Confirmés %" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="refuses" name="Refusés %" fill="#ef4444" radius={[4, 4, 0, 0]} />
            <Bar dataKey="injoignables" name="Injoignables %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </ComposedChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
