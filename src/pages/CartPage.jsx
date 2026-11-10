import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingCharge,
    discountAmount,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    finalTotal
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponMsg, setCouponMsg] = useState(null);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput.trim());
    setCouponMsg(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: 'var(--text-muted)' }}>
          <ShoppingBag size={38} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '8px' }}>
          Your Shopping Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '24px' }}>
          Looks like you haven't added any electronics or accessories yet.
        </p>
        <Link to="/shop" className="btn btn-primary btn-lg">
          <span>Start Shopping</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      
      {/* Title */}
      <div style={{ margin: '25px 0 15px' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800, color: 'var(--secondary)' }}>
          Shopping Cart ({cartItems.length} items)
        </h1>
      </div>

      <div className="cart-layout">
        
        {/* Cart Items List */}
        <div className="cart-items-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '14px', borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--secondary)' }}>Product Details</span>
            <button
              onClick={clearCart}
              style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}
            >
              Clear Cart
            </button>
          </div>

          <div>
            {cartItems.map(item => (
              <div key={item.id} className="cart-item-row">
                <Link to={`/product/${item.slug}`}>
                  <img src={item.image} alt={item.name} className="cart-item-thumb" />
                </Link>

                <div className="cart-item-details">
                  <Link to={`/product/${item.slug}`} style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--secondary)', display: 'block', marginBottom: '4px' }}>
                    {item.name}
                  </Link>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    {item.categoryName}
                  </span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '8px 0' }}>
                    <span style={{ fontWeight: 800, color: 'var(--secondary)', fontSize: '1.1rem' }}>
                      ₹{item.price}
                    </span>
                    {item.originalPrice > item.price && (
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        ₹{item.originalPrice}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                    <div className="qty-stepper">
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        -
                      </button>
                      <span className="qty-val">{item.quantity}</span>
                      <button
                        className="qty-btn"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600 }}
                    >
                      <Trash2 size={15} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/shop" style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* Order Summary Box */}
        <div>
          
          {/* Coupon Code Section */}
          <div className="order-summary-card" style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Tag size={16} style={{ color: 'var(--primary)' }} />
              <span>Apply Discount Coupon</span>
            </h4>

            {activeCoupon ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#dcfce7', borderRadius: 'var(--radius-sm)', border: '1px solid #86efac' }}>
                <div>
                  <strong style={{ color: '#16a34a', fontSize: '0.9rem' }}>{activeCoupon.code} Applied</strong>
                  <span style={{ display: 'block', fontSize: '0.75rem', color: '#15803d' }}>
                    You saved ₹{discountAmount} on this order!
                  </span>
                </div>
                <button
                  onClick={removeCoupon}
                  style={{ color: '#ef4444', padding: '4px' }}
                  title="Remove coupon"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="e.g. MAK10 or FIRSTPOWER"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', textTransform: 'uppercase' }}
                />
                <button type="submit" className="btn btn-dark btn-sm">
                  Apply
                </button>
              </form>
            )}

            {couponMsg && !activeCoupon && (
              <div style={{ marginTop: '8px', fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>
                {couponMsg.message}
              </div>
            )}

            <div style={{ marginTop: '10px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Use coupon <strong>MAK10</strong> for 10% off (orders above ₹499)
            </div>
          </div>

          {/* Price Details */}
          <div className="order-summary-card">
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--secondary)', paddingBottom: '12px', borderBottom: '1px solid var(--border)', marginBottom: '16px' }}>
              Price Breakdown
            </h3>

            <div className="summary-row">
              <span style={{ color: 'var(--text-muted)' }}>Price ({cartItems.length} items)</span>
              <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="summary-row" style={{ color: 'var(--success)' }}>
                <span>Coupon Discount</span>
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

            {subtotal < 499 && (
              <div style={{ fontSize: '0.78rem', color: '#b45309', background: '#fef3c7', padding: '6px 10px', borderRadius: '4px', margin: '8px 0 14px' }}>
                ⚡ Add ₹{499 - subtotal} more to get <strong>FREE Delivery</strong>!
              </div>
            )}

            <div className="summary-row total-row">
              <span>Total Payable</span>
              <span style={{ color: 'var(--primary)' }}>₹{finalTotal}</span>
            </div>

            <button
              className="btn btn-primary btn-block btn-lg"
              onClick={() => navigate('/checkout')}
              style={{ marginTop: '20px' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '14px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
              <span>Safe and Secure Payments • 100% Authentic Products</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
