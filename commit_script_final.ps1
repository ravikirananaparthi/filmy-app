git add src/services/api/upload.service.ts src/services/api/user.service.ts
git commit -m "feat(api): initialize upload service and update user endpoints"

git add src/store/slices/uploadSlice.ts
git commit -m "feat(store): create upload state slice"

git add src/screens/upload/components/TagSelector.tsx
git commit -m "feat(upload): add tag selector component"

git add src/screens/upload/PickScreen.tsx
git commit -m "feat(upload): implement image pick screen"

git add src/screens/upload/ReviewScreen.tsx
git commit -m "feat(upload): implement image review screen"

git add src/screens/upload/UploadEntryScreen.tsx
git commit -m "feat(upload): implement upload entry screen"

git add app/upload/
git commit -m "feat(navigation): add upload sub-routes"

git add components/icons/tab-bar/upload-icon.tsx src/screens/menu/components/PinsGrid.tsx src/screens/menu/components/ProfileHeader.tsx
git commit -m "feat(ui): add upload tab icon and rename pins to posts"

git add components/ui/animated-tab-bar.tsx src/components/ui/animated-tab-bar.tsx
git commit -m "feat(ui): integrate upload button into animated tab bar"

git add app/(tabs)/_layout.tsx
git commit -m "feat(navigation): configure upload tab route in layout"

git add src/types/image.types.ts
git commit -m "feat(types): update image types for related images"

git add src/services/api/endpoints.ts
git commit -m "feat(api): configure endpoints for related images"

git add src/services/api/image.service.ts
git commit -m "feat(api): add fetch related images method in service"

git add src/screens/image/hooks/useRelatedImages.ts
git commit -m "feat(hooks): implement useRelatedImages hook"

git add src/screens/image/components/ImageDetailView.tsx
git commit -m "feat(image): add image detail view component"

git add src/screens/image/components/RelatedImagesMasonry.tsx
git commit -m "feat(image): add related images masonry grid"

git add src/components/carousel/CarouselItem.tsx
git commit -m "feat(carousel): enhance carousel item behavior"

git add src/components/carousel/CarouselScreen.tsx
git commit -m "feat(carousel): update carousel screen behavior"

git add src/screens/image/ImageDetailScreen.tsx
git commit -m "feat(image): integrate details and related masonry in screen"

git add app/_layout.tsx app.json package.json yarn.lock docs/ .claude/ CLAUDE.md AGENTS.md
git commit -m "chore(config): update root layout, docs, and configurations"
