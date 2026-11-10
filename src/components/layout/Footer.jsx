import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RefreshCw, CreditCard } from 'lucide-react';
import { STORE_INFO, INITIAL_CATEGORIES } from '../../services/mockData';

export default function Footer() {
  return (
    <footer className="ecommerce-footer" id="contact">
      <div className="container">
        
        {/* Trust Badges Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          paddingBottom: '40px',
          marginBottom: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(215, 25, 32, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>100% Genuine Products</h5>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Tested for quality & durability</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(215, 25, 32, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Cash on Delivery</h5>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Pay at your doorstep across India</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(215, 25, 32, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Easy Replacement</h5>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>7-day hassle-free replacement</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'rgba(215, 25, 32, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={22} />
            </div>
            <div>
              <h5 style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Best Wholesale Rates</h5>
              <p style={{ fontSize: '0.8rem', color: '#9ca3af' }}>Direct factory prices in Garkha</p>
            </div>
          </div>
        </div>

        {/* Footer Grid */}
        <div className="footer-grid">
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <img src={STORE_INFO.logoImage} alt="MAK POWER" style={{ width: '42px', height: '42px', borderRadius: '6px', background: '#fff', padding: '3px' }} />
              <div>
                <h3 style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900 }}>
                  MAK <span style={{ color: 'var(--primary)' }}>POWER</span>
                </h3>
                <p style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Electronics & Mobile Accessories
                </p>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Your trusted electronics store in Garkha, Bihar. We supply high-speed chargers, TWS earbuds, heavy-duty power banks, and smartphone accessories at honest prices.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <a href={`https://wa.me/${STORE_INFO.whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-whatsapp btn-sm">
                WhatsApp Us
              </a>
              <a href={`tel:${STORE_INFO.phone}`} className="btn btn-secondary btn-sm" style={{ color: '#fff', background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
                Call: {STORE_INFO.phone}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links-list">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/cart">Shopping Cart</Link></li>
              <li><Link to="/track-order">Track Your Order</Link></li>
              <li><Link to="/account">My Account</Link></li>
              <li><Link to="/admin">Admin Dashboard</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <ul className="footer-links-list">
              {INITIAL_CATEGORIES.slice(0, 6).map(c => (
                <li key={c.id}>
                  <Link to={`/shop?category=${c.slug}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info */}
          <div className="footer-col">
            <h4>Store Location</h4>
            <ul className="footer-links-list">
              <li style={{ display: 'flex', gap: '8px' }}>
                <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>{STORE_INFO.address}</span>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <Phone size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <a href={`tel:${STORE_INFO.phone}`}>+91 {STORE_INFO.phone}</a>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <Mail size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <a href={`mailto:${STORE_INFO.email}`}>{STORE_INFO.email}</a>
              </li>
              <li style={{ display: 'flex', gap: '8px' }}>
                <Clock size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                <span>{STORE_INFO.workingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom-row">
          <p>© {new Date().getFullYear()} MAK POWER. All Rights Reserved. Garkha, Bihar.</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <span>Verified Indian Brand</span>
            <span>•</span>
            <span>Cash on Delivery</span>
            <span>•</span>
            <span>Express Dispatch</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
