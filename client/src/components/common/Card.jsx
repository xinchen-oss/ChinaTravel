import { Link } from 'react-router-dom';
import './Card.css';

export default function Card({ to, image, title, subtitle, badge, children, className = '' }) {
  const Wrapper = to ? Link : 'div';
  const props = to ? { to } : {};

  return (
    <Wrapper className={`card ${className}`} {...props}>
      {image && (
        <div className="card__image">
          <img src={image} alt={title} />
          {badge && <span className="card__badge">{badge}</span>}
        </div>
      )}
      <div className="card__body">
        {title && <h3 className="card__title">{title}</h3>}
        {subtitle && <p className="card__subtitle">{subtitle}</p>}
        {children}
      </div>
    </Wrapper>
  );
}
