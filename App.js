// App.js — Entry point

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { registerForPushNotifications } from './src/services/notificationService';

const AppContent = () => {
  const { user } = useAuth();
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (user?.uid) {
      registerForPushNotifications(user.uid).catch(console.warn);
    }
  }, [user]);

  return (
    <>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </>
  );
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
