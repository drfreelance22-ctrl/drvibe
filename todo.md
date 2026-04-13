# Project TODO

## Core Features

### Registration & Onboarding
- [x] Create onboarding screen with name, email, social handles input
- [x] Implement user data persistence to AsyncStorage
- [x] Add welcome animation and transitions

### Home Dashboard
- [x] Create home screen layout with greeting
- [x] Build chakra affirmation carousel component
- [x] Implement auto-advance carousel (5 second interval)
- [x] Add quick-access navigation buttons
- [x] Display today's self-care summary
- [x] Show current moon phase indicator

### Mood & Trigger Tracking
- [x] Create mood tracking screen
- [x] Build mood selector (emoji grid)
- [x] Add intensity slider (1-10)
- [x] Implement trigger input with suggestions
- [x] Build mood history view
- [x] Store mood entries to AsyncStorage

### Self-Care Tracking
- [x] Create self-care tracking screen
- [x] Build 6 self-care category buttons (Water, Medication, Sleep, Sunlight, Enjoyable, Laughter)
- [x] Implement animated progress bar (golden energy pour)
- [x] Display daily goal counter (e.g., 3/6)
- [x] Store self-care entries to AsyncStorage
- [x] Build self-care history view

### Moon Phase Tracker
- [x] Create moon phase tracking screen
- [x] Implement moon phase calculation algorithm
- [x] Build animated moon visualization
- [x] Display current phase name and percentage
- [x] Show days until next phase
- [x] Build monthly calendar with phase markers
- [x] Display phase-based affirmations

### Meditation Library
- [x] Create meditation upload screen
- [x] Implement file picker (audio and video, max 7 minutes)
- [x] Build meditation list view
- [x] Create audio/video playback component
- [x] Add playback controls (play, pause, progress)
- [x] Implement favorite/bookmark functionality
- [x] Store meditation metadata to AsyncStorage

### Chakra Affirmations
- [x] Create affirmation database (7 chakras × multiple affirmations)
- [x] Build carousel component with auto-advance
- [x] Implement swipe/tap navigation
- [x] Add chakra color indicators
- [x] Implement smooth slide transitions

### Rewards & Milestones
- [x] Create rewards screen
- [x] Define milestone types (7-day streak, meditation count, self-care goals)
- [x] Implement badge tracking logic
- [x] Build badge display component
- [x] Add unlock animations (confetti, scale-up)
- [x] Store achievements to AsyncStorage

### Navigation & Routing
- [x] Set up tab-based navigation (Home, Mood, Self-Care, Moon, Meditate, Rewards, Settings)
- [x] Implement smooth transitions between screens
- [x] Add back/forward navigation

### Settings
- [ ] Create settings screen
- [ ] Implement theme toggle (light/dark mode)
- [ ] Add notification preferences
- [ ] Build profile edit screen
- [ ] Add about, privacy, terms sections

## UI/UX Polish

### Colors & Branding
- [x] Generate custom app logo and icon
- [x] Update app.config.ts with branding info
- [x] Implement color palette (Violet, Rose, Amber, Dark, etc.)
- [x] Apply colors to all screens consistently

### Animations & Transitions
- [x] Add button press animations (scale, haptic)
- [x] Implement smooth page transitions (slide-in/out)
- [x] Add carousel auto-advance animations
- [x] Build golden energy pour animation for self-care
- [x] Add confetti/sparkle animations for achievements
- [x] Implement skeleton loading states

### Typography & Fonts
- [ ] Load Poppins font (display)
- [ ] Load Inter font (body)
- [ ] Apply font sizes consistently
- [ ] Ensure proper line heights and spacing

### Responsive Design
- [ ] Test on various screen sizes
- [ ] Ensure one-handed usage comfort
- [ ] Verify safe area handling (notch, home indicator)
- [ ] Test dark mode on all screens

## Testing & Quality

- [ ] End-to-end flow testing (registration → affirmation → tracking → rewards)
- [ ] Test all button interactions and navigation
- [ ] Verify data persistence across app restarts
- [ ] Test animations for smoothness (60fps)
- [ ] Test on iOS and Android
- [ ] Verify accessibility (touch targets, contrast, labels)

## Deployment

- [ ] Create checkpoint before first delivery
- [ ] Generate APK/IPA builds
- [ ] Test on real devices
- [ ] Prepare for app store submission
