Filmy App - Production Folder Structure Proposal
Overview
This document outlines the proposed industry-standard folder structure for the Filmy app, a React Native/Expo application for browsing actress images with features like feeds, trending, search, favorites, and personalization.

Current State
✅ Tab bar navigation finalized (Home, Trending, Search, Favorites, Menu)
✅ Custom animated tab bar component implemented
✅ API backend with comprehensive endpoints
⚠️ Existing screen code is placeholder/reference only
🎯 Need production-ready folder structure
Proposed Folder Structure
filmy-app/
├── app/                              # Expo Router file-based routing
│   ├── (tabs)/                       # Tab navigation group
│   │   ├── _layout.tsx              # Tab layout with AnimatedTabBar
│   │   ├── index.tsx                # Home tab (entry point)
│   │   ├── trending.tsx             # Trending tab
│   │   ├── search.tsx               # Search tab
│   │   ├── favorites.tsx            # Favorites tab
│   │   └── menu.tsx                 # Menu/Profile tab
│   ├── (auth)/                      # Authentication flow
│   │   ├── _layout.tsx              # Auth layout
│   │   ├── phone-input.tsx          # Phone number entry
│   │   ├── otp-verify.tsx           # OTP verification
│   │   └── onboarding.tsx           # User onboarding
│   ├── actress/                     # Actress-related routes
│   │   └── [id].tsx                 # Actress profile (dynamic route)
│   ├── image/                       # Image-related routes
│   │   └── [id].tsx                 # Image detail view
│   ├── _layout.tsx                  # Root layout
│   ├── +not-found.tsx              # 404 page
│   └── modal.tsx                    # Global modal (if needed)
│
├── src/                             # Main source directory
│   ├── screens/                     # Screen components (actual content)
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── FeedHeader.tsx
│   │   │   │   ├── FeedGrid.tsx
│   │   │   │   ├── FilterSheet.tsx
│   │   │   │   └── FeedTypeSelector.tsx
│   │   │   └── hooks/
│   │   │       ├── useFeed.ts
│   │   │       └── useFilters.ts
│   │   ├── trending/
│   │   │   ├── TrendingScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── TrendingHeader.tsx
│   │   │   │   └── TrendingGrid.tsx
│   │   │   └── hooks/
│   │   │       └── useTrending.ts
│   │   ├── search/
│   │   │   ├── SearchScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── SearchBar.tsx
│   │   │   │   ├── SearchResults.tsx
│   │   │   │   ├── RecentSearches.tsx
│   │   │   │   ├── PopularActresses.tsx
│   │   │   │   └── TagsSuggestions.tsx
│   │   │   └── hooks/
│   │   │       ├── useSearch.ts
│   │   │       └── useSearchHistory.ts
│   │   ├── favorites/
│   │   │   ├── FavoritesScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── FavoritesHeader.tsx
│   │   │   │   ├── FavoritesGrid.tsx
│   │   │   │   └── EmptyFavorites.tsx
│   │   │   └── hooks/
│   │   │       └── useFavorites.ts
│   │   ├── menu/
│   │   │   ├── MenuScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   ├── MenuList.tsx
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   └── SettingsSection.tsx
│   │   │   └── hooks/
│   │   │       └── useProfile.ts
│   │   ├── actress/
│   │   │   ├── ActressProfileScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── ProfileHeader.tsx
│   │   │   │   ├── ProfileStats.tsx
│   │   │   │   ├── ProfileImageGrid.tsx
│   │   │   │   ├── FollowButton.tsx
│   │   │   │   └── FilterBar.tsx
│   │   │   └── hooks/
│   │   │       ├── useActressProfile.ts
│   │   │       └── useFollowActress.ts
│   │   ├── image/
│   │   │   ├── ImageDetailScreen.tsx
│   │   │   ├── components/
│   │   │   │   ├── ImageViewer.tsx
│   │   │   │   ├── ImageActions.tsx
│   │   │   │   ├── ImageMetadata.tsx
│   │   │   │   ├── RelatedImages.tsx
│   │   │   │   └── ActressCard.tsx
│   │   │   └── hooks/
│   │   │       ├── useImageDetail.ts
│   │   │       └── useImageActions.ts
│   │   └── auth/
│   │       ├── PhoneInputScreen.tsx
│   │       ├── OTPVerifyScreen.tsx
│   │       ├── OnboardingScreen.tsx
│   │       ├── components/
│   │       │   ├── PhoneInput.tsx
│   │       │   ├── OTPInput.tsx
│   │       │   ├── PreferenceSelector.tsx
│   │       │   └── ActressSuggestions.tsx
│   │       └── hooks/
│   │           ├── usePhoneAuth.ts
│   │           └── useOnboarding.ts
│   │
│   ├── components/                  # Shared/reusable components
│   │   ├── ui/                     # Base UI components
│   │   │   ├── animated-tab-bar.tsx  (existing)
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── BottomSheet.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── Toast.tsx
│   │   ├── common/                 # Common feature components
│   │   │   ├── ImageCard.tsx
│   │   │   ├── ActressCard.tsx
│   │   │   ├── TagChip.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── LoadingState.tsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Screen.tsx
│   │   │   ├── Container.tsx
│   │   │   ├── Grid.tsx
│   │   │   └── ScrollView.tsx
│   │   └── icons/                  # Custom icons (existing)
│   │
│   ├── services/                    # API & external services
│   │   ├── api/
│   │   │   ├── client.ts           # Axios/fetch configuration
│   │   │   ├── endpoints.ts        # API endpoint constants
│   │   │   ├── auth.service.ts     # Authentication API calls
│   │   │   ├── feed.service.ts     # Feed API calls
│   │   │   ├── actress.service.ts  # Actress API calls
│   │   │   ├── image.service.ts    # Image API calls
│   │   │   ├── trending.service.ts # Trending API calls
│   │   │   ├── search.service.ts   # Search API calls
│   │   │   └── tags.service.ts     # Tags API calls
│   │   ├── storage/
│   │   │   ├── secureStorage.ts    # Secure storage (tokens, etc.)
│   │   │   └── asyncStorage.ts     # Async storage wrapper
│   │   ├── analytics/
│   │   │   └── analytics.service.ts # Analytics tracking
│   │   └── notifications/
│   │       └── push.service.ts      # Push notifications
│   │
│   ├── hooks/                       # Global custom hooks
│   │   ├── useAuth.ts              # Authentication hook
│   │   ├── useTheme.ts             # Theme management
│   │   ├── useColorScheme.ts       (existing)
│   │   ├── useDebounce.ts          # Debounce hook
│   │   ├── useInfiniteScroll.ts    # Infinite scroll pagination
│   │   ├── useLike.ts              # Like/unlike functionality
│   │   ├── useDownload.ts          # Image download
│   │   └── useWallpaper.ts         # Wallpaper functionality
│   │
│   ├── contexts/                    # React Context providers
│   │   ├── AuthContext.tsx         # Auth state management
│   │   ├── ThemeContext.tsx        # Theme state
│   │   ├── UserPreferencesContext.tsx # User preferences
│   │   └── ScrollContext.tsx       (existing)
│   │
│   ├── store/                       # State management (Zustand/Redux)
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── favoritesSlice.ts
│   │   │   ├── feedSlice.ts
│   │   │   └── userSlice.ts
│   │   └── index.ts                # Store configuration
│   │
│   ├── utils/                       # Utility functions
│   │   ├── format.ts               # Formatting (date, number, etc.)
│   │   ├── validation.ts           # Input validation
│   │   ├── imageHelpers.ts         # Image utilities
│   │   ├── permissions.ts          # Permission helpers
│   │   └── platform.ts             # Platform-specific code
│   │
│   ├── constants/                   # App constants
│   │   ├── theme.ts                (existing - Theme/Colors)
│   │   ├── layout.ts               # Layout constants
│   │   ├── api.ts                  # API constants
│   │   ├── storage.ts              # Storage keys
│   │   └── animation.ts            # Animation configs
│   │
│   ├── types/                       # TypeScript types
│   │   ├── api.types.ts            # API response types
│   │   ├── actress.types.ts        # Actress entity types
│   │   ├── image.types.ts          # Image entity types
│   │   ├── user.types.ts           # User entity types
│   │   ├── feed.types.ts           # Feed types
│   │   └── navigation.types.ts     # Navigation types
│   │
│   └── config/                      # App configuration
│       ├── env.ts                  # Environment variables
│       └── app.config.ts           # App-wide configuration
│
├── assets/                          # Static assets (existing)
│   ├── images/
│   ├── fonts/
│   └── animations/
│
├── docs/                            # Documentation (existing)
│   ├── API_Reference.md
│   └── ...
│
└── [other config files...]
Key Architectural Decisions
1. Separation of Routing & Screen Logic
app/ directory: Contains only routing files (minimal logic)
src/screens/ directory: Contains actual screen implementations
Benefit: Clear separation between navigation structure and business logic
2. Co-located Components & Hooks
Each screen folder contains:

