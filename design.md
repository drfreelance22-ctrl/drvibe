# Metaphysical Wellness App - Design Plan

## Overview

The Metaphysical Wellness App is a mobile application designed to support mental health, spiritual growth, and holistic well-being through mood tracking, self-care logging, moon phase awareness, chakra-based affirmations, and meditation. The app emphasizes dynamic animations, bold colors, and a friendly modern aesthetic to create an uplifting user experience.

---

## Design Principles

- **Mobile-First**: Optimized for portrait orientation (9:16) with one-handed usage in mind
- **Apple HIG Compliant**: Designed to feel like a first-party iOS app with smooth transitions and intuitive interactions
- **Spiritual & Uplifting**: Bold, vibrant colors paired with calming animations to support mental wellness
- **Accessible**: Clear typography, sufficient contrast, and intuitive navigation
- **Performant**: Smooth animations and transitions without lag

---

## Color Palette

| Color | Hex | Purpose |
|-------|-----|---------|
| **Primary (Violet)** | `#7C3AED` | Main accent, buttons, highlights |
| **Secondary (Rose)** | `#EC4899` | Affirmations, energy highlights |
| **Tertiary (Amber)** | `#F59E0B` | Golden energy, progress indicators |
| **Background (Dark)** | `#0F172A` | Primary background (dark mode) |
| **Surface (Slate)** | `#1E293B` | Cards, containers |
| **Text (Light)** | `#F1F5F9` | Primary text |
| **Muted (Gray)** | `#94A3B8` | Secondary text, borders |
| **Success (Green)** | `#10B981` | Achievements, completed tasks |

---

## Typography

- **Display Font**: Poppins (bold, modern, friendly)
- **Body Font**: Inter (clean, readable, modern)
- **Sizes**:
  - Display: 32px (bold)
  - Heading 1: 24px (bold)
  - Heading 2: 18px (semibold)
  - Body: 16px (regular)
  - Caption: 12px (regular)

---

## Screen List

### 1. **Onboarding / Registration Screen**
- **Purpose**: Collect user information at first launch
- **Content**:
  - Welcome message with app branding
  - Name input field
  - Email input field
  - Social handles input (Instagram, Twitter, TikTok) — optional
  - "Get Started" button
- **Functionality**: Save user data to local storage / backend
- **Transitions**: Fade-in animation on load, slide-up for form fields

### 2. **Home Dashboard**
- **Purpose**: Central hub showing daily affirmations, quick access to features, and status overview
- **Content**:
  - Greeting with user name
  - Rotating chakra affirmation carousel (auto-advance every 5 seconds)
  - Quick-access buttons: Mood, Triggers, Self-Care, Moon, Meditate
  - Today's self-care summary (visual progress bar)
  - Current moon phase display (small icon)
- **Functionality**: Navigate to all major features, display affirmations
- **Transitions**: Smooth carousel transitions, scale animations on button press

### 3. **Mood & Trigger Tracking**
- **Purpose**: Log daily moods and identify triggers
- **Content**:
  - Mood selector (emoji/icon grid: Happy, Sad, Anxious, Calm, Energetic, etc.)
  - Intensity slider (1-10)
  - Trigger input (text field with suggestions)
  - Save button
  - History view (list of past entries with date/time)
- **Functionality**: Store mood entries, display history, filter by date
- **Transitions**: Slide-up from bottom for mood selector, fade-in for history

### 4. **Self-Care Tracking**
- **Purpose**: Log self-care activities and visualize progress
- **Content**:
  - Self-care categories (Water, Medication, Sleep, Sunlight, Enjoyable Activity, Laughter)
  - Quick-tap buttons for each category
  - Animated progress bar (golden energy pour animation)
  - Daily goal display (e.g., "3/6 completed")
  - History view
- **Functionality**: Track self-care activities, update progress bar, store data
- **Transitions**: Bounce animation on button tap, smooth bar fill animation

### 5. **Moon Phase Tracker**
- **Purpose**: Display current moon phase and upcoming cycles
- **Content**:
  - Large animated moon visualization
  - Current phase name (New Moon, Waxing Crescent, etc.)
  - Phase percentage (0-100%)
  - Days until next phase
  - Monthly calendar view with phase markers
  - Affirmations tied to current phase
- **Functionality**: Calculate moon phase from date, display upcoming phases
- **Transitions**: Smooth moon rotation, fade-in for phase info

### 6. **Meditation Library**
- **Purpose**: Upload, store, and play meditation audio/video
- **Content**:
  - Upload button (audio or video, up to 7 minutes)
  - List of uploaded meditations with thumbnails
  - Playback controls (play, pause, progress bar)
  - Duration display
  - Favorite/bookmark option
- **Functionality**: Upload files, play audio/video, track listening history
- **Transitions**: Slide-in for meditation list, fade-in for player

### 7. **Chakra Affirmations Carousel**
- **Purpose**: Rotating display of chakra-based affirmations
- **Content**:
  - Affirmation text (centered, large)
  - Chakra color indicator (background color changes per chakra)
  - Chakra name (Root, Sacral, Solar Plexus, Heart, Throat, Third Eye, Crown)
  - Auto-advance every 5 seconds
  - Manual swipe/tap navigation
- **Functionality**: Display affirmations, auto-rotate, respond to swipe gestures
- **Transitions**: Smooth slide transitions between affirmations

### 8. **Rewards & Milestones**
- **Purpose**: Celebrate achievements and motivate continued engagement
- **Content**:
  - Badge display (e.g., "7-Day Streak", "Meditation Master")
  - Progress toward next milestone
  - Reward points / energy counter
  - Achievement history
  - Unlock animations when badges earned
