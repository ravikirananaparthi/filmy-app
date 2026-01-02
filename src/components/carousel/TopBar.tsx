import { BackIcon } from '@/components/icons/ui-icons/back-icon';
import { ThreeDotsIcon } from '@/components/icons/ui-icons/threedots-icon';
import React, { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopBarProps {
    onBackPress: () => void;
    onMenuPress: () => void;
}

// Button size (same as BottomBar for consistency)
const BUTTON_SIZE = 40;
const BUTTON_RADIUS = 24;

/**
 * TopBar - Floating buttons only, no bar
 * Back button (top-left) and three-dots menu (top-right)
 */
export const TopBar: React.FC<TopBarProps> = memo(({ onBackPress, onMenuPress }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
            {/* Back Button - Left */}
            <Pressable
                style={styles.iconButton}
                onPress={onBackPress}
                hitSlop={12}
            >
                <BackIcon size={22} color="#fff" />
            </Pressable>

            {/* Spacer */}
            <View style={styles.spacer} />

            {/* Three Dots Menu - Right */}
            <Pressable
                style={styles.iconButton}
                onPress={onMenuPress}
                hitSlop={12}
            >
                <ThreeDotsIcon size={22} color="#fff" />
            </Pressable>
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
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    iconButton: {
        width: BUTTON_SIZE,
        height: BUTTON_SIZE,
        borderRadius: BUTTON_RADIUS,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
    },
    spacer: {
        flex: 1,
    },
});

export default TopBar;
