import { useMemo } from 'react';
import type { BirthData, DailyEnergy } from '../engines/stellarpath-engines';
import { getDailyEnergy, getEnergyForecast } from '../engines/stellarpath-engines';

export function useEnergyForecast(profile: BirthData | null): {
  today: DailyEnergy | null;
  week: DailyEnergy[];
} {
  return useMemo(() => {
    if (!profile) return { today: null, week: [] };
    return {
      today: getDailyEnergy(profile),
      week: getEnergyForecast(profile),
    };
  }, [profile]);
}
