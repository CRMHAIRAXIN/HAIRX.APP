import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ShoppingCart, Users, Package,
  PhoneCall, Truck, DollarSign, UserCog,
  ChevronLeft, ChevronRight, BarChart3, Bell
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { cn } from '../../utils/cn';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['admin', 'manager', 'agent', 'comptable'] },
  { to: '/commandes', icon: ShoppingCart, label: 'Commandes', roles: ['admin', 'manager', 'agent'] },
  { to: '/call-center', icon: PhoneCall, label: 'Call Center', roles: ['admin', 'manager', 'agent'] },
  { to: '/clients', icon: Users, label: 'Clients', roles: ['admin', 'manager', 'agent'] },
  { to: '/produits', icon: Package, label: 'Produits & Stock', roles: ['admin', 'manager'] },
  { to: '/livraisons', icon: Truck, label: 'Livraisons', roles: ['admin', 'manager'] },
  { to: '/finance', icon: DollarSign, label: 'Finance', roles: ['admin', 'comptable', 'manager'] },
  { to: '/employes', icon: UserCog, label: 'Employés', roles: ['admin', 'manager'] },
  { to: '/rapports', icon: BarChart3, label: 'Rapports', roles: ['admin', 'manager', 'comptable'] },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, currentUser, unreadCount } = useStore();
  const unread = unreadCount();
  const role = currentUser?.role || 'agent';

  const filteredNav = navItems.filter(item => item.roles.includes(role));

  return (
    <aside className={cn(
      'fixed left-0 top-0 h-full bg-gray-900 text-white z-40 flex flex-col transition-all duration-300 ease-in-out',
      sidebarOpen ? 'w-64' : 'w-16'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-700/50">
        {sidebarOpen && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">CRM Pro</span>
              <p className="text-xs text-gray-400">E-Commerce</p>
            </div>
          </div>
        )}
        {!sidebarOpen && (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto">
            <BarChart3 size={16} className="text-white" />
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className={cn(
            'p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors',
            !sidebarOpen && 'hidden'
          )}
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Toggle when closed */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 mx-auto mt-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
        >
          <ChevronRight size={16} />
        </button>
      )}

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto space-y-0.5">
        {filteredNav.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group relative',
              isActive
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/50'
                : 'text-gray-400 hover:text-white hover:bg-gray-700/70'
            )}
            title={!sidebarOpen ? label : undefined}
          >
            <Icon size={18} className="shrink-0" />
            {sidebarOpen && <span>{label}</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Notifications indicator */}
      {unread > 0 && (
        <div className={cn(
          'mx-2 mb-2 p-3 bg-indigo-600/20 border border-indigo-500/30 rounded-xl',
          !sidebarOpen && 'hidden'
        )}>
          <div className="flex items-center gap-2">
            <Bell size={14} className="text-indigo-400" />
            <span className="text-xs text-indigo-300">
              {unread} notification{unread > 1 ? 's' : ''} non lue{unread > 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* User Info */}
      <div className="border-t border-gray-700/50 px-3 py-4">
        {sidebarOpen ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {currentUser?.prenom} {currentUser?.nom}
              </p>
              <p className="text-xs text-gray-400 capitalize">{currentUser?.role}</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-xs font-bold text-white mx-auto">
            {currentUser?.prenom?.[0]}{currentUser?.nom?.[0]}
          </div>
        )}
      </div>
    </aside>
  );
}
