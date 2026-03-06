// src/screens/CourtSelectionScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  Alert, useColorScheme, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';
import { getCourts } from '../services/courtService';
import SportSelector from '../components/SportSelector';
import CourtCard from '../components/CourtCard';
import CustomButton from '../components/CustomButton';

const CourtSelectionScreen = ({ route, navigation }) => {
  const { arena } = route.params;
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const [selectedSport, setSelectedSport] = useState(arena.sports?.[0] || null);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedSport) fetchCourts();
  }, [selectedSport]);

  const fetchCourts = async () => {
    setLoading(true);
    setSelectedCourt(null);
    try {
      const data = await getCourts(arena.id, selectedSport);
      if (data.length === 0) {
        // Fallback: show sample courts if Firestore is empty
        setCourts([
          { id: 'sample1', name: 'Court A', pricePerHour: arena.pricePerHour || 600, openingTime: 6, closingTime: 22 },
          { id: 'sample2', name: 'Court B', pricePerHour: (arena.pricePerHour || 600) + 100, openingTime: 7, closingTime: 21 },
        ]);
      } else {
        setCourts(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleProceed = () => {
    if (!selectedCourt) {
      Alert.alert('Select a Court', 'Please choose a court to continue.');
      return;
    }
    navigation.navigate('Booking', { arena, court: selectedCourt, sport: selectedSport });
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Arena info */}
        <View style={[styles.arenaInfo, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Ionicons name="location" size={16} color={colors.primary} />
          <View>
            <Text style={[styles.arenaName, { color: colors.textPrimary }]}>{arena.name}</Text>
            <Text style={[styles.arenaAddr, { color: colors.textSecondary }]}>{arena.location}</Text>
          </View>
        </View>

        {/* Step 1: Sport */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNum}>1</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Select Sport</Text>
          </View>
          <SportSelector
            sports={arena.sports || []}
            selectedSport={selectedSport}
            onSelect={setSelectedSport}
          />
        </View>

        {/* Step 2: Court */}
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.stepHeader}>
            <View style={[styles.stepBadge, { backgroundColor: colors.primary }]}>
              <Text style={styles.stepNum}>2</Text>
            </View>
            <Text style={[styles.stepTitle, { color: colors.textPrimary }]}>Select Court</Text>
          </View>

          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
          ) : courts.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No courts available for {selectedSport}
            </Text>
          ) : (
            <FlatList
              data={courts}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              scrollEnabled
              renderItem={({ item }) => (
                <CourtCard
                  court={item}
                  isSelected={selectedCourt?.id === item.id}
                  onPress={() => setSelectedCourt(item)}
                />
              )}
            />
          )}
        </View>

        {/* Summary */}
        {selectedCourt && (
          <View style={[styles.summaryBox, { backgroundColor: colors.primary + '18', borderColor: colors.primary }]}>
            <Ionicons name="information-circle" size={18} color={colors.primary} />
            <Text style={[styles.summaryText, { color: colors.textPrimary }]}>
              <Text style={{ fontWeight: '700' }}>{selectedCourt.name}</Text>
              {' '}· {selectedSport} · ₹{selectedCourt.pricePerHour}/hr
            </Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.cta, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
        <CustomButton
          title="Select Date & Time →"
          onPress={handleProceed}
          disabled={!selectedCourt}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { padding: 16 },
  arenaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },
  arenaName: { fontSize: 14, fontWeight: '700' },
  arenaAddr: { fontSize: 12 },
  section: { borderRadius: 18, padding: 16, marginBottom: 14, borderWidth: 1 },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  stepBadge: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  stepNum: { color: '#fff', fontSize: 13, fontWeight: '800' },
  stepTitle: { fontSize: 15, fontWeight: '700' },
  emptyText: { fontSize: 13, textAlign: 'center', paddingVertical: 20 },
  summaryBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    padding: 14,
    marginBottom: 14,
  },
  summaryText: { fontSize: 14 },
  cta: { padding: 20, paddingBottom: 32, borderTopWidth: 1 },
});

export default CourtSelectionScreen;
