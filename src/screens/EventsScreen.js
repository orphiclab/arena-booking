// src/screens/EventsScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator,
  RefreshControl, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';
import { getUpcomingEvents } from '../services/eventService';
import EventCard from '../components/EventCard';

const SAMPLE_EVENTS = [
  {
    id: 'ev1', title: 'City Badminton Championship 2026', description: 'Inter-city badminton tournament open to all skill levels. Register now!',
    eventDate: '2026-03-20', arenaName: 'Champions Arena', image: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=800',
  },
  {
    id: 'ev2', title: 'Weekend Football League – Season 3', description: 'Join the most competitive 5-a-side football league in town.',
    eventDate: '2026-03-25', arenaName: 'Pro Sports Hub', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
  },
  {
    id: 'ev3', title: 'Cricket Premier Cup', description: 'T20 format tournament. Teams of 11. Prize pool: ₹50,000.',
    eventDate: '2026-04-05', arenaName: 'Elite Cricket Ground', image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=800',
  },
];

const EventsScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = useCallback(async () => {
    try {
      const data = await getUpcomingEvents();
      setEvents(data.length > 0 ? data : SAMPLE_EVENTS);
    } catch {
      setEvents(SAMPLE_EVENTS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);
  const onRefresh = () => { setRefreshing(true); fetchEvents(); };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Banner */}
      <LinearGradient colors={['#00C2FF', '#8B5CF6']} style={styles.banner}>
        <Ionicons name="trophy" size={32} color="#fff" />
        <Text style={styles.bannerTitle}>Events & Tournaments</Text>
        <Text style={styles.bannerSub}>Join competitions near you</Text>
      </LinearGradient>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListEmptyComponent={
            <View style={styles.center}>
              <Ionicons name="calendar-outline" size={52} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No upcoming events</Text>
            </View>
          }
          renderItem={({ item }) => (
            <EventCard event={item} onPress={() => navigation.navigate('EventDetail', { event: item })} />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    padding: 24,
    paddingTop: 32,
    paddingBottom: 28,
    alignItems: 'center',
    gap: 6,
  },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },
  list: { padding: 16, paddingBottom: 80 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  emptyText: { fontSize: 15, marginTop: 12 },
});

export default EventsScreen;
