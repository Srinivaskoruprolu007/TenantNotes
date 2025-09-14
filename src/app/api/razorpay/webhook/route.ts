import { NextResponse } from 'next/server';
import { verifyPayment } from '@/lib/razorpay';
import { updateUserSubscription } from '@/lib/firestore';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature') || '';
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Verify the webhook signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(body);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const event = JSON.parse(body);
    const { payload } = event;

    // Handle different Razorpay webhook events
    switch (event.event) {
      case 'payment.captured':
        const { payment } = payload;
        const { notes } = payment.entity;
        
        if (notes?.userId && notes?.planId) {
          await updateUserSubscription(notes.userId, notes.planId);
        }
        break;
      
      case 'subscription.charged':
        // Handle subscription renewal
        const { subscription } = payload;
        if (subscription.notes?.userId) {
          await updateUserSubscription(
            subscription.notes.userId, 
            subscription.plan_id,
            subscription.id
          );
        }
        break;
      
      default:
        console.log('Unhandled event:', event.event);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}
