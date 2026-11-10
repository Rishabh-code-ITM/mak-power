import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, Heart, User, ShieldCheck, MapPin, X, Menu } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { productsService } from '../../services/productsService';
import { STORE_INFO } from '../../services/mockData';

export default function Header() {
  const navigate = useNavigate();
  const { totalItemsCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAdmin, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef(null);

  // Fetch search suggestions
  useEffect(() => {
    let active = true;
    if (searchTerm.trim().length > 1) {
      productsService.getProducts({ search: searchTerm.trim() }).then(res => {
        if (active) {
          setSuggestions(res.slice(0, 5));
          setShowSuggestions(true);
        }
      });
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
    return () => {
      active = false;
    };
  }, [searchTerm]);

  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowSuggestions(false);
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="main-header">
      <div className="container">
        <div className="header-row">
          
          {/* Logo */}
          <Link to="/" className="header-logo" title="MAK POWER Home">
            <div className="header-logo-icon">
              <img src={STORE_INFO.logoImage} alt="MAK POWER Official Logo" />
            </div>
            <div className="header-logo-text">
              <span className="brand-title">MAK <span>POWER</span></span>
              <span className="brand-tagline">Electronics & Accessories</span>
            </div>
          </Link>

          {/* Search Bar */}
          <form className="header-search-form" onSubmit={handleSearchSubmit} ref={searchRef}>
            <div className="search-input-group">
              <input
                type="text"
                className="search-input"
                placeholder="Search chargers, earbuds, cables, power banks, covers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              />
              {searchTerm && (
                <button
                  type="button"
                  style={{ padding: '0 8px', color: 'var(--text-muted)' }}
                  onClick={() => setSearchTerm('')}
                >
                  <X size={16} />
                </button>
              )}
              <button type="submit" className="search-btn" aria-label="Search">
                <Search size={18} />
              </button>
            </div>

            {/* Live Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="search-suggestions-dropdown">
                {suggestions.map(item => (
                  <div
                    key={item.id}
                    className="search-suggestion-item"
                    onClick={() => {
                      setShowSuggestions(false);
                      setSearchTerm('');
                      navigate(`/product/${item.slug}`);
                    }}
                  >
                    <img src={item.images[0]} alt={item.name} className="suggestion-thumb" />
                    <div className="suggestion-info">
                      <span className="suggestion-name">{item.name}</span>
                      <span className="suggestion-price">₹{item.sellingPrice}</span>
                    </div>
                  </div>
                ))}
                <div
                  style={{ padding: '8px 16px', background: 'var(--surface-alt)', textAlign: 'center', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer' }}
                  onClick={handleSearchSubmit}
                >
                  View all results for "{searchTerm}" →
                </div>
              </div>
            )}
          </form>

          {/* Header Action Buttons */}
          <div className="header-actions">
            
            {/* Wishlist */}
            <Link to="/account?tab=wishlist" className="header-action-btn" title="My Wishlist">
              <Heart size={20} />
              <span style={{ fontSize: '0.88rem' }}>Wishlist</span>
              {wishlistCount > 0 && <span className="action-badge">{wishlistCount}</span>}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="header-action-btn" title="Shopping Cart">
              <ShoppingCart size={20} />
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
                <span style={{ fontSize: '0.88rem' }}>Cart</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 700 }}>
                  ₹{subtotal}
                </span>
              </div>
              {totalItemsCount > 0 && <span className="action-badge">{totalItemsCount}</span>}
            </Link>

            {/* User Account / Login */}
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Link to="/account" className="header-action-btn" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                  <User size={18} />
                  <span>{user.fullName.split(' ')[0]}</span>
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="btn btn-sm btn-dark" title="Store Admin Dashboard">
                    <ShieldCheck size={14} />
                    <span>Admin</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, padding: '4px 8px' }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                <User size={15} />
                <span>Login</span>
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="menu-toggle-btn"
              style={{ display: 'none' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation"
            >
              <Menu size={24} />
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}
