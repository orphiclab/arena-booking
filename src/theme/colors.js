// src/theme/colors.js

const palette = {
  // Brand
  primary: '#00C2FF',
  primaryDark: '#0090CC',
  accent: '#FF6B35',

  // Darks
  darkBg: '#0A0E1A',
  darkCard: '#131929',
  darkSurface: '#1C2438',
  darkBorder: '#2A3350',

  // Lights
  lightBg: '#F0F4FC',
  lightCard: '#FFFFFF',
  lightSurface: '#E8EDF8',
  lightBorder: '#D0D8EE',

  // Text
  textPrimaryDark: '#FFFFFF',
  textSecondaryDark: '#8A97B8',
  textPrimaryLight: '#0A0E1A',
  textSecondaryLight: '#4A5568',

  // Status
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  cancelled: '#6B7280',

  // Sports tags
  football: '#10B981',
  basketball: '#F59E0B',
  tennis: '#8B5CF6',
  cricket: '#3B82F6',
  badminton: '#EC4899',
};

export const darkColors = {
  background: palette.darkBg,
  card: palette.darkCard,
  surface: palette.darkSurface,
  border: palette.darkBorder,
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  accent: palette.accent,
  textPrimary: palette.textPrimaryDark,
  textSecondary: palette.textSecondaryDark,
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  cancelled: palette.cancelled,
  statusBar: 'light-content',
};

export const lightColors = {
  background: palette.lightBg,
  card: palette.lightCard,
  surface: palette.lightSurface,
  border: palette.lightBorder,
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  accent: palette.accent,
  textPrimary: palette.textPrimaryLight,
  textSecondary: palette.textSecondaryLight,
  success: palette.success,
  warning: palette.warning,
  error: palette.error,
  cancelled: palette.cancelled,
  statusBar: 'dark-content',
};

export const sportColors = palette;
export default palette;
