import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/screen-container';
import { useUser } from '@/lib/user-context';
import { SelfCareEntry, SelfCareCategory } from '@/types';
import { generateId } from '@/lib/utils';

const SELF_CARE_CATEGORIES: { id: SelfCareCategory; emoji: string; label: string; color: string }[] = [
  { id: 'water', emoji: '💧', label: 'Drink Water', color: '#06B6D4' },
  { id: 'medication', emoji: '💊', label: 'Take Medication', color: '#F59E0B' },
  { id: 'sleep', emoji: '😴', label: 'Sleep/Rest', color: '#8B5CF6' },
  { id: 'sunlight', emoji: '☀️', label: 'Get Sunlight', color: '#FBBF24' },
  { id: 'enjoyable', emoji: '🎨', label: 'Do Something Enjoyable', color: '#EC4899' },
  { id: 'laughter', emoji: '😄', label: 'Have a Laugh', color: '#10B981' },
];

export default function SelfCareScreen() {
  const { user } = useUser();
  const [entries, setEntries] = useState<SelfCareEntry[]>([]);
  const [todayEntries, setTodayEntries] = useState<Set<SelfCareCategory>>(new Set());
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load self-care entries
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const saved = await AsyncStorage.getItem('selfcare_entries');
        if (saved) {
          const parsed: SelfCareEntry[] = JSON.parse(saved);
          setEntries(parsed);

          // Get today's entries
          const today = new Date().toDateString();
          const todaySet = new Set<SelfCareCategory>();
          parsed.forEach((entry) => {
            if (new Date(entry.timestamp).toDateString() === today) {
              todaySet.add(entry.category);
            }
          });
          setTodayEntries(todaySet);
        }
      } catch (error) {
        console.error('Failed to load self-care entries:', error);
      }
    };

    loadEntries();
  }, []);

  const handleAddSelfCare = async (category: SelfCareCategory) => {
    if (todayEntries.has(category)) {
      Alert.alert('Already Logged', `You've already logged ${category} today!`);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setLoading(true);

    try {
      const newEntry: SelfCareEntry = {
        id: generateId(),
        userId: user?.id || '',
        category,
        timestamp: Date.now(),
      };

      const updated = [newEntry, ...entries];
      await AsyncStorage.setItem('selfcare_entries', JSON.stringify(updated));
      setEntries(updated);

      // Update today's entries
      const newTodaySet = new Set(todayEntries);
      newTodaySet.add(category);
      setTodayEntries(newTodaySet);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Check if all categories completed
      if (newTodaySet.size === SELF_CARE_CATEGORIES.length) {
        Alert.alert('🎉 Amazing!', "You've completed all self-care activities today!");
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to log self-care activity');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const progressPercentage = (todayEntries.size / SELF_CARE_CATEGORIES.length) * 100;

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isCompleted = (categoryId: SelfCareCategory) => todayEntries.has(categoryId);

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-slate-100">Self-Care Check-In</Text>
            <Text className="text-sm text-slate-400">Nurture yourself with these activities</Text>
          </View>

          {/* Progress Card */}
          <View className="bg-slate-800 rounded-2xl p-6 gap-4 border border-slate-700">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Today's Progress
              </Text>
              <Text className="text-2xl font-bold text-amber-300">
                {todayEntries.size}/{SELF_CARE_CATEGORIES.length}
              </Text>
            </View>

            {/* Animated Progress Bar */}
            <View className="h-4 bg-slate-700 rounded-full overflow-hidden">
              <Animated.View
                entering={FadeIn.duration(300)}
                className="h-full bg-gradient-to-r from-amber-400 via-rose-400 to-violet-400 rounded-full"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />
            </View>

            <Text className="text-xs text-slate-400 text-center">
              {progressPercentage.toFixed(0)}% Complete
            </Text>
          </View>

          {/* Self-Care Buttons */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Log Your Activities
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {SELF_CARE_CATEGORIES.map((category) => {
                const completed = isCompleted(category.id);
                return (
                  <Pressable
                    key={category.id}
                    onPress={() => handleAddSelfCare(category.id)}
                    disabled={completed || loading}
                    style={({ pressed }) => [{ opacity: pressed && !completed ? 0.7 : 1 }]}
                    className={`flex-1 min-w-[30%] rounded-xl p-4 items-center justify-center gap-2 border-2 ${
                      completed
                        ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-400'
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <Text className="text-3xl">{category.emoji}</Text>
                    <Text className="text-xs font-semibold text-slate-100 text-center">
                      {category.label}
                    </Text>
                    {completed && <Text className="text-lg">✓</Text>}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* History Toggle */}
          <Pressable
            onPress={() => setShowHistory(!showHistory)}
            className="bg-slate-800 rounded-xl py-3 items-center border border-slate-700"
          >
            <Text className="text-slate-300 font-semibold">
              {showHistory ? 'Hide History' : 'View History'} ({entries.length})
            </Text>
          </Pressable>

          {/* History List */}
          {showHistory && entries.length > 0 && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Recent Activities
              </Text>
              {entries.slice(0, 15).map((entry) => {
                const category = SELF_CARE_CATEGORIES.find((c) => c.id === entry.category);
                return (
                  <View
                    key={entry.id}
                    className="bg-slate-800 rounded-lg p-3 border border-slate-700 flex-row items-center gap-3"
                  >
                    <Text className="text-2xl">{category?.emoji}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-100">{category?.label}</Text>
                      <Text className="text-xs text-slate-500">{formatDate(entry.timestamp)}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
