// src/theme/typography.js

export const typography = {
  // Font families — loaded via expo-font or Google Fonts
  fontFamily: {
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
    extraBold: 'Inter-ExtraBold',
  },

  // Font sizes
  size: {
    xs: 11,
    sm: 13,
    md: 15,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 34,
    '5xl': 42,
  },

  // Line heights
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },

  // Preset text styles
  styles: {
    h1: { fontSize: 34, fontWeight: '800', letterSpacing: -0.5 },
    h2: { fontSize: 28, fontWeight: '700', letterSpacing: -0.3 },
    h3: { fontSize: 22, fontWeight: '700' },
    h4: { fontSize: 18, fontWeight: '600' },
    body: { fontSize: 15, fontWeight: '400', lineHeight: 22 },
    bodySmall: { fontSize: 13, fontWeight: '400', lineHeight: 18 },
    caption: { fontSize: 11, fontWeight: '500' },
    button: { fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
    label: { fontSize: 13, fontWeight: '600', letterSpacing: 0.5 },
  },
};

export default typography;
