import { BlurView } from 'expo-blur';
import { ArrowLeft, MoreVertical } from 'lucide-react-native';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
    onBackPress: () => void;
    onMenuPress: () => void;
}

/**
 * TopBar - Back button (left) and three-dots menu (right)
 * Renders with transparency over the image
 */
export const TopBar: React.FC<TopBarProps> = memo(({ onBackPress, onMenuPress }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
            <BlurView intensity={20} tint="dark" style={styles.blurContainer}>
                {/* Back Button */}
                <Pressable
                    style={styles.button}
                    onPress={onBackPress}
                    hitSlop={12}
                >
                    <ArrowLeft size={24} color="#fff" />
                </Pressable>

                {/* Spacer */}
                <View style={styles.spacer} />

                {/* Three Dots Menu */}
                <Pressable
                    style={styles.button}
                    onPress={onMenuPress}
                    hitSlop={12}
                >
                    <MoreVertical size={24} color="#fff" />
                </Pressable>
            </BlurView>
        </View>
    );
});

TopBar.displayName = 'TopBar';

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
    },
    blurContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    button: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spacer: {
        flex: 1,
    },
});

export default TopBar;
