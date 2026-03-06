// src/navigation/AdminTabs.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AdminArenasScreen from '../screens/AdminArenasScreen';
import AdminUsersScreen from '../screens/AdminUsersScreen';
import AdminBookingsScreen from '../screens/AdminBookingsScreen';
import AdminEventsScreen from '../screens/AdminEventsScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const DashStack = createNativeStackNavigator();

const DashboardStack = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  return (
    <DashStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <DashStack.Screen name="AdminHome" component={AdminDashboardScreen} options={{ title: 'Admin Panel' }} />
      <DashStack.Screen name="AdminArenas" component={AdminArenasScreen} options={{ title: 'All Arenas' }} />
      <DashStack.Screen name="AdminUsers" component={AdminUsersScreen} options={{ title: 'Users' }} />
      <DashStack.Screen name="AdminBookings" component={AdminBookingsScreen} options={{ title: 'All Bookings' }} />
      <DashStack.Screen name="AdminEvents" component={AdminEventsScreen} options={{ title: 'Events' }} />
    </DashStack.Navigator>
  );
};

export const AdminTabs = () => {
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
            AdminDash: focused ? 'grid' : 'grid-outline',
            AdminProfile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="AdminDash" component={DashboardStack} options={{ title: 'Dashboard' }} />
      <Tab.Screen
        name="AdminProfile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          headerShown: true,
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.textPrimary,
          headerTitleStyle: { fontWeight: '700' },
        }}
      />
    </Tab.Navigator>
  );
};
