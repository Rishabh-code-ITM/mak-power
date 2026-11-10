import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, ShieldCheck, CheckCircle } from 'lucide-react';
import HeroSlider from '../components/home/HeroSlider';
import CategoriesStrip from '../components/home/CategoriesStrip';
import DealOfTheDay from '../components/home/DealOfTheDay';
import StoreVisitBanner from '../components/home/StoreVisitBanner';
import ProductCard from '../components/common/ProductCard';
import { productsService } from '../services/productsService';

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsService.getProducts().then(res => {
      setProducts(res);
      setLoading(false);
    });
  }, []);

  const trendingProducts = products.filter(p => p.isTrending || p.isBestseller).slice(0, 4);
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      
      {/* Hero Banner Slider */}
      <HeroSlider />

      {/* Categories Horizontal Strip */}
      <CategoriesStrip />

      {/* Trending & Bestsellers Section */}
      <section style={{ margin: '40px 0' }}>
        <div className="section-heading-row">
          <div className="section-title-wrap">
            <h2>Trending & Bestsellers 🔥</h2>
            <p>Most popular electronics and accessories chosen by customers</p>
          </div>
          <Link to="/shop?sort=bestseller" className="view-all-link">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading products...</div>
        ) : (
          <div className="products-grid">
            {trendingProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Deal of the Day Box */}
      <DealOfTheDay />

      {/* Featured Electronics Showcase */}
      <section style={{ margin: '40px 0' }}>
        <div className="section-heading-row">
          <div className="section-title-wrap">
            <h2>Featured Electronics & Chargers ⚡</h2>
            <p>High performance mobile chargers, heavy duty power banks & audio</p>
          </div>
          <Link to="/shop" className="view-all-link">
            <span>View All</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading products...</div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Physical Store Visit Banner */}
      <StoreVisitBanner />

      {/* Customer Testimonials / Reviews */}
      <section style={{ margin: '40px 0' }}>
        <div className="section-heading-row">
          <div className="section-title-wrap">
            <h2>Customer Reviews & Feedback 💬</h2>
            <p>What our verified local shoppers in Saran and Bihar say about us</p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', marginBottom: '8px' }}>
              {'★'.repeat(5)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.5 }}>
              "Bought the 65W GaN charger for my OnePlus phone. Super fast charging speed and doesn't heat up at all. Best store in Garkha!"
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--secondary)' }}>Amit Kumar</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Garkha, Bihar</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✓ Verified Buyer</span>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', marginBottom: '8px' }}>
              {'★'.repeat(5)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.5 }}>
              "The TWS-100 earbuds have incredible bass and clear call quality. Battery easily lasts 4 days on normal commute. Cash on delivery was seamless."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--secondary)' }}>Vikash Singh</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Chhapra, Bihar</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✓ Verified Buyer</span>
            </div>
          </div>

          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px', boxShadow: 'var(--shadow-xs)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', marginBottom: '8px' }}>
              {'★'.repeat(5)}
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontStyle: 'italic', marginBottom: '14px', lineHeight: 1.5 }}>
              "Ordered power bank and phone covers. Genuine product delivered in 2 days. The owner is very polite and gave instant warranty testing."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border)', paddingTop: '10px' }}>
              <div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--secondary)' }}>Pooja Kumari</strong>
                <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>Garkha</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✓ Verified Buyer</span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
