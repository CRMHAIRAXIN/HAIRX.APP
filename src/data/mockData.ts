// ============================================================
// MOCK DATA — CRM Pro (remplacer par Supabase en production)
// ============================================================

import type {
  User, Client, Produit, Commande, Appel,
  Transporteur, Depense, Notification
} from '../types';

// ── UTILISATEURS ─────────────────────────────────────────────
export const mockUsers: User[] = [
  {
    id: 'u1', nom: 'Benali', prenom: 'Karim', email: 'admin@crmrpo.ma',
    role: 'admin', telephone: '0600000001', actif: true,
    dateCreation: '2024-01-01',
    performance: { commandesTraitees: 0, tauxConversion: 0, appelsTotaux: 0 }
  },
  {
    id: 'u2', nom: 'Mansouri', prenom: 'Sara', email: 'sara@crmrpo.ma',
    role: 'agent', telephone: '0600000002', actif: true,
    dateCreation: '2024-01-10',
    performance: { commandesTraitees: 145, tauxConversion: 72, appelsTotaux: 201 }
  },
  {
    id: 'u3', nom: 'Alaoui', prenom: 'Youssef', email: 'youssef@crmrpo.ma',
    role: 'agent', telephone: '0600000003', actif: true,
    dateCreation: '2024-02-01',
    performance: { commandesTraitees: 98, tauxConversion: 65, appelsTotaux: 150 }
  },
  {
    id: 'u4', nom: 'Chraibi', prenom: 'Fatima', email: 'fatima@crmrpo.ma',
    role: 'manager', telephone: '0600000004', actif: true,
    dateCreation: '2024-01-05',
    performance: { commandesTraitees: 320, tauxConversion: 78, appelsTotaux: 410 }
  },
  {
    id: 'u5', nom: 'Idrissi', prenom: 'Omar', email: 'omar@crmrpo.ma',
    role: 'comptable', telephone: '0600000005', actif: true,
    dateCreation: '2024-01-15',
    performance: { commandesTraitees: 0, tauxConversion: 0, appelsTotaux: 0 }
  },
];

// ── CLIENTS ───────────────────────────────────────────────────
export const mockClients: Client[] = [
  {
    id: 'c1', nom: 'Tazi', prenom: 'Mohammed', telephone: '0612345678',
    email: 'mtazi@gmail.com', adresse: '12 Rue Hassan II', ville: 'Casablanca',
    region: 'Grand Casablanca', statut: 'vip', dateCreation: '2024-01-15',
    totalCommandes: 8, totalDepense: 3200, notes: 'Client fidèle, préfère livraison rapide'
  },
  {
    id: 'c2', nom: 'Berrada', prenom: 'Amina', telephone: '0623456789',
    email: 'aberrada@gmail.com', adresse: '5 Avenue Mohammed V', ville: 'Rabat',
    region: 'Rabat-Salé', statut: 'actif', dateCreation: '2024-02-10',
    totalCommandes: 3, totalDepense: 890, notes: ''
  },
  {
    id: 'c3', nom: 'Hajji', prenom: 'Khalid', telephone: '0634567890',
    adresse: '78 Bd Zerktouni', ville: 'Marrakech',
    region: 'Marrakech-Safi', statut: 'nouveau', dateCreation: '2024-06-01',
    totalCommandes: 1, totalDepense: 250
  },
  {
    id: 'c4', nom: 'Fassi', prenom: 'Nadia', telephone: '0645678901',
    email: 'nfassi@yahoo.fr', adresse: '33 Rue Moulay Ismail', ville: 'Fès',
    region: 'Fès-Meknès', statut: 'actif', dateCreation: '2024-03-20',
    totalCommandes: 5, totalDepense: 1450
  },
  {
    id: 'c5', nom: 'Kettani', prenom: 'Hamid', telephone: '0656789012',
    adresse: '22 Rue Ibn Rochd', ville: 'Tanger',
    region: 'Tanger-Tétouan', statut: 'inactif', dateCreation: '2024-01-30',
    totalCommandes: 2, totalDepense: 420
  },
  {
    id: 'c6', nom: 'Ziani', prenom: 'Samira', telephone: '0667890123',
    email: 'sziani@gmail.com', adresse: '9 Rue Al Massira', ville: 'Agadir',
    region: 'Souss-Massa', statut: 'actif', dateCreation: '2024-04-05',
    totalCommandes: 4, totalDepense: 980
  },
  {
    id: 'c7', nom: 'Bensouda', prenom: 'Rachid', telephone: '0678901234',
    adresse: '15 Bd Mohammed VI', ville: 'Oujda',
    region: 'Oriental', statut: 'blacklist', dateCreation: '2024-02-28',
    totalCommandes: 1, totalDepense: 0, notes: 'Retourne les commandes systématiquement'
  },
  {
    id: 'c8', nom: 'Lamrani', prenom: 'Zineb', telephone: '0689012345',
    email: 'zlamrani@gmail.com', adresse: '4 Allée des Roses', ville: 'Meknès',
    region: 'Fès-Meknès', statut: 'vip', dateCreation: '2023-11-10',
    totalCommandes: 12, totalDepense: 5600, notes: 'VIP - réductions spéciales'
  },
];

