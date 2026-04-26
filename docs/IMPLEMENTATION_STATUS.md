# Filmy App — Implementation Status

> Last updated: 2026-04-26
> Current phase: Phase 6 (AI Embeddings + Smart Feed + AI Search) — NOT STARTED

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
- `ProfileHeader`: Google avatar (or initials fallback), display name, email, Posts/Following stats, gear icon → Settings
- `PinsGrid`: wraps `MasonryImageGrid` with `ProfileHeader` as `ListHeaderComponent`; handles loading/empty states
- `SettingsScreen`: Account + App sections + Sign Out with confirm alert; registered at `app/profile/settings.tsx`
- TanStack Query v5 hooks: `useUserProfile` (useQuery) + `useUserUploads` (useInfiniteQuery)
- Backend: `GET /users/me` (profile + postsCount + followingCount) + `GET /users/me/uploads` (cursor-paginated)
- Renamed "Pins" → "Posts" throughout profile screen (label, empty state, stats)

### Files created/modified
| File | Status |
|------|--------|
| `src/screens/menu/components/ProfileHeader.tsx` | ✅ NEW (uses postsCount) |
| `src/screens/menu/components/PinsGrid.tsx` | ✅ NEW (empty state: "No posts yet") |
| `src/screens/menu/components/SettingsScreen.tsx` | ✅ NEW |
| `src/screens/menu/hooks/useUserProfile.ts` | ✅ NEW |
| `src/screens/menu/hooks/useUserUploads.ts` | ✅ NEW |
| `src/services/api/user.service.ts` | ✅ NEW |
| `src/screens/menu/MenuScreen.tsx` | ✅ REWRITTEN |
| `app/profile/settings.tsx` | ✅ NEW — route for SettingsScreen |
| `app/_layout.tsx` | ✅ MODIFIED — registered profile/settings route |
| `D:\filmy-backend\src\controllers\user.controller.ts` | ✅ NEW (postsCount in response) |
| `D:\filmy-backend\src\routes\user.routes.ts` | ✅ NEW |
| `D:\filmy-backend\src\routes\index.ts` | ✅ MODIFIED — mounted /users route |

---

## Phase 4 — User Image Upload (UGC) ✅ COMPLETE

### What was done
- Multi-image picker using `expo-media-library` (custom 3-column FlatList grid, up to 10 images)
  - `expo-image-picker` was NOT used — it requires a native rebuild not present in the dev client
  - iOS `ph://` URIs resolved to `file://` via `MediaLibrary.getAssetInfoAsync(asset).localUri`
- Review screen: carousel through selected images, per-image tag selection, "Apply to all" for index 0
- Upload service: multipart FormData POST with Axios progress callback
- Zustand `uploadSlice` persists selected images + tags through navigation stack
- Tag selector: popular tags chips + custom tag autocomplete search
- Backend: `POST /upload/post` (multi-file, up to 10), Sharp resize/WebP/blurhash pipeline via `ImageProcessingService`, `actress_id: null`, `uploaded_by`, `is_user_upload: true`
- Feed fix: `INNER JOIN actresses` → `LEFT JOIN actresses` in all 3 feed candidate SQL functions so UGC images with `actress_id = NULL` appear in the feed
- Tab bar `+` button navigates directly to `/upload/pick` (no bottom sheet)
- Upload icon changed from arrow-up SVG to `+` SVG (two `<Line>` elements, `strokeLinecap="round"`)
- Migration numbering: 009 and 010 (migrations 001–008 already existed)

