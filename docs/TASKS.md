# Filmy App — Remaining Tasks (Phases 3–8)

> See `IMPLEMENTATION_STATUS.md` for what's already done.
> See `ARCHITECTURE.md` for patterns and conventions.

---

## Phase 3 — Profile Screen

**Goal**: Replace the placeholder `MenuScreen` with a Pinterest-style profile page.

### Layout (top to bottom)
1. **Header**: Back/settings icon row
2. **Avatar**: Google photo (from `user.avatar_url`) or initials fallback circle
3. **Name + Email**: `user.display_name`, `user.email`
4. **Stats row**: `X Pins` | `X Following` (tappable Following → coming soon toast)
5. **Section tabs**: [Pins] — single tab for now (Boards removed from scope)
6. **Pins grid**: Masonry grid of images the user has uploaded

### Step-by-step

#### Backend
1. Create `D:\filmy-backend\src\controllers\user.controller.ts`:
   - `getCurrentUserProfile`: reads from Supabase JWT, returns user row from DB
   - `getCurrentUserUploads`: queries `images WHERE uploaded_by = userId ORDER BY created_at DESC`
   - Both endpoints need `authenticateUser` middleware
2. Create `D:\filmy-backend\src\routes\user.routes.ts`:
   ```typescript
   router.get('/me', authenticateUser, getCurrentUserProfile);
   router.get('/me/uploads', authenticateUser, getCurrentUserUploads);
   ```
3. Mount in `D:\filmy-backend\src\routes\index.ts`:
   ```typescript
   import userRoutes from './user.routes';
   router.use('/users', userRoutes);
   ```

#### Frontend — Services
Create `src/services/api/user.service.ts`:
```typescript
getUserProfile(): Promise<User>        // GET /users/me
getUserUploads(cursor?, limit?): Promise<PaginatedImages>  // GET /users/me/uploads
```

#### Frontend — Hooks
Create or update `src/screens/menu/hooks/`:
- `useUserProfile.ts`: `useQuery(['userProfile'], userService.getUserProfile)`
- `useUserUploads.ts`: `useInfiniteQuery` using `getUserUploads`

#### Frontend — Components
Create `src/screens/menu/components/ProfileHeader.tsx`:
```tsx
// Avatar (expo-image), display_name, email, stats row
// Stats: pins_count from useUserUploads.totalCount, following_count from user data
// Gear icon → router.push('/profile/settings' as any) OR push SettingsScreen
```

Create `src/screens/menu/components/PinsGrid.tsx`:
```tsx
// Wraps MasonryImageGrid with ListHeaderComponent={<ProfileHeader />}
// onEndReached → fetchNextPage from useUserUploads
// Empty state: "No pins yet — upload your first image!"
```

Create `src/screens/menu/components/SettingsScreen.tsx`:
```tsx
// Standalone screen (push from profile gear icon)
// Items: Account section (email display), App section (dark mode toggle placeholder), Logout button
// Logout → useAuthStore.logout() → router.replace('/(auth)' as any)
```

Rewrite `src/screens/menu/MenuScreen.tsx`:
```tsx
export default function MenuScreen() {
  return <PinsGrid />;  // PinsGrid includes ProfileHeader as ListHeaderComponent
}
```

### Design reference
- Avatar: 80px circle, Google photo or first letter of name on gradient background
- Stats: horizontal row, centered, `|` divider, tappable cells
- Pins grid: same masonry as HomeScreen (2 columns, gap 8px)
- Settings: dark background, grouped list cells with right-arrow chevron

---

## Phase 4 — User Image Upload (UGC)

**Goal**: Let users upload images. Center `+` tab button navigates to `app/upload/index.tsx`.

### Upload flow (3 steps)
**Step 1 — Pick**: Gallery picker (primary) or camera capture
**Step 2 — Preview**: Full-width image preview, caption input, optional crop, tag multi-select
**Step 3 — Submit**: Progress bar → success toast → navigate to the new image's detail page

### Backend

Migration `D:\filmy-backend\supabase\migrations\004_ugc_upload.sql`:
```sql
ALTER TABLE images ADD COLUMN IF NOT EXISTS uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE images ADD COLUMN IF NOT EXISTS is_user_upload BOOLEAN DEFAULT false;
```

