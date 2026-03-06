// src/components/CourtCard.js

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';
import { formatHour } from '../utils/dateUtils';

const CourtCard = ({ court, onPress, isSelected = false }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.card,
        {
          backgroundColor: isSelected ? colors.primary + '18' : colors.card,
          borderColor: isSelected ? colors.primary : colors.border,
        },
      ]}
    >
      {isSelected && (
        <View style={styles.checkBadge}>
          <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
        </View>
      )}

      <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
        <Ionicons name="tennisball-outline" size={24} color={colors.primary} />
      </View>

      <Text style={[styles.name, { color: colors.textPrimary }]} numberOfLines={1}>
        {court.name}
      </Text>
      <Text style={[styles.price, { color: colors.primary }]}>
        ₹{court.pricePerHour}
        <Text style={[styles.priceUnit, { color: colors.textSecondary }]}>/hr</Text>
      </Text>

      <View style={styles.hours}>
        <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
        <Text style={[styles.hoursText, { color: colors.textSecondary }]}>
          {formatHour(court.openingTime || 6)} – {formatHour(court.closingTime || 22)}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    width: 130,
    marginRight: 12,
    position: 'relative',
  },
  checkBadge: { position: 'absolute', top: 8, right: 8 },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  name: { fontSize: 13, fontWeight: '700', marginBottom: 4, textAlign: 'center' },
  price: { fontSize: 16, fontWeight: '800', marginBottom: 6 },
  priceUnit: { fontSize: 11, fontWeight: '400' },
  hours: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  hoursText: { fontSize: 10, fontWeight: '500' },
});

export default CourtCard;
