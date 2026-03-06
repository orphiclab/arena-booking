// src/screens/SplashScreen.js

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const SplashScreen = ({ navigation }) => {
  const scale = new Animated.Value(0.6);
  const opacity = new Animated.Value(0);
  const textOpacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();

      // Navigate to Login after splash
      setTimeout(() => {
        navigation.replace('Login');
      }, 2000);
    });
  }, []);

  return (
    <LinearGradient
      colors={['#0A0E1A', '#131929', '#0A0E1A']}
      style={styles.container}
    >
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        {/* Logo icon */}
        <View style={styles.logoCircle}>
          <LinearGradient
            colors={['#00C2FF', '#0090CC']}
            style={styles.logoGradient}
          >
            <Ionicons name="football" size={48} color="#fff" />
          </LinearGradient>
        </View>
      </Animated.View>

      <Animated.View style={{ opacity: textOpacity, marginTop: 24 }}>
        <Text style={styles.title}>Arena Booking</Text>
        <Text style={styles.subtitle}>Book Your Game. Own The Court.</Text>
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dotsRow}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCircle: {
    shadowColor: '#00C2FF',
    shadowOpacity: 0.6,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 0 },
    elevation: 20,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    color: '#8A97B8',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 6,
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    position: 'absolute',
    bottom: 60,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  dotActive: {
    backgroundColor: '#00C2FF',
    width: 20,
    borderRadius: 3,
  },
});

export default SplashScreen;
