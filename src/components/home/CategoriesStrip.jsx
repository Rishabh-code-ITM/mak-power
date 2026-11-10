import React from 'react';
import { Link } from 'react-router-dom';
import { INITIAL_CATEGORIES } from '../../services/mockData';

export default function CategoriesStrip() {
  return (
    <div style={{ margin: '30px 0' }}>
      <div className="category-strip">
        {INITIAL_CATEGORIES.map(cat => (
          <Link
            key={cat.id}
            to={`/shop?category=${cat.slug}`}
            className="category-strip-card"
          >
            <img src={cat.image} alt={cat.name} className="category-strip-thumb" />
            <span className="category-strip-name">{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
