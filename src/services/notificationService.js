// src/services/notificationService.js

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions and get Expo push token.
 * Stores the token in the user's Firestore doc for server-side sending.
 */
export const registerForPushNotifications = async (userId) => {
  if (!Device.isDevice) {
    console.warn('Push notifications only work on physical devices.');
    return null;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.warn('Push notification permission denied.');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  const token = tokenData.data;

  // Persist token to Firestore so Cloud Functions can send targeted notifications
  if (userId) {
    await updateDoc(doc(db, 'users', userId), { expoPushToken: token });
  }

  return token;
};

/**
 * Schedule a local notification (e.g., booking reminder 30 min before)
 */
export const scheduleBookingReminder = async (booking) => {
  const [year, month, day] = booking.date.split('-').map(Number);
  const reminderDate = new Date(year, month - 1, day, booking.startTime - 1, 30); // 30 min before

  if (reminderDate <= new Date()) return; // Skip if in the past

  await Notifications.scheduleNotificationAsync({
    content: {
      title: '⏰ Booking Reminder',
      body: `Your booking at ${booking.arenaName} starts in 30 minutes!`,
      data: { bookingId: booking.bookingId },
    },
    trigger: reminderDate,
  });
};

/**
 * Cancel all scheduled notifications for a booking
 */
export const cancelBookingReminder = async (bookingId) => {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  for (const notif of scheduled) {
    if (notif.content.data?.bookingId === bookingId) {
      await Notifications.cancelScheduledNotificationAsync(notif.identifier);
    }
  }
};

/**
 * Send an immediate local notification (useful for booking confirmation)
 */
export const sendLocalNotification = async (title, body, data = {}) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data },
    trigger: null, // immediate
  });
};
