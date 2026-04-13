import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScreenContainer } from '@/components/screen-container';
import { useUser } from '@/lib/user-context';
import { Meditation } from '@/types';
import { generateId } from '@/lib/utils';

export default function MeditateScreen() {
  const { user } = useUser();
  const [meditations, setMeditations] = useState<Meditation[]>([]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Load meditations
  useEffect(() => {
    const loadMeditations = async () => {
      try {
        const saved = await AsyncStorage.getItem('meditations');
        if (saved) {
          setMeditations(JSON.parse(saved));
        }
      } catch (error) {
        console.error('Failed to load meditations:', error);
      }
    };

    loadMeditations();
  }, []);

  const handleAddMeditation = () => {
    // Create a sample meditation for demonstration
    const newMeditation: Meditation = {
      id: generateId(),
      userId: user?.id || '',
      title: `Meditation ${meditations.length + 1}`,
      duration: Math.floor(Math.random() * 300) + 60, // 1-5 minutes
      fileUri: 'https://example.com/meditation.mp3',
      type: Math.random() > 0.5 ? 'audio' : 'video',
      uploadedAt: Date.now(),
      isFavorite: false,
    };

    const updated = [newMeditation, ...meditations];
    AsyncStorage.setItem('meditations', JSON.stringify(updated));
    setMeditations(updated);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert('Success', 'Meditation added to library!');
  };

  const handlePlayMeditation = (meditation: Meditation) => {
    if (playingId === meditation.id) {
      setPlayingId(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setPlayingId(meditation.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // Update last played
      const updated = meditations.map((m) =>
        m.id === meditation.id ? { ...m, lastPlayedAt: Date.now() } : m
      );
      AsyncStorage.setItem('meditations', JSON.stringify(updated));
      setMeditations(updated);
    }
  };

  const handleToggleFavorite = async (meditation: Meditation) => {
    try {
      const updated = meditations.map((m) =>
        m.id === meditation.id ? { ...m, isFavorite: !m.isFavorite } : m
      );
      await AsyncStorage.setItem('meditations', JSON.stringify(updated));
      setMeditations(updated);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const handleDeleteMeditation = async (meditation: Meditation) => {
    Alert.alert('Delete Meditation', 'Are you sure you want to delete this meditation?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            const updated = meditations.filter((m) => m.id !== meditation.id);
            await AsyncStorage.setItem('meditations', JSON.stringify(updated));
            setMeditations(updated);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          } catch (error) {
            console.error('Failed to delete meditation:', error);
          }
        },
      },
    ]);
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

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-slate-100">Meditation Library</Text>
            <Text className="text-sm text-slate-400">Upload and play your meditations</Text>
          </View>

          {/* Add Button */}
          <Pressable
            onPress={handleAddMeditation}
            style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl py-4 items-center border-2 border-cyan-400"
          >
            <Text className="text-lg font-bold text-white">+ Add Meditation</Text>
            <Text className="text-xs text-cyan-100 mt-1">Audio or Video (up to 7 min)</Text>
          </Pressable>

          {/* Meditations List */}
          {meditations.length > 0 ? (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Your Meditations ({meditations.length})
              </Text>
              {meditations.map((meditation) => (
                <View
                  key={meditation.id}
                  className="bg-slate-800 rounded-xl p-4 border border-slate-700 gap-3"
                >
                  {/* Title and Type */}
                  <View className="flex-row items-start justify-between gap-2">
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-100 mb-1">
                        {meditation.title}
                      </Text>
                      <Text className="text-xs text-slate-500">
                        {meditation.type === 'audio' ? '🎵 Audio' : '🎬 Video'} •{' '}
                        {formatDuration(meditation.duration)} • Uploaded {formatDate(meditation.uploadedAt)}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => handleToggleFavorite(meditation)}
                      className="p-2"
                    >
                      <Text className="text-xl">{meditation.isFavorite ? '❤️' : '🤍'}</Text>
                    </Pressable>
                  </View>

                  {/* Controls */}
                  <View className="flex-row gap-2">
                    <Pressable
                      onPress={() => handlePlayMeditation(meditation)}
                      className={`flex-1 rounded-lg py-2 items-center border ${
                        playingId === meditation.id
                          ? 'bg-cyan-600 border-cyan-400'
                          : 'bg-slate-700 border-slate-600'
                      }`}
                    >
                      <Text className="text-white font-semibold">
                        {playingId === meditation.id ? '⏸ Stop' : '▶ Play'}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleDeleteMeditation(meditation)}
                      className="rounded-lg py-2 px-4 bg-red-900 border border-red-700 items-center"
                    >
                      <Text className="text-red-200 font-semibold">🗑</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-slate-800 rounded-xl p-8 items-center justify-center border border-slate-700 gap-3">
              <Text className="text-4xl">🧘</Text>
              <Text className="text-slate-300 font-semibold">No Meditations Yet</Text>
              <Text className="text-sm text-slate-500 text-center">
                Add your first meditation to get started
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
