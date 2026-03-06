// src/screens/BookingDetailScreen.js

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, useColorScheme, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';
import { cancelBooking } from '../services/bookingService';
import { cancelBookingReminder } from '../services/notificationService';
import CustomButton from '../components/CustomButton';

const STATUS_CONFIG = {
  confirmed:   { label: 'Confirmed',   color: '#22C55E', icon: 'checkmark-circle',   gradient: ['#22C55E', '#16A34A'] },
  pending:     { label: 'Pending',     color: '#F59E0B', icon: 'time',               gradient: ['#F59E0B', '#D97706'] },
  cancelled:   { label: 'Cancelled',   color: '#6B7280', icon: 'close-circle',       gradient: ['#6B7280', '#4B5563'] },
  completed:   { label: 'Completed',   color: '#00C2FF', icon: 'checkmark-done',     gradient: ['#00C2FF', '#0090CC'] },
};

const PAYMENT_LABEL = {
  card:         'Online Payment (Card)',
  pay_at_venue: 'Pay at Venue (Cash)',
};

const InfoRow = ({ icon, label, value, colors, accent }) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIconBox, { backgroundColor: accent + '18' }]}>
      <Ionicons name={icon} size={18} color={accent} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  </View>
);

const BookingDetailScreen = ({ route, navigation }) => {
  const { booking } = route.params;
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [cancelling, setCancelling] = useState(false);

  const status = STATUS_CONFIG[booking.bookingStatus] || STATUS_CONFIG.confirmed;
  const today = new Date().toISOString().split('T')[0];
  const isUpcoming = booking.date >= today && booking.bookingStatus !== 'cancelled' && booking.bookingStatus !== 'completed';

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏟️ Booking Confirmed!\nArena: ${booking.arenaName}\nDate: ${booking.date}\nTime: ${booking.startTime} – ${booking.endTime}\nTotal: ₹${booking.totalPrice}\nBooking ID: ${booking.id}`,
      });
    } catch {}
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure? This cannot be undone.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelBooking(booking.id);
              await cancelBookingReminder(booking.id);
              Alert.alert('Cancelled', 'Your booking has been cancelled.', [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } catch {
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header gradient card */}
        <LinearGradient colors={status.gradient} style={styles.heroCard}>
          <Ionicons name={status.icon} size={48} color="#fff" />
          <Text style={styles.heroStatus}>{status.label}</Text>
          <Text style={styles.heroArena}>{booking.arenaName || 'Arena'}</Text>
          <Text style={styles.heroDate}>{booking.date}</Text>
        </LinearGradient>

        {/* Time & Duration */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>📅 Booking Details</Text>

          <InfoRow icon="time-outline"     label="Start Time"      value={booking.startTime || '—'}  colors={colors} accent={colors.primary} />
          <InfoRow icon="time"             label="End Time"        value={booking.endTime || '—'}    colors={colors} accent={colors.primary} />
          {booking.sportName && (
            <InfoRow icon="trophy-outline" label="Sport"           value={booking.sportName}         colors={colors} accent="#8B5CF6" />
          )}
          {booking.courtName && (
            <InfoRow icon="grid-outline"   label="Court"           value={booking.courtName}         colors={colors} accent="#10B981" />
          )}
          <InfoRow icon="location-outline" label="Arena"           value={booking.arenaName || '—'}  colors={colors} accent="#F59E0B" />
        </View>

        {/* Payment */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>💳 Payment</Text>
          <InfoRow
            icon="card-outline"
            label="Method"
            value={PAYMENT_LABEL[booking.paymentMethod] || 'Pay at Venue'}
            colors={colors}
            accent="#8B5CF6"
          />
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>Total Paid</Text>
            <Text style={[styles.priceValue, { color: colors.primary }]}>₹{booking.totalPrice || 0}</Text>
          </View>
        </View>

        {/* QR Code placeholder */}
        <View style={[styles.card, styles.qrCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.qrBox, { borderColor: colors.primary + '60', backgroundColor: colors.surface || colors.background }]}>
            <Ionicons name="qr-code-outline" size={72} color={colors.primary} />
          </View>
          <Text style={[styles.qrId, { color: colors.textSecondary }]}>Booking ID</Text>
          <Text style={[styles.qrCode, { color: colors.textPrimary }]} selectable>
            {booking.id}
          </Text>
          <Text style={[styles.qrHint, { color: colors.textSecondary }]}>
            Show this at the venue reception
          </Text>
        </View>

        {/* Share */}
        <TouchableOpacity
          style={[styles.shareBtn, { borderColor: colors.primary }]}
          onPress={handleShare}
          activeOpacity={0.75}
        >
          <Ionicons name="share-social-outline" size={18} color={colors.primary} />
          <Text style={[styles.shareBtnText, { color: colors.primary }]}>Share Booking</Text>
        </TouchableOpacity>

        {/* Cancel */}
        {isUpcoming && (
          <CustomButton
            title={cancelling ? 'Cancelling…' : 'Cancel Booking'}
            onPress={handleCancel}
            loading={cancelling}
            variant="danger"
            style={styles.cancelBtn}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 32 },

  heroCard: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  heroStatus: { color: '#fff', fontSize: 20, fontWeight: '800', marginTop: 4 },
  heroArena: { color: 'rgba(255,255,255,0.9)', fontSize: 15, fontWeight: '600' },
  heroDate: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },

  card: {
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 14, letterSpacing: 0.2 },

  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  infoIconBox: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 11, fontWeight: '600', marginBottom: 1 },
  infoValue: { fontSize: 14, fontWeight: '700' },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.08)',
  },
  priceLabel: { fontSize: 13, fontWeight: '600' },
  priceValue: { fontSize: 26, fontWeight: '900' },

  qrCard: { alignItems: 'center', paddingVertical: 24 },
  qrBox: {
    width: 130,
    height: 130,
    borderRadius: 20,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  qrId: { fontSize: 11, fontWeight: '600', marginBottom: 4 },
  qrCode: { fontSize: 13, fontWeight: '700', textAlign: 'center', letterSpacing: 0.5, marginBottom: 8 },
  qrHint: { fontSize: 12, textAlign: 'center', opacity: 0.8 },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingVertical: 13,
    marginBottom: 12,
  },
  shareBtnText: { fontSize: 14, fontWeight: '700' },

  cancelBtn: { marginTop: 4 },
});

export default BookingDetailScreen;
