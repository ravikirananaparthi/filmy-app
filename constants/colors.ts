/**
 * Centralized Color Palettes for Filmy App
 * Celebrity Wallpaper App - Modern, Cozy, Gen-Z Aesthetic
 * 
 * Each palette includes:
 * - primary: Main brand color
 * - primaryLight: Lighter variant for accents/highlights
 * - primaryDark: Darker variant for depth
 * - accent: Complementary accent color
 * - muted: Subtle/desaturated version
 * - gradient: Array of colors for gradient effects
 */

// =============================================================================
// USER PROVIDED COLOR PALETTES
// =============================================================================

/**
 * 🔮 Neon Purple - Vibrant, bold, Gen-Z energy
 * Base: #A259FF
 */
export const NeonPurple = {
  name: 'Neon Purple',
  primary: '#A259FF',
  primaryLight: '#C89AFF',
  primaryDark: '#7B3DC9',
  accent: '#FF6B9D',
  muted: '#6B4A8C',
  background: {
    dark: '#0D0A12',
    light: '#F8F5FF',
  },
  surface: {
    dark: '#1A1425',
    light: '#FFFFFF',
  },
  gradient: ['#A259FF', '#FF6B9D', '#7B3DC9'],
} as const;

/**
 * 🌊 Ocean Teal - Fresh, calming, modern
 * Base: #14B8A6
 */
export const OceanTeal = {
  name: 'Ocean Teal',
  primary: '#14B8A6',
  primaryLight: '#5EEAD4',
  primaryDark: '#0D9488',
  accent: '#F97316',
  muted: '#2DD4BF',
  background: {
    dark: '#0A1210',
    light: '#F0FDFA',
  },
  surface: {
    dark: '#112221',
    light: '#FFFFFF',
  },
  gradient: ['#14B8A6', '#5EEAD4', '#0D9488'],
} as const;

/**
 * ❄️ Arctic Cyan - Cool, futuristic, sleek
 * Base: #06B6D4
 */
export const ArcticCyan = {
  name: 'Arctic Cyan',
  primary: '#06B6D4',
  primaryLight: '#67E8F9',
  primaryDark: '#0891B2',
  accent: '#EC4899',
  muted: '#22D3EE',
  background: {
    dark: '#0A1214',
    light: '#ECFEFF',
  },
  surface: {
    dark: '#122326',
    light: '#FFFFFF',
  },
  gradient: ['#06B6D4', '#67E8F9', '#0891B2'],
} as const;

/**
 * 🌿 Mint Dream - Soft, dreamy, refreshing
 * Base: #73EEDC
 */
export const MintDream = {
  name: 'Mint Dream',
  primary: '#73EEDC',
  primaryLight: '#A7F3E9',
  primaryDark: '#4DD4C0',
  accent: '#FB7185',
  muted: '#5EEAD4',
  background: {
    dark: '#0A1412',
    light: '#F0FFFC',
  },
  surface: {
    dark: '#122824',
    light: '#FFFFFF',
  },
  gradient: ['#73EEDC', '#A7F3E9', '#4DD4C0'],
} as const;

/**
 * 🌲 Forest Sage - Earthy, cozy, natural
 * Base: #73A580
 */
export const ForestSage = {
  name: 'Forest Sage',
  primary: '#73A580',
  primaryLight: '#9DBFA6',
  primaryDark: '#5A8567',
  accent: '#D4A574',
  muted: '#86B894',
  background: {
    dark: '#0C100D',
    light: '#F5FBF6',
  },
  surface: {
    dark: '#1A241C',
    light: '#FFFFFF',
  },
  gradient: ['#73A580', '#9DBFA6', '#5A8567'],
} as const;

/**
 * 🍃 Jade Green - Fresh, vibrant, lively
 * Base: #7DCfB6
 */
export const JadeGreen = {
  name: 'Jade Green',
  primary: '#7DCFB6',
  primaryLight: '#A8E0D0',
  primaryDark: '#5BB89C',
  accent: '#F59E0B',
  muted: '#6EE7B7',
  background: {
    dark: '#0A120F',
    light: '#F0FDF9',
  },
  surface: {
    dark: '#142620',
    light: '#FFFFFF',
  },
  gradient: ['#7DCFB6', '#A8E0D0', '#5BB89C'],
} as const;

/**
 * 🌊 Deep Ocean - Bold, mysterious, deep
 * Base: #1D4E89
 */
