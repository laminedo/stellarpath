import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ZodiacSign, ChineseAnimal } from '../engines/stellarpath-engines';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const CHINESE_ANIMAL_EMOJI: Record<ChineseAnimal, string> = {
  Rat: '🐀', Ox: '🐂', Tiger: '🐅', Rabbit: '🐇', Dragon: '🐉', Snake: '🐍',
  Horse: '🐎', Goat: '🐐', Monkey: '🐒', Rooster: '🐓', Dog: '🐕', Pig: '🐖',
};

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((w) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function formatDate(iso: string): string {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function elementColor(element: string): string {
  switch (element) {
    case 'Fire': return '#f97316';
    case 'Earth': return '#84cc16';
    case 'Air': return '#fbbf24';
    case 'Water': return '#3b82f6';
    default: return '#8b5cf6';
  }
}