Main screen component
components/: Screen-specific components
hooks/: Screen-specific hooks
Benefit: Better organization, easier to find related code
3. Service Layer Architecture
All API calls centralized in src/services/api/
Each service file maps to API domains (auth, feed, actress, etc.)
Benefit: Easy to mock for testing, single source of truth for API calls
4. Shared Component Library
src/components/
├── ui/        → Base design system components
├── common/    → Feature-specific reusable components
├── layout/    → Layout primitives
└── icons/     → Custom icons
5. Type Safety
All types in src/types/
Organized by domain (actress, image, user, feed)
Benefit: Better autocomplete, fewer bugs
Migration Strategy
Phase 1: Create Structure (This Phase)
Create src/ directory and all subdirectories
Move existing components to appropriate locations
Create placeholder files for services, types, etc.
Phase 2: Implement Screens (Next Phases)
Start with authentication flow
Implement Home screen with feed
Implement remaining tab screens
Implement detail screens (actress, image)
Phase 3: Optimize & Polish
Add error boundaries
Implement analytics
Add offline support
Performance optimization
Example File Mappings
Current → New Structure
Current	New Location
components/ui/animated-tab-bar.tsx
src/components/ui/animated-tab-bar.tsx
components/themed-text.tsx
src/components/ui/Text.tsx (refactor)
components/themed-view.tsx
src/components/ui/View.tsx (refactor)
app/(tabs)/index.tsx
Keep, but import from src/screens/home/HomeScreen.tsx
app/(tabs)/trending.tsx
Keep, but import from src/screens/trending/TrendingScreen.tsx
Tab Routing Pattern
Each tab file in app/(tabs)/ should be minimal:

