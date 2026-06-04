# Filmy App — Frontend Architecture

> Maintainer note: keep this file aligned with `CLAUDE.md` and `docs/IMPLEMENTATION_STATUS.md` when routes or patterns change.

## Project Root Layout
```
D:\projects\filmy-app\
├── app/                    ← Expo Router file-based routes
├── src/                    ← All application logic
├── components/             ← Shared UI components (outside src/ — legacy location)
├── constants/              ← Theme, colors
├── docs/                   ← This directory: architecture docs
├── assets/                 ← Fonts, images
├── .env                    ← Environment variables (not committed)
├── app.json                ← Expo config (scheme: "filmyapp")
├── tsconfig.json           ← Path aliases
└── CLAUDE.md               ← Claude Code context (READ FIRST)
```

---

## Routing (Expo Router v6 — File-Based)

### Route Groups
| Group | Purpose | Auth Required |
|-------|---------|---------------|
| `(auth)/` | Sign-in screen | No |
| `(tabs)/` | Main app tabs | Yes |
| `upload/` | Upload flow | Yes |
| `image/` | Image detail | Yes |
| `actress/` | Actress profiles | Yes |
| `search/` | Search modal | Yes |
| `favorites/` | Favorites sub-screens | Yes |
| `(modal)/` | Save-to-favorites modal | Yes |

### Tab Routes (`app/(tabs)/`)
```
index.tsx       → HomeScreen
search.tsx      → SearchScreen (Explore tab)
upload.tsx      → STUB — redirects to /(tabs). Navigation handled by AnimatedTabBar.
favorites.tsx   → FavoritesScreen
menu.tsx        → ProfileScreen (Phase 3)
```

### Auth Guard
In `app/_layout.tsx`:
```tsx
// AuthGuard runs on every render, redirects based on isAuthenticated + isHydrated
// isHydrated prevents flash of wrong screen during SecureStore read
```

---

## State Management

### Zustand Stores (`src/store/slices/`)
| Slice | Key State | Key Actions |
|-------|-----------|-------------|
| `authSlice.ts` | `user`, `token`, `refreshToken`, `isAuthenticated`, `isHydrated` | `setSession()`, `hydrate()`, `logout()` |
| `likesSlice.ts` | `likedImages: Set<string>`, `pendingSyncs: Map` | `toggleLike()` — optimistic |
| `favoritesSlice.ts` | `savedImages: Set<string>` | `toggleSave()` |
| `favlistSlice.ts` | `favoriteLists: FavList[]` | CRUD operations |

### TanStack Query v5 (`src/screens/*/hooks/`)
- Each screen has its own `useXxx.ts` hooks
- `queryClient` is created once in `app/_layout.tsx`
- Infinite queries use `useInfiniteQuery` with `getNextPageParam`
- Pagination cursor-based via `nextCursor` field

---

## Service Layer (`src/services/`)

### Auth Service (`src/services/auth.service.ts`)
```typescript
signInWithGoogle()   // Opens browser OAuth flow via Supabase + expo-web-browser
signOut()            // Clears Supabase session
getSession()         // Returns current Supabase session (reads SecureStore)
refreshSession()     // Calls supabase.auth.refreshSession()
```

### API Client (`src/services/api/client.ts`)
- Axios instance with `baseURL = ENV.API_BASE_URL`
- **Request interceptor**: reads `useAuthStore.getState().token` on every request
- **Response interceptor**: on 401 → `authService.refreshSession()` → retry → on failure → `logout()`
- No static token capture — always reads from Zustand at request time

### API Services (`src/services/api/`)
| File | Endpoints Used |
|------|---------------|
| `feed.service.ts` | `GET /feed/personalized`, `GET /feed/magic-shuffle` |
| `image.service.ts` | `GET /images/:id`, `POST /images/:id/like` |
| `search.service.ts` | `GET /search` |
| `actress.service.ts` | `GET /actresses`, `GET /actresses/:id` |
| `favorites.service.ts` | Favorites CRUD |
| `likes.service.ts` | Like/unlike |
| `tags.service.ts` | `GET /tags/popular`, normalizes discover images |
| `trending.service.ts` | `GET /trending` |
| `upload.service.ts` | `POST /upload/image` (Phase 4 — not yet implemented) |

