import { likeImage, unlikeImage } from '@services/api/image.service';
import { useFavoritesStore } from '@store/slices/favoritesSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';

export const useLike = () => {
    const queryClient = useQueryClient();
    const { toggleImageFavorite, isImageFavorited } = useFavoritesStore();

    const likeMutation = useMutation({
        mutationFn: async ({ imageId, isLiked }: { imageId: string; isLiked: boolean }) => {
            if (isLiked) {
                return await unlikeImage(imageId);
            } else {
                return await likeImage(imageId);
            }
        },
        onMutate: async ({ imageId }) => {
            // Optimistic update
            toggleImageFavorite(imageId);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        },
        onError: (err, { imageId }) => {
            // Rollback on error
            toggleImageFavorite(imageId);
            console.error('Like failed:', err);
        },
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ['favorites'] });
        },
    });

    const toggleLike = (imageId: string) => {
        const isLiked = isImageFavorited(imageId);
        likeMutation.mutate({ imageId, isLiked });
    };

    return {
        toggleLike,
        isLoading: likeMutation.isPending,
        isImageFavorited,
    };
};

export default useLike;
