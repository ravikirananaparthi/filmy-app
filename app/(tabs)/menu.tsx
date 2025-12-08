import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimatedHeader } from '@/components/ui/animated-header';
import { useScrollContext } from '@/contexts/scroll-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback } from 'react';
import { StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedScrollHandler } from 'react-native-reanimated';
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

const MenuItem = memo(({ 
  iconName, 
  iconColor, 
  title, 
  subtitle, 
  hasSwitch, 
  switchValue, 
  onSwitchChange,
  onPress, 
  danger 
}: MenuItemProps) => {
  const handlePress = useCallback(() => {
    if (!hasSwitch) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onPress?.();
    }
  }, [hasSwitch, onPress]);

  const handleSwitchChange = useCallback((value: boolean) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onSwitchChange?.(value);
  }, [onSwitchChange]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={hasSwitch ? 1 : 0.7}
      disabled={hasSwitch}
      style={styles.menuItem}
    >
      <View style={[styles.menuIconContainer, danger && styles.menuIconDanger]}>
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
      <View style={styles.menuContent}>
        <ThemedText style={[styles.menuTitle, danger && styles.menuTitleDanger]}>{title}</ThemedText>
        {subtitle && <ThemedText style={styles.menuSubtitle}>{subtitle}</ThemedText>}
      </View>
      {hasSwitch ? (
        <Switch
          value={switchValue}
          onValueChange={handleSwitchChange}
          trackColor={{ false: 'rgba(255, 255, 255, 0.1)', true: 'rgba(139, 92, 246, 0.5)' }}
          thumbColor={switchValue ? '#8B5CF6' : '#FFFFFF'}
        />
      ) : (
        <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.4)" />
      )}
    </TouchableOpacity>
  );
});

MenuItem.displayName = 'MenuItem';

export default function MenuScreen() {
  const insets = useSafeAreaInsets();
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);
  const { scrollY } = useScrollContext();

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => { scrollY.value = event.contentOffset.y; },
  });

  const handleDarkModeChange = useCallback((value: boolean) => {
    setDarkMode(value);
  }, []);

  const handleNotificationsChange = useCallback((value: boolean) => {
    setNotifications(value);
  }, []);

  const emptyHandler = useCallback(() => {}, []);

  return (
    <ThemedView style={styles.container}>
      <AnimatedHeader title="👤 Profile" subtitle="Manage your account" scrollY={scrollY} />
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingTop: 100 + insets.top, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
            {/* Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.profileAvatar}>
                <Ionicons name="person" size={40} color="#FFFFFF" />
              </View>
              <View style={styles.profileInfo}>
                <ThemedText type="title" style={styles.profileName}>John Doe</ThemedText>
                <ThemedText style={styles.profileEmail}>john.doe@email.com</ThemedText>
                <View style={styles.premiumBadge}>
                  <Ionicons name="star" size={12} color="#FBBF24" />
                  <ThemedText style={styles.premiumText}>Premium Member</ThemedText>
                </View>
              </View>
            </View>

            {/* Stats Cards */}
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <ThemedText style={styles.statValue}>127</ThemedText>
                <ThemedText style={styles.statLabel}>Watched</ThemedText>
              </View>
              <View style={styles.statCard}>
                <ThemedText style={styles.statValue}>45</ThemedText>
                <ThemedText style={styles.statLabel}>Watchlist</ThemedText>
              </View>
              <View style={styles.statCard}>
                <ThemedText style={styles.statValue}>18</ThemedText>
                <ThemedText style={styles.statLabel}>Reviews</ThemedText>
              </View>
            </View>

            {/* Preferences */}
            <View style={styles.menuSection}>
              <ThemedText style={styles.sectionTitle}>Preferences</ThemedText>
              <View style={styles.menuGroup}>
                <MenuItem
                  iconName="moon"
                  iconColor="#8B5CF6"
                  title="Dark Mode"
                  hasSwitch
                  switchValue={darkMode}
                  onSwitchChange={handleDarkModeChange}
                />
                <MenuItem
                  iconName="notifications"
                  iconColor="#8B5CF6"
                  title="Notifications"
                  hasSwitch
                  switchValue={notifications}
                  onSwitchChange={handleNotificationsChange}
                />
                <MenuItem
                  iconName="globe"
                  iconColor="#8B5CF6"
                  title="Language"
                  subtitle="English"
                  onPress={emptyHandler}
                />
                <MenuItem
                  iconName="download"
                  iconColor="#8B5CF6"
                  title="Downloads"
                  subtitle="5 items • 2.3 GB"
                  onPress={emptyHandler}
                />
              </View>
            </View>

            {/* Support */}
            <View style={styles.menuSection}>
              <ThemedText style={styles.sectionTitle}>Support</ThemedText>
              <View style={styles.menuGroup}>
                <MenuItem
                  iconName="shield-checkmark"
                  iconColor="#8B5CF6"
                  title="Privacy & Security"
                  onPress={emptyHandler}
                />
                <MenuItem
                  iconName="help-circle"
                  iconColor="#8B5CF6"
                  title="Help & Support"
                  onPress={emptyHandler}
                />
                <MenuItem
                  iconName="settings"
                  iconColor="#8B5CF6"
                  title="Settings"
                  onPress={emptyHandler}
                />
              </View>
            </View>

            {/* Sign Out */}
            <View style={styles.menuSection}>
              <View style={styles.menuGroup}>
                <MenuItem
                  iconName="log-out"
                  iconColor="#EF4444"
                  title="Sign Out"
                  danger
                  onPress={emptyHandler}
                />
              </View>
            </View>

            {/* Version */}
            <View style={styles.versionContainer}>
              <ThemedText style={styles.versionText}>Filmy v1.0.0</ThemedText>
            </View>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F19',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 16,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  profileEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    marginTop: 2,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
    gap: 4,
  },
  premiumText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(30, 30, 45, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
  },
  menuSection: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4,
  },
  menuGroup: {
    borderRadius: 20,
    backgroundColor: 'rgba(30, 30, 45, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuIconDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
  },
  menuTitleDanger: {
    color: '#EF4444',
  },
  menuSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 13,
    marginTop: 2,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 20,
  },
  versionText: {
    color: 'rgba(255, 255, 255, 0.3)',
    fontSize: 12,
  },
});
