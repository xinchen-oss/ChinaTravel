import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { ROLES } from '../../utils/constants';
import LoadingSpinner from '../common/LoadingSpinner';

export default function ComercialRoute({ children }) {
  const { user, loading, logout } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== ROLES.COMERCIAL) {
    logout();
    return <Navigate to="/login" replace />;
  }
  return children;
}