export const DeepOcean = {
  name: 'Deep Ocean',
  primary: '#1D4E89',
  primaryLight: '#3B7DC9',
  primaryDark: '#163A66',
  accent: '#FF9F1C',
  muted: '#5B8CC6',
  background: {
    dark: '#080C12',
    light: '#F0F7FF',
  },
  surface: {
    dark: '#0F1A28',
    light: '#FFFFFF',
  },
  gradient: ['#1D4E89', '#3B7DC9', '#163A66'],
} as const;

/**
 * 💚 Spring Green - Energetic, positive, fresh
 * Base: #09BC8A
 */
export const SpringGreen = {
  name: 'Spring Green',
  primary: '#09BC8A',
  primaryLight: '#40D9AA',
  primaryDark: '#079669',
  accent: '#F43F5E',
  muted: '#34D399',
  background: {
    dark: '#081210',
    light: '#ECFDF5',
  },
  surface: {
    dark: '#0F241E',
    light: '#FFFFFF',
  },
  gradient: ['#09BC8A', '#40D9AA', '#079669'],
} as const;

/**
 * 🌺 Hot Pink - Bold, playful, youthful
 * Base: #EF476F
 */
export const HotPink = {
  name: 'Hot Pink',
  primary: '#EF476F',
  primaryLight: '#FB7A9C',
  primaryDark: '#C9284C',
  accent: '#FFD166',
  muted: '#F472B6',
  background: {
    dark: '#120A0E',
    light: '#FFF1F5',
  },
  surface: {
    dark: '#241418',
    light: '#FFFFFF',
  },
  gradient: ['#EF476F', '#FB7A9C', '#C9284C'],
} as const;

/**
 * 🔮 Royal Purple - Luxurious, elegant, mysterious
 * Base: #392F5A
 */
export const RoyalPurple = {
  name: 'Royal Purple',
  primary: '#392F5A',
  primaryLight: '#5A4D82',
  primaryDark: '#2A2345',
  accent: '#10B981',
  muted: '#6366F1',
  background: {
    dark: '#0C0A12',
    light: '#FAF8FF',
  },
  surface: {
    dark: '#1C1828',
    light: '#FFFFFF',
  },
  gradient: ['#392F5A', '#5A4D82', '#2A2345'],
} as const;

/**
 * 🌱 Emerald - Clean, fresh, modern
 * Base: #03CEA4
 */
export const Emerald = {
  name: 'Emerald',
  primary: '#03CEA4',
  primaryLight: '#4DE5C4',
  primaryDark: '#02A683',
  accent: '#E11D48',
  muted: '#2DD4BF',
  background: {
    dark: '#08120F',
    light: '#ECFDF9',
  },
  surface: {
    dark: '#102420',
    light: '#FFFFFF',
  },
  gradient: ['#03CEA4', '#4DE5C4', '#02A683'],
} as const;

// =============================================================================
// CLAUDE'S SUGGESTED COLOR PALETTES (Gen-Z, Modern, Cozy for Dark Mode)
// =============================================================================

/**
 * ✨ Cosmic Violet - Trendy, aesthetic, Instagram-worthy
 * Perfect for: Premium celebrity content, VIP sections
 */
export const CosmicViolet = {
  name: 'Cosmic Violet',
  primary: '#8B5CF6',
  primaryLight: '#A78BFA',
  primaryDark: '#7C3AED',
  accent: '#F472B6',
  muted: '#C4B5FD',
  background: {
    dark: '#0B0712',
    light: '#FAF5FF',
  },
  surface: {
    dark: '#15102A',
    light: '#FFFFFF',
  },
  gradient: ['#8B5CF6', '#EC4899', '#06B6D4'],
} as const;

/**
 * 🌅 Sunset Coral - Warm, cozy, inviting
 * Perfect for: Trending sections, popular content
 */
export const SunsetCoral = {
  name: 'Sunset Coral',
  primary: '#FB7185',
  primaryLight: '#FDA4AF',
  primaryDark: '#E11D48',
  accent: '#818CF8',
  muted: '#FECDD3',
  background: {
    dark: '#120A0C',
    light: '#FFF1F2',
  },
  surface: {
    dark: '#251418',
    light: '#FFFFFF',
  },
  gradient: ['#FB7185', '#F97316', '#FACC15'],
} as const;

/**
 * 🌌 Midnight Blue - Cozy, premium, sleek
 * Perfect for: Dark mode base, premium feel
 */
