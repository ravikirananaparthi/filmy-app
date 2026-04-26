import { getRelatedImages } from '@/src/services/api/image.service';
import { useQuery } from '@tanstack/react-query';

export const useRelatedImages = (imageId: string) => {
    return useQuery({
        queryKey: ['images', imageId, 'related'],
        queryFn: () => getRelatedImages(imageId),
        enabled: !!imageId,
        staleTime: 1000 * 60 * 5,
    });
};

export default useRelatedImages;
