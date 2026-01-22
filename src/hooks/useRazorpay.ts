import { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  amount: number;
  currency?: string;
  name: string;
  description: string;
  orderId?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: RazorpayResponse) => void;
  onError?: (error: any) => void;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export function useRazorpay() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (window.Razorpay) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      toast({
        title: 'Error',
        description: 'Failed to load payment gateway. Please try again.',
        variant: 'destructive',
      });
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const openPayment = (options: RazorpayOptions) => {
    if (!isLoaded || !window.Razorpay) {
      toast({
        title: 'Please wait',
        description: 'Payment gateway is loading...',
      });
      return;
    }

    setIsLoading(true);

    const razorpayOptions = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_placeholder',
      amount: options.amount * 100, // Razorpay expects amount in paise
      currency: options.currency || 'INR',
      name: options.name,
      description: options.description,
      order_id: options.orderId,
      prefill: options.prefill,
      theme: {
        color: '#3B82F6',
      },
      handler: function (response: RazorpayResponse) {
        setIsLoading(false);
        options.onSuccess(response);
      },
      modal: {
        ondismiss: function () {
          setIsLoading(false);
        },
      },
    };

    try {
      const rzp = new window.Razorpay(razorpayOptions);
      rzp.on('payment.failed', function (response: any) {
        setIsLoading(false);
        if (options.onError) {
          options.onError(response.error);
        } else {
          toast({
            title: 'Payment Failed',
            description: response.error.description || 'Something went wrong. Please try again.',
            variant: 'destructive',
          });
        }
      });
      rzp.open();
    } catch (error) {
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return { isLoaded, isLoading, openPayment };
}
