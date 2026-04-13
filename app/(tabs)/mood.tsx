import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/components/screen-container';
import { useUser } from '@/lib/user-context';
import { MoodEntry, MoodType } from '@/types';
import { generateId } from '@/lib/utils';

const MOOD_OPTIONS: { type: MoodType; emoji: string; label: string }[] = [
  { type: 'happy', emoji: '😊', label: 'Happy' },
  { type: 'sad', emoji: '😢', label: 'Sad' },
  { type: 'anxious', emoji: '😰', label: 'Anxious' },
  { type: 'calm', emoji: '😌', label: 'Calm' },
  { type: 'energetic', emoji: '⚡', label: 'Energetic' },
  { type: 'grateful', emoji: '🙏', label: 'Grateful' },
  { type: 'overwhelmed', emoji: '😵', label: 'Overwhelmed' },
  { type: 'neutral', emoji: '😐', label: 'Neutral' },
];

const TRIGGER_SUGGESTIONS = [
  'Work stress',
  'Relationship',
  'Health',
  'Sleep',
  'Weather',
  'Social media',
  'Finances',
  'Family',
];

export default function MoodScreen() {
  const { user } = useUser();
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [trigger, setTrigger] = useState('');
  const [notes, setNotes] = useState('');
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load mood entries
  useEffect(() => {
    const loadEntries = async () => {
      try {
        const saved = await AsyncStorage.getItem('mood_entries');
        if (saved) {
          setEntries(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load mood entries:', error);
      }
    };

    loadEntries();
  }, []);

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert('Missing Information', 'Please select a mood');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      const newEntry: MoodEntry = {
        id: generateId(),
        userId: user?.id || '',
        mood: selectedMood,
        intensity,
        trigger: trigger || undefined,
        notes: notes || undefined,
        timestamp: Date.now(),
      };

      const updated = [newEntry, ...entries];
      await AsyncStorage.setItem('mood_entries', JSON.stringify(updated));
      setEntries(updated);

      // Reset form
      setSelectedMood(null);
      setIntensity(5);
      setTrigger('');
      setNotes('');

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Mood entry saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save mood entry');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getMoodEmoji = (mood: MoodType) => {
    return MOOD_OPTIONS.find((m) => m.type === mood)?.emoji || '😐';
  };

  const isSelected = (mood: MoodType) => selectedMood === mood;

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-slate-100">How are you feeling?</Text>
            <Text className="text-sm text-slate-400">Track your mood and identify patterns</Text>
          </View>

          {/* Mood Selector */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Select Your Mood
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {MOOD_OPTIONS.map((mood) => (
                <Pressable
                  key={mood.type}
                  onPress={() => {
                    setSelectedMood(mood.type);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                  className={`flex-1 min-w-[22%] rounded-xl p-4 items-center justify-center gap-2 border-2 ${
                    isSelected(mood.type) ? 'bg-violet-600 border-violet-400' : 'bg-slate-800 border-slate-700'
                  }`}
                >
                  <Text className="text-3xl">{mood.emoji}</Text>
                  <Text className="text-xs font-semibold text-slate-100 text-center">{mood.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Intensity Slider */}
          <View className="gap-3 bg-slate-800 rounded-xl p-4 border border-slate-700">
            <View className="flex-row justify-between items-center">
              <Text className="text-sm font-semibold text-slate-300">Intensity</Text>
              <Text className="text-2xl font-bold text-violet-300">{intensity}</Text>
            </View>
            <View className="flex-row gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((level) => (
                <Pressable
                  key={level}
                  onPress={() => setIntensity(level)}
                  className={`flex-1 h-8 rounded-lg ${
                    level <= intensity ? 'bg-gradient-to-r from-violet-500 to-rose-500' : 'bg-slate-700'
                  }`}
                />
              ))}
            </View>
          </View>

          {/* Trigger Input */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              What triggered this mood?
            </Text>
            <TextInput
              placeholder="e.g., work stress, relationship issue..."
              placeholderTextColor="#64748B"
              value={trigger}
              onChangeText={setTrigger}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
            />
            {/* Trigger Suggestions */}
            <View className="flex-row flex-wrap gap-2">
              {TRIGGER_SUGGESTIONS.map((suggestion) => (
                <Pressable
                  key={suggestion}
                  onPress={() => setTrigger(suggestion)}
                  className="bg-slate-700 rounded-lg px-3 py-1"
                >
                  <Text className="text-xs text-slate-300">{suggestion}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Notes Input */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Additional Notes (Optional)
            </Text>
            <TextInput
              placeholder="Add any notes..."
              placeholderTextColor="#64748B"
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-slate-100"
            />
          </View>

          {/* Save Button */}
          <Pressable
            onPress={handleSaveMood}
            disabled={loading}
            style={({ pressed }) => [{ opacity: loading ? 0.6 : pressed ? 0.9 : 1 }]}
            className="bg-gradient-to-r from-violet-500 to-rose-500 rounded-xl py-4 items-center"
          >
            <Text className="text-lg font-bold text-white">
              {loading ? 'Saving...' : 'Save Mood Entry'}
            </Text>
          </Pressable>

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
                Recent Entries
              </Text>
              {entries.slice(0, 10).map((entry) => (
                <View
                  key={entry.id}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex-row items-start gap-3"
                >
                  <Text className="text-2xl">{getMoodEmoji(entry.mood)}</Text>
                  <View className="flex-1 gap-1">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-sm font-semibold text-slate-100 capitalize">
                        {entry.mood}
                      </Text>
                      <Text className="text-xs text-slate-500">{formatDate(entry.timestamp)}</Text>
                    </View>
                    <Text className="text-xs text-slate-400">Intensity: {entry.intensity}/10</Text>
                    {entry.trigger && (
                      <Text className="text-xs text-slate-400">Trigger: {entry.trigger}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
