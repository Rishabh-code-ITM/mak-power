import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { CheckCircle2, Truck, MessageCircle, ArrowRight, Printer, MapPin, Calendar } from 'lucide-react';
import { ordersService } from '../services/ordersService';
import { STORE_INFO } from '../services/mockData';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Trigger celebratory confetti
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });

    if (orderId) {
      ordersService.getOrderByNumber(orderId).then(res => {
        setOrder(res);
        setLoading(false);
      });
    }
  }, [orderId]);

  if (loading) {
    return <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>Loading your order confirmation...</div>;
  }

  const handleWhatsAppShare = () => {
    if (!order) return;
    const msg = encodeURIComponent(
      `Hello MAK POWER! I have placed Order #${order.orderNumber} for ₹${order.totalAmount} on Cash on Delivery. Please confirm my dispatch.`
    );
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${msg}`, '_blank');
  };

  const estimatedDate = new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="container" style={{ padding: '40px 0 80px', maxWidth: '780px' }}>
      
      {/* Success Card */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px 30px',
        textAlign: 'center',
        boxShadow: 'var(--shadow-md)',
        marginBottom: '30px'
      }}>
        <div style={{ width: '70px', height: '70px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <CheckCircle2 size={40} />
        </div>

        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 900, color: 'var(--secondary)', marginBottom: '8px' }}>
          Thank You! Your Order is Confirmed
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '540px', margin: '0 auto 20px' }}>
          We have received your order. Our team in Garkha is preparing your package for fast dispatch.
        </p>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'var(--surface-alt)', border: '1px solid var(--border)', padding: '10px 20px', borderRadius: 'var(--radius-full)', margin: '0 auto 24px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Order ID:</span>
          <strong style={{ fontSize: '1.1rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
            {orderId}
          </strong>
        </div>

        {/* Expected Delivery Banner */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius-md)', padding: '14px 20px', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#1e40af', fontSize: '0.92rem', fontWeight: 600 }}>
          <Calendar size={18} />
          <span>Estimated Delivery by: <strong>{estimatedDate}</strong></span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <Link to={`/track-order?id=${orderId}`} className="btn btn-primary">
            <Truck size={18} />
            <span>Track Order Status</span>
          </Link>
          <button onClick={handleWhatsAppShare} className="btn btn-whatsapp">
            <MessageCircle size={18} />
            <span>Confirm on WhatsApp</span>
          </button>
          <button onClick={() => window.print()} className="btn btn-secondary">
            <Printer size={16} />
            <span>Print Receipt</span>
          </button>
        </div>
      </div>

      {/* Order Details Breakdown Card */}
      {order && (
        <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '16px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
            Order Summary
          </h3>

          {/* Delivery Address */}
          <div style={{ marginBottom: '20px', padding: '14px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '6px' }}>
              <MapPin size={16} style={{ color: 'var(--primary)' }} />
              <span>Delivery Address</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
              <strong>{order.customerName}</strong> ({order.customerPhone})<br />
              {order.shippingAddress.addressLine1}, {order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
            </p>
          </div>

          {/* Items */}
          <div style={{ marginBottom: '20px' }}>
            {order.items.map((it, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img src={it.image} alt={it.name} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <h5 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--secondary)' }}>{it.name}</h5>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Qty: {it.quantity} × ₹{it.price}</span>
                  </div>
                </div>
                <strong style={{ color: 'var(--secondary)', fontSize: '0.95rem' }}>₹{it.subtotal}</strong>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                <span>Discount ({order.couponCode})</span>
                <span>- ₹{order.discount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Delivery Charge</span>
              <span>{order.shippingCharge === 0 ? 'FREE' : `₹${order.shippingCharge}`}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)', borderTop: '1px solid var(--border)', paddingTop: '10px', marginTop: '6px' }}>
              <span>Total Amount ({order.paymentMethod.toUpperCase()})</span>
              <span>₹{order.totalAmount}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.95rem' }}>
          ← Continue Browsing More Products
        </Link>
      </div>

    </div>
  );
}
