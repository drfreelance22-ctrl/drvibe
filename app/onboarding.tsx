import React, { useState } from 'react';
import { ScrollView, Text, View, TextInput, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { useUser } from '@/lib/user-context';

export default function OnboardingScreen() {
  const router = useRouter();
  const { registerUser } = useUser();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Missing Information', 'Please enter your name and email address.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLoading(true);

    try {
      const socialHandles = {
        ...(instagram && { instagram }),
        ...(twitter && { twitter }),
        ...(tiktok && { tiktok }),
      };

      await registerUser(name, email, Object.keys(socialHandles).length > 0 ? socialHandles : undefined);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Failed to create account. Please try again.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer containerClassName="bg-slate-950">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="flex-1 justify-center px-6 py-12 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-3">
            <Text className="text-5xl font-bold">✨</Text>
            <Text className="text-4xl font-bold text-center text-white">
              Welcome to Your Wellness Journey
            </Text>
            <Text className="text-base text-center text-white leading-relaxed">
              Track your energy, celebrate your growth, and connect with your inner light
            </Text>
          </View>

          {/* Form Section */}
          <View className="gap-4">
            {/* Name Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-white">Your Name</Text>
              <TextInput
                placeholder="Enter your name"
                placeholderTextColor="#9CA3AF"
                value={name}
                onChangeText={setName}
                editable={!loading}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400"
              />
            </View>

            {/* Email Input */}
            <View className="gap-2">
              <Text className="text-sm font-semibold text-white">Email Address</Text>
              <TextInput
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
                className="bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-400"
              />
            </View>

            {/* Social Handles Section */}
            <View className="gap-3 mt-2">
              <Text className="text-xs font-semibold text-white uppercase tracking-wider">
                Social Handles (Optional)
              </Text>

              {/* Instagram */}
              <View className="gap-2">
                <Text className="text-xs text-white">Instagram</Text>
                <TextInput
                  placeholder="@username"
                  placeholderTextColor="#9CA3AF"
                  value={instagram}
                  onChangeText={setInstagram}
                  editable={!loading}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                />
              </View>

              {/* Twitter */}
              <View className="gap-2">
                <Text className="text-xs text-white">Twitter / X</Text>
                <TextInput
                  placeholder="@username"
                  placeholderTextColor="#9CA3AF"
                  value={twitter}
                  onChangeText={setTwitter}
                  editable={!loading}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                />
              </View>

              {/* TikTok */}
              <View className="gap-2">
                <Text className="text-xs text-white">TikTok</Text>
                <TextInput
                  placeholder="@username"
                  placeholderTextColor="#9CA3AF"
                  value={tiktok}
                  onChangeText={setTiktok}
                  editable={!loading}
                  className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                />
              </View>
            </View>
          </View>

          {/* CTA Button */}
          <Pressable
            onPress={handleGetStarted}
            disabled={loading}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed && !loading ? 0.97 : 1 }],
                opacity: loading ? 0.6 : 1,
              },
            ]}
            className="bg-gradient-to-r from-violet-500 to-rose-500 rounded-xl py-4 items-center"
          >
            <Text className="text-lg font-bold text-white">
              {loading ? 'Creating Account...' : 'Get Started'}
            </Text>
          </Pressable>

          {/* Footer Text */}
          <Text className="text-xs text-center text-white">
            Your information is kept private and secure
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
