import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ShoppingBag } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ padding: '90px 20px', textAlign: 'center' }}>
      <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '5rem', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
        404
      </h1>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, margin: '12px 0' }}>
        Page Not Found
      </h2>
      <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '440px', margin: '0 auto 24px' }}>
        The page you are looking for does not exist or has been moved to a new URL.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Link to="/" className="btn btn-primary">
          <Home size={18} />
          <span>Back to Home</span>
        </Link>
        <Link to="/shop" className="btn btn-secondary">
          <ShoppingBag size={18} />
          <span>Shop Products</span>
        </Link>
      </div>
    </div>
  );
}
