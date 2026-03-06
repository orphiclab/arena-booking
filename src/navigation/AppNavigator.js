// src/navigation/AppNavigator.js (UPDATED — adds Admin role routing)

import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme, ActivityIndicator, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { AuthStack } from './AuthStack';
import { CustomerTabs } from './CustomerTabs';
import { OwnerTabs } from './OwnerTabs';
import { AdminTabs } from './AdminTabs';
import { darkColors, lightColors } from '../theme/colors';

export const AppNavigator = () => {
  const { user, userProfile, loading } = useAuth();
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const navTheme = colorScheme === 'dark'
    ? {
        ...DarkTheme,
        colors: {
          ...DarkTheme.colors,
          background: darkColors.background,
          card: darkColors.card,
          text: darkColors.textPrimary,
          border: darkColors.border,
          primary: darkColors.primary,
        },
      }
    : {
        ...DefaultTheme,
        colors: {
          ...DefaultTheme.colors,
          background: lightColors.background,
          card: lightColors.card,
          text: lightColors.textPrimary,
          border: lightColors.border,
          primary: lightColors.primary,
        },
      };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  let Navigator;
  if (!user) {
    Navigator = AuthStack;
  } else if (userProfile?.role === 'admin') {
    Navigator = AdminTabs;
  } else if (userProfile?.role === 'owner') {
    Navigator = OwnerTabs;
  } else {
    Navigator = CustomerTabs;
  }

  return (
    <NavigationContainer theme={navTheme}>
      <Navigator />
    </NavigationContainer>
  );
};
