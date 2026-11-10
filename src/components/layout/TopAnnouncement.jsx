import React from 'react';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react';
import { STORE_INFO } from '../../services/mockData';

export default function TopAnnouncement() {
  return (
    <div className="top-bar">
      <div className="container top-bar-inner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={13} style={{ color: 'var(--primary)' }} />
            <span>{STORE_INFO.address}</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Clock size={13} style={{ color: 'var(--primary)' }} />
            <span>Open: 9:00 AM – 9:00 PM</span>
          </span>
        </div>

        <div className="top-bar-links">
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>
            ⚡ FREE Delivery on orders above ₹499 | Cash on Delivery Available
          </span>
          <a href={`tel:${STORE_INFO.phone}`} className="top-bar-link">
            <Phone size={13} />
            <span>+91 {STORE_INFO.phone}</span>
          </a>
          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20MAK%20POWER!`}
            target="_blank"
            rel="noreferrer"
            className="top-bar-link"
          >
            <MessageCircle size={13} style={{ color: '#25d366' }} />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
