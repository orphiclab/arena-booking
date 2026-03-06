// src/screens/EventDetailScreen.js

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image,
  TouchableOpacity, Linking, Alert, useColorScheme,
  Dimensions, Share,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');
const HERO_H = 260;

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=900';

const MetaRow = ({ icon, text, colors, accent = colors.primary }) => (
  <View style={styles.metaRow}>
    <View style={[styles.metaIconBox, { backgroundColor: accent + '18' }]}>
      <Ionicons name={icon} size={16} color={accent} />
    </View>
    <Text style={[styles.metaText, { color: colors.textPrimary }]}>{text}</Text>
  </View>
);

const EventDetailScreen = ({ route, navigation }) => {
  const { event } = route.params;
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const [imageError, setImageError] = useState(false);
  const [registered, setRegistered] = useState(false);

  // Format the event date nicely
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  // Days until event
  const daysUntil = () => {
    if (!event.eventDate) return null;
    const diff = Math.ceil((new Date(event.eventDate) - new Date()) / 86400000);
    if (diff < 0) return null;
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    return `In ${diff} days`;
  };
  const urgency = daysUntil();

  const handleRegister = () => {
    if (registered) return;
    Alert.alert(
      '🎉 Interest Registered!',
      `You've expressed interest in "${event.title}". The arena will contact you with registration details.`,
      [{ text: 'Awesome!', onPress: () => setRegistered(true) }]
    );
    setRegistered(true);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏆 ${event.title}\n📅 ${formatDate(event.eventDate)}\n🏟️ ${event.arenaName || 'Sports Arena'}\n\n${event.description || ''}`,
      });
    } catch {}
  };

  const handleDirections = () => {
    if (event.arenaAddress) {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.arenaAddress)}`);
    } else {
      Alert.alert('Coming Soon', 'Arena location details will be available soon.');
    }
  };

  const imageUri = (!imageError && event.image) ? event.image : FALLBACK_IMAGE;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Hero Image */}
        <View style={[styles.heroWrapper, { height: HERO_H }]}>
          <Image
            source={{ uri: imageUri }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.75)']}
            style={styles.heroGradient}
          />

          {/* Back button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
            activeOpacity={0.85}
          >
            <Ionicons name="chevron-back" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Share button */}
          <TouchableOpacity style={styles.shareHeroBtn} onPress={handleShare} activeOpacity={0.85}>
            <Ionicons name="share-social-outline" size={20} color="#fff" />
          </TouchableOpacity>

          {/* Urgency badge */}
          {urgency && (
            <View style={styles.urgencyBadge}>
              <Text style={styles.urgencyText}>{urgency}</Text>
            </View>
          )}

          {/* Hero title */}
          <View style={styles.heroInfo}>
            <Text style={styles.heroTitle} numberOfLines={2}>{event.title}</Text>
            {event.arenaName && (
              <View style={styles.heroLocation}>
                <Ionicons name="location" size={13} color="rgba(255,255,255,0.8)" />
                <Text style={styles.heroLocationText}>{event.arenaName}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Meta info */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <MetaRow
            icon="calendar-outline"
            text={formatDate(event.eventDate)}
            colors={colors}
            accent={colors.primary}
          />
          {event.arenaName && (
            <MetaRow
              icon="business-outline"
              text={event.arenaName}
              colors={colors}
              accent="#8B5CF6"
            />
          )}
          {event.sport && (
            <MetaRow
              icon="trophy-outline"
              text={event.sport}
              colors={colors}
              accent="#F59E0B"
            />
          )}
          {event.entryFee !== undefined && (
            <MetaRow
              icon="ticket-outline"
              text={event.entryFee > 0 ? `Entry Fee: ₹${event.entryFee}` : 'Free Entry'}
              colors={colors}
              accent="#22C55E"
            />
          )}
        </View>

        {/* Description */}
        {event.description && (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>About this Event</Text>
            <Text style={[styles.description, { color: colors.textSecondary }]}>{event.description}</Text>
          </View>
        )}

        {/* Action buttons */}
        <View style={styles.actionsRow}>
          {/* Directions */}
          <TouchableOpacity
            style={[styles.dirBtn, { borderColor: colors.primary, backgroundColor: colors.card }]}
            onPress={handleDirections}
            activeOpacity={0.8}
          >
            <Ionicons name="navigate-outline" size={18} color={colors.primary} />
            <Text style={[styles.dirBtnText, { color: colors.primary }]}>Directions</Text>
          </TouchableOpacity>

          {/* Register */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={handleRegister}
            style={{ flex: 1 }}
          >
            <LinearGradient
              colors={registered ? ['#6B7280', '#4B5563'] : ['#00C2FF', '#8B5CF6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.registerBtn}
            >
              <Ionicons
                name={registered ? 'checkmark-circle' : 'person-add-outline'}
                size={18}
                color="#fff"
              />
              <Text style={styles.registerBtnText}>
                {registered ? 'Interest Registered' : 'Register Interest'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingBottom: 32 },

  heroWrapper: {
    width: SCREEN_W,
    position: 'relative',
    marginBottom: 16,
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backBtn: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareHeroBtn: {
    position: 'absolute',
    top: 48,
    right: 16,
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  urgencyBadge: {
    position: 'absolute',
    top: 52,
    left: '50%',
    transform: [{ translateX: -40 }],
    backgroundColor: '#FF6B35',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  urgencyText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  heroInfo: {
    position: 'absolute',
    bottom: 0,
    left: 16,
    right: 16,
    paddingBottom: 20,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 28,
    marginBottom: 6,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  heroLocation: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  heroLocationText: { color: 'rgba(255,255,255,0.8)', fontSize: 13 },

  card: {
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', marginBottom: 10 },
  description: { fontSize: 14, lineHeight: 22 },

  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  metaIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  metaText: { fontSize: 14, fontWeight: '600', flex: 1 },

  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 4,
  },
  dirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dirBtnText: { fontSize: 13, fontWeight: '700' },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  registerBtnText: { color: '#fff', fontSize: 14, fontWeight: '800' },
});

export default EventDetailScreen;
