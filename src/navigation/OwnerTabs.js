// src/navigation/OwnerTabs.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

import OwnerDashboardScreen from '../screens/OwnerDashboardScreen';
import AddEditArenaScreen from '../screens/AddEditArenaScreen';
import ArenaBookingsScreen from '../screens/ArenaBookingsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const DashboardStack = createNativeStackNavigator();

const DashboardStackNavigator = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <DashboardStack.Screen
        name="Dashboard"
        component={OwnerDashboardScreen}
        options={{ title: 'My Arenas' }}
      />
      <DashboardStack.Screen
        name="AddArena"
        component={AddEditArenaScreen}
        options={{ title: 'Add Arena' }}
      />
      <DashboardStack.Screen
        name="EditArena"
        component={AddEditArenaScreen}
        options={{ title: 'Edit Arena' }}
      />
      <DashboardStack.Screen
        name="ArenaBookings"
        component={ArenaBookingsScreen}
        options={{ title: 'Arena Bookings' }}
      />
    </DashboardStack.Navigator>
  );
};

export const OwnerTabs = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            OwnerHome: focused ? 'grid' : 'grid-outline',
            OwnerProfile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="OwnerHome" component={DashboardStackNavigator} options={{ title: 'Dashboard' }} />
      <Tab.Screen
        name="OwnerProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.textPrimary,
        }}
      />
    </Tab.Navigator>
  );
};
