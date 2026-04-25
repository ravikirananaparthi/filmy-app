import { Theme } from '@constants/theme';
import { useAuthStore } from '@store/slices/authSlice';
import { router } from 'expo-router';
import { ChevronRight, LogOut, Mail, Moon } from 'lucide-react-native';
import React, { useCallback } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsRowProps {
    icon: React.ReactNode;
    label: string;
    value?: string;
    onPress?: () => void;
    showChevron?: boolean;
    destructive?: boolean;
    isDark: boolean;
}

function SettingsRow({ icon, label, value, onPress, showChevron = true, destructive = false, isDark }: SettingsRowProps) {
    const textColor = destructive ? '#FF3B30' : (isDark ? '#FFFFFF' : '#111111');
    const subtextColor = isDark ? '#999999' : '#666666';
    const rowBg = isDark ? '#1C1C1E' : '#FFFFFF';

    return (
        <TouchableOpacity
            style={[styles.row, { backgroundColor: rowBg }]}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <View style={styles.rowIcon}>{icon}</View>
            <Text style={[styles.rowLabel, { color: textColor }]}>{label}</Text>
            {value ? (
                <Text style={[styles.rowValue, { color: subtextColor }]} numberOfLines={1}>
                    {value}
                </Text>
            ) : null}
            {showChevron && onPress && !destructive ? (
                <ChevronRight size={16} color={subtextColor} />
            ) : null}
        </TouchableOpacity>
    );
}

function SectionHeader({ title, isDark }: { title: string; isDark: boolean }) {
    return (
        <Text style={[styles.sectionHeader, { color: isDark ? '#999999' : '#666666' }]}>
            {title}
        </Text>
    );
}

export function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const user = useAuthStore((s) => s.user);
    const logout = useAuthStore((s) => s.logout);

    const bgColor = isDark ? Theme.colors.background.dark : '#F2F2F7';
    const separatorColor = isDark ? '#2A2A2A' : '#E5E5E5';
    const iconColor = isDark ? '#EBEBF5' : '#3C3C43';

    const handleLogout = useCallback(() => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Sign Out',
                style: 'destructive',
                onPress: async () => {
                    await logout();
                    router.replace('/(auth)' as any);
                },
            },
        ]);
    }, [logout]);

    return (
        <View style={[styles.container, { backgroundColor: bgColor }]}>
            {/* Back header */}
            <View style={[styles.header, { paddingTop: insets.top, borderBottomColor: separatorColor }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ChevronRight size={22} color={iconColor} style={{ transform: [{ rotate: '180deg' }] }} />
                    <Text style={[styles.backLabel, { color: Theme.colors.primary.main }]}>Profile</Text>
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: isDark ? '#FFFFFF' : '#111111' }]}>Settings</Text>
                <View style={styles.backButton} />
            </View>

            <ScrollView
                contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
                showsVerticalScrollIndicator={false}
            >
                {/* Account section */}
                <SectionHeader title="ACCOUNT" isDark={isDark} />
                <View style={[styles.section, { borderColor: separatorColor }]}>
                    <SettingsRow
                        icon={<Mail size={18} color={iconColor} />}
                        label="Email"
                        value={user?.email ?? ''}
                        showChevron={false}
                        isDark={isDark}
                    />
                </View>

                {/* App section */}
                <SectionHeader title="APP" isDark={isDark} />
                <View style={[styles.section, { borderColor: separatorColor }]}>
                    <SettingsRow
                        icon={<Moon size={18} color={iconColor} />}
                        label="Dark Mode"
                        value="System"
                        showChevron={false}
                        isDark={isDark}
                    />
                </View>

                {/* Logout */}
                <View style={[styles.section, { borderColor: separatorColor, marginTop: 32 }]}>
                    <SettingsRow
                        icon={<LogOut size={18} color="#FF3B30" />}
                        label="Sign Out"
                        showChevron={false}
                        onPress={handleLogout}
                        destructive
                        isDark={isDark}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 12,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        minWidth: 80,
    },
    backLabel: {
        fontSize: 16,
        marginLeft: 2,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '600',
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: 0.5,
        marginTop: 28,
        marginBottom: 6,
        marginHorizontal: 20,
    },
    section: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        overflow: 'hidden',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        minHeight: 50,
    },
    rowIcon: {
        width: 28,
        alignItems: 'center',
        marginRight: 12,
    },
    rowLabel: {
        flex: 1,
        fontSize: 16,
    },
    rowValue: {
        fontSize: 14,
        marginRight: 6,
        maxWidth: 160,
    },
});