Create `D:\filmy-backend\src\controllers\upload.controller.ts`:
- Same Multer + Sharp pipeline as admin upload
- Saves to `user-uploads/` Supabase storage bucket
- Sets `uploaded_by = userId`, `is_user_upload = true`
- Returns created image object

Create `D:\filmy-backend\src\routes\upload.routes.ts`:
```typescript
router.post('/image', authenticateUser, upload.single('image'), uploadImage);
```

Mount at `/upload` in `src/routes/index.ts`.

### Frontend

Create `app/upload/index.tsx` — renders UploadScreen.

Create `src/screens/upload/UploadScreen.tsx`:
- Manages `step: 1 | 2 | 3` state
- Renders `ImagePickerStep`, `PreviewStep`, or progress/success

Create `src/screens/upload/components/ImagePickerStep.tsx`:
- Uses `expo-image-picker` (`MediaTypeOptions.Images`, `quality: 0.8`)
- Camera option requires permission request
- On pick → advance to step 2

Create `src/screens/upload/components/PreviewStep.tsx`:
- Shows picked image (full width)
- Caption `TextInput` (max 200 chars)
- Tag selector (chips — pull from `GET /tags/popular`)
- "Post" button → calls `uploadService.uploadImage()` → step 3

Create `src/screens/upload/components/TagSelectorStep.tsx` (or inline in PreviewStep):
- Horizontal scrollable chips
- Multi-select, selected = filled, unselected = outline

Create `src/services/api/upload.service.ts`:
```typescript
uploadImage(file: { uri, name, type }, caption: string, tagIds: string[]): Promise<Image>
// multipart/form-data POST to /upload/image
```

---

## Phase 5 — Image Detail Revamp (Pinterest Layout)

**Goal**: Replace full-screen carousel with Pinterest-style vertical scroll page.

### Target UX
- **Horizontal swipe between images** in feed context (carousel navigation stays)
- **Within each image**: vertical scroll page:
  1. Full-width image (pinch-to-zoom via `react-native-zoom-able` or `react-native-gesture-handler`)
  2. Actions bar: Like | Save | Share
  3. Info: tags row (scrollable chips), uploader name + date
  4. "More like this" heading
  5. Related images masonry (infinite, tag-based → vector-based after Phase 6)

### Backend
In `D:\filmy-backend\src\controllers\image.controller.ts`, add `getRelatedImages`:
```sql
SELECT i.* FROM images i
JOIN image_tags it ON it.image_id = i.id
WHERE it.tag_id IN (SELECT tag_id FROM image_tags WHERE image_id = $1)
  AND i.id != $1
GROUP BY i.id
ORDER BY COUNT(*) DESC
LIMIT 20;
```

In `D:\filmy-backend\src\routes\image.routes.ts`:
```typescript
router.get('/:id/related', authenticateUser, getRelatedImages);
```

### Frontend

Create `src/screens/image/hooks/useRelatedImages.ts`:
```typescript
useQuery(['relatedImages', imageId], () => imageService.getRelatedImages(imageId))
```

Create `src/screens/image/components/ImageDetailView.tsx`:
- `ScrollView` (vertical)
- Image at top with aspect ratio preserved (full width)
- Actions row: `<LikeButton>`, save icon, share icon
- Tags row: horizontal `ScrollView` of tag chips
- Uploader row: avatar + name + date
- `<RelatedImagesMasonry imageId={id} />`