// ── PRODUITS ──────────────────────────────────────────────────
export const mockProduits: Produit[] = [
  {
    id: 'p1', nom: 'Montre Smart Pro X1', sku: 'MSP-001',
    categorie: 'Électronique', prixVente: 399, prixAchat: 120, prixLivraison: 25,
    stock: 45, stockMin: 10, actif: true, dateCreation: '2024-01-01',
    description: 'Montre connectée avec GPS et monitoring santé',
    marge: ((399 - 120 - 25) / 399 * 100)
  },
  {
    id: 'p2', nom: 'Sac à Dos Business', sku: 'SAB-002',
    categorie: 'Accessoires', prixVente: 199, prixAchat: 55, prixLivraison: 20,
    stock: 8, stockMin: 15, actif: true, dateCreation: '2024-01-05',
    description: 'Sac professionnel 30L avec compartiment laptop',
    marge: ((199 - 55 - 20) / 199 * 100)
  },
  {
    id: 'p3', nom: 'Crème Visage Premium', sku: 'CVP-003',
    categorie: 'Beauté', prixVente: 149, prixAchat: 35, prixLivraison: 15,
    stock: 120, stockMin: 30, actif: true, dateCreation: '2024-01-10',
    description: 'Crème hydratante naturelle 50ml',
    marge: ((149 - 35 - 15) / 149 * 100)
  },
  {
    id: 'p4', nom: 'Écouteurs Sans Fil', sku: 'ESF-004',
    categorie: 'Électronique', prixVente: 299, prixAchat: 80, prixLivraison: 20,
    stock: 3, stockMin: 10, actif: true, dateCreation: '2024-02-01',
    description: 'Écouteurs Bluetooth 5.0 ANC 30h batterie',
    marge: ((299 - 80 - 20) / 299 * 100)
  },
  {
    id: 'p5', nom: 'Tablette Graphique', sku: 'TGR-005',
    categorie: 'Électronique', prixVente: 599, prixAchat: 200, prixLivraison: 30,
    stock: 22, stockMin: 5, actif: true, dateCreation: '2024-02-15',
    description: 'Tablette dessin 10 pouces avec stylet',
    marge: ((599 - 200 - 30) / 599 * 100)
  },
  {
    id: 'p6', nom: 'Parfum Oud Royal', sku: 'POR-006',
    categorie: 'Beauté', prixVente: 249, prixAchat: 70, prixLivraison: 15,
    stock: 60, stockMin: 20, actif: true, dateCreation: '2024-03-01',
    description: 'Parfum oriental 100ml longue tenue',
    marge: ((249 - 70 - 15) / 249 * 100)
  },
  {
    id: 'p7', nom: 'Chaussures Running', sku: 'CHR-007',
    categorie: 'Sport', prixVente: 349, prixAchat: 110, prixLivraison: 25,
    stock: 35, stockMin: 10, actif: true, dateCreation: '2024-03-10',
    description: 'Chaussures trail running légères',
    marge: ((349 - 110 - 25) / 349 * 100)
  },
  {
    id: 'p8', nom: 'Huile Argan Bio', sku: 'HAB-008',
    categorie: 'Beauté', prixVente: 89, prixAchat: 20, prixLivraison: 10,
    stock: 200, stockMin: 50, actif: true, dateCreation: '2024-03-15',
    description: 'Huile d\'argan pure biologique 50ml',
    marge: ((89 - 20 - 10) / 89 * 100)
  },
];

