// src/services/storageService.js

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

/**
 * Upload an image file to Firebase Storage
 * @param {string} uri - local file URI from expo-image-picker
 * @param {string} arenaId - arena ID used as folder name
 * @param {function} onProgress - optional callback(percentage)
 * @returns {string} download URL
 */
export const uploadArenaImage = async (uri, arenaId, onProgress) => {
  const filename = `arenas/${arenaId}/${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
  const storageRef = ref(storage, filename);

  // Convert URI to blob
  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) onProgress(Math.round(progress));
      },
      (error) => reject(error),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};

/**
 * Upload user profile image
 */
export const uploadProfileImage = async (uri, userId, onProgress) => {
  const filename = `users/${userId}/profile_${Date.now()}.jpg`;
  const storageRef = ref(storage, filename);

  const response = await fetch(uri);
  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, blob);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
        }
      },
      reject,
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        resolve(url);
      }
    );
  });
};

/**
 * Delete a file from Firebase Storage by its download URL
 */
export const deleteFileByUrl = async (url) => {
  const fileRef = ref(storage, url);
  await deleteObject(fileRef);
};
