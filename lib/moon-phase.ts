import { MoonPhase, MoonPhaseData } from '@/types';

// Reference date: January 6, 2000 - New Moon
const REFERENCE_DATE = new Date(2000, 0, 6).getTime();
const LUNAR_CYCLE = 29.53058867; // days

export const MOON_PHASES: Record<MoonPhase, { name: string; affirmation: string }> = {
  new_moon: {
    name: 'New Moon',
    affirmation: 'I am ready for new beginnings and fresh starts',
  },
  waxing_crescent: {
    name: 'Waxing Crescent',
    affirmation: 'I am setting intentions and manifesting my dreams',
  },
  first_quarter: {
    name: 'First Quarter',
    affirmation: 'I am taking action and overcoming challenges',
  },
  waxing_gibbous: {
    name: 'Waxing Gibbous',
    affirmation: 'I am refining my goals and trusting the process',
  },
  full_moon: {
    name: 'Full Moon',
    affirmation: 'I am complete, abundant, and radiating my light',
  },
  waning_gibbous: {
    name: 'Waning Gibbous',
    affirmation: 'I am grateful and releasing what no longer serves me',
  },
  last_quarter: {
    name: 'Last Quarter',
    affirmation: 'I am reflecting and preparing for transformation',
  },
  waning_crescent: {
    name: 'Waning Crescent',
    affirmation: 'I am resting and trusting in the cycle of life',
  },
};

export function calculateMoonPhase(date: Date = new Date()): MoonPhaseData {
  const daysSinceReference = (date.getTime() - REFERENCE_DATE) / (1000 * 60 * 60 * 24);
  const dayInCycle = daysSinceReference % LUNAR_CYCLE;
  const illumination = Math.round((dayInCycle / LUNAR_CYCLE) * 100);

  // Determine phase
  let phase: MoonPhase;
  if (dayInCycle < 1.84566) {
    phase = 'new_moon';
  } else if (dayInCycle < 7.38265) {
    phase = 'waxing_crescent';
  } else if (dayInCycle < 9.23825) {
    phase = 'first_quarter';
  } else if (dayInCycle < 14.76524) {
    phase = 'waxing_gibbous';
  } else if (dayInCycle < 16.61083) {
    phase = 'full_moon';
  } else if (dayInCycle < 22.13782) {
    phase = 'waning_gibbous';
  } else if (dayInCycle < 23.98341) {
    phase = 'last_quarter';
  } else {
    phase = 'waning_crescent';
  }

  // Calculate days until next phase
  const nextPhaseDay = getNextPhaseDay(dayInCycle);
  const daysUntilNext = Math.ceil(nextPhaseDay - dayInCycle);

  return {
    phase,
    name: MOON_PHASES[phase].name,
    illumination,
    daysUntilNext,
    affirmation: MOON_PHASES[phase].affirmation,
  };
}

function getNextPhaseDay(dayInCycle: number): number {
  const phaseDays = [1.84566, 7.38265, 9.23825, 14.76524, 16.61083, 22.13782, 23.98341, 29.53058867];

  for (const phaseDay of phaseDays) {
    if (dayInCycle < phaseDay) {
      return phaseDay;
    }
  }

  return 29.53058867; // Return to new moon
}

export function getMoonEmoji(phase: MoonPhase): string {
  const emojiMap: Record<MoonPhase, string> = {
    new_moon: '🌑',
    waxing_crescent: '🌒',
    first_quarter: '🌓',
    waxing_gibbous: '🌔',
    full_moon: '🌕',
    waning_gibbous: '🌖',
    last_quarter: '🌗',
    waning_crescent: '🌘',
  };

  return emojiMap[phase];
}

export function getMoonPhaseForDate(date: Date): MoonPhaseData {
  return calculateMoonPhase(date);
}

export function getUpcomingMoonPhases(startDate: Date = new Date(), count: number = 8): MoonPhaseData[] {
  const phases: MoonPhaseData[] = [];
  let currentDate = new Date(startDate);

  for (let i = 0; i < count; i++) {
    const phaseData = calculateMoonPhase(currentDate);
    phases.push(phaseData);
    // Move to next phase
    currentDate.setDate(currentDate.getDate() + phaseData.daysUntilNext + 1);
  }

  return phases;
}
