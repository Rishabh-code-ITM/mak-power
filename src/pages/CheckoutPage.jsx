import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, CreditCard, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersService } from '../services/ordersService';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, shippingCharge, discountAmount, activeCoupon, finalTotal, clearCart } = useCart();
  const { user, savedAddresses } = useAuth();

  const defaultAddress = savedAddresses?.[0] || {};

  const [formData, setFormData] = useState({
    fullName: user?.fullName || defaultAddress.fullName || '',
    phone: user?.phone || defaultAddress.phone || '',
    email: user?.email || '',
    addressLine1: defaultAddress.addressLine1 || '',
    addressLine2: defaultAddress.addressLine2 || '',
    landmark: defaultAddress.landmark || '',
    city: defaultAddress.city || 'Garkha',
    state: defaultAddress.state || 'Bihar',
    pincode: defaultAddress.pincode || '841311',
    deliveryInstructions: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <p style={{ color: 'var(--text-muted)', margin: '10px 0 20px' }}>Please add products to your cart before proceeding to checkout.</p>
        <Link to="/shop" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations
    if (!formData.fullName.trim()) return setErrorMsg('Please enter your full name.');
    if (!formData.phone.trim() || formData.phone.length < 10) return setErrorMsg('Please enter a valid 10-digit mobile number.');
    if (!formData.addressLine1.trim()) return setErrorMsg('Please enter your street address / house number.');
    if (!formData.pincode.trim() || formData.pincode.length !== 6) return setErrorMsg('Please enter a valid 6-digit PIN code.');

    setSubmitting(true);

    try {
      const order = await ordersService.createOrder({
        customer: formData,
        items: cartItems,
        discount: discountAmount,
        couponCode: activeCoupon?.code || null,
        paymentMethod
      });

      clearCart();
      navigate(`/order-success/${order.orderNumber}`);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please check item stock.');
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '70px' }}>
      
      {/* Title */}
      <div style={{ margin: '25px 0 20px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>
          Secure Checkout
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Complete your delivery details to place your order with MAK POWER.
        </p>
      </div>

      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#fee2e2', border: '1px solid #f87171', color: '#b91c1c', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem' }}>
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="checkout-layout">
        
        {/* Left Column: Delivery Address & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Step 1: Customer Contact & Delivery Address */}
          <div className="checkout-form-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
              <span>Delivery Address Details</span>
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Mobile Number (for delivery SMS & Call) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Email Address (Optional)
              </label>
              <input
                type="email"
                name="email"
                placeholder="For order receipt & invoice"
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                House No., Building, Street / Mohalla *
              </label>
              <input
                type="text"
                name="addressLine1"
                required
                placeholder="e.g. Near High School, Ward No 4"
                value={formData.addressLine1}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  Landmark (Optional)
                </label>
                <input
                  type="text"
                  name="landmark"
                  placeholder="e.g. Opposite SBI Bank"
                  value={formData.landmark}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  PIN Code *
                </label>
                <input
                  type="text"
                  name="pincode"
                  required
                  maxLength={6}
                  placeholder="e.g. 841311"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  City / Town *
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>
                Delivery Instructions (Optional)
              </label>
              <textarea
                name="deliveryInstructions"
                rows={2}
                placeholder="e.g. Please deliver after 2 PM or call before arrival"
                value={formData.deliveryInstructions}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
              />
            </div>
          </div>

          {/* Step 2: Payment Method */}
          <div className="checkout-form-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
              <span>Select Payment Method</span>
            </h3>

            {/* Cash on Delivery (Default) */}
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              border: `2px solid ${paymentMethod === 'cod' ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              background: paymentMethod === 'cod' ? 'var(--primary-light)' : '#fff',
              cursor: 'pointer',
              marginBottom: '14px'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
                style={{ marginTop: '3px', accentColor: 'var(--primary)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--secondary)' }}>Cash on Delivery (COD)</strong>
                  <span className="badge badge-success">Recommended</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Pay in cash or UPI QR code to the delivery agent when your package arrives at your door.
                </p>
              </div>
            </label>

            {/* Online Payment (Razorpay Ready) */}
            <label style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px',
              padding: '16px',
              border: `2px solid ${paymentMethod === 'razorpay' ? 'var(--primary)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-md)',
              background: paymentMethod === 'razorpay' ? 'var(--primary-light)' : '#fff',
              cursor: 'pointer'
            }}>
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')}
                style={{ marginTop: '3px', accentColor: 'var(--primary)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ fontSize: '1rem', color: 'var(--secondary)' }}>Online Payment (UPI, Debit/Credit Card, NetBanking)</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Secure payment gateway integration. (Pay via Google Pay, PhonePe, Paytm, or Cards).
                </p>
              </div>
            </label>
          </div>

        </div>

        {/* Right Column: Order Summary & Place Order */}
        <div>
          <div className="order-summary-card" style={{ position: 'sticky', top: '90px' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', paddingBottom: '12px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
              Order Review ({cartItems.length} items)
            </h3>

            {/* Items mini list */}
            <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cartItems.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '70%' }}>
                    <img src={item.image} alt={item.name} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.name} (x{item.quantity})
                    </span>
                  </div>
                  <strong style={{ color: 'var(--secondary)' }}>₹{item.price * item.quantity}</strong>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Items Subtotal</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row" style={{ color: 'var(--success)' }}>
                <span>Coupon Discount ({activeCoupon?.code})</span>
                <span style={{ fontWeight: 700 }}>- ₹{discountAmount}</span>
              </div>
            )}

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Delivery Charges</span>
              <span>
                {shippingCharge === 0 ? (
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>FREE</span>
                ) : (
                  <span>₹{shippingCharge}</span>
                )}
              </span>
            </div>

            <div className="summary-row total-row">
              <span>Final Total</span>
              <span style={{ color: 'var(--primary)' }}>₹{finalTotal}</span>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block btn-lg"
              disabled={submitting}
              style={{ marginTop: '20px' }}
            >
              {submitting ? 'Placing Order...' : `Confirm & Place Order (₹${finalTotal})`}
            </button>

            <div style={{ marginTop: '16px', padding: '12px', background: 'var(--surface-alt)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--secondary)', fontWeight: 700, marginBottom: '4px' }}>
                <Lock size={14} style={{ color: 'var(--primary)' }} />
                <span>100% Genuine MAK POWER Guarantee</span>
              </div>
              Orders are dispatched quickly from our Garkha store. You will receive an SMS and WhatsApp confirmation with tracking details.
            </div>

          </div>
        </div>

      </form>

    </div>
  );
}
