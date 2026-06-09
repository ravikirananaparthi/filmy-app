# X Thread: Scroll-Reactive Floating Bottom Tabs

## 1/8

I built a scroll-reactive floating bottom tab bar in React Native.

Scroll down: the tabs collapse.
Scroll up: they return.
Switch tabs: the active indicator springs into place.
The center create button stays distinct.

Here is how it works, with the actual code in the thread.

Attach: short screen recording of the final interaction.

## 2/8

I call this pattern:

**Direction-Aware Collapsing Bottom Tab Bar**

It is not just a hidden tab bar.

The UI responds to scroll intent: it gets out of the way while someone is browsing, then returns as soon as navigation becomes useful again.

## 3/8

The architecture:

1. A provider shares scroll direction.
2. Each feed passes `onScroll` to its list.
3. The tab wrapper translates vertically.
4. Reanimated springs the indicator.

Separating scroll motion from selection motion keeps the code easy to reason about.

Attach: `01-scroll-signal.png`

## 4/8

Connect the screen's real scrollable list to shared motion state.

Do not add a second `ScrollView` just for animation.

The `FlashList` stays the only scroll container and receives `onScroll`.

That avoids nested-scroll bugs and preserves pagination.

Attach: `02-list-wiring.png`

## 5/8

Wrap the custom bar in a direction-aware animated view.

`hideOn="down"` moves it below the viewport. Reversing direction brings it back.

Include the tab height and safe-area inset in the distance, or the pill may remain slightly visible on iPhone.

Attach: `03-collapse-wrapper.png`

## 6/8

Image 4 covers the separate active-tab indicator animation.

Map each route to a slot, calculate its X position, then spring the indicator there with Reanimated.

The center action returns `null`, so it can open another flow without moving the indicator.

Attach: `04-active-indicator.png`

## 7/8

The small details made it feel finished:

- `304px` max-width capsule
- ~56px pressable slots
- safe-area-aware padding
- light haptics for navigation
- stronger haptic for create
- route names drive animation, not transient indexes

Animation should feel quiet, not needy.

## 8/8

The principle I am keeping:

**Content gets the space while the user explores. Navigation returns when their intent changes.**

Built with Expo Router, Reanimated and `react-native-motionify`.

Would you use this pattern in your app?

#ReactNative #Expo #MobileDev

## Posting Notes

- Lead with a 5-8 second screen recording on post 1.
- Use one code screenshot on posts 3-6.
- Add alt text describing what each screenshot demonstrates.
- Pin the completed thread, not an individual reply.
- Keep the screenshots in their numbered order.
