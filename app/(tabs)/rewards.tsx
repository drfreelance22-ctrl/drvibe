import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/components/screen-container';
import { useUser } from '@/lib/user-context';
import { Badge } from '@/types';
import { generateId } from '@/lib/utils';

const BADGE_DEFINITIONS = [
  { id: 'first_mood', name: 'Mood Tracker', description: 'Log your first mood', icon: '😊' },
  { id: 'mood_streak_7', name: '7-Day Mood Streak', description: 'Log mood for 7 consecutive days', icon: '📅' },
  { id: 'selfcare_complete', name: 'Self-Care Master', description: 'Complete all 6 self-care activities in one day', icon: '💛' },
  { id: 'meditation_first', name: 'Meditation Beginner', description: 'Upload your first meditation', icon: '🧘' },
  { id: 'meditation_5', name: 'Meditation Enthusiast', description: 'Upload 5 meditations', icon: '🎵' },
  { id: 'moon_tracker', name: 'Lunar Observer', description: 'View moon phases 5 times', icon: '🌙' },
  { id: 'affirmation_lover', name: 'Affirmation Lover', description: 'View affirmations 20 times', icon: '✨' },
  { id: 'wellness_champion', name: 'Wellness Champion', description: 'Unlock 5 badges', icon: '🏆' },
];

