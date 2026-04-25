import { useQuery } from '@tanstack/react-query';
import { getUserProfile } from '@services/api/user.service';

export const userProfileKeys = {
    profile: ['userProfile'] as const,
};

export function useUserProfile() {
    return useQuery({
        queryKey: userProfileKeys.profile,
        queryFn: getUserProfile,
        staleTime: 5 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
    });
}