// app/(tabs)/index.tsx (Home Tab)
import { HomeScreen } from '@/src/screens/home/HomeScreen';
export default function HomeTab() {
  return <HomeScreen />;
}
The actual screen logic lives in src/screens/home/HomeScreen.tsx.

Import Alias Configuration
Update tsconfig.json to support clean imports:

{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"],
      "@screens/*": ["src/screens/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@hooks/*": ["src/hooks/*"],
      "@utils/*": ["src/utils/*"],
      "@types/*": ["src/types/*"],
      "@constants/*": ["src/constants/*"],
      "@contexts/*": ["src/contexts/*"],
      "@store/*": ["src/store/*"]
    }
  }
}
Next Steps for Discussion
State Management Library

Options: Zustand, Redux Toolkit, Jotai, or React Context only?
Recommendation: Zustand (lightweight, easy to use)
API Client

Options: Axios, React Query, TanStack Query
Recommendation: TanStack Query (built-in caching, refetching, mutations)
UI Component Library

Build custom or use library? (Tamagui, React Native Paper, NativeWind)
Recommendation: Custom (you already have animated-tab-bar)
Image Loading

expo-image (already in dependencies) ✅
Add image caching strategy
Offline Support

Use React Query for caching
Add WatermelonDB for offline-first?
Analytics & Monitoring

Firebase Analytics, Sentry, or custom?
Testing Strategy

Jest + React Native Testing Library
E2E with Maestro or Detox?
Questions for Clarification
Do you want to keep the existing themed components or build new design system?
Should we implement dark mode from the start?
What's the priority order for screens? (Auth → Home → Others?)
Any specific animation libraries beyond Reanimated? (Moti is already there)
Target platforms: iOS, Android, or both equally?
Benefits of This Structure
✅ Scalable: Easy to add new features without clutter
✅ Maintainable: Clear organization, easy to find code
✅ Testable: Separated concerns make testing easier
✅ Type-safe: Centralized types improve DX
✅ Team-friendly: Clear conventions for collaboration
✅ Performance: Screen-level code splitting via Expo Router

Technical Stack Summary
Already Included ✅
Framework: React Native + Expo
Routing: Expo Router (file-based)
UI: React Native core + custom components
Animations: Reanimated, Moti, Motionify
Images: expo-image
Lists: FlashList (performance)
To Be Added 🎯
State Management: TBD (Zustand recommended)
API Client: TBD (TanStack Query recommended)
Form Handling: TBD (React Hook Form recommended)
Validation: TBD (Zod recommended)
Icons: Lucide React Native (already included) ✅
This structure is based on industry best practices from apps like Instagram, Pinterest, and other image-focused mobile applications.