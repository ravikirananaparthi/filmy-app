git add package.json package-lock.json yarn.lock
git commit -m "chore(deps): update dependencies"

git add docs/ARCHITECTURE.md docs/IMPLEMENTATION_STATUS.md docs/TASKS.md
git commit -m "docs: add project architecture and task tracking"

git add .claude/settings.local.json CLAUDE.md
git commit -m "chore: update claude AI configurations"

git add components/icons/tab-bar/index.ts components/icons/tab-bar/upload-icon.tsx components/ui/animated-tab-bar.tsx src/components/ui/animated-tab-bar.tsx
git commit -m "feat(ui): add upload icon and update animated tab bar"

git rm "app/(tabs)/trending.tsx"
git add "app/(tabs)/_layout.tsx" "app/_layout.tsx" "app/(tabs)/upload.tsx"
git commit -m "feat(navigation): replace trending with upload tab in layout"

git rm src/screens/trending/TrendingScreen.tsx
git commit -m "refactor: remove deprecated trending screen"

git add src/screens/search/SearchScreen.tsx src/screens/search/components/index.ts src/screens/search/components/TagCard.tsx src/screens/search/components/TagsGrid.tsx src/screens/search/components/TrendingPreview.tsx src/screens/search/hooks/index.ts src/screens/search/hooks/useExplore.ts
git commit -m "feat(search): implement tags grid and trending preview in explore"

git add src/services/api/endpoints.ts src/services/api/tags.service.ts
git commit -m "feat(api): add tags service and update endpoints"

git add app/profile/settings.tsx src/screens/menu/MenuScreen.tsx src/screens/menu/components/PinsGrid.tsx src/screens/menu/components/ProfileHeader.tsx src/screens/menu/components/SettingsScreen.tsx src/screens/menu/hooks/useUserProfile.ts src/screens/menu/hooks/useUserUploads.ts src/services/api/user.service.ts
git commit -m "feat(profile): add profile header, pins grid, and user services"

git add app/auth/callback.tsx src/screens/auth/SignInScreen.tsx src/services/auth.service.ts
git commit -m "feat(auth): add auth callback and update sign in service"
