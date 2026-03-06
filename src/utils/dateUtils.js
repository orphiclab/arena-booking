// src/utils/dateUtils.js

import { format, addHours, isBefore, isAfter, parseISO } from 'date-fns';

/**
 * Format a Date to display string e.g. "Mon, Mar 6"
 */
export const formatDisplayDate = (date) => format(date, 'EEE, MMM d');

/**
 * Format a Date to Firestore-safe string "yyyy-MM-dd"
 */
export const formatFirestoreDate = (date) => format(date, 'yyyy-MM-dd');

/**
 * Format a time number (0-23) to 12h display e.g. 14 => "2:00 PM"
 */
export const formatHour = (hour) => {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return format(d, 'h:mm a');
};

/**
 * Generate all hour slots between startHour and endHour
 * e.g. generateSlots(8, 22) => [{start: 8, end: 9, label: "8:00 AM - 9:00 AM"}, ...]
 */
export const generateSlots = (startHour, endHour) => {
  const slots = [];
  for (let h = startHour; h < endHour; h++) {
    slots.push({
      start: h,
      end: h + 1,
      label: `${formatHour(h)} – ${formatHour(h + 1)}`,
      id: `slot_${h}`,
    });
  }
  return slots;
};

/**
 * Given booked slots (array of {startTime, endTime}) and all slots,
 * return Set of booked hours.
 */
export const getBookedHours = (bookings) => {
  const bookedSet = new Set();
  bookings.forEach((b) => {
    for (let h = b.startTime; h < b.endTime; h++) {
      bookedSet.add(h);
    }
  });
  return bookedSet;
};

/**
 * Validate that selected slots are contiguous
 */
export const areSlotsContiguous = (selectedHours) => {
  if (selectedHours.length <= 1) return true;
  const sorted = [...selectedHours].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) return false;
  }
  return true;
};

/**
 * Compute startTime and endTime from sorted selected hour array
 */
export const getStartEndFromHours = (selectedHours) => {
  const sorted = [...selectedHours].sort((a, b) => a - b);
  return { startTime: sorted[0], endTime: sorted[sorted.length - 1] + 1 };
};
