// src/services/paymentService.js
import { db } from '../config/firebase';

const PAYMENTS = 'payments';
const BOOKINGS = 'bookings';

export const processPayment = async ({ bookingId, userId, amount, paymentMethod }) => {
  if (paymentMethod === 'pay_at_venue') {
    const ref = await db.collection(PAYMENTS).add({
      bookingId,
      userId,
      amount,
      paymentMethod: 'pay_at_venue',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    });
    await db.collection(BOOKINGS).doc(bookingId).update({ bookingStatus: 'confirmed' });
    return { paymentId: ref.id, status: 'pending' };
  }

  if (paymentMethod === 'card') {
    // TODO: Call Firebase Cloud Function to create Stripe PaymentIntent
    // const result = await fetch('YOUR_CLOUD_FUNCTION_URL/createPaymentIntent', {
    //   method: 'POST', body: JSON.stringify({ amount, currency: 'inr' }),
    // });
    const ref = await db.collection(PAYMENTS).add({
      bookingId,
      userId,
      amount,
      paymentMethod: 'card',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    });
    return { paymentId: ref.id, status: 'pending' };
  }

  throw new Error('Unknown payment method');
};

export const updatePaymentStatus = async (paymentId, status, transactionId = null) => {
  await db.collection(PAYMENTS).doc(paymentId).update({
    paymentStatus: status,
    ...(transactionId && { transactionId }),
    updatedAt: new Date().toISOString(),
  });
};
