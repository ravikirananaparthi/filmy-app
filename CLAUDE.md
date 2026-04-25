# Filmy App — Claude Code Context

## What is this project?
Filmy is a **Pinterest-style UGC image discovery app** built in React Native / Expo.
- Originally built for celebrity/actress images (actress-niche)
- **Now pivoting to universal UGC** — any user can upload, discover, and save images
- Backend is deployed at `https://filmy-backend.onrender.com`
- Supabase project: `https://idbxthynisgwgnkdskga.supabase.co`

## Critical: Read these files before doing any work
1. `docs/IMPLEMENTATION_STATUS.md` — what's done, what's pending, current phase
2. `docs/ARCHITECTURE.md` — file structure, patterns, conventions
3. `docs/TASKS.md` — remaining phases with detailed specs

---

## Tech Stack
| Layer | Library |
|-------|---------|
| Framework | React Native + Expo SDK 54 |
| Router | Expo Router v6 (file-based) |
| Language | TypeScript (strict) |
| State | Zustand v5 (client state) + TanStack Query v5 (server state) |
| Auth | Supabase Google OAuth + expo-auth-session + expo-secure-store |
| HTTP | Axios with auto-refresh interceptor |
| UI | expo-image, expo-linear-gradient, lucide-react-native |
| Animation | React Native Reanimated 4, Moti, react-native-motionify |
| Lists | @shopify/flash-list (masonry + horizontal) |
| Forms | react-hook-form + zod |
| Font | Google Sans Flex (400/500/600/700) |

---

## Project Structure
```
app/                    ← Expo Router file-based routes
├── _layout.tsx         ← Root layout: fonts, auth guard, providers
├── (auth)/             ← Unauthenticated screens (Google Sign-In)
│   ├── _layout.tsx
│   └── index.tsx       → src/screens/auth/SignInScreen.tsx
├── (tabs)/             ← Main tab navigation
│   ├── _layout.tsx     ← 5 tabs: Home | Explore | Upload(+) | Favorites | Profile
│   ├── index.tsx       → HomeScreen
│   ├── search.tsx      → SearchScreen (Explore)
│   ├── upload.tsx      ← Stub only — upload handled via router.push('/upload/index')
│   ├── favorites.tsx   → FavoritesScreen
│   └── menu.tsx        → ProfileScreen (placeholder, implement Phase 3)
├── image/[id].tsx      → ImageDetailScreen (carousel + related images)
├── actress/[id].tsx    → ActressProfileScreen
├── search/index.tsx    → SearchInputScreen (full search modal)
├── upload/index.tsx    → UploadScreen (Phase 4 — not yet built)
├── favorites/          ← liked, saved, folder/[id], following
└── (modal)/            ← save-to-favorites modal

src/
├── screens/            ← All screen components (linked from app/ routes)
│   ├── auth/           ← SignInScreen ✅
│   ├── home/           ← HomeScreen ✅ (full feed + like + infinite scroll)
│   ├── search/         ← SearchScreen ✅ (explore: highlights + profiles + trending + tags + discover)
│   ├── image/          ← ImageDetailScreen ✅ (carousel, needs Pinterest layout — Phase 5)
│   ├── actress/        ← ActressProfileScreen ✅ (3-tab, animated hero)
│   ├── favorites/      ← All favorites screens ✅
│   ├── search-input/   ← SearchInputScreen ✅ (autocomplete, recent, results)
│   ├── menu/           ← MenuScreen 🟡 PLACEHOLDER → Phase 3
│   ├── wallpaper/      ← WallpaperScreen ❌ empty
│   └── upload/         ← UploadScreen ❌ Phase 4
├── services/
│   └── api/
│       ├── client.ts       ← Axios + dynamic token from authStore + 401 auto-refresh
│       ├── endpoints.ts    ← All API endpoint constants
│       ├── auth.service.ts ← (handled via src/services/auth.service.ts now)
│       ├── feed.service.ts
│       ├── image.service.ts
│       ├── actress.service.ts
│       ├── search.service.ts
│       ├── trending.service.ts
│       ├── explore.service.ts
│       ├── favorites.service.ts
│       ├── likes.service.ts
│       ├── followActress.service.ts
│       ├── tags.service.ts ✅ (new — getPopularTags, getDiscoverImages)
│       └── upload.service.ts ❌ Phase 4
├── store/
│   └── slices/
│       ├── authSlice.ts    ← Zustand: user, token, hydrate(), logout()
│       ├── likesSlice.ts   ← Optimistic likes with server sync
│       ├── favoritesSlice.ts
│       └── favlistSlice.ts
├── config/
│   ├── env.ts          ← API_BASE_URL, SUPABASE_URL, SUPABASE_ANON_KEY
│   ├── supabase.ts     ← Supabase client with SecureStore adapter
│   └── reactotron.ts   ← Dev logging (DEV only)
├── types/
│   ├── user.types.ts   ← User (email, display_name, avatar_url — Google OAuth fields)
│   ├── image.types.ts
│   └── api.types.ts
├── components/
│   ├── common/
│   │   ├── MasonryImageGrid.tsx  ← FlashList masonry, accepts ListHeaderComponent
│   │   ├── ImageCard.tsx
│   │   ├── LikeButton.tsx
│   │   └── ShimmerPlaceholder.tsx
│   ├── carousel/               ← Full carousel for ImageDetailScreen
│   └── ui/
│       └── animated-tab-bar.tsx ← Custom pill tab bar, Upload = center FAB
├── hooks/
│   ├── useLike.ts      ← returns { toggleLike } — debounced optimistic updates
│   ├── useDebouncePress.ts
│   └── ...
└── contexts/
    └── RefreshContext.tsx  ← Double-tap home tab to refresh feed

components/             ← Shared UI components (outside src/)
└── icons/tab-bar/      ← SVG tab icons: Home, Search, Favorites, Menu, Upload
```

