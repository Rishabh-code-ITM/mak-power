import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, RotateCcw, X } from 'lucide-react';
import ProductCard from '../components/common/ProductCard';
import { productsService } from '../services/productsService';
import { INITIAL_CATEGORIES } from '../services/mockData';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'featured';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [sortBy, setSortBy] = useState(sortParam);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(2500);

  // Sync URL params to state
  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Load products based on filters
  useEffect(() => {
    setLoading(true);
    productsService.getProducts({
      category: selectedCategory,
      search: searchQuery,
      sortBy,
      inStockOnly,
      maxPrice
    }).then(res => {
      setProducts(res);
      setLoading(false);
    });
  }, [selectedCategory, searchQuery, sortBy, inStockOnly, maxPrice]);

  const handleCategoryChange = (slug) => {
    setSelectedCategory(slug);
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setMaxPrice(2500);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Breadcrumb & Title */}
      <div style={{ margin: '20px 0 10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
        <span>Home</span> / <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>All Products</span>
        {searchQuery && <span> / Search results for: <strong>"{searchQuery}"</strong></span>}
      </div>

      <div className="shop-layout">
        
        {/* Filters Sidebar */}
        <aside className="filters-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, fontSize: '1rem', color: 'var(--secondary)' }}>
              <Filter size={18} />
              <span>Filters</span>
            </div>
            <button
              onClick={handleResetFilters}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              <RotateCcw size={12} />
              <span>Reset</span>
            </button>
          </div>

          {/* Category Filter */}
          <div className="filter-group">
            <h4 className="filter-group-title">Category</h4>
            <label className="filter-option-label">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === 'all'}
                onChange={() => handleCategoryChange('all')}
              />
              <span>All Categories</span>
            </label>
            {INITIAL_CATEGORIES.map(cat => (
              <label key={cat.id} className="filter-option-label">
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === cat.slug}
                  onChange={() => handleCategoryChange(cat.slug)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
          </div>

          {/* Price Range Slider */}
          <div className="filter-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h4 className="filter-group-title" style={{ margin: 0 }}>Max Price</h4>
              <span style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '0.9rem' }}>₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="200"
              max="2500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
              <span>₹200</span>
              <span>₹2,500</span>
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="filter-group" style={{ border: 'none', padding: 0 }}>
            <h4 className="filter-group-title">Availability</h4>
            <label className="filter-option-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              <span>In Stock Only</span>
            </label>
          </div>

        </aside>

        {/* Product Grid Area */}
        <main>
          
          {/* Shop Top Control Bar */}
          <div className="shop-top-bar">
            <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
              Showing <strong>{products.length}</strong> products
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--secondary)' }}>Sort By:</span>
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured / Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
                <option value="newest">New Arrivals</option>
              </select>
            </div>
          </div>

          {/* Active Filter Tags */}
          {(selectedCategory !== 'all' || searchQuery) && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {selectedCategory !== 'all' && (
                <span className="badge badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                  <span>Category: {selectedCategory}</span>
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => handleCategoryChange('all')} />
                </span>
              )}
              {searchQuery && (
                <span className="badge badge-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px' }}>
                  <span>Search: "{searchQuery}"</span>
                  <X size={13} style={{ cursor: 'pointer' }} onClick={() => setSearchQuery('')} />
                </span>
              )}
            </div>
          )}

          {/* Product Cards */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
              Loading products catalog...
            </div>
          ) : products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No products found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
                Try adjusting your filters, price range, or search terms.
              </p>
              <button className="btn btn-primary btn-sm" onClick={handleResetFilters}>
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
