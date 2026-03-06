// src/services/courtService.js
import { db } from '../config/firebase';

const COURTS = 'courts';

export const getCourtsByArenaAndSport = async (arenaId, sport) => {
  const snap = await db
    .collection(COURTS)
    .where('arenaId', '==', arenaId)
    .where('sport', '==', sport)
    .where('isActive', '==', true)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getCourtsByArena = async (arenaId) => {
  const snap = await db
    .collection(COURTS)
    .where('arenaId', '==', arenaId)
    .where('isActive', '==', true)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createCourt = async (courtData) => {
  const ref = await db.collection(COURTS).add({ ...courtData, isActive: true });
  return ref.id;
};

export const updateCourt = async (courtId, data) => {
  await db.collection(COURTS).doc(courtId).update(data);
};

export const deactivateCourt = async (courtId) => {
  await db.collection(COURTS).doc(courtId).update({ isActive: false });
};