// ── COMMANDES ─────────────────────────────────────────────────
export const mockCommandes: Commande[] = [
  {
    id: 'cmd1', reference: 'CMD-2024-001', clientId: 'c1',
    clientNom: 'Mohammed Tazi', clientTelephone: '0612345678', clientVille: 'Casablanca',
    agentId: 'u2', agentNom: 'Sara Mansouri',
    items: [
      { id: 'i1', produitId: 'p1', produitNom: 'Montre Smart Pro X1', quantite: 1, prixUnitaire: 399, total: 399 },
      { id: 'i2', produitId: 'p8', produitNom: 'Huile Argan Bio', quantite: 2, prixUnitaire: 89, total: 178 }
    ],
    sousTotal: 577, fraisLivraison: 25, total: 602,
    statut: 'livree', statutAppel: 'confirme', statutLivraison: 'livre',
    transporteurId: 't1', transporteurNom: 'Amana', numeroSuivi: 'AM123456',
    source: 'Facebook Ads', notes: 'Livrer avant 18h',
    dateCreation: '2024-06-01', dateConfirmation: '2024-06-01', dateExpedition: '2024-06-02', dateLivraison: '2024-06-03'
  },
  {
    id: 'cmd2', reference: 'CMD-2024-002', clientId: 'c2',
    clientNom: 'Amina Berrada', clientTelephone: '0623456789', clientVille: 'Rabat',
    agentId: 'u3', agentNom: 'Youssef Alaoui',
    items: [
      { id: 'i3', produitId: 'p3', produitNom: 'Crème Visage Premium', quantite: 3, prixUnitaire: 149, total: 447 }
    ],
    sousTotal: 447, fraisLivraison: 15, total: 462,
    statut: 'confirmee', statutAppel: 'confirme', statutLivraison: 'en_attente',
    source: 'Instagram Ads', dateCreation: '2024-06-10', dateConfirmation: '2024-06-10'
  },
  {
    id: 'cmd3', reference: 'CMD-2024-003', clientId: 'c3',
    clientNom: 'Khalid Hajji', clientTelephone: '0634567890', clientVille: 'Marrakech',
    items: [
      { id: 'i4', produitId: 'p4', produitNom: 'Écouteurs Sans Fil', quantite: 1, prixUnitaire: 299, total: 299 }
    ],
    sousTotal: 299, fraisLivraison: 20, total: 319,
    statut: 'nouvelle', statutAppel: 'non_appele',
    source: 'Site Web', dateCreation: '2024-06-15'
  },
  {
    id: 'cmd4', reference: 'CMD-2024-004', clientId: 'c4',
    clientNom: 'Nadia Fassi', clientTelephone: '0645678901', clientVille: 'Fès',
    agentId: 'u2', agentNom: 'Sara Mansouri',
    items: [
      { id: 'i5', produitId: 'p6', produitNom: 'Parfum Oud Royal', quantite: 2, prixUnitaire: 249, total: 498 },
      { id: 'i6', produitId: 'p3', produitNom: 'Crème Visage Premium', quantite: 1, prixUnitaire: 149, total: 149 }
    ],
    sousTotal: 647, fraisLivraison: 15, total: 662,
    statut: 'en_attente', statutAppel: 'rappel',
    source: 'Facebook Ads', notesAgent: 'Rappeler demain matin',
    dateCreation: '2024-06-12'
  },
  {
    id: 'cmd5', reference: 'CMD-2024-005', clientId: 'c5',
    clientNom: 'Hamid Kettani', clientTelephone: '0656789012', clientVille: 'Tanger',
    agentId: 'u3', agentNom: 'Youssef Alaoui',
    items: [
      { id: 'i7', produitId: 'p7', produitNom: 'Chaussures Running', quantite: 1, prixUnitaire: 349, total: 349 }
    ],
    sousTotal: 349, fraisLivraison: 25, total: 374,
    statut: 'refusee', statutAppel: 'refuse',
    source: 'TikTok Ads', dateCreation: '2024-06-08'
  },
  {
    id: 'cmd6', reference: 'CMD-2024-006', clientId: 'c6',
    clientNom: 'Samira Ziani', clientTelephone: '0667890123', clientVille: 'Agadir',
    agentId: 'u2', agentNom: 'Sara Mansouri',
    items: [
      { id: 'i8', produitId: 'p5', produitNom: 'Tablette Graphique', quantite: 1, prixUnitaire: 599, total: 599 },
      { id: 'i9', produitId: 'p2', produitNom: 'Sac à Dos Business', quantite: 1, prixUnitaire: 199, total: 199 }
    ],
    sousTotal: 798, fraisLivraison: 30, total: 828,
    statut: 'expediee', statutAppel: 'confirme', statutLivraison: 'en_transit',
    transporteurId: 't2', transporteurNom: 'CTM', numeroSuivi: 'CTM789012',
    source: 'Site Web', dateCreation: '2024-06-11', dateConfirmation: '2024-06-11', dateExpedition: '2024-06-13'
  },
  {
    id: 'cmd7', reference: 'CMD-2024-007', clientId: 'c8',
    clientNom: 'Zineb Lamrani', clientTelephone: '0689012345', clientVille: 'Meknès',
    agentId: 'u4', agentNom: 'Fatima Chraibi',
    items: [
      { id: 'i10', produitId: 'p1', produitNom: 'Montre Smart Pro X1', quantite: 2, prixUnitaire: 399, total: 798 }
    ],
    sousTotal: 798, fraisLivraison: 25, total: 823,
    statut: 'livree', statutAppel: 'confirme', statutLivraison: 'livre',
    transporteurId: 't1', transporteurNom: 'Amana', numeroSuivi: 'AM654321',
    source: 'Récurrent', dateCreation: '2024-06-05', dateConfirmation: '2024-06-05', dateExpedition: '2024-06-06', dateLivraison: '2024-06-07'
  },
  {
    id: 'cmd8', reference: 'CMD-2024-008', clientId: 'c1',
    clientNom: 'Mohammed Tazi', clientTelephone: '0612345678', clientVille: 'Casablanca',
    agentId: 'u2', agentNom: 'Sara Mansouri',
    items: [
      { id: 'i11', produitId: 'p3', produitNom: 'Crème Visage Premium', quantite: 5, prixUnitaire: 149, total: 745 }
    ],
    sousTotal: 745, fraisLivraison: 15, total: 760,
    statut: 'en_preparation', statutAppel: 'confirme', statutLivraison: 'en_attente',
    source: 'WhatsApp', dateCreation: '2024-06-14', dateConfirmation: '2024-06-14'
  },
  {
    id: 'cmd9', reference: 'CMD-2024-009', clientId: 'c2',
    clientNom: 'Amina Berrada', clientTelephone: '0623456789', clientVille: 'Rabat',
    items: [
      { id: 'i12', produitId: 'p8', produitNom: 'Huile Argan Bio', quantite: 4, prixUnitaire: 89, total: 356 }
    ],
    sousTotal: 356, fraisLivraison: 10, total: 366,
    statut: 'nouvelle', statutAppel: 'injoignable',
    source: 'Instagram Ads', dateCreation: '2024-06-16'
  },
  {
    id: 'cmd10', reference: 'CMD-2024-010', clientId: 'c4',
    clientNom: 'Nadia Fassi', clientTelephone: '0645678901', clientVille: 'Fès',
    agentId: 'u3', agentNom: 'Youssef Alaoui',
    items: [
      { id: 'i13', produitId: 'p2', produitNom: 'Sac à Dos Business', quantite: 2, prixUnitaire: 199, total: 398 }
    ],
    sousTotal: 398, fraisLivraison: 20, total: 418,
    statut: 'livree', statutAppel: 'confirme', statutLivraison: 'livre',
    source: 'Facebook Ads', dateCreation: '2024-06-03', dateConfirmation: '2024-06-03', dateExpedition: '2024-06-04', dateLivraison: '2024-06-05'
  },
];

