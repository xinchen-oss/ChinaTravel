import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/guards/PrivateRoute';
import AdminRoute from './components/guards/AdminRoute';
import ComercialRoute from './components/guards/ComercialRoute';

// Pages
import HomePage from './pages/HomePage';
import CitiesPage from './pages/CitiesPage';
import CityDetailPage from './pages/CityDetailPage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';

// Auth
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';

// Guides
import GuidesListPage from './features/guides/GuidesListPage';
import GuideDetailPage from './features/guides/GuideDetailPage';
import GuideCustomizePage from './features/guides/GuideCustomizePage';

// Culture
import CulturePage from './features/culture/CulturePage';
import CultureDetailPage from './features/culture/CultureDetailPage';

// Checkout
import CheckoutPage from './features/checkout/CheckoutPage';
import OrderConfirmationPage from './features/checkout/OrderConfirmationPage';

// Dashboard
import UserDashboard from './features/dashboard/UserDashboard';

// Admin
import AdminDashboard from './features/admin/AdminDashboard';
import ManageUsersPage from './features/admin/ManageUsersPage';
import ManageCitiesPage from './features/admin/ManageCitiesPage';
import ManageGuidesPage from './features/admin/ManageGuidesPage';
import ManageActivitiesPage from './features/admin/ManageActivitiesPage';
import ManageCulturePage from './features/admin/ManageCulturePage';
import ManageOrdersPage from './features/admin/ManageOrdersPage';
import ApprovalQueuePage from './features/admin/ApprovalQueuePage';

// Comercial
import ComercialDashboard from './features/comercial/ComercialDashboard';
import SubmitContentPage from './features/comercial/SubmitContentPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            {/* Public */}
            <Route index element={<HomePage />} />
            <Route path="ciudades" element={<CitiesPage />} />
            <Route path="ciudades/:slug" element={<CityDetailPage />} />
            <Route path="guias" element={<GuidesListPage />} />
            <Route path="guias/:id" element={<GuideDetailPage />} />
            <Route path="cultura" element={<CulturePage />} />
            <Route path="cultura/:id" element={<CultureDetailPage />} />
            <Route path="sobre-nosotros" element={<AboutPage />} />
            <Route path="politica-de-privacidad" element={<PrivacyPolicyPage />} />

            {/* Auth */}
            <Route path="login" element={<LoginPage />} />
            <Route path="registro" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPasswordPage />} />

            {/* Private */}
            <Route path="guias/:id/personalizar" element={<PrivateRoute><GuideCustomizePage /></PrivateRoute>} />
            <Route path="checkout/:guideId" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="pedido-confirmado/:id" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
            <Route path="dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />

            {/* Admin */}
            <Route path="admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="admin/usuarios" element={<AdminRoute><ManageUsersPage /></AdminRoute>} />
            <Route path="admin/ciudades" element={<AdminRoute><ManageCitiesPage /></AdminRoute>} />
            <Route path="admin/guias" element={<AdminRoute><ManageGuidesPage /></AdminRoute>} />
            <Route path="admin/actividades" element={<AdminRoute><ManageActivitiesPage /></AdminRoute>} />
            <Route path="admin/cultura" element={<AdminRoute><ManageCulturePage /></AdminRoute>} />
            <Route path="admin/pedidos" element={<AdminRoute><ManageOrdersPage /></AdminRoute>} />
            <Route path="admin/aprobaciones" element={<AdminRoute><ApprovalQueuePage /></AdminRoute>} />

            {/* Comercial */}
            <Route path="comercial" element={<ComercialRoute><ComercialDashboard /></ComercialRoute>} />
            <Route path="comercial/nueva-solicitud" element={<ComercialRoute><SubmitContentPage /></ComercialRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
