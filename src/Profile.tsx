import { useState } from 'react';
import { User, Lock, Bell, Shield, Save, Eye, EyeOff, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

const LANGUES = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'ar', label: 'العربية', flag: '🇲🇦' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
];

export function Profile() {
  const { currentUser, updateUser } = useStore();

  const [activeTab, setActiveTab] = useState<'profil' | 'securite' | 'preferences'>('profil');
  const [saved, setSaved] = useState(false);

  // Profil form
  const [profilForm, setProfilForm] = useState({
    prenom: currentUser?.prenom || '',
    nom: currentUser?.nom || '',
    email: currentUser?.email || '',
    telephone: currentUser?.telephone || '',
  });

  // Securite form
  const [securiteForm, setSecuriteForm] = useState({
    ancienMdp: '',
    nouveauMdp: '',
    confirmMdp: '',
  });
  const [showMdp, setShowMdp] = useState({ ancien: false, nouveau: false, confirm: false });
  const [mdpError, setMdpError] = useState('');

  // Preferences
  const [langue, setLangue] = useState('fr');
  const [notifCommandes, setNotifCommandes] = useState(true);
  const [notifStock, setNotifStock] = useState(true);
  const [notifAppels, setNotifAppels] = useState(false);

  const handleSaveProfil = () => {
    if (!currentUser) return;
    updateUser(currentUser.id, {
      prenom: profilForm.prenom,
      nom: profilForm.nom,
      email: profilForm.email,
      telephone: profilForm.telephone,
    });
    showSaved();
  };

  const handleSaveSecurite = () => {
    setMdpError('');
    if (!securiteForm.nouveauMdp) return setMdpError('Entrez un nouveau mot de passe.');
    if (securiteForm.nouveauMdp.length < 6) return setMdpError('Minimum 6 caractères.');
    if (securiteForm.nouveauMdp !== securiteForm.confirmMdp) return setMdpError('Les mots de passe ne correspondent pas.');
    setSecuriteForm({ ancienMdp: '', nouveauMdp: '', confirmMdp: '' });
    showSaved();
  };

  const handleSavePreferences = () => {
    showSaved();
  };

  const showSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const tabs = [
    { id: 'profil', label: 'Mon profil', icon: User },
    { id: 'securite', label: 'Sécurité', icon: Lock },
    { id: 'preferences', label: 'Préférences', icon: Bell },
  ] as const;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon compte</h1>
          <p className="text-gray-500 text-sm mt-0.5">Gérez vos informations et préférences</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium border border-emerald-200">
            <Check size={15} /> Enregistré !
          </div>
        )}
      </div>

      {/* Avatar + infos rapides */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white">
          {currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900">{currentUser?.prenom} {currentUser?.nom}</p>
          <p className="text-sm text-gray-500">{currentUser?.email}</p>
          <span className="inline-block mt-1 px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full capitalize">
            {currentUser?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={15} /> {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* ── PROFIL ── */}
          {activeTab === 'profil' && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Prénom</label>
                  <input
                    value={profilForm.prenom}
                    onChange={e => setProfilForm(f => ({ ...f, prenom: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom</label>
                  <input
                    value={profilForm.nom}
                    onChange={e => setProfilForm(f => ({ ...f, nom: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
                <input
                  type="email"
                  value={profilForm.email}
                  onChange={e => setProfilForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Téléphone</label>
                <input
                  value={profilForm.telephone}
                  onChange={e => setProfilForm(f => ({ ...f, telephone: e.target.value }))}
                  placeholder="06XXXXXXXX"
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rôle</label>
                <input
                  value={currentUser?.role || ''}
                  disabled
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed capitalize"
                />
              </div>
              <button
                onClick={handleSaveProfil}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Save size={15} /> Enregistrer les modifications
              </button>
            </div>
          )}

          {/* ── SECURITE ── */}
          {activeTab === 'securite' && (
            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800 flex items-start gap-2">
                <Shield size={16} className="mt-0.5 shrink-0" />
                <span>Choisissez un mot de passe fort d'au moins 6 caractères.</span>
              </div>

              {[
                { key: 'ancienMdp', label: 'Ancien mot de passe', show: showMdp.ancien, toggle: () => setShowMdp(s => ({ ...s, ancien: !s.ancien })) },
                { key: 'nouveauMdp', label: 'Nouveau mot de passe', show: showMdp.nouveau, toggle: () => setShowMdp(s => ({ ...s, nouveau: !s.nouveau })) },
                { key: 'confirmMdp', label: 'Confirmer le mot de passe', show: showMdp.confirm, toggle: () => setShowMdp(s => ({ ...s, confirm: !s.confirm })) },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.show ? 'text' : 'password'}
                      value={securiteForm[field.key as keyof typeof securiteForm]}
                      onChange={e => setSecuriteForm(f => ({ ...f, [field.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300"
                    />
                    <button
                      onClick={field.toggle}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              ))}

              {mdpError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">{mdpError}</p>
              )}

              <button
                onClick={handleSaveSecurite}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Save size={15} /> Changer le mot de passe
              </button>
            </div>
          )}

          {/* ── PREFERENCES ── */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              {/* Langue */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-3">Langue de l'interface</label>
                <div className="grid grid-cols-3 gap-3">
                  {LANGUES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => setLangue(l.code)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                        langue === l.code
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                      }`}
                    >
                      <span className="text-lg">{l.flag}</span> {l.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notifications */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-3">Notifications</label>
                <div className="space-y-3">
                  {[
                    { label: 'Nouvelles commandes', desc: 'Recevoir une alerte pour chaque nouvelle commande', value: notifCommandes, set: setNotifCommandes },
                    { label: 'Alertes stock', desc: 'Être notifié quand le stock est faible', value: notifStock, set: setNotifStock },
                    { label: 'Rappels d\'appel', desc: 'Rappels pour les clients à rappeler', value: notifAppels, set: setNotifAppels },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => item.set(!item.value)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-indigo-600' : 'bg-gray-200'}`}
                      >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSavePreferences}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-xl transition-colors"
              >
                <Save size={15} /> Enregistrer les préférences
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
