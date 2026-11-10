import { supabase, isSupabaseConfigured } from './supabase';
import { productsService } from './productsService';

const ORDERS_STORAGE_KEY = 'mak_power_orders_list';

// Helper to get local orders
function getLocalOrders() {
  const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  // Initial sample order so admin and tracking can be tested out of the box
  const initial = [
    {
      id: "ord-sample-1",
      orderNumber: "MAK-ORD-2026-8921",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      customerName: "Rahul Sharma",
      customerPhone: "9876543210",
      customerEmail: "rahul.sample@gmail.com",
      shippingAddress: {
        addressLine1: "Near Garkha High School, Chhapra Road",
        landmark: "Opposite SBI Branch",
        city: "Garkha",
        state: "Bihar",
        pincode: "841311"
      },
      items: [
        {
          id: "prod-charger-65w",
          name: "MAK POWER 65W GaN Super Fast Charger with Type-C Cable",
          price: 699,
          quantity: 1,
          subtotal: 699,
          image: "/image/mobile-chargers.jpg"
        }
      ],
      subtotal: 699,
      discount: 0,
      shippingCharge: 0,
      totalAmount: 699,
      paymentMethod: "cod",
      paymentStatus: "pending",
      orderStatus: "shipped",
      trackingNumber: "TRK-MK-9988221",
      statusHistory: [
        { status: "pending", timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), note: "Order placed via website" },
        { status: "confirmed", timestamp: new Date(Date.now() - 86400000 * 1.8).toISOString(), note: "Order verified by MAK POWER store" },
        { status: "packed", timestamp: new Date(Date.now() - 86400000 * 1.2).toISOString(), note: "Packed securely in warehouse" },
        { status: "shipped", timestamp: new Date(Date.now() - 86400000 * 0.5).toISOString(), note: "Dispatched via Express Courier" }
      ]
    }
  ];
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

function saveLocalOrders(orders) {
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
}

export const ordersService = {
  // Create / Place a new Order
  async createOrder({ customer, items, discount = 0, couponCode = null, paymentMethod = 'cod' }) {
    if (!customer?.fullName || !customer?.phone || !customer?.addressLine1 || !customer?.pincode) {
      throw new Error('Please fill in all required customer and address details.');
    }

    if (!items || items.length === 0) {
      throw new Error('Cart is empty.');
    }

    // Server-side calculation & Stock Verification
    let subtotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await productsService.getProductBySlug(item.slug || item.id) || item;
      const unitPrice = Number(product.sellingPrice || item.price);
      const qty = Math.max(1, Number(item.quantity || 1));

      // Verify stock
      if (product.stock !== undefined && product.stock < qty) {
        throw new Error(`Insufficient stock for "${product.name}". Only ${product.stock} available.`);
      }

      const itemSubtotal = unitPrice * qty;
      subtotal += itemSubtotal;

      validatedItems.push({
        id: product.id || item.id,
        name: product.name,
        price: unitPrice,
        quantity: qty,
        subtotal: itemSubtotal,
        image: product.images?.[0] || item.image || '/image/featured-electronics.jpg'
      });
    }

    // Free delivery over ₹499, else ₹49
    const shippingCharge = subtotal >= 499 ? 0 : 49;
    const finalDiscount = Math.min(discount, subtotal);
    const totalAmount = Math.max(0, subtotal - finalDiscount + shippingCharge);

    // Generate Unique Order ID
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MAK-ORD-${new Date().getFullYear()}-${randomSuffix}`;
    const now = new Date().toISOString();

    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber,
      createdAt: now,
      customerName: customer.fullName,
      customerPhone: customer.phone,
      customerEmail: customer.email || '',
      shippingAddress: {
        addressLine1: customer.addressLine1,
        addressLine2: customer.addressLine2 || '',
        landmark: customer.landmark || '',
        city: customer.city || 'Garkha',
        state: customer.state || 'Bihar',
        pincode: customer.pincode,
        deliveryInstructions: customer.deliveryInstructions || ''
      },
      items: validatedItems,
      subtotal,
      discount: finalDiscount,
      couponCode,
      shippingCharge,
      totalAmount,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: 'confirmed', // Auto-confirm initial Cash On Delivery
      trackingNumber: `TRK-MK-${randomSuffix}`,
      statusHistory: [
        {
          status: 'pending',
          timestamp: now,
          note: 'Order placed by customer'
        },
        {
          status: 'confirmed',
          timestamp: now,
          note: paymentMethod === 'cod' 
            ? 'Cash on Delivery confirmed. Preparing for packing.' 
            : 'Order confirmed.'
        }
      ]
    };

    // Deduct stock for each product
    for (const item of validatedItems) {
      const p = await productsService.getProductBySlug(item.slug || item.id) || item;
      if (p && p.stock !== undefined) {
        await productsService.updateProduct(p.id, { stock: Math.max(0, p.stock - item.quantity) });
      }
    }

    // Save to LocalStorage
    const localOrders = getLocalOrders();
    localOrders.unshift(newOrder);
    saveLocalOrders(localOrders);

    // Sync to Supabase if connected
    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').insert({
          order_number: newOrder.orderNumber,
          customer_name: newOrder.customerName,
          customer_phone: newOrder.customerPhone,
          customer_email: newOrder.customerEmail,
          shipping_address: newOrder.shippingAddress,
          subtotal: newOrder.subtotal,
          discount: newOrder.discount,
          shipping_charge: newOrder.shippingCharge,
          total_amount: newOrder.totalAmount,
          payment_method: newOrder.paymentMethod,
          payment_status: newOrder.paymentStatus,
          order_status: newOrder.orderStatus,
          tracking_number: newOrder.trackingNumber
        });
      } catch (err) {
        console.error('Supabase order creation error', err);
      }
    }

    return newOrder;
  },

  // Get Order by Order Number
  async getOrderByNumber(orderNumber) {
    const orders = getLocalOrders();
    const cleanNumber = orderNumber.trim().toUpperCase();
    return orders.find(o => o.orderNumber.toUpperCase() === cleanNumber) || null;
  },

  // Get all orders (for Admin & Customer history)
  async getAllOrders() {
    return getLocalOrders();
  },

  // Update order status (Admin)
  async updateOrderStatus(orderId, newStatus, note = '') {
    const orders = getLocalOrders();
    const index = orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (index !== -1) {
      orders[index].orderStatus = newStatus;
      orders[index].statusHistory.push({
        status: newStatus,
        timestamp: new Date().toISOString(),
        note: note || `Order status marked as ${newStatus}`
      });

      if (newStatus === 'delivered') {
        orders[index].paymentStatus = 'completed';
      }

      saveLocalOrders(orders);
      return orders[index];
    }
    return null;
  },

  // Calculate Admin Stats
  async getAdminStats() {
    const orders = getLocalOrders();
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.orderStatus === 'delivered').length;
    const pendingOrders = orders.filter(o => ['pending', 'confirmed', 'processing', 'packed'].includes(o.orderStatus)).length;
    const cancelledOrders = orders.filter(o => o.orderStatus === 'cancelled').length;
    const totalRevenue = orders
      .filter(o => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    const products = await productsService.getProducts();
    const lowStockProducts = products.filter(p => p.stock < 10);

    return {
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      cancelledOrders,
      totalProducts: products.length,
      lowStockCount: lowStockProducts.length,
      lowStockProducts
    };
  }
};
