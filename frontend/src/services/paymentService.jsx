
// ==================== src/services/paymentService.js ====================
import api from './api';

export const initializeRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processPayment = async (bookingData) => {
  try {
    // Create order on backend
    const { data } = await api.post('/payments/create-order', bookingData);

    // Load Razorpay
    const res = await initializeRazorpay();
    if (!res) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Configure Razorpay options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: 'INR',
      name: 'Hall Booking System',
      description: 'Hall Booking Payment',
      order_id: data.orderId,
      handler: async (response) => {
        // Verify payment on backend
        const verifyData = {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          bookingId: data.bookingId
        };
        
        await api.post('/payments/verify', verifyData);
        return true;
      },
      prefill: {
        name: data.userName,
        email: data.userEmail,
        contact: data.userPhone
      },
      theme: {
        color: '#4F46E5'
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  } catch (error) {
    console.error('Payment error:', error);
    throw error;
  }
};
