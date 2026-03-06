// src/screens/OwnerDashboardScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, RefreshControl, useColorScheme, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { getOwnerArenas, deleteArena } from '../services/arenaService';
import { getArenaBookings } from '../services/bookingService';

const StatCard = ({ icon, label, value, gradient, colors }) => (
  <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <LinearGradient colors={gradient} style={styles.statIcon}>
      <Ionicons name={icon} size={20} color="#fff" />
    </LinearGradient>
    <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
  </View>
);

const ArenaItem = ({ arena, onEdit, onDelete, onViewBookings, colors }) => (
  <View style={[styles.arenaItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <View style={styles.arenaItemTop}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.arenaItemName, { color: colors.textPrimary }]}>{arena.name}</Text>
        <Text style={[styles.arenaItemAddr, { color: colors.textSecondary }]} numberOfLines={1}>{arena.location}</Text>
        <View style={styles.sportTagRow}>
          {(arena.sports || []).slice(0, 3).map((s) => (
            <View key={s} style={[styles.sportTag, { backgroundColor: colors.surface }]}>
              <Text style={[styles.sportTagText, { color: colors.textSecondary }]}>{s}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={[styles.priceBadge, { backgroundColor: colors.primary + '22' }]}>
        <Text style={[styles.priceText, { color: colors.primary }]}>₹{arena.pricePerHour}/hr</Text>
      </View>
    </View>
    <View style={[styles.arenaActions, { borderTopColor: colors.border }]}>
      <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.primary }]} onPress={() => onViewBookings(arena)}>
        <Ionicons name="calendar-outline" size={14} color={colors.primary} />
        <Text style={[styles.actionText, { color: colors.primary }]}>Bookings</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.success }]} onPress={() => onEdit(arena)}>
        <Ionicons name="pencil-outline" size={14} color={colors.success} />
        <Text style={[styles.actionText, { color: colors.success }]}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionBtn, { borderColor: colors.error }]} onPress={() => onDelete(arena)}>
        <Ionicons name="trash-outline" size={14} color={colors.error} />
        <Text style={[styles.actionText, { color: colors.error }]}>Delete</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const OwnerDashboardScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const { user, userProfile } = useAuth();
  const [arenas, setArenas] = useState([]);
  const [totalBookings, setTotalBookings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getOwnerArenas(user.uid);
      setArenas(data);
      let count = 0;
      for (const a of data) {
        const b = await getArenaBookings(a.id);
        count += b.filter((bk) => bk.bookingStatus !== 'cancelled').length;
      }
      setTotalBookings(count);
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  }, [user.uid]);

  useEffect(() => { fetchData(); }, [fetchData]);
  const onRefresh = () => { setRefreshing(true); fetchData(); };

  const handleDelete = (arena) => {
    Alert.alert('Delete Arena', `Delete "${arena.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteArena(arena.id); fetchData(); } },
    ]);
  };

  const estimatedRevenue = arenas.reduce((sum, a) => sum + (a.pricePerHour || 0), 0) * totalBookings;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={arenas}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <>
            {/* Welcome */}
            <View style={[styles.welcomeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.hello, { color: colors.textSecondary }]}>Welcome back 👋</Text>
              <Text style={[styles.ownerName, { color: colors.textPrimary }]}>{userProfile?.name}</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsRow}>
              <StatCard icon="business" label="Arenas" value={arenas.length} gradient={['#00C2FF', '#0090CC']} colors={colors} />
              <StatCard icon="calendar" label="Bookings" value={totalBookings} gradient={['#8B5CF6', '#6D28D9']} colors={colors} />
              <StatCard icon="cash" label="Est. Revenue" value={`₹${(estimatedRevenue / 1000).toFixed(0)}k`} gradient={['#10B981', '#059669']} colors={colors} />
            </View>

            {/* Add arena btn */}
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              onPress={() => navigation.navigate('AddArena')}
              activeOpacity={0.85}
            >
              <Ionicons name="add-circle" size={20} color="#fff" />
              <Text style={styles.addBtnText}>Add New Arena</Text>
            </TouchableOpacity>

            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>My Arenas</Text>
          </>
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyBox}>
              <Ionicons name="business-outline" size={50} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No arenas yet. Add your first!</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <ArenaItem
            arena={item}
            colors={colors}
            onEdit={(a) => navigation.navigate('EditArena', { arena: a })}
            onDelete={handleDelete}
            onViewBookings={(a) => navigation.navigate('ArenaBookings', { arena: a })}
          />
        )}
        contentContainerStyle={styles.list}
      />
      {loading && <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 80 },
  welcomeCard: { borderRadius: 18, padding: 16, borderWidth: 1, marginBottom: 14 },
  hello: { fontSize: 12, marginBottom: 2 },
  ownerName: { fontSize: 20, fontWeight: '800' },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 16, padding: 14, alignItems: 'center', borderWidth: 1 },
  statIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 11 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, padding: 14, marginBottom: 18 },
  addBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  arenaItem: { borderRadius: 18, borderWidth: 1, marginBottom: 14, overflow: 'hidden' },
  arenaItemTop: { flexDirection: 'row', padding: 14, gap: 12 },
  arenaItemName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  arenaItemAddr: { fontSize: 12, marginBottom: 8 },
  sportTagRow: { flexDirection: 'row', gap: 6 },
  sportTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  sportTagText: { fontSize: 10, fontWeight: '600' },
  priceBadge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6, alignSelf: 'flex-start' },
  priceText: { fontSize: 13, fontWeight: '700' },
  arenaActions: { flexDirection: 'row', borderTopWidth: 1, padding: 10, gap: 8 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, borderWidth: 1, borderRadius: 10, paddingVertical: 8 },
  actionText: { fontSize: 12, fontWeight: '700' },
  emptyBox: { alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 14, marginTop: 12 },
});

export default OwnerDashboardScreen;
