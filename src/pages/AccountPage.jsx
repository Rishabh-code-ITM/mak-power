import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, Trash2, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ordersService } from '../services/ordersService';

export default function AccountPage() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'orders';

  const { user, logout, savedAddresses, removeAddress } = useAuth();
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    ordersService.getAllOrders().then(res => setOrders(res));
  }, []);

  if (!user) {
    return (
      <div className="container" style={{ padding: '80px 20px', maxWidth: '480px', textAlign: 'center' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
          <User size={32} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, marginBottom: '8px' }}>
          Login to Your Account
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
          Please sign in to view your orders, saved addresses, and wishlist.
        </p>
        <Link to="/login" className="btn btn-primary btn-block btn-lg">
          Login / Register
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '30px 0 80px' }}>
      
      {/* User Header */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            {user.fullName.charAt(0)}
          </div>
          <div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)' }}>
              {user.fullName}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {user.email || user.phone} • {user.role === 'admin' ? 'Store Administrator' : 'Valued Customer'}
            </p>
          </div>
        </div>

        <button onClick={logout} className="btn btn-secondary btn-sm" style={{ color: '#ef4444' }}>
          <LogOut size={15} />
          <span>Logout</span>
        </button>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '24px' }}>
        
        {/* Navigation Tabs */}
        <aside style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '12px', height: 'fit-content' }}>
          <button
            onClick={() => setActiveTab('orders')}
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            <Package size={18} />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`admin-nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            <Heart size={18} />
            <span>Wishlist ({wishlistItems.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`admin-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            <MapPin size={18} />
            <span>Saved Addresses ({savedAddresses.length})</span>
          </button>
        </aside>

        {/* Content Pane */}
        <main style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '24px' }}>
          
          {/* My Orders */}
          {activeTab === 'orders' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                Order History
              </h3>

              {orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  You haven't placed any orders yet.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {orders.map(ord => (
                    <div key={ord.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                        <div>
                          <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '1.05rem' }}>
                            {ord.orderNumber}
                          </strong>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span className="badge badge-success" style={{ textTransform: 'capitalize' }}>
                            {ord.orderStatus.replace(/_/g, ' ')}
                          </span>
                          <strong style={{ fontSize: '1.1rem', color: 'var(--secondary)' }}>₹{ord.totalAmount}</strong>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        {ord.items.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.88rem' }}>
                            <img src={it.image} alt={it.name} style={{ width: '36px', height: '36px', borderRadius: '4px', objectFit: 'cover' }} />
                            <span>{it.name} <strong>(x{it.quantity})</strong></span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <Link to={`/track-order?id=${ord.orderNumber}`} className="btn btn-primary btn-sm">
                          Track Order
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Wishlist */}
          {activeTab === 'wishlist' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                My Wishlist ({wishlistItems.length})
              </h3>

              {wishlistItems.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
                  Your wishlist is empty. Explore products to save your favorites!
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {wishlistItems.map(item => (
                    <div key={item.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px', display: 'flex', flexDirection: 'column' }}>
                      <img src={item.image} alt={item.name} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {item.name}
                      </h5>
                      <span style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
                        ₹{item.sellingPrice}
                      </span>
                      <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                        <button
                          className="btn btn-primary btn-sm"
                          style={{ flex: 1 }}
                          onClick={() => addToCart(item, 1)}
                        >
                          Move to Cart
                        </button>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          style={{ color: '#ef4444', padding: '4px 8px' }}
                          title="Remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Saved Addresses */}
          {activeTab === 'addresses' && (
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800, color: 'var(--secondary)', marginBottom: '18px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                Saved Addresses
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {savedAddresses.map(addr => (
                  <div key={addr.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <strong>{addr.fullName}</strong>
                        {addr.isDefault && <span className="badge badge-primary">Default</span>}
                      </div>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: 1.5 }}>
                        {addr.addressLine1}, {addr.landmark && `${addr.landmark}, `}
                        {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'block', marginTop: '4px' }}>
                        Phone: {addr.phone}
                      </span>
                    </div>

                    <button
                      onClick={() => removeAddress(addr.id)}
                      style={{ color: '#ef4444', padding: '4px' }}
                      title="Delete Address"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

    </div>
  );
}
