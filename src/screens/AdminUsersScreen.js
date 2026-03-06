// src/screens/AdminUsersScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl, useColorScheme, TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getDocs, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { darkColors, lightColors } from '../theme/colors';

const AdminUsersScreen = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetch = useCallback(async () => {
    try {
      const snap = await getDocs(collection(db, 'users'));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setUsers(data);
      setFiltered(data);
    } catch { } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  const onRefresh = () => { setRefreshing(true); fetch(); };

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter((u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)));
  }, [search, users]);

  const handleSuspend = (u) => {
    Alert.alert(`${u.suspended ? 'Reinstate' : 'Suspend'} User`, `${u.suspended ? 'Reinstate' : 'Suspend'} ${u.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Confirm',
        style: 'destructive',
        onPress: async () => {
          await updateDoc(doc(db, 'users', u.id), { suspended: !u.suspended });
          fetch();
        },
      },
    ]);
  };

  const ROLE_COLOR = { customer: colors.primary, owner: colors.warning, admin: colors.accent };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Search */}
      <View style={[styles.searchRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Ionicons name="search" size={16} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search users..."
          placeholderTextColor={colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <Text style={[styles.countText, { color: colors.textSecondary }]}>{filtered.length} users</Text>
          }
          renderItem={({ item: u }) => (
            <View style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.avatar, { backgroundColor: (ROLE_COLOR[u.role] || colors.primary) + '22' }]}>
                <Text style={[styles.avatarText, { color: ROLE_COLOR[u.role] || colors.primary }]}>
                  {(u.name || 'U')[0].toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.userName, { color: colors.textPrimary }]}>{u.name || '—'}</Text>
                <Text style={[styles.userEmail, { color: colors.textSecondary }]} numberOfLines={1}>{u.email}</Text>
                <View style={styles.metaRow}>
                  <View style={[styles.roleBadge, { backgroundColor: (ROLE_COLOR[u.role] || colors.primary) + '22' }]}>
                    <Text style={[styles.roleText, { color: ROLE_COLOR[u.role] || colors.primary }]}>
                      {(u.role || 'customer').toUpperCase()}
                    </Text>
                  </View>
                  {u.suspended && (
                    <View style={[styles.suspendedBadge, { backgroundColor: colors.error + '22' }]}>
                      <Text style={[styles.roleText, { color: colors.error }]}>SUSPENDED</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity onPress={() => handleSuspend(u)}>
                <Ionicons
                  name={u.suspended ? 'checkmark-circle-outline' : 'ban-outline'}
                  size={22}
                  color={u.suspended ? colors.success : colors.warning}
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  searchInput: { flex: 1, fontSize: 14 },
  list: { padding: 16, paddingBottom: 80 },
  countText: { fontSize: 12, marginBottom: 10 },
  userCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, borderWidth: 1, padding: 14, marginBottom: 10 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '800' },
  userName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  userEmail: { fontSize: 12, marginBottom: 6 },
  metaRow: { flexDirection: 'row', gap: 6 },
  roleBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  suspendedBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  roleText: { fontSize: 10, fontWeight: '700' },
});

export default AdminUsersScreen;
