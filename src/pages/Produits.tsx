import { useState } from 'react';
import { Search, Plus, Edit2, AlertTriangle, Package, TrendingUp } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Modal } from '../components/ui/Modal';
import { Badge } from '../components/ui/Badge';
import type { Produit } from '../types';

export function Produits() {
  const { produits, updateProduit, updateStock, addProduit } = useStore();
  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [editModal, setEditModal] = useState<Produit | null>(null);
  const [addModal, setAddModal] = useState(false);
  const [newProduit, setNewProduit] = useState<Partial<Produit>>({
    nom: '', sku: '', categorie: '', prixVente: 0, prixAchat: 0, prixLivraison: 0,
    stock: 0, stockMin: 10, actif: true
  });

  const categories = [...new Set(produits.map(p => p.categorie))];

  const filtered = produits.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.nom.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    const matchCat = !filterCat || p.categorie === filterCat;
    const matchStock = !filterStock
      || (filterStock === 'critique' && p.stock <= p.stockMin)
      || (filterStock === 'ok' && p.stock > p.stockMin);
    return matchSearch && matchCat && matchStock;
  });

  const handleSaveEdit = () => {
    if (!editModal) return;
    const marge = ((editModal.prixVente - editModal.prixAchat - editModal.prixLivraison) / editModal.prixVente) * 100;
    updateProduit(editModal.id, { ...editModal, marge });
    setEditModal(null);
  };

  const handleAddProduit = () => {
    const p = newProduit as Produit;
    const marge = ((p.prixVente - p.prixAchat - p.prixLivraison) / p.prixVente) * 100;
    addProduit({
      ...p,
      id: `p${Date.now()}`,
      dateCreation: new Date().toISOString(),
      actif: true,
      marge,
    });
    setAddModal(false);
    setNewProduit({ nom: '', sku: '', categorie: '', prixVente: 0, prixAchat: 0, prixLivraison: 0, stock: 0, stockMin: 10, actif: true });
  };

  const totalValeurStock = produits.reduce((s, p) => s + (p.stock * p.prixAchat), 0);
  const produitsEnAlerte = produits.filter(p => p.stock <= p.stockMin).length;

  const getStockLevel = (p: Produit) => {
    if (p.stock === 0) return { color: 'text-red-600 bg-red-50', label: 'Épuisé', badge: 'danger' as const };
    if (p.stock <= p.stockMin) return { color: 'text-amber-600 bg-amber-50', label: 'Critique', badge: 'warning' as const };
    return { color: 'text-emerald-600 bg-emerald-50', label: 'OK', badge: 'success' as const };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produits & Stock</h1>
          <p className="text-gray-500 text-sm mt-0.5">{produits.length} produits · {produitsEnAlerte} alertes stock</p>
        </div>
        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors shadow-sm shadow-indigo-200"
        >
          <Plus size={16} /> Nouveau produit
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total produits', value: produits.length, icon: Package, color: 'indigo', bg: 'bg-indigo-50' },
          { label: 'Valeur stock', value: `${(totalValeurStock/1000).toFixed(0)}k DH`, icon: TrendingUp, color: 'emerald', bg: 'bg-emerald-50' },
          { label: 'Alertes stock', value: produitsEnAlerte, icon: AlertTriangle, color: 'amber', bg: 'bg-amber-50' },
          { label: 'Catégories', value: categories.length, icon: Package, color: 'purple', bg: 'bg-purple-50' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl ${s.bg}`}>
                <s.icon size={18} className={`text-${s.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Nom produit, SKU..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
          />
        </div>
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStock} onChange={e => setFilterStock(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
          <option value="">Tout le stock</option>
          <option value="critique">⚠️ Stock critique</option>
          <option value="ok">✅ Stock OK</option>
        </select>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => {
          const level = getStockLevel(p);
          const marge = p.marge || ((p.prixVente - p.prixAchat - p.prixLivraison) / p.prixVente * 100);
          return (
            <div key={p.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
              {/* Top */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 text-center relative">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-2">
                  <Package size={24} className="text-gray-400" />
                </div>
                <span className="text-xs font-mono text-gray-400">{p.sku}</span>
                <div className="absolute top-3 right-3">
                  <Badge variant={level.badge} size="sm">{level.label}</Badge>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm mb-1 truncate">{p.nom}</h3>
                <p className="text-xs text-gray-400 mb-3">{p.categorie}</p>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400">Prix vente</p>
                    <p className="font-bold text-gray-900">{p.prixVente} DH</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400">Coût achat</p>
                    <p className="font-bold text-gray-600">{p.prixAchat} DH</p>
                  </div>
                </div>

                {/* Marge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">Marge nette</span>
                  <span className={`text-xs font-bold ${marge > 50 ? 'text-emerald-600' : marge > 30 ? 'text-amber-600' : 'text-red-600'}`}>
                    {marge.toFixed(1)}%
                  </span>
                </div>

                {/* Stock bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Stock: <strong className={level.color.split(' ')[0]}>{p.stock}</strong></span>
                    <span className="text-gray-400">Min: {p.stockMin}</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${p.stock === 0 ? 'bg-red-400' : p.stock <= p.stockMin ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${Math.min(100, (p.stock / (p.stockMin * 3)) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setEditModal({ ...p })}
                    className="flex-1 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit2 size={12} /> Modifier
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => updateStock(p.id, -1)}
                      disabled={p.stock === 0}
                      className="px-2 py-2 text-xs border border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 text-gray-600 hover:text-red-600 transition-colors disabled:opacity-40"
                    >−</button>
                    <button
                      onClick={() => updateStock(p.id, 1)}
                      className="px-2 py-2 text-xs border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-200 text-gray-600 hover:text-emerald-600 transition-colors"
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editModal && (
        <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Modifier le produit">
          <div className="space-y-4">
            {[
              { label: 'Nom du produit', key: 'nom', type: 'text' },
              { label: 'SKU', key: 'sku', type: 'text' },
              { label: 'Catégorie', key: 'categorie', type: 'text' },
              { label: 'Prix de vente (DH)', key: 'prixVente', type: 'number' },
              { label: 'Prix d\'achat (DH)', key: 'prixAchat', type: 'number' },
              { label: 'Frais de livraison (DH)', key: 'prixLivraison', type: 'number' },
              { label: 'Stock actuel', key: 'stock', type: 'number' },
              { label: 'Stock minimum', key: 'stockMin', type: 'number' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={(editModal as Record<string, unknown>)[field.key] as string || ''}
                  onChange={e => setEditModal(prev => prev ? {
                    ...prev,
                    [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
                  } : null)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            ))}

            <div className="bg-gray-50 rounded-xl p-3 text-sm">
              <p className="text-gray-600">Marge calculée: <strong className="text-emerald-600">
                {editModal.prixVente > 0 ? (((editModal.prixVente - editModal.prixAchat - editModal.prixLivraison) / editModal.prixVente) * 100).toFixed(1) : 0}%
              </strong></p>
              <p className="text-gray-600">Profit par unité: <strong className="text-gray-900">
                {editModal.prixVente - editModal.prixAchat - editModal.prixLivraison} DH
              </strong></p>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditModal(null)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={handleSaveEdit} className="flex-1 py-2.5 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium">Enregistrer</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Modal */}
      {addModal && (
        <Modal open={addModal} onClose={() => setAddModal(false)} title="Nouveau produit">
          <div className="space-y-4">
            {[
              { label: 'Nom du produit *', key: 'nom', type: 'text' },
              { label: 'SKU *', key: 'sku', type: 'text' },
              { label: 'Catégorie *', key: 'categorie', type: 'text' },
              { label: 'Prix de vente (DH) *', key: 'prixVente', type: 'number' },
              { label: 'Prix d\'achat (DH) *', key: 'prixAchat', type: 'number' },
              { label: 'Frais de livraison (DH)', key: 'prixLivraison', type: 'number' },
              { label: 'Stock initial', key: 'stock', type: 'number' },
              { label: 'Stock minimum (alerte)', key: 'stockMin', type: 'number' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={(newProduit as Record<string, unknown>)[field.key] as string || ''}
                  onChange={e => setNewProduit(p => ({
                    ...p,
                    [field.key]: field.type === 'number' ? Number(e.target.value) : e.target.value
                  }))}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <button onClick={() => setAddModal(false)} className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl hover:bg-gray-50">Annuler</button>
              <button onClick={handleAddProduit} className="flex-1 py-2.5 text-sm bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium">Créer le produit</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
