// src/screens/AdminBookingsScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  RefreshControl, useColorScheme, TextInput, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDocs, collection, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { darkColors, lightColors } from '../theme/colors';
import { formatHour } from '../utils/dateUtils';

const STATUS_COLOR = {
  confirmed: '#22C55E', pending: '#F59E0B', cancelled: '#EF4444', completed: '#8A97B8',
};

const AdminBookingsScreen = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [bookings, setBookings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetch = useCallback(async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setBookings(data);
    } catch { } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  const onRefresh = () => { setRefreshing(true); fetch(); };

  useEffect(() => {
    let result = bookings;
    if (statusFilter !== 'all') result = result.filter((b) => b.bookingStatus === statusFilter);
    const q = search.toLowerCase();
    if (q) result = result.filter((b) => b.arenaName?.toLowerCase().includes(q) || b.userId?.toLowerCase().includes(q));
    setFiltered(result);
  }, [bookings, statusFilter, search]);

  const markComplete = async (bookingId) => {
    await updateDoc(doc(db, 'bookings', bookingId), { bookingStatus: 'completed' });
    fetch();
  };

  const FILTERS = ['all', 'confirmed', 'pending', 'cancelled', 'completed'];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="search" size={16} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search arena or user..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      {/* Status filter chips */}
      <FlatList
        data={FILTERS}
        keyExtractor={(item) => item}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setStatusFilter(item)}
            style={[styles.chip, { backgroundColor: statusFilter === item ? colors.primary : colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.chipText, { color: statusFilter === item ? '#fff' : colors.textSecondary }]}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<Text style={[styles.count, { color: colors.textSecondary }]}>{filtered.length} bookings</Text>}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.textSecondary }]}>No bookings match your filters</Text>
          }
          renderItem={({ item }) => {
            const statusColor = STATUS_COLOR[item.bookingStatus] || colors.textSecondary;
            return (
              <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.stripe, { backgroundColor: statusColor }]} />
                <View style={styles.body}>
                  <View style={styles.topRow}>
                    <Text style={[styles.arenaName, { color: colors.textPrimary }]} numberOfLines={1}>{item.arenaName || '—'}</Text>
                    <View style={[styles.statusPill, { backgroundColor: statusColor + '22' }]}>
                      <Text style={[styles.statusText, { color: statusColor }]}>{item.bookingStatus}</Text>
                    </View>
                  </View>
                  <Text style={[styles.detail, { color: colors.textSecondary }]}>
                    {item.date} · {formatHour(item.startTime)}–{formatHour(item.endTime)} · ₹{item.totalPrice}
                  </Text>
                  <Text style={[styles.userId, { color: colors.textSecondary }]} numberOfLines={1}>UID: {item.userId}</Text>
                  {item.bookingStatus === 'confirmed' && (
                    <TouchableOpacity onPress={() => markComplete(item.id)} style={[styles.markBtn, { borderColor: colors.success }]}>
                      <Text style={[styles.markBtnText, { color: colors.success }]}>Mark Completed</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  chips: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  chip: { borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 6 },
  chipText: { fontSize: 12, fontWeight: '700' },
  list: { padding: 16, paddingBottom: 80 },
  count: { fontSize: 12, marginBottom: 10 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  row: { flexDirection: 'row', borderRadius: 16, borderWidth: 1, marginBottom: 10, overflow: 'hidden' },
  stripe: { width: 5 },
  body: { flex: 1, padding: 12 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  arenaName: { fontSize: 14, fontWeight: '700', flex: 1, marginRight: 8 },
  statusPill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '700' },
  detail: { fontSize: 12, marginBottom: 2 },
  userId: { fontSize: 10, marginBottom: 8 },
  markBtn: { alignSelf: 'flex-start', borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  markBtnText: { fontSize: 12, fontWeight: '700' },
});

export default AdminBookingsScreen;
