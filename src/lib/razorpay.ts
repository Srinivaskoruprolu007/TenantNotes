import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay client
export const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Types for Razorpay
export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  offer_id: string | null;
  status: string;
  attempts: number;
  notes: any[];
  created_at: number;
}

export interface RazorpayPaymentVerificationData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// Create a new order in Razorpay
export const createRazorpayOrder = async (amount: number, receipt: string, notes: any = {}) => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: receipt,
      payment_capture: 1, // Auto-capture payment
      notes: notes
    };

    const order = await razorpay.orders.create(options);
    return order as RazorpayOrderResponse;
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Verify payment signature
export const verifyPayment = (orderId: string, paymentId: string, signature: string) => {
  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
  } catch (error) {
    console.error('Error verifying payment:', error);
    return false;
  }
};

// Get Razorpay instance for client-side
export const getRazorpay = (key: string) => {
  if (typeof window !== 'undefined') {
    return new (window as any).Razorpay({
      key,
      theme: {
        color: '#2563eb',
      },
    });
  }
  return null;
};
