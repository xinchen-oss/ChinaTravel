import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

// Single guide checkout now redirects to cart flow
export default function CheckoutPage() {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isInCart, updateItem } = useCart();

  useEffect(() => {
    // If customizations were passed from the customize page, save them to cart
    const customizations = location.state?.customizations;
    if (customizations && isInCart(guideId)) {
      updateItem(guideId, { customizations });
    }

    if (isInCart(guideId)) {
      navigate('/checkout-all');
    } else {
      navigate(`/guias/${guideId}`);
    }
  }, [guideId, navigate, isInCart, location.state, updateItem]);

  return null;
}
