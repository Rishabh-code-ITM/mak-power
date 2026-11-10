import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Truck, CheckCircle2, Clock, Package, MapPin, Phone, MessageCircle } from 'lucide-react';
import { ordersService } from '../services/ordersService';
import { STORE_INFO } from '../services/mockData';

const ORDER_STEPS = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'packed', label: 'Packed' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'delivered', label: 'Delivered' }
];

export default function OrderTrackingPage() {
  const [searchParams] = useSearchParams();
  const initialId = searchParams.get('id') || '';

  const [orderQuery, setOrderQuery] = useState(initialId);
  const [order, setOrder] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialId) {
      searchOrder(initialId);
    }
  }, [initialId]);

  const searchOrder = async (query) => {
    if (!query.trim()) return;
    setLoading(true);
    setErrorMsg('');
    try {
      const found = await ordersService.getOrderByNumber(query.trim());
      setOrder(found);
      setSearched(true);
      if (!found) {
        setErrorMsg(`No order found matching "${query}". Please verify your Order Number (e.g. MAK-ORD-2026-XXXX).`);
      }
    } catch {
      setErrorMsg('Error checking order status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchOrder(orderQuery);
  };

  const getStepIndex = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'delivered') return 4;
    if (s === 'out_for_delivery' || s === 'shipped') return 3;
    if (s === 'packed' || s === 'processing') return 2;
    if (s === 'confirmed') return 1;
    return 0;
  };

  const currentStep = order ? getStepIndex(order.orderStatus) : 0;

  return (
    <div className="container" style={{ padding: '30px 0 80px', maxWidth: '840px' }}>
      
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)' }}>
          Track Your MAK POWER Order
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Enter your unique Order Number to check live courier & dispatch status.
        </p>
      </div>

      {/* Search Input Box */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', boxShadow: 'var(--shadow-sm)', marginBottom: '30px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="Enter Order ID (e.g. MAK-ORD-2026-8921)"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value.toUpperCase())}
              style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.95rem', textTransform: 'uppercase' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={18} />
            <span>{loading ? 'Searching...' : 'Track Order'}</span>
          </button>
        </form>

        <div style={{ marginTop: '12px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          💡 Try sample order: <button onClick={() => { setOrderQuery('MAK-ORD-2026-8921'); searchOrder('MAK-ORD-2026-8921'); }} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'underline' }}>MAK-ORD-2026-8921</button>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: '16px', background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', borderRadius: 'var(--radius-sm)', marginBottom: '30px', textAlign: 'center' }}>
          {errorMsg}
        </div>
      )}

      {/* Order Tracking Result Card */}
      {order && (
        <div className="order-tracking-card">
          
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', paddingBottom: '16px', borderBottom: '1px solid var(--border)' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Order ID</span>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--secondary)', fontWeight: 800 }}>
                {order.orderNumber}
              </h3>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Placed On</span>
              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>

          {/* Stepper Progression */}
          <div className="timeline-stepper">
            {ORDER_STEPS.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isActive = idx === currentStep;
              return (
                <div
                  key={step.key}
                  className={`timeline-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                >
                  <div className="timeline-circle">
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <span className="timeline-label">{step.label}</span>
                </div>
              );
            })}
          </div>

          {/* Current Status Box */}
          <div style={{ background: 'var(--surface-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '16px 20px', margin: '24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight: 800, fontSize: '1rem', textTransform: 'uppercase' }}>
              <Truck size={20} />
              <span>Current Status: {order.orderStatus.replace(/_/g, ' ')}</span>
            </div>
            {order.trackingNumber && (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Courier Tracking AWB: <strong>{order.trackingNumber}</strong>
              </p>
            )}
          </div>

          {/* Status Timeline History */}
          <div style={{ margin: '24px 0' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '14px' }}>
              Activity History
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {(order.statusHistory || []).map((h, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', fontSize: '0.88rem' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', marginTop: '6px' }} />
                  <div>
                    <strong style={{ textTransform: 'capitalize', color: 'var(--secondary)' }}>{h.status.replace(/_/g, ' ')}: </strong>
                    <span>{h.note}</span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {new Date(h.timestamp).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items In This Order */}
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '14px' }}>
              Ordered Items
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {order.items.map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={it.image} alt={it.name} style={{ width: '42px', height: '42px', borderRadius: '4px', objectFit: 'cover' }} />
                    <div>
                      <span style={{ fontWeight: 600 }}>{it.name}</span>
                      <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>Qty: {it.quantity}</span>
                    </div>
                  </div>
                  <strong>₹{it.subtotal}</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help? */}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '24px', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Need assistance with your delivery?</span>
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Hello%20MAK%20POWER!%20Need%20update%20on%20my%20Order%20${order.orderNumber}.`}
              target="_blank"
              rel="noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <MessageCircle size={15} />
              <span>Ask on WhatsApp</span>
            </a>
          </div>

        </div>
      )}

    </div>
  );
}
