// src/components/TimeSlotPicker.js

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  useColorScheme,
} from 'react-native';
import { darkColors, lightColors } from '../theme/colors';
import { formatHour } from '../utils/dateUtils';

const TimeSlotPicker = ({
  slots,          // array of {start, end, id, label}
  bookedHours,   // Set of booked hour numbers
  selectedHours, // Set of selected hour numbers
  onToggleHour,  // (hour: number) => void
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const getSlotStyle = (hour) => {
    if (bookedHours.has(hour)) return 'booked';
    if (selectedHours.has(hour)) return 'selected';
    return 'available';
  };

  const renderSlot = ({ item }) => {
    const state = getSlotStyle(item.start);
    const isBooked = state === 'booked';
    const isSelected = state === 'selected';

    return (
      <TouchableOpacity
        onPress={() => !isBooked && onToggleHour(item.start)}
        disabled={isBooked}
        activeOpacity={0.75}
        style={[
          styles.slot,
          {
            backgroundColor: isBooked
              ? colors.surface
              : isSelected
                ? colors.primary
                : colors.surface,
            borderColor: isBooked
              ? colors.border
              : isSelected
                ? colors.primary
                : colors.border,
          },
        ]}
      >
        <Text
          style={[
            styles.slotTime,
            {
              color: isBooked
                ? colors.textSecondary
                : isSelected
                  ? '#fff'
                  : colors.textPrimary,
            },
          ]}
        >
          {formatHour(item.start)}
        </Text>
        <Text
          style={[
            styles.slotStatus,
            {
              color: isBooked
                ? colors.error
                : isSelected
                  ? 'rgba(255,255,255,0.8)'
                  : colors.success,
            },
          ]}
        >
          {isBooked ? 'Booked' : isSelected ? 'Selected' : 'Free'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={slots}
        keyExtractor={(item) => item.id}
        renderItem={renderSlot}
        numColumns={3}
        columnWrapperStyle={styles.row}
        scrollEnabled={false}
      />
      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.success }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Selected</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: colors.error }]} />
          <Text style={[styles.legendText, { color: colors.textSecondary }]}>Booked</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  slot: {
    flex: 1,
    maxWidth: '30%',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 12,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  slotTime: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 2,
  },
  slotStatus: {
    fontSize: 10,
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
  },
});

export default TimeSlotPicker;
