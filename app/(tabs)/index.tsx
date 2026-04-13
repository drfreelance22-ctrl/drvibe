import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { AffirmationCarousel } from '@/components/affirmation-carousel';
import { useUser } from '@/lib/user-context';
import { SelfCareEntry } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUser();
  const [todaySelfCare, setTodaySelfCare] = useState(0);
  const [totalSelfCare] = useState(6); // 6 categories

  // Load today's self-care count
  useEffect(() => {
    const loadTodaysSelfCare = async () => {
      try {
        const entries = await AsyncStorage.getItem('selfcare_entries');
        if (entries) {
          const parsed: SelfCareEntry[] = JSON.parse(entries);
          const today = new Date().toDateString();
          const todayEntries = parsed.filter(
            (entry) => new Date(entry.timestamp).toDateString() === today
          );
          // Count unique categories for today
          const uniqueCategories = new Set(todayEntries.map((e) => e.category));
          setTodaySelfCare(uniqueCategories.size);
        }
      } catch (error) {
        console.error('Failed to load self-care entries:', error);
      }
    };

    loadTodaysSelfCare();
  }, []);

  const handleNavigation = (route: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(route as any);
  };

  const greeting = user?.name ? `Welcome back, ${user.name}!` : 'Welcome!';

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-8 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-slate-100">{greeting}</Text>
            <Text className="text-sm text-slate-400">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </Text>
          </View>

          {/* Affirmation Carousel */}
          <AffirmationCarousel autoAdvance={true} interval={5000} />

          {/* Today's Progress */}
          <View className="bg-slate-800 rounded-2xl p-6 gap-4 border border-slate-700">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Today's Self-Care
            </Text>

            {/* Progress Bar */}
            <View className="gap-3">
              <View className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <View
                  className="h-full bg-gradient-to-r from-violet-500 to-rose-500 rounded-full"
                  style={{ width: `${(todaySelfCare / totalSelfCare) * 100}%` }}
                />
              </View>
              <Text className="text-sm text-slate-300 font-semibold">
                {todaySelfCare} of {totalSelfCare} completed
              </Text>
            </View>

            {/* Quick Stats */}
            <View className="flex-row gap-3 pt-2">
              <View className="flex-1 bg-slate-700 rounded-lg p-3 items-center">
                <Text className="text-xs text-slate-400">Mood Entries</Text>
                <Text className="text-lg font-bold text-violet-300">—</Text>
              </View>
              <View className="flex-1 bg-slate-700 rounded-lg p-3 items-center">
                <Text className="text-xs text-slate-400">Meditations</Text>
                <Text className="text-lg font-bold text-rose-300">—</Text>
              </View>
              <View className="flex-1 bg-slate-700 rounded-lg p-3 items-center">
                <Text className="text-xs text-slate-400">Streak</Text>
                <Text className="text-lg font-bold text-amber-300">—</Text>
              </View>
            </View>
          </View>

          {/* Quick Access Buttons */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Quick Access
            </Text>

            {/* Row 1: Mood, Triggers */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => handleNavigation('/(tabs)/mood')}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-gradient-to-br from-violet-600 to-violet-700 rounded-xl p-6 items-center justify-center"
              >
                <Text className="text-2xl mb-2">😊</Text>
                <Text className="text-sm font-semibold text-white text-center">Mood</Text>
              </Pressable>

              <Pressable
                onPress={() => handleNavigation('/(tabs)/mood')}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-gradient-to-br from-rose-600 to-rose-700 rounded-xl p-6 items-center justify-center"
              >
                <Text className="text-2xl mb-2">⚡</Text>
                <Text className="text-sm font-semibold text-white text-center">Triggers</Text>
              </Pressable>
            </View>

            {/* Row 2: Self-Care, Moon */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => handleNavigation('/(tabs)/selfcare')}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 items-center justify-center"
              >
                <Text className="text-2xl mb-2">💛</Text>
                <Text className="text-sm font-semibold text-white text-center">Self-Care</Text>
              </Pressable>

              <Pressable
                onPress={() => handleNavigation('/(tabs)/moon')}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-xl p-6 items-center justify-center"
              >
                <Text className="text-2xl mb-2">🌙</Text>
                <Text className="text-sm font-semibold text-white text-center">Moon</Text>
              </Pressable>
            </View>

            {/* Row 3: Meditate, Rewards */}
            <View className="flex-row gap-3">
              <Pressable
                onPress={() => handleNavigation('/(tabs)/meditate')}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl p-6 items-center justify-center"
              >
                <Text className="text-2xl mb-2">🧘</Text>
                <Text className="text-sm font-semibold text-white text-center">Meditate</Text>
              </Pressable>

              <Pressable
                onPress={() => handleNavigation('/(tabs)/rewards')}
                style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                className="flex-1 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 items-center justify-center"
              >
                <Text className="text-2xl mb-2">🏆</Text>
                <Text className="text-sm font-semibold text-white text-center">Rewards</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
