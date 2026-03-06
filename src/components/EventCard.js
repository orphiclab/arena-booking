// src/components/EventCard.js

import React from 'react';
import {
  View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';

const EventCard = ({ event, onPress }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const formattedDate = event.eventDate
    ? new Date(event.eventDate).toLocaleDateString('en-IN', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })
    : 'TBD';

  const daysLeft = event.eventDate
    ? Math.max(0, Math.ceil((new Date(event.eventDate) - new Date()) / (1000 * 60 * 60 * 24)))
    : null;

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Banner image */}
      <View style={styles.imageContainer}>
        {event.image ? (
          <Image source={{ uri: event.image }} style={styles.image} resizeMode="cover" />
        ) : (
          <LinearGradient colors={['#00C2FF', '#8B5CF6']} style={styles.image}>
            <Ionicons name="trophy" size={45} color="rgba(255,255,255,0.7)" />
          </LinearGradient>
        )}
        {daysLeft !== null && daysLeft <= 7 && (
          <View style={styles.urgencyBadge}>
            <Text style={styles.urgencyText}>
              {daysLeft === 0 ? 'Today!' : `${daysLeft}d left`}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={2}>
          {event.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={13} color={colors.primary} />
            <Text style={[styles.metaText, { color: colors.textSecondary }]}>{formattedDate}</Text>
          </View>
          {event.arenaName && (
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={13} color={colors.primary} />
              <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>
                {event.arenaName}
              </Text>
            </View>
          )}
        </View>

        {event.description ? (
          <Text style={[styles.desc, { color: colors.textSecondary }]} numberOfLines={2}>
            {event.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: { position: 'relative' },
  image: { width: '100%', height: 150, justifyContent: 'center', alignItems: 'center' },
  urgencyBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  urgencyText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  content: { padding: 14 },
  title: { fontSize: 16, fontWeight: '700', marginBottom: 8 },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12 },
  desc: { fontSize: 13, lineHeight: 18 },
});

export default EventCard;
