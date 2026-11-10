import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, ShieldCheck, Sparkles } from 'lucide-react';

const SLIDES = [
  {
    badge: "Official MAK POWER Release",
    title: "65W GaN Super Fast Charger",
    subtitle: "Charge your smartphone from 0 to 70% in just 25 minutes. Dual-port QC & PD with braided Type-C cable.",
    ctaLink: "/product/mak-power-65w-gan-super-fast-charger",
    image: "/image/mobile-chargers.jpg",
    price: "₹699",
    mrp: "₹1,499"
  },
  {
    badge: "Bestselling Audio",
    title: "True Wireless Earbuds TWS-100",
    subtitle: "35 Hours battery playback, environmental noise isolation, and extra deep bass tuned for Indian music.",
    ctaLink: "/product/mak-power-true-wireless-earbuds-tws-100",
    image: "/image/bluetooth-earbuds.jpg",
    price: "₹899",
    mrp: "₹1,999"
  },
  {
    badge: "Travel Heavy Duty",
    title: "20,000mAh Compact Power Bank",
    subtitle: "Dual USB + Type-C 22.5W two-way fast charge. Digital LED battery indicator & flight safe certified.",
    ctaLink: "/product/mak-power-20000mah-ultra-compact-power-bank",
    image: "/image/power-banks.jpg",
    price: "₹1,299",
    mrp: "₹2,499"
  }
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="hero-slider-container">
      <div className="hero-slide">
        
        <div className="slide-content">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(215, 25, 32, 0.25)', color: '#ff6b6b', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px', border: '1px solid rgba(215, 25, 32, 0.4)' }}>
            <Sparkles size={14} />
            <span>{slide.badge}</span>
          </div>

          <h2>{slide.title}</h2>
          <p>{slide.subtitle}</p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '24px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>
              {slide.price}
            </span>
            <span style={{ fontSize: '1.1rem', color: '#94a3b8', textDecoration: 'line-through' }}>
              {slide.mrp}
            </span>
            <span style={{ background: '#16a34a', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
              Special Deal
            </span>
          </div>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <Link to={slide.ctaLink} className="btn btn-primary btn-lg">
              <span>Buy Now</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/shop" className="btn btn-secondary btn-lg" style={{ color: '#fff', background: 'rgba(255, 255, 255, 0.1)', borderColor: 'rgba(255, 255, 255, 0.2)' }}>
              <span>View All Products</span>
            </Link>
          </div>
        </div>

        <div className="slide-image-box">
          <img src={slide.image} alt={slide.title} />
        </div>

      </div>

      {/* Slider Controls */}
      <div className="slider-controls">
        {SLIDES.map((_, idx) => (
          <div
            key={idx}
            className={`slider-dot ${idx === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(idx)}
          />
        ))}
      </div>
    </div>
  );
}
