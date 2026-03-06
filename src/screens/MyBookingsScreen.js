// src/screens/MyBookingsScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { getUserBookings, cancelBooking } from '../services/bookingService';
import { cancelBookingReminder } from '../services/notificationService';
import BookingCard from '../components/BookingCard';

const TABS = ['Upcoming', 'History'];

const MyBookingsScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('Upcoming');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const fetchBookings = useCallback(async () => {
    try {
      const data = await getUserBookings(user.uid);
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user.uid]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const onRefresh = () => { setRefreshing(true); fetchBookings(); };

  const upcoming = bookings.filter(
    (b) => b.date >= today && b.bookingStatus !== 'cancelled' && b.bookingStatus !== 'completed'
  );
  const history = bookings.filter(
    (b) => b.date < today || b.bookingStatus === 'cancelled' || b.bookingStatus === 'completed'
  );
  const displayed = activeTab === 'Upcoming' ? upcoming : history;

  const handleCancel = (bookingId) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? This action cannot be undone.',
      [
        { text: 'Keep Booking', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelBooking(bookingId);
              await cancelBookingReminder(bookingId);
              fetchBookings();
              Alert.alert('Cancelled', 'Your booking has been cancelled.');
            } catch (err) {
              Alert.alert('Error', 'Failed to cancel booking. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Tab Bar */}
      <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && { borderBottomColor: colors.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? colors.primary : colors.textSecondary }]}>
              {tab}
              {tab === 'Upcoming' && upcoming.length > 0 && (
                <Text style={[styles.badge, { color: colors.primary }]}> ({upcoming.length})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={displayed}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name={activeTab === 'Upcoming' ? 'calendar-outline' : 'time-outline'}
                size={52}
                color={colors.textSecondary}
              />
              <Text style={[styles.emptyTitle, { color: colors.textPrimary }]}>
                {activeTab === 'Upcoming' ? 'No Upcoming Bookings' : 'No Booking History'}
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                {activeTab === 'Upcoming' ? 'Book an arena to get started!' : 'Your past bookings will appear here.'}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onCancel={handleCancel}
              onPress={() => navigation.navigate('BookingDetail', { booking: item })}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  tabText: { fontSize: 15, fontWeight: '700' },
  badge: { fontSize: 13 },
  list: { padding: 16, paddingBottom: 80 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 14, textAlign: 'center' },
});

export default MyBookingsScreen;
