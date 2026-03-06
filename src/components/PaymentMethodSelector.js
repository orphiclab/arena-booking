// src/components/PaymentMethodSelector.js

import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';

const METHODS = [
  {
    id: 'card',
    label: 'Online Payment',
    sublabel: 'Credit / Debit Card via Stripe',
    icon: 'card',
    gradient: ['#8B5CF6', '#6D28D9'],
  },
  {
    id: 'pay_at_venue',
    label: 'Pay at Venue',
    sublabel: 'Pay cash when you arrive',
    icon: 'cash',
    gradient: ['#10B981', '#059669'],
  },
];

const PaymentMethodSelector = ({ selected, onSelect }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <View style={styles.container}>
      {METHODS.map((m) => {
        const isSelected = selected === m.id;
        return (
          <TouchableOpacity
            key={m.id}
            activeOpacity={0.85}
            onPress={() => onSelect(m.id)}
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: isSelected ? m.gradient[0] : colors.border,
                borderWidth: isSelected ? 2 : 1,
              },
            ]}
          >
            <LinearGradient colors={m.gradient} style={styles.iconBox}>
              <Ionicons name={m.icon} size={22} color="#fff" />
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={[styles.label, { color: colors.textPrimary }]}>{m.label}</Text>
              <Text style={[styles.sublabel, { color: colors.textSecondary }]}>{m.sublabel}</Text>
            </View>
            <View
              style={[
                styles.radio,
                {
                  borderColor: isSelected ? m.gradient[0] : colors.border,
                  backgroundColor: isSelected ? m.gradient[0] : 'transparent',
                },
              ]}
            >
              {isSelected && <Ionicons name="checkmark" size={14} color="#fff" />}
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 12 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: { fontSize: 15, fontWeight: '700', marginBottom: 2 },
  sublabel: { fontSize: 12 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PaymentMethodSelector;
