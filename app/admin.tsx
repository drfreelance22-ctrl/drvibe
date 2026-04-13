import React, { useState } from 'react';
import { ScrollView, Text, View, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { ScreenContainer } from '@/components/screen-container';
import { useAuth } from '@/hooks/use-auth';
import { trpc } from '@/lib/trpc';

export default function AdminScreen() {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [type, setType] = useState<'audio' | 'video'>('audio');
  const [fileUrl, setFileUrl] = useState('');
  const [chakra, setChakra] = useState('');
  const [loading, setLoading] = useState(false);

  const { data: meditations = [], refetch } = trpc.meditations.list.useQuery();
  const createMutation = trpc.meditations.create.useMutation();
  const deleteMutation = trpc.meditations.delete.useMutation();

  // Check if user is admin
  if (user?.role !== 'admin') {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center gap-4">
          <Text className="text-3xl">🔒</Text>
          <Text className="text-xl font-bold text-slate-100">Access Denied</Text>
          <Text className="text-sm text-slate-400 text-center">
            Only administrators can access this panel
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  const handleAddMeditation = async () => {
    if (!title || !duration || !fileUrl) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createMutation.mutateAsync({
        title,
        description: description || undefined,
        duration: parseInt(duration),
        type,
        fileUrl,
        thumbnailUrl: undefined,
        chakra: chakra || undefined,
      });

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Meditation added successfully');
      setTitle('');
      setDescription('');
      setDuration('');
      setFileUrl('');
      setChakra('');
      refetch();
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to add meditation');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeditation = (id: number) => {
    Alert.alert('Delete Meditation', 'Are you sure?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Delete',
        onPress: async () => {
          try {
            await deleteMutation.mutateAsync({ id });
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            refetch();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete meditation');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-slate-100">Admin Panel</Text>
            <Text className="text-sm text-slate-400">Manage meditation library</Text>
          </View>

          {/* Add Meditation Form */}
          <View className="bg-slate-800 rounded-xl p-4 gap-3 border border-slate-700">
            <Text className="text-lg font-bold text-slate-100">Add Meditation</Text>

            <View>
              <Text className="text-xs font-semibold text-slate-300 mb-1">Title *</Text>
              <TextInput
                placeholder="Meditation title"
                placeholderTextColor="#64748b"
                value={title}
                onChangeText={setTitle}
                className="bg-slate-700 text-slate-100 px-3 py-2 rounded-lg border border-slate-600"
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-slate-300 mb-1">Description</Text>
              <TextInput
                placeholder="Optional description"
                placeholderTextColor="#64748b"
                value={description}
                onChangeText={setDescription}
                className="bg-slate-700 text-slate-100 px-3 py-2 rounded-lg border border-slate-600"
                multiline
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-slate-300 mb-1">Duration (seconds) *</Text>
              <TextInput
                placeholder="e.g., 300 for 5 minutes"
                placeholderTextColor="#64748b"
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
                className="bg-slate-700 text-slate-100 px-3 py-2 rounded-lg border border-slate-600"
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-slate-300 mb-1">Type</Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setType('audio')}
                  className={`flex-1 py-2 rounded-lg border ${
                    type === 'audio' ? 'bg-cyan-600 border-cyan-400' : 'bg-slate-700 border-slate-600'
                  }`}
                >
                  <Text className="text-center text-slate-100 font-semibold">Audio</Text>
                </Pressable>
                <Pressable
                  onPress={() => setType('video')}
                  className={`flex-1 py-2 rounded-lg border ${
                    type === 'video' ? 'bg-cyan-600 border-cyan-400' : 'bg-slate-700 border-slate-600'
                  }`}
                >
                  <Text className="text-center text-slate-100 font-semibold">Video</Text>
                </Pressable>
              </View>
            </View>

            <View>
              <Text className="text-xs font-semibold text-slate-300 mb-1">File URL (S3) *</Text>
              <TextInput
                placeholder="https://..."
                placeholderTextColor="#64748b"
                value={fileUrl}
                onChangeText={setFileUrl}
                className="bg-slate-700 text-slate-100 px-3 py-2 rounded-lg border border-slate-600"
              />
            </View>

            <View>
              <Text className="text-xs font-semibold text-slate-300 mb-1">Chakra (optional)</Text>
              <TextInput
                placeholder="e.g., Root, Sacral, Solar Plexus"
                placeholderTextColor="#64748b"
                value={chakra}
                onChangeText={setChakra}
                className="bg-slate-700 text-slate-100 px-3 py-2 rounded-lg border border-slate-600"
              />
            </View>

            <Pressable
              onPress={handleAddMeditation}
              disabled={loading}
              className="bg-purple-600 rounded-lg py-2 items-center active:opacity-80 disabled:opacity-50"
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-semibold">Add Meditation</Text>
              )}
            </Pressable>
          </View>

          {/* Meditations List */}
          <View className="gap-2">
            <Text className="text-lg font-bold text-slate-100">Meditations ({meditations.length})</Text>
            {meditations.length > 0 ? (
              meditations.map((med) => (
                <View key={med.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700 gap-2">
                  <View className="flex-row justify-between items-start">
                    <View className="flex-1">
                      <Text className="font-semibold text-slate-100">{med.title}</Text>
                      <Text className="text-xs text-slate-400">
                        {med.type} • {Math.floor(med.duration / 60)}m {med.duration % 60}s
                      </Text>
                      {med.chakra && <Text className="text-xs text-slate-400">{med.chakra}</Text>}
                    </View>
                    <Pressable
                      onPress={() => handleDeleteMeditation(med.id)}
                      className="px-2 py-1 bg-red-900 rounded active:opacity-80"
                    >
                      <Text className="text-xs text-red-200 font-semibold">Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))
            ) : (
              <Text className="text-slate-400 text-center py-4">No meditations yet</Text>
            )}
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
