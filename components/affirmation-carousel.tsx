import React, { useEffect, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { CHAKRAS, getRandomAffirmation } from '@/lib/chakra-affirmations';
import { Chakra } from '@/types';

interface AffirmationCarouselProps {
  autoAdvance?: boolean;
  interval?: number;
}

export function AffirmationCarousel({ autoAdvance = true, interval = 5000 }: AffirmationCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [affirmation, setAffirmation] = useState('');

  const currentChakra = CHAKRAS[currentIndex];

  // Initialize affirmation
  useEffect(() => {
    setAffirmation(getRandomAffirmation(currentChakra));
  }, [currentIndex, currentChakra]);

  // Auto-advance timer
  useEffect(() => {
    if (!autoAdvance) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CHAKRAS.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoAdvance, interval]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + CHAKRAS.length) % CHAKRAS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CHAKRAS.length);
  };

  return (
    <View className="w-full gap-4">
      {/* Affirmation Card */}
      <Animated.View
        entering={FadeIn.duration(300)}
        exiting={FadeOut.duration(300)}
        className="w-full rounded-2xl p-8 items-center justify-center min-h-48"
        style={{
          backgroundColor: currentChakra.color + '20',
          borderColor: currentChakra.color,
          borderWidth: 2,
        }}
      >
        {/* Chakra Name */}
        <Text className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
          {currentChakra.name}
        </Text>

        {/* Affirmation Text */}
        <Text className="text-2xl font-bold text-center text-white leading-relaxed">
          "{affirmation}"
        </Text>

        {/* Chakra Indicator */}
        <View className="mt-6 w-12 h-12 rounded-full" style={{ backgroundColor: currentChakra.color }} />
      </Animated.View>

      {/* Navigation Controls */}
      <View className="flex-row items-center justify-between gap-4">
        {/* Previous Button */}
        <Pressable
          onPress={handlePrevious}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          className="flex-1 bg-slate-800 rounded-lg py-3 items-center border border-slate-700"
        >
          <Text className="text-white font-semibold">← Previous</Text>
        </Pressable>

        {/* Indicator Dots */}
        <View className="flex-row gap-2">
          {CHAKRAS.map((_, index) => (
            <View
              key={index}
              className="w-2 h-2 rounded-full"
              style={{
                backgroundColor: index === currentIndex ? currentChakra.color : '#FFFFFF',
              }}
            />
          ))}
        </View>

        {/* Next Button */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          className="flex-1 bg-slate-800 rounded-lg py-3 items-center border border-slate-700"
        >
          <Text className="text-white font-semibold">Next →</Text>
        </Pressable>
      </View>

      {/* Chakra Progress */}
      <Text className="text-xs text-center text-white">
        {currentIndex + 1} / {CHAKRAS.length}
      </Text>
    </View>
  );
}
