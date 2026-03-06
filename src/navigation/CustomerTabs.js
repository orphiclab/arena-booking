// src/navigation/CustomerTabs.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { darkColors, lightColors } from '../theme/colors';

import HomeScreen from '../screens/HomeScreen';
import ArenaDetailScreen from '../screens/ArenaDetailScreen';
import CourtSelectionScreen from '../screens/CourtSelectionScreen';
import BookingScreen from '../screens/BookingScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import BookingDetailScreen from '../screens/BookingDetailScreen';
import EventsScreen from '../screens/EventsScreen';
import EventDetailScreen from '../screens/EventDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const BookingsStack = createNativeStackNavigator();
const EventsStack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.textPrimary,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <HomeStack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Nearby Arenas' }} />
      <HomeStack.Screen name="ArenaDetail" component={ArenaDetailScreen} options={{ title: 'Arena Details' }} />
      <HomeStack.Screen name="CourtSelection" component={CourtSelectionScreen} options={{ title: 'Select Court' }} />
      <HomeStack.Screen name="Booking" component={BookingScreen} options={{ title: 'Book Slot' }} />
    </HomeStack.Navigator>
  );
};

const BookingsStackNavigator = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const headerOpts = {
    headerStyle: { backgroundColor: colors.card },
    headerTintColor: colors.textPrimary,
    headerTitleStyle: { fontWeight: '700' },
  };
  return (
    <BookingsStack.Navigator screenOptions={headerOpts}>
      <BookingsStack.Screen name="BookingsList" component={MyBookingsScreen} options={{ title: 'My Bookings' }} />
      <BookingsStack.Screen name="BookingDetail" component={BookingDetailScreen} options={{ title: 'Booking Details' }} />
    </BookingsStack.Navigator>
  );
};

const EventsStackNavigator = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;
  const headerOpts = {
    headerStyle: { backgroundColor: colors.card },
    headerTintColor: colors.textPrimary,
    headerTitleStyle: { fontWeight: '700' },
  };
  return (
    <EventsStack.Navigator screenOptions={headerOpts}>
      <EventsStack.Screen name="EventsList" component={EventsScreen} options={{ headerShown: false }} />
      <EventsStack.Screen name="EventDetail" component={EventDetailScreen} options={{ headerShown: false }} />
    </EventsStack.Navigator>
  );
};

export const CustomerTabs = () => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          paddingBottom: 5,
          height: 60,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600', marginBottom: 2 },
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            HomeTab: focused ? 'home' : 'home-outline',
            Bookings: focused ? 'calendar' : 'calendar-outline',
            Events: focused ? 'trophy' : 'trophy-outline',
            Profile: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name] || 'circle'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNavigator} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="Bookings" component={BookingsStackNavigator} options={{ title: 'My Bookings', headerShown: false }} />
      <Tab.Screen name="Events" component={EventsStackNavigator} options={{ title: 'Events', headerShown: false }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile', headerShown: true, headerStyle: { backgroundColor: colors.card }, headerTintColor: colors.textPrimary, headerTitleStyle: { fontWeight: '700' } }} />
    </Tab.Navigator>
  );
};
