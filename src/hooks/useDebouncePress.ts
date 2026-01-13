import { useCallback, useRef } from 'react';

/**
 * Hook to prevent rapid double-taps from triggering multiple actions.
 * Useful for navigation to prevent pushing the same screen twice.
 * 
 * @param callback - The function to debounce
 * @param delay - Minimum milliseconds between calls (default: 500ms)
 */
export function useDebouncePress<T extends (...args: any[]) => void>(
    callback: T,
    delay: number = 500
): T {
    const lastCallTime = useRef<number>(0);

    return useCallback((...args: Parameters<T>) => {
        const now = Date.now();
        if (now - lastCallTime.current >= delay) {
            lastCallTime.current = now;
            callback(...args);
        }
    }, [callback, delay]) as T;
}

export default useDebouncePress;
