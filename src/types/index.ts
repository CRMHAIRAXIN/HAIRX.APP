// ============================================================
// TYPES & INTERFACES — CRM Pro
// ============================================================

export type UserRole = 'admin' | 'manager' | 'agent' | 'comptable';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: UserRole;
  telephone?: string;
  avatar?: string;
  actif: boolean;
  dateCreation: string;
  performance?: {
    commandesTraitees: number;
    tauxConversion: number;
    appelsTotaux: number;
  };
}

export type StatutCommande =
  | 'nouvelle'
  | 'en_attente'
  | 'confirmee'
  | 'en_preparation'
  | 'expediee'
  | 'livree'
  | 'refusee'
  | 'retournee'
  | 'annulee';

export type StatutLivraison =
  | 'en_attente'
  | 'ramasse'
  | 'en_transit'
  | 'en_livraison'
  | 'livre'
  | 'echec'
  | 'retourne';

export type StatutAppel =
  | 'non_appele'
  | 'en_cours'
  | 'confirme'
  | 'rappel'
  | 'injoignable'
  | 'refuse'
  | 'numero_invalide';

export interface Produit {
  id: string;
  nom: string;
  sku: string;
  categorie: string;
  description?: string;
  prixVente: number;
  prixAchat: number;
  prixLivraison: number;
  stock: number;
  stockMin: number;
  image?: string;
  actif: boolean;
  dateCreation: string;
  marge?: number;
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  telephone: string;
  telephone2?: string;
  email?: string;
  adresse: string;
  ville: string;
  region: string;
  notes?: string;
  dateCreation: string;
  totalCommandes: number;
  totalDepense: number;
  statut: 'nouveau' | 'actif' | 'inactif' | 'vip' | 'blacklist';
}

export interface CommandeItem {
  id: string;
  produitId: string;
  produitNom: string;
  quantite: number;
  prixUnitaire: number;
  total: number;
}

export interface Commande {
  id: string;
  reference: string;
  clientId: string;
  clientNom: string;
  clientTelephone: string;
  clientVille: string;
  agentId?: string;
  agentNom?: string;
  items: CommandeItem[];
  sousTotal: number;
  fraisLivraison: number;
  total: number;
  statut: StatutCommande;
  statutAppel: StatutAppel;
  statutLivraison?: StatutLivraison;
  transporteurId?: string;
  transporteurNom?: string;
  numeroSuivi?: string;
  source: string;
  notes?: string;
  notesAgent?: string;
  dateCreation: string;
  dateConfirmation?: string;
  dateLivraison?: string;
  dateExpedition?: string;
}

export interface Appel {
  id: string;
  commandeId: string;
  commandeRef: string;
  clientId: string;
  clientNom: string;
  clientTelephone: string;
  agentId: string;
  agentNom: string;
  statut: StatutAppel;
  duree?: number;
  notes?: string;
  dateAppel: string;
  rappelDate?: string;
}

export interface Transporteur {
  id: string;
  nom: string;
  contact?: string;
  telephone?: string;
  tarifBase: number;
  actif: boolean;
  apiDisponible: boolean;
  apiEndpoint?: string;
}

export interface Livraison {
  id: string;
  commandeId: string;
  commandeRef: string;
  transporteurId: string;
  transporteurNom: string;
  numeroSuivi?: string;
  statut: StatutLivraison;
  dateExpedition?: string;
  dateLivraisonPrevue?: string;
  dateLivraisonReelle?: string;
  cout: number;
  adresseLivraison: string;
  notes?: string;
}

export type TypeDepense = 'publicite' | 'salaires' | 'livraison' | 'loyer' | 'achat_stock' | 'autre';

export interface Depense {
  id: string;
  titre: string;
  montant: number;
  type: TypeDepense;
  description?: string;
  date: string;
  creePar: string;
  justificatif?: string;
}

export interface KPIs {
  chiffreAffaires: number;
  chiffreAffairesHier: number;
  totalCommandes: number;
  commandesHier: number;
  commandesConfirmees: number;
  commandesLivrees: number;
  commandesRefusees: number;
  tauxConfirmation: number;
  tauxLivraison: number;
  totalDepenses: number;
  profit: number;
  ticketMoyen: number;
  nouveauxClients: number;
  stockAlertes: number;
}

export interface Notification {
  id: string;
  type: 'commande' | 'stock' | 'appel' | 'finance' | 'systeme';
  titre: string;
  message: string;
  lu: boolean;
  date: string;
  lien?: string;
}
