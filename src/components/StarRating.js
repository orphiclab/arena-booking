// src/components/StarRating.js

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const StarRating = ({ rating = 0, size = 14, showCount = false, count = 0, color = '#F59E0B' }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.4;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <View style={styles.container}>
      {Array.from({ length: fullStars }).map((_, i) => (
        <Ionicons key={`full_${i}`} name="star" size={size} color={color} />
      ))}
      {hasHalf && <Ionicons name="star-half" size={size} color={color} />}
      {Array.from({ length: emptyStars }).map((_, i) => (
        <Ionicons key={`empty_${i}`} name="star-outline" size={size} color={color} />
      ))}
      {showCount && count > 0 && (
        <Text style={[styles.count, { fontSize: size - 2 }]}>
          {' '}({count})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  count: {
    color: '#8A97B8',
    fontWeight: '500',
  },
});

export default StarRating;
