// src/screens/LoginScreen.js

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
import { logIn } from '../services/authService';
import { darkColors, lightColors } from '../theme/colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useAuth } from '../contexts/AuthContext';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { demoLogin } = useAuth();

  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Enter a valid email';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await logIn(email.trim(), password);
      // AuthContext listener will handle navigation
    } catch (err) {
      let msg = 'Login failed. Please try again.';
      if (err.code === 'auth/user-not-found') msg = 'No account found with this email.';
      else if (err.code === 'auth/wrong-password') msg = 'Incorrect password.';
      else if (err.code === 'auth/invalid-credential') msg = 'Invalid credentials.';
      Alert.alert('Login Failed', msg);
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
        {/* Header Gradient */}
        <LinearGradient
          colors={['#00C2FF22', '#0A0E1A00']}
          style={styles.headerGrad}
        />

        {/* Logo */}
        <View style={styles.logoRow}>
          <LinearGradient colors={['#00C2FF', '#0090CC']} style={styles.logoBox}>
            <Ionicons name="football" size={28} color="#fff" />
          </LinearGradient>
          <Text style={[styles.appName, { color: colors.textPrimary }]}>Arena Booking</Text>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome Back!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Sign in to book your next game
        </Text>

        {/* Form */}
        <View style={styles.form}>
          <CustomInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={errors.email}
            icon={<Ionicons name="mail-outline" size={18} color={colors.textSecondary} />}
          />
          <CustomInput
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            error={errors.password}
            icon={<Ionicons name="lock-closed-outline" size={18} color={colors.textSecondary} />}
          />

          <TouchableOpacity style={styles.forgotWrap}>
            <Text style={[styles.forgotText, { color: colors.primary }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <CustomButton title="Sign In" onPress={handleLogin} loading={loading} />

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
          </View>

          {/* Google Sign-In placeholder */}
          <CustomButton
            variant="outline"
            title="Continue with Google"
            onPress={() => Alert.alert('Google Sign-In', 'Configure expo-auth-session with your Google OAuth credentials to enable this.')}
            icon={<Ionicons name="logo-google" size={18} color={colors.primary} />}
          />

          {/* ── Demo Mode ── */}
          <View style={styles.demoSection}>
            <View style={styles.dividerRow}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>DEMO (no Firebase needed)</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>
            <View style={styles.demoRow}>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: '#00C2FF22', borderColor: '#00C2FF' }]}
                onPress={() => demoLogin('customer@demo.com')}
                activeOpacity={0.8}
              >
                <Ionicons name="person" size={16} color="#00C2FF" />
                <Text style={[styles.demoBtnText, { color: '#00C2FF' }]}>Customer</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: '#10B98122', borderColor: '#10B981' }]}
                onPress={() => demoLogin('owner@demo.com')}
                activeOpacity={0.8}
              >
                <Ionicons name="business" size={16} color="#10B981" />
                <Text style={[styles.demoBtnText, { color: '#10B981' }]}>Owner</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.demoBtn, { backgroundColor: '#8B5CF622', borderColor: '#8B5CF6' }]}
                onPress={() => demoLogin('admin@demo.com')}
                activeOpacity={0.8}
              >
                <Ionicons name="shield" size={16} color="#8B5CF6" />
                <Text style={[styles.demoBtnText, { color: '#8B5CF6' }]}>Admin</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Sign up link */}
        <View style={styles.signupRow}>
          <Text style={[styles.signupText, { color: colors.textSecondary }]}>
            Don't have an account?{' '}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={[styles.signupLink, { color: colors.primary }]}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 70,
    paddingBottom: 40,
  },
  headerGrad: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 300,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 36,
    gap: 12,
  },
  logoBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 20,
    fontWeight: '800',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 32,
  },
  form: {
    gap: 4,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -8,
  },
  forgotText: {
    fontSize: 13,
    fontWeight: '600',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '600',
  },
  signupRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
  },
  signupLink: {
    fontSize: 14,
    fontWeight: '700',
  },
  demoSection: { marginTop: 4 },
  demoRow: { flexDirection: 'row', gap: 10, marginTop: 12 },
  demoBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    borderWidth: 1.5,
    paddingVertical: 12,
  },
  demoBtnText: { fontSize: 13, fontWeight: '700' },
});

export default LoginScreen;
