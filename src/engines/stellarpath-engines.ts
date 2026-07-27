// ============================================================
// STELLARPATH — Core Calculation Engines
// Numerology, Western Astrology, Chinese Zodiac, Biorhythms
// Pure client-side TypeScript — no external APIs
// ============================================================

// ------------------------------------------------------------------
// TYPES
// ------------------------------------------------------------------
export interface BirthData {
  name: string;
  birthDate: string; // ISO format: YYYY-MM-DD
  birthTime?: string; // HH:MM (24h)
  birthLocation?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface NumerologyProfile {
  lifePath: number;
  lifePathMaster: boolean;
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  luckyNumbers: number[];
}

export interface WesternAstroProfile {
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  risingSign: ZodiacSign;
  element: ElementType;
  modality: ModalityType;
  sunDegree: number;
  moonDegree: number;
}

export interface ChineseZodiacProfile {
  animal: ChineseAnimal;
  element: ChineseElement;
  yinYang: 'Yin' | 'Yang';
  stemBranch: string;
}

export interface BiorhythmData {
  physical: number; // -1 to 1
  emotional: number; // -1 to 1
  intellectual: number; // -1 to 1
  composite: number; // 0 to 100
}

export interface CompatibilityResult {
  westernScore: number;
  numerologyScore: number;
  chineseScore: number;
  compositeScore: number;
  summary: string;
}

export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer'
  | 'Leo' | 'Virgo' | 'Libra' | 'Scorpio'
  | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces';

export type ElementType = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ModalityType = 'Cardinal' | 'Fixed' | 'Mutable';

export type ChineseAnimal =
  | 'Rat' | 'Ox' | 'Tiger' | 'Rabbit' | 'Dragon' | 'Snake'
  | 'Horse' | 'Goat' | 'Monkey' | 'Rooster' | 'Dog' | 'Pig';

export type ChineseElement = 'Wood' | 'Fire' | 'Earth' | 'Metal' | 'Water';

// ------------------------------------------------------------------
// CONSTANTS
// ------------------------------------------------------------------
const ZODIAC_SIGNS: ZodiacSign[] = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ZODIAC_ELEMENTS: Record<ZodiacSign, ElementType> = {
  Aries: 'Fire', Leo: 'Fire', Sagittarius: 'Fire',
  Taurus: 'Earth', Virgo: 'Earth', Capricorn: 'Earth',
  Gemini: 'Air', Libra: 'Air', Aquarius: 'Air',
  Cancer: 'Water', Scorpio: 'Water', Pisces: 'Water'
};

const ZODIAC_MODALITIES: Record<ZodiacSign, ModalityType> = {
  Aries: 'Cardinal', Cancer: 'Cardinal', Libra: 'Cardinal', Capricorn: 'Cardinal',
  Taurus: 'Fixed', Leo: 'Fixed', Scorpio: 'Fixed', Aquarius: 'Fixed',
  Gemini: 'Mutable', Virgo: 'Mutable', Sagittarius: 'Mutable', Pisces: 'Mutable'
};

// Sun enters each sign roughly on these dates (simplified)
const SUN_SIGN_CUTOFFS = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 21];

const CHINESE_ANIMALS: ChineseAnimal[] = [
  'Rat', 'Ox', 'Tiger', 'Rabbit', 'Dragon', 'Snake',
  'Horse', 'Goat', 'Monkey', 'Rooster', 'Dog', 'Pig'
];

const CHINESE_ELEMENTS_CYCLE: ChineseElement[] = [
  'Wood', 'Wood', 'Fire', 'Fire', 'Earth', 'Earth', 'Metal', 'Metal', 'Water', 'Water'
];

const CHINESE_YIN_YANG = ['Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin', 'Yang', 'Yin'];

// Pythagorean letter-to-number mapping
const LETTER_MAP: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u']);

// ------------------------------------------------------------------
// UTILITIES
// ------------------------------------------------------------------
function reduceNumber(n: number, allowMaster = true): { value: number; isMaster: boolean } {
  if (n <= 0) return { value: 1, isMaster: false };
  const masterNumbers = [11, 22, 33];
  if (allowMaster && masterNumbers.includes(n)) {
    return { value: n, isMaster: true };
  }
  while (n > 9) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    if (allowMaster && masterNumbers.includes(n)) {
      return { value: n, isMaster: true };
    }
  }
  return { value: n, isMaster: false };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash);
}

function daysBetween(a: Date, b: Date): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((b.getTime() - a.getTime()) / msPerDay);
}

