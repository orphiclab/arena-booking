// src/components/CustomButton.js

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  useColorScheme,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { darkColors, lightColors } from '../theme/colors';

const CustomButton = ({
  title,
  onPress,
  variant = 'primary',  // 'primary' | 'secondary' | 'outline' | 'danger'
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
}) => {
  const colorScheme = useColorScheme();
  const colors = colorScheme === 'dark' ? darkColors : lightColors;

  const sizeStyles = {
    sm: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 10 },
    md: { paddingVertical: 14, paddingHorizontal: 24, borderRadius: 14 },
    lg: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 16 },
  };
  const textSizes = { sm: 13, md: 15, lg: 17 };

  const isDisabled = disabled || loading;

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[{ opacity: isDisabled ? 0.6 : 1 }, style]}
      >
        <LinearGradient
          colors={['#00C2FF', '#0090CC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.btn, sizeStyles[size]]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <View style={styles.row}>
              {icon && <View style={styles.iconWrap}>{icon}</View>}
              <Text style={[styles.primaryText, { fontSize: textSizes[size] }, textStyle]}>{title}</Text>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[
          styles.btn,
          sizeStyles[size],
          { borderWidth: 1.5, borderColor: colors.primary, opacity: isDisabled ? 0.6 : 1 },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <View style={styles.row}>
            {icon && <View style={styles.iconWrap}>{icon}</View>}
            <Text style={[styles.outlineText, { color: colors.primary, fontSize: textSizes[size] }, textStyle]}>{title}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  if (variant === 'danger') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.85}
        style={[
          styles.btn,
          sizeStyles[size],
          { backgroundColor: colors.error, opacity: isDisabled ? 0.6 : 1 },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={[styles.primaryText, { fontSize: textSizes[size] }, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  // secondary / ghost
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
      style={[
        styles.btn,
        sizeStyles[size],
        { backgroundColor: colors.surface, opacity: isDisabled ? 0.6 : 1 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : (
        <View style={styles.row}>
          {icon && <View style={styles.iconWrap}>{icon}</View>}
          <Text style={[styles.outlineText, { color: colors.textPrimary, fontSize: textSizes[size] }, textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    marginRight: 8,
  },
  primaryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  outlineText: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default CustomButton;
