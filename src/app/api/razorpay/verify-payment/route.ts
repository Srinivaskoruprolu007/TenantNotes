import { NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/razorpay';
import { updateUserSubscription } from '@/lib/firestore';

export async function POST(request: Request) {
  try {
    const {
      razorpay_order_id: orderId,
      razorpay_payment_id: paymentId,
      razorpay_signature: signature,
      planId,
      userId,
    } = await request.json();

    if (!orderId || !paymentId || !signature || !planId || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Verify the payment signature
    const isSignatureValid = verifyPayment(orderId, paymentId, signature);

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Update user subscription in your database
    await updateUserSubscription(userId, planId, paymentId);

    return NextResponse.json({
      success: true,
      message: 'Payment verified and subscription updated',
      paymentId,
      orderId,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