// ── APPELS ────────────────────────────────────────────────────
export const mockAppels: Appel[] = [
  {
    id: 'a1', commandeId: 'cmd1', commandeRef: 'CMD-2024-001',
    clientId: 'c1', clientNom: 'Mohammed Tazi', clientTelephone: '0612345678',
    agentId: 'u2', agentNom: 'Sara Mansouri',
    statut: 'confirme', duree: 180, notes: 'Client satisfait, commande confirmée',
    dateAppel: '2024-06-01T09:30:00'
  },
  {
    id: 'a2', commandeId: 'cmd4', commandeRef: 'CMD-2024-004',
    clientId: 'c4', clientNom: 'Nadia Fassi', clientTelephone: '0645678901',
    agentId: 'u2', agentNom: 'Sara Mansouri',
    statut: 'rappel', duree: 45, notes: 'Pas disponible, rappel demain 10h',
    dateAppel: '2024-06-12T11:00:00', rappelDate: '2024-06-13T10:00:00'
  },
  {
    id: 'a3', commandeId: 'cmd5', commandeRef: 'CMD-2024-005',
    clientId: 'c5', clientNom: 'Hamid Kettani', clientTelephone: '0656789012',
    agentId: 'u3', agentNom: 'Youssef Alaoui',
    statut: 'refuse', duree: 90, notes: 'Client a changé d\'avis',
    dateAppel: '2024-06-08T14:00:00'
  },
  {
    id: 'a4', commandeId: 'cmd3', commandeRef: 'CMD-2024-003',
    clientId: 'c3', clientNom: 'Khalid Hajji', clientTelephone: '0634567890',
    agentId: 'u2', agentNom: 'Sara Mansouri',
    statut: 'non_appele', notes: 'Nouveau lead à traiter',
    dateAppel: '2024-06-15T08:00:00'
  },
  {
    id: 'a5', commandeId: 'cmd9', commandeRef: 'CMD-2024-009',
    clientId: 'c2', clientNom: 'Amina Berrada', clientTelephone: '0623456789',
    agentId: 'u3', agentNom: 'Youssef Alaoui',
    statut: 'injoignable', duree: 0, notes: 'Téléphone éteint, 3 tentatives',
    dateAppel: '2024-06-16T10:30:00'
  },
];

