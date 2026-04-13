import { Chakra } from '@/types';

export const CHAKRAS: Chakra[] = [
  {
    id: 'root',
    name: 'Root Chakra',
    color: '#DC2626',
    affirmations: [
      'I am grounded and safe',
      'I trust in my foundation',
      'I am connected to the earth',
      'I feel secure and stable',
      'My roots run deep',
      'I belong here',
      'I am worthy of abundance',
    ],
  },
  {
    id: 'sacral',
    name: 'Sacral Chakra',
    color: '#FB923C',
    affirmations: [
      'I embrace my creativity',
      'I flow with life\'s energy',
      'I am sensual and alive',
      'My passion fuels my purpose',
      'I am open to pleasure and joy',
      'I create with ease',
      'I honor my desires',
    ],
  },
  {
    id: 'solar_plexus',
    name: 'Solar Plexus Chakra',
    color: '#FBBF24',
    affirmations: [
      'I am powerful and confident',
      'I own my personal power',
      'I radiate inner strength',
      'I am worthy of success',
      'My will is strong',
      'I manifest my dreams',
      'I shine my light brightly',
    ],
  },
  {
    id: 'heart',
    name: 'Heart Chakra',
    color: '#10B981',
    affirmations: [
      'I am love',
      'My heart is open and free',
      'I give and receive love freely',
      'I am compassionate and kind',
      'I forgive myself and others',
      'Love flows through me',
      'I am worthy of love',
    ],
  },
  {
    id: 'throat',
    name: 'Throat Chakra',
    color: '#06B6D4',
    affirmations: [
      'I speak my truth',
      'My voice matters',
      'I express myself authentically',
      'I communicate with clarity',
      'I am heard and understood',
      'My words create reality',
      'I speak with love and power',
    ],
  },
  {
    id: 'third_eye',
    name: 'Third Eye Chakra',
    color: '#8B5CF6',
    affirmations: [
      'I trust my intuition',
      'I see with clarity',
      'My inner wisdom guides me',
      'I am connected to the divine',
      'I trust my inner vision',
      'I see the truth',
      'My intuition is my guide',
    ],
  },
  {
    id: 'crown',
    name: 'Crown Chakra',
    color: '#A78BFA',
    affirmations: [
      'I am one with the universe',
      'I am spiritually aligned',
      'I am connected to all',
      'I trust the divine plan',
      'I am enlightened',
      'I am infinite consciousness',
      'I am at peace',
    ],
  },
];

export function getChakraByIndex(index: number): Chakra {
  return CHAKRAS[index % CHAKRAS.length];
}

export function getRandomAffirmation(chakra: Chakra): string {
  return chakra.affirmations[Math.floor(Math.random() * chakra.affirmations.length)];
}

export function getAffirmationForChakra(chakraId: string): string {
  const chakra = CHAKRAS.find((c) => c.id === chakraId);
  if (!chakra) return 'I am at peace';
  return getRandomAffirmation(chakra);
}
