// src/screens/AdminEventsScreen.js

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, ActivityIndicator, RefreshControl, useColorScheme, Modal, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { getAllEvents, createEvent, deleteEvent } from '../services/eventService';
import EventCard from '../components/EventCard';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const AdminEventsScreen = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', eventDate: '', arenaName: '', image: '' });

  const fetch = useCallback(async () => {
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch { } finally { setLoading(false); setRefreshing(false); }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);
  const onRefresh = () => { setRefreshing(true); fetch(); };

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleCreate = async () => {
    if (!form.title.trim() || !form.eventDate.trim()) {
      Alert.alert('Required Fields', 'Title and Event Date are required (YYYY-MM-DD).');
      return;
    }
    setSaving(true);
    try {
      await createEvent({ ...form, publishedBy: user.uid });
      setShowModal(false);
      setForm({ title: '', description: '', eventDate: '', arenaName: '', image: '' });
      fetch();
      Alert.alert('Published!', 'Event is now live.');
    } catch { Alert.alert('Error', 'Could not create event.'); }
    finally { setSaving(false); }
  };

  const handleDelete = (ev) => {
    Alert.alert('Delete Event', `Delete "${ev.title}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteEvent(ev.id); fetch(); } },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        ListHeaderComponent={
          <CustomButton
            title="+ Publish New Event"
            onPress={() => setShowModal(true)}
            style={styles.publishBtn}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.empty}>
              <Ionicons name="trophy-outline" size={50} color={colors.textSecondary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No events yet</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <View>
            <EventCard event={item} onPress={() => {}} />
            <TouchableOpacity
              style={[styles.deleteBtn, { borderColor: colors.error }]}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={14} color={colors.error} />
              <Text style={[styles.deleteBtnText, { color: colors.error }]}>Delete Event</Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={styles.list}
      />

      {/* Create Event Modal */}
      <Modal visible={showModal} animationType="slide" presentationStyle="pageSheet">
        <View style={[styles.modal, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>Publish Event</Text>
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Ionicons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <CustomInput label="Event Title *" placeholder="e.g. City Badminton Championship" value={form.title} onChangeText={set('title')} autoCapitalize="words" />
            <CustomInput label="Event Date * (YYYY-MM-DD)" placeholder="2026-04-15" value={form.eventDate} onChangeText={set('eventDate')} />
            <CustomInput label="Arena Name" placeholder="Champions Arena" value={form.arenaName} onChangeText={set('arenaName')} />
            <CustomInput label="Description" placeholder="Describe the event..." value={form.description} onChangeText={set('description')} multiline numberOfLines={4} autoCapitalize="sentences" />
            <CustomInput label="Image URL (optional)" placeholder="https://..." value={form.image} onChangeText={set('image')} keyboardType="url" />
            <CustomButton title="Publish Event" onPress={handleCreate} loading={saving} style={{ marginTop: 8 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  list: { padding: 16, paddingBottom: 80 },
  publishBtn: { marginBottom: 16 },
  deleteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1, borderRadius: 10, paddingVertical: 10, marginTop: -8, marginBottom: 14 },
  deleteBtnText: { fontSize: 13, fontWeight: '700' },
  empty: { alignItems: 'center', paddingTop: 50 },
  emptyText: { fontSize: 14, marginTop: 12 },
  modal: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1 },
  modalTitle: { fontSize: 18, fontWeight: '700' },
});

export default AdminEventsScreen;
