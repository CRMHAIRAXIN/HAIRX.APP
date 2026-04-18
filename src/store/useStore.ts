// ============================================================
// ZUSTAND STORE — CRM Pro
// ============================================================

import { create } from 'zustand';
import type {
  User, Client, Produit, Commande, Appel,
  Transporteur, Depense, Notification, StatutCommande, StatutAppel
} from '../types';
import {
  mockUsers, mockClients, mockProduits, mockCommandes,
  mockAppels, mockTransporteurs, mockDepenses, mockNotifications
} from '../data/mockData';

interface CRMStore {
  // Auth
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;

  // Data
  users: User[];
  clients: Client[];
  produits: Produit[];
  commandes: Commande[];
  appels: Appel[];
  transporteurs: Transporteur[];
  depenses: Depense[];
  notifications: Notification[];

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Actions — Commandes
  addCommande: (commande: Commande) => void;
  updateCommandeStatut: (id: string, statut: StatutCommande) => void;
  updateCommandeAppel: (id: string, statut: StatutAppel, notes?: string) => void;
  assignerAgent: (commandeId: string, agentId: string) => void;

  // Actions — Clients
  addClient: (client: Client) => void;
  updateClient: (id: string, data: Partial<Client>) => void;

  // Actions — Produits
  addProduit: (produit: Produit) => void;
  updateProduit: (id: string, data: Partial<Produit>) => void;
  updateStock: (id: string, delta: number) => void;

  // Actions — Dépenses
  addDepense: (depense: Depense) => void;
  deleteDepense: (id: string) => void;

  // Actions — Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: () => number;

  // Actions — Users
  addUser: (user: User) => void;
  updateUser: (id: string, data: Partial<User>) => void;
}

export const useStore = create<CRMStore>((set, get) => ({
  // ── AUTH ────────────────────────────────────────────────────
  currentUser: null,
  isAuthenticated: false,

  login: (email: string, _password: string) => {
    const user = mockUsers.find(u => u.email === email);
    if (user) {
      set({ currentUser: user, isAuthenticated: true });
      return true;
    }
    return false;
  },

  logout: () => set({ currentUser: null, isAuthenticated: false }),

  // ── DATA ────────────────────────────────────────────────────
  users: mockUsers,
  clients: mockClients,
  produits: mockProduits,
  commandes: mockCommandes,
  appels: mockAppels,
  transporteurs: mockTransporteurs,
  depenses: mockDepenses,
  notifications: mockNotifications,

  // ── UI ──────────────────────────────────────────────────────
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // ── COMMANDES ───────────────────────────────────────────────
  addCommande: (commande) =>
    set(state => ({ commandes: [commande, ...state.commandes] })),

  updateCommandeStatut: (id, statut) =>
    set(state => ({
      commandes: state.commandes.map(c =>
        c.id === id ? { ...c, statut } : c
      )
    })),

  updateCommandeAppel: (id, statut, notes) =>
    set(state => ({
      commandes: state.commandes.map(c =>
        c.id === id ? { ...c, statutAppel: statut, notesAgent: notes ?? c.notesAgent } : c
      )
    })),

  assignerAgent: (commandeId, agentId) => {
    const { users } = get();
    const agent = users.find(u => u.id === agentId);
    if (!agent) return;
    set(state => ({
      commandes: state.commandes.map(c =>
        c.id === commandeId
          ? { ...c, agentId, agentNom: `${agent.prenom} ${agent.nom}` }
          : c
      )
    }));
  },

  // ── CLIENTS ─────────────────────────────────────────────────
  addClient: (client) =>
    set(state => ({ clients: [client, ...state.clients] })),

  updateClient: (id, data) =>
    set(state => ({
      clients: state.clients.map(c => c.id === id ? { ...c, ...data } : c)
    })),

  // ── PRODUITS ────────────────────────────────────────────────
  addProduit: (produit) =>
    set(state => ({ produits: [produit, ...state.produits] })),

  updateProduit: (id, data) =>
    set(state => ({
      produits: state.produits.map(p => p.id === id ? { ...p, ...data } : p)
    })),

  updateStock: (id, delta) =>
    set(state => ({
      produits: state.produits.map(p =>
        p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
      )
    })),

  // ── DÉPENSES ────────────────────────────────────────────────
  addDepense: (depense) =>
    set(state => ({ depenses: [depense, ...state.depenses] })),

  deleteDepense: (id) =>
    set(state => ({ depenses: state.depenses.filter(d => d.id !== id) })),

  // ── NOTIFICATIONS ───────────────────────────────────────────
  markNotificationRead: (id) =>
    set(state => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, lu: true } : n
      )
    })),

  markAllNotificationsRead: () =>
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, lu: true }))
    })),

  unreadCount: () => get().notifications.filter(n => !n.lu).length,

  // ── USERS ───────────────────────────────────────────────────
  addUser: (user) =>
    set(state => ({ users: [user, ...state.users] })),

  updateUser: (id, data) =>
    set(state => ({
      users: state.users.map(u => u.id === id ? { ...u, ...data } : u)
    })),
}));
