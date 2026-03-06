// src/services/bookingService.js
import { db } from '../config/firebase';
import firebase from '../config/firebase';

const BOOKINGS = 'bookings';

export const createBooking = async (bookingData) => {
  const { arenaId, courtId, date, startTime, endTime } = bookingData;

  // Use a transaction to prevent double booking
  return db.runTransaction(async (transaction) => {
    const existing = await db
      .collection(BOOKINGS)
      .where('arenaId', '==', arenaId)
      .where('courtId', '==', courtId)
      .where('date', '==', date)
      .where('bookingStatus', 'in', ['confirmed', 'pending'])
      .get();

    const conflict = existing.docs.some((d) => {
      const b = d.data();
      return !(endTime <= b.startTime || startTime >= b.endTime);
    });

    if (conflict) throw new Error('This slot is already booked. Please choose another time.');

    const ref = db.collection(BOOKINGS).doc();
    transaction.set(ref, {
      ...bookingData,
      bookingStatus: 'confirmed',
      createdAt: new Date().toISOString(),
    });
    return ref.id;
  });
};

export const getUserBookings = async (userId) => {
  const snap = await db
    .collection(BOOKINGS)
    .where('userId', '==', userId)
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getArenaBookings = async (arenaId) => {
  const snap = await db
    .collection(BOOKINGS)
    .where('arenaId', '==', arenaId)
    .orderBy('createdAt', 'desc')
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const cancelBooking = async (bookingId) => {
  await db.collection(BOOKINGS).doc(bookingId).update({ bookingStatus: 'cancelled' });
};

export const getBookedSlots = async (arenaId, courtId, date) => {
  const snap = await db
    .collection(BOOKINGS)
    .where('arenaId', '==', arenaId)
    .where('courtId', '==', courtId)
    .where('date', '==', date)
    .where('bookingStatus', 'in', ['confirmed', 'pending'])
    .get();
  return snap.docs.map((d) => d.data());
};
