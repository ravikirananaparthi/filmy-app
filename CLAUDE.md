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
4. `README.md` — quick start and links to Expo docs

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
| Media | expo-media-library (image picking — NOT expo-image-picker, not in dev client) |

---

## Project Structure
```
app/                    ← Expo Router file-based routes
├── _layout.tsx         ← Root layout: fonts, auth guard, providers, Stack screens
├── (auth)/             ← Unauthenticated screens (Google Sign-In)
│   ├── _layout.tsx
│   └── index.tsx       → src/screens/auth/SignInScreen.tsx
├── (tabs)/             ← Main tab navigation
│   ├── _layout.tsx     ← 5 tabs: Home | Explore | [+] | Favorites | Profile
│   │                      Upload press → router.push('/upload/pick') directly
│   ├── index.tsx       → HomeScreen
│   ├── search.tsx      → SearchScreen (Explore)
│   ├── upload.tsx      ← Stub — redirects to /(tabs). Tab handled by AnimatedTabBar.
│   ├── favorites.tsx   → FavoritesScreen
│   └── menu.tsx        → ProfileScreen ✅ Phase 3 done
├── image/[id].tsx      → ImageDetailScreen (carousel + related — Phase 5 next)
├── actress/[id].tsx    → ActressProfileScreen
├── search/index.tsx    → SearchInputScreen (full search modal)
├── upload/
│   ├── index.tsx       ← Safety redirect to /(tabs) (keeps Expo Router happy)
│   ├── pick.tsx        → PickScreen (expo-media-library custom grid)
│   └── review.tsx      → ReviewScreen (carousel, tags, upload progress)
├── profile/
│   └── settings.tsx    → SettingsScreen
├── favorites/          ← liked, saved, folder/[id], following
└── (modal)/            ← save-to-favorites modal

src/
├── screens/
│   ├── auth/           ← SignInScreen ✅
│   ├── home/           ← HomeScreen ✅ (full feed + like + infinite scroll)
│   ├── search/         ← SearchScreen ✅ (explore: highlights + profiles + trending + tags + discover)
│   ├── image/          ← ImageDetailScreen ✅ (carousel — Phase 5: add vertical scroll + related)
│   ├── actress/        ← ActressProfileScreen ✅ (3-tab, animated hero)
│   ├── favorites/      ← All favorites screens ✅
│   ├── search-input/   ← SearchInputScreen ✅ (autocomplete, recent, results)
│   ├── menu/           ← ProfileScreen ✅ Phase 3 done (postsCount, settings)
│   ├── wallpaper/      ← WallpaperScreen ❌ empty
│   └── upload/         ← ✅ Phase 4 done
│       ├── PickScreen.tsx        ← expo-media-library, custom 3-col grid, multi-select (max 10)
│       ├── ReviewScreen.tsx      ← carousel, per-image tags, upload progress
│       └── components/
│           └── TagSelector.tsx   ← popular chips + autocomplete + apply-to-all
├── services/
│   └── api/
│       ├── client.ts             ← Axios + dynamic token + 401 auto-refresh
│       ├── endpoints.ts          ← All API endpoint constants (incl. UPLOAD.POST)
│       ├── feed.service.ts
│       ├── image.service.ts
│       ├── actress.service.ts
│       ├── search.service.ts
│       ├── trending.service.ts
│       ├── explore.service.ts
│       ├── favorites.service.ts
│       ├── likes.service.ts
│       ├── followActress.service.ts
│       ├── tags.service.ts       ← getPopularTags, getDiscoverImages
│       ├── upload.service.ts     ✅ uploadPost(images, tagsPerImage, onProgress)
│       └── user.service.ts       ✅ getUserProfile, getUserUploads
├── store/
│   └── slices/
│       ├── authSlice.ts          ← Zustand: user, token, hydrate(), logout()
│       ├── likesSlice.ts         ← Optimistic likes with server sync
│       ├── favoritesSlice.ts
│       ├── favlistSlice.ts
│       └── uploadSlice.ts        ✅ selectedImages, tagsPerImage, isUploading, reset
├── config/
│   ├── env.ts
│   ├── supabase.ts
│   └── reactotron.ts
├── types/
│   ├── user.types.ts
│   ├── image.types.ts
│   └── api.types.ts
├── components/
│   ├── common/
│   │   ├── MasonryImageGrid.tsx
│   │   ├── ImageCard.tsx
│   │   ├── LikeButton.tsx
│   │   └── ShimmerPlaceholder.tsx
│   ├── carousel/
│   └── ui/
│       └── animated-tab-bar.tsx  ← canonical; keep in sync with components/ui/ copy
├── hooks/
│   ├── useLike.ts
│   ├── useDebouncePress.ts
│   └── ...
└── contexts/
    └── RefreshContext.tsx         ← Double-tap home tab to refresh feed

components/
└── icons/tab-bar/
    ├── upload-icon.tsx            ← Plus (+) SVG (two <Line> elements, strokeLinecap="round")
    └── ...
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
router.navigate('/(tabs)' as any)   ← use navigate() to pop back to existing tab stack entry
```

### Post-upload navigation
After a successful upload use `router.navigate('/(tabs)' as any)` — this finds the existing
tabs entry in the stack and pops everything above it. Do NOT use `router.dismissAll()` +
`router.replace()` together; that double-action breaks the navigator.

### Never call router.* during render
All `router.push / replace / navigate` calls must be inside `useEffect` or event handlers.
Calling them during render causes "setState during render" errors.

---

## Tab Bar
**Current tabs:** Home | Explore | **[+]** Upload | Favorites | Profile
- Canonical file: `src/components/ui/animated-tab-bar.tsx`
- Copy (keep in sync): `components/ui/animated-tab-bar.tsx`
- Upload slot (`route.name === 'upload'`): renders glowing circular `+` button
- Pressing `+` calls `onUploadPress?.()` → defined in `app/(tabs)/_layout.tsx` as:
  `reset(); router.push('/upload/pick' as any)` — navigates directly, no bottom sheet
- Indicator: animated pill that slides between non-upload tabs
- Tab bar hides on scroll via `react-native-motionify`
- Upload icon: `components/icons/tab-bar/upload-icon.tsx` — pure `+` SVG (two `<Line>` elements)

---

## Upload Flow (Phase 4)
1. User presses `+` tab → `PickScreen` (`/upload/pick`)
2. `PickScreen` uses `expo-media-library` — custom 3-column grid, multi-select up to 10 images
   - On iOS: `ph://` URIs resolved to `file://` via `MediaLibrary.getAssetInfoAsync(asset).localUri`
3. Selected images saved to `useUploadStore` (Zustand `uploadSlice`)
4. → `ReviewScreen` (`/upload/review`)
5. Carousel through images, `TagSelector` per image (popular tags + autocomplete)
6. "Create" button → `upload.service.ts` multipart FormData POST to `/upload/post`
7. Progress overlay → success → `router.navigate('/(tabs)' as any)`

**DO NOT use `expo-image-picker`** — it requires a native rebuild not present in the current dev client.

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
- Do not use `expo-image-picker` — not compiled into the dev client; use `expo-media-library`
- Do not call `router.*` during render — always inside `useEffect` or event handler

## Naming Convention Note
Many internal variables use `actress*` naming (e.g., `actressId`, `favoriteActresses`). This is intentional for now. **Phase 7** will rename UI-facing strings. Don't rename prematurely.
