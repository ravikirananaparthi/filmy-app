# Filmy App — Implementation Status

> Last updated: 2026-04-24
> Current phase: Phase 4 (User Upload) — NOT YET STARTED

---

## Phase 1 — Google Authentication ✅ COMPLETE

### What was done
- Supabase Google OAuth via `expo-auth-session` + `expo-web-browser` (browser-based flow, no mobile client IDs needed in app)
- `expo-secure-store` as Supabase session storage adapter
- Auth guard in `app/_layout.tsx` using `useSegments` + `isHydrated` flag
- Axios interceptor with 401 auto-refresh + fallback logout
- Backend: removed phone OTP routes, kept `/me` + `/signout`, auto-creates users from Google OAuth metadata

### Files created/modified
| File | Status |
|------|--------|
| `src/config/supabase.ts` | ✅ NEW — Supabase client + SecureStore adapter |
| `src/services/auth.service.ts` | ✅ NEW — signInWithGoogle, signOut, getSession, refreshSession |
| `src/screens/auth/SignInScreen.tsx` | ✅ NEW — full-screen dark Google Sign-In UI |
| `app/(auth)/_layout.tsx` | ✅ NEW — Stack layout for auth group |
| `app/(auth)/index.tsx` | ✅ NEW — renders SignInScreen |
| `app/_layout.tsx` | ✅ MODIFIED — AuthGuard + hydrate() on mount |
| `src/store/slices/authSlice.ts` | ✅ MODIFIED — isHydrated, refreshToken, setSession(), hydrate(), logout() |
| `src/services/api/client.ts` | ✅ MODIFIED — dynamic token + 401 auto-refresh |
| `src/config/env.ts` | ✅ MODIFIED — Supabase URL + anon key, removed DEV_AUTH_TOKEN |
| `D:\filmy-backend\src\routes\auth.routes.ts` | ✅ MODIFIED — removed phone OTP |
| `D:\filmy-backend\src\controllers\auth.controller.ts` | ✅ MODIFIED — auto-create user from Google OAuth |
| `D:\filmy-backend\supabase\migrations\001_google_oauth_users.sql` | ✅ NEW — email/display_name/avatar_url columns |

### Pending manual steps
- [ ] Run `D:\filmy-backend\supabase\migrations\001_google_oauth_users.sql` in Supabase SQL Editor
- [ ] Enable Google OAuth provider in Supabase dashboard (Auth → Providers → Google)
- [ ] Add Android SHA-1 + package name, iOS bundle ID to Google Cloud Console OAuth client

---

## Phase 2 — Full-Scale Explore Screen ✅ COMPLETE

### What was done
- Trending tab removed entirely (route deleted, content merged into Explore)
- SearchScreen rebuilt with sections: Highlights carousel, Featured Profiles, Trending preview, Popular Tags grid, Discover masonry
- `MasonryImageGrid` as root scrollable with all sections in `ListHeaderComponent` (no nested scroll)
- Upload center tab added to tab bar (glowing `+` circle button)
- Trending tab + screen deleted

### Files created/modified
| File | Status |
|------|--------|
| `src/screens/search/components/TagCard.tsx` | ✅ NEW |
| `src/screens/search/components/TagsGrid.tsx` | ✅ NEW |
| `src/screens/search/components/TrendingPreview.tsx` | ✅ NEW |
| `src/screens/search/hooks/useExplore.ts` | ✅ MODIFIED — useTrendingPreview, usePopularTags, useDiscoverImages |
| `src/screens/search/SearchScreen.tsx` | ✅ REWRITTEN — full explore layout |
| `src/services/api/tags.service.ts` | ✅ NEW — getPopularTags, getDiscoverImages |
| `src/services/api/endpoints.ts` | ✅ MODIFIED — IMAGES.VIEW, IMAGES.RELATED, IMAGES.UPLOAD, USER.ME, USER.UPLOADS |
| `src/components/ui/animated-tab-bar.tsx` | ✅ REWRITTEN — Upload center FAB, indicator skips upload slot |
| `components/ui/animated-tab-bar.tsx` | ✅ REWRITTEN — same (keep in sync with src/ copy) |
| `app/(tabs)/_layout.tsx` | ✅ REWRITTEN — 5 tabs (removed trending) |
| `app/(tabs)/upload.tsx` | ✅ NEW — stub route |
| `components/icons/tab-bar/upload-icon.tsx` | ✅ NEW — SVG upload icon |
| `components/icons/tab-bar/index.ts` | ✅ MODIFIED — exports UploadIcon |
| ~~`src/screens/trending/`~~ | ✅ DELETED |
| ~~`app/(tabs)/trending.tsx`~~ | ✅ DELETED |

