import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable, Alert, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/screen-container';
import { Paywall } from '@/components/paywall';
import { useAuth } from '@/hooks/use-auth';
import { trpc } from '@/lib/trpc';
import { Meditation } from '@/drizzle/schema';

export default function MeditateScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [playingId, setPlayingId] = useState<number | null>(null);

  // Fetch meditations from server
  const { data: meditations = [], isLoading } = trpc.meditations.list.useQuery();
  const { data: isSubscribed = false } = trpc.subscriptions.isActive.useQuery(undefined, {
    enabled: !!user,
  });

  const handlePlayMeditation = (meditation: Meditation) => {
    if (!user) {
      Alert.alert('Sign In Required', 'Please sign in to play meditations', [
        { text: 'Cancel' },
        { text: 'Sign In', onPress: () => router.push('/') },
      ]);
      return;
    }

    if (!isSubscribed) {
      Alert.alert('Premium Required', 'Subscribe to access meditations', [
        { text: 'Cancel' },
        { text: 'Subscribe', onPress: () => handleSubscribe() },
      ]);
      return;
    }

    if (playingId === meditation.id) {
      setPlayingId(null);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      setPlayingId(meditation.id);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const createCheckoutMutation = trpc.subscriptions.createCheckoutSession.useMutation();

  const handleSubscribe = async () => {
    try {
      const result = await createCheckoutMutation.mutateAsync({
        successUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/meditate?success=true`,
        cancelUrl: `${typeof window !== 'undefined' ? window.location.origin : ''}/meditate`,
      });
      if (result.url && typeof window !== 'undefined') {
        window.location.href = result.url;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to create checkout session');
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#06B6D4" />
          <Text className="text-slate-300 mt-4">Loading meditations...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-slate-100">Meditation Library</Text>
            <Text className="text-sm text-slate-400">Curated meditations for your wellness</Text>
          </View>

          {/* Meditations List */}
          {meditations.length > 0 ? (
            <View className="gap-3">
              <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
                Available Meditations ({meditations.length})
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
                        {formatDuration(meditation.duration)}
                        {meditation.chakra && ` • ${meditation.chakra}`}
                      </Text>
                      {meditation.description && (
                        <Text className="text-xs text-slate-400 mt-2">{meditation.description}</Text>
                      )}
                    </View>
                  </View>

                  {/* Play Button */}
                  <Pressable
                    onPress={() => handlePlayMeditation(meditation)}
                    className={`rounded-lg py-2 items-center border ${
                      playingId === meditation.id
                        ? 'bg-cyan-600 border-cyan-400'
                        : 'bg-slate-700 border-slate-600'
                    }`}
                  >
                    <Text className="text-white font-semibold">
                      {playingId === meditation.id ? '⏸ Stop' : '▶ Play'}
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          ) : (
            <View className="bg-slate-800 rounded-xl p-8 items-center justify-center border border-slate-700 gap-3">
              <Text className="text-4xl">🧘</Text>
              <Text className="text-slate-300 font-semibold">No Meditations Available</Text>
              <Text className="text-sm text-slate-500 text-center">
                Check back soon for new meditation content
              </Text>
            </View>
          )}

          {/* Paywall for non-subscribers */}
          {user && !isSubscribed && (
            <Paywall
              feature="Meditations"
              onSubscribe={handleSubscribe}
            />
          )}

          {!user && (
            <View className="bg-gradient-to-r from-amber-900 to-amber-800 rounded-xl p-4 border border-amber-700 gap-2">
              <Text className="text-sm font-semibold text-amber-100">✨ Sign In Required</Text>
              <Text className="text-xs text-amber-200">
                Sign in to access meditations and start your wellness journey.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
