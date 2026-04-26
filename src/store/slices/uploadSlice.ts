import { create } from 'zustand';

export interface SelectedImage {
    uri: string;
    width: number;
    height: number;
    type: string;       // mime type e.g. "image/jpeg"
    fileName: string;   // filename for FormData
}

interface UploadState {
    selectedImages: SelectedImage[];
    tagsPerImage: string[][];   // one string[] per image
    uploadProgress: number;     // 0–100
    isUploading: boolean;

    setSelectedImages: (images: SelectedImage[]) => void;
    setTagsForImage: (index: number, tags: string[]) => void;
    applyTagsToAll: (tags: string[]) => void;
    setUploadProgress: (progress: number) => void;
    setIsUploading: (value: boolean) => void;
    reset: () => void;
}

export const useUploadStore = create<UploadState>((set, get) => ({
    selectedImages: [],
    tagsPerImage: [],
    uploadProgress: 0,
    isUploading: false,

    setSelectedImages: (images) =>
        set({
            selectedImages: images,
            tagsPerImage: images.map(() => []),
        }),

    setTagsForImage: (index, tags) =>
        set((state) => {
            const next = [...state.tagsPerImage];
            next[index] = tags;
            return { tagsPerImage: next };
        }),

    applyTagsToAll: (tags) =>
        set((state) => ({
            tagsPerImage: state.selectedImages.map(() => [...tags]),
        })),

    setUploadProgress: (progress) => set({ uploadProgress: progress }),

    setIsUploading: (value) => set({ isUploading: value }),

    reset: () =>
        set({
            selectedImages: [],
            tagsPerImage: [],
            uploadProgress: 0,
            isUploading: false,
        }),
}));