---

## Path Aliases (tsconfig.json)
```
@/* → ./*
@screens/* → src/screens/*
@components/* → src/components/*
@services/* → src/services/*
@hooks/* → src/hooks/*
@types/* → src/types/*
@store/* → src/store/*
@config/* → src/config/*
@utils/* → src/utils/*
@contexts/* → src/contexts/*
@constants/* → src/constants/*
```

---

## Key Patterns

### Auth Guard
`app/_layout.tsx` has an `AuthGuard` component that uses `useSegments` + `useEffect`.
- On start: calls `useAuthStore.hydrate()` to read Supabase session from SecureStore
- `isHydrated` = false until session check completes (prevents flash of wrong screen)
- After hydration: routes to `/(auth)` if not authenticated, stays in `/(tabs)` if authenticated

### API Client Token Flow
`src/services/api/client.ts`:
- Request interceptor reads `useAuthStore.getState().token` dynamically (not captured at creation)
- Response interceptor: on 401 → calls `authService.refreshSession()` → retries original request → on failure calls `logout()`

### Optimistic Likes
`useLike` hook (`src/hooks/useLike.ts`) returns `{ toggleLike }`:
- Immediately updates Zustand `likesSlice` (no loading state shown)
- Debounced 500ms API call
- Reconciles with server state on feed refresh

### MasonryImageGrid pattern
For screens with sections + infinite image grid:
- Pass all section components as `ListHeaderComponent` (React element, memoized)
- `MasonryImageGrid` is the root scrollable — no nested ScrollView
- `onScroll` from `useMotionify()` passed for tab bar hide-on-scroll

### Route navigation
Always cast typed routes with `as any` until Expo Router regenerates types:
```tsx
router.push(`/image/${id}` as any)
router.replace('/(tabs)' as any)
```

---

## Tab Bar
**Current tabs:** Home | Explore | **[+]** Upload | Favorites | Profile
- File: `src/components/ui/animated-tab-bar.tsx` (canonical) + `components/ui/animated-tab-bar.tsx` (copy — keep in sync)
- Upload tab (`route.name === 'upload'`): renders glowing circular `+` button, press → `router.push('/upload/index')`
- Indicator: animated pill that slides between non-upload tabs
- Tab bar hides on scroll via `react-native-motionify`

---

## Environment Variables (.env)
```
EXPO_PUBLIC_API_URL=https://filmy-backend.onrender.com/api/v1
EXPO_PUBLIC_SUPABASE_URL=https://idbxthynisgwgnkdskga.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<anon key in .env>
```

---

## Backend (filmy-backend)
- Located at `D:\filmy-backend`
- Deployed at `https://filmy-backend.onrender.com`
- TypeScript + Express + Supabase PostgreSQL
- **See `D:\filmy-backend\CLAUDE.md` for backend-specific context**

---

## DO NOT
- Do not add `Cache-Control` headers to Axios (already handled)
- Do not use `Accept-Encoding` — React Native can't decompress br/gzip
- Do not create a separate ScrollView inside any screen that uses `MasonryImageGrid`
- Do not import from `@types/xxx` — use `@types/xxx` alias (existing pattern, pre-existing TS warning, doesn't affect runtime)
- Do not add Boards feature (removed from scope)
- Do not add Trending as a standalone tab (removed — content lives in Explore screen)

## Naming Convention Note
Many internal variables use `actress*` naming (e.g., `actressId`, `favoriteActresses`). This is intentional for now. **Phase 7** will rename UI-facing strings. Don't rename prematurely.
