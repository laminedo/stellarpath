import { useProfiles } from '../context/ProfileContext';

export function useActiveProfile() {
  const { activeProfile, setActiveProfile, profiles } = useProfiles();
  return { activeProfile, setActiveProfile, profiles };
}
