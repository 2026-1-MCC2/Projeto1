import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { ToastProvider } from './contexts/ToastContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Navbar from './components/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import UsuariosPage from './pages/UsuariosPage.jsx';
import UsuarioFormPage from './pages/UsuarioFormPage.jsx';
import PerfilPage from './pages/PerfilPage.jsx';

function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}

function HomeRedirect() {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={isAuthenticated ? '/usuarios' : '/login'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<HomeRedirect />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registro" element={<RegisterPage />} />

            <Route
              path="/usuarios"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UsuariosPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios/novo"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UsuarioFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/usuarios/:id/editar"
              element={
                <ProtectedRoute>
                  <Layout>
                    <UsuarioFormPage />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/perfil"
              element={
                <ProtectedRoute>
                  <Layout>
                    <PerfilPage />
                  </Layout>
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
