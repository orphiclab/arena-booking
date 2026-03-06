// src/screens/AddEditArenaScreen.js

import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, Image, ActivityIndicator, useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { darkColors, lightColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { createArena, updateArena } from '../services/arenaService';
import { uploadArenaImage } from '../services/storageService';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const ALL_SPORTS = ['Football', 'Basketball', 'Cricket', 'Tennis', 'Badminton', 'Volleyball', 'Swimming'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AddEditArenaScreen = ({ route, navigation }) => {
  const editing = !!route.params?.arena;
  const existingArena = route.params?.arena;
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: existingArena?.name || '',
    location: existingArena?.location || '',
    latitude: existingArena?.latitude?.toString() || '',
    longitude: existingArena?.longitude?.toString() || '',
    pricePerHour: existingArena?.pricePerHour?.toString() || '',
    description: existingArena?.description || '',
    sports: existingArena?.sports || [],
    availability: existingArena?.availability || { startHour: 6, endHour: 22, days: [1, 2, 3, 4, 5, 6] },
  });
  const [images, setImages] = useState(existingArena?.images || []);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleSport = (sport) => {
    setForm((f) => ({
      ...f,
      sports: f.sports.includes(sport) ? f.sports.filter((s) => s !== sport) : [...f.sports, sport],
    }));
  };

  const toggleDay = (dayIdx) => {
    const days = form.availability.days;
    const updated = days.includes(dayIdx) ? days.filter((d) => d !== dayIdx) : [...days, dayIdx];
    setForm((f) => ({ ...f, availability: { ...f.availability, days: updated } }));
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const newImages = [...images];
      for (const asset of result.assets) { newImages.push(asset.uri); }
      setImages(newImages);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Arena name is required';
    if (!form.location.trim()) e.location = 'Location is required';
    if (!form.pricePerHour || isNaN(Number(form.pricePerHour))) e.pricePerHour = 'Enter a valid price';
    if (form.sports.length === 0) e.sports = 'Select at least one sport';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      // Upload any new images (URI strings that start with 'file://')
      const uploadedUrls = [];
      const arenaId = existingArena?.id || `arena_${Date.now()}`;
      for (const img of images) {
        if (img.startsWith('http')) {
          uploadedUrls.push(img);
        } else {
          const url = await uploadArenaImage(img, arenaId, (p) => setUploadProgress(p));
          uploadedUrls.push(url);
        }
      }
      setUploadProgress(null);

      const data = {
        name: form.name.trim(),
        location: form.location.trim(),
        latitude: parseFloat(form.latitude) || 0,
        longitude: parseFloat(form.longitude) || 0,
        pricePerHour: parseInt(form.pricePerHour),
        description: form.description.trim(),
        sports: form.sports,
        availability: form.availability,
        images: uploadedUrls,
        ownerId: user.uid,
      };

      if (editing) {
        await updateArena(existingArena.id, data);
        Alert.alert('Updated!', 'Arena details updated successfully.');
      } else {
        await createArena(data);
        Alert.alert('Created!', 'Arena has been added. It\'s now visible to customers.');
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', err.message || 'Could not save arena.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Basic Info */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Basic Information</Text>
          <CustomInput label="Arena Name" placeholder="e.g. Champions Arena" value={form.name} onChangeText={set('name')} autoCapitalize="words" error={errors.name}
            icon={<Ionicons name="business-outline" size={16} color={colors.textSecondary} />} />
          <CustomInput label="Address / Location" placeholder="Full address" value={form.location} onChangeText={set('location')} autoCapitalize="sentences" error={errors.location}
            icon={<Ionicons name="location-outline" size={16} color={colors.textSecondary} />} />
          <CustomInput label="Price Per Hour (₹)" placeholder="e.g. 800" value={form.pricePerHour} onChangeText={set('pricePerHour')} keyboardType="numeric" error={errors.pricePerHour}
            icon={<Ionicons name="cash-outline" size={16} color={colors.textSecondary} />} />
          <CustomInput label="Description (optional)" placeholder="What makes your arena special?" value={form.description} onChangeText={set('description')} multiline numberOfLines={3} autoCapitalize="sentences" />
        </View>

        {/* Location Coords */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>GPS Coordinates</Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>
            Get from Google Maps: tap location → share → copy coordinates
          </Text>
          <View style={styles.coordRow}>
            <CustomInput label="Latitude" placeholder="28.6139" value={form.latitude} onChangeText={set('latitude')} keyboardType="numeric" style={{ flex: 1 }} />
            <View style={{ width: 12 }} />
            <CustomInput label="Longitude" placeholder="77.2090" value={form.longitude} onChangeText={set('longitude')} keyboardType="numeric" style={{ flex: 1 }} />
          </View>
        </View>

        {/* Sports */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Sports Available</Text>
          {errors.sports && <Text style={[styles.errorText, { color: colors.error }]}>{errors.sports}</Text>}
          <View style={styles.sportGrid}>
            {ALL_SPORTS.map((s) => {
              const selected = form.sports.includes(s);
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => toggleSport(s)}
                  style={[
                    styles.sportChip,
                    { backgroundColor: selected ? colors.primary : colors.surface, borderColor: selected ? colors.primary : colors.border },
                  ]}
                >
                  <Text style={[styles.sportChipText, { color: selected ? '#fff' : colors.textPrimary }]}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Availability */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Availability</Text>
          <Text style={[styles.hint, { color: colors.textSecondary }]}>Open days</Text>
          <View style={styles.dayRow}>
            {DAYS.map((d, i) => (
              <TouchableOpacity
                key={d}
                onPress={() => toggleDay(i)}
                style={[
                  styles.dayChip,
                  { backgroundColor: form.availability.days.includes(i) ? colors.primary : colors.surface, borderColor: colors.border },
                ]}
              >
                <Text style={{ color: form.availability.days.includes(i) ? '#fff' : colors.textSecondary, fontSize: 12, fontWeight: '700' }}>{d}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.coordRow}>
            <CustomInput label="Opening Hour (0-23)" placeholder="6" value={form.availability.startHour?.toString()} onChangeText={(v) => setForm((f) => ({ ...f, availability: { ...f.availability, startHour: parseInt(v) || 6 } }))} keyboardType="numeric" style={{ flex: 1 }} />
            <View style={{ width: 12 }} />
            <CustomInput label="Closing Hour (0-23)" placeholder="22" value={form.availability.endHour?.toString()} onChangeText={(v) => setForm((f) => ({ ...f, availability: { ...f.availability, endHour: parseInt(v) || 22 } }))} keyboardType="numeric" style={{ flex: 1 }} />
          </View>
        </View>

        {/* Images */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Arena Images</Text>
          <View style={styles.imageGrid}>
            {images.map((img, idx) => (
              <View key={idx} style={styles.thumbWrap}>
                <Image source={{ uri: img }} style={styles.thumb} />
                <TouchableOpacity
                  style={styles.removeImg}
                  onPress={() => setImages(images.filter((_, i) => i !== idx))}
                >
                  <Ionicons name="close-circle" size={22} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              style={[styles.addImg, { backgroundColor: colors.surface, borderColor: colors.border }]}
              onPress={pickImage}
            >
              <Ionicons name="add" size={30} color={colors.primary} />
              <Text style={[styles.addImgText, { color: colors.textSecondary }]}>Add Photos</Text>
            </TouchableOpacity>
          </View>
          {uploadProgress !== null && (
            <Text style={[styles.hint, { color: colors.primary }]}>Uploading... {uploadProgress}%</Text>
          )}
        </View>

        <CustomButton
          title={saving ? 'Saving...' : editing ? 'Update Arena' : 'Create Arena'}
          onPress={handleSave}
          loading={saving}
          style={{ margin: 16, marginTop: 4 }}
        />
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  scroll: { paddingBottom: 40 },
  card: { margin: 16, marginBottom: 0, borderRadius: 18, borderWidth: 1, padding: 16 },
  cardTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14 },
  hint: { fontSize: 12, marginBottom: 10 },
  coordRow: { flexDirection: 'row' },
  errorText: { fontSize: 12, marginBottom: 8 },
  sportGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sportChip: { borderRadius: 10, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 8 },
  sportChipText: { fontSize: 13, fontWeight: '600' },
  dayRow: { flexDirection: 'row', gap: 6, marginBottom: 14, flexWrap: 'wrap' },
  dayChip: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  thumbWrap: { position: 'relative' },
  thumb: { width: 80, height: 80, borderRadius: 12 },
  removeImg: { position: 'absolute', top: -6, right: -6 },
  addImg: { width: 80, height: 80, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center' },
  addImgText: { fontSize: 9, marginTop: 2 },
});

export default AddEditArenaScreen;
