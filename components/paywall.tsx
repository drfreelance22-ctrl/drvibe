import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useAuth } from '@/hooks/use-auth';
import { trpc } from '@/lib/trpc';

interface PaywallProps {
  feature: string;
  onSubscribe?: () => void;
}

export function Paywall({ feature, onSubscribe }: PaywallProps) {
  const { user } = useAuth();
  const { data: isActive = false } = trpc.subscriptions.isActive.useQuery(undefined, {
    enabled: !!user,
  });

  if (isActive) {
    return null; // Don't show paywall if user is subscribed
  }

  const handleSubscribePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSubscribe?.();
  };

  return (
    <View className="bg-gradient-to-b from-amber-900 to-amber-950 rounded-2xl p-6 gap-4 border-2 border-amber-600">
      {/* Header */}
      <View className="gap-2">
        <Text className="text-lg font-bold text-amber-100">✨ Premium Feature</Text>
        <Text className="text-sm text-amber-200">
          {feature} is available with a DRVibe Premium subscription
        </Text>
      </View>

      {/* Benefits */}
      <View className="gap-2 bg-amber-900 rounded-lg p-3">
        <Text className="text-xs font-semibold text-amber-100 uppercase">What you get:</Text>
        <View className="gap-1">
          <Text className="text-xs text-amber-200">• Access to full meditation library</Text>
          <Text className="text-xs text-amber-200">• Advanced mood analytics</Text>
          <Text className="text-xs text-amber-200">• Exclusive affirmations</Text>
          <Text className="text-xs text-amber-200">• Priority support</Text>
        </View>
      </View>

      {/* Pricing */}
      <View className="bg-amber-900 rounded-lg p-3 gap-1">
        <Text className="text-xs text-amber-300">3-day free trial, then</Text>
        <Text className="text-2xl font-bold text-amber-100">$4.99<Text className="text-sm text-amber-300">/month</Text></Text>
      </View>

      {/* Subscribe Button */}
      <Pressable
        onPress={handleSubscribePress}
        className="bg-amber-500 rounded-lg py-3 items-center active:opacity-80"
      >
        <Text className="font-bold text-amber-950">Start Free Trial</Text>
      </Pressable>

      {/* Cancel anytime */}
      <Text className="text-xs text-amber-300 text-center">Cancel anytime, no questions asked</Text>
    </View>
  );
}

/**
 * Full-screen paywall modal
 */
export function PaywallModal({ onSubscribe, onDismiss }: { onSubscribe?: () => void; onDismiss?: () => void }) {
  const { user } = useAuth();
  const { data: isActive = false } = trpc.subscriptions.isActive.useQuery(undefined, {
    enabled: !!user,
  });

  if (isActive) {
    return null;
  }

  return (
    <ScrollView className="flex-1 bg-slate-900">
      <View className="flex-1 p-6 gap-6 pb-12">
        {/* Header */}
        <View className="gap-2 mt-8">
          <Text className="text-4xl font-bold text-slate-100">DRVibe Premium</Text>
          <Text className="text-base text-slate-400">Unlock your full potential</Text>
        </View>

        {/* Features */}
        <View className="gap-3">
          <FeatureItem icon="🧘" title="Full Meditation Library" description="Access to all curated meditations" />
          <FeatureItem icon="📊" title="Advanced Analytics" description="Track your wellness journey in detail" />
          <FeatureItem icon="✨" title="Exclusive Affirmations" description="Premium chakra affirmations" />
          <FeatureItem icon="🎯" title="Goal Tracking" description="Set and achieve wellness milestones" />
        </View>

        {/* Pricing Card */}
        <View className="bg-gradient-to-b from-purple-900 to-purple-950 rounded-2xl p-6 gap-4 border-2 border-purple-600">
          <View>
            <Text className="text-sm text-purple-300 mb-2">3-day free trial</Text>
            <Text className="text-4xl font-bold text-purple-100">$4.99<Text className="text-lg text-purple-300">/mo</Text></Text>
          </View>
          <Text className="text-xs text-purple-300">Then $4.99 per month. Cancel anytime.</Text>
        </View>

        {/* Subscribe Button */}
        <Pressable
          onPress={onSubscribe}
          className="bg-purple-600 rounded-lg py-4 items-center active:opacity-80"
        >
          <Text className="font-bold text-white text-lg">Start Free Trial</Text>
        </Pressable>

        {/* Dismiss Button */}
        <Pressable
          onPress={onDismiss}
          className="rounded-lg py-3 items-center border border-slate-600 active:opacity-80"
        >
          <Text className="font-semibold text-slate-300">Maybe Later</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

function FeatureItem({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <View className="flex-row gap-3 bg-slate-800 rounded-lg p-4">
      <Text className="text-2xl">{icon}</Text>
      <View className="flex-1 gap-1">
        <Text className="font-semibold text-slate-100">{title}</Text>
        <Text className="text-sm text-slate-400">{description}</Text>
      </View>
    </View>
  );
}
