# Filmy App — Remaining Tasks (Phases 5–8)

> See `IMPLEMENTATION_STATUS.md` for what's already done (Phases 1–4).
> See `ARCHITECTURE.md` for patterns and conventions.

---

## Phase 5 — Image Detail Revamp (Pinterest Layout)

**Goal**: Replace full-screen carousel with Pinterest-style vertical scroll page.

### Target UX
- **Horizontal swipe between images** in feed context (carousel navigation stays)
- **Within each image**: vertical scroll page:
  1. Full-width image (pinch-to-zoom via `react-native-gesture-handler`)
  2. Actions bar: Like | Save | Share
  3. Info: tags row (scrollable chips), uploader name + date
  4. "More like this" heading
  5. Related images masonry (infinite, tag-based initially → vector-based after Phase 6)

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
- Use the "all sections in ListHeaderComponent" pattern (preferred — avoids nested scroll)
- `scrollEnabled={false}` on inner FlashList + `nestedScrollEnabled` on outer ScrollView

Modify `src/screens/image/ImageDetailScreen.tsx`:
- Keep horizontal swipe for carousel navigation
- Each page renders `<ImageDetailView imageId={id} />`

---

## Phase 6 — AI Tags + CLIP Related Images

**Goal**: Use OpenAI Vision for automatic tagging and CLIP/pgvector for visual related images.

### Implemented Scope
- OpenAI Vision analyzes uploads and generates `ai_tags`, `ai_caption`, `ai_search_text`, and structured metadata.
- Manual user tags and AI tags are merged into existing `images.tags` / `images.tag_ids`.
- CLIP stores 512-dimensional image embeddings in `images.clip_embedding`.
- `GET /images/:id/related` uses CLIP visual similarity first, with tag overlap fallback.
- Search now includes manual tags, AI tags, AI captions, and AI search text.
- Existing images can be backfilled with `npm run backfill:ai`.

### Manual Setup
1. Run `D:\filmy-backend\supabase\migrations\011_ai_tags_clip_embeddings.sql`.
2. Set `OPENAI_API_KEY` in backend environment.
3. Provide a CLIP service at `CLIP_SERVICE_URL` with `POST /embed-image`.
4. Deploy backend.
5. Run `npm run backfill:ai` to enrich old images.

### Deferred
- Smart feed vector blending is deferred until enough AI/CLIP metadata exists.
- Text embedding search is deferred; generated AI tags/search text are used first.

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

### Phase 5 (Image Detail)
- `GET /images/:id/related` — tag-based related images

### Phase 6 (AI)
- `GET /images/:id/related` — upgraded to vector-based
- `POST /images/:id/view` — track image view
- `GET /feed/personalized` — upgraded to vector-blended

### Phase 8 (Onboarding)
- `GET /users/suggested` — suggested users to follow
- `POST /users/:id/follow` — follow a user