---

## UI Component Patterns

### MasonryImageGrid (`src/components/common/MasonryImageGrid.tsx`)
Root scrollable for any screen with sections + image grid:
```tsx
<MasonryImageGrid
  images={images}
  ListHeaderComponent={<>
    <Section1 />
    <Section2 />
  </>}
  onEndReached={fetchNextPage}
  onScroll={motionifyScrollHandler}
/>
```
- Internally uses `@shopify/flash-list` with `numColumns={2}` (masonry mode)
- **Never** put a ScrollView/FlatList inside a MasonryImageGrid consumer — nested scroll breaks

### ImageCard (`src/components/common/ImageCard.tsx`)
- Renders image via `expo-image` with blurhash placeholder
- Passes through like state from `likesSlice`
- Tap → `router.push('/image/${id}')`

### AnimatedTabBar (`src/components/ui/animated-tab-bar.tsx`)
- **Canonical file**: `src/components/ui/animated-tab-bar.tsx`
- **Copy** (keep in sync): `components/ui/animated-tab-bar.tsx`
- Upload slot (index 2): renders glowing circular `+` button, `router.push('/upload/index')`
- Indicator: `Animated.View` using `withSpring`, skips upload position
- Hides on scroll via `react-native-motionify` wrapping in `_layout.tsx`

### LikeButton (`src/components/common/LikeButton.tsx`)
- Reads like state from `likesSlice`
- Calls `useLike().toggleLike(imageId)` on press
- Haptic + scale animation on tap

---

## Supabase Integration

### Client (`src/config/supabase.ts`)
```typescript
const ExpoSecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
};
export const supabase = createClient(url, anonKey, {
  auth: { storage: ExpoSecureStoreAdapter, autoRefreshToken: true, persistSession: true, detectSessionInUrl: false }
});
```

### Google OAuth Flow
1. `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } })`
2. `WebBrowser.openAuthSessionAsync(data.url, redirectTo)` — opens system browser
3. Browser redirects to `filmyapp://auth/callback` with tokens in URL hash
4. Parse `access_token` + `refresh_token` from callback URL
5. `supabase.auth.setSession({ access_token, refresh_token })` — persists to SecureStore
6. `authSlice.setSession()` — updates Zustand state → triggers AuthGuard to route to `(tabs)`

---

## Path Aliases (tsconfig.json)
```json
{
  "@/*":          "./*",
  "@screens/*":  "src/screens/*",
  "@components/*": "src/components/*",
  "@services/*": "src/services/*",
  "@hooks/*":    "src/hooks/*",
  "@types/*":    "src/types/*",
  "@store/*":    "src/store/*",
  "@config/*":   "src/config/*",
  "@utils/*":    "src/utils/*",
  "@contexts/*": "src/contexts/*",
  "@constants/*": "src/constants/*"
}
```

---

## Key Types (`src/types/`)

### `user.types.ts`
```typescript
interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
}
```

### `image.types.ts`
```typescript
interface Image {
  id: string;
  image_url: string;
  thumbnail_url: string;
  blurhash: string;
  width: number;
  height: number;
  tags: Tag[];
  likes_count: number;
  uploaded_by?: string;        // Phase 4+
  is_user_upload?: boolean;    // Phase 4+
}
```

---

## Naming Conventions

| Pattern | Example |
|---------|---------|
| Screen components | `HomeScreen.tsx` → `export default function HomeScreen()` |
| Route files | `app/(tabs)/index.tsx` → imports from `src/screens/home/HomeScreen.tsx` |
| Hooks | `use` prefix, colocated in `src/screens/xxx/hooks/` |
| Services | `xxxService.functionName()` |
| Zustand slices | `useAuthStore`, `useLikesStore`, `useFavoritesStore` |

> **Note**: Internal variables still use `actress*` naming (e.g., `actressId`). This is intentional — Phase 7 renames UI-facing strings only.

---

## Build & Dev Commands
```bash
npx expo start            # Start dev server
npx expo run:android      # Build + run on Android (needed after native module installs)
npx expo run:ios          # Build + run on iOS
```
