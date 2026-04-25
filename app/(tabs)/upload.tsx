/**
 * Upload tab stub.
 * The AnimatedTabBar intercepts presses on this tab and pushes
 * to /upload/index instead of rendering this screen.
 * This file must exist so Expo Router registers the tab route.
 */
import { useEffect } from 'react';
import { router } from 'expo-router';

export default function UploadTabStub() {
    useEffect(() => {
        // Redirect away immediately if somehow landed here
        router.replace('/(tabs)' as any);
    }, []);
    return null;
}
