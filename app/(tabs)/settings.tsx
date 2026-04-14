import React from 'react';
import { ScrollView, Text, View, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { useUser } from '@/lib/user-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useUser();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            try {
              await logout();
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              router.replace('/onboarding');
            } catch (error) {
              Alert.alert('Error', 'Failed to logout. Please try again.');
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-8 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-white">Settings</Text>
            <Text className="text-sm text-white">
              Manage your account and preferences
            </Text>
          </View>

          {/* User Info Section */}
          <View className="bg-slate-800 rounded-2xl p-6 gap-4 border border-slate-700">
            <Text className="text-sm font-semibold text-white uppercase tracking-wider">
              Account Information
            </Text>

            {user && (
              <View className="gap-4">
                <View className="gap-1">
                  <Text className="text-xs text-white">Name</Text>
                  <Text className="text-base font-semibold text-white">{user.name}</Text>
                </View>

                <View className="gap-1">
                  <Text className="text-xs text-white">Email</Text>
                  <Text className="text-base font-semibold text-white">{user.email}</Text>
                </View>

                {user.socialHandles && Object.keys(user.socialHandles).length > 0 && (
                  <View className="gap-1">
                    <Text className="text-xs text-white">Social Handles</Text>
                    <View className="gap-2">
                      {Object.entries(user.socialHandles).map(([platform, handle]) => (
                        <Text key={platform} className="text-sm text-white">
                          {platform}: @{handle}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Logout Button */}
          <Pressable
            onPress={handleLogout}
            style={({ pressed }) => [
              {
                transform: [{ scale: pressed ? 0.97 : 1 }],
              },
            ]}
            className="bg-red-600 rounded-xl py-4 items-center"
          >
            <Text className="text-lg font-bold text-white">Logout</Text>
          </Pressable>

          {/* Footer */}
          <Text className="text-xs text-center text-white">
            DRVibe v1.0.0
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
