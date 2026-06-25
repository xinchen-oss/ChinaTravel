import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

// Single ruta checkout now redirects to the unified cart flow.
export default function CheckoutPage() {
  const { rutaId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isInCart, updateItem } = useCart();

  useEffect(() => {
    // If customizations were passed from the customize page, save them to the cart item.
    const customizations = location.state?.customizations;
    if (customizations && isInCart('RUTA', rutaId)) {
      updateItem('RUTA', rutaId, { customizations });
    }

    if (isInCart('RUTA', rutaId)) {
      navigate('/checkout-all');
    } else {
      navigate(`/rutas/${rutaId}`);
    }
  }, [rutaId, navigate, isInCart, location.state, updateItem]);

  return null;
}
