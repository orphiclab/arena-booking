// src/screens/HomeScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  useColorScheme,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from '../hooks/useLocation';
import { getArenasNearby } from '../services/arenaService';
import ArenaCard from '../components/ArenaCard';

const SPORTS_FILTERS = ['All', 'Football', 'Basketball', 'Cricket', 'Tennis', 'Badminton'];

const HomeScreen = ({ navigation }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const { userProfile } = useAuth();
  const { location, loading: locationLoading } = useLocation();

  const [arenas, setArenas] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [searchText, setSearchText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchArenas = useCallback(async () => {
    try {
      if (location) {
        const data = await getArenasNearby(location.latitude, location.longitude, 50);
        setArenas(data);
        setFiltered(data);
      }
    } catch (err) {
      console.error('Error fetching arenas:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [location]);

  useEffect(() => {
    if (location) fetchArenas();
  }, [location]);

  // Filter / search
  useEffect(() => {
    let result = [...arenas];
    if (activeFilter !== 'All') {
      result = result.filter((a) => a.sports?.includes(activeFilter));
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase();
      result = result.filter(
        (a) => a.name?.toLowerCase().includes(q) || a.location?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [arenas, activeFilter, searchText]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchArenas();
  };

  const mapRegion = location
    ? { latitude: location.latitude, longitude: location.longitude, latitudeDelta: 0.1, longitudeDelta: 0.1 }
    : { latitude: 28.6139, longitude: 77.209, latitudeDelta: 0.2, longitudeDelta: 0.2 };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>
            Welcome back 👋
          </Text>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {userProfile?.name || 'Player'}
          </Text>
        </View>
        <TouchableOpacity style={[styles.notifBtn, { backgroundColor: colors.surface }]}>
          <Ionicons name="notifications-outline" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search-outline" size={18} color={colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.textPrimary }]}
          placeholder="Search arenas, locations..."
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')}>
            <Ionicons name="close-circle" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* View Toggle + Filters */}
      <View style={styles.controlsRow}>
        {/* Sport Filters */}
        <FlatList
          data={SPORTS_FILTERS}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              style={[
                styles.filterChip,
                {
                  backgroundColor: activeFilter === item ? colors.primary : colors.surface,
                  borderColor: activeFilter === item ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  { color: activeFilter === item ? '#fff' : colors.textSecondary },
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* View toggle */}
        <View style={[styles.toggleGroup, { backgroundColor: colors.surface }]}>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={[styles.toggleBtn, viewMode === 'list' && { backgroundColor: colors.primary }]}
          >
            <Ionicons name="list" size={18} color={viewMode === 'list' ? '#fff' : colors.textSecondary} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewMode('map')}
            style={[styles.toggleBtn, viewMode === 'map' && { backgroundColor: colors.primary }]}
          >
            <Ionicons name="map" size={18} color={viewMode === 'map' ? '#fff' : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      {loading || locationLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
            Finding arenas near you...
          </Text>
        </View>
      ) : viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            region={mapRegion}
            showsUserLocation
            showsMyLocationButton
          >
            {filtered.map((arena) => (
              <Marker
                key={arena.id}
                coordinate={{ latitude: arena.latitude, longitude: arena.longitude }}
                title={arena.name}
                description={`₹${arena.pricePerHour}/hr`}
                onCalloutPress={() => navigation.navigate('ArenaDetail', { arena })}
                pinColor="#00C2FF"
              />
            ))}
          </MapView>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListHeaderComponent={
            <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>
              {filtered.length} Arena{filtered.length !== 1 ? 's' : ''} Found
            </Text>
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Ionicons name="search" size={48} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                No arenas found nearby
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <ArenaCard
              arena={item}
              distanceKm={item.distanceKm}
              onPress={() => navigation.navigate('ArenaDetail', { arena: item })}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  greeting: { fontSize: 12, marginBottom: 2 },
  userName: { fontSize: 20, fontWeight: '800' },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },
  searchInput: { flex: 1, fontSize: 14 },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 16,
    marginBottom: 4,
  },
  filterList: { paddingHorizontal: 16, gap: 8 },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterText: { fontSize: 13, fontWeight: '600' },
  toggleGroup: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 8,
  },
  toggleBtn: {
    padding: 8,
    borderRadius: 10,
  },
  list: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 80 },
  sectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, opacity: 0.7 },
  mapContainer: { flex: 1 },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60 },
  loadingText: { marginTop: 12, fontSize: 14 },
  emptyText: { fontSize: 15, marginTop: 12, fontWeight: '500' },
});

export default HomeScreen;