- **Functionality**: Track milestones, award badges, display unlock animations
- **Transitions**: Confetti animation on unlock, scale-up for badge reveal

### 9. **Settings**
- **Purpose**: User preferences and app configuration
- **Content**:
  - Theme toggle (light/dark mode)
  - Notification preferences
  - Edit profile (name, email, social handles)
  - About app
  - Privacy policy / Terms
- **Functionality**: Save preferences, update user info
- **Transitions**: Slide-in for settings panel

---

## Key User Flows

### Flow 1: First-Time User Registration
1. User launches app → Onboarding screen appears
2. User enters name, email, and optional social handles
3. User taps "Get Started"
4. Data saved to local storage
5. App navigates to Home Dashboard
6. First affirmation carousel displays

### Flow 2: Daily Mood & Trigger Logging
1. User taps "Mood" button on Home Dashboard
2. Mood Tracker screen slides up
3. User selects mood emoji and intensity
4. User enters trigger (optional)
5. User taps "Save"
6. Entry saved, screen dismisses
7. User returns to Home Dashboard

### Flow 3: Self-Care Progress Tracking
1. User taps "Self-Care" button on Home Dashboard
2. Self-Care screen displays with 6 categories
3. User taps "Drink Water" button
4. Button animates, progress bar fills (golden energy pour)
5. Daily progress updates (e.g., "1/6 completed")
6. User continues tapping other categories throughout day
7. When all 6 completed, reward animation triggers

### Flow 4: Meditation Upload & Playback
1. User taps "Meditate" button on Home Dashboard
2. Meditation Library screen displays
3. User taps "Upload" button
4. File picker opens (audio or video)
5. User selects file (max 7 minutes)
6. File uploads and appears in library
7. User taps meditation to play
8. Playback screen displays with controls
9. User can pause, resume, or skip

### Flow 5: Moon Phase Awareness
1. User taps "Moon" button on Home Dashboard
2. Moon Phase Tracker screen displays
3. Large moon visualization shows current phase
4. Affirmation tied to current phase displays
5. User can swipe to see upcoming phases
6. User can view monthly calendar

---

## Animation & Transition Strategy

### Micro-Interactions
- **Button Press**: Scale 0.95, haptic feedback (light)
- **List Item Tap**: Opacity 0.7, slight scale
- **Toggle/Switch**: Bounce animation (spring)
- **Completion**: Confetti or sparkle animation

### Page Transitions
- **Navigation**: Slide-in from right (forward), slide-out to right (back)
- **Modal/Sheet**: Slide-up from bottom with ease-out timing
- **Carousel**: Smooth horizontal scroll with momentum

### Loading States
- **Skeleton Screens**: Pulse animation on placeholder cards
- **Progress Indicators**: Animated circular spinner or linear progress bar

### Affirmation Carousel
- **Auto-Advance**: Fade-out current, fade-in next (500ms duration)
- **Manual Swipe**: Snap to nearest slide with spring animation

### Golden Energy Pour Animation
- **Self-Care Progress**: Animated bar fill with golden gradient, particle effect (upward motion)
- **Trigger**: On button tap, fill animates from 0% to new value over 600ms

---

## Data Models

### User
```
{
  id: string (UUID)
  name: string
  email: string
  socialHandles?: {
    instagram?: string
    twitter?: string
    tiktok?: string
  }
  createdAt: timestamp
  preferences: {
    theme: 'light' | 'dark'
    notificationsEnabled: boolean
  }
}
```

### Mood Entry
```
{
  id: string (UUID)
  userId: string
  mood: 'happy' | 'sad' | 'anxious' | 'calm' | 'energetic' | 'neutral'
  intensity: number (1-10)
  trigger?: string
  notes?: string
  timestamp: timestamp
}
```

### Self-Care Entry
```
{
  id: string (UUID)
  userId: string
  category: 'water' | 'medication' | 'sleep' | 'sunlight' | 'enjoyable' | 'laughter'
  timestamp: timestamp
}
```

### Meditation
```
{
  id: string (UUID)
  userId: string
  title: string
  duration: number (seconds, max 420)
  fileUri: string (local or cloud storage)
  type: 'audio' | 'video'
  uploadedAt: timestamp
  lastPlayedAt?: timestamp
  isFavorite: boolean
}
```

### Milestone / Badge
```
{
  id: string (UUID)
  userId: string
  badgeType: 'streak' | 'meditation' | 'selfcare' | 'mood'
  name: string (e.g., "7-Day Streak")
  description: string
  unlockedAt: timestamp
  icon: string (emoji or icon name)
}
```

---

## Technical Considerations

- **State Management**: React Context + AsyncStorage for local persistence
- **Animations**: React Native Reanimated 4.x for smooth 60fps animations
- **Audio/Video**: expo-audio and expo-video for media playback
- **File Upload**: expo-document-picker for file selection, local storage or backend upload
- **Moon Phase Calculation**: Astronomical algorithm or third-party library
- **Notifications**: expo-notifications for reminders and milestones

---

## Accessibility

- Minimum font size: 12px (captions), 16px (body)
- Color contrast ratio: WCAG AA (4.5:1 for text)
- Touch targets: Minimum 44x44pt for interactive elements
- Haptic feedback: Enabled for all primary interactions
- Screen reader support: Semantic labels on all interactive elements

---

## Success Metrics

- User completes registration and views first affirmation
- User logs at least one mood entry
- User completes one self-care activity
- User uploads a meditation
- User views moon phase information
- User unlocks first badge/milestone
