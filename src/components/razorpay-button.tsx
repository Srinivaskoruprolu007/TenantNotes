'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';
import Script from 'next/script';
import { useState, useEffect } from 'react';

export function RazorpayButton({
  amount,
  planId,
  userId,
  buttonText = 'Pay Now',
  variant = 'default',
  className = '',
  onSuccess,
  onError,
}: {
  amount: number;
  planId: string;
  userId: string;
  buttonText?: string;
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  className?: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: any) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Razorpay is already loaded
    if ((window as any).Razorpay) {
      setScriptLoaded(true);
    }
  }, []);

  const handlePayment = async () => {
    if (!scriptLoaded) {
      toast({
        title: 'Payment Error',
        description: 'Payment service is still initializing. Please try again in a moment.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      // Create order on your server
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          planId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const { orderId, key } = await response.json();

      const options = {
        key,
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'TenantNotes',
        description: `Subscription for ${planId} plan`,
        order_id: orderId,
        handler: async function (response: any) {
          // Verify payment on your server
          const verificationResponse = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId,
              userId,
            }),
          });

          const data = await verificationResponse.json();

          if (verificationResponse.ok && data.success) {
            toast({
              title: 'Payment Successful',
              description: 'Your subscription has been activated successfully!',
            });
            onSuccess?.(response.razorpay_payment_id);
          } else {
            throw new Error(data.error || 'Payment verification failed');
          }
        },
        prefill: {
          name: '', // You can prefill user details if available
          email: '',
          contact: '',
        },
        notes: {
          planId,
          userId,
        },
        theme: {
          color: '#2563eb',
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error.message || 'An error occurred while processing your payment',
        variant: 'destructive',
      });
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-script"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <Button
        onClick={handlePayment}
        disabled={loading || !scriptLoaded}
        variant={variant}
        className={className}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          buttonText
        )}
      </Button>
    </>
  );
}