export default function RewardsScreen() {
  const { user } = useUser();
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState({
    moodEntries: 0,
    selfCareEntries: 0,
    meditations: 0,
    moonViews: 0,
    affirmationViews: 0,
  });

  // Load badges and calculate stats
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load badges
        const savedBadges = await AsyncStorage.getItem('badges');
        if (savedBadges) {
          setBadges(JSON.parse(savedBadges));
        }

        // Load and count mood entries
        const moodEntries = await AsyncStorage.getItem('mood_entries');
        const moodCount = moodEntries ? JSON.parse(moodEntries).length : 0;

        // Load and count self-care entries
        const selfCareEntries = await AsyncStorage.getItem('selfcare_entries');
        const selfCareCount = selfCareEntries ? JSON.parse(selfCareEntries).length : 0;

        // Load and count meditations
        const meditations = await AsyncStorage.getItem('meditations');
        const meditationCount = meditations ? JSON.parse(meditations).length : 0;

        setStats({
          moodEntries: moodCount,
          selfCareEntries: selfCareCount,
          meditations: meditationCount,
          moonViews: 0,
          affirmationViews: 0,
        });

        // Check and award badges
        await checkAndAwardBadges(moodCount, selfCareCount, meditationCount);
      } catch (error) {
        console.error('Failed to load data:', error);
      }
    };

    loadData();
  }, []);

  const checkAndAwardBadges = async (moodCount: number, selfCareCount: number, meditationCount: number) => {
    const newBadges: Badge[] = [];

    // First mood badge
    if (moodCount >= 1 && !badges.some((b) => b.badgeType === 'mood')) {
      newBadges.push({
        id: generateId(),
        userId: user?.id || '',
        badgeType: 'mood',
        name: 'Mood Tracker',
        description: 'Log your first mood',
        unlockedAt: Date.now(),
        icon: '😊',
      });
    }

    // Self-care master badge
    if (selfCareCount >= 6 && !badges.some((b) => b.badgeType === 'selfcare')) {
      newBadges.push({
        id: generateId(),
        userId: user?.id || '',
        badgeType: 'selfcare',
        name: 'Self-Care Master',
        description: 'Complete all 6 self-care activities',
        unlockedAt: Date.now(),
        icon: '💛',
      });
    }

    // Meditation badge
    if (meditationCount >= 1 && !badges.some((b) => b.badgeType === 'meditation')) {
      newBadges.push({
        id: generateId(),
        userId: user?.id || '',
        badgeType: 'meditation',
        name: 'Meditation Beginner',
        description: 'Upload your first meditation',
        unlockedAt: Date.now(),
        icon: '🧘',
      });
    }

    if (newBadges.length > 0) {
      const updated = [...badges, ...newBadges];
      await AsyncStorage.setItem('badges', JSON.stringify(updated));
      setBadges(updated);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-slate-100">Rewards & Achievements</Text>
            <Text className="text-sm text-slate-400">Celebrate your wellness journey</Text>
          </View>

          {/* Stats Overview */}
          <View className="gap-3">
            <View className="flex-row gap-3">
              <View className="flex-1 bg-slate-800 rounded-xl p-4 border border-slate-700 items-center gap-2">
                <Text className="text-3xl">📊</Text>
                <Text className="text-2xl font-bold text-violet-300">{stats.moodEntries}</Text>
                <Text className="text-xs text-slate-400 text-center">Mood Entries</Text>
              </View>
              <View className="flex-1 bg-slate-800 rounded-xl p-4 border border-slate-700 items-center gap-2">
                <Text className="text-3xl">💛</Text>
                <Text className="text-2xl font-bold text-amber-300">{stats.selfCareEntries}</Text>
                <Text className="text-xs text-slate-400 text-center">Self-Care Logs</Text>
              </View>
            </View>
            <View className="flex-row gap-3">
              <View className="flex-1 bg-slate-800 rounded-xl p-4 border border-slate-700 items-center gap-2">
                <Text className="text-3xl">🧘</Text>
                <Text className="text-2xl font-bold text-cyan-300">{stats.meditations}</Text>
                <Text className="text-xs text-slate-400 text-center">Meditations</Text>
              </View>
              <View className="flex-1 bg-slate-800 rounded-xl p-4 border border-slate-700 items-center gap-2">
                <Text className="text-3xl">🏆</Text>
                <Text className="text-2xl font-bold text-emerald-300">{badges.length}</Text>
                <Text className="text-xs text-slate-400 text-center">Badges</Text>
              </View>
            </View>
          </View>

          {/* Badges Section */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Achievements Unlocked ({badges.length})
            </Text>

            {badges.length > 0 ? (
              <View className="flex-row flex-wrap gap-3">
                {badges.map((badge) => (
                  <Animated.View
                    key={badge.id}
                    entering={ZoomIn.duration(400)}
                    className="flex-1 min-w-[45%] bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl p-4 items-center justify-center gap-2 border-2 border-emerald-400"
                  >
                    <Text className="text-4xl">{badge.icon}</Text>
                    <Text className="text-xs font-semibold text-white text-center">{badge.name}</Text>
                    <Text className="text-xs text-emerald-100 text-center">{formatDate(badge.unlockedAt)}</Text>
                  </Animated.View>
                ))}
              </View>
            ) : (
              <View className="bg-slate-800 rounded-xl p-6 items-center justify-center border border-slate-700 gap-2">
                <Text className="text-3xl">🎯</Text>
                <Text className="text-slate-300 font-semibold">No Badges Yet</Text>
                <Text className="text-sm text-slate-500 text-center">Start tracking your wellness to unlock badges!</Text>
              </View>
            )}
          </View>

          {/* Available Badges */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Available Badges
            </Text>
            <View className="gap-2">
              {BADGE_DEFINITIONS.map((badgeDef) => {
                const isUnlocked = badges.some((b) => b.badgeType === badgeDef.id);
                return (
                  <View
                    key={badgeDef.id}
                    className={`rounded-lg p-4 border flex-row items-center gap-3 ${
                      isUnlocked ? 'bg-slate-700 border-slate-600' : 'bg-slate-800 border-slate-700 opacity-60'
                    }`}
                  >
                    <Text className="text-2xl">{badgeDef.icon}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-100">{badgeDef.name}</Text>
                      <Text className="text-xs text-slate-500">{badgeDef.description}</Text>
                    </View>
                    {isUnlocked && <Text className="text-lg">✓</Text>}
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
