import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, ShieldCheck } from 'lucide-react';
import { STORE_INFO } from '../../services/mockData';

export default function StoreVisitBanner() {
  return (
    <div style={{
      background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
      borderRadius: 'var(--radius-lg)',
      padding: '35px',
      color: '#fff',
      margin: '40px 0 60px',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      alignItems: 'center',
      boxShadow: 'var(--shadow-lg)'
    }}>
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(215, 25, 32, 0.25)', color: '#ff6b6b', padding: '4px 12px', borderRadius: 'var(--radius-full)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '14px' }}>
          <MapPin size={14} />
          <span>Physical Store in Garkha, Bihar</span>
        </div>

        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, marginBottom: '12px', lineHeight: 1.2 }}>
          Visit the MAK POWER Official Retail Store
        </h3>

        <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>
          Experience and test all our products in person! Located conveniently on Chhapra–Road, Garkha. Get live demo testing on fast chargers, earphones, and mobile accessories.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px', fontSize: '0.92rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={16} style={{ color: 'var(--primary)' }} />
            <span>{STORE_INFO.address}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Clock size={16} style={{ color: 'var(--primary)' }} />
            <span>Open Every Day: 9:00 AM – 9:00 PM</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Phone size={16} style={{ color: 'var(--primary)' }} />
            <span>Direct Call: +91 {STORE_INFO.phone}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <a href={`tel:${STORE_INFO.phone}`} className="btn btn-primary">
            <Phone size={16} />
            <span>Call Store Now</span>
          </a>
          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20MAK%20POWER!%20Where%20is%20your%20store%20located%20in%20Garkha?`}
            target="_blank"
            rel="noreferrer"
            className="btn btn-whatsapp"
          >
            <MessageCircle size={16} />
            <span>Get Directions on WhatsApp</span>
          </a>
        </div>
      </div>

      <div style={{ position: 'relative', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '3px solid rgba(255, 255, 255, 0.1)', boxShadow: 'var(--shadow-md)' }}>
        <img
          src={STORE_INFO.shopImage}
          alt="MAK POWER Store in Garkha"
          style={{ width: '100%', maxHeight: '360px', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', fontWeight: 700, color: '#fff' }}>
          📍 Actual Store Exterior • Garkha
        </div>
      </div>
    </div>
  );
}
