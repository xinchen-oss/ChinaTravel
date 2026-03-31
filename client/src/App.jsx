import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
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
import FAQPage from './pages/FAQPage';
import CancellationPolicyPage from './pages/CancellationPolicyPage';
import CartPage from './pages/CartPage';

// Auth
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import ForgotPasswordPage from './features/auth/ForgotPasswordPage';
import ResetPasswordPage from './features/auth/ResetPasswordPage';
import ConfirmEmailPage from './features/auth/ConfirmEmailPage';

// Guides
import GuidesListPage from './features/guides/GuidesListPage';
import GuideDetailPage from './features/guides/GuideDetailPage';
import GuideCustomizePage from './features/guides/GuideCustomizePage';

// Culture
import CulturePage from './features/culture/CulturePage';
import CultureDetailPage from './features/culture/CultureDetailPage';

// Forum
import ForumPage from './features/forum/ForumPage';
import ForumDetailPage from './features/forum/ForumDetailPage';


// Checkout
import CheckoutPage from './features/checkout/CheckoutPage';
import BatchCheckoutPage from './features/checkout/BatchCheckoutPage';
import OrderConfirmationPage from './features/checkout/OrderConfirmationPage';
import BatchOrderConfirmationPage from './features/checkout/BatchOrderConfirmationPage';

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
import ManageCouponsPage from './features/admin/ManageCouponsPage';
import ManageReviewsPage from './features/admin/ManageReviewsPage';

// Comercial
import ComercialDashboard from './features/comercial/ComercialDashboard';
import SubmitContentPage from './features/comercial/SubmitContentPage';

// Chat
import ChatWidget from './components/chat/ChatWidget';
import AccessibilityWidget from './components/common/AccessibilityWidget';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
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
             <Route path="foro" element={<ForumPage />} />
            <Route path="foro/:id" element={<ForumDetailPage />} />
             <Route path="ayuda" element={<FAQPage />} />
              <Route path="politica-cancelacion" element={<CancellationPolicyPage />} />
              <Route path="carrito" element={<CartPage />} />

              {/* Auth */}
              <Route path="login" element={<LoginPage />} />
              <Route path="registro" element={<RegisterPage />} />
              <Route path="forgot-password" element={<ForgotPasswordPage />} />
              <Route path="reset-password/:token" element={<ResetPasswordPage />} />
              <Route path="confirmar-email/:token" element={<ConfirmEmailPage />} />

              {/* Private */}
              <Route path="guias/:id/personalizar" element={<PrivateRoute><GuideCustomizePage /></PrivateRoute>} />
              <Route path="checkout/:guideId" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
              <Route path="checkout-all" element={<PrivateRoute><BatchCheckoutPage /></PrivateRoute>} />
              <Route path="pedido-confirmado/:id" element={<PrivateRoute><OrderConfirmationPage /></PrivateRoute>} />
              <Route path="pedidos-confirmados" element={<PrivateRoute><BatchOrderConfirmationPage /></PrivateRoute>} />
              <Route path="dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin - with sidebar layout */}
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="usuarios" element={<ManageUsersPage />} />
              <Route path="ciudades" element={<ManageCitiesPage />} />
              <Route path="guias" element={<ManageGuidesPage />} />
              <Route path="actividades" element={<ManageActivitiesPage />} />
              <Route path="cultura" element={<ManageCulturePage />} />
              <Route path="pedidos" element={<ManageOrdersPage />} />
              <Route path="aprobaciones" element={<ApprovalQueuePage />} />
              <Route path="cupones" element={<ManageCouponsPage />} />
              <Route path="resenas" element={<ManageReviewsPage />} />
            </Route>

            {/* Comercial - with sidebar layout */}
            <Route path="/comercial" element={<ComercialRoute><AdminLayout /></ComercialRoute>}>
              <Route index element={<ComercialDashboard />} />
              <Route path="nueva-solicitud" element={<SubmitContentPage />} />
            </Route>
          </Routes>
          <ChatWidget />
          <AccessibilityWidget />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
