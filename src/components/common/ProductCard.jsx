import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Zap, MessageCircle } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import RatingStars from './RatingStars';
import { STORE_INFO } from '../../services/mockData';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.originalPrice > product.sellingPrice
    ? Math.round(((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100)
    : 0;

  const handleWhatsAppEnquire = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = encodeURIComponent(`Hello MAK POWER! I am interested in purchasing "${product.name}" (Price: ₹${product.sellingPrice}). Please confirm availability.`);
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${text}`, '_blank');
  };

  return (
    <div className="product-card">
      
      {/* Product Image Box */}
      <div className="product-card-image-box">
        <Link to={`/product/${product.slug}`} style={{ display: 'block', width: '100%', height: '100%' }}>
          <img src={product.images[0]} alt={product.name} loading="lazy" />
        </Link>

        {/* Badge */}
        {product.isBestseller && (
          <span className="product-card-badge" style={{ background: '#f59e0b' }}>Bestseller</span>
        )}
        {!product.isBestseller && product.isTrending && (
          <span className="product-card-badge" style={{ background: 'var(--primary)' }}>Trending</span>
        )}
        {!product.isBestseller && !product.isTrending && discountPercent > 0 && (
          <span className="product-card-badge" style={{ background: 'var(--success)' }}>{discountPercent}% OFF</span>
        )}

        {/* Wishlist Toggle Button */}
        <button
          className={`product-wishlist-btn ${isFavorited ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          title={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart size={18} fill={isFavorited ? 'var(--primary)' : 'none'} color={isFavorited ? 'var(--primary)' : 'currentColor'} />
        </button>
      </div>

      {/* Card Info */}
      <div className="product-card-info">
        <span className="product-category-label">{product.categoryName}</span>
        
        <Link to={`/product/${product.slug}`} className="product-title-link" title={product.name}>
          {product.name}
        </Link>

        <RatingStars rating={product.rating} count={product.reviewsCount} />

        {/* Price Row */}
        <div className="product-price-row">
          <span className="selling-price">₹{product.sellingPrice}</span>
          {product.originalPrice > product.sellingPrice && (
            <span className="original-price">₹{product.originalPrice}</span>
          )}
          {discountPercent > 0 && (
            <span className="discount-percentage">{discountPercent}% off</span>
          )}
        </div>

        {/* Stock Status */}
        <div className={`stock-status-label ${product.stock > 10 ? 'in-stock' : 'low-stock'}`}>
          {product.stock > 10 ? '✓ In Stock' : product.stock > 0 ? `⚡ Only ${product.stock} left in stock` : '✕ Out of stock'}
        </div>

        {/* Actions */}
        <div className="product-card-actions">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
          >
            <ShoppingBag size={15} />
            <span>Add to Cart</span>
          </button>
          
          <button
            className="btn btn-secondary btn-sm"
            onClick={handleWhatsAppEnquire}
            title="Enquire on WhatsApp"
            style={{ padding: '6px 10px', color: '#16a34a' }}
          >
            <MessageCircle size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
