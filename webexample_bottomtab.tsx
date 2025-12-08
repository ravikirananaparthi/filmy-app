import { Home, TrendingUp, Search, Heart, User } from 'lucide-react';
import { motion } from 'motion/react';

export type TabType = 'home' | 'trending' | 'search' | 'favorites' | 'profile';

interface BottomTabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

interface TabItem {
  id: TabType;
  icon: typeof Home;
  label: string;
}

const tabs: TabItem[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'trending', icon: TrendingUp, label: 'Trending' },
  { id: 'search', icon: Search, label: 'Search' },
  { id: 'favorites', icon: Heart, label: 'Favorites' },
  { id: 'profile', icon: User, label: 'Profile' },
];

export function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 pb-safe">
      <div className="mx-4 mb-4">
        <div className="glass rounded-3xl px-3 py-3 glow-purple">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`relative flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all duration-300 ${
                    isActive ? 'gradient-primary' : ''
                  }`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Glow indicator for active tab */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 glow-purple-strong rounded-2xl"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}

                  {/* Icon with animation */}
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                    className="relative z-10"
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-300 ${
                        isActive ? 'text-white' : 'text-gray-400'
                      }`}
                    />
                  </motion.div>

                  {/* Label - only show for active tab */}
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-xs text-white relative z-10"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}