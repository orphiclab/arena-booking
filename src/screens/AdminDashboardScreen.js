// src/screens/AdminDashboardScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';

const StatBlock = ({ icon, label, value, gradient, colors }) => (
  <View style={[styles.statBlock, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <LinearGradient colors={gradient} style={styles.statIcon}>
      <Ionicons name={icon} size={22} color="#fff" />
    </LinearGradient>
    <Text style={[styles.statValue, { color: colors.textPrimary }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{label}</Text>
  </View>
);

const QuickLink = ({ icon, label, onPress, colors }) => (
  <TouchableOpacity
    style={[styles.quickLink, { backgroundColor: colors.card, borderColor: colors.border }]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <Ionicons name={icon} size={22} color={colors.primary} />
    <Text style={[styles.quickLinkText, { color: colors.textPrimary }]}>{label}</Text>
    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
  </TouchableOpacity>
);

const AdminDashboardScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [stats, setStats] = useState({ users: 0, arenas: 0, bookings: 0, events: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [u, a, b, e] = await Promise.all([
          getDocs(collection(db, 'users')),
          getDocs(collection(db, 'arenas')),
          getDocs(collection(db, 'bookings')),
          getDocs(collection(db, 'events')),
        ]);
        setStats({ users: u.size, arenas: a.size, bookings: b.size, events: e.size });
      } catch { } finally { setLoading(false); }
    })();
  }, []);

  const statCards = [
    { icon: 'people', label: 'Users', value: stats.users, gradient: ['#00C2FF', '#0090CC'] },
    { icon: 'business', label: 'Arenas', value: stats.arenas, gradient: ['#8B5CF6', '#6D28D9'] },
    { icon: 'calendar', label: 'Bookings', value: stats.bookings, gradient: ['#F59E0B', '#D97706'] },
    { icon: 'trophy', label: 'Events', value: stats.events, gradient: ['#10B981', '#059669'] },
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} contentContainerStyle={styles.scroll}>
      {/* Header */}
      <LinearGradient colors={['#00C2FF', '#8B5CF6']} style={styles.header}>
        <View style={styles.adminBadge}>
          <Ionicons name="shield-checkmark" size={18} color="#fff" />
          <Text style={styles.adminLabel}>ADMIN PANEL</Text>
        </View>
        <Text style={styles.headerTitle}>Platform Overview</Text>
      </LinearGradient>

      {/* Stats */}
      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
      ) : (
        <View style={styles.statsGrid}>
          {statCards.map((s) => (
            <StatBlock key={s.label} {...s} colors={colors} />
          ))}
        </View>
      )}

      {/* Quick links */}
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Management</Text>
      <QuickLink icon="business-outline" label="Manage Arenas" onPress={() => navigation.navigate('AdminArenas')} colors={colors} />
      <QuickLink icon="people-outline" label="Manage Users" onPress={() => navigation.navigate('AdminUsers')} colors={colors} />
      <QuickLink icon="calendar-outline" label="All Bookings" onPress={() => navigation.navigate('AdminBookings')} colors={colors} />
      <QuickLink icon="trophy-outline" label="Events & Tournaments" onPress={() => navigation.navigate('AdminEvents')} colors={colors} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingBottom: 60 },
  header: { padding: 24, paddingTop: 36, paddingBottom: 28 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  adminLabel: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '700', letterSpacing: 1.5 },
  headerTitle: { color: '#fff', fontSize: 26, fontWeight: '800' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 16 },
  statBlock: { width: '47%', borderRadius: 18, borderWidth: 1, padding: 16, alignItems: 'center' },
  statIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 28, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginHorizontal: 16, marginTop: 8, marginBottom: 10 },
  quickLink: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 10, borderRadius: 16, borderWidth: 1, padding: 16 },
  quickLinkText: { flex: 1, fontSize: 15, fontWeight: '600' },
});

export default AdminDashboardScreen;
