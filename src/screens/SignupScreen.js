// src/screens/SignupScreen.js

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { signUp } from '../services/authService';
import { darkColors, lightColors } from '../theme/colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

const SignupScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'At least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signUp({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
        role: form.role,
      });
      // AuthContext will navigate automatically
    } catch (err) {
      let msg = 'Sign up failed. Try again.';
      if (err.code === 'auth/email-already-in-use') msg = 'This email is already registered.';
      Alert.alert('Sign Up Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <LinearGradient colors={['#00C2FF22', '#0A0E1A00']} style={styles.headerGrad} />

        {/* Back button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Create Account</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Join Arena Booking today
        </Text>

        {/* Role Selector */}
        <View style={styles.roleRow}>
          {['customer', 'owner'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => set('role')(r)}
              style={[
                styles.roleBtn,
                {
                  backgroundColor: form.role === r ? colors.primary : colors.surface,
                  borderColor: form.role === r ? colors.primary : colors.border,
                },
              ]}
            >
              <Ionicons
                name={r === 'customer' ? 'person' : 'business'}
                size={16}
                color={form.role === r ? '#fff' : colors.textSecondary}
              />
              <Text
                style={[
                  styles.roleText,
                  { color: form.role === r ? '#fff' : colors.textSecondary },
                ]}
              >
                {r === 'customer' ? 'Customer' : 'Arena Owner'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Form */}
        <View style={styles.form}>
          <CustomInput
            label="Full Name"
            placeholder="John Doe"
            value={form.name}
            onChangeText={set('name')}
            autoCapitalize="words"
            error={errors.name}
            icon={<Ionicons name="person-outline" size={18} color={colors.textSecondary} />}
          />
          <CustomInput
            label="Email"
            placeholder="your@email.com"
            value={form.email}
            onChangeText={set('email')}
            keyboardType="email-address"
            error={errors.email}
            icon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
          />
          <CustomInput
            label="Phone (optional)"
            placeholder="+91 98765 43210"
            value={form.phone}
            onChangeText={set('phone')}
            keyboardType="phone-pad"
            icon={<Ionicons name="call-outline" size={18} color={colors.textSecondary} />}
          />
          <CustomInput
            label="Password"
            placeholder="At least 6 characters"
            value={form.password}
            onChangeText={set('password')}
            secureTextEntry
            error={errors.password}
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
          />
          <CustomInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChangeText={set('confirmPassword')}
            secureTextEntry
            error={errors.confirmPassword}
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
          />

          <CustomButton
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            style={{ marginTop: 8 }}
          />
        </View>

        <View style={styles.loginRow}>
          <Text style={[styles.loginText, { color: colors.textSecondary }]}>
            Already have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.loginLink, { color: colors.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 40 },
  headerGrad: { position: 'absolute', top: 0, left: 0, right: 0, height: 250 },
  backBtn: { marginBottom: 24, alignSelf: 'flex-start' },
  title: { fontSize: 30, fontWeight: '800', marginBottom: 6 },
  subtitle: { fontSize: 14, marginBottom: 24 },
  roleRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  roleBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  roleText: { fontSize: 14, fontWeight: '700' },
  form: { gap: 4 },
  loginRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 28 },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 14, fontWeight: '700' },
});

export default SignupScreen;
