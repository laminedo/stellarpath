import React, { createContext, useContext, useMemo } from 'react';
import type { BirthData } from '../engines/stellarpath-engines';
import { useLocalStorage } from '../hooks/useLocalStorage';

export interface ProfileContextType {
  profiles: BirthData[];
  activeProfile: BirthData | null;
  addProfile: (p: BirthData) => void;
  removeProfile: (index: number) => void;
  updateProfile: (index: number, p: BirthData) => void;
  setActiveProfile: (p: BirthData | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profiles, setProfiles] = useLocalStorage<BirthData[]>('stellarpath_profiles', []);
  const [active, setActive] = useLocalStorage<BirthData | null>('stellarpath_active', null);

  const value = useMemo<ProfileContextType>(
    () => ({
      profiles,
      activeProfile: active,
      addProfile: (p) => {
        setProfiles((prev) => [...prev, p]);
        if (!active) setActive(p);
      },
      removeProfile: (index) => {
        setProfiles((prev) => {
          const removed = prev[index];
          const next = prev.filter((_, i) => i !== index);
          if (removed && active && removed.name === active.name && removed.birthDate === active.birthDate) {
            setActive(next[0] ?? null);
          }
          return next;
        });
      },
      updateProfile: (index, p) => {
        setProfiles((prev) => prev.map((item, i) => (i === index ? p : item)));
        if (active) setActive(p);
      },
      setActiveProfile: (p) => setActive(p),
    }),
    [profiles, active, setProfiles, setActive]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfiles(): ProfileContextType {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error('useProfiles must be used within ProfileProvider');
  return ctx;
}
