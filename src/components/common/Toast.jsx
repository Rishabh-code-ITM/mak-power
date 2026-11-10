import React from 'react';
import { useCart } from '../../context/CartContext';
import { CheckCircle2 } from 'lucide-react';

export default function Toast() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '30px',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--secondary)',
      color: '#fff',
      padding: '12px 24px',
      borderRadius: 'var(--radius-full)',
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: 2000,
      fontSize: '0.92rem',
      fontWeight: 600,
      border: '1px solid rgba(255, 255, 255, 0.15)',
      animation: 'toastIn 0.3s ease'
    }}>
      <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
      <span>{toastMessage}</span>
    </div>
  );
}