### Files created/modified
| File | Status |
|------|--------|
| `src/store/slices/uploadSlice.ts` | ✅ NEW — selectedImages, tagsPerImage, isUploading, reset |
| `src/services/api/upload.service.ts` | ✅ NEW — uploadPost(images, tagsPerImage, onProgress) |
| `src/services/api/endpoints.ts` | ✅ MODIFIED — UPLOAD.POST = '/upload/post' |
| `src/screens/upload/PickScreen.tsx` | ✅ NEW — expo-media-library custom grid, multi-select, iOS URI fix |
| `src/screens/upload/ReviewScreen.tsx` | ✅ NEW — carousel, TagSelector per image, progress overlay |
| `src/screens/upload/components/TagSelector.tsx` | ✅ NEW — popular chips + autocomplete + apply-to-all |
| `app/upload/pick.tsx` | ✅ NEW — route re-export |
| `app/upload/review.tsx` | ✅ NEW — route re-export |
| `app/upload/index.tsx` | ✅ SIMPLIFIED — safety redirect to /(tabs) |
| `app/(tabs)/_layout.tsx` | ✅ REWRITTEN — TrueSheet removed; upload press → router.push('/upload/pick') |
| `components/icons/tab-bar/upload-icon.tsx` | ✅ REWRITTEN — plus (+) SVG icon |
| `src/components/ui/animated-tab-bar.tsx` | ✅ MODIFIED — onUploadPress callback wired |
| `components/ui/animated-tab-bar.tsx` | ✅ MODIFIED — same (sync copy) |
| `src/screens/menu/components/ProfileHeader.tsx` | ✅ MODIFIED — pinsCount → postsCount |
| `src/screens/menu/components/PinsGrid.tsx` | ✅ MODIFIED — "No pins" → "No posts" |
| `D:\filmy-backend\src\middleware\user-upload.middleware.ts` | ✅ NEW — JPEG/PNG/WebP/HEIC, 15MB/file, max 10 |
| `D:\filmy-backend\src\controllers\upload.controller.ts` | ✅ NEW — uploadPost() |
| `D:\filmy-backend\src\routes\upload.routes.ts` | ✅ NEW — POST /upload/post |
| `D:\filmy-backend\src\routes\index.ts` | ✅ MODIFIED — mounted /upload route |
| `D:\filmy-backend\src\controllers\user.controller.ts` | ✅ MODIFIED — pinsCount → postsCount |
| `D:\filmy-backend\supabase\migrations\009_ugc_upload.sql` | ✅ NEW — actress_id nullable, uploaded_by, is_user_upload |
| `D:\filmy-backend\supabase\migrations\010_feed_include_ugc.sql` | ✅ NEW — LEFT JOIN fix in 3 feed functions |

### Pending manual steps
- [ ] Run `D:\filmy-backend\supabase\migrations\009_ugc_upload.sql` in Supabase SQL Editor
- [ ] Run `D:\filmy-backend\supabase\migrations\010_feed_include_ugc.sql` in Supabase SQL Editor
- [ ] Deploy backend to Render (new `/upload/post` endpoint + feed LEFT JOIN fix)

---

## Phase 5 — Image Detail Revamp (Pinterest Layout) ✅ COMPLETE

### What was done
- Replaced the old full-screen image body with a Pinterest-style vertical detail page inside the existing horizontal carousel.
- Kept horizontal swipe between images from the current feed/search/favorites/profile context.
- Added pinch-to-zoom on the hero image and reset zoom when swiping away from a page.
- Added actions row: like, save-to-collection sheet, share.
- Added tags row, uploader/profile info, upload date, and "More like this" section.
- Added related-image masonry below each image using tag overlap.
- Added direct image fallback fetching so `/image/:id` still opens the requested image when it is not present in the current feed context.
- Backend: `GET /images/:id/related` endpoint using `tag_ids`/`tags` overlap, sorted by overlap count then popularity.

### Files created/modified
| File | Status |
|------|--------|
| `src/screens/image/components/ImageDetailView.tsx` | ✅ NEW — vertical Pinterest detail page |
| `src/screens/image/components/RelatedImagesMasonry.tsx` | ✅ NEW — related two-column masonry |
| `src/screens/image/hooks/useRelatedImages.ts` | ✅ NEW — React Query hook |
| `src/screens/image/ImageDetailScreen.tsx` | ✅ MODIFIED — detail fallback + vertical carousel pages |
| `src/components/carousel/CarouselItem.tsx` | ✅ MODIFIED — renders `ImageDetailView` |
| `src/components/carousel/CarouselScreen.tsx` | ✅ MODIFIED — removed old bottom bar, shares like/save handlers |
| `src/services/api/image.service.ts` | ✅ MODIFIED — `getImageDetail()` normalization + `getRelatedImages()` |
| `src/types/image.types.ts` | ✅ MODIFIED — nullable `actress_id`, UGC uploader fields |
| `D:\filmy-backend\src\routes\image.routes.ts` | ✅ MODIFIED — `GET /images/:id/related` |
| `D:\filmy-backend\src\controllers\image.controller.ts` | ✅ MODIFIED — related query + uploader info on image detail |