Create `src/screens/image/components/RelatedImagesMasonry.tsx`:
- Embeds `MasonryImageGrid` (but NOT as root scroll — it's inside a ScrollView)
- Use `scrollEnabled={false}` on inner FlashList + `nestedScrollEnabled` on outer ScrollView
- OR use the "all sections in ListHeaderComponent" pattern (preferred — avoids nested scroll)

Modify `src/screens/image/ImageDetailScreen.tsx`:
- Keep horizontal swipe via `FlatList`/`PagerView` for carousel navigation
- Each page renders `<ImageDetailView imageId={id} />`

---

## Phase 6 — AI Embeddings + Smart Feed + AI Search

**Goal**: Make the feed and search semantically intelligent using OpenAI embeddings.

### 6.1 — pgvector Setup
Migration `D:\filmy-backend\supabase\migrations\005_pgvector.sql`:
```sql
CREATE EXTENSION IF NOT EXISTS vector;
ALTER TABLE images ADD COLUMN IF NOT EXISTS embedding vector(1536);
CREATE INDEX ON images USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

Migration `D:\filmy-backend\supabase\migrations\006_image_views.sql`:
```sql
CREATE TABLE IF NOT EXISTS image_views (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  image_id UUID REFERENCES images(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, image_id)
);
```

### 6.2 — Embedding Service
Create `D:\filmy-backend\src\services\embedding.service.ts`:
```typescript
async generateAndStoreEmbedding(imageId: string, imageUrl: string): Promise<void>
// 1. Call gpt-4o-mini vision → get text description of image
// 2. Call text-embedding-3-small with that description → get vector
// 3. UPDATE images SET embedding = $vector WHERE id = $imageId
```
Run async after upload — don't block the upload response.

Add `openai: "^4.0.0"` to `D:\filmy-backend\package.json`.

### 6.3 — Vector-Based Related Images
Update `getRelatedImages` in image controller:
```sql
SELECT id, thumbnail_url, image_url, blurhash
FROM images
WHERE embedding IS NOT NULL AND id != $targetId
ORDER BY embedding <=> (SELECT embedding FROM images WHERE id = $targetId)
LIMIT 20;
-- Falls back to tag-based query if no embedding found
```

### 6.4 — Smart Feed
Update `D:\filmy-backend\src\services\feed.service.ts`:
- If user has ≥ 3 likes/views: compute average embedding centroid → blend 50% vector similarity + 50% recency/popularity
- If < 3 interactions: 100% recency/popularity (cold start)

### 6.5 — AI Search
Update `D:\filmy-backend\src\services\search.service.ts`:
- Text query → embed → cosine similarity against images.embedding
- Blend: 60% vector similarity + 40% keyword/tag match
- Falls back to pure keyword if no embeddings

Update frontend `src/screens/search-input/SearchInputScreen.tsx`:
- Show "AI Search" badge/indicator on results

---

## Phase 7 — Variable Renaming

**Goal**: Replace all user-visible "actress" strings with neutral alternatives.

**Scope**: UI text strings, component display names. NOT API endpoint paths or DB column names.

Run to find all instances:
```bash
grep -r "actress" src/ app/ --include="*.tsx" --include="*.ts" -i -l
```

Rename map:
| Current text | Replace with |
|-------------|--------------|
| "Actress Profile" | "Profile" |
| "Favorite Actresses" | "Following" |
| "actress" in button/toast text | context-appropriate (e.g., "creator", "profile") |
| State var `actressImages` | `profileImages` |
| Prop `actressId` | `profileId` |

---

## Phase 8 — Onboarding Flow

**Goal**: After Google Sign-In, show new users a 2-step onboarding (preferences + follow users).

**Depends on**: Phase 7 complete (so "users to follow" not "actresses to follow").

### Flow
1. After first-time Google login → route to `/(auth)/onboarding/preferences`
2. Pick 3+ style/mood tags → next
3. Suggested users to follow (based on popular uploaders) → follow some → Done → `/(tabs)`

### Backend
Migration: `user_follows` table:
```sql
CREATE TABLE IF NOT EXISTS user_follows (
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);
```

New endpoint: `GET /users/suggested` → returns popular uploaders not yet followed.

### Frontend
| File | Purpose |
|------|---------|
| `app/(auth)/onboarding/preferences.tsx` | Route |
| `app/(auth)/onboarding/follow.tsx` | Route |
| `src/screens/auth/onboarding/PreferencesScreen.tsx` | Tag grid with multi-select |
| `src/screens/auth/onboarding/FollowUsersScreen.tsx` | User cards with follow buttons |

Track first-time login: check `authSlice.user.created_at` vs. 10-minute window, or add `onboarding_completed: boolean` to users table.

---

## Quick Reference — API Endpoints by Phase

### Phase 3 (Profile)
- `GET /users/me` — current user profile
- `GET /users/me/uploads` — user's uploaded images (paginated)

### Phase 4 (Upload)
- `POST /upload/image` — multipart/form-data image upload

### Phase 5 (Image Detail)
- `GET /images/:id/related` — tag-based related images

### Phase 6 (AI)
- `GET /images/:id/related` — upgraded to vector-based
- `POST /images/:id/view` — track image view
- `GET /feed/personalized` — upgraded to vector-blended

### Phase 8 (Onboarding)
- `GET /users/suggested` — suggested users to follow
- `POST /users/:id/follow` — follow a user
