// User types
export interface User {
  id: string;
  name: string;
  email: string;
  socialHandles?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
  };
  createdAt: number;
  preferences: {
    theme: 'light' | 'dark';
    notificationsEnabled: boolean;
  };
}

// Mood types
export type MoodType = 'happy' | 'sad' | 'anxious' | 'calm' | 'energetic' | 'neutral' | 'grateful' | 'overwhelmed';

export interface MoodEntry {
  id: string;
  userId: string;
  mood: MoodType;
  intensity: number; // 1-10
  trigger?: string;
  notes?: string;
  timestamp: number;
}

// Self-care types
export type SelfCareCategory = 'water' | 'medication' | 'sleep' | 'sunlight' | 'enjoyable' | 'laughter';

export interface SelfCareEntry {
  id: string;
  userId: string;
  category: SelfCareCategory;
  timestamp: number;
}

// Meditation types
export interface Meditation {
  id: string;
  userId: string;
  title: string;
  duration: number; // seconds, max 420
  fileUri: string;
  type: 'audio' | 'video';
  uploadedAt: number;
  lastPlayedAt?: number;
  isFavorite: boolean;
}

// Chakra types
export type ChakraType = 'root' | 'sacral' | 'solar_plexus' | 'heart' | 'throat' | 'third_eye' | 'crown';

export interface Chakra {
  id: ChakraType;
  name: string;
  color: string;
  affirmations: string[];
}

// Milestone / Badge types
export type BadgeType = 'streak' | 'meditation' | 'selfcare' | 'mood' | 'moon';

export interface Badge {
  id: string;
  userId: string;
  badgeType: BadgeType;
  name: string;
  description: string;
  unlockedAt: number;
  icon: string;
}

// Moon phase types
export type MoonPhase = 'new_moon' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full_moon' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';

export interface MoonPhaseData {
  phase: MoonPhase;
  name: string;
  illumination: number; // 0-100
  daysUntilNext: number;
  affirmation: string;
}
