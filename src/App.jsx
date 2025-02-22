import { Routes, Route, Navigate } from 'react-router-dom';
import { LinksProvider } from './context/LinksContext';
import PublicPage from './pages/PublicPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import RegisterPage from './pages/RegisterPage';

function App() {
  return (
    <AuthProvider>
      <LinksProvider>
        <Routes>
          <Route path="/" element={<PublicPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </LinksProvider>
    </AuthProvider>
  );
}

export default App;