export const MidnightBlue = {
  name: 'Midnight Blue',
  primary: '#3B82F6',
  primaryLight: '#60A5FA',
  primaryDark: '#2563EB',
  accent: '#F59E0B',
  muted: '#93C5FD',
  background: {
    dark: '#0B0B10', // Your current dark background!
    light: '#EFF6FF',
  },
  surface: {
    dark: '#13131A',
    light: '#FFFFFF',
  },
  gradient: ['#3B82F6', '#8B5CF6', '#06B6D4'],
} as const;

/**
 * 🌸 Cherry Blossom - Soft, aesthetic, Gen-Z approved
 * Perfect for: Favorites, wishlist, collections
 */
export const CherryBlossom = {
  name: 'Cherry Blossom',
  primary: '#EC4899',
  primaryLight: '#F472B6',
  primaryDark: '#DB2777',
  accent: '#14B8A6',
  muted: '#F9A8D4',
  background: {
    dark: '#100810',
    light: '#FDF2F8',
  },
  surface: {
    dark: '#201420',
    light: '#FFFFFF',
  },
  gradient: ['#EC4899', '#F472B6', '#A855F7'],
} as const;

/**
 * 🌙 Moonlight Silver - Minimalist, clean, modern
 * Perfect for: UI elements, subtle accents
 */
export const MoonlightSilver = {
  name: 'Moonlight Silver',
  primary: '#94A3B8',
  primaryLight: '#CBD5E1',
  primaryDark: '#64748B',
  accent: '#F472B6',
  muted: '#E2E8F0',
  background: {
    dark: '#0F0F14',
    light: '#F8FAFC',
  },
  surface: {
    dark: '#1A1A22',
    light: '#FFFFFF',
  },
  gradient: ['#94A3B8', '#E2E8F0', '#CBD5E1'],
} as const;

// =============================================================================
// ALL PALETTES COLLECTION
// =============================================================================

export const ColorPalettes = {
  // User provided
  neonPurple: NeonPurple,
  oceanTeal: OceanTeal,
  arcticCyan: ArcticCyan,
  mintDream: MintDream,
  forestSage: ForestSage,
  jadeGreen: JadeGreen,
  deepOcean: DeepOcean,
  springGreen: SpringGreen,
  hotPink: HotPink,
  royalPurple: RoyalPurple,
  emerald: Emerald,
  // Suggested
  cosmicViolet: CosmicViolet,
  sunsetCoral: SunsetCoral,
  midnightBlue: MidnightBlue,
  cherryBlossom: CherryBlossom,
  moonlightSilver: MoonlightSilver,
} as const;

export type ColorPaletteName = keyof typeof ColorPalettes;
export type ColorPalette = typeof ColorPalettes[ColorPaletteName];

// =============================================================================
// DEFAULT ACTIVE PALETTE (Change this to switch palettes easily)
// =============================================================================

export const ActivePalette = ColorPalettes.neonPurple;

// =============================================================================
// COMMON UI COLORS (Palette-agnostic, for consistency)
// =============================================================================

export const UIColors = {
  // Status colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Text colors for dark mode
  text: {
    primary: '#FFFFFF',
    secondary: '#A1A1AA',
    tertiary: '#71717A',
    muted: '#52525B',
    inverse: '#18181B',
  },

  // Text colors for light mode
  textLight: {
    primary: '#18181B',
    secondary: '#52525B',
    tertiary: '#71717A',
    muted: '#A1A1AA',
    inverse: '#FFFFFF',
  },

  // Borders & dividers
  border: {
    dark: '#27272A',
    light: '#E4E4E7',
  },

  // Overlays
  overlay: {
    light: 'rgba(255, 255, 255, 0.1)',
    medium: 'rgba(255, 255, 255, 0.2)',
    dark: 'rgba(0, 0, 0, 0.5)',
    heavy: 'rgba(0, 0, 0, 0.8)',
  },

  // Glass effect backgrounds
  glass: {
    dark: 'rgba(255, 255, 255, 0.05)',
    medium: 'rgba(255, 255, 255, 0.1)',
    light: 'rgba(255, 255, 255, 0.15)',
  },
} as const;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get background color based on color scheme
 */
export const getBackground = (palette: ColorPalette, isDark: boolean = true): string => {
  return isDark ? palette.background.dark : palette.background.light;
};

/**
 * Get surface color based on color scheme
 */
export const getSurface = (palette: ColorPalette, isDark: boolean = true): string => {
  return isDark ? palette.surface.dark : palette.surface.light;
};

/**
 * Get text color based on color scheme
 */
export const getTextColor = (type: keyof typeof UIColors.text, isDark: boolean = true) => {
  return isDark ? UIColors.text[type] : UIColors.textLight[type];
};
