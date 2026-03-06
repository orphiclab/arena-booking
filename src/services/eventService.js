// src/services/eventService.js
import { db } from '../config/firebase';

const EVENTS = 'events';

export const getUpcomingEvents = async () => {
  const today = new Date().toISOString().split('T')[0];
  const snap = await db
    .collection(EVENTS)
    .where('eventDate', '>=', today)
    .orderBy('eventDate', 'asc')
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getAllEvents = async () => {
  const snap = await db.collection(EVENTS).orderBy('eventDate', 'desc').get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createEvent = async (eventData) => {
  const ref = await db.collection(EVENTS).add({
    ...eventData,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
};

export const updateEvent = async (eventId, data) => {
  await db.collection(EVENTS).doc(eventId).update(data);
};

export const deleteEvent = async (eventId) => {
  await db.collection(EVENTS).doc(eventId).delete();
};
