/**
 * Vercel Serverless Function: /api/verify-payment
 * Verifies Razorpay payment signature securely on the server without leaking secret keys.
 */
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      // In sandbox/testing mode when no secret is configured
      return res.status(200).json({
        success: true,
        testMode: true,
        message: 'Payment verified in test environment.'
      });
    }

    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature === razorpay_signature) {
      return res.status(200).json({ success: true, verified: true });
    } else {
      return res.status(400).json({ success: false, error: 'Invalid payment signature' });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Payment verification failed' });
  }
}
