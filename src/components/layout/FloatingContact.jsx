import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { STORE_INFO } from '../../services/mockData';

export default function FloatingContact() {
  return (
    <div className="floating-contact-group">
      <a
        href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20MAK%20POWER!%20I%20have%20an%20enquiry%20regarding%20products.`}
        target="_blank"
        rel="noreferrer"
        className="floating-action-circle whatsapp"
        title="Chat on WhatsApp"
      >
        <MessageCircle size={26} />
      </a>
      <a
        href={`tel:${STORE_INFO.phone}`}
        className="floating-action-circle call"
        title="Call MAK POWER"
      >
        <Phone size={22} />
      </a>
    </div>
  );
}
