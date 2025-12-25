import React, { createContext, useCallback, useContext, useRef, useState } from 'react';

interface RefreshContextValue {
    /**
     * Whether a refresh is currently in progress
     */
    isRefreshing: boolean;

    /**
     * Trigger refresh programmatically (e.g., from tab bar press)
     */
    triggerRefresh: () => void;

    /**
     * Register the actual refresh function (called by the screen)
     */
    registerRefreshHandler: (handler: () => unknown) => void;

    /**
     * Call this when refresh completes
     */
    completeRefresh: () => void;
}

const RefreshContext = createContext<RefreshContextValue | null>(null);

export function RefreshProvider({ children }: { children: React.ReactNode }) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshHandlerRef = useRef<(() => unknown) | null>(null);

    const registerRefreshHandler = useCallback((handler: () => unknown) => {
        refreshHandlerRef.current = handler;
    }, []);

    const triggerRefresh = useCallback(() => {
        if (refreshHandlerRef.current && !isRefreshing) {
            setIsRefreshing(true);
            const result = refreshHandlerRef.current();

            // If the handler returns a promise, wait for it
            if (result instanceof Promise) {
                result.finally(() => setIsRefreshing(false));
            }
        }
    }, [isRefreshing]);

    const completeRefresh = useCallback(() => {
        setIsRefreshing(false);
    }, []);

    return (
        <RefreshContext.Provider
            value={{
                isRefreshing,
                triggerRefresh,
                registerRefreshHandler,
                completeRefresh,
            }}
        >
            {children}
        </RefreshContext.Provider>
    );
}

export function useRefreshContext() {
    const context = useContext(RefreshContext);
    if (!context) {
        throw new Error('useRefreshContext must be used within a RefreshProvider');
    }
    return context;
}
