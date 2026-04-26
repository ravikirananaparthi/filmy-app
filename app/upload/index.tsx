/**
 * /upload — no longer used as an entry screen.
 * The upload sheet now lives in (tabs)/_layout.tsx and is opened directly
 * by the tab bar without any route navigation.
 * This file exists only so Expo Router doesn't warn about an orphaned segment.
 */
import { router } from 'expo-router';
import { useEffect } from 'react';

export default function UploadIndexRedirect() {
    useEffect(() => {
        router.replace('/(tabs)' as any);
    }, []);
    return null;
}
