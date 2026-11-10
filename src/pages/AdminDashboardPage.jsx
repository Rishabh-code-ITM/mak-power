import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Printer,
  Search,
  CheckCircle,
  Database,
  RotateCcw,
  ShieldCheck,
  X
} from 'lucide-react';
import { ordersService } from '../services/ordersService';
import { productsService } from '../services/productsService';
import { isSupabaseConfigured } from '../services/supabase';
import { INITIAL_CATEGORIES } from '../services/mockData';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'products' | 'stats'
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchOrder, setSearchOrder] = useState('');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Add Product Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    categorySlug: 'chargers-adapters',
    categoryName: 'Chargers & Adapters',
    sellingPrice: '',
    originalPrice: '',
    stock: 25,
    shortDesc: '',
    description: '',
    isFeatured: true,
    isTrending: false,
    images: ['/image/featured-electronics.jpg']
  });

  const loadData = async () => {
    const s = await ordersService.getAdminStats();
    setStats(s);
    const ords = await ordersService.getAllOrders();
    setOrders(ords);
    const prods = await productsService.getProducts();
    setProducts(prods);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    await ordersService.updateOrderStatus(orderId, newStatus);
    loadData();
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.sellingPrice) return;
    await productsService.addProduct(newProduct);
    setIsAddModalOpen(false);
    setNewProduct({
      name: '',
      categorySlug: 'chargers-adapters',
      categoryName: 'Chargers & Adapters',
      sellingPrice: '',
      originalPrice: '',
      stock: 25,
      shortDesc: '',
      description: '',
      isFeatured: true,
      isTrending: false,
      images: ['/image/featured-electronics.jpg']
    });
    loadData();
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await productsService.deleteProduct(id);
      loadData();
    }
  };

  const handleResetCatalog = () => {
    if (window.confirm('Reset catalog to official MAK POWER demo products?')) {
      productsService.resetToDefaults();
      loadData();
    }
  };

  const filteredOrders = orders.filter(o =>
    !searchOrder ||
    o.orderNumber.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchOrder.toLowerCase()) ||
    o.customerPhone.includes(searchOrder)
  );

  return (
    <div className="container" style={{ padding: '30px 0 80px' }}>
      
      {/* Admin Top Header */}
      <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 900, color: 'var(--secondary)' }}>
              MAK POWER Admin Dashboard
            </h1>
            <span className="badge badge-primary">Store Control</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Manage catalog, monitor real customer orders, generate invoices & update inventory.
          </p>
        </div>

        {/* Database Status Pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            background: isSupabaseConfigured ? '#dcfce7' : '#fef3c7',
            color: isSupabaseConfigured ? '#15803d' : '#b45309',
            fontSize: '0.8rem',
            fontWeight: 700,
            border: `1px solid ${isSupabaseConfigured ? '#86efac' : '#fde68a'}`
          }}>
            <Database size={14} />
            <span>{isSupabaseConfigured ? 'Supabase Connected' : 'Local Demo Storage Active'}</span>
          </div>

          <button onClick={handleResetCatalog} className="btn btn-secondary btn-sm" title="Restore Default Catalog">
            <RotateCcw size={14} />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Admin Quick Stats Grid */}
      {stats && (
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <span className="admin-stat-title">Total Orders</span>
            <div className="admin-stat-val">{stats.totalOrders}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--success)', fontWeight: 600 }}>Active store volume</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-title">Total Revenue</span>
            <div className="admin-stat-val" style={{ color: 'var(--primary)' }}>₹{stats.totalRevenue}</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross order value</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-title">Pending Fulfillment</span>
            <div className="admin-stat-val" style={{ color: '#f59e0b' }}>{stats.pendingOrders}</div>
            <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Needs dispatch</span>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-title">Active Products</span>
            <div className="admin-stat-val">{stats.totalProducts}</div>
            <span style={{ fontSize: '0.75rem', color: stats.lowStockCount > 0 ? '#ef4444' : 'var(--success)', fontWeight: 600 }}>
              {stats.lowStockCount > 0 ? `⚠️ ${stats.lowStockCount} Low stock alerts` : '✓ All in stock'}
            </span>
          </div>
        </div>
      )}

      {/* Main Admin Content Layout */}
      <div className="admin-layout">
        
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            <ShoppingBag size={18} />
            <span>Orders Management</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`admin-nav-item ${activeTab === 'products' ? 'active' : ''}`}
            style={{ width: '100%' }}
          >
            <Package size={18} />
            <span>Products & Stock</span>
          </button>

          <Link
            to="/shop"
            className="admin-nav-item"
            style={{ marginTop: '20px', color: 'var(--primary)', borderTop: '1px solid var(--border)', paddingTop: '14px' }}
          >
            <span>Preview Storefront →</span>
          </Link>
        </aside>

        {/* Content Pane */}
        <main>
          
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="admin-table-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>
                  Customer Orders ({filteredOrders.length})
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    placeholder="Search Order ID or Phone..."
                    value={searchOrder}
                    onChange={(e) => setSearchOrder(e.target.value)}
                    style={{ padding: '6px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.88rem', minWidth: '240px' }}
                  />
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No orders found.
                </div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer & Address</th>
                      <th>Items</th>
                      <th>Total & Mode</th>
                      <th>Status Action</th>
                      <th>Invoice</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(ord => (
                      <tr key={ord.id}>
                        <td>
                          <strong style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>
                            {ord.orderNumber}
                          </strong>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                          {new Date(ord.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td>
                          <strong>{ord.customerName}</strong>
                          <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            📞 {ord.customerPhone}
                          </span>
                          <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            📍 {ord.shippingAddress.city}, {ord.shippingAddress.state} ({ord.shippingAddress.pincode})
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>
                            {ord.items.map((it, idx) => (
                              <div key={idx} style={{ whiteSpace: 'nowrap' }}>
                                • {it.name} (x{it.quantity})
                              </div>
                            ))}
                          </div>
                        </td>
                        <td>
                          <strong style={{ fontSize: '0.95rem' }}>₹{ord.totalAmount}</strong>
                          <span style={{ display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--success)', fontWeight: 700 }}>
                            {ord.paymentMethod} ({ord.paymentStatus})
                          </span>
                        </td>
                        <td>
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                            style={{ padding: '6px 10px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', fontWeight: 600, background: '#fff' }}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="packed">Packed</option>
                            <option value="shipped">Shipped</option>
                            <option value="out_for_delivery">Out for Delivery</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedInvoiceOrder(ord)}
                            className="btn btn-secondary btn-sm"
                            title="Generate & Print Invoice"
                          >
                            <Printer size={14} />
                            <span>Invoice</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* PRODUCTS TAB */}
          {activeTab === 'products' && (
            <div className="admin-table-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>
                  Product Catalog ({products.length})
                </h3>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={16} />
                  <span>Add New Product</span>
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Selling Price</th>
                    <th>MRP</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img src={p.images[0]} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} />
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: 'var(--secondary)' }}>{p.name}</strong>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              Rating: {p.rating} ★ ({p.reviewsCount} reviews)
                            </span>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.85rem' }}>{p.categoryName}</td>
                      <td><strong style={{ color: 'var(--primary)' }}>₹{p.sellingPrice}</strong></td>
                      <td style={{ color: 'var(--text-muted)' }}>₹{p.originalPrice}</td>
                      <td>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          background: p.stock < 10 ? '#fee2e2' : '#dcfce7',
                          color: p.stock < 10 ? '#b91c1c' : '#15803d'
                        }}>
                          {p.stock} units
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{ color: '#ef4444', padding: '4px' }}
                            title="Delete Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </main>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-lg)', width: '100%', maxWidth: '580px', padding: '26px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 800 }}>
                Add New Product
              </h3>
              <button onClick={() => setIsAddModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MAK POWER 100W SuperVOOC Cable"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Category *</label>
                  <select
                    value={newProduct.categorySlug}
                    onChange={(e) => {
                      const sel = INITIAL_CATEGORIES.find(c => c.slug === e.target.value);
                      setNewProduct({
                        ...newProduct,
                        categorySlug: e.target.value,
                        categoryName: sel?.name || 'Accessories'
                      });
                    }}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  >
                    {INITIAL_CATEGORIES.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 499"
                    value={newProduct.sellingPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, sellingPrice: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Original MRP (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 999"
                    value={newProduct.originalPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, originalPrice: e.target.value })}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Short Description</label>
                <input
                  type="text"
                  placeholder="Key selling points"
                  value={newProduct.shortDesc}
                  onChange={(e) => setNewProduct({ ...newProduct, shortDesc: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: '4px' }}>Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Product specifications and details"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="btn btn-secondary btn-sm">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Invoice Modal */}
      {selectedInvoiceOrder && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{ background: '#fff', borderRadius: 'var(--radius-md)', width: '100%', maxWidth: '640px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img src="/image/mak power logo.png" alt="MAK POWER" style={{ width: '36px', height: '36px' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 800 }}>
                  TAX INVOICE - MAK POWER
                </h3>
              </div>
              <button onClick={() => setSelectedInvoiceOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <p><strong>Store:</strong> MAK POWER, Chhapra–Road, Garkha, Bihar 841311</p>
              <p><strong>Phone:</strong> 9942670379 • <strong>GST / Registration:</strong> Verified Indian Retailer</p>
              <p style={{ marginTop: '6px' }}><strong>Invoice / Order No:</strong> {selectedInvoiceOrder.orderNumber}</p>
              <p><strong>Date:</strong> {new Date(selectedInvoiceOrder.createdAt).toLocaleString('en-IN')}</p>
            </div>

            <div style={{ marginBottom: '16px', fontSize: '0.85rem' }}>
              <strong>Bill To & Ship To:</strong>
              <p>{selectedInvoiceOrder.customerName}</p>
              <p>{selectedInvoiceOrder.shippingAddress.addressLine1}, {selectedInvoiceOrder.shippingAddress.city}, {selectedInvoiceOrder.shippingAddress.state} - {selectedInvoiceOrder.shippingAddress.pincode}</p>
              <p>Phone: {selectedInvoiceOrder.customerPhone}</p>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', marginBottom: '16px' }}>
              <thead>
                <tr style={{ background: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Item</th>
                  <th style={{ textAlign: 'center', padding: '8px' }}>Qty</th>
                  <th style={{ textAlign: 'right', padding: '8px' }}>Price</th>
                  <th style={{ textAlign: 'right', padding: '8px' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedInvoiceOrder.items.map((it, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '8px' }}>{it.name}</td>
                    <td style={{ textAlign: 'center', padding: '8px' }}>{it.quantity}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>₹{it.price}</td>
                    <td style={{ textAlign: 'right', padding: '8px' }}>₹{it.subtotal}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.88rem', textAlign: 'right' }}>
              <div>Subtotal: <strong>₹{selectedInvoiceOrder.subtotal}</strong></div>
              {selectedInvoiceOrder.discount > 0 && <div>Discount: <strong>- ₹{selectedInvoiceOrder.discount}</strong></div>}
              <div>Shipping Charge: <strong>{selectedInvoiceOrder.shippingCharge === 0 ? 'FREE' : `₹${selectedInvoiceOrder.shippingCharge}`}</strong></div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--primary)', borderTop: '1px solid var(--border)', paddingTop: '6px', marginTop: '4px' }}>
                Final Amount Paid / Due ({selectedInvoiceOrder.paymentMethod.toUpperCase()}): ₹{selectedInvoiceOrder.totalAmount}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
              <button onClick={() => window.print()} className="btn btn-primary btn-sm">
                <Printer size={15} />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