---

## Phase 3 — Profile Screen ✅ COMPLETE

### What was done
- Pinterest-style ProfileScreen replacing the MenuScreen stub
- `ProfileHeader`: Google avatar (or initials fallback), display name, email, Pins/Following stats, gear icon → Settings
- `PinsGrid`: wraps `MasonryImageGrid` with `ProfileHeader` as `ListHeaderComponent`; handles loading/empty states
- `SettingsScreen`: Account + App sections + Sign Out with confirm alert; registered at `app/profile/settings.tsx`
- TanStack Query v5 hooks: `useUserProfile` (useQuery) + `useUserUploads` (useInfiniteQuery)
- Backend: `GET /users/me` (profile + pinsCount + followingCount) + `GET /users/me/uploads` (cursor-paginated)

### Files created/modified
| File | Status |
|------|--------|
| `src/screens/menu/components/ProfileHeader.tsx` | ✅ NEW |
| `src/screens/menu/components/PinsGrid.tsx` | ✅ NEW |
| `src/screens/menu/components/SettingsScreen.tsx` | ✅ NEW |
| `src/screens/menu/hooks/useUserProfile.ts` | ✅ NEW |
| `src/screens/menu/hooks/useUserUploads.ts` | ✅ NEW |
| `src/services/api/user.service.ts` | ✅ NEW |
| `src/screens/menu/MenuScreen.tsx` | ✅ REWRITTEN |
| `app/profile/settings.tsx` | ✅ NEW — route for SettingsScreen |
| `app/_layout.tsx` | ✅ MODIFIED — registered profile/settings route |
| `D:\filmy-backend\src\controllers\user.controller.ts` | ✅ NEW |
| `D:\filmy-backend\src\routes\user.routes.ts` | ✅ NEW |
| `D:\filmy-backend\src\routes\index.ts` | ✅ MODIFIED — mounted /users route |

---

## Phase 4 — User Image Upload (UGC) 🔴 NOT STARTED

### What needs to be built
- 3-step upload flow: Pick image → Preview + tags + caption → Submit
- `POST /upload/image` backend endpoint (Multer + Sharp + Supabase storage)
- `user-uploads/` Supabase storage bucket
- DB migration: `uploaded_by` + `is_user_upload` columns on images table

### Files to create
| File | Purpose |
|------|---------|
| `app/upload/index.tsx` | Upload route |
| `src/screens/upload/UploadScreen.tsx` | Full upload flow |
| `src/screens/upload/components/ImagePickerStep.tsx` | Gallery + camera |
| `src/screens/upload/components/PreviewStep.tsx` | Preview + crop + metadata |
| `src/screens/upload/components/TagSelectorStep.tsx` | Tag multi-select |
| `src/services/api/upload.service.ts` | uploadImage(file, metadata) |
| `D:\filmy-backend\src\routes\upload.routes.ts` | POST /upload/image |
| `D:\filmy-backend\src\controllers\upload.controller.ts` | Multer + Sharp pipeline |
| `D:\filmy-backend\supabase\migrations\004_ugc_upload.sql` | DB columns migration |

---

## Phase 5 — Image Detail Revamp (Pinterest Layout) 🔴 NOT STARTED

