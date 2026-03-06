// src/screens/AdminArenasScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { darkColors, lightColors } from '../theme/colors';

const AdminArenasScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [arenas, setArenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, 'arenas'));
      setArenas(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch { } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  const onRefresh = () => { setRefreshing(true); fetch(); };

  const handleDelete = (arena) => {
    Alert.alert('Delete Arena', `Delete "${arena.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteDoc(doc(db, 'arenas', arena.id)); fetch(); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={arenas}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={<Text style={[styles.count, { color: colors.textSecondary }]}>{arenas.length} arenas on platform</Text>}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="business-outline" size={50} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No arenas yet</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.arenaName, { color: colors.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.addr, { color: colors.textSecondary }]} numberOfLines={1}>{item.location}</Text>
                  <Text style={[styles.meta, { color: colors.textSecondary }]}>
                    Sports: {(item.sports || []).join(', ') || '—'} · ₹{item.pricePerHour}/hr
                  </Text>
                  <Text style={[styles.ownerId, { color: colors.textSecondary }]} numberOfLines={1}>Owner: {item.ownerId || 'admin'}</Text>
                </View>
                <TouchableOpacity onPress={() => handleDelete(item)} style={[styles.deleteBtn, { backgroundColor: colors.error + '18' }]}>
                  <Ionicons name="trash-outline" size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 80 },
  count: { fontSize: 12, marginBottom: 10 },
  card: { borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 10 },
  cardTop: { flexDirection: 'row', gap: 12 },
  arenaName: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  addr: { fontSize: 12, marginBottom: 4 },
  meta: { fontSize: 11, marginBottom: 4 },
  ownerId: { fontSize: 10 },
  deleteBtn: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', alignSelf: 'flex-start' },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 14, marginTop: 12 },
});

export default AdminArenasScreen;
