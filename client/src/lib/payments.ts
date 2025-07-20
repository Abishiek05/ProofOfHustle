// Payment processing utilities for Razorpay and Stripe
import { getUserLocation } from './geolocation';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface PaymentOptions {
  amount: number;
  currency: string;
  plan: string;
  duration: number;
  userEmail: string;
  userName: string;
}

export interface PaymentResult {
  success: boolean;
  paymentId?: string;
  orderId?: string;
  error?: string;
}

// Load Razorpay script
export const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// Create Razorpay order
export const createRazorpayOrder = async (options: PaymentOptions) => {
  try {
    const response = await fetch('/api/create-razorpay-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: options.amount,
        currency: options.currency,
        plan: options.plan,
        duration: options.duration,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

// Process Razorpay payment
export const processRazorpayPayment = async (options: PaymentOptions): Promise<PaymentResult> => {
  try {
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    const order = await createRazorpayOrder(options);

    return new Promise((resolve) => {
      const rzp = new window.Razorpay({
        key: 'rzp_test_mYWVwx02CbZZ7E',
        amount: options.amount * 100, // Convert to paise
        currency: options.currency,
        name: 'Proof of Hustle',
        description: `${options.plan} Membership - ${options.duration} months`,
        order_id: order.orderId,
        prefill: {
          name: options.userName,
          email: options.userEmail,
        },
        theme: {
          color: '#06b6d4', // Cyan color matching the theme
        },
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/verify-razorpay-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                plan: options.plan,
                duration: options.duration,
              }),
            });

            if (verifyResponse.ok) {
              resolve({
                success: true,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
              });
            } else {
              resolve({
                success: false,
                error: 'Payment verification failed',
              });
            }
          } catch (error) {
            resolve({
              success: false,
              error: 'Payment verification error',
            });
          }
        },
        modal: {
          ondismiss: () => {
            resolve({
              success: false,
              error: 'Payment cancelled by user',
            });
          },
        },
      });

      rzp.open();
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed',
    };
  }
};

// Determine payment method based on location
export const getPaymentMethod = async () => {
  try {
    const location = await getUserLocation();
    return location.countryCode === 'IN' ? 'razorpay' : 'stripe';
  } catch (error) {
    return 'stripe'; // Default to Stripe
  }
};

// Process payment with automatic method selection
export const processPayment = async (options: PaymentOptions): Promise<PaymentResult> => {
  const paymentMethod = await getPaymentMethod();
  
  if (paymentMethod === 'razorpay' && options.currency === 'INR') {
    return processRazorpayPayment(options);
  } else {
    // Stripe payment processing would go here
    // For now, we'll simulate Stripe
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          paymentId: 'stripe_' + Date.now(),
          orderId: 'stripe_order_' + Date.now(),
        });
      }, 2000);
    });
  }
};