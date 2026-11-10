import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 4.8, count }) {
  const rounded = Math.round(rating * 10) / 10;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
      <div className="product-rating-pill">
        <span>{rounded}</span>
        <Star size={11} fill="#fff" stroke="#fff" />
      </div>
      {count !== undefined && (
        <span className="rating-count-text">({count})</span>
      )}
    </div>
  );
}
