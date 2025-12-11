import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedHeader } from '@/components/ui/animated-header';
import { Theme } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { ScrollView, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { useMotionify } from 'react-native-motionify';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface MenuItemProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  title: string;
  subtitle?: string;
  hasSwitch?: boolean;
  switchValue?: boolean;
  onSwitchChange?: (value: boolean) => void;
  onPress?: () => void;
  danger?: boolean;
}

const MenuItem = memo(({ iconName, iconColor, title, subtitle, hasSwitch, switchValue, onSwitchChange, onPress, danger }: MenuItemProps) => {
  const handlePress = useCallback(() => {
    if (!hasSwitch) { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); onPress?.(); }
  }, [hasSwitch, onPress]);

  const handleSwitchChange = useCallback((value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSwitchChange?.(value);
  }, [onSwitchChange]);

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={hasSwitch ? 1 : 0.7} disabled={hasSwitch} style={styles.menuItem}>
      <View style={[styles.menuIconContainer, danger && styles.menuIconDanger]}><Ionicons name={iconName} size={20} color={iconColor} /></View>
      <View style={styles.menuContent}>
        <ThemedText style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</ThemedText>
        {subtitle && <ThemedText style={styles.menuSubtitle}>{subtitle}</ThemedText>}
      </View>
      {hasSwitch ? (
        <Switch value={switchValue} onValueChange={handleSwitchChange} trackColor={{ false: Theme.colors.glass.dark, true: `${Theme.palette.primary}80` }} thumbColor={switchValue ? Theme.palette.primary : Theme.colors.text.primary} />
      ) : (
        <Ionicons name="chevron-forward" size={20} color={Theme.colors.text.muted} />
      )}
    </TouchableOpacity>
  );
});

MenuItem.displayName = 'MenuItem';

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const { onScroll } = useMotionify();

  const handleDarkModeChange = useCallback((value: boolean) => setDarkMode(value), []);
  const handleNotificationsChange = useCallback((value: boolean) => setNotifications(value), []);
  const emptyHandler = useCallback(() => {}, []);

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="👤 Profile" subtitle="Manage your account" />
      <ScrollView onScroll={onScroll} scrollEventThrottle={16} contentContainerStyle={{ paddingTop: 100 + insets.top, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileAvatar}><Ionicons name="person" size={40} color={Theme.colors.text.primary} /></View>
          <View style={styles.profileInfo}>
            <ThemedText type="title" style={styles.profileName}>John Doe</ThemedText>
            <ThemedText style={styles.profileEmail}>john.doe@email.com</ThemedText>
            <View style={styles.premiumBadge}><Ionicons name="star" size={12} color={Theme.colors.status.warning} /><ThemedText style={styles.premiumText}>Premium Member</ThemedText></View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}><ThemedText style={styles.statValue}>127</ThemedText><ThemedText style={styles.statLabel}>Watched</ThemedText></View>
          <View style={styles.statCard}><ThemedText style={styles.statValue}>45</ThemedText><ThemedText style={styles.statLabel}>Watchlist</ThemedText></View>
          <View style={styles.statCard}><ThemedText style={styles.statValue}>18</ThemedText><ThemedText style={styles.statLabel}>Reviews</ThemedText></View>
        </View>

        {/* Preferences */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
          <View style={styles.menuGroup}>
            <MenuItem iconName="moon" iconColor={Theme.palette.primary} title="Dark Mode" hasSwitch switchValue={darkMode} onSwitchChange={handleDarkModeChange} />
            <MenuItem iconName="notifications" iconColor={Theme.palette.primary} title="Notifications" hasSwitch switchValue={notifications} onSwitchChange={handleNotificationsChange} />
            <MenuItem iconName="globe" iconColor={Theme.palette.primary} title="Language" subtitle="English" onPress={emptyHandler} />
            <MenuItem iconName="download" iconColor={Theme.palette.primary} title="Downloads" subtitle="5 items • 2.3 GB" onPress={emptyHandler} />
          </View>
        </View>

        {/* Support */}
        <View style={styles.menuSection}>
          <ThemedText style={styles.sectionTitle}>Support</ThemedText>
          <View style={styles.menuGroup}>
            <MenuItem iconName="shield-checkmark" iconColor={Theme.palette.primary} title="Privacy & Security" onPress={emptyHandler} />
            <MenuItem iconName="help-circle" iconColor={Theme.palette.primary} title="Help & Support" onPress={emptyHandler} />
            <MenuItem iconName="settings" iconColor={Theme.palette.primary} title="Settings" onPress={emptyHandler} />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.menuSection}>
          <View style={styles.menuGroup}>
            <MenuItem iconName="log-out" iconColor={Theme.colors.status.error} title="Sign Out" danger onPress={emptyHandler} />
          </View>
        </View>

        {/* Version */}
        <View style={styles.versionContainer}><ThemedText style={styles.versionText}>Filmy v1.0.0</ThemedText></View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background.dark },
  profileSection: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 24, gap: 16 },
  profileAvatar: { width: 80, height: 80, borderRadius: 24, backgroundColor: Theme.palette.primary, justifyContent: 'center', alignItems: 'center' },
  profileInfo: { flex: 1 },
  profileName: { color: Theme.colors.text.primary, fontSize: 24 },
  profileEmail: { color: Theme.colors.text.secondary, fontSize: 14, marginTop: 2 },
  premiumBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${Theme.colors.status.warning}26`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', marginTop: 8, gap: 4 },
  premiumText: { color: Theme.colors.status.warning, fontSize: 12, fontWeight: '600' },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 32 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 20, backgroundColor: Theme.colors.background.surface.dark, borderWidth: 1, borderColor: `${Theme.palette.primary}33` },
  statValue: { color: Theme.colors.text.primary, fontSize: 24, fontWeight: 'bold' },
  statLabel: { color: Theme.colors.text.secondary, fontSize: 12, marginTop: 4 },
  menuSection: { marginBottom: 24, paddingHorizontal: 20 },
  sectionTitle: { color: Theme.colors.text.tertiary, fontSize: 12, fontWeight: '600', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  menuGroup: { borderRadius: 20, backgroundColor: Theme.colors.background.surface.dark, borderWidth: 1, borderColor: `${Theme.palette.primary}33`, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: `${Theme.palette.primary}1A` },
  menuIconContainer: { width: 40, height: 40, borderRadius: 12, backgroundColor: `${Theme.palette.primary}26`, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuIconDanger: { backgroundColor: `${Theme.colors.status.error}26` },
  menuContent: { flex: 1 },
  menuTitle: { color: Theme.colors.text.primary, fontSize: 15, fontWeight: '500' },
  menuTitleDanger: { color: Theme.colors.status.error },
  menuSubtitle: { color: Theme.colors.text.tertiary, fontSize: 13, marginTop: 2 },
  versionContainer: { alignItems: 'center', marginTop: 8, marginBottom: 20 },
  versionText: { color: Theme.colors.text.muted, fontSize: 12 },
});
