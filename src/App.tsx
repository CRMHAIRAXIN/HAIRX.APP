import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Commandes } from './pages/Commandes';
import { Clients } from './pages/Clients';
import { Produits } from './pages/Produits';
import { CallCenter } from './pages/CallCenter';
import { Livraisons } from './pages/Livraisons';
import { Finance } from './pages/Finance';
import { Employes } from './pages/Employes';
import { Rapports } from './pages/Rapports';
import { Profile } from './pages/Profile';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useStore();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="commandes" element={<Commandes />} />
          <Route path="clients" element={<Clients />} />
          <Route path="produits" element={<Produits />} />
          <Route path="call-center" element={<CallCenter />} />
          <Route path="livraisons" element={<Livraisons />} />
          <Route path="finance" element={<Finance />} />
          <Route path="employes" element={<Employes />} />
          <Route path="rapports" element={<Rapports />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
