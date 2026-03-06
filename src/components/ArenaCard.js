// src/components/ArenaCard.js

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';
import StarRating from './StarRating';

const SPORT_COLORS = {
  Football: '#10B981',
  Basketball: '#F59E0B',
  Tennis: '#8B5CF6',
  Cricket: '#3B82F6',
  Badminton: '#EC4899',
  Volleyball: '#F97316',
  Swimming: '#06B6D4',
};

const ArenaCard = ({ arena, onPress, distanceKm, style }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const imageUri = arena.images?.[0] ||
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800';

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      {/* Image */}
      <Image
        source={{ uri: imageUri }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Price Badge */}
      <View style={styles.priceBadge}>
        <Text style={styles.priceText}>₹{arena.pricePerHour}/hr</Text>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
          {arena.name}
        </Text>

        <View style={styles.row}>
          <Ionicons name="location-outline" size={13} color={colors.textSecondary} />
          <Text style={[styles.location, { color: colors.textSecondary }]} numberOfLines={1}>
            {arena.location}
          </Text>
          {distanceKm !== undefined && (
            <Text style={[styles.distance, { color: colors.primary }]}>
              {' · '}{distanceKm.toFixed(1)} km
            </Text>
          )}
        </View>

        <View style={styles.bottomRow}>
          <StarRating rating={arena.rating || 0} size={13} showCount count={arena.ratingCount} />
          <View style={styles.sportsRow}>
            {(arena.sports || []).slice(0, 3).map((sport) => (
              <View
                key={sport}
                style={[
                  styles.sportTag,
                  { backgroundColor: (SPORT_COLORS[sport] || '#6B7280') + '22' },
                ]}
              >
                <Text
                  style={[
                    styles.sportText,
                    { color: SPORT_COLORS[sport] || '#6B7280' },
                  ]}
                >
                  {sport}
                </Text>
              </View>
            ))}
          </View>
        </View>
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 160,
  },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#00C2FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  priceText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  content: {
    padding: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  location: {
    fontSize: 12,
    marginLeft: 3,
    flex: 1,
  },
  distance: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sportsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  sportTag: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sportText: {
    fontSize: 10,
    fontWeight: '600',
  },
});

export default ArenaCard;
