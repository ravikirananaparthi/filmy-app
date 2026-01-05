/**
 * Theme Configuration for Filmy App
 * Centralized theme system with dynamic palette support
 * 
 * Usage:
 * import { Theme, ActivePalette } from '@/constants/theme';
 * 
 * const bgColor = Theme.colors.background.dark;
 * const primaryColor = ActivePalette.primary;
 */

import { Platform } from 'react-native';
import {
  ActivePalette,
  ColorPalettes,
  UIColors,
  getBackground,
  getSurface,
  getTextColor,
  type ColorPalette,
  type ColorPaletteName,
} from './colors';

// Re-export for convenience
export {
  ActivePalette,
  ColorPalettes,
  UIColors,
  getBackground,
  getSurface,
  getTextColor,
  type ColorPalette,
  type ColorPaletteName
};

// =============================================================================
// LEGACY COLORS (For backwards compatibility)
// =============================================================================

const tintColorLight = ActivePalette.primary;
const tintColorDark = ActivePalette.primaryLight;

export const Colors = {
  light: {
    text: UIColors.textLight.primary,
    background: ActivePalette.background.light,
    surface: ActivePalette.surface.light,
    tint: tintColorLight,
    icon: UIColors.textLight.secondary,
    tabIconDefault: UIColors.textLight.tertiary,
    tabIconSelected: tintColorLight,
    primary: ActivePalette.primary,
    primaryLight: ActivePalette.primaryLight,
    primaryDark: ActivePalette.primaryDark,
    accent: ActivePalette.accent,
  },
  dark: {
    text: UIColors.text.primary,
    background: ActivePalette.background.dark,
    surface: ActivePalette.surface.dark,
    tint: tintColorDark,
    icon: UIColors.text.secondary,
    tabIconDefault: UIColors.text.tertiary,
    tabIconSelected: tintColorDark,
    primary: ActivePalette.primary,
    primaryLight: ActivePalette.primaryLight,
    primaryDark: ActivePalette.primaryDark,
    accent: ActivePalette.accent,
  },
};

// =============================================================================
// CENTRALIZED THEME OBJECT
// =============================================================================

export const Theme = {
  // Active color palette
  palette: ActivePalette,

  // Colors organized by purpose
  colors: {
    // Backgrounds
    background: {
      dark: ActivePalette.background.dark,
      light: ActivePalette.background.light,
      surface: {
        dark: ActivePalette.surface.dark,
        light: ActivePalette.surface.light,
      },
    },

    // Primary brand colors
    primary: {
      main: ActivePalette.primary,
      light: ActivePalette.primaryLight,
      dark: ActivePalette.primaryDark,
    },

    // Accent colors
    accent: ActivePalette.accent,
    muted: ActivePalette.muted,

    // Gradients
    gradient: ActivePalette.gradient,

    // Text colors
    text: UIColors.text,
    textLight: UIColors.textLight,

    // Status colors
    status: {
      success: UIColors.success,
      warning: UIColors.warning,
      error: UIColors.error,
      info: UIColors.info,
    },

    // Borders & overlays
    border: UIColors.border,
    overlay: UIColors.overlay,
    glass: UIColors.glass,
  },

  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Border radius scale
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 24,
    full: 9999,
  },

  // Shadow configurations
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
    glow: (color: string = ActivePalette.primary) => ({
      shadowColor: color,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 8,
    }),
    // Featured card shadow (Apple TV style)
    featured: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.35,
      shadowRadius: 24,
      elevation: 12,
    },
  },
} as const;

// =============================================================================
// FONTS - Google Sans Flex
// =============================================================================

export const FontFamily = {
  regular: 'GoogleSansFlex_400Regular',
  medium: 'GoogleSansFlex_500Medium',
  semibold: 'GoogleSansFlex_600SemiBold',
  bold: 'GoogleSansFlex_700Bold',
} as const;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: FontFamily.regular,
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: FontFamily.regular,
    serif: 'serif',
    rounded: FontFamily.regular,
    mono: 'monospace',
  },
  web: {
    sans: "'Google Sans Flex', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'Google Sans Flex', 'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// =============================================================================
// TYPOGRAPHY SCALE
// =============================================================================

export const Typography = {
  // Display text (Hero sections)
  display: {
    fontFamily: FontFamily.bold,
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '700' as const,
  },
  // Apple TV-style large title
  largeTitle: {
    fontFamily: FontFamily.bold,
    fontSize: 34,
    lineHeight: 41,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  // Page titles
  h1: {
    fontFamily: FontFamily.bold,
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700' as const,
  },
  // Section titles
  h2: {
    fontFamily: FontFamily.semibold,
    fontSize: 24,
    lineHeight: 32,
    fontWeight: '600' as const,
  },
  // Subsection titles
  h3: {
    fontFamily: FontFamily.semibold,
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '600' as const,
  },
  // Card titles
  h4: {
    fontFamily: FontFamily.semibold,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
  },
  // Body text
  body: {
    fontFamily: FontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400' as const,
  },
  // Secondary body
  bodySmall: {
    fontFamily: FontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '400' as const,
  },
  // Captions & labels
  caption: {
    fontFamily: FontFamily.regular,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400' as const,
  },
  // Small labels
  tiny: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    lineHeight: 14,
    fontWeight: '500' as const,
  },
} as const;
