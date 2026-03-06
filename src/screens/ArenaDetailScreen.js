// src/screens/ArenaDetailScreen.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  Linking,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';
import ImageCarousel from '../components/ImageCarousel';
import StarRating from '../components/StarRating';
import CustomButton from '../components/CustomButton';

const SPORT_COLORS = {
  Football: '#10B981', Basketball: '#F59E0B', Tennis: '#8B5CF6',
  Cricket: '#3B82F6', Badminton: '#EC4899', Volleyball: '#F97316',
};

const InfoRow = ({ icon, label, value, colors }) => (
  <View style={styles.infoRow}>
    <View style={[styles.infoIcon, { backgroundColor: colors.surface }]}>
      <Ionicons name={icon} size={18} color={colors.primary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.textPrimary }]}>{value}</Text>
    </View>
  </View>
);

const ArenaDetailScreen = ({ route, navigation }) => {
  const { arena } = route.params;
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const handleOpenMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${arena.latitude},${arena.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Carousel */}
        <ImageCarousel images={arena.images || []} height={300} />

        {/* Header info */}
        <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.titleRow}>
            <Text style={[styles.arenaName, { color: colors.textPrimary }]}>{arena.name}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.priceText}>₹{arena.pricePerHour}</Text>
              <Text style={styles.priceUnit}>/hr</Text>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <StarRating rating={arena.rating || 0} size={16} showCount count={arena.ratingCount} />
            {arena.distanceKm && (
              <View style={styles.distanceBadge}>
                <Ionicons name="navigate" size={12} color={colors.primary} />
                <Text style={[styles.distanceText, { color: colors.primary }]}>
                  {arena.distanceKm.toFixed(1)} km away
                </Text>
              </View>
            )}
          </View>

          {/* Sports tags */}
          <View style={styles.sportsRow}>
            {(arena.sports || []).map((sport) => (
              <View
                key={sport}
                style={[styles.sportChip, { backgroundColor: (SPORT_COLORS[sport] || '#6B7280') + '22' }]}
              >
                <Text style={[styles.sportChipText, { color: SPORT_COLORS[sport] || '#6B7280' }]}>
                  {sport}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Details */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Arena Details</Text>

          <InfoRow icon="location" label="Location" value={arena.location || 'N/A'} colors={colors} />
          <InfoRow
            icon="time"
            label="Opening Hours"
            value={`${arena.availability?.startHour || 6}:00 AM – ${arena.availability?.endHour || 22}:00 PM`}
            colors={colors}
          />
          <InfoRow icon="cash" label="Price" value={`₹${arena.pricePerHour} per hour`} colors={colors} />
        </View>

        {/* Mini Map */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.mapHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>Location</Text>
            <TouchableOpacity onPress={handleOpenMaps} style={styles.directionsBtn}>
              <Ionicons name="navigate" size={14} color={colors.primary} />
              <Text style={[styles.directionsText, { color: colors.primary }]}>Directions</Text>
            </TouchableOpacity>
          </View>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.miniMap}
            region={{
              latitude: arena.latitude || 28.6139,
              longitude: arena.longitude || 77.209,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            pointerEvents="none"
          >
            <Marker
              coordinate={{ latitude: arena.latitude || 28.6139, longitude: arena.longitude || 77.209 }}
              title={arena.name}
              pinColor="#00C2FF"
            />
          </MapView>
        </View>

        {/* Spacer for bottom button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Book Now CTA */}
      <View style={[styles.ctaBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <View>
          <Text style={[styles.ctaPrice, { color: colors.textPrimary }]}>
            ₹{arena.pricePerHour}
          </Text>
          <Text style={[styles.ctaUnit, { color: colors.textSecondary }]}>per hour</Text>
        </View>
        <CustomButton
          title="Book Now"
          onPress={() => navigation.navigate('Booking', { arena })}
          style={styles.bookBtn}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    margin: 16,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  arenaName: { fontSize: 22, fontWeight: '800', flex: 1, marginRight: 12 },
  priceTag: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#00C2FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priceText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  priceUnit: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginLeft: 2 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  distanceBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  distanceText: { fontSize: 12, fontWeight: '600' },
  sportsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportChip: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 5 },
  sportChipText: { fontSize: 12, fontWeight: '600' },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  infoIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontSize: 11, fontWeight: '600', marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoValue: { fontSize: 14, fontWeight: '500' },
  mapHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  directionsBtn: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  directionsText: { fontSize: 13, fontWeight: '600' },
  miniMap: { width: '100%', height: 160, borderRadius: 12, overflow: 'hidden' },
  ctaBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    paddingBottom: 32,
  },
  ctaPrice: { fontSize: 22, fontWeight: '800' },
  ctaUnit: { fontSize: 12 },
  bookBtn: { flex: 0, width: 180 },
});

export default ArenaDetailScreen;
