import { Theme } from '@/constants/theme';
import { Text, TextInput } from '@/src/components/ui';
import { useCreateFolder } from '@/src/hooks/useFavorites';
import { TrueSheet } from '@lodev09/react-native-true-sheet';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    View,
    useColorScheme,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface CreateFolderSheetRef {
    present: () => Promise<void>;
    dismiss: () => Promise<void>;
}

interface CreateFolderSheetProps {
    onCreated?: (folderId: string, folderName: string) => void;
}

export const CreateFolderSheet = forwardRef<CreateFolderSheetRef, CreateFolderSheetProps>(
    ({ onCreated }, ref) => {
        const sheetRef = useRef<TrueSheet>(null);
        const inputRef = useRef<any>(null);
        const insets = useSafeAreaInsets();
        const colorScheme = useColorScheme();
        const isDark = colorScheme === 'dark';

        const [folderName, setFolderName] = useState('');
        const [error, setError] = useState('');

        const createFolder = useCreateFolder();

        useImperativeHandle(ref, () => ({
            present: async () => {
                setFolderName('');
                setError('');
                await sheetRef.current?.present();
                // Focus input after sheet is presented
                setTimeout(() => {
                    inputRef.current?.focus();
                }, 300);
            },
            dismiss: async () => {
                Keyboard.dismiss();
                await sheetRef.current?.dismiss();
            },
        }));

        const backgroundColor = isDark ? '#1C1C1E' : '#F2F2F7';
        const textColor = isDark ? '#FFFFFF' : '#000000';
        const secondaryTextColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';
        const inputBg = isDark ? '#2C2C2E' : '#FFFFFF';
        const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const placeholderColor = isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)';

        const handleCreate = async () => {
            const trimmedName = folderName.trim();

            if (!trimmedName) {
                setError('Please enter a folder name');
                return;
            }

            if (trimmedName.length > 100) {
                setError('Folder name is too long');
                return;
            }

            try {
                Keyboard.dismiss();
                const result = await createFolder.mutateAsync(trimmedName);
                onCreated?.(result.data.folder.id, result.data.folder.name);
                sheetRef.current?.dismiss();
            } catch (err: any) {
                setError(err?.response?.data?.message || 'Failed to create folder');
            }
        };

        const isValid = folderName.trim().length > 0;

        return (
            <TrueSheet
                ref={sheetRef}
                detents={[0.4]}
                cornerRadius={24}
                grabber={true}
                backgroundColor={backgroundColor}
                header={
                    <View style={[styles.header, { backgroundColor, borderBottomColor: borderColor }]}>
                        <Text weight="bold" style={[styles.title, { color: textColor }]}>
                            New Collection
                        </Text>
                        <Text style={[styles.subtitle, { color: secondaryTextColor }]}>
                            Give your collection a name
                        </Text>
                    </View>
                }
                footer={
                    <View style={[styles.footer, { backgroundColor, paddingBottom: insets.bottom + 10 }]}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.createButton,
                                { backgroundColor: Theme.colors.primary.main },
                                pressed && styles.buttonPressed,
                                (!isValid || createFolder.isPending) && styles.buttonDisabled,
                            ]}
                            onPress={handleCreate}
                            disabled={!isValid || createFolder.isPending}
                        >
                            {createFolder.isPending ? (
                                <ActivityIndicator color="#fff" size="small" />
                            ) : (
                                <Text weight="semibold" style={styles.buttonText}>
                                    Create Collection
                                </Text>
                            )}
                        </Pressable>
                    </View>
                }
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.container}
                >
                    {/* Input */}
                    <View style={styles.inputContainer}>
                        <TextInput
                            ref={inputRef}
                            style={[
                                styles.input,
                                {
                                    backgroundColor: inputBg,
                                    color: textColor,
                                    borderColor: error ? '#FF3B30' : borderColor,
                                },
                            ]}
                            placeholder="Collection name"
                            placeholderTextColor={placeholderColor}
                            value={folderName}
                            onChangeText={(text) => {
                                setFolderName(text);
                                setError('');
                            }}
                            maxLength={100}
                            returnKeyType="done"
                            onSubmitEditing={handleCreate}
                            blurOnSubmit={false}
                        />
                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}
                    </View>
                </KeyboardAvoidingView>
            </TrueSheet>
        );
    }
);

CreateFolderSheet.displayName = 'CreateFolderSheet';

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 6,

        alignItems: 'center',
    },
    title: {
        fontSize: 17,
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 12,
    },
    footer: {
        paddingHorizontal: 16,
        paddingTop: 7,
        paddingBottom: 5,
    },
    inputContainer: {
        paddingVertical: 20,
    },
    input: {
        height: 50,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    errorText: {
        color: '#FF3B30',
        fontSize: 12,
        marginTop: 8,
        paddingLeft: 4,
    },
    createButton: {
        paddingVertical: 12,
        borderRadius: 12,
        alignItems: 'center',
    },
    buttonPressed: {
        opacity: 0.8,
        transform: [{ scale: 0.98 }],
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 15,
    },
});

export default CreateFolderSheet;
