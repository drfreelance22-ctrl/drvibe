import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, Pressable } from 'react-native';
import Animated, { FadeIn, withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { ScreenContainer } from '@/components/screen-container';
import { calculateMoonPhase, getMoonEmoji, getUpcomingMoonPhases } from '@/lib/moon-phase';
import { MoonPhaseData } from '@/types';

export default function MoonScreen() {
  const [currentPhase, setCurrentPhase] = useState<MoonPhaseData | null>(null);
  const [upcomingPhases, setUpcomingPhases] = useState<MoonPhaseData[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const moonRotation = useSharedValue(0);

  useEffect(() => {
    const phase = calculateMoonPhase(selectedDate);
    setCurrentPhase(phase);

    const upcoming = getUpcomingMoonPhases(selectedDate, 8);
    setUpcomingPhases(upcoming);

    // Animate moon rotation
    moonRotation.value = withTiming((phase.illumination / 100) * 360, {
      duration: 1000,
    });
  }, [selectedDate, moonRotation]);

  const moonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${moonRotation.value}deg` }],
  }));

  const handlePreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  if (!currentPhase) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 items-center justify-center">
          <Text className="text-slate-300">Loading moon phase...</Text>
        </View>
      </ScreenContainer>
    );
  }

  const dateStr = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6 pb-8">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-slate-100">Moon Phase Tracker</Text>
            <Text className="text-sm text-slate-400">Connect with lunar cycles</Text>
          </View>

          {/* Date Navigation */}
          <View className="flex-row items-center justify-between gap-3">
            <Pressable
              onPress={handlePreviousDay}
              className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700"
            >
              <Text className="text-slate-300 font-semibold">← Prev</Text>
            </Pressable>

            <Pressable
              onPress={handleToday}
              className="flex-1 bg-slate-800 rounded-lg py-2 items-center border border-slate-700"
            >
              <Text className="text-slate-300 font-semibold text-sm text-center">{dateStr}</Text>
            </Pressable>

            <Pressable
              onPress={handleNextDay}
              className="bg-slate-800 rounded-lg px-4 py-2 border border-slate-700"
            >
              <Text className="text-slate-300 font-semibold">Next →</Text>
            </Pressable>
          </View>

          {/* Moon Visualization */}
          <Animated.View
            entering={FadeIn.duration(300)}
            className="bg-slate-800 rounded-2xl p-8 items-center justify-center border border-slate-700"
            style={moonAnimatedStyle}
          >
            <Text className="text-9xl">{getMoonEmoji(currentPhase.phase)}</Text>
          </Animated.View>

          {/* Phase Info Card */}
          <View className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 gap-4 border border-indigo-700">
            <View className="gap-2">
              <Text className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
                Current Phase
              </Text>
              <Text className="text-3xl font-bold text-slate-100">{currentPhase.name}</Text>
            </View>

            {/* Illumination */}
            <View className="gap-2">
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-slate-400">Illumination</Text>
                <Text className="text-lg font-bold text-amber-300">{currentPhase.illumination}%</Text>
              </View>
              <View className="h-3 bg-slate-700 rounded-full overflow-hidden">
                <View
                  className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full"
                  style={{ width: `${currentPhase.illumination}%` }}
                />
              </View>
            </View>

            {/* Days Until Next Phase */}
            <View className="bg-slate-800 rounded-lg p-3 flex-row justify-between items-center">
              <Text className="text-sm text-slate-400">Days Until Next Phase</Text>
              <Text className="text-xl font-bold text-violet-300">{currentPhase.daysUntilNext}</Text>
            </View>

            {/* Affirmation */}
            <View className="bg-slate-700 rounded-lg p-4 mt-2">
              <Text className="text-sm text-slate-300 text-center italic">
                "{currentPhase.affirmation}"
              </Text>
            </View>
          </View>

          {/* Upcoming Phases */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              Upcoming Phases
            </Text>
            <View className="gap-2">
              {upcomingPhases.slice(0, 6).map((phase, index) => (
                <View
                  key={index}
                  className="bg-slate-800 rounded-lg p-4 border border-slate-700 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-3 flex-1">
                    <Text className="text-3xl">{getMoonEmoji(phase.phase)}</Text>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-slate-100">{phase.name}</Text>
                      <Text className="text-xs text-slate-500">
                        {phase.illumination}% illuminated
                      </Text>
                    </View>
                  </View>
                  <Text className="text-xs bg-violet-600 text-white px-2 py-1 rounded">
                    +{phase.daysUntilNext}d
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
