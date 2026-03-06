// src/components/BookingCard.js

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';
import { formatHour } from '../utils/dateUtils';

const STATUS_CONFIG = {
  confirmed:  { color: '#22C55E', icon: 'checkmark-circle', label: 'Confirmed' },
  pending:    { color: '#F59E0B', icon: 'time',             label: 'Pending'   },
  cancelled:  { color: '#EF4444', icon: 'close-circle',     label: 'Cancelled' },
  completed:  { color: '#8A97B8', icon: 'checkmark-done',   label: 'Completed' },
};

const BookingCard = ({ booking, onPress, onCancel }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const status = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.pending;
  const canCancel = booking.bookingStatus === 'confirmed' || booking.bookingStatus === 'pending';

  const displayDate = booking.date
    ? new Date(booking.date).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short',
      })
    : booking.date;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Left accent stripe */}
      <View style={[styles.stripe, { backgroundColor: status.color }]} />

      <View style={styles.body}>
        {/* Arena + status */}
        <View style={styles.topRow}>
          <Text style={[styles.arenaName, { color: colors.textPrimary }]} numberOfLines={1}>
            {booking.arenaName || 'Arena'}
          </Text>
          <View style={[styles.statusChip, { backgroundColor: status.color + '22' }]}>
            <Ionicons name={status.icon} size={12} color={status.color} />
            <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
          </View>
        </View>

        {/* Court info */}
        {booking.courtName && (
          <Text style={[styles.courtName, { color: colors.textSecondary }]}>
            {booking.courtName} · {booking.sportName || ''}
          </Text>
        )}

        {/* Date + time */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="calendar-outline" size={14} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>{displayDate}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={14} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              {formatHour(booking.startTime)} – {formatHour(booking.endTime)}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="cash-outline" size={14} color={colors.primary} />
            <Text style={[styles.detailText, { color: colors.textSecondary }]}>
              ₹{booking.totalPrice}
            </Text>
          </View>
        </View>

        {/* Payment badge */}
        <View style={styles.bottomRow}>
          <View style={[styles.payBadge, { backgroundColor: colors.surface }]}>
            <Ionicons
              name={booking.paymentMethod === 'card' ? 'card-outline' : 'cash-outline'}
              size={12}
              color={colors.textSecondary}
            />
            <Text style={[styles.payText, { color: colors.textSecondary }]}>
              {booking.paymentMethod === 'card' ? 'Online' : 'Pay at Venue'}
            </Text>
          </View>
          {canCancel && onCancel && (
            <TouchableOpacity
              onPress={() => onCancel(booking.id)}
              style={[styles.cancelBtn, { borderColor: colors.error }]}
            >
              <Text style={[styles.cancelText, { color: colors.error }]}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    borderRadius: 18,
    marginBottom: 14,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  stripe: { width: 5 },
  body: { flex: 1, padding: 14 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  arenaName: { fontSize: 15, fontWeight: '700', flex: 1, marginRight: 8 },
  statusChip: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 11, fontWeight: '700' },
  courtName: { fontSize: 12, marginBottom: 10 },
  detailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 10 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  payBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  payText: { fontSize: 11 },
  cancelBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
  cancelText: { fontSize: 12, fontWeight: '700' },
});

export default BookingCard;
