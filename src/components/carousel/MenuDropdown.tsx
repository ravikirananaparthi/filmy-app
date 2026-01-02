import { WallpaperIcon } from '@/components/icons/ui-icons/wallpaper-icon';
import { Text } from '@/src/components/ui';
import React, { memo } from 'react';
import { Modal, Pressable, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuDropdownProps {
    visible: boolean;
    onClose: () => void;
    onSetWallpaper: () => void;
}

/**
 * MenuDropdown - Dropdown menu from the three-dots button
 * Currently contains: Set as Wallpaper option
 */
export const MenuDropdown: React.FC<MenuDropdownProps> = memo(({
    visible,
    onClose,
    onSetWallpaper,
}) => {
    const insets = useSafeAreaInsets();

    const handleSetWallpaper = () => {
        onSetWallpaper();
        onClose();
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={[styles.dropdown, { top: insets.top + 60 }]}>
                            {/* Set as Wallpaper Option */}
                            <Pressable
                                style={styles.menuItem}
                                onPress={handleSetWallpaper}
                            >
                                <WallpaperIcon size={22} color="#fff" />
                                <Text weight="medium" style={styles.menuText}>
                                    Set as Wallpaper
                                </Text>
                            </Pressable>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
});

MenuDropdown.displayName = 'MenuDropdown';

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    dropdown: {
        position: 'absolute',
        right: 16,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        paddingVertical: 8,
        minWidth: 180,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.15)',
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        gap: 12,
    },
    menuText: {
        fontSize: 15,
        color: '#fff',
    },
});

export default MenuDropdown;