### Pending manual steps
- [ ] Deploy backend to Render for the new `/images/:id/related` endpoint.

---

## Phase 6 — AI Tags + CLIP Related Images 🟡 IMPLEMENTED, NEEDS INFRA

### Revised architecture
- OpenAI Vision generates semantic image metadata: `ai_tags`, `ai_caption`, `ai_search_text`, colors/style/mood/objects.
- User tags and AI tags are merged into existing `images.tags` and `images.tag_ids`.
- CLIP generates `clip_embedding vector(512)` for visual image-to-image related results.
- `GET /images/:id/related` is now CLIP-first and falls back to tag overlap when embeddings are missing.
- Search now checks manual tags, AI tags, AI captions, and AI search text.
- Upload still succeeds when AI env vars are missing; enrichment is skipped with warnings.

### Files created/modified
| File | Status |
|------|--------|
| `D:\filmy-backend\supabase\migrations\011_ai_tags_clip_embeddings.sql` | ✅ NEW — pgvector, AI columns, CLIP match RPC |
| `D:\filmy-backend\src\services\openai-vision.service.ts` | ✅ NEW — OpenAI Vision JSON metadata |
| `D:\filmy-backend\src\services\clip.service.ts` | ✅ NEW — external CLIP `/embed-image` client |
| `D:\filmy-backend\src\services\ai-image-enrichment.service.ts` | ✅ NEW — merge tags + store AI/CLIP metadata |
| `D:\filmy-backend\src\utils\array-utils.ts` | ✅ NEW — tag/vector helpers |
| `D:\filmy-backend\src\scripts\backfill-ai-tags-clip.ts` | ✅ NEW — backfill existing images |
| `D:\filmy-backend\src\controllers\upload.controller.ts` | ✅ MODIFIED — starts AI enrichment after upload |
| `D:\filmy-backend\src\controllers\image.controller.ts` | ✅ MODIFIED — CLIP-first related API |
| `D:\filmy-backend\src\controllers\search.controller.ts` | ✅ MODIFIED — search AI tags/caption/text |
| `D:\filmy-backend\src\config\index.ts` | ✅ MODIFIED — AI env config |
| `D:\filmy-backend\.env.example` | ✅ MODIFIED — OpenAI + CLIP env vars |
| `D:\filmy-backend\package.json` | ✅ MODIFIED — `backfill:ai` script |
| `src/types/image.types.ts` | ✅ MODIFIED — AI metadata fields |

### Pending manual steps
- [ ] Run `D:\filmy-backend\supabase\migrations\011_ai_tags_clip_embeddings.sql` in Supabase SQL Editor.
- [ ] Set `OPENAI_API_KEY` and optionally `OPENAI_VISION_MODEL`.
- [ ] Deploy/provide a CLIP service at `CLIP_SERVICE_URL` with `POST /embed-image`.
- [ ] Deploy backend to Render.
- [ ] Run `npm run backfill:ai` in `D:\filmy-backend` after env + migration are ready.

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
| 4 — User Upload | ✅ Done | Manual: run 009 + 010 migrations, deploy backend |
| 5 — Image Detail | ✅ Done | Manual: deploy backend |
| 6 — AI Tags + CLIP Related | 🟡 Implemented | Manual: run 011, configure OpenAI + CLIP service, deploy backend |
| 7 — Renaming | 🔴 Not started | All phases done first |
| 8 — Onboarding | 🔴 Not started | Phase 7 |
