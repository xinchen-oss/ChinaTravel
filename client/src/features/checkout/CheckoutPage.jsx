import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

// Single guide checkout now redirects to cart flow
export default function CheckoutPage() {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const { isInCart } = useCart();

  useEffect(() => {
    if (isInCart(guideId)) {
      navigate('/checkout-all');
    } else {
      // If guide not in cart, send them to the guide page to add it
      navigate(`/guias/${guideId}`);
    }
  }, [guideId, navigate, isInCart]);

  return null;
}
