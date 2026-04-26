import { Theme } from '@constants/theme';
import { useAuthStore } from '@store/slices/authSlice';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Settings } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUserProfile } from '../hooks/useUserProfile';
import { useUserUploads } from '../hooks/useUserUploads';

export function ProfileHeader() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const user = useAuthStore((s) => s.user);
    const { data: profile } = useUserProfile();
    const { data: uploadsData } = useUserUploads();

    const displayName = profile?.displayName ?? user?.display_name ?? 'User';
    const email = profile?.email ?? user?.email ?? '';
    const avatarUrl = profile?.avatarUrl ?? user?.avatar_url;
    const pinsCount = profile?.postsCount ?? 0;
    const followingCount = profile?.followingCount ?? 0;
    const initials = displayName.charAt(0).toUpperCase();

    const textColor = isDark ? '#FFFFFF' : '#111111';
    const subtextColor = isDark ? '#999999' : '#666666';
    const dividerColor = isDark ? '#2A2A2A' : '#E5E5E5';
    const bgColor = isDark ? Theme.colors.background.dark : Theme.colors.background.light;

    return (
        <View style={[styles.container, { backgroundColor: bgColor, paddingTop: insets.top }]}>
            {/* Top row: settings icon */}
            <View style={styles.topRow}>
                <TouchableOpacity
                    style={styles.settingsButton}
                    onPress={() => router.push('/profile/settings' as any)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Settings size={22} color={subtextColor} />
                </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View style={styles.avatarContainer}>
                {avatarUrl ? (
                    <Image
                        source={{ uri: avatarUrl }}
                        style={styles.avatar}
                        contentFit="cover"
                        transition={200}
                    />
                ) : (
                    <View style={[styles.avatarFallback, { backgroundColor: Theme.colors.primary.main }]}>
                        <Text style={styles.avatarInitials}>{initials}</Text>
                    </View>
                )}
            </View>

            {/* Name + Email */}
            <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
                {displayName}
            </Text>
            <Text style={[styles.email, { color: subtextColor }]} numberOfLines={1}>
                {email}
            </Text>

            {/* Stats row */}
            <View style={[styles.statsRow, { borderColor: dividerColor }]}>
                <View style={styles.statItem}>
                    <Text style={[styles.statCount, { color: textColor }]}>{pinsCount}</Text>
                    <Text style={[styles.statLabel, { color: subtextColor }]}>Posts</Text>
                </View>
                <View style={[styles.statVerticalDivider, { backgroundColor: dividerColor }]} />
                <TouchableOpacity
                    style={styles.statItem}
                    onPress={() => {
                        // Coming soon
                    }}
                >
                    <Text style={[styles.statCount, { color: textColor }]}>{followingCount}</Text>
                    <Text style={[styles.statLabel, { color: subtextColor }]}>Following</Text>
                </TouchableOpacity>
            </View>

            {/* Section tab */}
            <View style={[styles.sectionTabRow, { borderBottomColor: dividerColor }]}>
                <View style={styles.sectionTab}>
                    <Text style={[styles.sectionTabText, { color: textColor }]}>Posts</Text>
                    <View style={[styles.sectionTabIndicator, { backgroundColor: Theme.colors.primary.main }]} />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 0,
    },
    topRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 12,
    },
    settingsButton: {
        padding: 4,
    },
    avatarContainer: {
        marginTop: 8,
        marginBottom: 12,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    avatarFallback: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        fontSize: 32,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    name: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
        textAlign: 'center',
    },
    email: {
        fontSize: 13,
        marginBottom: 20,
        textAlign: 'center',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingVertical: 12,
        width: '100%',
        justifyContent: 'center',
        marginBottom: 0,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statCount: {
        fontSize: 18,
        fontWeight: '700',
    },
    statLabel: {
        fontSize: 12,
        marginTop: 2,
    },
    statVerticalDivider: {
        width: StyleSheet.hairlineWidth,
        height: 32,
    },
    sectionTabRow: {
        flexDirection: 'row',
        width: '100%',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 0,
    },
    sectionTab: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    sectionTabText: {
        fontSize: 14,
        fontWeight: '600',
    },
    sectionTabIndicator: {
        height: 2,
        width: '100%',
        marginTop: 8,
        borderRadius: 1,
    },
});