// ── TRANSPORTEURS ─────────────────────────────────────────────
export const mockTransporteurs: Transporteur[] = [
  { id: 't1', nom: 'Amana', contact: 'commercial@amana.ma', telephone: '0522000001', tarifBase: 25, actif: true, apiDisponible: true, apiEndpoint: 'https://api.amana.ma/v1' },
  { id: 't2', nom: 'CTM', contact: 'pro@ctm.ma', telephone: '0522000002', tarifBase: 30, actif: true, apiDisponible: false },
  { id: 't3', nom: 'Chronopost Maroc', contact: 'b2b@chronopost.ma', telephone: '0522000003', tarifBase: 45, actif: true, apiDisponible: true, apiEndpoint: 'https://api.chronopost.ma/v2' },
  { id: 't4', nom: 'Barid', contact: 'entreprises@barid.ma', telephone: '0522000004', tarifBase: 20, actif: false, apiDisponible: false },
];

// ── DÉPENSES ──────────────────────────────────────────────────
export const mockDepenses: Depense[] = [
  { id: 'd1', titre: 'Facebook Ads - Juin', montant: 5000, type: 'publicite', description: 'Budget pub Facebook/Instagram', date: '2024-06-01', creePar: 'u1' },
  { id: 'd2', titre: 'Salaire Sara Mansouri', montant: 4500, type: 'salaires', description: 'Salaire agent call center', date: '2024-06-01', creePar: 'u1' },
  { id: 'd3', titre: 'Salaire Youssef Alaoui', montant: 4200, type: 'salaires', description: 'Salaire agent call center', date: '2024-06-01', creePar: 'u1' },
  { id: 'd4', titre: 'Loyer Bureau Casablanca', montant: 8000, type: 'loyer', description: 'Loyer mensuel', date: '2024-06-01', creePar: 'u1' },
  { id: 'd5', titre: 'Frais livraison Juin', montant: 1200, type: 'livraison', description: 'Frais transporteurs', date: '2024-06-10', creePar: 'u5' },
  { id: 'd6', titre: 'TikTok Ads - Juin', montant: 2500, type: 'publicite', description: 'Budget pub TikTok', date: '2024-06-01', creePar: 'u1' },
  { id: 'd7', titre: 'Achat stock Crème', montant: 4200, type: 'achat_stock', description: '120 unités crème visage', date: '2024-06-05', creePar: 'u1' },
  { id: 'd8', titre: 'Google Ads - Juin', montant: 1800, type: 'publicite', description: 'Budget Search + Display', date: '2024-06-01', creePar: 'u1' },
  { id: 'd9', titre: 'Salaire Fatima Chraibi', montant: 6000, type: 'salaires', description: 'Salaire manager', date: '2024-06-01', creePar: 'u1' },
  { id: 'd10', titre: 'Fournitures bureau', montant: 350, type: 'autre', description: 'Matériel emballage', date: '2024-06-08', creePar: 'u5' },
];

