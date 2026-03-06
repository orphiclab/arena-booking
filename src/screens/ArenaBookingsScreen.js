// src/screens/ArenaBookingsScreen.js — Owner view of bookings for their arena

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  RefreshControl, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';
import { getArenaBookings } from '../services/bookingService';
import BookingCard from '../components/BookingCard';

const ArenaBookingsScreen = ({ route }) => {
  const { arena } = route.params;
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const data = await getArenaBookings(arena.id);
      setBookings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); setRefreshing(false); }
  }, [arena.id]);

  useEffect(() => { fetch(); }, [fetch]);
  const onRefresh = () => { setRefreshing(true); fetch(); };

  const confirmed = bookings.filter((b) => b.bookingStatus !== 'cancelled').length;
  const revenue = bookings
    .filter((b) => b.bookingStatus !== 'cancelled')
    .reduce((s, b) => s + (b.totalPrice || 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          ListHeaderComponent={
            <View style={styles.header}>
              <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: colors.textPrimary }]}>{bookings.length}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: colors.success }]}>{confirmed}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Active</Text>
                </View>
                <View style={[styles.divider, { backgroundColor: colors.border }]} />
                <View style={styles.summaryItem}>
                  <Text style={[styles.summaryValue, { color: colors.primary }]}>₹{revenue}</Text>
                  <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Revenue</Text>
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={50} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No bookings yet</Text>
            </View>
          }
          renderItem={({ item }) => <BookingCard booking={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 80 },
  header: { marginBottom: 14 },
  summaryCard: {
    flexDirection: 'row', borderRadius: 18, borderWidth: 1, padding: 16,
    justifyContent: 'space-around', alignItems: 'center',
  },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  summaryLabel: { fontSize: 11 },
  divider: { width: 1, height: 36 },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 14, marginTop: 12 },
});

export default ArenaBookingsScreen;
