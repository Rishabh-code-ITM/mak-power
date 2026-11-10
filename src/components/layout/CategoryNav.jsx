import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, Truck, Sparkles, ShieldAlert } from 'lucide-react';
import { INITIAL_CATEGORIES } from '../../services/mockData';

export default function CategoryNav() {
  const location = useLocation();

  return (
    <nav className="category-navbar">
      <div className="container">
        <div className="category-nav-list">
          <Link
            to="/shop"
            className={`category-nav-item ${location.pathname === '/shop' && !location.search ? 'active' : ''}`}
          >
            All Products
          </Link>

          {INITIAL_CATEGORIES.map(cat => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className={`category-nav-item ${location.search.includes(cat.slug) ? 'active' : ''}`}
            >
              {cat.name}
            </Link>
          ))}

          <Link
            to="/track-order"
            className="category-nav-item"
            style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--primary)', fontWeight: 700 }}
          >
            <Truck size={14} />
            <span>Track Order</span>
          </Link>

          <Link
            to="/admin"
            className="category-nav-item"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)' }}
          >
            <ShieldAlert size={14} />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
