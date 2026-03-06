// src/components/SportSelector.js

import React from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

const SPORT_ICONS = {
  Football: 'football',
  Basketball: 'basketball',
  Tennis: 'tennisball',
  Cricket: 'baseball',
  Badminton: 'tennisball-outline',
  Volleyball: 'ellipse',
  Swimming: 'water',
  Table_Tennis: 'disc',
  Squash: 'radio-button-on',
};

const SPORT_COLORS = {
  Football: '#10B981',
  Basketball: '#F59E0B',
  Tennis: '#8B5CF6',
  Cricket: '#3B82F6',
  Badminton: '#EC4899',
  Volleyball: '#F97316',
  Swimming: '#06B6D4',
};

const SportSelector = ({ sports = [], selectedSport, onSelect }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <FlatList
      data={sports}
      keyExtractor={(item) => item}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => {
        const isSelected = item === selectedSport;
        const accent = SPORT_COLORS[item] || colors.primary;
        return (
          <TouchableOpacity
            onPress={() => onSelect(item)}
            activeOpacity={0.82}
            style={[
              styles.chip,
              {
                backgroundColor: isSelected ? accent : colors.surface,
                borderColor: isSelected ? accent : colors.border,
              },
            ]}
          >
            <Ionicons
              name={SPORT_ICONS[item] || 'fitness'}
              size={18}
              color={isSelected ? '#fff' : accent}
            />
            <Text style={[styles.label, { color: isSelected ? '#fff' : colors.textPrimary }]}>
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
};

const styles = StyleSheet.create({
  list: { paddingHorizontal: 2, gap: 10, paddingVertical: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    borderRadius: 14,
    borderWidth: 1.5,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  label: { fontSize: 13, fontWeight: '700' },
});

export default SportSelector;
