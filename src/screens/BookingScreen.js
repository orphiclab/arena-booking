// src/screens/BookingScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { getArenaBookingsForDate, createBooking } from '../services/bookingService';
import TimeSlotPicker from '../components/TimeSlotPicker';
import CustomButton from '../components/CustomButton';
import PaymentMethodSelector from '../components/PaymentMethodSelector';
import {
  formatFirestoreDate,
  generateSlots,
  getBookedHours,
  areSlotsContiguous,
  getStartEndFromHours,
  formatHour,
} from '../utils/dateUtils';

const BookingScreen = ({ route, navigation }) => {
  const { arena } = route.params;
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const today = formatFirestoreDate(new Date());
  const [selectedDate, setSelectedDate] = useState(today);
  const [bookedHours, setBookedHours] = useState(new Set());
  const [selectedHours, setSelectedHours] = useState(new Set());
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [booking, setBooking] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('pay_at_venue');

  const startHour = arena.availability?.startHour || 6;
  const endHour = arena.availability?.endHour || 22;
  const allSlots = generateSlots(startHour, endHour);

  const fetchBookings = useCallback(async () => {
    setLoadingSlots(true);
    setSelectedHours(new Set());
    try {
      const existing = await getArenaBookingsForDate(arena.id, selectedDate);
      setBookedHours(getBookedHours(existing));
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoadingSlots(false);
    }
  }, [selectedDate, arena.id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const onToggleHour = (hour) => {
    setSelectedHours((prev) => {
      const next = new Set(prev);
      if (next.has(hour)) {
        next.delete(hour);
      } else {
        next.add(hour);
        // Validate contiguity
        const testSet = new Set(next);
        if (!areSlotsContiguous([...testSet])) {
          Alert.alert('Select Contiguous Slots', 'Please select consecutive time slots only.');
          return prev;
        }
      }
      return next;
    });
  };

  const totalHours = selectedHours.size;
  const totalPrice = totalHours * (arena.pricePerHour || 0);

  const { startTime, endTime } = selectedHours.size > 0
    ? getStartEndFromHours([...selectedHours])
    : { startTime: null, endTime: null };

  const handleBook = async () => {
    if (selectedHours.size === 0) {
      Alert.alert('No Slots Selected', 'Please select at least one time slot.');
      return;
    }
    setBooking(true);
    try {
      const bookingId = await createBooking({
        userId: user.uid,
        arenaId: arena.id,
        ownerId: arena.ownerId,
        arenaName: arena.name,
        date: selectedDate,
        startTime,
        endTime,
        pricePerHour: arena.pricePerHour,
        paymentMethod,
      });
      Alert.alert(
        '🎉 Booking Confirmed!',
        `Your slot at ${arena.name} on ${selectedDate} from ${formatHour(startTime)} to ${formatHour(endTime)} is confirmed.\n\nTotal: ₹${totalPrice}`,
        [{ text: 'View Bookings', onPress: () => navigation.navigate('Bookings') }, { text: 'OK' }]
      );
      setSelectedHours(new Set());
      fetchBookings();
    } catch (err) {
      Alert.alert('Booking Failed', err.message || 'Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const markedDates = {
    [selectedDate]: {
      selected: true,
      selectedColor: '#00C2FF',
      selectedTextColor: '#fff',
    },
  };

  const calTheme = {
    backgroundColor: 'transparent',
    calendarBackground: 'transparent',
    textSectionTitleColor: colors.textSecondary,
    selectedDayBackgroundColor: colors.primary,
    selectedDayTextColor: '#fff',
    todayTextColor: colors.primary,
    dayTextColor: colors.textPrimary,
    textDisabledColor: colors.textSecondary,
    dotColor: colors.primary,
    arrowColor: colors.primary,
    monthTextColor: colors.textPrimary,
    indicatorColor: colors.primary,
    textDayFontWeight: '600',
    textMonthFontWeight: '700',
    textDayHeaderFontWeight: '600',
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Arena name */}
        <View style={[styles.arenaHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="location" size={18} color={colors.primary} />
          <Text style={[styles.arenaName, { color: colors.textPrimary }]}>{arena.name}</Text>
        </View>

        {/* Calendar */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            <Ionicons name="calendar" size={16} /> Select Date
          </Text>
          <Calendar
            current={selectedDate}
            minDate={today}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={calTheme}
          />
        </View>

        {/* Time Slots */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            <Ionicons name="time" size={16} /> Available Slots — {selectedDate}
          </Text>
          {loadingSlots ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <TimeSlotPicker
              slots={allSlots}
              bookedHours={bookedHours}
              selectedHours={selectedHours}
              onToggleHour={onToggleHour}
            />
          )}
        </View>

        {/* Payment Method */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            💳 Payment Method
          </Text>
          <PaymentMethodSelector selected={paymentMethod} onSelect={setPaymentMethod} />
        </View>
      </ScrollView>

      {/* Summary & Confirm Bar */}
      <View style={[styles.confirmBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          {selectedHours.size > 0 ? (
            <>
              <Text style={[styles.summaryLine, { color: colors.textPrimary }]}>
                {totalHours}h · {formatHour(startTime)} – {formatHour(endTime)}
              </Text>
              <Text style={[styles.summaryPrice, { color: colors.primary }]}>₹{totalPrice}</Text>
            </>
          ) : (
            <Text style={[styles.summaryLine, { color: colors.textSecondary }]}>No slots selected</Text>
          )}
        </View>
        <CustomButton
          title={booking ? 'Confirming...' : 'Confirm Booking'}
          onPress={handleBook}
          loading={booking}
          disabled={selectedHours.size === 0}
          style={styles.confirmBtn}
          size="md"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 100 },
  arenaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  arenaName: { fontSize: 15, fontWeight: '700' },
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14 },
  confirmBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    paddingBottom: 28,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  summaryLine: { fontSize: 13, fontWeight: '600', marginBottom: 2 },
  summaryPrice: { fontSize: 20, fontWeight: '800' },
  confirmBtn: { width: 180 },
});

export default BookingScreen;
