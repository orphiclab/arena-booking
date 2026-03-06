// src/screens/OTPScreen.js
// Phone Number OTP Verification using Firebase Phone Auth

import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity,
  Alert, KeyboardAvoidingView, Platform, useColorScheme,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import {
  PhoneAuthProvider,
  signInWithCredential,
  RecaptchaVerifier,
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { darkColors, lightColors } from '../theme/colors';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';

const OTPScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const role = route?.params?.role || 'customer';

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const otpRefs = useRef([]);

  const sendOTP = async () => {
    if (!phone || phone.length < 10) {
      Alert.alert('Invalid Phone', 'Enter a valid 10-digit phone number.');
      return;
    }
    setLoading(true);
    try {
      // NOTE: Firebase Phone Auth requires a real SMS sender (RecaptchaVerifier is web-only).
      // For Expo Go, use expo-firebase-recaptcha or a test phone number in Firebase Console.
      // Production: use @react-native-firebase/auth for native phone auth.
      Alert.alert(
        'OTP Notice',
        'Phone OTP via Expo requires @react-native-firebase/auth or expo-firebase-recaptcha. In Firebase Console, add a test phone number (+91XXXXXXXXXX: 123456) for development. Tap OK to simulate OTP entry.',
        [{ text: 'OK', onPress: () => setStep('otp') }]
      );
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const onOtpChange = (val, idx) => {
    const arr = [...otp];
    arr[idx] = val;
    setOtp(arr);
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
    if (!val && idx > 0) otpRefs.current[idx - 1]?.focus();
  };

  const verifyOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) { Alert.alert('Enter OTP', 'Please enter the 6-digit OTP.'); return; }
    setLoading(true);
    try {
      // Production verification:
      // const credential = PhoneAuthProvider.credential(verificationId, code);
      // const userCred = await signInWithCredential(auth, credential);
      // For now, navigate forward (test mode)
      navigation.replace('Signup');
    } catch (err) {
      Alert.alert('Invalid OTP', 'The OTP you entered is incorrect. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1, backgroundColor: colors.background }}
    >
      <LinearGradient colors={['#00C2FF22', '#0A0E1A00']} style={styles.grad} />

      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={[styles.iconBox, { backgroundColor: colors.surface }]}>
          <Ionicons name="phone-portrait" size={36} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.textPrimary }]}>
          {step === 'phone' ? 'Phone Verification' : 'Enter OTP'}
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {step === 'phone'
            ? 'We will send a 6-digit code to your phone'
            : `OTP sent to +91 ${phone}`}
        </Text>

        {step === 'phone' ? (
          <View style={styles.form}>
            <View style={[styles.phoneRow, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.countryCode, { color: colors.textPrimary }]}>🇮🇳 +91</Text>
              <TextInput
                style={[styles.phoneInput, { color: colors.textPrimary }]}
                placeholder="Enter phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                maxLength={10}
                value={phone}
                onChangeText={setPhone}
              />
            </View>
            <CustomButton title="Send OTP" onPress={sendOTP} loading={loading} style={{ marginTop: 20 }} />
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.otpRow}>
              {otp.map((digit, i) => (
                <TextInput
                  key={i}
                  ref={(r) => (otpRefs.current[i] = r)}
                  style={[
                    styles.otpBox,
                    {
                      backgroundColor: colors.surface,
                      borderColor: digit ? colors.primary : colors.border,
                      color: colors.textPrimary,
                    },
                  ]}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(v) => onOtpChange(v, i)}
                  textAlign="center"
                />
              ))}
            </View>
            <CustomButton title="Verify OTP" onPress={verifyOTP} loading={loading} style={{ marginTop: 24 }} />
            <TouchableOpacity style={styles.resend} onPress={() => { setStep('phone'); setOtp(['','','','','','']); }}>
              <Text style={[styles.resendText, { color: colors.primary }]}>Change Number / Resend</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  grad: { position: 'absolute', top: 0, left: 0, right: 0, height: 250 },
  container: { flex: 1, paddingHorizontal: 24, paddingTop: 64 },
  back: { marginBottom: 32, alignSelf: 'flex-start' },
  iconBox: { width: 72, height: 72, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  title: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 32, lineHeight: 20 },
  form: {},
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  countryCode: { paddingHorizontal: 14, fontSize: 15, fontWeight: '600' },
  phoneInput: { flex: 1, height: 52, fontSize: 16, paddingHorizontal: 8 },
  otpRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  otpBox: {
    flex: 1,
    height: 58,
    borderRadius: 14,
    borderWidth: 2,
    fontSize: 22,
    fontWeight: '700',
  },
  resend: { alignSelf: 'center', marginTop: 20 },
  resendText: { fontSize: 14, fontWeight: '600' },
});

export default OTPScreen;
