// src/services/arenaService.js
import { db } from '../config/firebase';

const ARENAS_COLLECTION = 'arenas';

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const getNearbyArenas = async (userLat, userLng, radiusKm = 20) => {
  const snap = await db.collection(ARENAS_COLLECTION).get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((a) => {
      if (!a.lat || !a.lng) return true;
      const dist = haversineDistance(userLat, userLng, a.lat, a.lng);
      return dist <= radiusKm;
    });
};

export const getAllArenas = async () => {
  const snap = await db.collection(ARENAS_COLLECTION).get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const getArenaById = async (arenaId) => {
  const doc = await db.collection(ARENAS_COLLECTION).doc(arenaId).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
};

export const getArenasByOwner = async (ownerId) => {
  const snap = await db
    .collection(ARENAS_COLLECTION)
    .where('ownerId', '==', ownerId)
    .get();
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const createArena = async (arenaData) => {
  const ref = await db.collection(ARENAS_COLLECTION).add({
    ...arenaData,
    rating: 0,
    reviewCount: 0,
    createdAt: new Date().toISOString(),
  });
  return ref.id;
};

export const updateArena = async (arenaId, data) => {
  await db.collection(ARENAS_COLLECTION).doc(arenaId).update(data);
};

export const deleteArena = async (arenaId) => {
  await db.collection(ARENAS_COLLECTION).doc(arenaId).delete();
};