/**
 * Parse an ISO date (YYYY-MM-DD) as a LOCAL calendar date.
 * `new Date("YYYY-MM-DD")` parses as UTC midnight, which shifts the day
 * back by one in timezones behind UTC — wrong Life Path, signs, biorhythms.
 */
export function parseLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

// ------------------------------------------------------------------
// NUMEROLOGY ENGINE
// ------------------------------------------------------------------
export function calculateNumerology(data: BirthData, referenceDate?: Date): NumerologyProfile {
  const birth = parseLocalDate(data.birthDate);
  const today = referenceDate || new Date();

  const dateDigits = `${birth.getFullYear()}${String(birth.getMonth() + 1).padStart(2, '0')}${String(birth.getDate()).padStart(2, '0')}`;
  const lifePathSum = dateDigits.split('').reduce((s, d) => s + parseInt(d, 10), 0);
  const lifePathResult = reduceNumber(lifePathSum);

  const cleanName = data.name.toLowerCase().replace(/[^a-z]/g, '');
  const expressionSum = cleanName.split('').reduce((s, c) => s + (LETTER_MAP[c] || 0), 0);
  const expressionResult = reduceNumber(expressionSum);

  const vowelsSum = cleanName.split('').filter(c => VOWELS.has(c)).reduce((s, c) => s + (LETTER_MAP[c] || 0), 0);
  const soulUrgeResult = reduceNumber(vowelsSum);

  const consonantsSum = cleanName.split('').filter(c => !VOWELS.has(c) && LETTER_MAP[c]).reduce((s, c) => s + (LETTER_MAP[c] || 0), 0);
  const personalityResult = reduceNumber(consonantsSum);

  const birthdayResult = reduceNumber(birth.getDate());

  const currentYear = today.getFullYear();
  const personalYearSum = birth.getMonth() + 1 + birth.getDate() + currentYear;
  const personalYearResult = reduceNumber(personalYearSum);

  const personalMonthSum = personalYearResult.value + (today.getMonth() + 1);
  const personalMonthResult = reduceNumber(personalMonthSum);

  const personalDaySum = personalMonthResult.value + today.getDate();
  const personalDayResult = reduceNumber(personalDaySum);

  const seed = hashString(`${data.name}${data.birthDate}${today.toISOString().split('T')[0]}`);
  const luckyNumbers = Array.from({ length: 5 }, (_, i) => {
    return ((seed + i * 7 + lifePathResult.value * 13) % 99) + 1;
  });

  return {
    lifePath: lifePathResult.value,
    lifePathMaster: lifePathResult.isMaster,
    expression: expressionResult.value,
    soulUrge: soulUrgeResult.value,
    personality: personalityResult.value,
    birthday: birthdayResult.value,
    personalYear: personalYearResult.value,
    personalMonth: personalMonthResult.value,
    personalDay: personalDayResult.value,
    luckyNumbers
  };
}

// ------------------------------------------------------------------
// WESTERN ASTROLOGY ENGINE
// ------------------------------------------------------------------
export function getSunSign(date: Date): { sign: ZodiacSign; degree: number } {
  const month = date.getMonth();
  const day = date.getDate();
  const cutoff = SUN_SIGN_CUTOFFS[month];
  // Signs run ~21st→20th: from the cutoff date the sign is (month+10)%12,
  // before it the previous sign (month+9)%12. E.g. March 21+ = Aries (0).
  const signIndex = day < cutoff ? (month + 9) % 12 : (month + 10) % 12;
  const sign = ZODIAC_SIGNS[signIndex];
  const daysInSign = day < cutoff
    ? day + (30 - SUN_SIGN_CUTOFFS[(month + 11) % 12])
    : day - cutoff;
  const degree = Math.min(29, Math.max(0, daysInSign));
  return { sign, degree };
}

