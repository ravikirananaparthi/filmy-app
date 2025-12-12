---
description: How to add custom icons from Figma to the project
---

# 🎨 How to Add Custom Icons

This guide explains how to take icons from your Figma file and add them to the Filmy app.

## 1. Export from Figma
1.  Select the icon in Figma.
2.  **Crucial**: Make sure the icon is in a square Frame (usually **24x24**).
3.  Right-click the icon layer (or the frame) > **Copy as SVG**.

## 2. Generate Component
1.  Go to `components/icons/`.
2.  Copy `icon-template.tsx` and rename it to your icon name (e.g., `RocketIcon.tsx`).
3.  Rename the component inside the file from `IconTemplate` to `RocketIcon`.

## 3. Paste SVG Data
1.  Open your new file.
2.  Look for the `<Path />` component.
3.  Replace the `d="..."` code with the `d` value from your copied SVG.
4.  **Important**: Change `fill="#..."` to `fill={color}`. This ensures the icon changes color when you swap themes!

**Example:**
*From Figma:*
```xml
<path d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" fill="black"/>
```

*To React Native:*
```tsx
<Path 
  d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z" 
  fill={color} // 👈 Use the prop!
/>
```

## 4. Export & Use
1.  Open `components/icons/index.ts`.
2.  Add: `export { RocketIcon } from './RocketIcon';`
3.  Use it anywhere in your app:

```tsx
import { RocketIcon } from '@/components/icons';
import { Theme } from '@/constants/theme';

// ...
<RocketIcon 
  size={24} 
  color={Theme.palette.primary} 
/>
```
