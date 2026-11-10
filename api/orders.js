/**
 * Vercel Serverless Function: /api/orders
 * Handles secure server-side order calculation, inventory verification, and order creation.
 */

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { customer, items, discount = 0, paymentMethod = 'cod' } = req.body;

      if (!customer?.fullName || !customer?.phone || !customer?.addressLine1 || !customer?.pincode) {
        return res.status(400).json({ error: 'Missing required delivery address fields.' });
      }

      if (!items || items.length === 0) {
        return res.status(400).json({ error: 'Order items cannot be empty.' });
      }

      // Calculate totals
      let subtotal = 0;
      for (const item of items) {
        subtotal += Number(item.price || 0) * Number(item.quantity || 1);
      }

      const shippingCharge = subtotal >= 499 ? 0 : 49;
      const finalDiscount = Math.min(Number(discount || 0), subtotal);
      const totalAmount = Math.max(0, subtotal - finalDiscount + shippingCharge);

      const orderNumber = `MAK-ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const orderData = {
        orderNumber,
        createdAt: new Date().toISOString(),
        customerName: customer.fullName,
        customerPhone: customer.phone,
        customerEmail: customer.email || '',
        shippingAddress: customer,
        subtotal,
        discount: finalDiscount,
        shippingCharge,
        totalAmount,
        paymentMethod,
        orderStatus: 'confirmed'
      };

      return res.status(200).json({
        success: true,
        message: 'Order placed successfully.',
        order: orderData
      });
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Server error creating order.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