export function getMoonSign(date: Date, birthTime?: string): { sign: ZodiacSign; degree: number } {
  const referenceNewMoon = new Date('2000-01-06T18:14:00Z');
  const diffMs = date.getTime() - referenceNewMoon.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  let timeOffset = 0;
  if (birthTime) {
    const [h, m] = birthTime.split(':').map(Number);
    timeOffset = (h + m / 60) / 24;
  }

  const moonLongitude = (diffDays + timeOffset) * 13.176396;
  const normalized = ((moonLongitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  const degree = normalized % 30;
  return { sign: ZODIAC_SIGNS[signIndex], degree };
}

export function getRisingSign(date: Date, birthTime: string, timezoneOffsetHours = 0): { sign: ZodiacSign; degree: number } {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

  const T = (jdn - 2451545.0) / 36525;
  let gmst = 280.46061837 + 360.98564736629 * (jdn - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000;
  gmst = ((gmst % 360) + 360) % 360;

  const [h, min] = birthTime.split(':').map(Number);
  const birthDecimal = h + min / 60 + timezoneOffsetHours;
  const lst = (gmst + birthDecimal * 15) % 360;

  const sunLong = (date.getMonth() * 30 + date.getDate()) % 360;
  const ascendant = (lst - sunLong + 360) % 360;
  const signIndex = Math.floor(ascendant / 30);
  const degree = ascendant % 30;
  return { sign: ZODIAC_SIGNS[signIndex], degree };
}

export function calculateWesternAstro(data: BirthData): WesternAstroProfile {
  const birth = parseLocalDate(data.birthDate);
  const sun = getSunSign(birth);
  const moon = getMoonSign(birth, data.birthTime);

  let rising = { sign: 'Aries' as ZodiacSign, degree: 0 };
  if (data.birthTime) {
    rising = getRisingSign(birth, data.birthTime);
  }

  return {
    sunSign: sun.sign,
    moonSign: moon.sign,
    risingSign: rising.sign,
    element: ZODIAC_ELEMENTS[sun.sign],
    modality: ZODIAC_MODALITIES[sun.sign],
    sunDegree: sun.degree,
    moonDegree: moon.degree
  };
}

// ------------------------------------------------------------------
// CHINESE ZODIAC ENGINE
// ------------------------------------------------------------------
export function calculateChineseZodiac(date: Date): ChineseZodiacProfile {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const lunarNewYearApprox = new Date(year, 0, 21 + ((year * 5 + 8) % 19));
  const effectiveYear = (month < lunarNewYearApprox.getMonth() + 1 ||
    (month === lunarNewYearApprox.getMonth() + 1 && day < lunarNewYearApprox.getDate()))
    ? year - 1 : year;

  // Sexagenary cycle is anchored at year 4 AD = Jia-Zi (Wood Rat, index 0).
  // E.g. 1986: stem (1986-4)%10 = 2 → Bing (Fire), branch (1986-4)%12 = 2 → Yin (Tiger).
  const stemIndex = (((effectiveYear - 4) % 10) + 10) % 10;
  const animalIndex = (((effectiveYear - 4) % 12) + 12) % 12;
  const animal = CHINESE_ANIMALS[animalIndex];

  const element = CHINESE_ELEMENTS_CYCLE[stemIndex];
  const yinYang = CHINESE_YIN_YANG[stemIndex] as 'Yin' | 'Yang';

  const stems = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'];
  const branches = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'];
  const stemBranch = `${stems[stemIndex]}${branches[animalIndex]}`;

  return { animal, element, yinYang, stemBranch };
}

// ------------------------------------------------------------------
// BIORHYTHM ENGINE
// ------------------------------------------------------------------
export function calculateBiorhythms(birthDate: string, targetDate?: Date): BiorhythmData {
  const birth = parseLocalDate(birthDate);
  const target = targetDate || new Date();
  const days = daysBetween(birth, target);

  const physical = Math.sin((2 * Math.PI * days) / 23);
  const emotional = Math.sin((2 * Math.PI * days) / 28);
  const intellectual = Math.sin((2 * Math.PI * days) / 33);

  const avg = (physical + emotional + intellectual) / 3;
  const composite = Math.round(((avg + 1) / 2) * 100);

  return { physical, emotional, intellectual, composite };
}

export function getBiorhythmForecast(birthDate: string, startDate?: Date): BiorhythmData[] {
  const start = startDate || new Date();
  const forecast: BiorhythmData[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    forecast.push(calculateBiorhythms(birthDate, d));
  }
  return forecast;
}

// ------------------------------------------------------------------
// COMPATIBILITY ENGINE
// ------------------------------------------------------------------
const WESTERN_COMPAT_MATRIX: Record<ZodiacSign, Record<ZodiacSign, number>> = {
  Aries: { Aries: 70, Taurus: 50, Gemini: 85, Cancer: 45, Leo: 90, Virgo: 50, Libra: 75, Scorpio: 60, Sagittarius: 95, Capricorn: 40, Aquarius: 80, Pisces: 55 },
  Taurus: { Aries: 50, Taurus: 75, Gemini: 45, Cancer: 85, Leo: 55, Virgo: 90, Libra: 60, Scorpio: 80, Sagittarius: 45, Capricorn: 95, Aquarius: 50, Pisces: 85 },
  Gemini: { Aries: 85, Taurus: 45, Gemini: 70, Cancer: 50, Leo: 80, Virgo: 55, Libra: 90, Scorpio: 45, Sagittarius: 85, Capricorn: 50, Aquarius: 95, Pisces: 60 },
  Cancer: { Aries: 45, Taurus: 85, Gemini: 50, Cancer: 75, Leo: 60, Virgo: 80, Libra: 50, Scorpio: 95, Sagittarius: 45, Capricorn: 80, Aquarius: 50, Pisces: 90 },
  Leo: { Aries: 90, Taurus: 55, Gemini: 80, Cancer: 60, Leo: 85, Virgo: 55, Libra: 85, Scorpio: 60, Sagittarius: 90, Capricorn: 50, Aquarius: 75, Pisces: 55 },
  Virgo: { Aries: 50, Taurus: 90, Gemini: 55, Cancer: 80, Leo: 55, Virgo: 75, Libra: 60, Scorpio: 85, Sagittarius: 50, Capricorn: 90, Aquarius: 55, Pisces: 80 },
  Libra: { Aries: 75, Taurus: 60, Gemini: 90, Cancer: 50, Leo: 85, Virgo: 60, Libra: 75, Scorpio: 55, Sagittarius: 80, Capricorn: 55, Aquarius: 90, Pisces: 65 },
  Scorpio: { Aries: 60, Taurus: 80, Gemini: 45, Cancer: 95, Leo: 60, Virgo: 85, Libra: 55, Scorpio: 80, Sagittarius: 50, Capricorn: 75, Aquarius: 55, Pisces: 90 },
  Sagittarius: { Aries: 95, Taurus: 45, Gemini: 85, Cancer: 45, Leo: 90, Virgo: 50, Libra: 80, Scorpio: 50, Sagittarius: 75, Capricorn: 60, Aquarius: 85, Pisces: 55 },
  Capricorn: { Aries: 40, Taurus: 95, Gemini: 50, Cancer: 80, Leo: 50, Virgo: 90, Libra: 55, Scorpio: 75, Sagittarius: 60, Capricorn: 80, Aquarius: 50, Pisces: 85 },
  Aquarius: { Aries: 80, Taurus: 50, Gemini: 95, Cancer: 50, Leo: 75, Virgo: 55, Libra: 90, Scorpio: 55, Sagittarius: 85, Capricorn: 50, Aquarius: 70, Pisces: 60 },
  Pisces: { Aries: 55, Taurus: 85, Gemini: 60, Cancer: 90, Leo: 55, Virgo: 80, Libra: 65, Scorpio: 90, Sagittarius: 55, Capricorn: 85, Aquarius: 60, Pisces: 75 }
};

const CHINESE_COMPAT_MATRIX: Record<ChineseAnimal, Record<ChineseAnimal, number>> = {
  Rat: { Rat: 70, Ox: 90, Tiger: 65, Rabbit: 60, Dragon: 95, Snake: 75, Horse: 50, Goat: 55, Monkey: 85, Rooster: 60, Dog: 70, Pig: 80 },
  Ox: { Rat: 90, Ox: 75, Tiger: 50, Rabbit: 65, Dragon: 60, Snake: 85, Horse: 55, Goat: 45, Monkey: 70, Rooster: 95, Dog: 80, Pig: 65 },
  Tiger: { Rat: 65, Ox: 50, Tiger: 70, Rabbit: 80, Dragon: 75, Snake: 55, Horse: 90, Goat: 70, Monkey: 50, Rooster: 60, Dog: 95, Pig: 75 },
  Rabbit: { Rat: 60, Ox: 65, Tiger: 80, Rabbit: 70, Dragon: 55, Snake: 60, Horse: 75, Goat: 90, Monkey: 65, Rooster: 50, Dog: 85, Pig: 80 },
  Dragon: { Rat: 95, Ox: 60, Tiger: 75, Rabbit: 55, Dragon: 70, Snake: 85, Horse: 65, Goat: 60, Monkey: 90, Rooster: 80, Dog: 50, Pig: 70 },
  Snake: { Rat: 75, Ox: 85, Tiger: 55, Rabbit: 60, Dragon: 85, Snake: 70, Horse: 60, Goat: 75, Monkey: 65, Rooster: 90, Dog: 55, Pig: 50 },
  Horse: { Rat: 50, Ox: 55, Tiger: 90, Rabbit: 75, Dragon: 65, Snake: 60, Horse: 70, Goat: 85, Monkey: 60, Rooster: 70, Dog: 80, Pig: 75 },
  Goat: { Rat: 55, Ox: 45, Tiger: 70, Rabbit: 90, Dragon: 60, Snake: 75, Horse: 85, Goat: 65, Monkey: 70, Rooster: 60, Dog: 75, Pig: 90 },
  Monkey: { Rat: 85, Ox: 70, Tiger: 50, Rabbit: 65, Dragon: 90, Snake: 65, Horse: 60, Goat: 70, Monkey: 70, Rooster: 80, Dog: 75, Pig: 60 },
  Rooster: { Rat: 60, Ox: 95, Tiger: 60, Rabbit: 50, Dragon: 80, Snake: 90, Horse: 70, Goat: 60, Monkey: 80, Rooster: 70, Dog: 65, Pig: 55 },
  Dog: { Rat: 70, Ox: 80, Tiger: 95, Rabbit: 85, Dragon: 50, Snake: 55, Horse: 80, Goat: 75, Monkey: 75, Rooster: 65, Dog: 70, Pig: 65 },
  Pig: { Rat: 80, Ox: 65, Tiger: 75, Rabbit: 80, Dragon: 70, Snake: 50, Horse: 75, Goat: 90, Monkey: 60, Rooster: 55, Dog: 65, Pig: 70 }
};

const NUMEROLOGY_COMPAT: Record<number, Record<number, number>> = {
  1: { 1: 70, 2: 55, 3: 80, 4: 50, 5: 90, 6: 60, 7: 75, 8: 65, 9: 85, 11: 80, 22: 60, 33: 55 },
  2: { 1: 55, 2: 75, 3: 65, 4: 85, 5: 50, 6: 95, 7: 60, 8: 80, 9: 70, 11: 65, 22: 90, 33: 85 },
  3: { 1: 80, 2: 65, 3: 70, 4: 55, 5: 75, 6: 80, 7: 50, 8: 60, 9: 90, 11: 85, 22: 55, 33: 75 },
  4: { 1: 50, 2: 85, 3: 55, 4: 70, 5: 60, 6: 75, 7: 90, 8: 95, 9: 65, 11: 55, 22: 80, 33: 70 },
  5: { 1: 90, 2: 50, 3: 75, 4: 60, 5: 65, 6: 55, 7: 80, 8: 70, 9: 85, 11: 90, 22: 50, 33: 60 },
  6: { 1: 60, 2: 95, 3: 80, 4: 75, 5: 55, 6: 70, 7: 65, 8: 85, 9: 90, 11: 75, 22: 95, 33: 80 },
  7: { 1: 75, 2: 60, 3: 50, 4: 90, 5: 80, 6: 65, 7: 70, 8: 55, 9: 75, 11: 85, 22: 65, 33: 90 },
  8: { 1: 65, 2: 80, 3: 60, 4: 95, 5: 70, 6: 85, 7: 55, 8: 75, 9: 80, 11: 60, 22: 90, 33: 65 },
  9: { 1: 85, 2: 70, 3: 90, 4: 65, 5: 85, 6: 90, 7: 75, 8: 80, 9: 70, 11: 80, 22: 75, 33: 85 },
  11: { 1: 80, 2: 65, 3: 85, 4: 55, 5: 90, 6: 75, 7: 85, 8: 60, 9: 80, 11: 70, 22: 65, 33: 90 },
  22: { 1: 60, 2: 90, 3: 55, 4: 80, 5: 50, 6: 95, 7: 65, 8: 90, 9: 75, 11: 65, 22: 70, 33: 80 },
  33: { 1: 55, 2: 85, 3: 75, 4: 70, 5: 60, 6: 80, 7: 90, 8: 65, 9: 85, 11: 90, 22: 80, 33: 65 }
};

export function calculateCompatibility(a: BirthData, b: BirthData): CompatibilityResult {
  const birthA = parseLocalDate(a.birthDate);
  const birthB = parseLocalDate(b.birthDate);

  const sunA = getSunSign(birthA).sign;
  const sunB = getSunSign(birthB).sign;
  const westernScore = WESTERN_COMPAT_MATRIX[sunA][sunB];

  const elemA = ZODIAC_ELEMENTS[sunA];
  const elemB = ZODIAC_ELEMENTS[sunB];
  let elementBonus = 0;
  if (elemA === elemB) elementBonus = 5;
  else if (
    (elemA === 'Fire' && elemB === 'Air') || (elemA === 'Air' && elemB === 'Fire') ||
    (elemA === 'Earth' && elemB === 'Water') || (elemA === 'Water' && elemB === 'Earth')
  ) elementBonus = 3;

  const numA = calculateNumerology(a);
  const numB = calculateNumerology(b);
  const numerologyScore = NUMEROLOGY_COMPAT[numA.lifePath]?.[numB.lifePath] ?? 60;

  const chineseA = calculateChineseZodiac(birthA);
  const chineseB = calculateChineseZodiac(birthB);
  const chineseScore = CHINESE_COMPAT_MATRIX[chineseA.animal][chineseB.animal];

  const compositeScore = Math.round(
    (westernScore + elementBonus) * 0.35 +
    numerologyScore * 0.35 +
    chineseScore * 0.30
  );
  const clamped = Math.min(99, Math.max(1, compositeScore));

  let summary = '';
  if (clamped >= 85) summary = 'Highly compatible — strong natural harmony across multiple dimensions.';
  else if (clamped >= 70) summary = 'Good compatibility — shared energies support growth and understanding.';
  else if (clamped >= 55) summary = 'Moderate compatibility — differences exist but can be bridged with effort.';
  else if (clamped >= 40) summary = 'Challenging compatibility — contrasting styles may require patience.';
  else summary = 'Low compatibility — fundamental differences in approach and energy.';

  return {
    westernScore: Math.min(99, westernScore + elementBonus),
    numerologyScore,
    chineseScore,
    compositeScore: clamped,
    summary
  };
}

// ------------------------------------------------------------------
// DAILY ENERGY & FORECAST
// ------------------------------------------------------------------
export interface DailyEnergy {
  date: string;
  biorhythm: BiorhythmData;
  personalYear: number;
  personalMonth: number;
  personalDay: number;
  energyScore: number;
  color: string;
  affirmation: string;
  luckyNumbers: number[];
}

const AFFIRMATIONS = [
  "Today, I trust the process and embrace what unfolds.",
  "My energy is a magnet for positive experiences.",
  "I am aligned with my highest purpose.",
  "Every challenge is an opportunity in disguise.",
  "I radiate confidence, clarity, and calm.",
  "My intuition guides me toward the right path.",
  "I am grateful for the abundance surrounding me.",
  "Today, I choose courage over comfort.",
  "My potential is limitless, and I am ready.",
  "I release what no longer serves me."
];

function getEnergyColor(score: number): string {
  if (score >= 80) return '#10B981';
  if (score >= 60) return '#3B82F6';
  if (score >= 40) return '#F59E0B';
  if (score >= 20) return '#F97316';
  return '#EF4444';
}

export function getDailyEnergy(data: BirthData, targetDate?: Date): DailyEnergy {
  const today = targetDate || new Date();
  const dateStr = today.toISOString().split('T')[0];

  const bio = calculateBiorhythms(data.birthDate, today);
  const num = calculateNumerology(data, today);

  const numerologyFlow = (num.personalDay + num.personalMonth + num.personalYear) / 27;
  const energyScore = Math.round(bio.composite * 0.7 + numerologyFlow * 30);

  const affIndex = hashString(dateStr + data.name) % AFFIRMATIONS.length;
  const affirmation = AFFIRMATIONS[affIndex];

  return {
    date: dateStr,
    biorhythm: bio,
    personalYear: num.personalYear,
    personalMonth: num.personalMonth,
    personalDay: num.personalDay,
    energyScore: Math.min(100, Math.max(0, energyScore)),
    color: getEnergyColor(energyScore),
    affirmation,
    luckyNumbers: num.luckyNumbers
  };
}

export function getEnergyForecast(data: BirthData, startDate?: Date): DailyEnergy[] {
  const start = startDate || new Date();
  const forecast: DailyEnergy[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    forecast.push(getDailyEnergy(data, d));
  }
  return forecast;
}

export const StellarPathEngines = {
  numerology: calculateNumerology,
  westernAstro: calculateWesternAstro,
  chineseZodiac: calculateChineseZodiac,
  biorhythm: calculateBiorhythms,
  biorhythmForecast: getBiorhythmForecast,
  compatibility: calculateCompatibility,
  dailyEnergy: getDailyEnergy,
  energyForecast: getEnergyForecast,
  getSunSign,
  getMoonSign,
  getRisingSign,
  reduceNumber
};

export default StellarPathEngines;
