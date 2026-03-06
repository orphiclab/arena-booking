// src/screens/ProfileScreen.js

import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, useColorScheme, Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { darkColors, lightColors } from '../theme/colors';
import { useAuth } from '../contexts/AuthContext';
import { updateUserProfile } from '../services/authService';
import { uploadProfileImage } from '../services/storageService';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';

const MenuItem = ({ icon, label, onPress, color, colors, showChevron = true }) => (
  <TouchableOpacity
    style={[styles.menuItem, { borderBottomColor: colors.border }]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={[styles.menuIcon, { backgroundColor: (color || colors.primary) + '22' }]}>
      <Ionicons name={icon} size={20} color={color || colors.primary} />
    </View>
    <Text style={[styles.menuLabel, { color: colors.textPrimary }]}>{label}</Text>
    {showChevron && <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />}
  </TouchableOpacity>
);

const ProfileScreen = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const { user, userProfile, logout, refreshProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(userProfile?.name || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(user.uid, { name, phone });
      await refreshProfile();
      setEditing(false);
      Alert.alert('Saved!', 'Your profile has been updated.');
    } catch {
      Alert.alert('Error', 'Could not save profile. Try again.');
    } finally {
      setSaving(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed', 'Allow photo library access.'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      setUploadingImage(true);
      try {
        const url = await uploadProfileImage(result.assets[0].uri, user.uid);
        await updateUserProfile(user.uid, { profileImage: url });
        await refreshProfile();
      } catch { Alert.alert('Error', 'Image upload failed.'); }
      finally { setUploadingImage(false); }
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  const initials = (userProfile?.name || 'U').split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient colors={['#00C2FF22', colors.background]} style={styles.headerGrad}>
        <View style={styles.avatarSection}>
          <TouchableOpacity onPress={pickImage} style={styles.avatarWrap}>
            {userProfile?.profileImage ? (
              <Image source={{ uri: userProfile.profileImage }} style={styles.avatar} />
            ) : (
              <LinearGradient colors={['#00C2FF', '#0090CC']} style={styles.avatar}>
                <Text style={styles.initials}>{initials}</Text>
              </LinearGradient>
            )}
            {uploadingImage ? (
              <View style={styles.avatarOverlay}>
                <Ionicons name="cloud-upload" size={20} color="#fff" />
              </View>
            ) : (
              <View style={[styles.editBadge, { backgroundColor: colors.primary }]}>
                <Ionicons name="camera" size={14} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
          <Text style={[styles.name, { color: colors.textPrimary }]}>{userProfile?.name || 'User'}</Text>
          <Text style={[styles.email, { color: colors.textSecondary }]}>{user?.email || ''}</Text>
          <View style={[styles.roleBadge, { backgroundColor: colors.primary + '22' }]}>
            <Text style={[styles.roleText, { color: colors.primary }]}>
              {(userProfile?.role || 'customer').toUpperCase()}
            </Text>
          </View>
        </View>
      </LinearGradient>

      {/* Edit Profile */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>Personal Info</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={[styles.editBtn, { color: colors.primary }]}>
              {editing ? 'Cancel' : 'Edit'}
            </Text>
          </TouchableOpacity>
        </View>

        {editing ? (
          <>
            <CustomInput label="Full Name" value={name} onChangeText={setName} autoCapitalize="words"
              icon={<Ionicons name="person-outline" size={16} color={colors.textSecondary} />} />
            <CustomInput label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad"
              icon={<Ionicons name="call-outline" size={16} color={colors.textSecondary} />} />
            <CustomButton title="Save Changes" onPress={handleSave} loading={saving} size="md" />
          </>
        ) : (
          <>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>{userProfile?.name || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="mail-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>{user?.email || '—'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="call-outline" size={16} color={colors.textSecondary} />
              <Text style={[styles.infoText, { color: colors.textPrimary }]}>{userProfile?.phone || '—'}</Text>
            </View>
          </>
        )}
      </View>

      {/* Menu */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MenuItem icon="notifications-outline" label="Notification Preferences" onPress={() => {}} colors={colors} />
        <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => {}} colors={colors} />
        <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => {}} colors={colors} />
        <MenuItem icon="information-circle-outline" label="About Arena Booking" onPress={() => {}} colors={colors} />
      </View>

      {/* Logout */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <MenuItem icon="log-out-outline" label="Log Out" onPress={handleLogout} color={colors.error} colors={colors} showChevron={false} />
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  headerGrad: { paddingBottom: 8 },
  avatarSection: { alignItems: 'center', paddingTop: 40, paddingBottom: 24 },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatar: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  avatarOverlay: { ...StyleSheet.absoluteFillObject, borderRadius: 45, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  initials: { color: '#fff', fontSize: 28, fontWeight: '800' },
  name: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  email: { fontSize: 13, marginBottom: 10 },
  roleBadge: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  roleText: { fontSize: 11, fontWeight: '700' },
  card: { marginHorizontal: 16, marginBottom: 14, borderRadius: 18, borderWidth: 1, padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700' },
  editBtn: { fontSize: 14, fontWeight: '700' },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  infoText: { fontSize: 14 },
  menuItem: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 13, borderBottomWidth: 0.5 },
  menuIcon: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
});

export default ProfileScreen;
