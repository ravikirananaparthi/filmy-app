import { Text } from '@/src/components/ui';
import { Theme } from '@constants/theme';
import { BlurView } from 'expo-blur';
import { Download } from 'lucide-react-native';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LikeButton } from '../common/LikeButton';

interface BottomBarProps {
    actressName: string;
    imageId: string;
    onDownloadPress: () => void;
    onLikePress: (imageId: string) => void;
}

/**
 * BottomBar - Download (left), actress name (center), like (right)
 * Based on reference UI design
 */
export const BottomBar: React.FC<BottomBarProps> = memo(({
    actressName,
    imageId,
    onDownloadPress,
    onLikePress,
}) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 8 }]}>
            <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
                {/* Download Button */}
                <Pressable
                    style={styles.actionButton}
                    onPress={onDownloadPress}
                    hitSlop={12}
                >
                    <Download size={22} color="#fff" />
                </Pressable>

                {/* Actress Name - Centered */}
                <View style={styles.nameContainer}>
                    <Text weight="semibold" style={styles.hashtag}>#</Text>
                    <Text weight="semibold" style={styles.actressName} numberOfLines={1}>
                        {actressName}
                    </Text>
                    <Text weight="bold" style={styles.verifiedBadge}>✓</Text>
                </View>

                {/* Like Button */}
                <View style={styles.likeContainer}>
                    <LikeButton
                        imageId={imageId}
                        onLikePress={onLikePress}
                        size={28}
                        activeColor="#fff"
                        inactiveColor="rgba(255, 255, 255, 0.7)"
                    />
                </View>
            </BlurView>
        </View>
    );
});

BottomBar.displayName = 'BottomBar';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    blurContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        marginHorizontal: 16,
        marginBottom: 8,
        borderRadius: 32,
        overflow: 'hidden',
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 12,
    },
    hashtag: {
        fontSize: 18,
        color: '#fff',
    },
    actressName: {
        fontSize: 18,
        color: '#fff',
        marginLeft: 2,
        maxWidth: 150,
    },
    verifiedBadge: {
        fontSize: 14,
        color: Theme.colors.primary.main,
        marginLeft: 6,
    },
    likeContainer: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default BottomBar;
