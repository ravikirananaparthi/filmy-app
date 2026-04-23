import type { User } from '@types/user.types';
import { authService } from '@services/auth.service';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    token: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isHydrated: boolean;
    setUser: (user: User | null) => void;
    setSession: (token: string, refreshToken: string) => void;
    logout: () => Promise<void>;
    hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    isHydrated: false,

    setUser: (user) => set({ user, isAuthenticated: !!user }),

    setSession: (token, refreshToken) => set({ token, refreshToken }),

    logout: async () => {
        try {
            await authService.signOut();
        } catch {
            // Ignore sign-out errors — clear local state regardless
        }
        set({ user: null, token: null, refreshToken: null, isAuthenticated: false });
    },

    hydrate: async () => {
        try {
            const session = await authService.getSession();
            if (session) {
                set({
                    token: session.access_token,
                    refreshToken: session.refresh_token,
                    isAuthenticated: true,
                });
            }
        } catch {
            // No persisted session — stay unauthenticated
        } finally {
            set({ isHydrated: true });
        }
    },
}));
