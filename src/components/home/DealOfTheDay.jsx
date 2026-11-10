import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Clock, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { INITIAL_PRODUCTS } from '../../services/mockData';

export default function DealOfTheDay() {
  const { addToCart } = useCart();
  const dealProduct = INITIAL_PRODUCTS[1]; // 65W GaN Charger

  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 42, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay - now;

      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="deal-of-the-day-card">
      <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <img
          src="/image/featured-electronics.jpg"
          alt="MAK POWER Featured Deal"
          style={{ width: '100%', height: '320px', objectFit: 'cover', borderRadius: 'var(--radius-md)' }}
        />
        <div style={{ position: 'absolute', top: '14px', left: '14px', background: 'var(--primary)', color: '#fff', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 800 }}>
          ⚡ DEAL OF THE DAY
        </div>
      </div>

      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase' }}>
          <Zap size={16} />
          <span>Special Offer Ends Midnight</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', margin: '8px 0 12px', lineHeight: 1.2 }}>
          MAK POWER Complete Fast Charging & Audio Kit
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
          Get genuine fast chargers, long-lasting braided data cables, and Bluetooth sound equipment at special promotional prices. Limited stocks available daily!
        </p>

        {/* Live Urgency Timer */}
        <div className="deal-timer-strip">
          <div className="deal-timer-item">
            <span className="deal-timer-val">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="deal-timer-label">Hours</span>
          </div>
          <div className="deal-timer-item">
            <span className="deal-timer-val">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="deal-timer-label">Mins</span>
          </div>
          <div className="deal-timer-item">
            <span className="deal-timer-val">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="deal-timer-label">Secs</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => dealProduct && addToCart(dealProduct, 1)}
          >
            <ShoppingBag size={18} />
            <span>Add Deal to Cart</span>
          </button>
          
          <Link to="/shop" className="btn btn-secondary">
            <span>Explore All Offers</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