// ── NOTIFICATIONS ─────────────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: 'n1', type: 'commande', titre: 'Nouvelle commande', message: 'CMD-2024-009 - Amina Berrada - 366 DH', lu: false, date: '2024-06-16T10:00:00', lien: '/commandes' },
  { id: 'n2', type: 'stock', titre: 'Stock critique', message: 'Écouteurs Sans Fil: 3 unités restantes (min: 10)', lu: false, date: '2024-06-15T08:00:00', lien: '/produits' },
  { id: 'n3', type: 'stock', titre: 'Stock faible', message: 'Sac à Dos Business: 8 unités (min: 15)', lu: false, date: '2024-06-15T08:00:00', lien: '/produits' },
  { id: 'n4', type: 'commande', titre: 'Nouvelle commande', message: 'CMD-2024-003 - Khalid Hajji - 319 DH', lu: true, date: '2024-06-15T07:30:00', lien: '/commandes' },
  { id: 'n5', type: 'appel', titre: 'Rappel planifié', message: 'Nadia Fassi - CMD-2024-004 - Rappeler à 10h', lu: true, date: '2024-06-13T09:00:00', lien: '/call-center' },
];

// ── DONNÉES GRAPHIQUE ─────────────────────────────────────────
export const mockChiffreAffairesJour = [
  { jour: '1 Jun', ca: 1425, commandes: 3, profit: 620 },
  { jour: '2 Jun', ca: 2100, commandes: 5, profit: 890 },
  { jour: '3 Jun', ca: 980, commandes: 2, profit: 410 },
  { jour: '4 Jun', ca: 3200, commandes: 7, profit: 1380 },
  { jour: '5 Jun', ca: 1750, commandes: 4, profit: 760 },
  { jour: '6 Jun', ca: 2890, commandes: 6, profit: 1220 },
  { jour: '7 Jun', ca: 4100, commandes: 9, profit: 1780 },
  { jour: '8 Jun', ca: 1600, commandes: 4, profit: 690 },
  { jour: '9 Jun', ca: 2450, commandes: 5, profit: 1050 },
  { jour: '10 Jun', ca: 3100, commandes: 7, profit: 1340 },
  { jour: '11 Jun', ca: 5200, commandes: 11, profit: 2250 },
  { jour: '12 Jun', ca: 2800, commandes: 6, profit: 1210 },
  { jour: '13 Jun', ca: 3600, commandes: 8, profit: 1560 },
  { jour: '14 Jun', ca: 4500, commandes: 10, profit: 1950 },
];

export const mockDepensesParType = [
  { type: 'Publicité', montant: 9300, color: '#6366f1' },
  { type: 'Salaires', montant: 14700, color: '#f59e0b' },
  { type: 'Loyer', montant: 8000, color: '#10b981' },
  { type: 'Livraison', montant: 1200, color: '#3b82f6' },
  { type: 'Achat Stock', montant: 4200, color: '#ef4444' },
  { type: 'Autre', montant: 350, color: '#8b5cf6' },
];

export const mockStatutsCommandes = [
  { statut: 'Livrées', count: 3, color: '#10b981' },
  { statut: 'Confirmées', count: 2, color: '#3b82f6' },
  { statut: 'Nouvelles', count: 2, color: '#6366f1' },
  { statut: 'Expédiées', count: 1, color: '#f59e0b' },
  { statut: 'Refusées', count: 1, color: '#ef4444' },
  { statut: 'En att.', count: 1, color: '#8b5cf6' },
];

export const mockPerformanceAgents = [
  { agent: 'Sara M.', confirmes: 72, refuses: 15, injoignables: 13 },
  { agent: 'Youssef A.', confirmes: 65, refuses: 20, injoignables: 15 },
  { agent: 'Fatima C.', confirmes: 78, refuses: 12, injoignables: 10 },
];
