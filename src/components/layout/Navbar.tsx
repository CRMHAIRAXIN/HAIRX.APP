import { useState } from 'react';
import { Bell, Search, LogOut, User, Settings, ChevronDown, X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export function Navbar() {
  const { currentUser, logout, notifications, markNotificationRead, markAllNotificationsRead, unreadCount } = useStore();
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const unread = unreadCount();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const typeIcon: Record<string, string> = {
    commande: '🛒',
    stock: '📦',
    appel: '📞',
    finance: '💰',
    systeme: '⚙️',
  };

  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      {/* Search */}
      <div className="relative flex-1 max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher commande, client, produit..."
          className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
            className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <Bell size={20} />
            {unread > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      Tout lire
                    </button>
                  )}
                  <button onClick={() => setNotifOpen(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">Aucune notification</p>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => { markNotificationRead(n.id); setNotifOpen(false); }}
                      className={cn(
                        'flex gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0',
                        !n.lu && 'bg-indigo-50/50'
                      )}
                    >
                      <span className="text-xl shrink-0">{typeIcon[n.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className={cn('text-sm font-medium text-gray-900', !n.lu && 'font-semibold')}>{n.titre}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {format(new Date(n.date), 'dd MMM HH:mm', { locale: fr })}
                        </p>
                      </div>
                      {!n.lu && <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0 mt-1.5" />}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {currentUser?.prenom}
            </span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-900">{currentUser?.prenom} {currentUser?.nom}</p>
                <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
              </div>
              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User size={15} /> Mon profil
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings size={15} /> Paramètres
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} /> Déconnexion
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