### What needs to be built
- **Within each image**: vertical scroll page (image → actions → info → related masonry)
- **Between images**: horizontal swipe still navigates to prev/next in feed context
- Pinch-to-zoom on the image
- Related images masonry below (tag-based initially, vector-based in Phase 6)
- Backend: `GET /images/:id/related` endpoint (tag overlap SQL query)

### Files to create
| File | Purpose |
|------|---------|
| `src/screens/image/components/ImageDetailView.tsx` | Vertical scroll page |
| `src/screens/image/components/RelatedImagesMasonry.tsx` | Masonry below image |
| `src/screens/image/hooks/useRelatedImages.ts` | React Query hook |

### Files to modify
| File | Change |
|------|--------|
| `src/screens/image/ImageDetailScreen.tsx` | Integrate vertical layout + related |
| `D:\filmy-backend\src\routes\image.routes.ts` | Add GET /images/:id/related |
| `D:\filmy-backend\src\controllers\image.controller.ts` | Tag-overlap related query |

---

## Phase 6 — AI Embeddings + Smart Feed + AI Search 🔴 NOT STARTED

### What needs to be built
- pgvector extension + `embedding vector(1536)` column on images table
- OpenAI gpt-4o-mini vision → image description → text-embedding-3-small → store embedding
- Related images via cosine similarity (replaces tag-based from Phase 5)
- Smart feed: user preference centroid from liked/viewed images → vector-blended ranking
- AI-powered search: text query → embed → cosine similarity blended with keyword match
- `image_views` tracking table

### Files to create
| File | Purpose |
|------|---------|
| `D:\filmy-backend\src\services\embedding.service.ts` | generateAndStoreEmbedding() |
| `D:\filmy-backend\supabase\migrations\005_pgvector.sql` | pgvector extension + column + index |
| `D:\filmy-backend\supabase\migrations\006_image_views.sql` | image_views table |

### Files to modify
| File | Change |
|------|--------|
| `D:\filmy-backend\src\controllers\image.controller.ts` | Vector-based related + view tracking |
| `D:\filmy-backend\src\services\feed.service.ts` | Vector-blended personalization |
| `D:\filmy-backend\src\services\search.service.ts` | AI vector search blend |
| `D:\filmy-backend\package.json` | Add openai ^4.x.x |
| `src/screens/image/hooks/useRelatedImages.ts` | Use vector endpoint |
| `src/screens/search-input/SearchInputScreen.tsx` | AI search indicator |

---

## Phase 7 — Variable Renaming 🔴 NOT STARTED

UI-facing strings only (not API paths or DB column names):
| Current | New |
|---------|-----|
| "Actress Profile" | "Profile" |
| "Favorite Actresses" | "Following" |
| `actress` in toast/button text | context-appropriate |
| `actressImages` (state var) | `profileImages` |
| `actressId` (component prop) | `profileId` |

---

## Phase 8 — Onboarding Flow 🔴 NOT STARTED

Depends on Phase 7 being complete. Follow users (not actress profiles).

| File | Purpose |
|------|---------|
| `app/(auth)/onboarding/preferences.tsx` | Style preference selection |
| `app/(auth)/onboarding/follow.tsx` | Suggested users to follow |
| `src/screens/auth/onboarding/PreferencesScreen.tsx` | Preference grid UI |
| `src/screens/auth/onboarding/FollowUsersScreen.tsx` | User suggestion cards |
| Backend migration | `user_follows` table |

---

## Summary Table

| Phase | Status | Blocker |
|-------|--------|---------|
| 1 — Google Auth | ✅ Done | Manual: Supabase dashboard Google provider + SQL migration |
| 2 — Explore Screen | ✅ Done | — |
| 3 — Profile Screen | ✅ Done | — |
| 4 — User Upload | 🔴 Not started | Phase 3 (for profile pins) |
| 5 — Image Detail | 🔴 Not started | — |
| 6 — AI Embeddings | 🔴 Not started | Phase 4, 5 |
| 7 — Renaming | 🔴 Not started | All phases done first |
| 8 — Onboarding | 🔴 Not started | Phase 7 |
